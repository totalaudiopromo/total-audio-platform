/**
 * Realtime
 *
 * Manages realtime subscriptions and streaming for RCF events:
 * - Websocket connections
 * - SSE (Server-Sent Events)
 * - Supabase Realtime subscriptions
 * - Event filtering based on user subscriptions
 */

import type { RCFEvent, RCFSubscription, RCFRealtimeMessage } from './types';
import { getLogger } from './utils/logger';
import { now } from './utils/time';

const logger = getLogger('[Realtime]');

/**
 * Create a realtime subscription for a user
 *
 * TODO: Connect to actual Supabase Realtime
 */
export function createRealtimeSubscription(
  userId: string,
  subscription: RCFSubscription,
  onEvent: (event: RCFEvent) => void
): () => void {
  logger.debug(`Creating realtime subscription for user ${userId}`);

  try {
    // TODO: Import Supabase client
    // import { createClient } from '@total-audio/core-db/client';
    // const supabase = createClient();

    // Subscribe to realtime channel
    // const channel = supabase
    //   .channel(`rcf:user:${userId}`)
    //   .on('broadcast', { event: 'new_event' }, (payload) => {
    //     const event = payload.payload as RCFEvent;
    //     if (shouldIncludeEvent(event, subscription)) {
    //       onEvent(event);
    //     }
    //   })
    //   .subscribe();

    // Return cleanup function
    // return () => {
    //   channel.unsubscribe();
    // };

    logger.info(`[STUB] Would create realtime subscription for user ${userId}`);

    // Stub: Return no-op cleanup function
    return () => {
      logger.debug(`[STUB] Would unsubscribe user ${userId}`);
    };
  } catch (error) {
    logger.error('Failed to create realtime subscription', error, { userId });
    return () => {}; // No-op cleanup
  }
}

/**
 * Check if event should be included based on user subscription
 */
export function shouldIncludeEvent(
  event: RCFEvent,
  subscription: RCFSubscription
): boolean {
  // Filter by event type
  if (
    subscription.subscribed_types.length > 0 &&
    !subscription.subscribed_types.includes(event.event_type)
  ) {
    return false;
  }

  // Filter by artist
  if (
    subscription.subscribed_artists.length > 0 &&
    event.artist_slug &&
    !subscription.subscribed_artists.includes(event.artist_slug)
  ) {
    return false;
  }

  // Filter by scene
  if (
    subscription.subscribed_scenes.length > 0 &&
    event.scene_slug &&
    !subscription.subscribed_scenes.includes(event.scene_slug)
  ) {
    return false;
  }

  return true;
}

/**
 * Create SSE (Server-Sent Events) stream
 *
 * For use in API routes to stream events to clients
 */
export function createSSEStream(
  subscription: RCFSubscription,
  onClose?: () => void
): ReadableStream<Uint8Array> {
  logger.debug('Creating SSE stream', { subscriptionId: subscription.id });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        // Send initial connection message
        const connectMessage: RCFRealtimeMessage = {
          type: 'ping',
          timestamp: now(),
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(connectMessage)}\n\n`));

        // TODO: Subscribe to realtime events
        // const cleanup = createRealtimeSubscription(
        //   subscription.user_id,
        //   subscription,
        //   (event) => {
        //     const message: RCFRealtimeMessage = {
        //       type: 'event',
        //       event,
        //       timestamp: now(),
        //     };
        //     controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
        //   }
        // );

        // Send periodic pings to keep connection alive
        const pingInterval = setInterval(() => {
          try {
            const pingMessage: RCFRealtimeMessage = {
              type: 'ping',
              timestamp: now(),
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(pingMessage)}\n\n`));
          } catch (error) {
            logger.error('Failed to send ping', error);
          }
        }, 30000); // Every 30 seconds

        // Store cleanup function
        (controller as any)._cleanup = () => {
          clearInterval(pingInterval);
          // cleanup?.();
          onClose?.();
        };
      } catch (error) {
        logger.error('Failed to start SSE stream', error);
        controller.error(error);
      }
    },

    cancel() {
      logger.debug('SSE stream cancelled');
      const cleanup = (this as any)._cleanup;
      if (cleanup) {
        cleanup();
      }
    },
  });
}

/**
 * Format event for SSE transmission
 */
export function formatSSEMessage(event: RCFEvent): string {
  const message: RCFRealtimeMessage = {
    type: 'event',
    event,
    timestamp: now(),
  };
  return `data: ${JSON.stringify(message)}\n\n`;
}

/**
 * Broadcast event to all connected clients
 *
 * TODO: Implement with actual websocket/SSE connections
 */
export async function broadcastEvent(event: RCFEvent): Promise<void> {
  logger.debug('Broadcasting event', { eventId: event.id, type: event.event_type });

  try {
    // TODO: Get all active connections
    // TODO: Filter by user subscriptions
    // TODO: Send event to matching connections

    logger.info(`[STUB] Would broadcast event ${event.id} to connected clients`);
  } catch (error) {
    logger.error('Failed to broadcast event', error, { eventId: event.id });
  }
}

export default {
  createRealtimeSubscription,
  shouldIncludeEvent,
  createSSEStream,
  formatSSEMessage,
  broadcastEvent,
};
