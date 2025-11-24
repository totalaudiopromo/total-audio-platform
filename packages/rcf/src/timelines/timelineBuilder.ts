/**
 * Timeline Builder
 * Creates event timelines for artists
 */

import type { RCFEvent } from '../types';
import { getLogger } from '../utils/logger';

const logger = getLogger('[TimelineBuilder]');

export interface TimelineEntry {
  date: string;
  events: RCFEvent[];
  event_count: number;
  total_weight: number;
}

export async function buildTimeline(
  artistSlug: string,
  events: RCFEvent[]
): Promise<TimelineEntry[]> {
  logger.debug(`Building timeline for artist: ${artistSlug}`);

  const artistEvents = events.filter((e) => e.artist_slug === artistSlug);

  // Group by date
  const dateGroups = new Map<string, RCFEvent[]>();

  for (const event of artistEvents) {
    const date = new Date(event.created_at).toISOString().split('T')[0];
    if (!dateGroups.has(date)) {
      dateGroups.set(date, []);
    }
    dateGroups.get(date)!.push(event);
  }

  // Convert to timeline entries
  const timeline: TimelineEntry[] = [];

  for (const [date, dayEvents] of dateGroups.entries()) {
    timeline.push({
      date,
      events: dayEvents,
      event_count: dayEvents.length,
      total_weight: dayEvents.reduce((sum, e) => sum + e.weight, 0),
    });
  }

  // Sort by date descending
  timeline.sort((a, b) => b.date.localeCompare(a.date));

  logger.info(`Built timeline with ${timeline.length} entries for ${artistSlug}`);

  return timeline;
}

export default { buildTimeline };
