import { BarChart3, BookOpen, TrendingUp, Layers } from 'lucide-react';
import { useAllAnnotations } from '../hooks/useData';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { ALANKARA_CATEGORIES, UPAMA_SUBTYPES, UTPREKSHA_SUBTYPES } from '../lib/types';
import type { Text } from '../lib/types';

interface Props {
  textId: string;
}

export default function DashboardPage({ textId }: Props) {
  const [text, setText] = useState<Text | null>(null);
  const { annotations, loading } = useAllAnnotations(textId);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('texts').select('*').eq('id', textId).maybeSingle();
      if (data) setText(data);
    };
    fetch();
  }, [textId]);

  const upamaCount = annotations.filter((a) => a.alankara_type === 'upama').length;
  const utprekshaCount = annotations.filter((a) => a.alankara_type === 'utpreksha').length;
  const total = annotations.length;

  const upamaSubtypes = annotations
    .filter((a) => a.alankara_type === 'upama')
    .reduce<Record<string, number>>((acc, a) => {
      const key = a.sub_type || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const utprekshaSubtypes = annotations
    .filter((a) => a.alankara_type === 'utpreksha')
    .reduce<Record<string, number>>((acc, a) => {
      const key = a.sub_type || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const avgConfidence = total > 0
    ? annotations.reduce((sum, a) => sum + a.confidence, 0) / total
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-pulse text-stone-300 text-sm">Loading analysis...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-amber-500" />
          Alaṃkāra Analysis
        </h1>
        {text && (
          <p className="mt-2 text-stone-500 text-sm">
            {text.title} {text.author ? `by ${text.author}` : ''}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Alaṃkāras"
          value={total}
          icon={<Layers className="w-5 h-5" />}
          color="stone"
        />
        <StatCard
          label="Upamā"
          value={upamaCount}
          icon={<BookOpen className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Utprekṣā"
          value={utprekshaCount}
          icon={<SparklesIcon className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          label="Avg. Confidence"
          value={`${Math.round(avgConfidence * 100)}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
        />
      </div>

      {/* Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upamā breakdown */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-400" />
            Upamā Sub-types
          </h3>
          {Object.keys(upamaSubtypes).length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">No Upamā detected</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(upamaSubtypes)
                .sort(([, a], [, b]) => b - a)
                .map(([sub, count]) => {
                  const info = UPAMA_SUBTYPES[sub as keyof typeof UPAMA_SUBTYPES];
                  const pct = upamaCount > 0 ? (count / upamaCount) * 100 : 0;
                  return (
                    <div key={sub}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-stone-600 font-medium">
                          {info?.label || sub}
                        </span>
                        <span className="text-stone-400">
                          {count} ({Math.round(pct)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Utprekṣā breakdown */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            Utprekṣā Sub-types
          </h3>
          {Object.keys(utprekshaSubtypes).length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">No Utprekṣā detected</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(utprekshaSubtypes)
                .sort(([, a], [, b]) => b - a)
                .map(([sub, count]) => {
                  const info = UTPREKSHA_SUBTYPES[sub as keyof typeof UTPREKSHA_SUBTYPES];
                  const pct = utprekshaCount > 0 ? (count / utprekshaCount) * 100 : 0;
                  return (
                    <div key={sub}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-stone-600 font-medium">
                          {info?.label || sub}
                        </span>
                        <span className="text-stone-400">
                          {count} ({Math.round(pct)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Annotation list */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-stone-700 mb-4">All Detected Alaṃkāras</h3>
        {annotations.length === 0 ? (
          <p className="text-xs text-stone-400 py-8 text-center">No alaṃkāras detected in this text.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-2 px-3 text-stone-400 font-medium uppercase tracking-wider">Type</th>
                  <th className="text-left py-2 px-3 text-stone-400 font-medium uppercase tracking-wider">Sub-type</th>
                  <th className="text-left py-2 px-3 text-stone-400 font-medium uppercase tracking-wider">Upameya</th>
                  <th className="text-left py-2 px-3 text-stone-400 font-medium uppercase tracking-wider">Upamāna</th>
                  <th className="text-left py-2 px-3 text-stone-400 font-medium uppercase tracking-wider">Vācaka</th>
                  <th className="text-right py-2 px-3 text-stone-400 font-medium uppercase tracking-wider">Conf.</th>
                </tr>
              </thead>
              <tbody>
                {annotations.map((ann) => {
                  const cat = ALANKARA_CATEGORIES[ann.alankara_type];
                  return (
                    <tr key={ann.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold ${cat.color} uppercase`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">{ann.full_tag}</td>
                      <td className="py-2.5 px-3 text-stone-700 font-medium">{ann.upameya}</td>
                      <td className="py-2.5 px-3 text-stone-700 font-medium">{ann.upamana}</td>
                      <td className="py-2.5 px-3 text-stone-500 italic">{ann.vacaka}</td>
                      <td className="py-2.5 px-3 text-right text-stone-400 font-mono">
                        {Math.round(ann.confidence * 100)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
  const colorMap: Record<string, string> = {
    stone: 'bg-stone-50 text-stone-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  const iconColorMap: Record<string, string> = {
    stone: 'text-stone-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
  };

  return (
    <div className={`rounded-xl p-4 ${colorMap[color] || colorMap.stone}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={iconColorMap[color] || iconColorMap.stone}>{icon}</span>
        <span className="text-xs font-medium opacity-70">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
    </svg>
  );
}
