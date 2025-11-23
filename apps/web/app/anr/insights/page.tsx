/**
 * A&R Insights
 * /anr/insights
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/anr/insights');
      const data = await res.json();
      setInsights(data.data || []);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/anr/insights/refresh', { method: 'POST' });
      if (res.ok) {
        await fetchInsights();
      }
    } catch (error) {
      console.error('Failed to refresh insights:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'artist_to_watch':
        return 'border-cyan-500 bg-cyan-500/10';
      case 'scene_opportunity':
        return 'border-green-500 bg-green-500/10';
      case 'roster_gap':
        return 'border-amber-500 bg-amber-500/10';
      case 'campaign_potential':
        return 'border-purple-500 bg-purple-500/10';
      default:
        return 'border-slate-600 bg-slate-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-amber-500/20 text-amber-400',
      low: 'bg-slate-600/20 text-slate-400',
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/anr" className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">A&R Insights</h1>
              <p className="text-slate-400">AI-generated insights and opportunities</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              {refreshing ? 'Refreshing...' : 'Refresh Insights'}
            </button>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-slate-400">Loading...</div>
          ) : insights.length > 0 ? (
            insights.map((insight) => (
              <div
                key={insight.id}
                className={`border-l-4 rounded-2xl p-6 ${getInsightColor(insight.insight_type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {insight.content.title}
                    </h3>
                    <p className="text-sm text-slate-400 capitalize">
                      {insight.insight_type.replace(/_/g, ' ')}
                    </p>
                  </div>
                  {insight.content.priority && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(insight.content.priority)}`}>
                      {insight.content.priority}
                    </span>
                  )}
                </div>

                <p className="text-slate-300 mb-4">{insight.content.description}</p>

                {insight.content.recommendations && insight.content.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-400">Recommendations:</div>
                    <ul className="space-y-1">
                      {insight.content.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.content.artists && insight.content.artists.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">Related Artists:</div>
                    <div className="flex flex-wrap gap-2">
                      {insight.content.artists.slice(0, 5).map((artist: string) => (
                        <Link
                          key={artist}
                          href={`/anr/candidates/${artist}`}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-650 rounded-lg text-sm text-cyan-400 transition-colors"
                        >
                          {artist}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-slate-800 rounded-2xl p-8 text-center text-slate-400">
              No insights yet. Click "Refresh Insights" to generate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
