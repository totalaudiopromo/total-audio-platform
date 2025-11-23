/**
 * Playlist Ingestor
 *
 * Detects and ingests playlist-related events:
 * - New playlist adds
 * - Playlist position changes
 * - Curator activity
 */

import type { RCFIngestedEvent } from '../types';
import { getLogger } from '../utils/logger';
import { minutesAgo } from '../utils/time';

const logger = getLogger('[PlaylistIngestor]');

export interface PlaylistAddSource {
  artistSlug: string;
  playlistId: string;
  playlistName: string;
  curator?: string;
  curatorInfluence?: number;
  followerCount?: number;
  addedAt: string;
  position?: number;
  previousPosition?: number;
}

/**
 * Ingest playlist add events from Tracker + MIG
 *
 * TODO: Connect to actual Tracker database and MIG API
 * For now, returns stub data structure
 */
export async function ingestPlaylistAdds(): Promise<RCFIngestedEvent[]> {
  logger.debug('Ingesting playlist adds...');

  try {
    // TODO: Query Tracker database for recent playlist adds
    // SELECT * FROM tracker_campaign_activities
    // WHERE activity_type = 'playlist_add'
    // AND created_at > $1
    // ORDER BY created_at DESC

    // TODO: Query MIG for playlist relationship changes
    // GET /api/mig/relationships/changes?since=<timestamp>&type=playlist

    // Stub: Return empty array for now
    // Replace with actual query when Tracker/MIG integration is ready
    const recentAdds: PlaylistAddSource[] = await fetchRecentPlaylistAdds();

    const events: RCFIngestedEvent[] = recentAdds.map((add) => ({
      event_type: 'playlist_add',
      artist_slug: add.artistSlug,
      entity_slug: add.playlistId,
      scene_slug: null, // TODO: Derive from MIG scene mapping
      metadata: {
        playlistName: add.playlistName,
        playlistId: add.playlistId,
        curator: add.curator,
        curatorInfluence: add.curatorInfluence,
        followerCount: add.followerCount,
        addedAt: add.addedAt,
        position: add.position,
        previousPosition: add.previousPosition,
      },
      source: 'playlistIngestor',
    }));

    logger.info(`Ingested ${events.length} playlist add events`);
    return events;
  } catch (error) {
    logger.error('Failed to ingest playlist adds', error);
    return [];
  }
}

/**
 * Fetch recent playlist adds from data sources
 * TODO: Replace with actual database query
 */
async function fetchRecentPlaylistAdds(): Promise<PlaylistAddSource[]> {
  // Stub implementation
  // In production, this would query:
  // 1. Tracker campaign activities
  // 2. MIG playlist relationships
  // 3. Spotify API (if integrated)

  const since = minutesAgo(60); // Last 60 minutes
  logger.debug(`Fetching playlist adds since ${since}`);

  // TODO: Implement actual database query
  // const { data, error } = await supabase
  //   .from('tracker_campaign_activities')
  //   .select('*')
  //   .eq('activity_type', 'playlist_add')
  //   .gte('created_at', since)
  //   .order('created_at', { ascending: false });

  return [];
}

/**
 * Detect playlist position changes
 * TODO: Implement when playlist tracking is available
 */
export async function ingestPlaylistPositionChanges(): Promise<RCFIngestedEvent[]> {
  logger.debug('Ingesting playlist position changes...');

  // TODO: Query for position changes over time
  // This requires historical playlist position tracking

  return [];
}

export default {
  ingestPlaylistAdds,
  ingestPlaylistPositionChanges,
};
