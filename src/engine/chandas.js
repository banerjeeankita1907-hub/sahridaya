const LONG_VOWELS = new Set(["ā", "ī", "ū", "ṝ", "e", "o", "ai", "au", "ḹ"]);
const IAST_VOWELS = ["ai", "au", "ā", "ī", "ū", "ṝ", "ḹ", "e", "o", "a", "i", "u", "ṛ", "ḷ"];
const IAST_CONSONANT = /[bcdfghjklmnpqrstvwxyzṅñṭḍṇśṣḻ]/u;

function normalizePada(input) {
  if (typeof input !== "string") {
    throw new TypeError("Each pāda must be a string");
  }
  const normalized = input.normalize("NFC").toLowerCase();
  if (/[\u0900-\u097f]/u.test(normalized)) {
    throw new TypeError("The prosody scanner currently accepts IAST transliteration, not Devanāgarī");
  }
  // Punctuation and whitespace do not form syllables; retain anusvāra/visarga.
  return normalized
    .replace(/[|।॥,;:!?'"“”‘’()[\]{}]/gu, " ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .join("");
}

function findNuclei(text) {
  const nuclei = [];
  let index = 0;
  while (index < text.length) {
    const vowel = IAST_VOWELS.find(candidate => text.startsWith(candidate, index));
    if (vowel) {
      nuclei.push({ start: index, end: index + vowel.length, vowel });
      index += vowel.length;
    } else {
      index += text.codePointAt(index) > 0xffff ? 2 : 1;
    }
  }
  return nuclei;
}

function countConsonants(text) {
  return [...text].filter(character => IAST_CONSONANT.test(character)).length;
}

/**
 * Perform an explicitly heuristic IAST syllable-weight scan for one pāda.
 * This reports vowel length and positional weight only; it is not a metre parser.
 */
export function scanPada(input) {
  const text = normalizePada(input);
  const nuclei = findNuclei(text);
  if (nuclei.length === 0) {
    return {
      input,
      syllableCount: 0,
      pattern: "",
      syllables: [],
      warnings: ["No IAST vowel nucleus was found."],
    };
  }

  const syllables = nuclei.map((nucleus, index) => {
    const next = nuclei[index + 1];
    const onsetStart = index === 0 ? 0 : nuclei[index - 1].end;
    const codaEnd = next ? next.start : text.length;
    const onset = text.slice(onsetStart, nucleus.start);
    const coda = text.slice(nucleus.end, codaEnd);
    const isPadaFinal = index === nuclei.length - 1;
    const hasAnusvaraOrVisarga = /[ṃḥ]/u.test(coda);
    const consonantCount = countConsonants(coda);

    let weight;
    let reason;
    if (LONG_VOWELS.has(nucleus.vowel)) {
      weight = "G";
      reason = "long-vowel";
    } else if (hasAnusvaraOrVisarga) {
      weight = "G";
      reason = "anusvara-or-visarga";
    } else if (consonantCount >= 2) {
      weight = "G";
      reason = "consonant-cluster";
    } else if (isPadaFinal && coda.length > 0) {
      weight = "G";
      reason = "pada-final-closed-syllable";
    } else if (isPadaFinal) {
      weight = "X";
      reason = "pada-final-anceps";
    } else {
      weight = "L";
      reason = "short-vowel-open-or-single-consonant";
    }

    return {
      index: index + 1,
      text: text.slice(onsetStart, nucleus.end),
      onset,
      vowel: nucleus.vowel,
      coda,
      weight,
      reason,
    };
  });

  return {
    input,
    normalized: text,
    syllableCount: syllables.length,
    pattern: syllables.map(syllable => syllable.weight).join(""),
    syllables,
    warnings: [
      "Heuristic IAST scan only: no morphological analysis, sandhi resolution or full chandas classification is performed.",
      "A pāda-final short open syllable is marked X (anceps); verify prosodic context manually.",
    ],
  };
}

/**
 * Split a verse into pādas using newlines, vertical bars or Sanskrit daṇḍa
 * punctuation, then scan each pāda independently.
 */
export function scanVerse(input) {
  if (typeof input !== "string" || !input.trim()) {
    throw new TypeError("Verse text must be a non-empty string");
  }
  const padas = input
    .normalize("NFC")
    .split(/\n+|[|।॥]+/u)
    .map(part => part.trim())
    .filter(Boolean);
  if (padas.length === 0 || padas.length > 8) {
    throw new RangeError("A verse must contain between 1 and 8 non-empty pādas");
  }

  const scans = padas.map(scanPada);
  const allOctosyllabic = scans.length === 4 && scans.every(scan => scan.syllableCount === 8);
  return {
    padaCount: scans.length,
    padas: scans,
    candidateNote: allOctosyllabic
      ? "All four pādas contain eight syllables. This is a count-based anuṣṭubh candidate only; metrical rules and textual scansion are not verified."
      : "No metre is assigned. Review the pāda patterns and consult a specialist edition.",
    method: "IAST vowel length and limited positional-weight heuristic",
  };
}
