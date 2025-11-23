/**
 * SceneCard - Individual scene card with pulse indicators
 */

import React from 'react';
import Link from 'next/link';
import { TrendArrow } from '../ui/TrendArrow';
import { CyanTag } from '../ui/CyanTag';
import { ScoreBar } from '../ui/ScoreBar';

interface SceneCardProps {
  slug: string;
  name: string;
  region: string | null;
  microgenres: string[];
  hotness?: number;
  momentum?: {
    trend: 'rising' | 'stable' | 'falling';
    shortTerm: number;
  };
  metrics?: {
    totalMembers: number;
    activeCampaigns: number;
  };
}

export function SceneCard({
  slug,
  name,
  region,
  microgenres,
  hotness,
  momentum,
  metrics,
}: SceneCardProps) {
  return (
    <Link
      href={`/scenes/${slug}`}
      className="block bg-[#161A21] border border-white/[0.06] rounded-2xl p-6 hover:border-[#3AA9BE]/50 transition-all duration-200 hover:shadow-lg"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        {region && (
          <p className="text-sm text-slate-400">{region}</p>
        )}
      </div>

      {hotness !== undefined && (
        <div className="mb-4">
          <ScoreBar
            value={hotness}
            label="Hotness"
            color={hotness > 70 ? 'green' : hotness > 40 ? 'cyan' : 'slate'}
            size="md"
          />
        </div>
      )}

      {momentum && (
        <div className="mb-4">
          <TrendArrow
            direction={momentum.trend}
            value={momentum.shortTerm}
          />
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Members</div>
            <div
              className="text-lg font-bold text-white"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {metrics.totalMembers}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Campaigns</div>
            <div
              className="text-lg font-bold text-white"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {metrics.activeCampaigns}
            </div>
          </div>
        </div>
      )}

      {microgenres.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {microgenres.slice(0, 3).map((genre) => (
            <CyanTag key={genre} variant="subtle">
              {genre}
            </CyanTag>
          ))}
          {microgenres.length > 3 && (
            <CyanTag variant="subtle">+{microgenres.length - 3}</CyanTag>
          )}
        </div>
      )}
    </Link>
  );
}
