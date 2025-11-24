/**
 * ArtistCard - Individual artist card for talent radar
 */

import React from 'react';
import Link from 'next/link';
import { ScoreBar } from '../ui/ScoreBar';
import { CyanTag } from '../ui/CyanTag';
import { SeverityBadge } from '../ui/SeverityBadge';

interface ArtistCardProps {
  artistSlug: string;
  sceneSlug: string | null;
  microgenres: string[];
  momentum: number;
  breakoutScore: number;
  riskScore: number;
  type?: 'rising' | 'breakout' | 'risk';
}

export function ArtistCard({
  artistSlug,
  sceneSlug,
  microgenres,
  momentum,
  breakoutScore,
  riskScore,
  type = 'rising',
}: ArtistCardProps) {
  return (
    <Link
      href={`/talent/${artistSlug}`}
      className="block bg-[#161A21] border border-white/[0.06] rounded-2xl p-6 hover:border-[#3AA9BE]/50 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{artistSlug}</h3>
        {type === 'breakout' && (
          <SeverityBadge level="medium" label="Breakout" />
        )}
        {type === 'risk' && (
          <SeverityBadge level="high" label="At Risk" />
        )}
      </div>

      {sceneSlug && (
        <div className="mb-3">
          <CyanTag variant="subtle">{sceneSlug}</CyanTag>
        </div>
      )}

      <div className="space-y-3">
        <ScoreBar
          value={momentum}
          label="Momentum"
          color={momentum > 70 ? 'green' : momentum > 40 ? 'cyan' : 'slate'}
          size="sm"
        />
        <ScoreBar
          value={breakoutScore * 100}
          label="Breakout"
          color={breakoutScore > 0.7 ? 'green' : breakoutScore > 0.4 ? 'yellow' : 'slate'}
          size="sm"
        />
        {type === 'risk' && (
          <ScoreBar
            value={riskScore * 100}
            label="Risk"
            color="red"
            size="sm"
          />
        )}
      </div>

      {microgenres.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-4">
          {microgenres.slice(0, 2).map((genre) => (
            <CyanTag key={genre} variant="subtle">
              {genre}
            </CyanTag>
          ))}
        </div>
      )}
    </Link>
  );
}
