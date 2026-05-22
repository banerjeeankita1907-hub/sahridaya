import { UPAMA_VACAKAS, UTPREKSHA_VACAKAS, UPAMA_SUBTYPES, UTPREKSHA_SUBTYPES } from '../lib/types';
import type { Annotation } from '../lib/types';

interface DetectionResult {
  alankara_type: 'upama' | 'utpreksha';
  sub_type: string;
  full_tag: string;
  upameya: string;
  upamana: string;
  sadharana_dharma: string;
  vacaka: string;
  explanation: string;
  confidence: number;
  highlight_start: number;
  highlight_end: number;
}

function findVacaka(text: string, vacakas: string[]): { word: string; index: number } | null {
  const words = text.split(/\s+/);
  let charIndex = 0;
  for (let i = 0; i < words.length; i++) {
    for (const v of vacakas) {
      if (words[i].replace(/[।॥,;:.!?]/g, '') === v) {
        return { word: v, index: charIndex };
      }
    }
    charIndex += words[i].length + 1;
  }
  return null;
}

function extractNouns(text: string): string[] {
  const words = text.split(/\s+/);
  return words.filter((w) => {
    const cleaned = w.replace(/[।॥,;:.!?]/g, '');
    return cleaned.length > 1 && !UPAMA_VACAKAS.includes(cleaned) && !UTPREKSHA_VACAKAS.includes(cleaned);
  });
}

function detectUpama(text: string): DetectionResult | null {
  const vacaka = findVacaka(text, UPAMA_VACAKAS);
  if (!vacaka) return null;

  const nouns = extractNouns(text);
  if (nouns.length < 2) return null;

  const upameya = nouns[0];
  const upamana = nouns[nouns.length - 1];

  const hasDharma = nouns.length >= 3;
  const subType = hasDharma ? 'purna' : 'lupta_dharma';
  const subInfo = UPAMA_SUBTYPES[subType];

  const highlightStart = text.indexOf(vacaka.word);
  const highlightEnd = highlightStart + vacaka.word.length;

  return {
    alankara_type: 'upama',
    sub_type: subType,
    full_tag: `Upamā:${subInfo.label}`,
    upameya,
    upamana,
    sadharana_dharma: hasDharma ? nouns[1] : '',
    vacaka: vacaka.word,
    explanation: `The ${upameya} is compared to ${upamana} via the marker "${vacaka.word}". ${subInfo.description}`,
    confidence: hasDharma ? 0.85 : 0.7,
    highlight_start: highlightStart,
    highlight_end: highlightEnd,
  };
}

function detectUtpreksha(text: string): DetectionResult | null {
  const vacaka = findVacaka(text, UTPREKSHA_VACAKAS);
  if (!vacaka) return null;

  const nouns = extractNouns(text);
  if (nouns.length < 2) return null;

  const upameya = nouns[0];
  const upamana = nouns[nouns.length - 1];

  const isFirstPerson = ['मन्ये', 'शङ्के', 'विभावयामि', 'manye', 'śaṅke', 'vibhāvayāmi'].includes(vacaka.word);
  const subType = isFirstPerson ? 'vacya' : 'pratiyamana';
  const subInfo = UTPREKSHA_SUBTYPES[subType];

  const highlightStart = text.indexOf(vacaka.word);
  const highlightEnd = highlightStart + vacaka.word.length;

  return {
    alankara_type: 'utpreksha',
    sub_type: subType,
    full_tag: `Utprekṣā:${subInfo.label}`,
    upameya,
    upamana,
    sadharana_dharma: '',
    vacaka: vacaka.word,
    explanation: `The poet fancies ${upameya} as ${upamana} via "${vacaka.word}". ${subInfo.description}`,
    confidence: isFirstPerson ? 0.9 : 0.75,
    highlight_start: highlightStart,
    highlight_end: highlightEnd,
  };
}

export function detectAlankaras(text: string): DetectionResult[] {
  const results: DetectionResult[] = [];

  const upama = detectUpama(text);
  if (upama) results.push(upama);

  const utpreksha = detectUtpreksha(text);
  if (utpreksha) results.push(utpreksha);

  return results;
}

export function formatAnnotation(d: DetectionResult, verseId: string): Omit<Annotation, 'id' | 'created_at'> {
  return {
    verse_id: verseId,
    alankara_type: d.alankara_type,
    sub_type: d.sub_type,
    full_tag: d.full_tag,
    upameya: d.upameya,
    upamana: d.upamana,
    sadharana_dharma: d.sadharana_dharma,
    vacaka: d.vacaka,
    explanation: d.explanation,
    confidence: d.confidence,
    highlight_start: d.highlight_start,
    highlight_end: d.highlight_end,
  };
}

