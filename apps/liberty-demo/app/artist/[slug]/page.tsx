'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TrendingUp, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import StatCard from '@/components/portal/StatCard';
import Sparkline from '@/components/portal/Sparkline';
import Loading from '@/components/Loading';
import {
  fetchArtistBySlug,
  fetchArtistCampaigns,
  fetchArtistCampaignDetail,
  type PortalArtist,
} from '@/lib/api/portal';
import type { TrackerCampaignSummary } from '@/lib/types';

export default function ArtistPortalOverviewPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artist, setArtist] = useState<PortalArtist | null>(null);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const artistData = await fetchArtistBySlug(slug);
        if (!artistData) {
          // Redirect to login
          window.location.href = '/artist/login';
          return;
        }
        if (active) setArtist(artistData);

        const campaigns = await fetchArtistCampaigns(artistData.name);
        if (campaigns.length > 0) {
          const detail = await fetchArtistCampaignDetail(campaigns[0].id);
          if (active) setActiveCampaign(detail);
        }
      } catch (err) {
        console.error('[Portal] Failed to load artist data', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading || !artist) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <Loading message="Loading your portal…" />
      </div>
    );
  }

  const momentumData = [62, 64, 65, 67, 68, 70, 72]; // Mock sparkline data

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} currentCampaign={activeCampaign?.campaignName} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Welcome back, {artist.name}</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Here's an overview of your current campaign performance and upcoming milestones.
          </p>
        </div>

        {/* Stats Grid */}
        {activeCampaign && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Campaign Health"
              value={activeCampaign.health}
              suffix="%"
              change={5}
              trend="up"
            />
            <StatCard
              label="Momentum Score"
              value={activeCampaign.momentum}
              change={8}
              trend="up"
            />
            <StatCard label="Press Coverage" value={8} change={12} trend="up" />
            <StatCard
              label="Response Rate"
              value={`${activeCampaign.replyRate}%`}
              change={3}
              trend="up"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Narrative */}
            <div className="liberty-card">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#D9D7D2]">
                <Sparkles className="w-6 h-6 text-[#111]" />
                <h2 className="liberty-heading text-xl">Campaign Narrative</h2>
              </div>
              <p className="liberty-body text-lg leading-relaxed text-[#737373]">
                Your campaign for{' '}
                <strong className="text-[#111]">{activeCampaign?.campaignName}</strong> is
                performing exceptionally well. We've secured coverage across key tastemaker outlets,
                with strong engagement from radio programmers and playlist curators. The momentum is
                building steadily as we approach the release window.
              </p>
            </div>

            {/* Momentum Chart */}
            <div className="liberty-card">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#D9D7D2]">
                <h2 className="liberty-heading text-xl">Momentum Trend</h2>
                <span className="liberty-metadata">Last 7 days</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Sparkline data={momentumData} width={400} height={60} showDots />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-mono font-bold text-[#111]">72</div>
                  <div className="text-sm tap-accent-radio flex items-center gap-1 font-semibold">
                    <TrendingUp size={14} />
                    <span className="font-mono">+10 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {activeCampaign && (
              <div className="liberty-card">
                <h2 className="liberty-heading text-xl mb-5 pb-4 border-b border-[#D9D7D2]">
                  Recent Coverage
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      outlet: 'NME',
                      type: 'Press',
                      date: '2023-11-20',
                      highlight: 'Featured in New Music Friday roundup',
                    },
                    {
                      outlet: 'BBC Radio 1',
                      type: 'Radio',
                      date: '2023-11-19',
                      highlight: 'Played on Future Sounds with Clara Amfo',
                    },
                    {
                      outlet: 'DIY Magazine',
                      type: 'Press',
                      date: '2023-11-18',
                      highlight: 'Track of the Day feature',
                    },
                  ].map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="liberty-card-inner hover:border-[#111] transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#F7F6F2] border border-[#D9D7D2] rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{item.type === 'Press' ? '📰' : '📻'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-jakarta font-semibold text-[#111]">{item.outlet}</p>
                            <span className="liberty-metadata">{item.date}</span>
                          </div>
                          <p className="liberty-body text-sm line-clamp-2">{item.highlight}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Milestones */}
            <div className="liberty-card">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#D9D7D2]">
                <Calendar className="w-6 h-6 text-[#111]" />
                <h2 className="liberty-heading text-lg">Upcoming Milestones</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-[#16A34A] rounded-full mt-1.5 ring-4 ring-[#16A34A]/10"></div>
                  <div>
                    <p className="font-jakarta font-semibold text-sm text-[#111]">
                      Press Release Drop
                    </p>
                    <p className="liberty-metadata text-[11px] normal-case">Dec 1, 2023</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-[#D9D7D2] rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-jakarta font-semibold text-sm text-[#111]">
                      Radio Servicing
                    </p>
                    <p className="liberty-metadata text-[11px] normal-case">Dec 8, 2023</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-[#D9D7D2] rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-jakarta font-semibold text-sm text-[#111]">Release Date</p>
                    <p className="liberty-metadata normal-case">Dec 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="liberty-card">
              <h2 className="liberty-heading text-lg mb-5 pb-4 border-b border-[#D9D7D2]">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="liberty-btn-primary w-full liberty-touch-target">
                  Upload New Assets
                </button>
                <button className="liberty-btn-secondary w-full liberty-touch-target">
                  View Full Timeline
                </button>
                <button className="liberty-btn-secondary w-full liberty-touch-target">
                  Download Press Kit
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-[#F7F6F2] border-2 border-[#D9D7D2] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#111] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-jakarta font-semibold text-sm text-[#111] mb-2">Need Help?</p>
                  <p className="liberty-body text-sm text-[#737373]">
                    Contact your campaign manager for any questions or updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
