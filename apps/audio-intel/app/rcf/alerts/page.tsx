/**
 * RCF Alerts Page
 * List of alerts with severity badges and acknowledge button
 */

'use client';

import { useState, useEffect } from 'react';
import type { RCFAlert } from '@total-audio/rcf/alerts';
import Link from 'next/link';

export default function RCFAlertsPage() {
  const [alerts, setAlerts] = useState<RCFAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      setLoading(true);
      const response = await fetch('/api/rcf/alerts');
      const result = await response.json();

      if (result.success) {
        setAlerts(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function acknowledgeAlert(alertId: string) {
    try {
      await fetch(`/api/rcf/alerts/${alertId}/acknowledge`, { method: 'PATCH' });
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  }

  const severityColors = {
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <header className="border-b border-slate-800 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
          <Link href="/rcf" className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80">
            ← Back to Feed
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Alerts</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-slate-400">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center text-slate-400">No alerts</div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`rounded border px-2 py-0.5 text-xs font-medium ${
                          severityColors[alert.severity]
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500">{alert.alert_type}</span>
                    </div>

                    <h3 className="mt-2 font-semibold text-slate-100">{alert.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{alert.message}</p>

                    {alert.artist_slug && (
                      <div className="mt-2 text-xs text-slate-500">Artist: {alert.artist_slug}</div>
                    )}
                  </div>

                  {alert.id && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id!)}
                      className="ml-4 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
