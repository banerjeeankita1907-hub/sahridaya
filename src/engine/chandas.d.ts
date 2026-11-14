export interface ScannedSyllable {
  index: number;
  text: string;
  onset: string;
  vowel: string;
  coda: string;
  weight: "L" | "G" | "X";
  reason: string;
}

export interface PadaScan {
  input: string;
  normalized?: string;
  syllableCount: number;
  pattern: string;
  syllables: ScannedSyllable[];
  warnings: string[];
}

export interface VerseScan {
  padaCount: number;
  padas: PadaScan[];
  candidateNote: string;
  method: string;
}

export function scanPada(input: string): PadaScan;
export function scanVerse(input: string): VerseScan;
