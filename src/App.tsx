import { useState, useCallback } from 'react';
import { BookOpen, BarChart3, Library, Settings, ChevronLeft } from 'lucide-react';
import LibraryPage from './pages/LibraryPage';
import ReaderPage from './pages/ReaderPage';
import DashboardPage from './pages/DashboardPage';
import { useScript } from './hooks/useData';
import type { ScriptType } from './lib/types';

type Page = 'library' | 'reader' | 'dashboard';

function App() {
  const [page, setPage] = useState<Page>('library');
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedCantoId, setSelectedCantoId] = useState<string | null>(null);
  const { script, changeScript } = useScript();
  const [alankaraMode, setAlankaraMode] = useState(true);

  const openReader = useCallback((textId: string, cantoId?: string) => {
    setSelectedTextId(textId);
    setSelectedCantoId(cantoId ?? null);
    setPage('reader');
  }, []);

  const openDashboard = useCallback((textId: string) => {
    setSelectedTextId(textId);
    setPage('dashboard');
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-900 text-stone-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {page !== 'library' && (
                <button
                  onClick={() => setPage('library')}
                  className="p-2 rounded-lg hover:bg-stone-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('library')}>
                <BookOpen className="w-6 h-6 text-amber-400" />
                <h1 className="text-lg font-semibold tracking-wide">
                  Sāhitya
                </h1>
                <span className="hidden sm:inline text-xs text-stone-400 ml-1">
                  Sanskrit E-Reader
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1">
              <button
                onClick={() => setPage('library')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === 'library' ? 'bg-stone-700 text-amber-400' : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <Library className="w-4 h-4" />
                <span className="hidden sm:inline">Library</span>
              </button>
              <button
                onClick={() => selectedTextId && setPage('reader')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === 'reader' ? 'bg-stone-700 text-amber-400' : 'hover:bg-stone-800 text-stone-300'
                } ${!selectedTextId ? 'opacity-40 cursor-not-allowed' : ''}`}
                disabled={!selectedTextId}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Reader</span>
              </button>
              <button
                onClick={() => selectedTextId && setPage('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === 'dashboard' ? 'bg-stone-700 text-amber-400' : 'hover:bg-stone-800 text-stone-300'
                } ${!selectedTextId ? 'opacity-40 cursor-not-allowed' : ''}`}
                disabled={!selectedTextId}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analysis</span>
              </button>

              <div className="w-px h-6 bg-stone-700 mx-2" />

              {/* Settings dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 text-stone-300 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline capitalize">{script === 'devanagari' ? 'Devanāgarī' : script.toUpperCase()}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-stone-800 rounded-lg shadow-xl border border-stone-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <p className="text-xs text-stone-400 px-2 py-1 font-medium uppercase tracking-wider">Script</p>
                    {(['devanagari', 'iast'] as ScriptType[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => changeScript(s)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          script === s ? 'bg-amber-500/20 text-amber-400' : 'text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        {s === 'devanagari' ? 'देवनागरी (Devanāgarī)' : 'IAST (Romanized)'}
                      </button>
                    ))}
                    <div className="border-t border-stone-700 my-2" />
                    <p className="text-xs text-stone-400 px-2 py-1 font-medium uppercase tracking-wider">Alaṃkāra Mode</p>
                    <button
                      onClick={() => setAlankaraMode(!alankaraMode)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        alankaraMode ? 'bg-amber-500/20 text-amber-400' : 'text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {alankaraMode ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {page === 'library' && (
          <LibraryPage onOpenText={openReader} onAnalyze={openDashboard} />
        )}
        {page === 'reader' && selectedTextId && (
          <ReaderPage
            textId={selectedTextId}
            initialCantoId={selectedCantoId}
            script={script}
            alankaraMode={alankaraMode}
            onAnalyze={openDashboard}
          />
        )}
        {page === 'dashboard' && selectedTextId && (
          <DashboardPage textId={selectedTextId} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-500 text-center py-4 text-xs border-t border-stone-800">
        Sāhitya — Intelligent Sanskrit E-Reader with Computational Alaṃkāra Analysis
      </footer>
    </div>
  );
}

export default App;
