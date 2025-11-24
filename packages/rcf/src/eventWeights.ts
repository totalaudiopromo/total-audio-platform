/**
 * Event Weights
 *
 * Assigns importance scores to events based on:
 * - Event type
 * - Entity properties (tier, influence, reach)
 * - Scene alignment
 * - Timing factors
 */

import type {
  RCFNormalizedEvent,
  RCFEventType,
  EventWeightConfig,
  EventWeightConfigMap,
} from './types';
import { getLogger } from './utils/logger';

const logger = getLogger('[EventWeights]');

/**
 * Default weight configuration for each event type
 */
const DEFAULT_WEIGHTS: EventWeightConfigMap = {
  // High-value coverage events
  playlist_add: {
    base_weight: 0.6,
    multipliers: {
      tier1: 1.5, // Major playlists (e.g., Today's Top Hits)
      tier2: 1.2, // Mid-tier playlists
      tier3: 1.0, // Indie playlists
      high_influence: 1.3, // High curator influence
    },
    caps: { min: 0.3, max: 1.0 },
  },

  press_feature: {
    base_weight: 0.7,
    multipliers: {
      tier1: 1.5, // Major publications (NME, Guardian, etc.)
      tier2: 1.3, // Mid-tier (DIY, Clash, etc.)
      tier3: 1.1, // Indie blogs
      blog: 0.9,
    },
    caps: { min: 0.4, max: 1.0 },
  },

  radio_spin: {
    base_weight: 0.75,
    multipliers: {
      bbc: 1.5, // BBC Radio 1/6/etc.
      commercial: 1.2,
      community: 0.9,
      student: 0.7,
      online: 0.6,
      first_play: 1.3,
    },
    caps: { min: 0.4, max: 1.0 },
  },

  blog_post: {
    base_weight: 0.5,
    caps: { min: 0.3, max: 0.8 },
  },

  tweet: {
    base_weight: 0.3,
    caps: { min: 0.1, max: 0.6 },
  },

  journalist_activity: {
    base_weight: 0.4,
    caps: { min: 0.2, max: 0.7 },
  },

  // Scene & network events
  scene_pulse_change: {
    base_weight: 0.5,
    multipliers: {
      large_delta: 1.4, // Delta > 10
      medium_delta: 1.2, // Delta 5-10
      small_delta: 1.0, // Delta < 5
    },
    caps: { min: 0.3, max: 0.9 },
  },

  scene_trend_spike: {
    base_weight: 0.6,
    caps: { min: 0.4, max: 0.9 },
  },

  mig_connection: {
    base_weight: 0.5,
    multipliers: {
      high_confidence: 1.3, // Confidence > 0.8
      medium_confidence: 1.1, // Confidence 0.5-0.8
      low_confidence: 0.9, // Confidence < 0.5
    },
    caps: { min: 0.3, max: 0.8 },
  },

  // Campaign & platform events
  campaign_event: {
    base_weight: 0.4,
    multipliers: {
      milestone: 1.3,
      stage_complete: 1.2,
      success: 1.1,
      failed: 0.7,
    },
    caps: { min: 0.2, max: 0.8 },
  },

  autopilot_event: {
    base_weight: 0.45,
    caps: { min: 0.2, max: 0.8 },
  },

  tracker_event: {
    base_weight: 0.35,
    caps: { min: 0.2, max: 0.7 },
  },

  // High-value signals
  coverage_spike: {
    base_weight: 0.75,
    multipliers: {
      massive: 1.5, // >100% increase
      large: 1.3, // 50-100% increase
      moderate: 1.1, // 25-50% increase
    },
    caps: { min: 0.5, max: 1.0 },
  },

  creative_breakthrough: {
    base_weight: 0.8,
    multipliers: {
      high_score: 1.4, // CMG score > 0.8
      medium_score: 1.2, // CMG score 0.5-0.8
      low_score: 1.0, // CMG score < 0.5
    },
    caps: { min: 0.6, max: 1.0 },
  },

  // Community & external
  community_activity: {
    base_weight: 0.35,
    caps: { min: 0.2, max: 0.7 },
  },

  youtube_signal: {
    base_weight: 0.4,
    caps: { min: 0.2, max: 0.8 },
  },

  soundcloud_signal: {
    base_weight: 0.35,
    caps: { min: 0.2, max: 0.7 },
  },

  bandcamp_signal: {
    base_weight: 0.4,
    caps: { min: 0.2, max: 0.8 },
  },

  tiktok_signal: {
    base_weight: 0.45,
    caps: { min: 0.2, max: 0.9 },
  },

  instagram_signal: {
    base_weight: 0.3,
    caps: { min: 0.2, max: 0.6 },
  },
};

