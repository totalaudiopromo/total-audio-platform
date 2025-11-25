'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TrendingUp, Radio, ListMusic, Newspaper } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Loading from '@/components/Loading';
import { fetchArtistBySlug, fetchSpotifyAnalytics, type PortalArtist } from '@/lib/api/portal';

export default function AnalyticsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artist, setArtist] = useState<PortalArtist | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
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

        const spotifyData = await fetchSpotifyAnalytics(slug);
        if (active) setAnalytics(spotifyData);
      } catch (err) {
        console.error('[Portal] Failed to load analytics', err);
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
        <Loading message="Loading analytics…" />
      </div>
    );
  }

  const popularityHistory = analytics?.popularityHistory || [];
  const playlistHistory = analytics?.playlistAddsHistory || [];

  // Mock correlation data
  const correlationData = [
    { date: '2023-10-25', popularity: 62, radio: 8, playlists: 12, press: 2 },
    { date: '2023-11-01', popularity: 64, radio: 12, playlists: 15, press: 3 },
    { date: '2023-11-08', popularity: 65, radio: 15, playlists: 28, press: 5 },
    { date: '2023-11-15', popularity: 67, radio: 22, playlists: 45, press: 8 },
    { date: '2023-11-22', popularity: 68, radio: 28, playlists: 52, press: 12 },
  ];

  const maxValues = {
    popularity: Math.max(...correlationData.map(d => d.popularity)),
    radio: Math.max(...correlationData.map(d => d.radio)),
    playlists: Math.max(...correlationData.map(d => d.playlists)),
    press: Math.max(...correlationData.map(d => d.press)),
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Analytics & Insights</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Track your popularity trajectory and campaign performance correlations.
          </p>
        </div>

        {/* Popularity Trajectory */}
        <div className="liberty-card mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D9D7D2]">
            <h2 className="liberty-heading text-xl">Spotify Popularity Trajectory</h2>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-mono font-bold text-[#111]">
                {analytics?.popularityScore || 0}
              </span>
              <TrendingUp className="w-6 h-6 tap-accent-radio" />
            </div>
          </div>

          <div className="h-64 flex items-end gap-2">
            {popularityHistory.map((point: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-tap-radio rounded-t transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${(point.score / 100) * 100}%` }}
                    title={`${point.score} on ${point.date}`}
                  />
                </div>
                <span className="liberty-metadata text-[10px]">
                  {idx === 0
                    ? point.date.split('-')[2]
                    : idx === popularityHistory.length - 1
                      ? 'Now'
                      : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Correlation */}
        <div className="liberty-card mb-8">
          <h2 className="liberty-heading text-xl mb-6 pb-4 border-b border-[#D9D7D2]">
            Campaign Activity Correlation
          </h2>
          <p className="liberty-body text-sm text-[#737373] mb-6">
            See how radio plays, playlist adds, and press coverage correlate with your popularity
            score.
          </p>

          <div className="space-y-6">
            {correlationData.map((point, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="liberty-metadata">{point.date}</span>
                  <span className="liberty-heading text-sm">Popularity: {point.popularity}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Radio */}
                  <div>
                    <div className="flex items-center gap-1 text-xs text-[#737373] mb-1">
                      <Radio className="w-3 h-3" />
                      <span>Radio: {point.radio}</span>
                    </div>
                    <div className="h-2 bg-[#F7F6F2] rounded-full overflow-hidden border border-[#D9D7D2]">
                      <div
                        className="h-full bg-tap-radio rounded-full transition-all"
                        style={{ width: `${(point.radio / maxValues.radio) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Playlists */}
                  <div>
                    <div className="flex items-center gap-1 text-xs text-[#737373] mb-1">
                      <ListMusic className="w-3 h-3" />
                      <span>Playlists: {point.playlists}</span>
                    </div>
                    <div className="h-2 bg-[#F7F6F2] rounded-full overflow-hidden border border-[#D9D7D2]">
                      <div
                        className="h-full bg-tap-playlist rounded-full transition-all"
                        style={{ width: `${(point.playlists / maxValues.playlists) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Press */}
                  <div>
                    <div className="flex items-center gap-1 text-xs text-[#737373] mb-1">
                      <Newspaper className="w-3 h-3" />
                      <span>Press: {point.press}</span>
                    </div>
                    <div className="h-2 bg-[#F7F6F2] rounded-full overflow-hidden border border-[#D9D7D2]">
                      <div
                        className="h-full bg-tap-press rounded-full transition-all"
                        style={{ width: `${(point.press / maxValues.press) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-[#F7F6F2] border border-[#D9D7D2] rounded-xl p-6">
          <h3 className="liberty-heading text-lg mb-3">Key Insights</h3>
          <ul className="space-y-2 text-sm text-[#111]">
            <li className="flex items-start gap-2">
              <span className="text-[#737373] mt-0.5">•</span>
              <span>
                Your popularity score has increased by <strong>6 points</strong> over the past
                month.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#737373] mt-0.5">•</span>
              <span>Radio support shows strong correlation with popularity growth.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#737373] mt-0.5">•</span>
              <span>Playlist additions have accelerated significantly in the past two weeks.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
