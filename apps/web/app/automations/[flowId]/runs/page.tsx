/**
 * Automation Runs History
 * /automations/[flowId]/runs
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Execution {
  id: string;
  flowId: string;
  triggerContext: any;
  status: string;
  startedAt: string;
  finishedAt?: string;
  error?: string;
}

interface ExecutionStep {
  id: string;
  nodeId: string;
  status: string;
  input?: any;
  output?: any;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
}

export default function RunsHistoryPage() {
  const params = useParams();
  const flowId = params.flowId as string;

  const [executions, setExecutions] = useState<Execution[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExecutions();
  }, [flowId]);

  useEffect(() => {
    if (selectedExecution) {
      loadExecutionDetails(selectedExecution);
    }
  }, [selectedExecution]);

  async function loadExecutions() {
    try {
      setLoading(true);
      const response = await fetch(`/api/automations/flows/${flowId}/executions`);
      const data = await response.json();

      if (data.success) {
        setExecutions(data.data);
      }
    } catch (err) {
      console.error('Failed to load executions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadExecutionDetails(executionId: string) {
    try {
      const response = await fetch(
        `/api/automations/flows/${flowId}/executions/${executionId}`
      );
      const data = await response.json();

      if (data.success) {
        setExecutionSteps(data.data.steps);
      }
    } catch (err) {
      console.error('Failed to load execution details:', err);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'succeeded':
        return 'bg-green-500/20 text-green-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      case 'running':
        return 'bg-blue-500/20 text-blue-400';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="text-slate-400">Loading execution history...</div>
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
              href={`/automations/${flowId}`}
              className="text-slate-400 hover:text-white transition-colors duration-240"
            >
              ← Back to Editor
            </Link>
            <h1 className="text-2xl font-bold text-white">Execution History</h1>
          </div>
          <Link
            href="/automations"
            className="text-slate-400 hover:text-white transition-colors duration-240"
          >
            All Automations
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          {/* Executions List */}
          <div className="col-span-5">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white">
                  Recent Runs ({executions.length})
                </h2>
              </div>

              {executions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-400">No executions yet</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Trigger this automation to see execution history
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {executions.map((execution) => (
                    <button
                      key={execution.id}
                      onClick={() => setSelectedExecution(execution.id)}
                      className={`w-full text-left p-6 hover:bg-slate-800/50 transition-all duration-240 ${
                        selectedExecution === execution.id ? 'bg-slate-800/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            execution.status
                          )}`}
                        >
                          {execution.status}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(execution.startedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-sm text-slate-400">
                        Trigger: {execution.triggerContext.type}
                      </div>

                      {execution.finishedAt && (
                        <div className="text-xs text-slate-500 mt-2">
                          Duration:{' '}
                          {Math.round(
                            (new Date(execution.finishedAt).getTime() -
                              new Date(execution.startedAt).getTime()) /
                              1000
                          )}
                          s
                        </div>
                      )}

                      {execution.error && (
                        <div className="text-xs text-red-400 mt-2 truncate">
                          Error: {execution.error}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Execution Details */}
          <div className="col-span-7">
            {selectedExecution ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                  <h2 className="text-lg font-semibold text-white">Execution Steps</h2>
                </div>

                {executionSteps.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-slate-400">No steps recorded</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {executionSteps.map((step, index) => (
                      <div key={step.id} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 font-mono text-sm">
                              #{index + 1}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                step.status
                              )}`}
                            >
                              {step.status}
                            </span>
                          </div>
                          {step.startedAt && step.finishedAt && (
                            <span className="text-xs text-slate-500">
                              {Math.round(
                                (new Date(step.finishedAt).getTime() -
                                  new Date(step.startedAt).getTime()) /
                                  1000
                              )}
                              s
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-slate-400 mb-3">
                          Node ID: <code className="text-slate-300">{step.nodeId}</code>
                        </div>

                        {step.output && (
                          <details className="mb-3">
                            <summary className="text-sm text-slate-400 cursor-pointer hover:text-white">
                              Output
                            </summary>
                            <pre className="mt-2 p-3 bg-slate-800/50 rounded-lg text-xs text-slate-300 overflow-x-auto">
                              {JSON.stringify(step.output, null, 2)}
                            </pre>
                          </details>
                        )}

                        {step.error && (
                          <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                            <p className="text-sm text-red-400">{step.error}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <p className="text-slate-400">Select an execution to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
