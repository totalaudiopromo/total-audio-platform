/**
 * Scene Pulse
 * Computes real-time scene health and vitality metrics
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ScenesStore } from './scenesStore.js';
import { TrendsEngine } from './trendsEngine.js';
import { RelationshipEngine } from './relationshipEngine.js';
import { MembershipEngine } from './membershipEngine.js';
import {
  ScenePulseSnapshot,
  GrowthClassification,
  MicrogenreHighlight,
} from './types.js';
import { createLogger } from './utils/logger.js';
import { momentumScore, growthRate, weightedAverage } from './utils/math.js';
import { Cache, ScenesCacheKeys } from './utils/cache.js';
import { getConfig, ScenesEngineConfig } from './config.js';

const logger = createLogger('ScenePulse');

export interface ScenePulseConfig {
  supabase: SupabaseClient;
  scenesStore: ScenesStore;
  trendsEngine: TrendsEngine;
  relationshipEngine: RelationshipEngine;
  membershipEngine: MembershipEngine;
}

/**
 * Scene Pulse - Real-time scene health metrics
 */
export class ScenePulse {
  private supabase: SupabaseClient;
  private scenesStore: ScenesStore;
  private trendsEngine: TrendsEngine;
  private relationshipEngine: RelationshipEngine;
  private membershipEngine: MembershipEngine;
  private cache: Cache<ScenePulseSnapshot>;
  private config: ScenesEngineConfig;

  constructor(config: ScenePulseConfig) {
    this.supabase = config.supabase;
    this.scenesStore = config.scenesStore;
    this.trendsEngine = config.trendsEngine;
    this.relationshipEngine = config.relationshipEngine;
    this.membershipEngine = config.membershipEngine;
    this.config = getConfig();
    this.cache = new Cache<ScenePulseSnapshot>({
      defaultTTL: this.config.cache.scenePulseTTL,
      maxSize: this.config.cache.maxCacheSize,
    });

    // Clean expired cache entries every 5 minutes
    setInterval(() => {
      this.cache.cleanExpired();
    }, 300000);
  }

  /**
   * Get comprehensive pulse snapshot for a scene
   */
  async getScenePulse(sceneSlug: string, skipCache = false): Promise<ScenePulseSnapshot> {
    try {
      // Check cache first
      if (!skipCache) {
        const cacheKey = ScenesCacheKeys.scenePulse(sceneSlug);
        const cached = this.cache.get(cacheKey);
        if (cached) {
          logger.info(`Using cached pulse for: ${sceneSlug}`);
          return cached;
        }
      }

      logger.info(`Computing scene pulse for: ${sceneSlug}`);

      const scene = await this.scenesStore.getSceneBySlug(sceneSlug);
      if (!scene) {
        throw new Error(`Scene not found: ${sceneSlug}`);
      }

      // Get recent trend data (last 30 days)
      const recentTrends = await this.trendsEngine.getRecentTrendSnapshot(
        sceneSlug,
        30
      );

      // Calculate hotness score (0-100)
      const hotnessScore = await this.calculateHotnessScore(sceneSlug, recentTrends);

      // Calculate growth rate
      const growthRateValue = this.calculateGrowthRate(recentTrends);

      // Classify growth
      const growthClassification = this.classifyGrowth(
        hotnessScore,
        growthRateValue
      );

      // Calculate crossover potential
      const crossoverPotential = await this.calculateCrossoverPotential(sceneSlug);

      // Get microgenre highlights
      const microgenreHighlights = await this.getMicrogenreHighlights(sceneSlug);

      // Calculate momentum
      const momentum = this.calculateMomentum(recentTrends);

      // Get current metrics
      const metrics = await this.getCurrentMetrics(sceneSlug);

      const snapshot: ScenePulseSnapshot = {
        sceneSlug: scene.slug,
        sceneName: scene.name,
        region: scene.region,
        hotnessScore,
        growthRate: growthRateValue,
        growthClassification,
        crossoverPotential,
        microgenreHighlights,
        momentum,
        metrics,
        timestamp: new Date().toISOString(),
      };

      // Cache the result
      const cacheKey = ScenesCacheKeys.scenePulse(sceneSlug);
      this.cache.set(cacheKey, snapshot, this.config.cache.scenePulseTTL);

      return snapshot;
    } catch (error) {
      logger.error(`Failed to compute scene pulse for ${sceneSlug}:`, error);
      throw error;
    }
  }

