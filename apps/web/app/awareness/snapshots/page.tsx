/**
 * Awareness Snapshots History
 * /awareness/snapshots
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Snapshot {
  id: string;
  createdAt: string;
  data: {
    scores: {
      momentum: number;
      identity_cohesion: number;
      scene_alignment: number;
      creative_quality: number;
      press_effectiveness: number;
      burnout_risk: number;
      fatigue_risk: number;
    };
    currentState: {
      activeCampaigns: number;
      activeAutopilotMissions: number;
      activeMALFlows: number;
      recentCoverage: number;
      recentReplies: number;
    };
  };
}

export default function SnapshotsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSnapshots();
  }, []);

  async function loadSnapshots() {
    try {
      setLoading(true);
      const response = await fetch('/api/awareness/snapshots?limit=20');
      const data = await response.json();

      if (data.success) {
        setSnapshots(data.data);
      }
    } catch (err) {
      console.error('Failed to load snapshots:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatScore(score: number): string {
    return (score * 100).toFixed(0) + '%';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="text-slate-400">Loading snapshots...</div>
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
            <h1 className="text-2xl font-bold text-white">Snapshot History</h1>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {snapshots.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-400">No snapshots available yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-240"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Snapshot {snapshot.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {new Date(snapshot.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Current State */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">
                        System State
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Active Campaigns</span>
                          <span className="text-white font-mono">
                            {snapshot.data.currentState.activeCampaigns}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Autopilot Missions</span>
                          <span className="text-white font-mono">
                            {snapshot.data.currentState.activeAutopilotMissions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">MAL Flows</span>
                          <span className="text-white font-mono">
                            {snapshot.data.currentState.activeMALFlows}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Recent Coverage</span>
                          <span className="text-green-400 font-mono">
                            {snapshot.data.currentState.recentCoverage}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Recent Replies</span>
                          <span className="text-cyan-400 font-mono">
                            {snapshot.data.currentState.recentReplies}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scores */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">
                        Performance Scores
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Momentum</span>
                          <span className="text-cyan-400 font-mono">
                            {formatScore(snapshot.data.scores.momentum)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Identity Cohesion</span>
                          <span className="text-cyan-400 font-mono">
                            {formatScore(snapshot.data.scores.identity_cohesion)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Scene Alignment</span>
                          <span className="text-cyan-400 font-mono">
                            {formatScore(snapshot.data.scores.scene_alignment)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Creative Quality</span>
                          <span className="text-green-400 font-mono">
                            {formatScore(snapshot.data.scores.creative_quality)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Burnout Risk</span>
                          <span className="text-yellow-400 font-mono">
                            {formatScore(snapshot.data.scores.burnout_risk)}
                          </span>
                        </div>
                      </div>
                    </div>
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
