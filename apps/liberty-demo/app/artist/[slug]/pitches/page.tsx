'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Send, Mail, MailOpen, MessageCircle, XCircle } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Loading from '@/components/Loading';
import {
  fetchArtistBySlug,
  fetchArtistCampaigns,
  fetchArtistCampaignDetail,
  type PortalArtist,
} from '@/lib/api/portal';

export default function PitchLogPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artist, setArtist] = useState<PortalArtist | null>(null);
  const [campaignDetail, setCampaignDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'opened' | 'replied' | 'not-opened'>('all');

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
        console.error('[Portal] Failed to load pitch log', err);
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
        <Loading message="Loading pitch log…" />
      </div>
    );
  }

  // Mock pitch data
  const pitches = [
    {
      id: '1',
      subject: 'New Single: Consumption',
      outlet: 'NME',
      contact: 'Lisa Wright',
      status: 'replied',
      sentAt: '2023-11-20',
      openedAt: '2023-11-20',
      repliedAt: '2023-11-21',
    },
    {
      id: '2',
      subject: 'Premiere Opportunity',
      outlet: 'Clash Magazine',
      contact: 'Robin Murray',
      status: 'opened',
      sentAt: '2023-11-19',
      openedAt: '2023-11-19',
    },
    {
      id: '3',
      subject: 'Track Feature Request',
      outlet: 'DIY',
      contact: 'Emma Swann',
      status: 'replied',
      sentAt: '2023-11-18',
      openedAt: '2023-11-18',
      repliedAt: '2023-11-19',
    },
    {
      id: '4',
      subject: 'Radio Play Request',
      outlet: 'BBC Radio 1',
      contact: 'Clara Amfo',
      status: 'opened',
      sentAt: '2023-11-17',
      openedAt: '2023-11-18',
    },
    {
      id: '5',
      subject: 'Interview Request',
      outlet: 'The Line of Best Fit',
      contact: 'Paul Bridgewater',
      status: 'sent',
      sentAt: '2023-11-16',
    },
    {
      id: '6',
      subject: 'Playlist Consideration',
      outlet: 'Spotify Editorial',
      contact: 'James Mullen',
      status: 'bounced',
      sentAt: '2023-11-15',
    },
  ];

  const filteredPitches = pitches.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'opened') return p.status === 'opened' || p.status === 'replied';
    if (filter === 'replied') return p.status === 'replied';
    if (filter === 'not-opened') return p.status === 'sent';
    return true;
  });

  const stats = {
    total: pitches.length,
    opened: pitches.filter(p => p.openedAt).length,
    replied: pitches.filter(p => p.repliedAt).length,
    openRate: Math.round((pitches.filter(p => p.openedAt).length / pitches.length) * 100),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'replied':
        return <MessageCircle className="w-5 h-5 tap-accent-radio" />;
      case 'opened':
        return <MailOpen className="w-5 h-5 tap-accent-crm" />;
      case 'sent':
        return <Mail className="w-5 h-5 text-[#737373]" />;
      case 'bounced':
        return <XCircle className="w-5 h-5 text-tap-risk" />;
      default:
        return <Send className="w-5 h-5 text-[#737373]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      replied: 'bg-tap-good/10 text-tap-good border border-tap-good/20',
      opened: 'bg-tap-crm/10 text-tap-crm border border-tap-crm/20',
      sent: 'bg-[#F7F6F2] text-[#737373] border border-[#D9D7D2]',
      bounced: 'bg-tap-risk/10 text-tap-risk border border-tap-risk/20',
    };
    return styles[status as keyof typeof styles] || styles.sent;
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} currentCampaign={campaignDetail?.campaignName} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Pitch Log</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Track all pitches sent to media contacts and their responses.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Total Pitches</div>
            <div className="text-3xl font-mono font-bold text-[#111]">{stats.total}</div>
          </div>
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Opened</div>
            <div className="text-3xl font-mono font-bold text-[#111]">{stats.opened}</div>
          </div>
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Replied</div>
            <div className="text-3xl font-mono font-bold text-[#111]">{stats.replied}</div>
          </div>
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Open Rate</div>
            <div className="text-3xl font-mono font-bold text-[#111]">{stats.openRate}%</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="liberty-card p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#737373] font-medium">Filter:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[#111] text-white'
                  : 'bg-[#F7F6F2] text-[#111] hover:bg-[#FAFAF8] border border-[#D9D7D2]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('opened')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'opened'
                  ? 'bg-[#111] text-white'
                  : 'bg-[#F7F6F2] text-[#111] hover:bg-[#FAFAF8] border border-[#D9D7D2]'
              }`}
            >
              Opened
            </button>
            <button
              onClick={() => setFilter('replied')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'replied'
                  ? 'bg-[#111] text-white'
                  : 'bg-[#F7F6F2] text-[#111] hover:bg-[#FAFAF8] border border-[#D9D7D2]'
              }`}
            >
              Replied
            </button>
            <button
              onClick={() => setFilter('not-opened')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'not-opened'
                  ? 'bg-[#111] text-white'
                  : 'bg-[#F7F6F2] text-[#111] hover:bg-[#FAFAF8] border border-[#D9D7D2]'
              }`}
            >
              Not Opened
            </button>
          </div>
        </div>

        {/* Pitch List */}
        <div className="liberty-card">
          <div className="divide-y divide-[#D9D7D2]">
            {filteredPitches.map(pitch => (
              <div key={pitch.id} className="p-6 hover:bg-[#FAFAF8] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F7F6F2] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#D9D7D2]">
                    {getStatusIcon(pitch.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-jakarta font-semibold text-[#111]">
                          {pitch.subject}
                        </h3>
                        <p className="text-sm text-[#737373] mt-1">
                          {pitch.outlet} • {pitch.contact}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(pitch.status)}`}
                      >
                        {pitch.status.charAt(0).toUpperCase() + pitch.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#737373]">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Sent:</span>
                        <span className="liberty-metadata">{pitch.sentAt}</span>
                      </div>
                      {pitch.openedAt && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Opened:</span>
                          <span className="liberty-metadata">{pitch.openedAt}</span>
                        </div>
                      )}
                      {pitch.repliedAt && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Replied:</span>
                          <span className="liberty-metadata">{pitch.repliedAt}</span>
                        </div>
                      )}
                    </div>
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
