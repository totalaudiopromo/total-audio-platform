/**
 * Snapshots Page
 * View and compare mission snapshots
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Snapshot {
  id: string;
  created_at: string;
  snapshot: {
    stats: {
      totalTasks: number;
      completedTasks: number;
      pendingTasks: number;
      failedTasks: number;
    };
    label?: string;
  };
}

export default function SnapshotsPage() {
  const params = useParams();
  const missionId = params.missionId as string;

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshots, setSelectedSnapshots] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSnapshots();
  }, [missionId]);

  async function fetchSnapshots() {
    try {
      const response = await fetch(`/api/autopilot/missions/${missionId}/snapshot`);
      const data = await response.json();
      setSnapshots(data.snapshots || []);
    } catch (error) {
      console.error('Failed to load snapshots:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createSnapshot() {
    try {
      const response = await fetch(`/api/autopilot/missions/${missionId}/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        fetchSnapshots();
      }
    } catch (error) {
      console.error('Failed to create snapshot:', error);
    }
  }

  function selectSnapshot(index: 0 | 1, snapshotId: string) {
    const newSelected: [string | null, string | null] = [...selectedSnapshots];
    newSelected[index] = snapshotId;
    setSelectedSnapshots(newSelected);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="text-white">Loading snapshots...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Snapshots</h1>
          <button
            onClick={createSnapshot}
            className="rounded-xl bg-[#3AA9BE] px-6 py-3 font-semibold text-white transition-all duration-240 hover:bg-[#3AA9BE]/90"
          >
            Take Snapshot
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Snapshots List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Available Snapshots</h2>
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="cursor-pointer rounded-2xl border border-slate-700 bg-slate-800/50 p-4 transition-all duration-240 hover:border-[#3AA9BE]"
                onClick={() => selectSnapshot(0, snapshot.id)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">
                    {snapshot.snapshot.label || 'Snapshot'}
                  </span>
                  <span className="text-sm text-slate-400">
                    {new Date(snapshot.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Stat
                    label="Total"
                    value={snapshot.snapshot.stats.totalTasks.toString()}
                  />
                  <Stat
                    label="Completed"
                    value={snapshot.snapshot.stats.completedTasks.toString()}
                  />
                  <Stat
                    label="Pending"
                    value={snapshot.snapshot.stats.pendingTasks.toString()}
                  />
                  <Stat
                    label="Failed"
                    value={snapshot.snapshot.stats.failedTasks.toString()}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Diff Viewer */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Snapshot Comparison</h2>
            {selectedSnapshots[0] ? (
              <div className="space-y-4">
                <div className="text-sm text-slate-400">
                  Select another snapshot to compare
                </div>
                {selectedSnapshots[1] ? (
                  <div className="rounded-xl bg-slate-900/50 p-4">
                    <p className="text-white">Comparison view</p>
                    <p className="text-sm text-slate-400">
                      Comparing: {selectedSnapshots[0].substring(0, 8)} vs{' '}
                      {selectedSnapshots[1].substring(0, 8)}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-sm text-slate-400">
                Select a snapshot to view details and compare
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-medium text-white">{value}</div>
    </div>
  );
}
