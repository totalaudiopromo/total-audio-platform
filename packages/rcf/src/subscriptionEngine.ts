/**
 * Subscription Engine
 *
 * Manages user subscriptions to RCF events:
 * - Create default subscriptions
 * - Update subscription preferences
 * - Get user subscriptions
 * - Validate subscription changes
 */

import type { RCFSubscription, RCFSubscriptionInput, RCFEventType } from './types';
import { getLogger } from './utils/logger';
import { now } from './utils/time';

const logger = getLogger('[SubscriptionEngine]');

/**
 * Default subscription types for new users
 */
export const DEFAULT_SUBSCRIPTION_TYPES: RCFEventType[] = [
  'playlist_add',
  'press_feature',
  'radio_spin',
  'campaign_event',
  'scene_pulse_change',
  'creative_breakthrough',
];

/**
 * Create default subscription for a new user
 *
 * TODO: Connect to actual database
 */
export async function createDefaultSubscription(
  userId: string,
  workspaceId?: string
): Promise<RCFSubscription | null> {
  logger.debug(`Creating default subscription for user ${userId}`);

  try {
    // TODO: Import Supabase client
    // import { createClient } from '@total-audio/core-db/server';
    // const supabase = createClient();

    const subscriptionData = {
      user_id: userId,
      workspace_id: workspaceId || null,
      subscribed_types: DEFAULT_SUBSCRIPTION_TYPES,
      subscribed_artists: [],
      subscribed_scenes: [],
      created_at: now(),
      updated_at: now(),
    };

    // TODO: Insert into database
    // const { data, error } = await supabase
    //   .from('rcf_subscriptions')
    //   .insert(subscriptionData)
    //   .select()
    //   .single();

    // if (error) {
    //   throw error;
    // }

    // logger.info(`Created default subscription for user ${userId}`);
    // return data as RCFSubscription;

    // Stub: Return mock subscription
    const mockSubscription: RCFSubscription = {
      id: `mock-sub-${userId}`,
      ...subscriptionData,
    };

    logger.info(`[STUB] Would create default subscription for user ${userId}`);
    return mockSubscription;
  } catch (error) {
    logger.error('Failed to create default subscription', error, { userId });
    return null;
  }
}

/**
 * Get user subscription
 */
export async function getUserSubscription(
  userId: string
): Promise<RCFSubscription | null> {
  logger.debug(`Getting subscription for user ${userId}`);

  try {
    // TODO: Import Supabase client
    // import { createClient } from '@total-audio/core-db/server';
    // const supabase = createClient();

    // TODO: Query database
    // const { data, error } = await supabase
    //   .from('rcf_subscriptions')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .single();

    // if (error) {
    //   if (error.code === 'PGRST116') {
    //     // Not found - create default
    //     return await createDefaultSubscription(userId);
    //   }
    //   throw error;
    // }

    // return data as RCFSubscription;

    // Stub: Return default subscription
    logger.info(`[STUB] Would get subscription for user ${userId}`);
    return await createDefaultSubscription(userId);
  } catch (error) {
    logger.error('Failed to get user subscription', error, { userId });
    return null;
  }
}

/**
 * Update user subscription
 */
export async function updateUserSubscription(
  userId: string,
  updates: RCFSubscriptionInput
): Promise<RCFSubscription | null> {
  logger.debug(`Updating subscription for user ${userId}`, updates);

  try {
    // Validate updates
    const validatedUpdates = validateSubscriptionUpdates(updates);

    // TODO: Import Supabase client
    // import { createClient } from '@total-audio/core-db/server';
    // const supabase = createClient();

    // TODO: Update database
    // const { data, error } = await supabase
    //   .from('rcf_subscriptions')
    //   .update({
    //     ...validatedUpdates,
    //     updated_at: now(),
    //   })
    //   .eq('user_id', userId)
    //   .select()
    //   .single();

    // if (error) {
    //   throw error;
    // }

    // logger.info(`Updated subscription for user ${userId}`);
    // return data as RCFSubscription;

    // Stub: Return mock updated subscription
    const existing = await getUserSubscription(userId);
    if (!existing) {
      return null;
    }

    const updated: RCFSubscription = {
      ...existing,
      ...validatedUpdates,
      updated_at: now(),
    };

    logger.info(`[STUB] Would update subscription for user ${userId}`);
    return updated;
  } catch (error) {
    logger.error('Failed to update user subscription', error, { userId, updates });
    return null;
  }
}