  /**
   * Calculate hotness score (0-100)
   * Combines multiple signals: activity, growth, engagement
   */
  private async calculateHotnessScore(
    sceneSlug: string,
    recentTrends: Record<string, number[]>
  ): Promise<number> {
    try {
      const scores: number[] = [];
      const weights: number[] = [];

      // Component 1: Campaign volume momentum (weight: 0.3)
      if (recentTrends.campaign_volume?.length > 0) {
        const campaignMomentum = momentumScore(recentTrends.campaign_volume, {
          baselineValue: 10, // Expected baseline campaigns
          growthWeight: 0.4,
          consistencyWeight: 0.3,
        });
        scores.push(campaignMomentum);
        weights.push(0.3);
      }

      // Component 2: Coverage momentum (weight: 0.25)
      if (recentTrends.coverage?.length > 0) {
        const coverageMomentum = momentumScore(recentTrends.coverage, {
          baselineValue: 50,
          growthWeight: 0.4,
          consistencyWeight: 0.3,
        });
        scores.push(coverageMomentum);
        weights.push(0.25);
      }

      // Component 3: New member growth (weight: 0.25)
      if (recentTrends.new_members?.length > 0) {
        const memberMomentum = momentumScore(recentTrends.new_members, {
          baselineValue: 5,
          growthWeight: 0.5,
          consistencyWeight: 0.2,
        });
        scores.push(memberMomentum);
        weights.push(0.25);
      }

      // Component 4: Playlist activity (weight: 0.2)
      if (recentTrends.playlist_adds?.length > 0) {
        const playlistMomentum = momentumScore(recentTrends.playlist_adds, {
          baselineValue: 20,
          growthWeight: 0.3,
          consistencyWeight: 0.4,
        });
        scores.push(playlistMomentum);
        weights.push(0.2);
      }

      // Calculate weighted average
      if (scores.length > 0) {
        return Math.round(weightedAverage(scores, weights));
      }

      return 50; // Default neutral score
    } catch (error) {
      logger.error('Failed to calculate hotness score:', error);
      return 50;
    }
  }

  /**
   * Calculate overall growth rate
   */
  private calculateGrowthRate(recentTrends: Record<string, number[]>): number {
    try {
      const growthRates: number[] = [];

      // Calculate growth for each metric
      Object.entries(recentTrends).forEach(([metric, values]) => {
        if (values.length >= 2) {
          const oldValue = values[0];
          const newValue = values[values.length - 1];
          const growth = growthRate(oldValue, newValue);
          growthRates.push(growth);
        }
      });

      // Average growth rate
      if (growthRates.length > 0) {
        return growthRates.reduce((sum, g) => sum + g, 0) / growthRates.length;
      }

      return 0;
    } catch (error) {
      logger.error('Failed to calculate growth rate:', error);
      return 0;
    }
  }

  /**
   * Classify growth pattern
   */
  private classifyGrowth(
    hotnessScore: number,
    growthRateValue: number
  ): GrowthClassification {
    // Emerging: low base but high growth
    if (hotnessScore < 40 && growthRateValue > 0.3) {
      return 'Emerging';
    }

    // Hot: high score with positive growth
    if (hotnessScore >= 70 && growthRateValue > 0.1) {
      return 'Hot';
    }

    // Stable: high score, low movement
    if (hotnessScore >= 60 && Math.abs(growthRateValue) < 0.1) {
      return 'Stable';
    }

    // Cooling: high score but negative growth
    if (hotnessScore >= 50 && growthRateValue < -0.2) {
      return 'Cooling';
    }

    // Dormant: low activity
    if (hotnessScore < 30) {
      return 'Dormant';
    }

    // Niche: moderate but steady
    return 'Niche';
  }