/**
 * Calculate weight for a single event
 */
export function calculateEventWeight(event: RCFNormalizedEvent): number {
  const config = DEFAULT_WEIGHTS[event.event_type];

  if (!config) {
    logger.warn(`No weight config for event type: ${event.event_type}`);
    return 0.5; // Default fallback
  }

  let weight = config.base_weight;

  // Apply type-specific multipliers
  weight = applyMultipliers(event, weight, config);

  // Apply caps
  if (config.caps) {
    if (config.caps.min !== undefined) {
      weight = Math.max(weight, config.caps.min);
    }
    if (config.caps.max !== undefined) {
      weight = Math.min(weight, config.caps.max);
    }
  }

  return Math.round(weight * 100) / 100; // Round to 2 decimals
}

/**
 * Apply type-specific multipliers
 */
function applyMultipliers(
  event: RCFNormalizedEvent,
  baseWeight: number,
  config: EventWeightConfig
): number {
  let weight = baseWeight;

  if (!config.multipliers) {
    return weight;
  }

  const metadata = event.metadata;

  switch (event.event_type) {
    case 'playlist_add':
      weight = applyPlaylistMultipliers(metadata, weight, config);
      break;
    case 'press_feature':
      weight = applyPressMultipliers(metadata, weight, config);
      break;
    case 'radio_spin':
      weight = applyRadioMultipliers(metadata, weight, config);
      break;
    case 'scene_pulse_change':
      weight = applyScenePulseMultipliers(metadata, weight, config);
      break;
    case 'coverage_spike':
      weight = applyCoverageSpikeMultipliers(metadata, weight, config);
      break;
    case 'creative_breakthrough':
      weight = applyCreativeBreakthroughMultipliers(metadata, weight, config);
      break;
    case 'mig_connection':
      weight = applyMIGMultipliers(metadata, weight, config);
      break;
    case 'campaign_event':
      weight = applyCampaignMultipliers(metadata, weight, config);
      break;
  }

  return weight;
}

/**
 * Apply playlist-specific multipliers
 */
function applyPlaylistMultipliers(
  metadata: Record<string, unknown>,
  weight: number,
  config: EventWeightConfig
): number {
  // Check follower count for tier detection
  const followers = metadata.followerCount as number | undefined;
  if (followers) {
    if (followers > 1000000) {
      weight *= config.multipliers?.tier1 || 1.0;
    } else if (followers > 100000) {
      weight *= config.multipliers?.tier2 || 1.0;
    } else {
      weight *= config.multipliers?.tier3 || 1.0;
    }
  }

  // Check curator influence
  const influence = metadata.curatorInfluence as number | undefined;
  if (influence && influence > 0.7) {
    weight *= config.multipliers?.high_influence || 1.0;
  }

  return weight;
}

/**
 * Apply press-specific multipliers
 */
function applyPressMultipliers(
  metadata: Record<string, unknown>,
  weight: number,
  config: EventWeightConfig
): number {
  const tier = metadata.publicationTier as string | undefined;
  const multiplier = tier && config.multipliers?.[tier];
  if (multiplier) {
    weight *= multiplier;
  }
  return weight;
}

