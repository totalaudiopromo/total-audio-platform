import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { fetchAgencyTimelines } from '@/lib/api/monday';
import { MondayTimeline } from '@/lib/types';
import { EmptyState, ErrorState, DataFreshness, LoadingState } from '@/components/ui';

export default function MondayTimelinePanel() {
  const [timelines, setTimelines] = useState<MondayTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAgencyTimelines();
      setTimelines(data.slice(0, 3));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[Monday.com] Failed to fetch timelines:', err);
      setError('Failed to load timelines');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-amber-100 text-amber-800';
      case 'behind':
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();

    if (now < start) return 0;
    if (now > end) return 100;

    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleString('en-GB', { month: 'short' });
      return day + ' ' + month;
    };

    return formatDate(start) + ' – ' + formatDate(end);
  };

  const renderContent = () => {
    if (loading && timelines.length === 0) {
      return <LoadingState message="Loading timelines..." size="sm" />;
    }

    if (error && timelines.length === 0) {
      return <ErrorState variant="default" onRetry={loadData} />;
    }

    if (timelines.length === 0) {
      return (
        <EmptyState
          variant="timelines"
          description="No active campaign timelines. Connect Monday.com to see your project timelines."
        />
      );
    }

    return (
      <div className="space-y-3">
        {timelines.map(timeline => {
          const progress = calculateProgress(timeline.startDate, timeline.endDate);

          return (
            <div key={timeline.id} className="bg-tap-bg border border-tap-line rounded-lg p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-heading font-normal tracking-tight text-tap-text flex-1 min-w-0 truncate">
                  {timeline.title}
                </h3>
                <span
                  className={
                    'text-xs px-2 py-1 rounded font-medium whitespace-nowrap ' +
                    getStatusColor(timeline.status)
                  }
                >
                  {timeline.status.replace('-', ' ')}
                </span>
              </div>

              <div className="mb-2">
                <div className="w-full h-2 bg-tap-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tap-good transition-all duration-300 ease-out"
                    style={{ width: progress + '%' }}
                  />
                </div>
              </div>

              <p className="text-xs font-mono text-tap-muted">
                {formatDateRange(timeline.startDate, timeline.endDate)}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-tap-text" />
          <h2 className="text-lg font-heading font-normal tracking-tight text-tap-text">
            Campaign Timelines
          </h2>
        </div>
        <DataFreshness
          lastUpdated={lastUpdated}
          isLoading={loading}
          onRefresh={loadData}
          showRefreshButton={!loading}
        />
      </div>

      {renderContent()}

      <Link
        href="/dashboard/ops"
        className="flex items-center justify-center mt-4 text-sm text-tap-muted hover:text-tap-text transition-colors min-h-[44px]"
      >
        View full ops →
      </Link>
    </div>
  );
}
