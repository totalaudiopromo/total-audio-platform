/**
 * A&R Radar - Main Export
 *
 * Talent discovery and breakout probability system for PR agencies,
 * labels, managers, and advanced artists.
 */

// Export all types
export * from './types.js';

// Export store functions
export * from './anrStore.js';

// Export scoring engine
export * from './scoringEngine.js';

// Export momentum engine
export * from './momentumEngine.js';

// Export shortlist engine
export * from './shortlistEngine.js';

// Export insight engine
export * from './insightEngine.js';

// Export event ingestion
export * from './eventIngestion.js';

// Export context adapters
export * as fusionAdapter from './contextAdapters/fusionAdapter.js';
export * as migAdapter from './contextAdapters/migAdapter.js';
export * as scenesAdapter from './contextAdapters/scenesAdapter.js';
export * as cmgAdapter from './contextAdapters/cmgAdapter.js';

// Export utilities
export * as mathUtils from './utils/math.js';
export * as dateUtils from './utils/dates.js';
export { logger, Logger } from './utils/logger.js';

// Phase 2: Roster management
export * from './roster/rosterEngine.js';
export * from './roster/rosterStore.js';

// Phase 2: Deal flow
export * from './deals/dealEngine.js';
export * from './deals/dealStore.js';

// Phase 2: Watchlists
export * from './watchlists/watchlistEngine.js';
export * from './watchlists/watchlistStore.js';

// Phase 2: Showcases
export * from './showcases/showcaseEngine.js';
export * from './showcases/showcaseStore.js';
export * from './showcases/showcaseExporter.js';

// Phase 2: Collaborations
export * from './collabs/collabEngine.js';