/**
 * Apply radio-specific multipliers
 */
function applyRadioMultipliers(
  metadata: Record<string, unknown>,
  weight: number,
  config: EventWeightConfig
): number {
  const stationType = metadata.stationType as string | undefined;
  const typeMultiplier = stationType && config.multipliers?.[stationType];
  if (typeMultiplier) {
    weight *= typeMultiplier;
  }

  // Bonus for first play
  if (metadata.firstPlay) {
    weight *= config.multipliers?.first_play || 1.0;
  }

  return weight;
}

/**
 * Apply scene pulse multipliers
 */
function applyScenePulseMultipliers(
  metadata: Record<string, unknown>,
  weight: number,
  config: EventWeightConfig
): number {
  const delta = Math.abs((metadata.delta as number) || 0);

  if (delta > 10) {
    weight *= config.multipliers?.large_delta || 1.0;
  } else if (delta > 5) {
    weight *= config.multipliers?.medium_delta || 1.0;
  } else {
    weight *= config.multipliers?.small_delta || 1.0;
  }

  return weight;
}

/**
 * Apply coverage spike multipliers
 */
function applyCoverageSpikeMultipliers(
  metadata: Record<string, unknown>,
  weight: number,
  config: EventWeightConfig
): number {
  const percentIncrease = (metadata.percentIncrease as number) || 0;

  if (percentIncrease > 100) {
    weight *= config.multipliers?.massive || 1.0;
  } else if (percentIncrease > 50) {
    weight *= config.multipliers?.large || 1.0;
  } else if (percentIncrease > 25) {
    weight *= config.multipliers?.moderate || 1.0;
  }

  return weight;
}

/**
 * Apply creative breakthrough multipliers
 */
function applyCreativeBreakthroughMultipliers(
  metadata: Record<string, unknown>,
  weight: number,
  config: EventWeightConfig
): number {
  const cmgScore = (metadata.cmgScore as number) || 0;

  if (cmgScore > 0.8) {
    weight *= config.multipliers?.high_score || 1.0;
  } else if (cmgScore > 0.5) {
    weight *= config.multipliers?.medium_score || 1.0;
  } else {
    weight *= config.multipliers?.low_score || 1.0;
  }

  return weight;
}

/**
 * Apply MIG connection multipliers
 */
function applyMIGMultipliers(
  metadata: Record<string, unknown>,
  weight: number,
  config: EventWeightConfig
): number {
  const confidence = (metadata.confidence as number) || 0;

  if (confidence > 0.8) {
    weight *= config.multipliers?.high_confidence || 1.0;
  } else if (confidence > 0.5) {
    weight *= config.multipliers?.medium_confidence || 1.0;
  } else {
    weight *= config.multipliers?.low_confidence || 1.0;
  }

  return weight;
}

/**
 * Apply campaign event multipliers
 */
function applyCampaignMultipliers(
  metadata: Record<string, unknown>,
  weight: number,
  config: EventWeightConfig
): number {
  const result = metadata.result as string | undefined;
  const action = metadata.action as string | undefined;

  if (action === 'milestone' || result === 'milestone') {
    weight *= config.multipliers?.milestone || 1.0;
  } else if (action === 'stage_complete' || result === 'stage_complete') {
    weight *= config.multipliers?.stage_complete || 1.0;
  } else if (result === 'success') {
    weight *= config.multipliers?.success || 1.0;
  } else if (result === 'failed') {
    weight *= config.multipliers?.failed || 1.0;
  }

  return weight;
}

/**
 * Apply weights to multiple events
 */
export function applyWeights(events: RCFNormalizedEvent[]): RCFNormalizedEvent[] {
  logger.debug(`Applying weights to ${events.length} events...`);

  return events.map((event) => ({
    ...event,
    weight: calculateEventWeight(event),
  }));
}

export default {
  calculateEventWeight,
  applyWeights,
  DEFAULT_WEIGHTS,
};
