/**
 * Trends Engine
 *
 * Computes trend scores for artists, scenes, playlists, publications
 * Based on:
 * - Event frequency
 * - Weighted event scores
 * - Velocity change over time
 * - Rolling windows (1h, 6h, 24h, 7d, 30d)
 */

import type { RCFEvent } from '../types';
import { getLogger } from '../utils/logger';
import { hoursAgo, daysAgo, minutesAgo } from '../utils/time';

const logger = getLogger('[TrendsEngine]');

export type TrendWindow = '1h' | '6h' | '24h' | '7d' | '30d';
export type EntityType = 'artist' | 'scene' | 'playlist' | 'publication' | 'blog' | 'station';

export interface TrendSnapshot {
  entity_type: EntityType;
  entity_slug: string;
  window: TrendWindow;
  score: number; // 0-100
  velocity: number; // events per hour
  acceleration: number; // velocity change rate
  change: number; // % change from previous window
  event_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface TrendCalculationInput {
  events: RCFEvent[];
  window: TrendWindow;
  previousWindowEvents?: RCFEvent[];
}

/**
 * Calculate trends for a window
 */
export async function calculateTrends(
  window: TrendWindow,
  events: RCFEvent[]
): Promise<TrendSnapshot[]> {
  logger.debug(`Calculating trends for window: ${window}`);

  // Get time boundaries for the window
  const windowStart = getWindowStart(window);

  // Filter events within window
  const windowEvents = events.filter((e) => new Date(e.created_at) >= new Date(windowStart));

  logger.info(`Found ${windowEvents.length} events in window ${window}`);

  // Group events by entity type and slug
  const entityGroups = groupEventsByEntity(windowEvents);

  // Calculate trend score for each entity
  const trends: TrendSnapshot[] = [];

  for (const [entityKey, entityEvents] of entityGroups.entries()) {
    const [entityType, entitySlug] = entityKey.split(':') as [EntityType, string];

    const trend = calculateEntityTrend(entityType, entitySlug, window, entityEvents);
    trends.push(trend);
  }

  // Sort by score descending
  trends.sort((a, b) => b.score - a.score);

  logger.info(`Calculated ${trends.length} trends for window ${window}`);

  return trends;
}

/**
 * Get window start timestamp
 */
function getWindowStart(window: TrendWindow): string {
  switch (window) {
    case '1h':
      return hoursAgo(1);
    case '6h':
      return hoursAgo(6);
    case '24h':
      return hoursAgo(24);
    case '7d':
      return daysAgo(7);
    case '30d':
      return daysAgo(30);
    default:
      return hoursAgo(24);
  }
}

/**
 * Get window duration in hours
 */
function getWindowHours(window: TrendWindow): number {
  switch (window) {
    case '1h':
      return 1;
    case '6h':
      return 6;
    case '24h':
      return 24;
    case '7d':
      return 7 * 24;
    case '30d':
      return 30 * 24;
    default:
      return 24;
  }
}

/**
 * Group events by entity type and slug
 */
function groupEventsByEntity(events: RCFEvent[]): Map<string, RCFEvent[]> {
  const groups = new Map<string, RCFEvent[]>();

  for (const event of events) {
    // Group by artist
    if (event.artist_slug) {
      const key = `artist:${event.artist_slug}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(event);
    }

    // Group by scene
    if (event.scene_slug) {
      const key = `scene:${event.scene_slug}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(event);
    }

    // Group by entity (playlist, publication, etc.)
    if (event.entity_slug) {
      const entityType = inferEntityType(event);
      if (entityType) {
        const key = `${entityType}:${event.entity_slug}`;
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(event);
      }
    }
  }

  return groups;
}

/**
 * Infer entity type from event
 */
function inferEntityType(event: RCFEvent): EntityType | null {
  switch (event.event_type) {
    case 'playlist_add':
      return 'playlist';
    case 'press_feature':
      return 'publication';
    case 'blog_post':
      return 'blog';
    case 'radio_spin':
      return 'station';
    default:
      return null;
  }
}

/**
 * Calculate trend for a single entity
 */
function calculateEntityTrend(
  entityType: EntityType,
  entitySlug: string,
  window: TrendWindow,
  events: RCFEvent[]
): TrendSnapshot {
  const windowHours = getWindowHours(window);

  // Calculate metrics
  const eventCount = events.length;
  const velocity = eventCount / windowHours; // events per hour

  // Calculate weighted score (sum of all event weights)
  const weightedScore = events.reduce((sum, e) => sum + e.weight, 0);

  // Normalize to 0-100 scale
  // Formula: (weightedScore / eventCount) * eventCount * multiplier
  // Higher event count + higher average weight = higher score
  const avgWeight = eventCount > 0 ? weightedScore / eventCount : 0;
  const rawScore = avgWeight * eventCount * 10; // Multiplier for scaling

  // Cap at 100
  const score = Math.min(100, rawScore);

  // TODO: Calculate acceleration and change (requires previous window data)
  const acceleration = 0;
  const change = 0;

  // Extract metadata
  const metadata = {
    avgWeight,
    totalWeight: weightedScore,
    eventTypes: getEventTypeDistribution(events),
  };

  return {
    entity_type: entityType,
    entity_slug: entitySlug,
    window,
    score: Math.round(score * 100) / 100,
    velocity: Math.round(velocity * 100) / 100,
    acceleration,
    change,
    event_count: eventCount,
    metadata,
    created_at: new Date().toISOString(),
  };
}

/**
 * Get distribution of event types
 */
function getEventTypeDistribution(events: RCFEvent[]): Record<string, number> {
  const distribution: Record<string, number> = {};

  for (const event of events) {
    distribution[event.event_type] = (distribution[event.event_type] || 0) + 1;
  }

  return distribution;
}

/**
 * Calculate acceleration (requires historical data)
 */
export function calculateAcceleration(
  currentVelocity: number,
  previousVelocity: number,
  windowHours: number
): number {
  if (windowHours === 0) return 0;
  return (currentVelocity - previousVelocity) / windowHours;
}

/**
 * Calculate percentage change
 */
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get top trending entities for a window
 */
export async function getTopTrending(
  window: TrendWindow,
  entityType?: EntityType,
  limit: number = 10
): Promise<TrendSnapshot[]> {
  // TODO: Query from database instead of recalculating
  // For now, return mock data structure

  logger.debug(`Getting top trending for window: ${window}, type: ${entityType || 'all'}`);

  return [];
}

/**
 * Get trending artists
 */
export async function getTrendingArtists(window: TrendWindow, limit: number = 10): Promise<TrendSnapshot[]> {
  return getTopTrending(window, 'artist', limit);
}

/**
 * Get trending scenes
 */
export async function getTrendingScenes(window: TrendWindow, limit: number = 10): Promise<TrendSnapshot[]> {
  return getTopTrending(window, 'scene', limit);
}

/**
 * Get trending playlists
 */
export async function getTrendingPlaylists(window: TrendWindow, limit: number = 10): Promise<TrendSnapshot[]> {
  return getTopTrending(window, 'playlist', limit);
}

/**
 * Get trending publications
 */
export async function getTrendingPublications(window: TrendWindow, limit: number = 10): Promise<TrendSnapshot[]> {
  return getTopTrending(window, 'publication', limit);
}

export default {
  calculateTrends,
  getTopTrending,
  getTrendingArtists,
  getTrendingScenes,
  getTrendingPlaylists,
  getTrendingPublications,
  calculateAcceleration,
  calculateChange,
};
