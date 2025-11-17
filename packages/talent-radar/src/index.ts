/**
 * Talent Radar - Phase 11: Global Music Pulse + Talent Radar
 * A&R-grade intelligence engine for detecting rising talent and opportunities
 */

// Adapters
export * from './adapters/index.js';

// Engines
export { ArtistSignalsEngine } from './engines/artistSignalsEngine.js';
export type { ArtistSignals } from './engines/artistSignalsEngine.js';

// Radar Pipeline
export { RadarStore } from './radar/radarStore.js';
export type {
  TalentRadarArtist,
  TalentRadarScene,
  TalentRadarRecommendation,
} from './radar/radarStore.js';

export { RadarAggregator } from './radar/radarAggregator.js';
export type {
  GlobalPulse,
  ArtistRadarProfile,
} from './radar/radarAggregator.js';

// Utilities
export * from './utils/logger.js';
export * from './utils/math.js';
export * from './utils/decay.js';
export * from './utils/scoring.js';
