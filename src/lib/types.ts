export interface Text {
  id: string;
  title: string;
  title_latin: string;
  author: string;
  author_latin: string;
  era: string;
  description: string;
  cover_image: string;
  total_verses: number;
  created_at: string;
}

export interface Canto {
  id: string;
  text_id: string;
  canto_number: number;
  title: string;
  title_latin: string;
  created_at: string;
}

export interface Verse {
  id: string;
  canto_id: string;
  verse_number: number;
  text_devanagari: string;
  text_iast: string;
  meter: string;
  meter_type: string;
  translation_en: string;
  created_at: string;
}

export interface Annotation {
  id: string;
  verse_id: string;
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
  created_at: string;
}

export interface WordGloss {
  id: string;
  verse_id: string;
  word_index: number;
  word_form: string;
  lemma: string;
  pos_tag: string;
  morphology: string;
  meaning: string;
  created_at: string;
}

export type ScriptType = 'devanagari' | 'iast' | 'kannada' | 'telugu';

export interface AlankaraCategory {
  type: 'upama' | 'utpreksha';
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ALANKARA_CATEGORIES: Record<string, AlankaraCategory> = {
  upama: {
    type: 'upama',
    label: 'Upamā',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  utpreksha: {
    type: 'utpreksha',
    label: 'Utprekṣā',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
};

export const UPAMA_VACAKAS = [
  'इव', 'यथा', 'एव', 'सम', 'तुल्य', 'निभ', 'सन्निभ', 'सदृश',
  'प्रतिम', 'कल्प', 'उपम', 'विभाति', 'भाति',
  'iva', 'yathā', 'eva', 'sama', 'tulya', 'nibha', 'sannibha', 'sadṛśa',
  'pratima', 'kalpa', 'upama', 'vibhāti', 'bhāti',
];

export const UTPREKSHA_VACAKAS = [
  'मन्ये', 'शङ्के', 'ध्रुवम्', 'नूनम्', 'स्यात्', 'प्रायेण',
  'कथं न', 'स्मृतम्', 'भाति', 'विभावयामि', 'तर्के',
  'manye', 'śaṅke', 'dhruvam', 'nūnam', 'syāt', 'prāyeṇa',
  'kathaṃ na', 'smṛtam', 'bhāti', 'vibhāvayāmi', 'tarke',
];

export const UPAMA_SUBTYPES: Record<string, { label: string; description: string }> = {
  purna: { label: 'Pūrṇā', description: 'All four elements (U, A, D, V) are explicitly present.' },
  lupta_dharma: { label: 'Dharma-luptā', description: 'The common attribute (D) is omitted.' },
  lupta_upamana: { label: 'Upamāna-luptā', description: 'The standard of comparison (A) is omitted.' },
  lupta_vacaka: { label: 'Vācaka-luptā', description: 'The comparative marker (V) is omitted.' },
  lupta_upameya: { label: 'Upameya-luptā', description: 'The subject (U) is omitted.' },
  mala: { label: 'Mālā', description: 'A chain of similes where the Upamāna of one becomes the Upameya of the next.' },
  rasana: { label: 'Rasanā', description: 'The simile is conveyed through contextual implication.' },
};

export const UTPREKSHA_SUBTYPES: Record<string, { label: string; description: string }> = {
  sambhavana: { label: 'Sambhāvanā', description: 'The fancy is plausible under certain conditions.' },
  asambhavana: { label: 'Asambhāvanā', description: 'The fancy is physically impossible, a hyperbolic projection.' },
  vacya: { label: 'Vācyā', description: 'The fancy verb is explicitly in the first person.' },
  pratiyamana: { label: 'Pratīyamānā', description: 'The verb is in the third person or expressed via a modal adverb.' },
  niyatavishaya: { label: 'Niyataviṣayā', description: 'The fancy uses a famous mythological standard.' },
  aniyatavishaya: { label: 'Aniyata-viṣayā', description: 'The upamāna is a common or arbitrary object.' },
  hetu: { label: 'Hetu-utprekṣā', description: 'The fancy is the cause of the observed state.' },
};
