/**
 * A&R Scene View
 * /anr/scenes/[sceneSlug]
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ScenePage() {
  const params = useParams();
  const sceneSlug = params.sceneSlug as string;

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSceneCandidates();
  }, [sceneSlug]);

  const fetchSceneCandidates = async () => {
    try {
      const res = await fetch(`/api/anr/scenes/${sceneSlug}/candidates`);
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (error) {
      console.error('Failed to fetch scene candidates:', error);
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
          <h1 className="text-3xl font-bold text-white mb-2 capitalize">
            {sceneSlug.replace(/-/g, ' ')} Scene
          </h1>
          <p className="text-slate-400">Top prospects in this scene</p>
        </div>

        {/* Top 5 Prospects */}
        {candidates.slice(0, 5).length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Top 5 Prospects</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {candidates.slice(0, 5).map((candidate, index) => (
                <Link
                  key={candidate.id}
                  href={`/anr/candidates/${candidate.artist_slug}`}
                  className="bg-slate-700 rounded-xl p-4 hover:bg-slate-650 transition-colors text-center"
                >
                  <div className="text-xs text-slate-400 mb-2">#{index + 1}</div>
                  <div className="font-semibold text-white mb-2">{candidate.display_name}</div>
                  <div className="text-2xl font-mono font-bold text-cyan-400">
                    {((candidate.latest_score?.composite_score || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Score</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Candidates */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">
              All Candidates ({candidates.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : candidates.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-750 border-b border-slate-700">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Artist</th>
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
            <div className="p-8 text-center text-slate-400">No candidates in this scene</div>
          )}
        </div>
      </div>
    </div>
  );
}
