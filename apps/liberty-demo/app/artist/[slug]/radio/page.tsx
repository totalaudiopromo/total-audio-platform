'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Radio as RadioIcon, Play } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Sparkline from '@/components/portal/Sparkline';
import Loading from '@/components/Loading';
import { fetchArtistBySlug, type PortalArtist } from '@/lib/api/portal';
import { fetchWarmAgencySummary } from '@/lib/api/warm';
import type { WarmAgencySummary } from '@/lib/types';

export default function RadioSupportPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artist, setArtist] = useState<PortalArtist | null>(null);
  const [warmData, setWarmData] = useState<WarmAgencySummary[]>([]);
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

        const warm = await fetchWarmAgencySummary('Liberty');
        if (active) setWarmData(warm);
      } catch (err) {
        console.error('[Portal] Failed to load radio data', err);
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
        <Loading message="Loading radio support data…" />
      </div>
    );
  }

  // Mock data for demonstration
  const spinsData = [12, 18, 15, 22, 28, 25, 30, 24, 28, 35];
  const territoryData = [
    { name: 'UK', value: 45, color: '#22C55E' },
    { name: 'US', value: 25, color: '#3AA9BE' },
    { name: 'EU', value: 20, color: '#737373' },
    { name: 'Other', value: 10, color: '#D9D7D2' },
  ];

  const recentPlays = [
    { station: 'BBC Radio 1', show: 'Future Sounds', dj: 'Clara Amfo', time: '2 hours ago' },
    { station: 'BBC 6 Music', show: 'Steve Lamacq', dj: 'Steve Lamacq', time: '5 hours ago' },
    { station: 'Amazing Radio', show: 'New Music', dj: 'Jim Gellatly', time: '1 day ago' },
  ];

  const radioWins = [
    { station: 'BBC Radio 1', status: 'Playlist', tier: 'A-List' },
    { station: 'BBC 6 Music', status: 'Rotation', tier: 'B-List' },
    { station: 'RTE 2XM', status: 'Support', tier: 'C-List' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Radio Support</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Track radio airplay and station support across territories.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spins Over Time */}
            <div className="liberty-card">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D9D7D2]">
                <h2 className="liberty-heading text-xl">Radio Spins (Last 10 Days)</h2>
                <span className="text-2xl font-mono font-bold text-[#111]">
                  {spinsData[spinsData.length - 1]}
                </span>
              </div>
              <div className="h-32 flex items-end gap-1">
                {spinsData.map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-tap-radio rounded-t transition-all hover:opacity-80"
                      style={{ height: `${(value / Math.max(...spinsData)) * 100}%` }}
                      title={`${value} spins`}
                    />
                    <span className="liberty-metadata text-[10px]">
                      {idx === 0 ? '10d' : idx === spinsData.length - 1 ? 'Today' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Plays */}
            <div className="liberty-card">
              <div className="pb-4 border-b border-[#D9D7D2] mb-0">
                <h2 className="liberty-heading text-xl">Recent Plays</h2>
              </div>
              <div className="divide-y divide-[#D9D7D2]">
                {recentPlays.map((play, idx) => (
                  <div key={idx} className="p-4 hover:bg-[#FAFAF8] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-tap-radio/10 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 tap-accent-radio" />
                      </div>
                      <div className="flex-1">
                        <p className="font-jakarta font-semibold text-[#111]">{play.station}</p>
                        <p className="text-sm text-[#737373]">
                          {play.show} • {play.dj}
                        </p>
                      </div>
                      <span className="liberty-metadata">{play.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Radio Wins */}
            <div className="liberty-card">
              <div className="pb-4 border-b border-[#D9D7D2] mb-0">
                <h2 className="liberty-heading text-xl">Radio Wins</h2>
              </div>
              <div className="divide-y divide-[#D9D7D2]">
                {radioWins.map((win, idx) => (
                  <div key={idx} className="p-4 hover:bg-[#FAFAF8] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RadioIcon className="w-5 h-5 text-[#737373]" />
                        <div>
                          <p className="font-jakarta font-semibold text-[#111]">{win.station}</p>
                          <p className="text-sm text-[#737373]">{win.status}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          win.tier === 'A-List'
                            ? 'bg-tap-good/10 text-tap-good border border-tap-good/20'
                            : win.tier === 'B-List'
                              ? 'bg-tap-crm/10 text-tap-crm border border-tap-crm/20'
                              : 'bg-[#F7F6F2] text-[#737373] border border-[#D9D7D2]'
                        }`}
                      >
                        {win.tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Territory Breakdown */}
            <div className="liberty-card">
              <h2 className="liberty-heading text-xl mb-4 pb-4 border-b border-[#D9D7D2]">
                Territory Breakdown
              </h2>
              <div className="space-y-3">
                {territoryData.map((territory, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-jakarta font-medium text-[#111]">
                        {territory.name}
                      </span>
                      <span className="text-sm font-mono text-[#111]">{territory.value}%</span>
                    </div>
                    <div className="h-2 bg-[#F7F6F2] rounded-full overflow-hidden border border-[#D9D7D2]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${territory.value}%`,
                          backgroundColor: territory.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Stats */}
            <div className="liberty-card">
              <h2 className="liberty-heading text-xl mb-4 pb-4 border-b border-[#D9D7D2]">
                Total Stats
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="liberty-label text-[11px] mb-1">Total Spins</div>
                  <div className="text-2xl font-mono font-bold text-[#111]">
                    {spinsData.reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                <div>
                  <div className="liberty-label text-[11px] mb-1">Unique Stations</div>
                  <div className="text-2xl font-mono font-bold text-[#111]">24</div>
                </div>
                <div>
                  <div className="liberty-label text-[11px] mb-1">Countries</div>
                  <div className="text-2xl font-mono font-bold text-[#111]">8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
