# Chandas Workbench: method and limits

## Input convention

The scanner currently accepts IAST transliteration. It normalizes text to NFC
and lower-case, splits pādas at newline, vertical-bar or Sanskrit daṇḍa
separators, and ignores common punctuation and whitespace when constructing
the phonological string.

Devanāgarī text is deliberately rejected rather than silently processed with
an incomplete transliteration table.

## Syllable segmentation

The engine identifies IAST vowel nuclei, including long vowels and the
diphthongs ai and au. Consonants between consecutive vowel nuclei are used as
a limited positional-weight cue.

## Weight hints

- G (guru) is reported for a long vowel, a nucleus followed by anusvāra or
  visarga, or a short vowel followed by a consonant cluster.
- A pāda-final closed syllable is marked G.
- A short open syllable at the end of a pāda is marked X (anceps).
- Other short open or single-consonant cases are marked L (laghu).

The reason string is retained for each syllable so a reader can inspect why a
weight was assigned.

## Count-only candidate

When exactly four pādas contain eight syllables each, the UI reports an
anuṣṭubh *count candidate*. It does not verify the position-specific
laghu/guru rules, cadence, caesura, textual variants or classical subtypes.
The note explicitly avoids labelling the verse as a confirmed anuṣṭubh.

## Known limitations

The current tool does not implement:
- Sandhi splitting or restoration.
- Morphological analysis or lexical syllabification exceptions.
- All conjunct and word-boundary rules of classical Sanskrit prosody.
- Full gaṇa analysis or metre-specific rule sets.
- Textual edition alignment or variant handling.
- Metre identification beyond the simple four-times-eight count note.

A research extension should compare the scanner against manually annotated
verses from a named edition, report inter-annotator disagreement, and measure
syllable-weight accuracy before adding metre labels. A metre classifier should
be introduced only with explicit, testable rule sets and a validated corpus.

## Reproducibility

Run `npm test` to execute the standalone Node.js test suite. Test examples are
synthetic phonological strings designed to exercise the implemented rules;
they are not a gold-standard corpus of Sanskrit poetry.
