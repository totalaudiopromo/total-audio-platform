/**
 * A&R Shortlist Detail
 * /anr/shortlists/[shortlistId]
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ShortlistDetailPage() {
  const params = useParams();
  const shortlistId = params.shortlistId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShortlist();
  }, [shortlistId]);

  const fetchShortlist = async () => {
    try {
      const res = await fetch(`/api/anr/shortlists/${shortlistId}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch shortlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!data?.shortlist) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Shortlist Not Found</h1>
            <Link href="/anr/shortlists" className="text-cyan-400 hover:text-cyan-300">
              ← Back to Shortlists
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { shortlist, members } = data;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/anr/shortlists" className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block">
            ← Back to Shortlists
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{shortlist.name}</h1>
          {shortlist.description && (
            <p className="text-slate-400">{shortlist.description}</p>
          )}
          <div className="text-sm text-slate-500 mt-2">
            Created {new Date(shortlist.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Criteria */}
        {shortlist.criteria && Object.keys(shortlist.criteria).length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-3">Criteria</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shortlist.criteria.scenes && (
                <div>
                  <div className="text-sm text-slate-400">Scenes</div>
                  <div className="text-white">{shortlist.criteria.scenes.join(', ')}</div>
                </div>
              )}
              {shortlist.criteria.min_composite_score && (
                <div>
                  <div className="text-sm text-slate-400">Min Score</div>
                  <div className="font-mono text-cyan-400">
                    {(shortlist.criteria.min_composite_score * 100).toFixed(0)}%
                  </div>
                </div>
              )}
              {shortlist.criteria.limit && (
                <div>
                  <div className="text-sm text-slate-400">Limit</div>
                  <div className="text-white">{shortlist.criteria.limit}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Members */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">
              Candidates ({members.length})
            </h2>
          </div>

          {members.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-750 border-b border-slate-700">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-300">#</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-300">Artist</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-300">Scene</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-slate-300">Score</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-300">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {members.map((member: any, index: number) => (
                  <tr key={member.id} className="hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-4 text-slate-400">{member.position || index + 1}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/anr/candidates/${member.candidate?.artist_slug || member.candidate_id}`}
                        className="font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        {member.candidate?.display_name || member.candidate_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {member.candidate?.primary_scene_slug || '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-white">
                      {member.score ? `${(member.score * 100).toFixed(0)}%` : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {member.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-400">
              No candidates in this shortlist
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
