/**
 * History/Progress Page
 * View progress history and metrics
 */

'use client';

import React, { useEffect, useState } from 'react';
import { ProgressChart } from '../components/ProgressChart';

export default function HistoryPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, sessionsRes] = await Promise.all([
        fetch('/api/coach/progress'),
        fetch('/api/coach/sessions?limit=10'),
      ]);

      const [metricsData, sessionsData] = await Promise.all([
        metricsRes.json(),
        sessionsRes.json(),
      ]);

      setMetrics(metricsData.metrics || []);
      setSessions(sessionsData.sessions || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white/70">Loading progress data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white/90 mb-2">Progress History</h1>
          <p className="text-white/60">Track your growth over time</p>
        </div>

        <div className="space-y-6">
          <ProgressChart metrics={metrics} title="Progress Metrics" />

          {/* Session History */}
          <div
            className="
              bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
              rounded-2xl p-6
            "
          >
            <h3 className="text-xl font-semibold text-white/90 mb-4">
              Recent Sessions
            </h3>
            {sessions.length === 0 ? (
              <p className="text-white/50">No session history yet</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="
                      bg-black/40 border border-white/10
                      rounded-xl p-4
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 font-medium">
                          Week of {new Date(session.week_start).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-white/60">
                          {session.plan?.focus_theme || 'No theme'}
                        </p>
                      </div>
                      <span
                        className={`
                          text-xs px-3 py-1 rounded-lg
                          ${
                            session.completed
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }
                        `}
                      >
                        {session.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
