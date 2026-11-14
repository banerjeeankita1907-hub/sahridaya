# Sāhitya — Classical Sanskrit Reading and Alaṃkāra Exploration

Sāhitya is a digital reader for classical Sanskrit poetry with Devanāgarī and
IAST display, verse annotations and an exploratory alaṃkāra-analysis interface.
This repository also includes a new Chandas Workbench for examining IAST
syllable-weight patterns.

## Features

- Sanskrit text library, canto navigation and verse reader.
- Devanāgarī and IAST display modes.
- Existing rule-based Upamā and Utprekṣā marker exploration.
- Annotation and word-gloss views backed by Supabase.
- **Chandas Workbench:** IAST syllabification, laghu/guru weight hints,
  pāda-level patterns and a cautious count-only anuṣṭubh candidate note.
- Node.js tests for the standalone scansion engine.
- GitHub Actions for tests, TypeScript checking and Vite builds.

## Chandas Workbench

Open the **Prosody Lab** item in the application header and enter a verse in
IAST transliteration. Separate pādas with newlines, a vertical bar or Sanskrit
daṇḍa punctuation.

The scanner reports:
- Vowel nuclei and syllable count.
- Long-vowel, anusvāra/visarga and consonant-cluster weight hints.
- L (laghu), G (guru) and X (pāda-final anceps) patterns.
- A count-only note when four pādas each contain eight syllables.

This is an exploratory phonological aid. It does not resolve sandhi,
morphology or all classical metrical conventions, and it does not claim to
identify a metre authoritatively. It accepts IAST only; Devanāgarī text must be
transliterated before scanning.

## Local development

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Open the local Vite URL printed by the development server.

## Quality checks

```bash
npm test
npm run typecheck
npm run build
```

The test suite exercises the scansion utility independently of Supabase. CI
uses placeholder Supabase environment values for the static build; no live
database credentials are committed.

## Research scope and limitations

The existing alaṃkāra detector is a heuristic marker-based aid, not a complete
Sanskrit NLP system. It does not perform morphological parsing, dependency
analysis, sandhi resolution or context-sensitive śāstra-level adjudication.
The Chandas Workbench is likewise a limited scansion helper, not a complete
prosody grammar. Treat generated hints as candidate evidence for human review,
not as scholarly annotations without verification.

Before using generated analyses in research or teaching, verify verse
transcriptions against a critical edition, document transliteration
conventions and have a Sanskrit specialist review the proposed annotations.

## Environment

The application uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
Configure these in a local `.env` file for connected data. Do not commit
service-role keys or other privileged credentials.

## Licence

No separate licence file is currently provided. Ask before reusing or
redistributing this repository's code.
