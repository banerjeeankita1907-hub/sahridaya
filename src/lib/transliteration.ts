const DEVANAGARI_TO_IAST: Record<string, string> = {
  'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū',
  'ऋ': 'ṛ', 'ॠ': 'ṝ', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'ṅa',
  'च': 'ca', 'छ': 'cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'ña',
  'ट': 'ṭa', 'ठ': 'ṭha', 'ड': 'ḍa', 'ढ': 'ḍha', 'ण': 'ṇa',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'śa', 'ष': 'ṣa', 'स': 'sa', 'ह': 'ha',
  'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū',
  'ृ': 'ṛ', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ं': 'ṃ', 'ः': 'ḥ', 'ँ': 'm̐', '्': '',
  'ऽ': "'",
};

const IAST_TO_DEVANAGARI: Record<string, string> = {
  'ā': 'ा', 'ī': 'ी', 'ū': 'ू', 'ṛ': 'ृ', 'ṝ': 'ॄ',
  'e': 'े', 'ai': 'ै', 'o': 'ो', 'au': 'ौ',
  'ṃ': 'ं', 'ḥ': 'ः', 'm̐': 'ँ',
  'ka': 'क', 'kha': 'ख', 'ga': 'ग', 'gha': 'घ', 'ṅa': 'ङ',
  'ca': 'च', 'cha': 'छ', 'ja': 'ज', 'jha': 'झ', 'ña': 'ञ',
  'ṭa': 'ट', 'ṭha': 'ठ', 'ḍa': 'ड', 'ḍha': 'ढ', 'ṇa': 'ण',
  'ta': 'त', 'tha': 'थ', 'da': 'द', 'dha': 'ध', 'na': 'न',
  'pa': 'प', 'pha': 'फ', 'ba': 'ब', 'bha': 'भ', 'ma': 'म',
  'ya': 'य', 'ra': 'र', 'la': 'ल', 'va': 'व',
  'śa': 'श', 'ṣa': 'ष', 'sa': 'स', 'ha': 'ह',
  'a': 'अ', 'i': 'इ', 'u': 'उ',
};

export function devanagariToIAST(text: string): string {
  let result = '';
  for (const char of text) {
    result += DEVANAGARI_TO_IAST[char] ?? char;
  }
  return result;
}

export function iastToDevanagari(text: string): string {
  let result = text;
  const sorted = Object.entries(IAST_TO_DEVANAGARI).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [latin, deva] of sorted) {
    result = result.split(latin).join(deva);
  }
  return result;
}

export function transliterate(text: string, from: string, to: string): string {
  if (from === to) return text;
  if (from === 'devanagari' && to === 'iast') return devanagariToIAST(text);
  if (from === 'iast' && to === 'devanagari') return iastToDevanagari(text);
  return text;
}
