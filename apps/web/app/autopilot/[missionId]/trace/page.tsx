/**
 * Trace Timeline Page
 * View detailed execution trace with agent activities, decisions, and events
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

interface FormattedTraceEvent {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  details: Record<string, unknown>;
  color: string;
  icon: string;
}

interface TraceSummary {
  totalEvents: number;
  eventsByType: Record<string, number>;
  duration: number;
  agentsInvolved: number;
  tasksProcessed: number;
  errorsCount: number;
}

interface Run {
  id: string;
  created_at: string;
  status: string;
}

export default function TracePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const missionId = params.missionId as string;

  const [events, setEvents] = useState<FormattedTraceEvent[]>([]);
  const [summary, setSummary] = useState<TraceSummary | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    searchParams.get('runId')
  );
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'summary'>('timeline');

  useEffect(() => {
    fetchRuns();
  }, [missionId]);

  useEffect(() => {
    if (selectedRunId) {
      fetchTrace();
    }
  }, [selectedRunId]);

  async function fetchRuns() {
    try {
      const response = await fetch(`/api/autopilot/missions/${missionId}/runs`);
      const data = await response.json();
      setRuns(data.runs || []);

      // Auto-select latest run if none selected
      if (!selectedRunId && data.runs?.length > 0) {
        setSelectedRunId(data.runs[0].id);
      }
    } catch (error) {
      console.error('Failed to load runs:', error);
    }
  }

  async function fetchTrace() {
    if (!selectedRunId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/autopilot/missions/${missionId}/trace?runId=${selectedRunId}&format=timeline`
      );
      const data = await response.json();

      setEvents(data.events || []);

      // Fetch summary separately
      const summaryRes = await fetch(
        `/api/autopilot/missions/${missionId}/trace?runId=${selectedRunId}&format=summary`
      );
      const summaryData = await summaryRes.json();
      setSummary(summaryData.summary);
    } catch (error) {
      console.error('Failed to load trace:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEvents = filterType === 'all'
    ? events
    : events.filter((e) => e.type === filterType);

  const eventTypes = Array.from(new Set(events.map((e) => e.type)));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="text-white">Loading trace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Execution Trace</h1>
            <p className="mt-2 text-slate-400">
              Detailed timeline of agent activities, decisions, and events
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('timeline')}
              className={`rounded-xl px-4 py-2 font-medium transition-all duration-240 ${
                viewMode === 'timeline'
                  ? 'bg-[#3AA9BE] text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('summary')}
              className={`rounded-xl px-4 py-2 font-medium transition-all duration-240 ${
                viewMode === 'summary'
                  ? 'bg-[#3AA9BE] text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Summary
            </button>
          </div>
        </div>

        {/* Run Selector & Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Select Run
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

          {viewMode === 'timeline' && (
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white focus:border-[#3AA9BE] focus:outline-none focus:ring-1 focus:ring-[#3AA9BE]"
              >
                <option value="all">All Events ({events.length})</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')} (
                    {events.filter((e) => e.type === type).length})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Summary View */}
        {viewMode === 'summary' && summary && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Events" value={summary.totalEvents.toString()} />
            <StatCard
              label="Duration"
              value={`${(summary.duration / 1000).toFixed(1)}s`}
            />
            <StatCard label="Agents Involved" value={summary.agentsInvolved.toString()} />
            <StatCard label="Tasks Processed" value={summary.tasksProcessed.toString()} />

            <div className="col-span-full rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Events by Type</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {Object.entries(summary.eventsByType).map(([type, count]) => (
                  <div
                    key={type}
                    className="rounded-xl bg-slate-900/50 p-3 text-center"
                  >
                    <div className="text-2xl font-bold text-[#3AA9BE]">{count}</div>
                    <div className="text-xs text-slate-400">
                      {type.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {summary.errorsCount > 0 && (
              <div className="col-span-full rounded-2xl border border-red-500/50 bg-red-500/10 p-6">
                <h3 className="mb-2 text-lg font-semibold text-red-400">
                  ⚠️ {summary.errorsCount} Error(s) Detected
                </h3>
                <p className="text-sm text-red-300">
                  Review the timeline to investigate error events
                </p>
              </div>
            )}
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Event Timeline ({filteredEvents.length})
            </h2>

            {filteredEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                {selectedRunId
                  ? 'No events found for this run'
                  : 'Select a run to view trace events'}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event, idx) => (
                  <div
                    key={event.id}
                    className="group relative rounded-xl border border-slate-700 bg-slate-900/50 p-4 transition-all duration-240 hover:border-[#3AA9BE]"
                  >
                    {/* Timeline Connector */}
                    {idx < filteredEvents.length - 1 && (
                      <div
                        className="absolute left-[30px] top-[60px] h-3 w-px bg-slate-700"
                        style={{ height: '12px' }}
                      />
                    )}

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${event.color}`}
                        style={{
                          backgroundColor: event.color.includes('emerald')
                            ? 'rgba(16, 185, 129, 0.2)'
                            : event.color.includes('blue')
                              ? 'rgba(59, 130, 246, 0.2)'
                              : event.color.includes('amber')
                                ? 'rgba(245, 158, 11, 0.2)'
                                : event.color.includes('red')
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : event.color.includes('purple')
                                    ? 'rgba(168, 85, 247, 0.2)'
                                    : 'rgba(148, 163, 184, 0.2)',
                        }}
                      >
                        {event.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium text-white">{event.message}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="mb-2 text-xs text-slate-500">
                          {event.type.replace(/_/g, ' ')}
                        </div>

                        {/* Details */}
                        {Object.keys(event.details).length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs text-[#3AA9BE] hover:underline">
                              View Details
                            </summary>
                            <pre className="mt-2 overflow-auto rounded-lg bg-slate-950/50 p-3 text-xs text-slate-300">
                              {JSON.stringify(event.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
