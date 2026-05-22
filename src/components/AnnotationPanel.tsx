import { X, BookOpen, Sparkles, Tag } from 'lucide-react';
import { ALANKARA_CATEGORIES, UPAMA_SUBTYPES, UTPREKSHA_SUBTYPES } from '../lib/types';
import { transliterate } from '../lib/transliteration';
import type { Annotation, WordGloss, ScriptType } from '../lib/types';

interface Props {
  verseId: string;
  annotations: Annotation[];
  glosses: WordGloss[];
  script: ScriptType;
  loading: boolean;
  onClose: () => void;
  onWordHover: (gloss: WordGloss | null) => void;
}

export default function AnnotationPanel({ annotations, glosses, script, loading, onClose, onWordHover }: Props) {
  if (loading) {
    return (
      <aside className="w-80 lg:w-96 bg-white border-l border-stone-200 flex-shrink-0 overflow-y-auto">
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse text-stone-300 text-sm">Loading annotations...</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 lg:w-96 bg-white border-l border-stone-200 flex-shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between z-10">
        <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Annotations
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Alaṃkāra Annotations */}
        {annotations.length > 0 ? (
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Alaṃkāra Breakdown
            </h4>
            <div className="space-y-3">
              {annotations.map((ann) => {
                const cat = ALANKARA_CATEGORIES[ann.alankara_type];
                const subTypes = ann.alankara_type === 'upama' ? UPAMA_SUBTYPES : UTPREKSHA_SUBTYPES;
                const subInfo = subTypes[ann.sub_type];

                return (
                  <div
                    key={ann.id}
                    className={`rounded-xl border ${cat.borderColor} ${cat.bgColor} p-4`}
                  >
                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold ${cat.color} uppercase tracking-wider`}>
                        {cat.label}
                      </span>
                      <span className="text-stone-300">|</span>
                      <span className="text-xs font-medium text-stone-600">
                        {subInfo?.label || ann.sub_type}
                      </span>
                    </div>

                    {/* Full tag */}
                    <p className="text-sm font-semibold text-stone-800 mb-3">
                      {ann.full_tag}
                    </p>

                    {/* Elements tree */}
                    <div className="bg-white/60 rounded-lg p-3 space-y-1.5 text-xs">
                      {ann.upameya && (
                        <div className="flex items-start gap-2">
                          <span className="text-stone-400 font-medium w-20 flex-shrink-0">Upameya:</span>
                          <span className="text-stone-700 font-medium">
                            {script === 'iast' ? transliterate(ann.upameya, 'devanagari', 'iast') : ann.upameya}
                          </span>
                        </div>
                      )}
                      {ann.upamana && (
                        <div className="flex items-start gap-2">
                          <span className="text-stone-400 font-medium w-20 flex-shrink-0">Upamāna:</span>
                          <span className="text-stone-700 font-medium">
                            {script === 'iast' ? transliterate(ann.upamana, 'devanagari', 'iast') : ann.upamana}
                          </span>
                        </div>
                      )}
                      {ann.sadharana_dharma && (
                        <div className="flex items-start gap-2">
                          <span className="text-stone-400 font-medium w-20 flex-shrink-0">Sādh. Dharma:</span>
                          <span className="text-stone-700">
                            {script === 'iast' ? transliterate(ann.sadharana_dharma, 'devanagari', 'iast') : ann.sadharana_dharma}
                          </span>
                        </div>
                      )}
                      {ann.vacaka && (
                        <div className="flex items-start gap-2">
                          <span className="text-stone-400 font-medium w-20 flex-shrink-0">Vācaka:</span>
                          <span className="text-stone-700 italic">
                            {script === 'iast' ? transliterate(ann.vacaka, 'devanagari', 'iast') : ann.vacaka}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    {ann.explanation && (
                      <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                        {ann.explanation}
                      </p>
                    )}

                    {/* Confidence */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${ann.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {Math.round(ann.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-8 h-8 text-stone-200 mx-auto mb-2" />
            <p className="text-xs text-stone-400">No alaṃkāras detected in this verse.</p>
          </div>
        )}

        {/* Word Glosses */}
        {glosses.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Word Analysis
            </h4>
            <div className="space-y-1">
              {glosses.map((gloss) => (
                <div
                  key={gloss.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors cursor-default"
                  onMouseEnter={() => onWordHover(gloss)}
                  onMouseLeave={() => onWordHover(null)}
                >
                  <span
                    className={`text-sm font-medium min-w-[5rem] ${
                      script === 'devanagari' ? 'font-serif' : 'font-mono'
                    } text-stone-800`}
                  >
                    {script === 'iast' ? transliterate(gloss.word_form, 'devanagari', 'iast') : gloss.word_form}
                  </span>
                  <span className="text-stone-300">→</span>
                  <span className="text-xs text-stone-500 truncate">
                    {gloss.lemma && (
                      <span className="font-medium text-stone-700">
                        {script === 'iast' ? transliterate(gloss.lemma, 'devanagari', 'iast') : gloss.lemma}
                      </span>
                    )}
                    {gloss.meaning && <span className="ml-1">({gloss.meaning})</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
