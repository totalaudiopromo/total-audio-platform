/**
 * Event Normalizer
 *
 * Standardizes ingested events into a consistent format:
 * - Validates event structure
 * - Ensures required fields
 * - Normalizes metadata
 * - Merges duplicates
 * - Applies defaults
 */

import type { RCFIngestedEvent, RCFNormalizedEvent, RCFEventType } from './types';
import { getLogger } from './utils/logger';
import { now } from './utils/time';

const logger = getLogger('[EventNormalizer]');

/**
 * Normalize a single ingested event
 */
export function normalizeEvent(event: RCFIngestedEvent): RCFNormalizedEvent | null {
  try {
    // Validate event type
    if (!isValidEventType(event.event_type)) {
      logger.warn('Invalid event type', { event_type: event.event_type });
      return null;
    }

    // Ensure required fields
    if (!event.metadata || typeof event.metadata !== 'object') {
      logger.warn('Missing or invalid metadata', { event });
      return null;
    }

    // Build normalized event
    const normalized: RCFNormalizedEvent = {
      event_type: event.event_type,
      artist_slug: event.artist_slug ?? null,
      entity_slug: event.entity_slug ?? null,
      scene_slug: event.scene_slug ?? null,
      metadata: normalizeMetadata(event.event_type, event.metadata),
      weight: event.weight ?? 1.0, // Default weight
    };

    return normalized;
  } catch (error) {
    logger.error('Failed to normalize event', error, { event });
    return null;
  }
}

/**
 * Normalize multiple ingested events
 */
export function normalizeEvents(events: RCFIngestedEvent[]): RCFNormalizedEvent[] {
  logger.debug(`Normalizing ${events.length} events...`);

  const normalized: RCFNormalizedEvent[] = [];

  for (const event of events) {
    const normalizedEvent = normalizeEvent(event);
    if (normalizedEvent) {
      normalized.push(normalizedEvent);
    }
  }

  logger.info(`Normalized ${normalized.length}/${events.length} events`);
  return normalized;
}

/**
 * Validate event type
 */
function isValidEventType(type: string): type is RCFEventType {
  const validTypes: RCFEventType[] = [
    'playlist_add',
    'press_feature',
    'radio_spin',
    'blog_post',
    'tweet',
    'journalist_activity',
    'scene_pulse_change',
    'scene_trend_spike',
    'mig_connection',
    'campaign_event',
    'autopilot_event',
    'tracker_event',
    'coverage_spike',
    'creative_breakthrough',
    'community_activity',
    'youtube_signal',
    'soundcloud_signal',
    'bandcamp_signal',
    'tiktok_signal',
    'instagram_signal',
  ];

  return validTypes.includes(type as RCFEventType);
}

/**
 * Normalize metadata based on event type
 */
function normalizeMetadata(
  eventType: RCFEventType,
  metadata: Record<string, unknown>
): Record<string, unknown> {
  // Add timestamp if missing
  const normalized = { ...metadata };

  if (!normalized.timestamp && !normalized.addedAt && !normalized.publishedAt) {
    normalized.timestamp = now();
  }

  // Type-specific normalization
  switch (eventType) {
    case 'playlist_add':
      return normalizePlaylistAddMetadata(normalized);
    case 'press_feature':
      return normalizePressFeatureMetadata(normalized);
    case 'radio_spin':
      return normalizeRadioSpinMetadata(normalized);
    case 'scene_pulse_change':
      return normalizeScenePulseMetadata(normalized);
    case 'creative_breakthrough':
      return normalizeCreativeBreakthroughMetadata(normalized);
    default:
      return normalized;
  }
}

/**
 * Normalize playlist add metadata
 */
function normalizePlaylistAddMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return {
    playlistName: metadata.playlistName || metadata.playlist_name || 'Unknown Playlist',
    playlistId: metadata.playlistId || metadata.playlist_id || '',
    curator: metadata.curator || null,
    curatorInfluence: normalizeNumber(metadata.curatorInfluence || metadata.curator_influence),
    followerCount: normalizeNumber(metadata.followerCount || metadata.follower_count),
    addedAt: metadata.addedAt || metadata.added_at || now(),
    position: normalizeNumber(metadata.position),
    previousPosition: normalizeNumber(metadata.previousPosition || metadata.previous_position),
  };
}

