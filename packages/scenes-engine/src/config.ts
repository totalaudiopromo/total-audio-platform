/**
 * Scenes Engine Configuration
 * Performance limits and safety guards
 */

export interface ScenesEngineConfig {
  /**
   * Query limits
   */
  limits: {
    maxScenesPerQuery: number;
    maxMembershipsPerQuery: number;
    maxRelationshipsPerQuery: number;
    maxMicrogenresPerScene: number;
    maxTrendDays: number;
  };

  /**
   * Timeouts (milliseconds)
   */
  timeouts: {
    scenePulseCalculation: number;
    globalPulseCalculation: number;
    trendAggregation: number;
    relationshipCalculation: number;
  };

  /**
   * Cache TTLs (seconds)
   */
  cache: {
    scenePulseTTL: number;
    regionalPulseTTL: number;
    globalPulseTTL: number;
    sceneDetailsTTL: number;
    microgenreHighlightsTTL: number;
    maxCacheSize: number;
  };

  /**
   * Batch processing
   */
  batch: {
    maxBatchSize: number;
    maxConcurrency: number;
  };
}

/**
 * Default configuration (safe production defaults)
 */
export const DEFAULT_CONFIG: ScenesEngineConfig = {
  limits: {
    maxScenesPerQuery: 100,
    maxMembershipsPerQuery: 10000,
    maxRelationshipsPerQuery: 1000,
    maxMicrogenresPerScene: 20,
    maxTrendDays: 365, // 1 year max
  },

  timeouts: {
    scenePulseCalculation: 30000, // 30 seconds
    globalPulseCalculation: 120000, // 2 minutes
    trendAggregation: 15000, // 15 seconds
    relationshipCalculation: 20000, // 20 seconds
  },

  cache: {
    scenePulseTTL: 300, // 5 minutes
    regionalPulseTTL: 600, // 10 minutes
    globalPulseTTL: 600, // 10 minutes
    sceneDetailsTTL: 1800, // 30 minutes
    microgenreHighlightsTTL: 900, // 15 minutes
    maxCacheSize: 1000,
  },

  batch: {
    maxBatchSize: 50,
    maxConcurrency: 10,
  },
};

/**
 * Development configuration (more lenient)
 */
export const DEV_CONFIG: ScenesEngineConfig = {
  ...DEFAULT_CONFIG,
  cache: {
    ...DEFAULT_CONFIG.cache,
    scenePulseTTL: 60, // 1 minute for faster iteration
    regionalPulseTTL: 120, // 2 minutes
    globalPulseTTL: 120, // 2 minutes
  },
};

/**
 * Get configuration based on environment
 */
export function getConfig(): ScenesEngineConfig {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? DEFAULT_CONFIG : DEV_CONFIG;
}
