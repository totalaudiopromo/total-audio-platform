/**
 * RCF Trends Page
 * Comprehensive trends dashboard with heatmap, velocity charts, and trend cards
 */

'use client';

import { useState, useEffect } from 'react';
import type { TrendSnapshot, TrendWindow } from '@total-audio/rcf/trends';
import Link from 'next/link';
import { TrendHeatmap } from './components/TrendHeatmap';
import { TrendListCard } from './components/TrendListCard';
import { TrendWindowSelector } from './components/TrendWindowSelector';

type ViewMode = 'heatmap' | 'list';

export default function RCFTrendsPage() {
  const [trends, setTrends] = useState<TrendSnapshot[]>([]);
  const [window, setWindow] = useState<TrendWindow>('24h');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [selectedTrend, setSelectedTrend] = useState<TrendSnapshot | null>(null);

  useEffect(() => {
    fetchTrends();
  }, [window]);

  async function fetchTrends() {
    try {
      setLoading(true);
      const response = await fetch(`/api/rcf/trends?window=${window}&limit=50`);
      const result = await response.json();

      if (result.success) {
        setTrends(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/rcf"
                className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80 transition-colors duration-240"
              >
                ← Back to Feed
              </Link>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Real-Time Trends</h1>
              <p className="text-sm text-slate-400 mt-1">
                {trends.length} trending {trends.length === 1 ? 'entity' : 'entities'} in the last{' '}
                {window}
              </p>
            </div>

            <div className="flex flex-col items-end space-y-3">
              <TrendWindowSelector selected={window} onChange={setWindow} />

              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    px-4 py-2 text-sm font-medium font-mono rounded-lg
                    transition-all duration-240 ease-out
                    ${
                      viewMode === 'list'
                        ? 'bg-[#3AA9BE] text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }
                  `}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('heatmap')}
                  className={`
                    px-4 py-2 text-sm font-medium font-mono rounded-lg
                    transition-all duration-240 ease-out
                    ${
                      viewMode === 'heatmap'
                        ? 'bg-[#3AA9BE] text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }
                  `}
                >
                  Heatmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-pulse text-[#3AA9BE]">Loading trends...</div>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-lg mb-2">No trend data yet</div>
            <div className="text-sm">Check back once events start flowing through the RCF system</div>
          </div>
        ) : (
          <div className="space-y-8">
            {viewMode === 'heatmap' && (
              <TrendHeatmap trends={trends} onSelectTrend={setSelectedTrend} />
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                {trends.map((trend, idx) => (
                  <TrendListCard
                    key={`${trend.entity_type}-${trend.entity_slug}-${idx}`}
                    trend={trend}
                    rank={idx + 1}
                  />
                ))}
              </div>
            )}

            {selectedTrend && viewMode === 'heatmap' && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-200">Selected Trend</h2>
                  <button
                    onClick={() => setSelectedTrend(null)}
                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <TrendListCard trend={selectedTrend} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