/**
 * Normalize press feature metadata
 */
function normalizePressFeatureMetadata(
  metadata: Record<string, unknown>
): Record<string, unknown> {
  return {
    publication: metadata.publication || 'Unknown Publication',
    publicationTier:
      metadata.publicationTier || metadata.publication_tier || 'indie',
    writer: metadata.writer || metadata.author || null,
    articleTitle: metadata.articleTitle || metadata.article_title || metadata.title || '',
    articleUrl: metadata.articleUrl || metadata.article_url || metadata.url || null,
    quote: metadata.quote || null,
    sentiment: metadata.sentiment || 'neutral',
    reach: normalizeNumber(metadata.reach),
  };
}

/**
 * Normalize radio spin metadata
 */
function normalizeRadioSpinMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return {
    stationName: metadata.stationName || metadata.station_name || 'Unknown Station',
    stationType: metadata.stationType || metadata.station_type || null,
    showName: metadata.showName || metadata.show_name || null,
    presenter: metadata.presenter || null,
    spinTime: metadata.spinTime || metadata.spin_time || now(),
    reach: normalizeNumber(metadata.reach),
    firstPlay: metadata.firstPlay || metadata.first_play || false,
  };
}

/**
 * Normalize scene pulse metadata
 */
function normalizeScenePulseMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const oldPulse = normalizeNumber(metadata.oldPulse || metadata.old_pulse) || 0;
  const newPulse = normalizeNumber(metadata.newPulse || metadata.new_pulse) || 0;
  const delta = newPulse - oldPulse;

  return {
    sceneName: metadata.sceneName || metadata.scene_name || 'Unknown Scene',
    oldPulse,
    newPulse,
    delta,
    direction: delta > 0 ? 'up' : 'down',
    contributingFactors: Array.isArray(metadata.contributingFactors)
      ? metadata.contributingFactors
      : [],
  };
}

/**
 * Normalize creative breakthrough metadata
 */
function normalizeCreativeBreakthroughMetadata(
  metadata: Record<string, unknown>
): Record<string, unknown> {
  return {
    breakthroughType:
      metadata.breakthroughType || metadata.breakthrough_type || 'motif',
    description: metadata.description || '',
    cmgScore: normalizeNumber(metadata.cmgScore || metadata.cmg_score),
    details: metadata.details || {},
  };
}

/**
 * Normalize number values
 */
function normalizeNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

/**
 * Merge duplicate events
 * Events are considered duplicates if they have the same:
 * - event_type
 * - artist_slug
 * - entity_slug
 * - Within a short time window
 */
export function mergeDuplicates(events: RCFNormalizedEvent[]): RCFNormalizedEvent[] {
  logger.debug(`Checking for duplicates in ${events.length} events...`);

  // Build a map of event signatures
  const eventMap = new Map<string, RCFNormalizedEvent>();

  for (const event of events) {
    const signature = getEventSignature(event);

    if (eventMap.has(signature)) {
      // Duplicate found - keep the one with higher weight
      const existing = eventMap.get(signature)!;
      if (event.weight > existing.weight) {
        eventMap.set(signature, event);
      }
    } else {
      eventMap.set(signature, event);
    }
  }

  const unique = Array.from(eventMap.values());
  const duplicatesRemoved = events.length - unique.length;

  if (duplicatesRemoved > 0) {
    logger.info(`Removed ${duplicatesRemoved} duplicate events`);
  }

  return unique;
}

/**
 * Generate event signature for duplicate detection
 */
function getEventSignature(event: RCFNormalizedEvent): string {
  return `${event.event_type}:${event.artist_slug}:${event.entity_slug}`;
}

export default {
  normalizeEvent,
  normalizeEvents,
  mergeDuplicates,
};
