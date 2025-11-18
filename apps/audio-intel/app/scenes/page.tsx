/**
 * /scenes - Global Scene Intelligence Dashboard
 */

'use client';

import React from 'react';
import { useScenes } from '@/hooks/useScenes';
import { PageHeader } from '@/components/scenes/PageHeader';
import { SceneList } from '@/components/scenes/SceneList';

export default function ScenesPage() {
  const { scenes, isLoading, isError, error, mutate } = useScenes({ limit: 50 });

  return (
    <div className="min-h-screen bg-[#0A0D12] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Global Scene Intelligence"
          subtitle="Real-time pulse tracking across music scenes, microgenres, and cultural movements"
        />

        <SceneList
          scenes={scenes || []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => mutate()}
        />

        {/* Info Box */}
        {!isLoading && !isError && scenes && scenes.length > 0 && (
          <div className="mt-12 bg-[#3AA9BE]/5 border border-[#3AA9BE]/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#3AA9BE] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              About Scenes Engine
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              The Scenes Engine analyzes music scenes, microgenres, and cultural movements across the industry.
              It combines data from the Music Industry Graph (MIG), Creative Memory Graph (CMG), and campaign performance
              to provide real-time insights into scene vitality, growth trends, and crossover potential.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
