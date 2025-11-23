/**
 * Event Ingestion Module
 *
 * Ingests and transforms events from other systems (Tracker, MIG, Scenes, CMG)
 * into unified A&R events.
 */

import type { ANREventType, ANREventSource } from './types.js';
import { getCandidateBySlug, recordEvent } from './anrStore.js';
import { logger } from './utils/logger.js';
import { today, daysAgo } from './utils/dates.js';

/**
 * Ingest campaign events from Tracker/Fusion Layer
 */
export async function ingestCampaignEventsForArtist(artistSlug: string): Promise<number> {
  try {
    logger.debug('Ingesting campaign events', { artistSlug });

    const candidate = await getCandidateBySlug(artistSlug);
    if (!candidate) {
      logger.warn('Candidate not found, skipping event ingestion', { artistSlug });
      return 0;
    }

    // TODO: Fetch actual campaign events from Tracker/Fusion
    // Example: const campaigns = await trackerClient.getCampaigns({ artist_slug: artistSlug });

    let eventsIngested = 0;

    // Stub: Ingest campaign wins
    // for (const campaign of campaigns) {
    //   if (campaign.status === 'success') {
    //     await recordEvent(candidate.id, {
    //       event_type: 'campaign_win',
    //       event_date: campaign.date,
    //       weight: 1.5,
    //       source: 'tracker',
    //       metadata: { campaign_id: campaign.id, campaign_name: campaign.name },
    //     });
    //     eventsIngested++;
    //   }
    // }

    logger.debug('Campaign events ingested', { artistSlug, count: eventsIngested });
    return eventsIngested;
  } catch (error) {
    logger.error('Failed to ingest campaign events', error, { artistSlug });
    return 0;
  }
}

/**
 * Ingest playlist events from MIG
 */
export async function ingestPlaylistEventsFromMIG(artistSlug: string): Promise<number> {
  try {
    logger.debug('Ingesting playlist events from MIG', { artistSlug });

    const candidate = await getCandidateBySlug(artistSlug);
    if (!candidate) {
      logger.warn('Candidate not found, skipping event ingestion', { artistSlug });
      return 0;
    }

    // TODO: Fetch playlist additions from MIG
    // Example: const playlists = await migClient.getArtistPlaylists({ artist_slug: artistSlug });

    let eventsIngested = 0;

    // Stub: Ingest playlist additions
    // for (const playlist of playlists) {
    //   await recordEvent(candidate.id, {
    //     event_type: 'playlist_add',
    //     event_date: playlist.added_date,
    //     weight: calculatePlaylistWeight(playlist.followers),
    //     source: 'mig',
    //     metadata: { playlist_id: playlist.id, playlist_name: playlist.name },
    //   });
    //   eventsIngested++;
    // }

    logger.debug('Playlist events ingested', { artistSlug, count: eventsIngested });
    return eventsIngested;
  } catch (error) {
    logger.error('Failed to ingest playlist events', error, { artistSlug });
    return 0;
  }
}

/**
 * Ingest scene events from Scenes Engine
 */
export async function ingestSceneEventsFromScenesEngine(artistSlug: string): Promise<number> {
  try {
    logger.debug('Ingesting scene events from Scenes Engine', { artistSlug });

    const candidate = await getCandidateBySlug(artistSlug);
    if (!candidate) {
      logger.warn('Candidate not found, skipping event ingestion', { artistSlug });
      return 0;
    }

    // TODO: Fetch scene crossover events from Scenes Engine
    // Example: const sceneEvents = await scenesClient.getArtistSceneEvents({ artist_slug: artistSlug });

    let eventsIngested = 0;

    // Stub: Ingest scene crossovers
    // for (const event of sceneEvents) {
    //   if (event.type === 'scene_crossover') {
    //     await recordEvent(candidate.id, {
    //       event_type: 'scene_crossover',
    //       event_date: event.date,
    //       weight: 1.2,
    //       source: 'scenes',
    //       metadata: { from_scene: event.from_scene, to_scene: event.to_scene },
    //     });
    //     eventsIngested++;
    //   }
    // }

    logger.debug('Scene events ingested', { artistSlug, count: eventsIngested });
    return eventsIngested;
  } catch (error) {
    logger.error('Failed to ingest scene events', error, { artistSlug });
    return 0;
  }
}

/**
 * Ingest community events
 */
export async function ingestCommunityEvents(artistSlug: string): Promise<number> {
  try {
    logger.debug('Ingesting community events', { artistSlug });

    const candidate = await getCandidateBySlug(artistSlug);
    if (!candidate) {
      logger.warn('Candidate not found, skipping event ingestion', { artistSlug });
      return 0;
    }

    // TODO: Fetch community spike events
    // Example: const communityEvents = await communityClient.getEvents({ artist_slug: artistSlug });

    let eventsIngested = 0;

    logger.debug('Community events ingested', { artistSlug, count: eventsIngested });
    return eventsIngested;
  } catch (error) {
    logger.error('Failed to ingest community events', error, { artistSlug });
    return 0;
  }
}

/**
 * Ingest all events for an artist from all sources
 */
export async function ingestAllEventsForArtist(artistSlug: string): Promise<number> {
  logger.info('Ingesting all events', { artistSlug });

  const [campaignEvents, playlistEvents, sceneEvents, communityEvents] = await Promise.all([
    ingestCampaignEventsForArtist(artistSlug),
    ingestPlaylistEventsFromMIG(artistSlug),
    ingestSceneEventsFromScenesEngine(artistSlug),
    ingestCommunityEvents(artistSlug),
  ]);

  const totalEvents =
    campaignEvents + playlistEvents + sceneEvents + communityEvents;

  logger.info('All events ingested', { artistSlug, totalEvents });
  return totalEvents;
}

/**
 * Calculate weight for playlist based on followers
 */
function calculatePlaylistWeight(followers?: number): number {
  if (!followers) return 1.0;

  // Logarithmic scaling: 1k followers = 1.0, 10k = 1.5, 100k = 2.0, 1M = 2.5
  const baseWeight = 1.0;
  const logScale = Math.log10(followers / 1000);
  const weight = baseWeight + Math.max(0, logScale * 0.5);

  return Math.min(weight, 3.0); // Cap at 3.0
}

/**
 * Manual event recording (for admin/service use)
 */
export async function recordManualEvent(
  artistSlug: string,
  eventType: ANREventType,
  eventDate: string,
  weight: number = 1.0,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const candidate = await getCandidateBySlug(artistSlug);
    if (!candidate) {
      logger.warn('Candidate not found for manual event', { artistSlug });
      return false;
    }

    const event = await recordEvent(candidate.id, {
      event_type: eventType,
      event_date: eventDate,
      weight,
      source: 'manual',
      metadata,
    });

    if (event) {
      logger.info('Manual event recorded', {
        artistSlug,
        eventType,
        eventDate,
      });
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Failed to record manual event', error, { artistSlug, eventType });
    return false;
  }
}
