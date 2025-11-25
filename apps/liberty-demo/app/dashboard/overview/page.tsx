'use client';

import React, { useState, useEffect } from 'react';
import CampaignCard from '@/components/CampaignCard';
import LeadGenPanel from '@/components/LeadGenPanel';
import ActivityStream from '@/components/ActivityStream';
import WarmPanel from '@/components/WarmPanel';
import MondayTimelinePanel from '@/components/MondayTimelinePanel';
import StaffAllocationGrid from '@/components/StaffAllocationGrid';
import TypeformIntakePanel from '@/components/TypeformIntakePanel';
import Loading from '@/components/Loading';
import { Radio, BarChart3, Activity, ArrowUpRight } from 'lucide-react';
import { fetchLibertyCampaignSummaries } from '@/lib/api/tracker';
import type { TrackerCampaignSummary } from '@/lib/types';

const DashboardOverview: React.FC = () => {
  const [campaigns, setCampaigns] = useState<TrackerCampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchLibertyCampaignSummaries();
        if (active) setCampaigns(data);
      } catch (err) {
        console.warn('[TAP API] Failed to load campaign summaries, using mocks', err);
        try {
          const fallback = await fetchLibertyCampaignSummaries();
          if (active) setCampaigns(fallback);
        } catch (fallbackErr) {
          console.error('[TAP API] Fallback also failed', fallbackErr);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Calculate aggregated stats from campaigns
  const stats = {
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalOutreach: campaigns.reduce((sum, c) => sum + c.pitchCount, 0),
    avgReplyRate:
      campaigns.length > 0
        ? (campaigns.reduce((sum, c) => sum + c.replyRate, 0) / campaigns.length).toFixed(1)
        : '0.0',
    placementValue: campaigns.reduce((sum, c) => sum + (c.placementValueGBP || 0), 0),
  };

  const statCards = [
    {
      label: 'Active Campaigns',
      value: stats.activeCampaigns.toString(),
      change: '+2',
      icon: Radio,
      accent: 'momentum',
    },
    {
      label: 'Total Outreach',
      value: stats.totalOutreach.toLocaleString(),
      change: '+15%',
      icon: BarChart3,
      accent: 'pitch',
    },
    {
      label: 'Response Rate',
      value: `${stats.avgReplyRate}%`,
      change: '+1.2%',
      icon: Activity,
      accent: 'crm',
    },
    {
      label: 'Placement Value',
      value: `£${(stats.placementValue / 1000).toFixed(0)}k`,
      change: '+8%',
      icon: ArrowUpRight,
      accent: 'press',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="liberty-card">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-[#F7F6F2] rounded-lg">
                <stat.icon size={20} className="text-[#111]" />
              </div>
              <span
                className={`liberty-metadata-micro font-semibold tap-accent-${stat.accent} bg-tap-accent-${stat.accent} px-2.5 py-1 rounded-full`}
              >
                {stat.change}
              </span>
            </div>
            <div className="font-mono text-4xl font-bold leading-none text-[#111] mb-2">
              {stat.value}
            </div>
            <div className="liberty-metadata-micro">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="liberty-heading text-2xl mb-5 pb-4 border-b border-[#D9D7D2]">
              Active Campaigns
            </h2>
            {loading ? (
              <Loading message="Loading campaigns from Tracker…" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map(campaign => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="liberty-heading text-2xl mb-5 pb-4 border-b border-[#D9D7D2]">
              Operational Stack
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="liberty-card flex items-center justify-between hover:border-[#111] transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#111] text-white rounded-xl flex items-center justify-center text-lg font-jakarta font-bold">
                    W
                  </div>
                  <div>
                    <div className="font-jakarta font-semibold text-base text-[#111]">WARM</div>
                    <div className="liberty-metadata normal-case">Radio Intelligence</div>
                  </div>
                </div>
                <div className="text-base font-mono text-[#737373] group-hover:text-[#111] transition-colors">
                  →
                </div>
              </div>
              <div className="liberty-card flex items-center justify-between hover:border-[#111] transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#111] text-white rounded-xl flex items-center justify-center text-lg font-jakarta font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-jakarta font-semibold text-base text-[#111]">Monday</div>
                    <div className="liberty-metadata normal-case">Project Management</div>
                  </div>
                </div>
                <div className="text-base font-mono text-[#737373] group-hover:text-[#111] transition-colors">
                  →
                </div>
              </div>
            </div>
          </section>

          <MondayTimelinePanel />
          <StaffAllocationGrid />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <WarmPanel />
          <LeadGenPanel />
          <TypeformIntakePanel />
          <ActivityStream />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