  /**
   * Calculate crossover potential
   * Measures how well this scene connects to others
   */
  private async calculateCrossoverPotential(sceneSlug: string): Promise<number> {
    try {
      const relationships = await this.relationshipEngine.getSceneRelationships(
        sceneSlug
      );

      if (relationships.length === 0) {
        return 0;
      }

      // Count strong crossover relationships
      const strongCrossovers = relationships.filter(
        r => r.relation_type === 'crossover' && r.weight > 0.5
      );

      // Calculate average relationship weight
      const avgWeight =
        relationships.reduce((sum, r) => sum + r.weight, 0) / relationships.length;

      // Combine number of relationships and their strength
      const potential =
        (Math.min(relationships.length / 10, 1) * 0.5 + avgWeight * 0.5) * 100;

      return Math.round(potential);
    } catch (error) {
      logger.error('Failed to calculate crossover potential:', error);
      return 0;
    }
  }

  /**
   * Get microgenre highlights for the scene
   */
  private async getMicrogenreHighlights(
    sceneSlug: string
  ): Promise<MicrogenreHighlight[]> {
    try {
      const scene = await this.scenesStore.getSceneBySlug(sceneSlug);
      if (!scene || scene.microgenres.length === 0) {
        return [];
      }

      const highlights: MicrogenreHighlight[] = [];

      for (const microgenreSlug of scene.microgenres.slice(0, 5)) {
        // Top 5
        const microgenre = await this.scenesStore.getMicrogenreBySlug(microgenreSlug);
        if (microgenre) {
          // Get membership count for this microgenre
          const memberships = await this.scenesStore.getSceneMemberships({
            microgenreSlug,
            limit: 1000,
          });

          // Simple trend detection (would be more sophisticated in production)
          const trendDirection: 'up' | 'down' | 'stable' =
            memberships.length > 10 ? 'up' : 'stable';

          highlights.push({
            slug: microgenre.slug,
            name: microgenre.name,
            score: Math.min(100, memberships.length * 2), // Simple score
            trendDirection,
          });
        }
      }

      return highlights.sort((a, b) => b.score - a.score);
    } catch (error) {
      logger.error('Failed to get microgenre highlights:', error);
      return [];
    }
  }

  /**
   * Calculate momentum (short-term vs long-term)
   */
  private calculateMomentum(recentTrends: Record<string, number[]>): {
    shortTerm: number;
    longTerm: number;
    trend: 'rising' | 'stable' | 'falling';
  } {
    try {
      // Use campaign volume as primary momentum indicator
      const campaignValues = recentTrends.campaign_volume || [];

      if (campaignValues.length < 7) {
        return {
          shortTerm: 50,
          longTerm: 50,
          trend: 'stable',
        };
      }

      // Short-term: last 7 days
      const shortTermValues = campaignValues.slice(-7);
      const shortTerm = momentumScore(shortTermValues, {
        baselineValue: 10,
        growthWeight: 0.6,
      });

      // Long-term: all available data
      const longTerm = momentumScore(campaignValues, {
        baselineValue: 10,
        growthWeight: 0.4,
      });

      // Determine trend
      let trend: 'rising' | 'stable' | 'falling' = 'stable';
      const difference = shortTerm - longTerm;

      if (difference > 10) {
        trend = 'rising';
      } else if (difference < -10) {
        trend = 'falling';
      }

      return {
        shortTerm,
        longTerm,
        trend,
      };
    } catch (error) {
      logger.error('Failed to calculate momentum:', error);
      return {
        shortTerm: 50,
        longTerm: 50,
        trend: 'stable',
      };
    }
  }

