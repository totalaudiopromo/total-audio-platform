/**
 * A&R Radar - Overview Dashboard
 *
 * /anr
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CandidateWithScore {
  id: string;
  artist_slug: string;
  display_name: string;
  primary_scene_slug?: string;
  latest_score?: {
    composite_score: number;
    breakout_score: number;
    momentum_score: number;
  };
}

export default function ANRDashboard() {
  const [topCandidates, setTopCandidates] = useState<CandidateWithScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopCandidates();
  }, []);

  const fetchTopCandidates = async () => {
    try {
      const res = await fetch('/api/anr/candidates?limit=10&min_score=0.6');
      const data = await res.json();
      setTopCandidates(data.data || []);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">A&R Radar</h1>
          <p className="text-slate-400">
            Talent discovery and breakout probability system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/anr/candidates"
            className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-750 transition-colors"
          >
            <div className="text-sm text-slate-400 mb-1">Candidates</div>
            <div className="text-2xl font-bold text-cyan-400">
              {topCandidates.length}+
            </div>
          </Link>

          <Link
            href="/anr/shortlists"
            className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-750 transition-colors"
          >
            <div className="text-sm text-slate-400 mb-1">Shortlists</div>
            <div className="text-2xl font-bold text-cyan-400">—</div>
          </Link>

          <Link
            href="/anr/insights"
            className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-750 transition-colors"
          >
            <div className="text-sm text-slate-400 mb-1">Insights</div>
            <div className="text-2xl font-bold text-cyan-400">—</div>
          </Link>

          <div className="bg-slate-800 rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-1">High Momentum</div>
            <div className="text-2xl font-bold text-green-400">
              {topCandidates.filter(c => (c.latest_score?.momentum_score || 0) > 0.7).length}
            </div>
          </div>
        </div>

        {/* Top Breakout Candidates */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Top Breakout Candidates This Month
          </h2>

          {loading ? (
            <div className="text-slate-400">Loading...</div>
          ) : topCandidates.length > 0 ? (
            <div className="space-y-3">
              {topCandidates.map((candidate, index) => (
                <Link
                  key={candidate.id}
                  href={`/anr/candidates/${candidate.artist_slug}`}
                  className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-650 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-mono text-slate-500 w-6">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {candidate.display_name}
                      </div>
                      {candidate.primary_scene_slug && (
                        <div className="text-sm text-slate-400">
                          {candidate.primary_scene_slug}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Breakout</div>
                      <div className="font-mono text-cyan-400">
                        {((candidate.latest_score?.breakout_score || 0) * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-400">Momentum</div>
                      <div className="font-mono text-green-400">
                        {((candidate.latest_score?.momentum_score || 0) * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-400">Score</div>
                      <div className="font-mono font-bold text-white">
                        {((candidate.latest_score?.composite_score || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-slate-400">No candidates found</div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/anr/candidates"
            className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-750 transition-colors"
          >
            <h3 className="font-bold text-white mb-2">Browse Candidates</h3>
            <p className="text-sm text-slate-400">
              Filter and explore all candidates in the radar
            </p>
          </Link>

          <Link
            href="/anr/shortlists"
            className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-750 transition-colors"
          >
            <h3 className="font-bold text-white mb-2">Create Shortlist</h3>
            <p className="text-sm text-slate-400">
              Generate scouting shortlists from criteria
            </p>
          </Link>

          <Link
            href="/anr/insights"
            className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-750 transition-colors"
          >
            <h3 className="font-bold text-white mb-2">View Insights</h3>
            <p className="text-sm text-slate-400">
              AI-generated A&R insights and opportunities
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
