/**
 * Velocity Engine
 * Computes velocity, acceleration, and stability for entities
 */

import type { RCFEvent } from '../types';
import { getLogger } from '../utils/logger';
import { hoursAgo } from '../utils/time';

const logger = getLogger('[VelocityEngine]');

export interface VelocitySnapshot {
  entity_type: string;
  entity_slug: string;
  window: string;
  velocity: number; // events per hour
  acceleration: number; // velocity change rate
  event_count: number;
  created_at: string;
}

export async function calculateVelocity(
  events: RCFEvent[],
  entityType: string,
  entitySlug: string,
  windowHours: number
): Promise<VelocitySnapshot> {
  const windowStart = hoursAgo(windowHours);
  const relevantEvents = events.filter(
    (e) =>
      new Date(e.created_at) >= new Date(windowStart) &&
      (e.artist_slug === entitySlug || e.scene_slug === entitySlug || e.entity_slug === entitySlug)
  );

  const velocity = relevantEvents.length / windowHours;

  return {
    entity_type: entityType,
    entity_slug: entitySlug,
    window: `${windowHours}h`,
    velocity,
    acceleration: 0, // TODO: Calculate from historical data
    event_count: relevantEvents.length,
    created_at: new Date().toISOString(),
  };
}

export default { calculateVelocity };
