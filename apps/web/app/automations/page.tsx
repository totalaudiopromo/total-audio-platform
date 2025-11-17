/**
 * Automations List Page
 * /automations
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Flow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  triggerType: string;
  createdAt: string;
  updatedAt: string;
}

export default function AutomationsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFlows();
  }, []);

  async function loadFlows() {
    try {
      setLoading(true);
      const response = await fetch('/api/automations/flows');
      const data = await response.json();

      if (data.success) {
        setFlows(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load automations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFlowActive(flowId: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/automations/flows/${flowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        await loadFlows();
      }
    } catch (err) {
      console.error('Failed to toggle flow:', err);
    }
  }

  async function deleteFlow(flowId: string) {
    if (!confirm('Are you sure you want to delete this automation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/automations/flows/${flowId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadFlows();
      }
    } catch (err) {
      console.error('Failed to delete flow:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-slate-400">Loading automations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Marketing Automations
            </h1>
            <p className="text-slate-400">
              Visual workflow builder for music marketing automations
            </p>
          </div>
          <Link
            href="/automations/new"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-all duration-240 ease-out"
          >
            New Automation
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {flows.length === 0 && !error && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              No automations yet
            </h3>
            <p className="text-slate-400 mb-6">
              Create your first automation workflow to streamline your music marketing
            </p>
            <Link
              href="/automations/new"
              className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-all duration-240"
            >
              Create First Automation
            </Link>
          </div>
        )}

        {/* Flows List */}
        {flows.length > 0 && (
          <div className="space-y-4">
            {flows.map((flow) => (
              <div
                key={flow.id}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-240"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {flow.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          flow.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {flow.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                        {flow.triggerType}
                      </span>
                    </div>
                    {flow.description && (
                      <p className="text-slate-400 mb-4">{flow.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>
                        Created {new Date(flow.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        Updated {new Date(flow.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFlowActive(flow.id, flow.isActive)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-240 ${
                        flow.isActive
                          ? 'bg-slate-700 hover:bg-slate-600 text-white'
                          : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                      }`}
                    >
                      {flow.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <Link
                      href={`/automations/${flow.id}`}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all duration-240"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/automations/${flow.id}/runs`}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all duration-240"
                    >
                      Runs
                    </Link>
                    <button
                      onClick={() => deleteFlow(flow.id)}
                      className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg text-sm font-medium transition-all duration-240"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
