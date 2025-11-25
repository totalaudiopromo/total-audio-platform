'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Loading from '@/components/Loading';
import MermaidChart from '@/components/MermaidChart';
import {
  fetchArtistBySlug,
  fetchArtistCampaignDetail,
  fetchArtistCampaigns,
  type PortalArtist,
} from '@/lib/api/portal';

export default function TimelinePage() {
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
        console.error('[Portal] Failed to load timeline', err);
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
        <Loading message="Loading campaign timeline…" />
      </div>
    );
  }

  const timelineCode =
    campaignDetail?.timelineMermaid ||
    `gantt
    title Campaign Timeline
    dateFormat YYYY-MM-DD
    section Pitching
    Initial Outreach    :done, 2023-11-01, 7d
    Follow-ups          :active, 2023-11-08, 7d
    section Coverage
    Press Window        :2023-11-15, 14d
    section Radio
    Radio Push          :2023-11-20, 21d
    section Release
    Release Date        :milestone, 2023-12-15, 0d`;

  const milestones = [
    {
      date: '2023-11-01',
      title: 'Campaign Launch',
      status: 'completed',
      description: 'Initial pitching phase begins',
    },
    {
      date: '2023-11-15',
      title: 'Press Coverage Window',
      status: 'completed',
      description: 'Major press features secured',
    },
    {
      date: '2023-11-20',
      title: 'Radio Servicing',
      status: 'active',
      description: 'Radio promotion underway',
    },
    {
      date: '2023-12-01',
      title: 'Press Release Drop',
      status: 'upcoming',
      description: 'Official press release distribution',
    },
    {
      date: '2023-12-15',
      title: 'Release Date',
      status: 'upcoming',
      description: 'Track goes live on all platforms',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} currentCampaign={campaignDetail?.campaignName} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Campaign Timeline</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Track key milestones and phases throughout your campaign.
          </p>
        </div>

        {/* Gantt Chart */}
        <div className="liberty-card mb-8">
          <h2 className="liberty-heading text-xl mb-4 pb-4 border-b border-[#D9D7D2]">
            Visual Timeline
          </h2>
          <MermaidChart code={timelineCode} />
        </div>

        {/* Milestone List */}
        <div className="liberty-card">
          <div className="pb-4 border-b border-[#D9D7D2] mb-0">
            <h2 className="liberty-heading text-xl">Key Milestones</h2>
          </div>
          <div className="divide-y divide-[#D9D7D2]">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="p-6 hover:bg-[#FAFAF8] transition-colors">
                <div className="flex items-start gap-4">
                  {/* Status Indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        milestone.status === 'completed'
                          ? 'bg-tap-good border-tap-good'
                          : milestone.status === 'active'
                            ? 'bg-white border-tap-good ring-2 ring-tap-good ring-offset-2'
                            : 'bg-white border-[#D9D7D2]'
                      }`}
                    />
                    {idx < milestones.length - 1 && (
                      <div className="w-0.5 h-16 bg-[#D9D7D2] mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="liberty-heading text-lg">{milestone.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          milestone.status === 'completed'
                            ? 'bg-tap-good/10 text-tap-good border border-tap-good/20'
                            : milestone.status === 'active'
                              ? 'bg-tap-crm/10 text-tap-crm border border-tap-crm/20'
                              : 'bg-[#F7F6F2] text-[#737373] border border-[#D9D7D2]'
                        }`}
                      >
                        {milestone.status === 'completed'
                          ? 'Completed'
                          : milestone.status === 'active'
                            ? 'In Progress'
                            : 'Upcoming'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#737373] mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="liberty-metadata">{milestone.date}</span>
                    </div>
                    <p className="text-[#111]">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
