/**
 * RCF Trends Page
 * Heatmaps, velocity lines, top sources
 */

'use client';

import { useState, useEffect } from 'react';
import type { TrendSnapshot } from '@total-audio/rcf/trends';
import Link from 'next/link';

export default function RCFTrendsPage() {
  const [trends, setTrends] = useState<TrendSnapshot[]>([]);
  const [window, setWindow] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, [window]);

  async function fetchTrends() {
    try {
      setLoading(true);
      const response = await fetch(`/api/rcf/trends?window=${window}&limit=20`);
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
      <header className="border-b border-slate-800 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/rcf" className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80">
                ← Back to Feed
              </Link>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Trending</h1>
            </div>

            <div className="flex space-x-2">
              {(['1h', '6h', '24h', '7d'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setWindow(w)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    window === w
                      ? 'bg-[#3AA9BE] text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-slate-400">Loading trends...</div>
        ) : trends.length === 0 ? (
          <div className="text-center text-slate-400">No trends data yet</div>
        ) : (
          <div className="grid gap-4">
            {trends.map((trend, idx) => (
              <div
                key={`${trend.entity_type}-${trend.entity_slug}-${idx}`}
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#3AA9BE]">
                      {trend.entity_type.toUpperCase()}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-100">
                      {trend.entity_slug}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#3AA9BE]">
                      {trend.score.toFixed(0)}
                    </div>
                    <div className="text-xs text-slate-500">Trend Score</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-slate-500">Velocity</div>
                    <div className="text-sm font-medium text-slate-200">
                      {trend.velocity.toFixed(2)} events/hr
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Events</div>
                    <div className="text-sm font-medium text-slate-200">
                      {trend.event_count}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Change</div>
                    <div
                      className={`text-sm font-medium ${
                        trend.change > 0 ? 'text-green-400' : 'text-slate-400'
                      }`}
                    >
                      {trend.change > 0 ? '+' : ''}
                      {trend.change.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
