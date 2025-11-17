/**
 * Automation Flow Editor
 * /automations/[flowId]
 *
 * MVP: List-based node editor
 * Future: Visual node-based canvas with React Flow
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Flow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  triggerType: string;
}

interface Node {
  id: string;
  type: string;
  subtype: string;
  config: Record<string, any>;
  position?: { x: number; y: number };
}

interface Edge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  conditionLabel?: string;
}

export default function FlowEditorPage() {
  const params = useParams();
  const router = useRouter();
  const flowId = params.flowId as string;

  const [flow, setFlow] = useState<Flow | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFlow();
  }, [flowId]);

  async function loadFlow() {
    try {
      setLoading(true);
      const [flowRes, nodesRes, edgesRes] = await Promise.all([
        fetch(`/api/automations/flows/${flowId}`),
        fetch(`/api/automations/flows/${flowId}/nodes`),
        fetch(`/api/automations/flows/${flowId}/edges`),
      ]);

      const flowData = await flowRes.json();
      const nodesData = await nodesRes.json();
      const edgesData = await edgesRes.json();

      if (flowData.success) setFlow(flowData.data);
      if (nodesData.success) setNodes(nodesData.data);
      if (edgesData.success) setEdges(edgesData.data);
    } catch (err) {
      console.error('Failed to load flow:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addNode(type: string, subtype: string) {
    try {
      const response = await fetch(`/api/automations/flows/${flowId}/nodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          subtype,
          config: {},
          position: { x: 100 + nodes.length * 50, y: 100 },
        }),
      });

      if (response.ok) {
        await loadFlow();
      }
    } catch (err) {
      console.error('Failed to add node:', err);
    }
  }

  async function toggleActive() {
    if (!flow) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/automations/flows/${flowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !flow.isActive }),
      });

      if (response.ok) {
        await loadFlow();
      }
    } catch (err) {
      console.error('Failed to toggle active:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="text-slate-400">Loading flow...</div>
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="text-red-400">Flow not found</div>
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
              href="/automations"
              className="text-slate-400 hover:text-white transition-colors duration-240"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{flow.name}</h1>
              {flow.description && (
                <p className="text-sm text-slate-400">{flow.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                flow.isActive
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-500/20 text-slate-400'
              }`}
            >
              {flow.isActive ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={toggleActive}
              disabled={saving}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all duration-240"
            >
              {saving ? 'Saving...' : flow.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <Link
              href={`/automations/${flowId}/runs`}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-all duration-240"
            >
              View Runs
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          {/* Sidebar: Node Library */}
          <div className="col-span-3 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Add Nodes</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Triggers</h3>
                  <button
                    onClick={() => addNode('trigger', 'email_open')}
                    className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-all duration-240"
                  >
                    Email Opened
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Conditions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => addNode('condition', 'if_field_match')}
                      className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-all duration-240"
                    >
                      Field Match
                    </button>
                    <button
                      onClick={() => addNode('condition', 'if_metric_greater')}
                      className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-all duration-240"
                    >
                      Metric Greater
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => addNode('action', 'send_email_campaign')}
                      className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-all duration-240"
                    >
                      Send Email
                    </button>
                    <button
                      onClick={() => addNode('action', 'update_segment')}
                      className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-all duration-240"
                    >
                      Update Segment
                    </button>
                    <button
                      onClick={() => addNode('action', 'tag_contact')}
                      className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-all duration-240"
                    >
                      Tag Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas: Node List (MVP) */}
          <div className="col-span-9">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-white mb-6">Workflow Nodes</h2>

              {nodes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-4">
                    No nodes yet. Add nodes from the sidebar to build your workflow.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                node.type === 'trigger'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : node.type === 'condition'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {node.type}
                            </span>
                            <h3 className="font-semibold text-white">{node.subtype}</h3>
                          </div>
                          <div className="text-sm text-slate-400">
                            Config: {JSON.stringify(node.config)}
                          </div>
                        </div>
                        <span className="text-slate-500 font-mono text-sm">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {nodes.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">
                    Connections ({edges.length})
                  </h3>
                  {edges.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No connections yet. Nodes will execute in sequence.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {edges.map((edge) => (
                        <div
                          key={edge.id}
                          className="text-sm text-slate-400 bg-slate-800/30 rounded px-3 py-2"
                        >
                          {edge.sourceNodeId} → {edge.targetNodeId}
                          {edge.conditionLabel && ` (${edge.conditionLabel})`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-xl">
              <p className="text-sm text-blue-400">
                <strong>MVP Note:</strong> This is a simplified list-based editor. The full
                visual canvas with drag-and-drop nodes will be implemented using React Flow
                in a future iteration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
