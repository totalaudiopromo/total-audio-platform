/**
 * Replays Page
 * View and execute mission replays
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Replay {
  id: string;
  created_at: string;
  original_run_id: string;
  replay_run_id: string | null;
  context_snapshot: Record<string, unknown>;
  decisions: Record<string, unknown>;
  comparison?: {
    matchPercentage: number;
    deviations: Array<{
      taskId: string;
      field: string;
      originalValue: unknown;
      replayValue: unknown;
    }>;
  };
}

interface Run {
  id: string;
  created_at: string;
  status: string;
  completed_at?: string;
}

export default function ReplaysPage() {
  const params = useParams();
  const missionId = params.missionId as string;

  const [replays, setReplays] = useState<Replay[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [comparing, setComparing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [missionId]);

  async function fetchData() {
    try {
      const [replaysRes, runsRes] = await Promise.all([
        fetch(`/api/autopilot/missions/${missionId}/replay`),
        fetch(`/api/autopilot/missions/${missionId}/runs`),
      ]);

      const replaysData = await replaysRes.json();
      const runsData = await runsRes.json();

      setReplays(replaysData.replays || []);
      setRuns(runsData.runs || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function executeReplay() {
    if (!selectedRunId) return;

    setExecuting(true);
    try {
      const response = await fetch(`/api/autopilot/missions/${missionId}/replay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalRunId: selectedRunId }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchData();

        // Auto-compare if replay completed
        if (data.replay?.matchPercentage !== undefined) {
          const newReplay = replays.find((r) => r.replay_run_id === data.replay.replayRunId);
          if (newReplay) {
            setComparing(newReplay.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to execute replay:', error);
    } finally {
      setExecuting(false);
    }
  }

  async function compareReplay(replayId: string) {
    setComparing(replayId);
    try {
      const response = await fetch(`/api/autopilot/missions/${missionId}/replay/${replayId}/compare`);
      const data = await response.json();

      // Update replay with comparison data
      setReplays((prev) =>
        prev.map((r) =>
          r.id === replayId
            ? {
                ...r,
                comparison: {
                  matchPercentage: data.overallMatch,
                  deviations: data.taskComparisons
                    .filter((tc: { matched: boolean }) => !tc.matched)
                    .map((tc: { taskId: string; differences: { field: string; original: unknown; replay: unknown }[] }) => ({
                      taskId: tc.taskId,
                      field: tc.differences[0]?.field || 'unknown',
                      originalValue: tc.differences[0]?.original,
                      replayValue: tc.differences[0]?.replay,
                    })),
                },
              }
            : r
        )
      );
    } catch (error) {
      console.error('Failed to compare replay:', error);
    } finally {
      setComparing(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="text-white">Loading replays...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mission Replays</h1>
          <p className="mt-2 text-slate-400">
            Re-run previous missions with identical context and decisions for debugging and validation
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Create Replay Section */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Create New Replay</h2>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Select Run to Replay
              </label>
              <select
                value={selectedRunId || ''}
                onChange={(e) => setSelectedRunId(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white focus:border-[#3AA9BE] focus:outline-none focus:ring-1 focus:ring-[#3AA9BE]"
              >
                <option value="">Choose a run...</option>
                {runs.map((run) => (
                  <option key={run.id} value={run.id}>
                    {new Date(run.created_at).toLocaleString()} - {run.status}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={executeReplay}
              disabled={!selectedRunId || executing}
              className="w-full rounded-xl bg-[#3AA9BE] px-6 py-3 font-semibold text-white transition-all duration-240 hover:bg-[#3AA9BE]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {executing ? 'Executing Replay...' : 'Replay Run'}
            </button>

            <div className="mt-4 rounded-xl bg-slate-900/50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">What is a Replay?</h3>
              <p className="text-sm text-slate-400">
                A replay re-executes a previous run with the same context, configuration, and
                decisions. This allows you to verify deterministic behavior and debug issues.
              </p>
            </div>
          </div>

          {/* Replay History */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Replay History</h2>

            <div className="space-y-3">
              {replays.length === 0 ? (
                <div className="text-center text-sm text-slate-400">
                  No replays yet. Create your first replay to get started.
                </div>
              ) : (
                replays.map((replay) => (
                  <div
                    key={replay.id}
                    className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 transition-all duration-240 hover:border-[#3AA9BE]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {new Date(replay.created_at).toLocaleString()}
                      </span>
                      {replay.replay_run_id ? (
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                          Completed
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
                          Pending
                        </span>
                      )}
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Original Run:</span>
                        <div className="font-mono text-slate-300">
                          {replay.original_run_id.substring(0, 8)}
                        </div>
                      </div>
                      {replay.replay_run_id && (
                        <div>
                          <span className="text-slate-400">Replay Run:</span>
                          <div className="font-mono text-slate-300">
                            {replay.replay_run_id.substring(0, 8)}
                          </div>
                        </div>
                      )}
                    </div>

                    {replay.comparison && (
                      <div className="mb-3 rounded-lg bg-slate-800/50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-400">Match Rate</span>
                          <span
                            className={`text-sm font-bold ${
                              replay.comparison.matchPercentage >= 95
                                ? 'text-emerald-400'
                                : replay.comparison.matchPercentage >= 80
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                            }`}
                          >
                            {(replay.comparison.matchPercentage * 100).toFixed(1)}%
                          </span>
                        </div>
                        {replay.comparison.deviations.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="text-xs font-medium text-slate-400">
                              {replay.comparison.deviations.length} deviation(s)
                            </div>
                            {replay.comparison.deviations.slice(0, 2).map((dev, idx) => (
                              <div key={idx} className="text-xs text-slate-500">
                                Task {dev.taskId.substring(0, 8)}: {dev.field} changed
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {replay.replay_run_id && !replay.comparison && (
                      <button
                        onClick={() => compareReplay(replay.id)}
                        disabled={comparing === replay.id}
                        className="w-full rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-all duration-240 hover:bg-slate-600 disabled:opacity-50"
                      >
                        {comparing === replay.id ? 'Comparing...' : 'Compare to Original'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
