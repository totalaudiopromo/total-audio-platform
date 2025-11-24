/**
 * Comparison Engine
 * Compare multiple artists side-by-side
 */

import type { RCFEvent } from '../types';
import { getLogger } from '../utils/logger';

const logger = getLogger('[ComparisonEngine]');

export interface ArtistComparison {
  artist_slug: string;
  event_count: number;
  total_weight: number;
  avg_weight: number;
  velocity: number;
  event_type_distribution: Record<string, number>;
  coverage_quality_score: number;
}

export async function compareArtists(
  artistSlugs: string[],
  events: RCFEvent[],
  windowHours: number = 24
): Promise<ArtistComparison[]> {
  logger.debug(`Comparing ${artistSlugs.length} artists`);

  const comparisons: ArtistComparison[] = [];

  for (const artistSlug of artistSlugs) {
    const artistEvents = events.filter((e) => e.artist_slug === artistSlug);

    const eventCount = artistEvents.length;
    const totalWeight = artistEvents.reduce((sum, e) => sum + e.weight, 0);
    const avgWeight = eventCount > 0 ? totalWeight / eventCount : 0;
    const velocity = eventCount / windowHours;

    // Event type distribution
    const distribution: Record<string, number> = {};
    for (const event of artistEvents) {
      distribution[event.event_type] = (distribution[event.event_type] || 0) + 1;
    }

    comparisons.push({
      artist_slug: artistSlug,
      event_count: eventCount,
      total_weight: totalWeight,
      avg_weight: avgWeight,
      velocity,
      event_type_distribution: distribution,
      coverage_quality_score: avgWeight * 100,
    });
  }

  logger.info(`Generated comparisons for ${comparisons.length} artists`);

  return comparisons;
}

export default { compareArtists };