  /**
   * Get current metrics snapshot
   */
  private async getCurrentMetrics(sceneSlug: string): Promise<{
    totalMembers: number;
    activeCampaigns: number;
    recentCoverage: number;
    communityEngagement: number;
  }> {
    try {
      // Total members
      const memberships = await this.scenesStore.getSceneMemberships({
        sceneSlug,
        limit: 10000,
      });
      const totalMembers = memberships.length;

      // Get recent trend data for other metrics
      const recentTrends = await this.trendsEngine.getRecentTrendSnapshot(
        sceneSlug,
        7
      );

      const activeCampaigns =
        recentTrends.campaign_volume?.slice(-1)[0] || 0;
      const recentCoverage =
        recentTrends.coverage?.slice(-7).reduce((sum, v) => sum + v, 0) || 0;

      // Community engagement (placeholder - would integrate with actual community data)
      const communityEngagement = Math.round(totalMembers * 0.1);

      return {
        totalMembers,
        activeCampaigns,
        recentCoverage,
        communityEngagement,
      };
    } catch (error) {
      logger.error('Failed to get current metrics:', error);
      return {
        totalMembers: 0,
        activeCampaigns: 0,
        recentCoverage: 0,
        communityEngagement: 0,
      };
    }
  }

  /**
   * Get regional scene pulse overview
   */
  async getRegionScenePulse(region: string, limit?: number): Promise<ScenePulseSnapshot[]> {
    try {
      logger.info(`Computing regional pulse for: ${region}`);

      const scenes = await this.scenesStore.listScenes({ region });
      const limitedScenes = scenes.slice(0, limit || this.config.limits.maxScenesPerQuery);

      // Process in parallel batches to avoid overwhelming the system
      const pulses = await this.batchProcessScenes(limitedScenes.map(s => s.slug));

      // Sort by hotness score
      return pulses.sort((a, b) => b.hotnessScore - a.hotnessScore);
    } catch (error) {
      logger.error(`Failed to get regional pulse for ${region}:`, error);
      return [];
    }
  }

  /**
   * Get global scene pulse overview
   */
  async getGlobalScenePulse(limit?: number): Promise<ScenePulseSnapshot[]> {
    try {
      logger.info('Computing global scene pulse');

      const effectiveLimit = Math.min(
        limit || 20,
        this.config.limits.maxScenesPerQuery
      );

      const scenes = await this.scenesStore.listScenes();
      const limitedScenes = scenes.slice(0, effectiveLimit);

      // Process in parallel batches
      const pulses = await this.batchProcessScenes(limitedScenes.map(s => s.slug));

      // Sort by hotness score
      return pulses.sort((a, b) => b.hotnessScore - a.hotnessScore);
    } catch (error) {
      logger.error('Failed to get global pulse:', error);
      return [];
    }
  }

  /**
   * Batch process multiple scenes in parallel with concurrency control
   */
  private async batchProcessScenes(sceneSlugs: string[]): Promise<ScenePulseSnapshot[]> {
    const results: ScenePulseSnapshot[] = [];
    const batchSize = this.config.batch.maxConcurrency;

    // Process in batches to control concurrency
    for (let i = 0; i < sceneSlugs.length; i += batchSize) {
      const batch = sceneSlugs.slice(i, i + batchSize);
      const batchPromises = batch.map(slug =>
        this.getScenePulse(slug).catch(error => {
          logger.error(`Failed to get pulse for ${slug}:`, error);
          return null;
        })
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(r => r !== null) as ScenePulseSnapshot[]);
    }

    return results;
  }

  /**
   * Clear cache for a specific scene or all scenes
   */
  clearCache(sceneSlug?: string): void {
    if (sceneSlug) {
      const cacheKey = ScenesCacheKeys.scenePulse(sceneSlug);
      this.cache.clear(cacheKey);
      logger.info(`Cleared cache for scene: ${sceneSlug}`);
    } else {
      this.cache.clear();
      logger.info('Cleared all scene pulse cache');
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number } {
    return this.cache.stats();
  }
}