/**
 * Validate subscription updates
 */
function validateSubscriptionUpdates(updates: RCFSubscriptionInput): RCFSubscriptionInput {
  const validated: RCFSubscriptionInput = {};

  if (updates.subscribed_types !== undefined) {
    // Ensure unique and valid event types
    validated.subscribed_types = Array.from(new Set(updates.subscribed_types));
  }

  if (updates.subscribed_artists !== undefined) {
    // Ensure unique artist slugs
    validated.subscribed_artists = Array.from(new Set(updates.subscribed_artists));
  }

  if (updates.subscribed_scenes !== undefined) {
    // Ensure unique scene slugs
    validated.subscribed_scenes = Array.from(new Set(updates.subscribed_scenes));
  }

  return validated;
}

/**
 * Add event types to user subscription
 */
export async function addEventTypes(
  userId: string,
  eventTypes: RCFEventType[]
): Promise<RCFSubscription | null> {
  const existing = await getUserSubscription(userId);
  if (!existing) {
    return null;
  }

  const currentTypes = new Set(existing.subscribed_types);
  eventTypes.forEach((type) => currentTypes.add(type));

  return await updateUserSubscription(userId, {
    subscribed_types: Array.from(currentTypes),
  });
}

/**
 * Remove event types from user subscription
 */
export async function removeEventTypes(
  userId: string,
  eventTypes: RCFEventType[]
): Promise<RCFSubscription | null> {
  const existing = await getUserSubscription(userId);
  if (!existing) {
    return null;
  }

  const typesToRemove = new Set(eventTypes);
  const filteredTypes = existing.subscribed_types.filter((type) => !typesToRemove.has(type));

  return await updateUserSubscription(userId, {
    subscribed_types: filteredTypes,
  });
}

/**
 * Subscribe to artist
 */
export async function subscribeToArtist(
  userId: string,
  artistSlug: string
): Promise<RCFSubscription | null> {
  const existing = await getUserSubscription(userId);
  if (!existing) {
    return null;
  }

  if (existing.subscribed_artists.includes(artistSlug)) {
    return existing; // Already subscribed
  }

  return await updateUserSubscription(userId, {
    subscribed_artists: [...existing.subscribed_artists, artistSlug],
  });
}

/**
 * Unsubscribe from artist
 */
export async function unsubscribeFromArtist(
  userId: string,
  artistSlug: string
): Promise<RCFSubscription | null> {
  const existing = await getUserSubscription(userId);
  if (!existing) {
    return null;
  }

  return await updateUserSubscription(userId, {
    subscribed_artists: existing.subscribed_artists.filter((slug) => slug !== artistSlug),
  });
}

/**
 * Subscribe to scene
 */
export async function subscribeToScene(
  userId: string,
  sceneSlug: string
): Promise<RCFSubscription | null> {
  const existing = await getUserSubscription(userId);
  if (!existing) {
    return null;
  }

  if (existing.subscribed_scenes.includes(sceneSlug)) {
    return existing; // Already subscribed
  }

  return await updateUserSubscription(userId, {
    subscribed_scenes: [...existing.subscribed_scenes, sceneSlug],
  });
}

/**
 * Unsubscribe from scene
 */
export async function unsubscribeFromScene(
  userId: string,
  sceneSlug: string
): Promise<RCFSubscription | null> {
  const existing = await getUserSubscription(userId);
  if (!existing) {
    return null;
  }

  return await updateUserSubscription(userId, {
    subscribed_scenes: existing.subscribed_scenes.filter((slug) => slug !== sceneSlug),
  });
}

export default {
  DEFAULT_SUBSCRIPTION_TYPES,
  createDefaultSubscription,
  getUserSubscription,
  updateUserSubscription,
  addEventTypes,
  removeEventTypes,
  subscribeToArtist,
  unsubscribeFromArtist,
  subscribeToScene,
  unsubscribeFromScene,
};
