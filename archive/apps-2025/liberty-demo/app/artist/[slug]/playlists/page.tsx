'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ListMusic, TrendingUp, Users } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Sparkline from '@/components/portal/Sparkline';
import Loading from '@/components/Loading';
import { fetchArtistBySlug, fetchSpotifyAnalytics, type PortalArtist } from '@/lib/api/portal';

export default function PlaylistsPage() {
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
        console.error('[Portal] Failed to load playlist data', err);
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
        <Loading message="Loading playlist data…" />
      </div>
    );
  }

  const popularityData = analytics?.popularityHistory.map((h: any) => h.score) || [];
  const playlistAddsData = analytics?.playlistAddsHistory.map((h: any) => h.count) || [];

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Playlist Support</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Track your Spotify popularity and playlist placements.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Spotify Popularity</div>
            <div className="flex items-baseline gap-2 mb-3">
              <div className="text-3xl font-mono font-bold text-[#111]">
                {analytics?.popularityScore || 0}
              </div>
              <span className="text-sm text-[#737373]">/ 100</span>
            </div>
            <Sparkline data={popularityData} width={200} height={40} />
          </div>
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Total Playlist Adds</div>
            <div className="text-3xl font-mono font-bold text-[#111] mb-3">
              {analytics?.playlistAdds?.length || 0}
            </div>
            <Sparkline data={playlistAddsData} width={200} height={40} color="#A855F7" />
          </div>
          <div className="liberty-card">
            <div className="liberty-label text-[11px] mb-2">Total Followers</div>
            <div className="text-3xl font-mono font-bold text-[#111]">
              {analytics?.playlistAdds
                ?.reduce((sum: number, p: any) => sum + p.followers, 0)
                .toLocaleString() || '0'}
            </div>
            <div className="flex items-center gap-1 text-sm tap-accent-radio mt-2">
              <TrendingUp size={14} />
              <span>+12% this week</span>
            </div>
          </div>
        </div>

        {/* Playlist Adds */}
        <div className="liberty-card">
          <div className="pb-4 border-b border-[#D9D7D2] mb-0">
            <h2 className="liberty-heading text-xl">Playlist Placements</h2>
          </div>
          <div className="divide-y divide-[#D9D7D2]">
            {analytics?.playlistAdds?.length === 0 ? (
              <div className="p-12 text-center">
                <ListMusic className="w-12 h-12 text-[#D9D7D2] mx-auto mb-4" />
                <p className="text-[#737373]">No playlist adds yet. Keep building momentum!</p>
              </div>
            ) : (
              analytics?.playlistAdds?.map((playlist: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-[#FAFAF8] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-tap-good/10 rounded-lg flex items-center justify-center">
                        <ListMusic className="w-6 h-6 tap-accent-radio" />
                      </div>
                      <div>
                        <h3 className="text-lg font-jakarta font-semibold text-[#111]">
                          {playlist.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#737373] mt-1">
                          <Users className="w-4 h-4" />
                          <span className="font-mono">
                            {playlist.followers.toLocaleString()} followers
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#737373] mb-1">Added</div>
                      <div className="liberty-metadata">{playlist.addedAt}</div>
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
