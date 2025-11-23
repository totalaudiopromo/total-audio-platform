/**
 * Feed Builder
 *
 * Builds paginated, filtered feeds for users:
 * - Query events from database
 * - Apply filters
 * - Paginate results
 * - Mark new events
 * - Format for UI
 */

import type {
  RCFEvent,
  RCFUserFeedEntry,
  RCFFeedFilter,
  RCFSubscription,
  RCFMarker,
} from './types';
import { getLogger } from './utils/logger';
import { now, minutesAgo } from './utils/time';

const logger = getLogger('[FeedBuilder]');

/**
 * Build feed for a user
 *
 * TODO: Connect to actual database
 */
export async function buildUserFeed(
  userId: string,
  filter?: RCFFeedFilter
): Promise<RCFUserFeedEntry[]> {
  logger.debug(`Building feed for user ${userId}`, filter);

  try {
    // Get user subscription to apply filters
    // TODO: Import subscription engine
    // const subscription = await getUserSubscription(userId);

    // Get user marker to determine new events
    const marker = await getUserMarker(userId);

    // Query events
    const events = await queryEvents(filter);

    // Convert to feed entries
    const feedEntries = events.map((event) => toFeedEntry(event, marker));

    logger.info(`Built feed with ${feedEntries.length} entries for user ${userId}`);
    return feedEntries;
  } catch (error) {
    logger.error('Failed to build user feed', error, { userId, filter });
    return [];
  }
}

/**
 * Query events from database with filters
 */
async function queryEvents(filter?: RCFFeedFilter): Promise<RCFEvent[]> {
  try {
    // TODO: Import Supabase client
    // import { createClient } from '@total-audio/core-db/server';
    // const supabase = createClient();

    // Build query
    // let query = supabase
    //   .from('rcf_events')
    //   .select('*');

    // Apply filters
    // if (filter?.event_types && filter.event_types.length > 0) {
    //   query = query.in('event_type', filter.event_types);
    // }

    // if (filter?.artist_slugs && filter.artist_slugs.length > 0) {
    //   query = query.in('artist_slug', filter.artist_slugs);
    // }

    // if (filter?.scene_slugs && filter.scene_slugs.length > 0) {
    //   query = query.in('scene_slug', filter.scene_slugs);
    // }

    // if (filter?.entity_slugs && filter.entity_slugs.length > 0) {
    //   query = query.in('entity_slug', filter.entity_slugs);
    // }

    // if (filter?.min_weight !== undefined) {
    //   query = query.gte('weight', filter.min_weight);
    // }

    // if (filter?.max_weight !== undefined) {
    //   query = query.lte('weight', filter.max_weight);
    // }

    // if (filter?.since) {
    //   query = query.gte('created_at', filter.since);
    // }

    // if (filter?.before) {
    //   query = query.lte('created_at', filter.before);
    // }

    // Order by created_at desc
    // query = query.order('created_at', { ascending: false });

    // Pagination
    // const limit = filter?.limit || 50;
    // const offset = filter?.offset || 0;
    // query = query.range(offset, offset + limit - 1);

    // Execute query
    // const { data, error } = await query;

    // if (error) {
    //   throw error;
    // }

    // return data as RCFEvent[];

    // Stub: Return mock events
    const mockEvents: RCFEvent[] = generateMockEvents(filter?.limit || 50);
    logger.info(`[STUB] Would query ${mockEvents.length} events from database`);
    return mockEvents;
  } catch (error) {
    logger.error('Failed to query events', error, { filter });
    return [];
  }
}

/**
 * Get user marker
 */
async function getUserMarker(userId: string): Promise<RCFMarker | null> {
  try {
    // TODO: Import Supabase client
    // import { createClient } from '@total-audio/core-db/server';
    // const supabase = createClient();

    // const { data, error } = await supabase
    //   .from('rcf_markers')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .single();

    // if (error) {
    //   if (error.code === 'PGRST116') {
    //     // Not found - create default
    //     return await createUserMarker(userId);
    //   }
    //   throw error;
    // }

    // return data as RCFMarker;

    // Stub: Return mock marker (1 hour ago)
    const mockMarker: RCFMarker = {
      id: `mock-marker-${userId}`,
      user_id: userId,
      last_seen_at: minutesAgo(60),
      created_at: now(),
      updated_at: now(),
    };

    return mockMarker;
  } catch (error) {
    logger.error('Failed to get user marker', error, { userId });
    return null;
  }
}

/**
 * Create user marker
 */
