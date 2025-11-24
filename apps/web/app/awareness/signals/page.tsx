/**
 * Awareness Signals Timeline
 * /awareness/signals
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Signal {
  id: string;
  targetSystem: string;
  signalType: string;
  payload: any;
  confidence: number;
  status: 'pending' | 'actioned';
  createdAt: string;
  actionedAt?: string;
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetFilter, setTargetFilter] = useState<string>('all');

  useEffect(() => {
    loadSignals();
  }, [targetFilter]);

  async function loadSignals() {
    try {
      setLoading(true);
      const url =
        targetFilter === 'all'
          ? '/api/awareness/signals?limit=100'
          : `/api/awareness/signals?targetSystem=${targetFilter}&limit=100`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSignals(data.data);
      }
    } catch (err) {
      console.error('Failed to load signals:', err);
    } finally {
      setLoading(false);
    }
  }

  async function actionSignal(id: string) {
    try {
      const response = await fetch('/api/awareness/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signalId: id }),
      });

      if (response.ok) {
        await loadSignals();
      }
    } catch (err) {
      console.error('Failed to action signal:', err);
    }
  }

  const targetSystems = [
    'all',
    'identity_kernel',
    'autopilot',
    'mal',
    'dashboard',
    'cis',
    'cmg',
    'scenes_engine',
    'mig',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="text-slate-400">Loading signals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/awareness"
                className="text-slate-400 hover:text-white transition-colors duration-240"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-white">Signals Timeline</h1>
            </div>
          </div>

          {/* Target System Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {targetSystems.map((system) => (
              <button
                key={system}
                onClick={() => setTargetFilter(system)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors duration-240 ${
                  targetFilter === system
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {system === 'all' ? 'All Systems' : system}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {signals.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-400">No signals available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {signals.map((signal, idx) => (
                <div
                  key={signal.id}
                  className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                >
                  {/* Timeline connector */}
                  {idx < signals.length - 1 && (
                    <div className="absolute left-10 top-full w-0.5 h-3 bg-slate-800" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Timeline dot */}
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full mt-1 ${
                        signal.status === 'actioned'
                          ? 'bg-green-500'
                          : 'bg-cyan-500 animate-pulse'
                      }`}
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-white">
                            {signal.signalType}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded">
                            → {signal.targetSystem}
                          </span>
                          {signal.status === 'actioned' && (
                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                              Actioned
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(signal.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="text-sm text-slate-400 mb-2">Payload:</div>
                        <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 overflow-x-auto">
                          {JSON.stringify(signal.payload, null, 2)}
                        </pre>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          <span>Confidence: {(signal.confidence * 100).toFixed(0)}%</span>
                          {signal.actionedAt && (
                            <span className="ml-4">
                              Actioned: {new Date(signal.actionedAt).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {signal.status === 'pending' && (
                          <button
                            onClick={() => actionSignal(signal.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors duration-240"
                          >
                            Mark Actioned
                          </button>
                        )}
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
