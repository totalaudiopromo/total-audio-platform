/**
 * Awareness Recommendations
 * /awareness/recommendations
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Recommendation {
  id: string;
  targetSystem: string;
  recommendationType: string;
  title: string;
  description: string;
  data: any;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('pending');

  useEffect(() => {
    loadRecommendations();
  }, []);

  async function loadRecommendations() {
    try {
      setLoading(true);
      const response = await fetch('/api/awareness/recommendations?limit=100');
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  }

  async function resolveRecommendation(id: string) {
    try {
      const response = await fetch('/api/awareness/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendationId: id }),
      });

      if (response.ok) {
        await loadRecommendations();
      }
    } catch (err) {
      console.error('Failed to resolve recommendation:', err);
    }
  }

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  }

  const filteredRecommendations = recommendations.filter((rec) => {
    if (filter === 'pending') return rec.status === 'pending';
    if (filter === 'resolved') return rec.status === 'resolved';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="text-slate-400">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/awareness"
              className="text-slate-400 hover:text-white transition-colors duration-240"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Recommendations</h1>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors duration-240 ${
                filter === 'all'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors duration-240 ${
                filter === 'pending'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg transition-colors duration-240 ${
                filter === 'resolved'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {filteredRecommendations.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-400">No recommendations available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            rec.priority
                          )}`}
                        >
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">
                          Target: {rec.targetSystem}
                        </span>
                        <span className="text-xs text-slate-500">
                          Type: {rec.recommendationType}
                        </span>
                        {rec.status === 'resolved' && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                            Resolved
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-slate-300 mb-3">{rec.description}</p>

                      {rec.data?.suggestedActions && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-slate-400 mb-2">
                            Suggested Actions:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {rec.data.suggestedActions.map(
                              (action: string, idx: number) => (
                                <li key={idx} className="text-sm text-slate-300">
                                  {action}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                        <span>Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                        <span>
                          Created: {new Date(rec.createdAt).toLocaleString()}
                        </span>
                        {rec.resolvedAt && (
                          <span>
                            Resolved: {new Date(rec.resolvedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {rec.status === 'pending' && (
                      <button
                        onClick={() => resolveRecommendation(rec.id)}
                        className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors duration-240"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
