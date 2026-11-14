import test from "node:test";
import assert from "node:assert/strict";
import { scanPada, scanVerse } from "../src/engine/chandas.js";

test("recognizes long vowels as guru and final short open syllables as anceps", () => {
  const result = scanPada("rāma");
  assert.equal(result.syllableCount, 2);
  assert.equal(result.pattern, "GX");
  assert.equal(result.syllables[0].reason, "long-vowel");
  assert.equal(result.syllables[1].reason, "pada-final-anceps");
});

test("recognizes short open syllables and a final anceps", () => {
  const result = scanPada("kavi");
  assert.equal(result.pattern, "LX");
});

test("recognizes consonant clusters as positional guru", () => {
  const result = scanPada("karma");
  assert.equal(result.pattern, "GX");
  assert.equal(result.syllables[0].reason, "consonant-cluster");
});

test("recognizes anusvara and visarga as guru markers", () => {
  assert.equal(scanPada("saṃ").pattern, "G");
  assert.equal(scanPada("saḥ").pattern, "G");
});

test("scans pādas separated by Sanskrit daṇḍa and preserves counts", () => {
  const result = scanVerse("rāma | kavi | karma | sāṃ");
  assert.equal(result.padaCount, 4);
  assert.deepEqual(result.padas.map(pada => pada.syllableCount), [2, 2, 2, 1]);
  assert.match(result.candidateNote, /No metre is assigned/);
});

test("labels four eight-syllable pādas as a count candidate, not a confirmed metre", () => {
  const result = scanVerse("a a a a a a a a | a a a a a a a a | a a a a a a a a | a a a a a a a a");
  assert.match(result.candidateNote, /anuṣṭubh candidate only/);
  assert.match(result.candidateNote, /not verified/);
});

test("rejects empty input, excess pādas and Devanāgarī input", () => {
  assert.throws(() => scanVerse(" "), /non-empty/);
  assert.throws(() => scanVerse("a|a|a|a|a|a|a|a|a"), /between 1 and 8/);
  assert.throws(() => scanPada("राम"), /IAST transliteration/);
});
