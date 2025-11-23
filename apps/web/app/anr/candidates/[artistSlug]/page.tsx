/**
 * A&R Candidate Detail
 * /anr/candidates/[artistSlug]
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CandidateDetailPage() {
  const params = useParams();
  const artistSlug = params.artistSlug as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidate();
  }, [artistSlug]);

  const fetchCandidate = async () => {
    try {
      const res = await fetch(`/api/anr/candidates/${artistSlug}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetch(`/api/anr/candidates/${artistSlug}/refresh`, { method: 'POST' });
      await fetchCandidate();
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!data?.candidate) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Candidate Not Found</h1>
            <Link href="/anr/candidates" className="text-cyan-400 hover:text-cyan-300">
              ← Back to Candidates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { candidate, latest_score, score_history, events, breakout_probability } = data;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/anr/candidates" className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block">
            ← Back to Candidates
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{candidate.display_name}</h1>
              <div className="flex items-center space-x-4 text-slate-400">
                {candidate.primary_scene_slug && <span>{candidate.primary_scene_slug}</span>}
                {candidate.country && <span>{candidate.country}</span>}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              Refresh Scores
            </button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-1">Composite Score</div>
            <div className="text-3xl font-bold font-mono text-white">
              {((latest_score?.composite_score || 0) * 100).toFixed(0)}%
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-1">Breakout</div>
            <div className="text-3xl font-bold font-mono text-cyan-400">
              {((latest_score?.breakout_score || 0) * 100).toFixed(0)}%
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-1">Momentum</div>
            <div className="text-3xl font-bold font-mono text-green-400">
              {((latest_score?.momentum_score || 0) * 100).toFixed(0)}%
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-1">Risk</div>
            <div className="text-3xl font-bold font-mono text-red-400">
              {((latest_score?.risk_score || 0) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Dimension Scores */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Dimension Scores</h2>
          <div className="space-y-3">
            {latest_score && Object.entries({
              'Scene Alignment': latest_score.scene_alignment_score,
              'Creative Uniqueness': latest_score.creative_uniqueness_score,
              'Campaign Efficiency': latest_score.campaign_efficiency_score,
              'Engagement Quality': latest_score.engagement_quality_score,
            }).map(([label, score]) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{label}</span>
                  <span className="font-mono text-cyan-400">{((score as number) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all"
                    style={{ width: `${(score as number) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        {events && events.length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Recent Events</h2>
            <div className="space-y-2">
              {events.slice(0, 10).map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <div className="font-semibold text-white">{event.event_type.replace(/_/g, ' ')}</div>
                    <div className="text-sm text-slate-400">{event.event_date}</div>
                  </div>
                  <div className="text-sm text-slate-400">{event.source}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breakout Probability */}
        {breakout_probability && (
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Breakout Probability</h2>
            <div className="text-4xl font-bold font-mono text-cyan-400 mb-2">
              {(breakout_probability.probability * 100).toFixed(0)}%
            </div>
            <p className="text-slate-300 mb-4">{breakout_probability.explanation}</p>
            <div className="text-sm text-slate-400">
              Confidence: {(breakout_probability.confidence * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
