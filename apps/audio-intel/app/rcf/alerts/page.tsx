/**
 * RCF Alerts Page
 * Comprehensive alerts dashboard with filtering, severity indicators, and actions
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import type { RCFAlert } from '@total-audio/rcf/alerts';
import Link from 'next/link';
import { AlertCard } from './components/AlertCard';
import { AlertFilters } from './components/AlertFilters';

type Severity = 'info' | 'warning' | 'critical' | 'all';
type AlertType = 'spike' | 'threshold' | 'anomaly' | 'first_event' | 'high_cred' | 'all';

export default function RCFAlertsPage() {
  const [alerts, setAlerts] = useState<RCFAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>('all');
  const [selectedType, setSelectedType] = useState<AlertType>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

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
      // Update local state to mark as acknowledged
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId ? { ...a, acknowledged: true, acknowledged_at: new Date().toISOString() } : a
        )
      );
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  }

  // Filter alerts based on selected criteria
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Filter by severity
      if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) {
        return false;
      }

      // Filter by type
      if (selectedType !== 'all' && alert.alert_type !== selectedType) {
        return false;
      }

      // Filter by acknowledged status
      if (!showAcknowledged && alert.acknowledged) {
        return false;
      }

      return true;
    });
  }, [alerts, selectedSeverity, selectedType, showAcknowledged]);

  // Count by severity
  const severityCounts = useMemo(() => {
    const counts = { info: 0, warning: 0, critical: 0, total: 0 };
    alerts.forEach((alert) => {
      if (!alert.acknowledged) {
        counts[alert.severity]++;
        counts.total++;
      }
    });
    return counts;
  }, [alerts]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/rcf"
                className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80 transition-colors duration-240"
              >
                ← Back to Feed
              </Link>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Alerts Dashboard</h1>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-sm text-slate-400">
                  {severityCounts.total} active {severityCounts.total === 1 ? 'alert' : 'alerts'}
                </p>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-blue-400">{severityCounts.info} info</span>
                  <span className="text-amber-400">{severityCounts.warning} warning</span>
                  <span className="text-red-400">{severityCounts.critical} critical</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                px-4 py-2 text-sm font-medium font-mono rounded-lg
                transition-all duration-240 ease-out
                ${
                  showFilters
                    ? 'bg-[#3AA9BE] text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }
              `}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {showFilters && (
            <aside className="lg:col-span-1">
              <AlertFilters
                selectedSeverity={selectedSeverity}
                selectedType={selectedType}
                showAcknowledged={showAcknowledged}
                onSeverityChange={setSelectedSeverity}
                onTypeChange={setSelectedType}
                onShowAcknowledgedChange={setShowAcknowledged}
              />
            </aside>
          )}

          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-pulse text-[#3AA9BE]">Loading alerts...</div>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-lg mb-2">No alerts match your filters</div>
                <div className="text-sm">
                  {alerts.length === 0
                    ? 'Check back once the RCF system detects patterns or anomalies'
                    : 'Try adjusting your filter settings'}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id || `${alert.alert_type}-${alert.artist_slug}`}
                    alert={alert}
                    onAcknowledge={acknowledgeAlert}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
