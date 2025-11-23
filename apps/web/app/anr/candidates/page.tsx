/**
 * A&R Candidates List
 * /anr/candidates
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    scene: '',
    country: '',
    minScore: 0.5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, [filters]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        min_score: filters.minScore.toString(),
        limit: '50',
      });

      if (filters.scene) params.append('scenes', filters.scene);
      if (filters.country) params.append('countries', filters.country);

      const res = await fetch(`/api/anr/candidates?${params}`);
      const data = await res.json();
      setCandidates(data.data || []);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/anr" className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Candidates</h1>
          <p className="text-slate-400">Browse and filter all candidates in the radar</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Min Score</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.minScore}
                onChange={(e) => setFilters({ ...filters, minScore: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="text-sm text-cyan-400 font-mono mt-1">
                {(filters.minScore * 100).toFixed(0)}%
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Scene</label>
              <input
                type="text"
                value={filters.scene}
                onChange={(e) => setFilters({ ...filters, scene: e.target.value })}
                placeholder="e.g. hyperpop-uk"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Country</label>
              <input
                type="text"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                placeholder="e.g. UK"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : candidates.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-750 border-b border-slate-700">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Artist</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Scene</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">Breakout</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">Momentum</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {candidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="hover:bg-slate-750 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/anr/candidates/${candidate.artist_slug}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{candidate.display_name}</div>
                      <div className="text-sm text-slate-400">{candidate.artist_slug}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {candidate.primary_scene_slug || '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-cyan-400">
                      {((candidate.latest_score?.breakout_score || 0) * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-green-400">
                      {((candidate.latest_score?.momentum_score || 0) * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-white">
                      {((candidate.latest_score?.composite_score || 0) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-400">No candidates found</div>
          )}
        </div>
      </div>
    </div>
  );
}
