import { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, BarChart3, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCantos, useVerses, useAnnotations, useWordGlosses } from '../hooks/useData';
import { transliterate } from '../lib/transliteration';
import { ALANKARA_CATEGORIES } from '../lib/types';
import type { Text, Verse, WordGloss, ScriptType } from '../lib/types';
import AnnotationPanel from '../components/AnnotationPanel';

interface Props {
  textId: string;
  initialCantoId: string | null;
  script: ScriptType;
  alankaraMode: boolean;
  onAnalyze: (textId: string) => void;
}

export default function ReaderPage({ textId, initialCantoId, script, alankaraMode, onAnalyze }: Props) {
  const [text, setText] = useState<Text | null>(null);
  const { cantos, loading: cantosLoading } = useCantos(textId);
  const [activeCantoId, setActiveCantoId] = useState<string | null>(initialCantoId);
  const { verses, loading: versesLoading } = useVerses(activeCantoId);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const { annotations, loading: annLoading } = useAnnotations(selectedVerseId);
  const { glosses, loading: glossesLoading } = useWordGlosses(selectedVerseId);
  const [showPanel, setShowPanel] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<WordGloss | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('texts').select('*').eq('id', textId).maybeSingle();
      if (data) setText(data);
    };
    fetch();
  }, [textId]);

  useEffect(() => {
    if (cantos.length > 0 && !activeCantoId) {
      setActiveCantoId(cantos[0].id);
    }
  }, [cantos, activeCantoId]);

  const activeCanto = cantos.find((c) => c.id === activeCantoId);
  const cantoIndex = cantos.findIndex((c) => c.id === activeCantoId);

  const handleVerseClick = (verse: Verse) => {
    if (selectedVerseId === verse.id) {
      setSelectedVerseId(null);
      setShowPanel(false);
    } else {
      setSelectedVerseId(verse.id);
      setShowPanel(true);
    }
  };

  const getVerseText = (verse: Verse) => {
    if (script === 'iast' && verse.text_iast) return verse.text_iast;
    if (script === 'iast') return transliterate(verse.text_devanagari, 'devanagari', 'iast');
    return verse.text_devanagari;
  };

  const getVerseAnnotations = (verseId: string) => {
    if (selectedVerseId === verseId) return annotations;
    return [];
  };

  const loading = cantosLoading || versesLoading;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar - Canto navigation */}
      <aside className="w-56 lg:w-64 bg-white border-r border-stone-200 flex-shrink-0 overflow-y-auto hidden md:block">
        <div className="p-4">
          {text && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-stone-800 leading-tight">{text.title}</h2>
              <p className="text-xs text-stone-400 mt-1">{text.author}</p>
            </div>
          )}
          <div className="space-y-1">
            {cantos.map((canto) => (
              <button
                key={canto.id}
                onClick={() => setActiveCantoId(canto.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCantoId === canto.id
                    ? 'bg-amber-50 text-amber-800 font-medium border border-amber-200'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="text-xs text-stone-400 mr-1">Sarga {canto.canto_number}</span>
                <span className="block text-xs truncate">
                  {script === 'iast' && canto.title_latin ? canto.title_latin : canto.title || `Canto ${canto.canto_number}`}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main reading area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Canto header */}
        <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile canto selector */}
            <select
              value={activeCantoId ?? ''}
              onChange={(e) => setActiveCantoId(e.target.value)}
              className="md:hidden text-sm border border-stone-200 rounded-lg px-2 py-1.5 bg-white"
            >
              {cantos.map((c) => (
                <option key={c.id} value={c.id}>
                  Sarga {c.canto_number}
                </option>
              ))}
            </select>
            <div className="hidden md:block">
              <h2 className="text-sm font-semibold text-stone-700">
                {activeCanto
                  ? script === 'iast' && activeCanto.title_latin
                    ? activeCanto.title_latin
                    : activeCanto.title || `Sarga ${activeCanto.canto_number}`
                  : 'Select a canto'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => cantoIndex > 0 && setActiveCantoId(cantos[cantoIndex - 1].id)}
              disabled={cantoIndex <= 0}
              className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-stone-400">
              {cantoIndex + 1} / {cantos.length}
            </span>
            <button
              onClick={() => cantoIndex < cantos.length - 1 && setActiveCantoId(cantos[cantoIndex + 1].id)}
              disabled={cantoIndex >= cantos.length - 1}
              className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-stone-200 mx-1" />
            <button
              onClick={() => onAnalyze(textId)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analyze
            </button>
          </div>
        </div>

        {/* Verses */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-pulse text-stone-300">
                <BookOpen className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm">Loading verses...</p>
              </div>
            </div>
          ) : verses.length === 0 ? (
            <div className="text-center py-24 text-stone-400">
              <p className="text-sm">No verses in this canto.</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-6">
              {verses.map((verse) => {
                const verseAnns = getVerseAnnotations(verse.id);
                const isSelected = selectedVerseId === verse.id;
                const hasAlankara = alankaraMode && verseAnns.length > 0;

                return (
                  <div
                    key={verse.id}
                    className={`group relative rounded-xl p-5 sm:p-6 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-2 border-amber-300 shadow-md'
                        : hasAlankara
                        ? 'bg-white border border-stone-100 hover:border-stone-200 shadow-sm hover:shadow-md'
                        : 'bg-white border border-stone-100 hover:border-stone-200 shadow-sm hover:shadow-md'
                    }`}
                    onClick={() => handleVerseClick(verse)}
                  >
                    {/* Verse number */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-mono text-stone-400">
                        {verse.verse_number}
                      </span>
                      {verse.meter && (
                        <span className="text-xs text-stone-300 italic">
                          {verse.meter}
                        </span>
                      )}
                      {alankaraMode && verseAnns.length > 0 && (
                        <div className="flex items-center gap-1 ml-auto">
                          {verseAnns.map((ann) => {
                            const cat = ALANKARA_CATEGORIES[ann.alankara_type];
                            return (
                              <span
                                key={ann.id}
                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cat.bgColor} ${cat.color} ${cat.borderColor} border`}
                              >
                                {cat.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Verse text */}
                    <p
                      className={`text-lg sm:text-xl leading-relaxed tracking-wide ${
                        script === 'devanagari' ? 'font-serif' : 'font-mono'
                      } text-stone-800`}
                    >
                      {getVerseText(verse)}
                    </p>

                    {/* Translation */}
                    {verse.translation_en && isSelected && (
                      <p className="mt-3 text-sm text-stone-500 italic leading-relaxed border-t border-stone-100 pt-3">
                        {verse.translation_en}
                      </p>
                    )}

                    {/* Click hint */}
                    {!isSelected && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4 text-stone-300" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Annotation Panel */}
      {showPanel && selectedVerseId && (
        <AnnotationPanel
          verseId={selectedVerseId}
          annotations={annotations}
          glosses={glosses}
          script={script}
          loading={annLoading || glossesLoading}
          onClose={() => {
            setShowPanel(false);
            setSelectedVerseId(null);
          }}
          onWordHover={setHoveredWord}
        />
      )}

      {/* Word tooltip */}
      {hoveredWord && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-100 px-4 py-2 rounded-lg shadow-xl text-sm z-50 pointer-events-none">
          <span className="font-semibold">{hoveredWord.lemma || hoveredWord.word_form}</span>
          {hoveredWord.meaning && (
            <span className="text-stone-400 ml-2">— {hoveredWord.meaning}</span>
          )}
          {hoveredWord.morphology && (
            <span className="text-stone-500 ml-2 text-xs">({hoveredWord.morphology})</span>
          )}
        </div>
      )}
    </div>
  );
}
