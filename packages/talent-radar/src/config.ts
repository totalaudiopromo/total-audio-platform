/**
 * Talent Radar Configuration
 * Performance limits and safety guards
 */

export interface TalentRadarConfig {
  /**
   * Query limits
   */
  limits: {
    maxArtistsPerQuery: number;
    maxScenesPerQuery: number;
    maxSignalAggregationBatch: number;
    maxRecommendationsPerWorkspace: number;
  };

  /**
   * Timeouts (milliseconds)
   */
  timeouts: {
    signalAggregation: number;
    globalPulseCalculation: number;
    artistProfileGeneration: number;
    batchProcessing: number;
  };

  /**
   * Cache TTLs (seconds)
   */
  cache: {
    globalPulseTTL: number;
    artistProfileTTL: number;
    sceneSignalsTTL: number;
    recommendationsTTL: number;
    maxCacheSize: number;
  };

  /**
   * Batch processing
   */
  batch: {
    maxBatchSize: number;
    maxConcurrency: number;
  };

  /**
   * Signal thresholds
   */
  thresholds: {
    highMomentum: number; // 0-100
    highBreakout: number; // 0-1
    highRisk: number; // 0-1
    minDataConfidence: number; // 0-1
  };
}

/**
 * Default configuration (safe production defaults)
 */
export const DEFAULT_CONFIG: TalentRadarConfig = {
  limits: {
    maxArtistsPerQuery: 100,
    maxScenesPerQuery: 50,
    maxSignalAggregationBatch: 20,
    maxRecommendationsPerWorkspace: 1000,
  },

  timeouts: {
    signalAggregation: 30000, // 30 seconds per artist
    globalPulseCalculation: 120000, // 2 minutes
    artistProfileGeneration: 45000, // 45 seconds
    batchProcessing: 300000, // 5 minutes for batch jobs
  },

  cache: {
    globalPulseTTL: 600, // 10 minutes
    artistProfileTTL: 300, // 5 minutes
    sceneSignalsTTL: 900, // 15 minutes
    recommendationsTTL: 1800, // 30 minutes
    maxCacheSize: 500,
  },

  batch: {
    maxBatchSize: 50,
    maxConcurrency: 10,
  },

  thresholds: {
    highMomentum: 70,
    highBreakout: 0.7,
    highRisk: 0.7,
    minDataConfidence: 0.3,
  },
};

/**
 * Development configuration (more lenient, faster iteration)
 */
export const DEV_CONFIG: TalentRadarConfig = {
  ...DEFAULT_CONFIG,
  cache: {
    ...DEFAULT_CONFIG.cache,
    globalPulseTTL: 120, // 2 minutes
    artistProfileTTL: 60, // 1 minute
    sceneSignalsTTL: 180, // 3 minutes
  },
  limits: {
    ...DEFAULT_CONFIG.limits,
    maxArtistsPerQuery: 20, // Smaller for dev
  },
};

/**
 * Get configuration based on environment
 */
export function getConfig(): TalentRadarConfig {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? DEFAULT_CONFIG : DEV_CONFIG;
}
