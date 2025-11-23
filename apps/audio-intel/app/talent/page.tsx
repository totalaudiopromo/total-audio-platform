/**
 * /talent - Talent Radar Global Music Pulse
 */

'use client';

import React from 'react';
import { useTalentPulse } from '@/hooks/useTalentPulse';
import { PageHeader } from '@/components/scenes/PageHeader';
import { GlobalPulse } from '@/components/talent/GlobalPulse';
import { ArtistCard } from '@/components/talent/ArtistCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

export default function TalentRadarPage() {
  const { pulse, isLoading, isError, error, mutate } = useTalentPulse({ limit: 20 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D12] text-white p-8">
        <LoadingState message="Loading global pulse..." />
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="min-h-screen bg-[#0A0D12] text-white p-8">
        <ErrorState
          title="Failed to load talent pulse"
          message={error.message}
          code={error.code}
          onRetry={() => mutate()}
        />
      </div>
    );
  }

  if (!pulse) {
    return (
      <div className="min-h-screen bg-[#0A0D12] text-white p-8">
        <EmptyState
          title="No pulse data available"
          message="Talent radar data is not available yet."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D12] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Talent Radar"
          subtitle="A&R-grade intelligence tracking rising artists, breakout signals, and cultural momentum"
        />

        <GlobalPulse summary={pulse.summary} />

        {/* Rising Artists */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Rising Artists</h2>
          {pulse.topRisingArtists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pulse.topRisingArtists.slice(0, 6).map((artist) => (
                <ArtistCard
                  key={artist.artist_slug}
                  artistSlug={artist.artist_slug}
                  sceneSlug={artist.scene_slug}
                  microgenres={artist.microgenres}
                  momentum={artist.momentum}
                  breakoutScore={artist.breakout_score}
                  riskScore={artist.risk_score}
                  type="rising"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No rising artists"
              message="No artists with high momentum detected yet."
            />
          )}
        </section>

        {/* Breakout Candidates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Breakout Candidates</h2>
          {pulse.topBreakoutCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pulse.topBreakoutCandidates.slice(0, 6).map((artist) => (
                <ArtistCard
                  key={artist.artist_slug}
                  artistSlug={artist.artist_slug}
                  sceneSlug={artist.scene_slug}
                  microgenres={artist.microgenres}
                  momentum={artist.momentum}
                  breakoutScore={artist.breakout_score}
                  riskScore={artist.risk_score}
                  type="breakout"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No breakout candidates"
              message="No artists with high breakout potential detected yet."
            />
          )}
        </section>

        {/* Artists at Risk */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Artists at Risk</h2>
          {pulse.artistsAtRisk.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pulse.artistsAtRisk.slice(0, 6).map((artist) => (
                <ArtistCard
                  key={artist.artist_slug}
                  artistSlug={artist.artist_slug}
                  sceneSlug={artist.scene_slug}
                  microgenres={artist.microgenres}
                  momentum={artist.momentum}
                  breakoutScore={artist.breakout_score}
                  riskScore={artist.risk_score}
                  type="risk"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No artists at risk"
              message="No artists showing risk indicators."
            />
          )}
        </section>

        {/* Info Box */}
        <div className="mt-12 bg-[#3AA9BE]/5 border border-[#3AA9BE]/20 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#3AA9BE] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            About Talent Radar
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Talent Radar is a global intelligence layer that aggregates signals from MIG, Scenes Engine, CMG, Fusion Layer,
            Coverage Map, and more. It provides high-level artist radar profiles, detects momentum shifts, predicts breakout
            potential, and identifies risk signals. This is a pure intelligence layer - it does not trigger actions or manage shortlists.
          </p>
        </div>
      </div>
    </div>
  );
}
