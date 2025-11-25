'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Newspaper, ExternalLink, Eye } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Loading from '@/components/Loading';
import {
  fetchArtistBySlug,
  fetchArtistCampaigns,
  fetchArtistCampaignDetail,
  type PortalArtist,
} from '@/lib/api/portal';

export default function PressCoveragePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artist, setArtist] = useState<PortalArtist | null>(null);
  const [campaignDetail, setCampaignDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const artistData = await fetchArtistBySlug(slug);
        if (!artistData) {
          window.location.href = '/artist/login';
          return;
        }
        if (active) setArtist(artistData);

        const campaigns = await fetchArtistCampaigns(artistData.name);
        if (campaigns.length > 0) {
          const detail = await fetchArtistCampaignDetail(campaigns[0].id);
          if (active) setCampaignDetail(detail);
        }
      } catch (err) {
        console.error('[Portal] Failed to load press coverage', err);
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
        <Loading message="Loading press coverage…" />
      </div>
    );
  }

  const coverageItems = campaignDetail?.coverageLog || [];

  // Mock coverage stats
  const stats = {
    totalCoverage: coverageItems.length,
    estimatedReach: 2500000,
    avgDomainAuthority: 68,
    topTier: coverageItems.filter((c: any) => ['NME', 'Clash', 'DIY'].includes(c.outlet)).length,
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} currentCampaign={campaignDetail?.campaignName} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Press Coverage</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Track all media coverage and press mentions for your campaign.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Total Coverage</div>
            <div className="text-3xl font-mono font-bold text-[#111]">{stats.totalCoverage}</div>
          </div>
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Estimated Reach</div>
            <div className="text-3xl font-mono font-bold text-[#111]">
              {(stats.estimatedReach / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Avg Domain Authority</div>
            <div className="text-3xl font-mono font-bold text-[#111]">
              {stats.avgDomainAuthority}
            </div>
          </div>
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Top Tier Outlets</div>
            <div className="text-3xl font-mono font-bold text-[#111]">{stats.topTier}</div>
          </div>
        </div>

        {/* Coverage List */}
        <div className="liberty-card">
          <div className="pb-4 border-b border-[#D9D7D2] mb-0">
            <h2 className="liberty-heading text-xl">All Coverage</h2>
          </div>
          <div className="divide-y divide-[#D9D7D2]">
            {coverageItems.length === 0 ? (
              <div className="p-12 text-center">
                <Newspaper className="w-12 h-12 text-[#D9D7D2] mx-auto mb-4" />
                <p className="text-[#737373]">No coverage yet. Check back soon!</p>
              </div>
            ) : (
              coverageItems.map((item: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-[#FAFAF8] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-tap-press/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Newspaper className="w-6 h-6 tap-accent-press" />
                        </div>
                        <div>
                          <h3 className="text-lg font-jakarta font-semibold text-[#111]">
                            {item.outlet}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-[#737373]">
                            <span className="liberty-metadata">{item.date}</span>
                            <span>•</span>
                            <span className="liberty-label text-[11px] normal-case">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[#111] leading-relaxed ml-15">{item.highlight}</p>
                      <div className="flex items-center gap-4 mt-3 ml-15">
                        <div className="flex items-center gap-1 text-sm text-[#737373]">
                          <Eye className="w-4 h-4" />
                          <span className="font-mono">
                            {Math.floor(Math.random() * 50000 + 10000).toLocaleString()} views
                          </span>
                        </div>
                        <button className="flex items-center gap-1 text-sm tap-accent-press hover:underline">
                          <ExternalLink className="w-4 h-4" />
                          <span>View Article</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
