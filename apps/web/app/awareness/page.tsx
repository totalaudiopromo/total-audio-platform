/**
 * Core Awareness Dashboard
 * /awareness
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SystemHealth {
  autopilot: { status: string; activeCount: number; successRate: number };
  mal: { status: string; activeCount: number; successRate: number };
  campaigns: { status: string; activeCount: number; successRate: number };
  creative: { status: string; activeCount: number; successRate: number };
}

interface Scores {
  momentum: number;
  identity_cohesion: number;
  scene_alignment: number;
  creative_quality: number;
  press_effectiveness: number;
  burnout_risk: number;
  fatigue_risk: number;
}

interface Snapshot {
  id: string;
  createdAt: string;
  data: {
    systemHealth: SystemHealth;
    scores: Scores;
    correlations: any[];
    mismatches: any[];
    opportunities: any[];
    risks: any[];
  };
}

export default function AwarenessDashboard() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestSnapshot();
  }, []);

  async function loadLatestSnapshot() {
    try {
      setLoading(true);
      const response = await fetch('/api/awareness/snapshots?latest=true');
      const data = await response.json();

      if (data.success) {
        setSnapshot(data.data);
      }
    } catch (err) {
      console.error('Failed to load snapshot:', err);
    } finally {
      setLoading(false);
    }
  }

  async function runCycle() {
    try {
      setLoading(true);
      const response = await fetch('/api/awareness/run-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user' }),
      });

      const data = await response.json();
      if (data.success) {
        await loadLatestSnapshot();
      }
    } catch (err) {
      console.error('Failed to run cycle:', err);
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number, inverted = false): string {
    if (inverted) {
      // For risk scores (higher is worse)
      if (score > 0.7) return 'text-red-400';
      if (score > 0.4) return 'text-yellow-400';
      return 'text-green-400';
    } else {
      // For quality scores (higher is better)
      if (score > 0.7) return 'text-green-400';
      if (score > 0.4) return 'text-yellow-400';
      return 'text-red-400';
    }
  }

  function formatScore(score: number): string {
    return (score * 100).toFixed(0) + '%';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="text-slate-400">Loading awareness data...</div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Core Awareness</h1>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 mb-6">No awareness data available yet</p>
            <button
              onClick={runCycle}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors duration-240"
            >
              Run Initial Awareness Cycle
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { systemHealth, scores, correlations, mismatches, opportunities, risks } =
    snapshot.data;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Core Awareness</h1>
            <p className="text-sm text-slate-400 mt-1">
              Last updated: {new Date(snapshot.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={runCycle}
            disabled={loading}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white rounded-lg transition-colors duration-240"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Quick Nav */}
          <div className="grid grid-cols-4 gap-4">
            <Link
              href="/awareness/snapshots"
              className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-all duration-240"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Snapshots</h3>
              <p className="text-sm text-slate-400">View historical data</p>
            </Link>
            <Link
              href="/awareness/recommendations"
              className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-all duration-240"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
              <p className="text-sm text-slate-400">Actionable suggestions</p>
            </Link>
            <Link
              href="/awareness/signals"
              className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-all duration-240"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Signals</h3>
              <p className="text-sm text-slate-400">System communications</p>
            </Link>
            <Link
              href="/awareness/risks-and-opportunities"
              className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-all duration-240"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Risks & Opportunities
              </h3>
              <p className="text-sm text-slate-400">Strategic insights</p>
            </Link>
          </div>

          {/* System Health */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">System Health</h2>
            <div className="grid grid-cols-4 gap-6">
              {Object.entries(systemHealth).map(([system, health]) => (
                <div key={system} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-300 capitalize">
                      {system}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        health.status === 'healthy'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {health.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {health.activeCount}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatScore(health.successRate)} success rate
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scores */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Performance Scores</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-slate-400 mb-4">Quality Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Momentum</span>
                    <span className={`font-mono ${getScoreColor(scores.momentum)}`}>
                      {formatScore(scores.momentum)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Identity Cohesion</span>
                    <span
                      className={`font-mono ${getScoreColor(scores.identity_cohesion)}`}
                    >
                      {formatScore(scores.identity_cohesion)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Scene Alignment</span>
                    <span
                      className={`font-mono ${getScoreColor(scores.scene_alignment)}`}
                    >
                      {formatScore(scores.scene_alignment)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Creative Quality</span>
                    <span
                      className={`font-mono ${getScoreColor(scores.creative_quality)}`}
                    >
                      {formatScore(scores.creative_quality)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-slate-400 mb-4">Campaign Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Press Effectiveness</span>
                    <span
                      className={`font-mono ${getScoreColor(scores.press_effectiveness)}`}
                    >
                      {formatScore(scores.press_effectiveness)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-slate-400 mb-4">Risk Indicators</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Burnout Risk</span>
                    <span
                      className={`font-mono ${getScoreColor(scores.burnout_risk, true)}`}
                    >
                      {formatScore(scores.burnout_risk)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Fatigue Risk</span>
                    <span
                      className={`font-mono ${getScoreColor(scores.fatigue_risk, true)}`}
                    >
                      {formatScore(scores.fatigue_risk)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {correlations?.length || 0}
              </div>
              <div className="text-sm text-slate-400">Correlations Detected</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {mismatches?.length || 0}
              </div>
              <div className="text-sm text-slate-400">Mismatches Found</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {opportunities?.length || 0}
              </div>
              <div className="text-sm text-slate-400">Opportunities</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {risks?.length || 0}
              </div>
              <div className="text-sm text-slate-400">Risks Identified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
