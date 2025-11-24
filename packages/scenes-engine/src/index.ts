/**
 * Scenes Engine - Main Export
 * Analytics and intelligence layer for music scenes, microgenres, and cultural movements
 */

export * from './types.js';

export { ScenesStore } from './scenesStore.js';
export type { ScenesStoreConfig } from './scenesStore.js';

export { MIGAdapter } from './migAdapter.js';
export type { MIGAdapterConfig } from './migAdapter.js';

export { FusionAdapter } from './fusionAdapter.js';
export type { FusionAdapterConfig, TimeRange } from './fusionAdapter.js';

export { CMGAdapter } from './cmgAdapter.js';
export type { CMGAdapterConfig } from './cmgAdapter.js';

export { MembershipEngine } from './membershipEngine.js';
export type { MembershipEngineConfig } from './membershipEngine.js';

export { TrendsEngine } from './trendsEngine.js';
export type { TrendsEngineConfig } from './trendsEngine.js';

export { RelationshipEngine } from './relationshipEngine.js';
export type { RelationshipEngineConfig } from './relationshipEngine.js';

export { ScenePulse } from './scenePulse.js';
export type { ScenePulseConfig } from './scenePulse.js';

export { RecommendationEngine } from './recommendationEngine.js';
export type { RecommendationEngineConfig } from './recommendationEngine.js';

// Utility exports
export { createLogger, Logger } from './utils/logger.js';
export * from './utils/math.js';
export * from './utils/time.js';
export { Cache, ScenesCacheKeys } from './utils/cache.js';
export type { CacheEntry, CacheConfig } from './utils/cache.js';

// Configuration
export { getConfig, DEFAULT_CONFIG, DEV_CONFIG } from './config.js';
export type { ScenesEngineConfig } from './config.js';
