import { BookOpen, BarChart3, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTexts } from '../hooks/useData';
import type { Text } from '../lib/types';

interface Props {
  onOpenText: (textId: string, cantoId?: string) => void;
  onAnalyze: (textId: string) => void;
}

export default function LibraryPage({ onOpenText, onAnalyze }: Props) {
  const { texts, loading } = useTexts();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return texts;
    const q = search.toLowerCase();
    return texts.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.title_latin.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.author_latin.toLowerCase().includes(q) ||
        t.era.toLowerCase().includes(q)
    );
  }, [texts, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-stone-300" />
          <p className="text-stone-400 text-sm">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">
          Sāhitya Library
        </h1>
        <p className="mt-3 text-stone-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Explore classical Sanskrit kāvya with intelligent Alaṃkāra annotations.
          Each text is enriched with morphological analysis and computational detection of poetic figures.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or era..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && !loading && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-400 text-lg">No texts found</p>
          <p className="text-stone-300 text-sm mt-1">Try adjusting your search or check back later.</p>
        </div>
      )}

      {/* Text Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((text) => (
          <TextCard
            key={text.id}
            text={text}
            onOpen={() => onOpenText(text.id)}
            onAnalyze={() => onAnalyze(text.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TextCard({ text, onOpen, onAnalyze }: { text: Text; onOpen: () => void; onAnalyze: () => void }) {
  return (
    <div className="group bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:border-stone-200 transition-all duration-300 overflow-hidden">
      {/* Cover area */}
      <div
        className="h-40 bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,170,80,0.15),transparent_60%)]" />
        <div className="text-center relative z-10">
          <p className="text-2xl sm:text-3xl font-bold text-amber-100/90 leading-tight px-4">
            {text.title}
          </p>
          {text.title_latin && (
            <p className="text-amber-200/50 text-xs mt-1 italic">
              {text.title_latin}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-sm font-semibold text-stone-800">
              {text.author || text.author_latin || 'Unknown Author'}
            </p>
            {text.era && (
              <p className="text-xs text-stone-400 mt-0.5">{text.era}</p>
            )}
          </div>
          {text.total_verses > 0 && (
            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full whitespace-nowrap">
              {text.total_verses} verses
            </span>
          )}
        </div>

        {text.description && (
          <p className="text-xs text-stone-500 leading-relaxed mt-2 line-clamp-2">
            {text.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={onOpen}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Read
          </button>
          <button
            onClick={onAnalyze}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium rounded-lg transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analyze</span>
          </button>
        </div>
      </div>
    </div>
  );
}
