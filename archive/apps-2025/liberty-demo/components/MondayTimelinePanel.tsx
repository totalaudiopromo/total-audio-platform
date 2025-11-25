import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { fetchAgencyTimelines } from '@/lib/api/monday';
import { MondayTimeline } from '@/lib/types';

export default function MondayTimelinePanel() {
  const [timelines, setTimelines] = useState<MondayTimeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimelines = async () => {
      try {
        const data = await fetchAgencyTimelines();
        setTimelines(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch timelines:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimelines();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-tap-good text-tap-text';
      case 'at-risk':
        return 'bg-tap-risk text-tap-text';
      case 'delayed':
        return 'bg-tap-risk text-tap-text';
      default:
        return 'bg-tap-line text-tap-muted';
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
      return `${day} ${month}`;
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (loading) {
    return (
      <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-tap-line border-t-tap-text rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-tap-text" />
        <h2 className="text-lg font-heading font-normal tracking-tight text-tap-text">
          Campaign Timelines
        </h2>
      </div>

      <div className="space-y-3">
        {timelines.map(timeline => {
          const progress = calculateProgress(timeline.startDate, timeline.endDate);

          return (
            <div key={timeline.id} className="bg-tap-bg border border-tap-line rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-heading font-normal tracking-tight text-tap-text flex-1">
                  {timeline.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(timeline.status)}`}>
                  {timeline.status}
                </span>
              </div>

              <div className="mb-2">
                <div className="w-full h-2 bg-tap-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tap-good transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-xs font-mono text-tap-muted">
                {formatDateRange(timeline.startDate, timeline.endDate)}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        href="/dashboard/ops"
        className="block mt-4 text-sm text-tap-muted hover:text-tap-text transition-colors text-center"
      >
        View full ops →
      </Link>
    </div>
  );
}
