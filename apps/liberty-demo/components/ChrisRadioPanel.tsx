'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Radio,
  Calendar,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  Pause,
} from 'lucide-react';
import {
  fetchChrisRadioCampaigns,
  formatCampaignDateRange,
  calculateCampaignProgress,
  getStatusColour,
} from '@/lib/api/monday';
import type { ChrisRadioCampaign } from '@/lib/api/monday';
import { EmptyState, ErrorState, DataFreshness, LoadingState } from '@/components/ui';

export default function ChrisRadioPanel() {
  const [campaigns, setCampaigns] = useState<ChrisRadioCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChrisRadioCampaigns();
      // Show only recent campaigns (last 6 months) and limit to 8
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const recentCampaigns = data.filter(c => {
        if (c.status === 'active') return true;
        const endDate = c.endDate ? new Date(c.endDate) : new Date(0);
        return endDate >= sixMonthsAgo;
      });
      setCampaigns(recentCampaigns.slice(0, 8));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[Chris Radio Panel] Failed to load:', err);
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeCount = campaigns.filter(c => c.status === 'active').length;

  const getStatusIcon = (status: ChrisRadioCampaign['status']) => {
    switch (status) {
      case 'active':
        return <Clock size={12} className="text-white" />;
      case 'done':
        return <CheckCircle2 size={12} className="text-white" />;
      case 'pending':
        return <Pause size={12} className="text-white" />;
    }
  };

  const renderContent = () => {
    if (loading && campaigns.length === 0) {
      return <LoadingState message="Loading from Monday.com..." size="sm" />;
    }

    if (error && campaigns.length === 0) {
      return <ErrorState variant="default" onRetry={loadData} />;
    }

    if (campaigns.length === 0) {
      return <EmptyState variant="campaigns" description="No radio campaigns found." />;
    }

    return (
      <div className="space-y-1">
        {campaigns.map((campaign, index) => {
          const isHovered = hoveredId === campaign.id;
          const progress = calculateCampaignProgress(campaign.startDate, campaign.endDate);

          return (
            <div
              key={campaign.id}
              className={`
                group relative rounded-lg transition-all duration-200 ease-out cursor-pointer
                ${
                  campaign.status === 'active'
                    ? 'bg-[#FAFAF8] hover:bg-white'
                    : 'bg-transparent hover:bg-[#FAFAF8]'
                }
                ${isHovered ? 'shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : ''}
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              onMouseEnter={() => setHoveredId(campaign.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Active indicator bar */}
              {campaign.status === 'active' && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#3AA9BE] rounded-full" />
              )}

              <div className={`p-3 ${campaign.status === 'active' ? 'pl-4' : 'pl-3'}`}>
                {/* Top row: Campaign name + Status */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Campaign name */}
                    <span
                      className={`
                        text-sm truncate
                        ${
                          campaign.status === 'active'
                            ? 'font-semibold text-[#111]'
                            : 'font-medium text-[#737373]'
                        }
                      `}
                    >
                      {campaign.name}
                    </span>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`
                      inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide flex-shrink-0
                      ${getStatusColour(campaign.status)}
                    `}
                  >
                    {getStatusIcon(campaign.status)}
                    {campaign.status}
                  </span>
                </div>

                {/* Date range */}
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={12} className="text-[#A1A1A1] flex-shrink-0" />
                  <span className="font-mono text-[10px] text-[#A1A1A1] uppercase tracking-wide">
                    {formatCampaignDateRange(campaign.startDate, campaign.endDate)}
                  </span>
                  {campaign.releaseDate && (
                    <span className="text-[10px] text-[#737373]">
                      • Release:{' '}
                      {new Date(campaign.releaseDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  )}
                </div>

                {/* Progress bar for active campaigns */}
                {campaign.status === 'active' && campaign.startDate && campaign.endDate && (
                  <div className="h-1 bg-[#E8E6E1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3AA9BE] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Report link for done campaigns */}
                {campaign.reportLink && campaign.status === 'done' && (
                  <a
                    href={campaign.reportLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-[#3AA9BE] hover:text-[#2D8A9A] transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <span>View Report</span>
                    <ExternalLink size={10} />
                  </a>
                )}

                {/* Hover action */}
                <div
                  className={`
                    absolute right-3 top-1/2 -translate-y-1/2
                    transition-all duration-200
                    ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                  `}
                >
                  <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#D9D7D2] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8E6E1] bg-gradient-to-r from-white to-[#FAFAF8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center">
              <Radio size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#111] tracking-tight flex items-center gap-2">
                My Radio Campaigns
                {activeCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-[#3AA9BE] rounded-full">
                    {activeCount}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#A1A1A1] font-mono uppercase tracking-wide">
                Chris - Radio Results
              </p>
            </div>
          </div>
          <DataFreshness
            lastUpdated={lastUpdated}
            isLoading={loading}
            onRefresh={loadData}
            showRefreshButton={!loading}
          />
        </div>
      </div>

      {/* Campaign list */}
      <div className="p-2">{renderContent()}</div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#E8E6E1] bg-[#FAFAF8]">
        <a
          href="https://liberty-music.monday.com/boards/2443582331"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center gap-2
            text-sm text-[#737373] hover:text-[#111]
            transition-colors duration-150
            min-h-[44px]
          "
        >
          <span>Open in Monday.com</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
