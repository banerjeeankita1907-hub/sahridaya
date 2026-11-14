import { useMemo, useState } from "react";
import { scanVerse } from "../engine/chandas.js";
import type { VerseScan } from "../engine/chandas.js";

export default function ChandasPage() {
  const [verse, setVerse] = useState("");
  const result = useMemo<VerseScan | null>(() => {
    if (!verse.trim()) return null;
    try {
      return scanVerse(verse);
    } catch {
      return null;
    }
  }, [verse]);

  const error = useMemo(() => {
    if (!verse.trim()) return null;
    try {
      scanVerse(verse);
      return null;
    } catch (reason) {
      return reason instanceof Error ? reason.message : "Unable to scan this text.";
    }
  }, [verse]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Computational Sanskrit Prosody</p>
        <h2 className="mt-2 text-3xl font-semibold text-stone-900">Chandas Workbench</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
          Inspect IAST syllable weight patterns using vowel length and a limited
          positional-weight heuristic. This tool is an exploratory aid, not an
          authoritative metre classifier.
        </p>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <label htmlFor="chandas-input" className="block text-sm font-semibold text-stone-800">
          Sanskrit verse in IAST transliteration
        </label>
        <p className="mt-1 text-xs text-stone-500">
          Separate pādas with a newline, vertical bar, or daṇḍa (। / ॥).
        </p>
        <textarea
          id="chandas-input"
          value={verse}
          onChange={(event) => setVerse(event.target.value)}
          placeholder={"rāmaḥ śāśvata-dharmātmā ... | ..."}
          rows={5}
          spellCheck={false}
          className="mt-3 w-full rounded-lg border border-stone-300 bg-stone-50 p-3 font-serif text-lg leading-8 text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-stone-500">L = laghu · G = guru · X = pāda-final anceps</span>
          <button
            type="button"
            onClick={() => setVerse("")}
            className="rounded-md border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50"
          >
            Clear
          </button>
        </div>
      </section>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {result && (
        <section className="mt-6 space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-stone-900">Scansion summary</h3>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                {result.padaCount} pāda{result.padaCount === 1 ? "" : "s"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-700">{result.candidateNote}</p>
            <p className="mt-2 text-xs text-stone-500">Method: {result.method}</p>
          </div>

          {result.padas.map((pada, index) => (
            <div key={index} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-semibold text-stone-800">Pāda {index + 1}</h4>
                <span className="text-xs tabular-nums text-stone-500">
                  {pada.syllableCount} syllable{pada.syllableCount === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {pada.syllables.map((syllable) => (
                  <div key={syllable.index} className="min-w-12 rounded-lg border border-stone-200 bg-stone-50 px-2 py-2 text-center">
                    <div className="font-serif text-base text-stone-800">{syllable.text}</div>
                    <div className={
                      "mt-1 text-xs font-bold " +
                      (syllable.weight === "G" ? "text-blue-700" :
                        syllable.weight === "X" ? "text-amber-700" : "text-emerald-700")
                    }>
                      {syllable.weight}
                    </div>
                    <div className="mt-1 max-w-24 text-[10px] leading-4 text-stone-500">{syllable.reason}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-sm tracking-widest text-stone-700">{pada.pattern || "—"}</p>
            </div>
          ))}

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
            <strong>Interpret with care.</strong> The scanner does not resolve sandhi,
            morphology, all positional conventions or the full rule systems of
            classical metres. It reports syllable-weight evidence only; verify
            any proposed metre against a scholarly edition and prosodic reference.
          </div>
        </section>
      )}
    </div>
  );
}
