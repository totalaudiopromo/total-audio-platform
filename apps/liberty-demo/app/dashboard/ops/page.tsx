'use client';

import React, { useState, useEffect } from 'react';
import { fetchAgencyTimelines, fetchStaffAllocations } from '@/lib/api/monday';
import { MondayTimeline, MondayAllocation } from '@/lib/types';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import Loading from '@/components/Loading';

const OpsPage: React.FC = () => {
  const [timelines, setTimelines] = useState<MondayTimeline[]>([]);
  const [allocations, setAllocations] = useState<MondayAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [timelinesData, allocationsData] = await Promise.all([
          fetchAgencyTimelines(),
          fetchStaffAllocations(),
        ]);
        if (active) {
          setTimelines(timelinesData);
          setAllocations(allocationsData);
        }
      } catch (error) {
        console.error('[TAP API] Failed to load operations data:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loading message="Loading operations data from Monday.com…" />;
  }

  const totalTimelines = timelines.length;
  const onTrackCount = timelines.filter(t => t.status === 'on-track').length;
  const atRiskCount = timelines.filter(t => t.status === 'at-risk').length;
  const avgWorkload =
    allocations.length > 0
      ? Math.round(allocations.reduce((sum, a) => sum + a.workloadScore, 0) / allocations.length)
      : 0;
  const highestWorkload =
    allocations.length > 0
      ? allocations.reduce(
          (max, a) => (a.workloadScore > max.workloadScore ? a : max),
          allocations[0]
        )
      : null;

  const getStatusColour = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-tap-good';
      case 'at-risk':
        return 'bg-orange-500';
      default:
        return 'bg-tap-risk';
    }
  };

  const getWorkloadColour = (workload: number) => {
    if (workload < 60) return 'bg-tap-good';
    if (workload <= 85) return 'bg-orange-500';
    return 'bg-tap-risk';
  };

  const calculateProgress = (timeline: MondayTimeline): number => {
    const start = new Date(timeline.startDate).getTime();
    const end = new Date(timeline.endDate).getTime();
    const now = Date.now();

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end - start;
    const elapsed = now - start;
    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleString('en-GB', { month: 'short' });
      return `${day} ${month}`;
    };

    return `${formatDate(start)} — ${formatDate(end)}`;
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-tap-line">
        <h1 className="liberty-page-title">Operations Dashboard</h1>
        <p className="text-sm text-tap-muted mt-2">
          Monday.com integration — timelines and team allocation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Timelines & Team */}
        <div className="lg:col-span-2 space-y-8">
          {/* Campaign Timelines */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-tap-line">
              <Calendar className="w-5 h-5 text-tap-accent" />
              <h2 className="liberty-heading text-xl">Campaign Timelines</h2>
            </div>
            <div className="space-y-4">
              {timelines.map(timeline => {
                const progress = calculateProgress(timeline);
                return (
                  <div
                    key={timeline.id}
                    className="bg-tap-panel border border-tap-line rounded-lg p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-heading font-normal tracking-tight text-tap-text font-medium flex-1">
                        {timeline.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs text-white font-medium ${getStatusColour(timeline.status)}`}
                      >
                        {timeline.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="w-full bg-tap-bg rounded-full h-2 border border-tap-line overflow-hidden">
                        <div
                          className={`h-full ${getStatusColour(timeline.status)} transition-all duration-300 ease-out`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono text-tap-muted">
                        {formatDateRange(timeline.startDate, timeline.endDate)}
                      </span>
                      <span className="font-mono text-tap-text leading-none">{progress}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Team Allocation Table */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-tap-line">
              <Users className="w-5 h-5 text-tap-accent" />
              <h2 className="liberty-heading text-xl">Team Allocation</h2>
            </div>
            <div className="bg-tap-panel border border-tap-line rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-tap-bg text-tap-muted font-medium text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-center py-3 px-4 font-medium">Campaigns</th>
                    <th className="text-left py-3 px-4 font-medium">Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tap-line">
                  {allocations.map((allocation, idx) => (
                    <tr
                      key={`${allocation.staffName}-${idx}`}
                      className="hover:bg-tap-bg/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-tap-text font-medium">
                        {allocation.staffName}
                      </td>
                      <td className="py-3 px-4 text-tap-muted text-sm">{allocation.role}</td>
                      <td className="py-3 px-4 text-center font-mono text-tap-text">
                        {allocation.activeCampaigns.length}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-tap-bg rounded-full h-2 border border-tap-line overflow-hidden">
                            <div
                              className={`h-full ${getWorkloadColour(allocation.workloadScore)} transition-all duration-300 ease-out`}
                              style={{ width: `${Math.min(100, allocation.workloadScore)}%` }}
                            />
                          </div>
                          <span className="font-mono text-sm text-tap-text w-12 text-right">
                            {allocation.workloadScore}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar - Operational Health */}
        <div className="space-y-8">
          <section className="bg-tap-panel border border-tap-line rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-tap-accent" />
              <h2 className="liberty-heading text-lg">Operational Health</h2>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-tap-muted uppercase tracking-wide mb-2">
                  Total Active Timelines
                </p>
                <p className="text-3xl font-mono leading-none text-tap-text">{totalTimelines}</p>
              </div>

              <div className="pt-4 border-t border-tap-line">
                <p className="text-xs text-tap-muted uppercase tracking-wide mb-3">
                  Timeline Status
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-tap-good"></div>
                      <span className="text-sm text-tap-text">On-track</span>
                    </div>
                    <span className="font-mono text-sm text-tap-text font-semibold">
                      {onTrackCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-sm text-tap-text">At-risk</span>
                    </div>
                    <span className="font-mono text-sm text-tap-text font-semibold">
                      {atRiskCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-tap-line">
                <p className="text-xs text-tap-muted uppercase tracking-wide mb-2">
                  Average Team Workload
                </p>
                <p className="text-3xl font-mono leading-none text-tap-text">{avgWorkload}%</p>
              </div>

              {highestWorkload && highestWorkload.workloadScore > 85 && (
                <div className="pt-4 border-t border-tap-line">
                  <p className="text-xs text-tap-muted uppercase tracking-wide mb-3">
                    ⚠️ Highest Workload Alert
                  </p>
                  <div className="bg-tap-risk/10 border border-tap-risk/20 rounded-md p-4">
                    <p className="text-sm font-semibold text-tap-text mb-1">
                      {highestWorkload.staffName}
                    </p>
                    <p className="text-xs text-tap-muted mb-2">{highestWorkload.role}</p>
                    <p className="text-2xl font-mono leading-none text-tap-risk">
                      {highestWorkload.workloadScore}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OpsPage;