async function createUserMarker(userId: string): Promise<RCFMarker | null> {
  try {
    // TODO: Import Supabase client
    // const markerData = {
    //   user_id: userId,
    //   last_seen_at: now(),
    //   created_at: now(),
    //   updated_at: now(),
    // };

    // const { data, error } = await supabase
    //   .from('rcf_markers')
    //   .insert(markerData)
    //   .select()
    //   .single();

    // if (error) {
    //   throw error;
    // }

    // return data as RCFMarker;

    const mockMarker: RCFMarker = {
      id: `mock-marker-${userId}`,
      user_id: userId,
      last_seen_at: now(),
      created_at: now(),
      updated_at: now(),
    };

    return mockMarker;
  } catch (error) {
    logger.error('Failed to create user marker', error, { userId });
    return null;
  }
}

/**
 * Update user marker
 */
export async function updateUserMarker(
  userId: string,
  lastSeenAt?: string
): Promise<RCFMarker | null> {
  try {
    // TODO: Import Supabase client
    // const { data, error } = await supabase
    //   .from('rcf_markers')
    //   .update({
    //     last_seen_at: lastSeenAt || now(),
    //     updated_at: now(),
    //   })
    //   .eq('user_id', userId)
    //   .select()
    //   .single();

    // if (error) {
    //   throw error;
    // }

    // return data as RCFMarker;

    logger.info(`[STUB] Would update marker for user ${userId}`);
    return await getUserMarker(userId);
  } catch (error) {
    logger.error('Failed to update user marker', error, { userId });
    return null;
  }
}

/**
 * Convert event to feed entry
 */
function toFeedEntry(event: RCFEvent, marker: RCFMarker | null): RCFUserFeedEntry {
  const isNew = marker ? new Date(event.created_at) > new Date(marker.last_seen_at) : false;
  const isHighlighted = event.weight >= 0.7; // Highlight high-weight events

  return {
    ...event,
    isNew,
    isHighlighted,
    displayCategory: getDisplayCategory(event.event_type),
    icon: getEventIcon(event.event_type),
  };
}

/**
 * Get display category for event type
 */
function getDisplayCategory(eventType: string): string {
  const categoryMap: Record<string, string> = {
    playlist_add: 'Coverage',
    press_feature: 'Coverage',
    radio_spin: 'Coverage',
    blog_post: 'Coverage',
    scene_pulse_change: 'Scenes',
    scene_trend_spike: 'Scenes',
    mig_connection: 'Network',
    campaign_event: 'Campaigns',
    autopilot_event: 'Campaigns',
    tracker_event: 'Campaigns',
    coverage_spike: 'Signals',
    creative_breakthrough: 'Creative',
    community_activity: 'Community',
    youtube_signal: 'External',
    soundcloud_signal: 'External',
    bandcamp_signal: 'External',
    tiktok_signal: 'External',
    instagram_signal: 'External',
  };

  return categoryMap[eventType] || 'Other';
}

/**
 * Get icon identifier for event type
 */
function getEventIcon(eventType: string): string {
  const iconMap: Record<string, string> = {
    playlist_add: '🎵',
    press_feature: '📰',
    radio_spin: '📻',
    blog_post: '✍️',
    tweet: '🐦',
    journalist_activity: '👤',
    scene_pulse_change: '📊',
    scene_trend_spike: '📈',
    mig_connection: '🔗',
    campaign_event: '🎯',
    autopilot_event: '🤖',
    tracker_event: '📋',
    coverage_spike: '🚀',
    creative_breakthrough: '💡',
    community_activity: '👥',
    youtube_signal: '📺',
    soundcloud_signal: '🎧',
    bandcamp_signal: '💿',
    tiktok_signal: '🎬',
    instagram_signal: '📸',
  };

  return iconMap[eventType] || '📌';
}

/**
 * Generate mock events for testing
 */
function generateMockEvents(count: number): RCFEvent[] {
  const events: RCFEvent[] = [];
  const eventTypes = ['playlist_add', 'press_feature', 'radio_spin', 'scene_pulse_change'];

  for (let i = 0; i < count; i++) {
    const eventType = eventTypes[i % eventTypes.length];
    events.push({
      id: `mock-event-${i}`,
      event_type: eventType as any,
      artist_slug: `artist-${i % 10}`,
      entity_slug: `entity-${i}`,
      scene_slug: i % 3 === 0 ? `scene-${i % 5}` : null,
      metadata: {
        mockData: true,
        index: i,
      },
      weight: 0.5 + Math.random() * 0.5,
      created_at: minutesAgo(i * 5),
    });
  }

  return events;
}

export default {
  buildUserFeed,
  updateUserMarker,
};
