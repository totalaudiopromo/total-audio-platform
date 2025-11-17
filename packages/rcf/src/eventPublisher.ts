/**
 * Event Publisher
 *
 * Publishes events to:
 * - Database (rcf_events table)
 * - Realtime channel (Supabase Realtime)
 * - Websocket connections (if applicable)
 */

import type { RCFEvent, RCFNormalizedEvent } from './types';
import { getLogger } from './utils/logger';
import { now } from './utils/time';

const logger = getLogger('[EventPublisher]');

/**
 * Publish events to database
 *
 * TODO: Connect to actual Supabase client
 */
export async function publishToDatabase(
  events: RCFNormalizedEvent[]
): Promise<RCFEvent[]> {
  logger.debug(`Publishing ${events.length} events to database...`);

  try {
    // TODO: Import Supabase client
    // import { createClient } from '@total-audio/core-db/server';
    // const supabase = createClient();

    // Prepare events for insertion
    const eventsToInsert = events.map((event) => ({
      event_type: event.event_type,
      artist_slug: event.artist_slug,
      entity_slug: event.entity_slug,
      scene_slug: event.scene_slug,
      metadata: event.metadata,
      weight: event.weight,
      created_at: now(),
    }));

    // TODO: Insert into database
    // const { data, error } = await supabase
    //   .from('rcf_events')
    //   .insert(eventsToInsert)
    //   .select();

    // if (error) {
    //   throw error;
    // }

    // logger.info(`Published ${data.length} events to database`);
    // return data as RCFEvent[];

    // Stub: Return mock events
    const mockEvents: RCFEvent[] = eventsToInsert.map((event, index) => ({
      id: `mock-${Date.now()}-${index}`,
      ...event,
      created_at: now(),
    }));

    logger.info(`[STUB] Would publish ${mockEvents.length} events to database`);
    return mockEvents;
  } catch (error) {
    logger.error('Failed to publish events to database', error);
    throw error;
  }
}

/**
 * Publish events to Realtime channel
 *
 * TODO: Connect to actual Supabase Realtime
 */
export async function publishToRealtime(events: RCFEvent[]): Promise<void> {
  logger.debug(`Publishing ${events.length} events to realtime channel...`);

  try {
    // TODO: Import Supabase client
    // import { createClient } from '@total-audio/core-db/server';
    // const supabase = createClient();

    // Send to realtime channel
    // await supabase.channel('realtime:rcf').send({
    //   type: 'broadcast',
    //   event: 'new_events',
    //   payload: events,
    // });

    logger.info(`[STUB] Would publish ${events.length} events to realtime channel`);
  } catch (error) {
    logger.error('Failed to publish events to realtime', error);
    // Don't throw - realtime publishing failure shouldn't break the pipeline
  }
}

/**
 * Publish a single event
 */
export async function publishEvent(event: RCFNormalizedEvent): Promise<RCFEvent | null> {
  try {
    const published = await publishToDatabase([event]);
    if (published.length > 0) {
      await publishToRealtime(published);
      return published[0];
    }
    return null;
  } catch (error) {
    logger.error('Failed to publish event', error, { event });
    return null;
  }
}

/**
 * Publish multiple events
 */
export async function publishEvents(events: RCFNormalizedEvent[]): Promise<RCFEvent[]> {
  if (events.length === 0) {
    logger.debug('No events to publish');
    return [];
  }

  try {
    logger.info(`Publishing ${events.length} events...`);

    // Publish to database
    const published = await publishToDatabase(events);

    // Publish to realtime (non-blocking)
    publishToRealtime(published).catch((error) => {
      logger.warn('Realtime publishing failed (non-blocking)', { error });
    });

    logger.info(`Successfully published ${published.length} events`);
    return published;
  } catch (error) {
    logger.error('Failed to publish events', error);
    return [];
  }
}

export default {
  publishEvent,
  publishEvents,
  publishToDatabase,
  publishToRealtime,
};
