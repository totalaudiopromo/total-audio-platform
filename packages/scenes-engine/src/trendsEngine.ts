/**
 * Trends Engine
 * Computes and analyzes time-based metrics for scenes and microgenres
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ScenesStore } from './scenesStore.js';
import { FusionAdapter, TimeRange } from './fusionAdapter.js';
import {
  TrendMetric,
  CreateTrendInput,
  SceneTrend,
  TrendAnalysis,
} from './types.js';
import { createLogger } from './utils/logger.js';
import { formatDateString, getBucketsAgo } from './utils/time.js';
import { linearRegression } from './utils/math.js';

const logger = createLogger('TrendsEngine');

export interface TrendsEngineConfig {
  supabase: SupabaseClient;
  scenesStore: ScenesStore;
  fusionAdapter: FusionAdapter;
}

/**
 * Trends Engine - Computes time-based scene metrics
 */
export class TrendsEngine {
  private supabase: SupabaseClient;
  private scenesStore: ScenesStore;
  private fusionAdapter: FusionAdapter;

  constructor(config: TrendsEngineConfig) {
    this.supabase = config.supabase;
    this.scenesStore = config.scenesStore;
    this.fusionAdapter = config.fusionAdapter;
  }

  /**
   * Compute trend for a specific scene and time bucket
   */
  async computeSceneTrend(
    sceneSlug: string,
    timeBucket: Date
  ): Promise<CreateTrendInput[]> {
    try {
      logger.debug(`Computing trends for scene ${sceneSlug} at ${timeBucket}`);

      const trends: CreateTrendInput[] = [];
      const timeBucketStr = formatDateString(timeBucket);

      // Get time range for this bucket (e.g., the day/week/month)
      const timeRange: TimeRange = {
        start: timeBucket,
        end: new Date(timeBucket.getTime() + 24 * 60 * 60 * 1000), // +1 day
      };

      // Get fusion metrics
      const fusionMetrics = await this.fusionAdapter.getSceneCampaignMetrics(
        sceneSlug,
        timeRange
      );

      // Campaign volume trend
      trends.push({
        scene_slug: sceneSlug,
        time_bucket: timeBucketStr,
        metric: 'campaign_volume',
        value: fusionMetrics.campaignVolume,
        metadata: {},
      });

      // Coverage trend
      trends.push({
        scene_slug: sceneSlug,
        time_bucket: timeBucketStr,
        metric: 'coverage',
        value: fusionMetrics.coverageCount,
        metadata: {},
      });

      // Playlist adds trend
      trends.push({
        scene_slug: sceneSlug,
        time_bucket: timeBucketStr,
        metric: 'playlist_adds',
        value: fusionMetrics.playlistAdds,
        metadata: {},
      });

      // New members trend (count new scene_memberships)
      const oneDayAgo = new Date(timeBucket.getTime() - 24 * 60 * 60 * 1000);
      const { count } = await this.supabase
        .from('scene_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('scene_slug', sceneSlug)
        .gte('created_at', oneDayAgo.toISOString())
        .lt('created_at', timeBucket.toISOString());

      trends.push({
        scene_slug: sceneSlug,
        time_bucket: timeBucketStr,
        metric: 'new_members',
        value: count || 0,
        metadata: {},
      });

      logger.info(`Computed ${trends.length} trend data points for ${sceneSlug}`);
      return trends;
    } catch (error) {
      logger.error(`Failed to compute scene trend for ${sceneSlug}:`, error);
      return [];
    }
  }

  /**
   * Compute trends for all scenes at a time bucket
   */
  async computeAllSceneTrends(timeBucket: Date): Promise<SceneTrend[]> {
    try {
      logger.info(`Computing trends for all scenes at ${timeBucket}`);

      const scenes = await this.scenesStore.listScenes();
      const allTrends: CreateTrendInput[] = [];

      for (const scene of scenes) {
        const sceneTrends = await this.computeSceneTrend(scene.slug, timeBucket);
        allTrends.push(...sceneTrends);
      }

      if (allTrends.length > 0) {
        const recorded = await this.scenesStore.batchRecordTrends(allTrends);
        logger.info(`Recorded ${recorded.length} trend data points`);
        return recorded;
      }

      return [];
    } catch (error) {
      logger.error('Failed to compute all scene trends:', error);
      return [];
    }
  }

  /**
   * Get trend history and analysis for a scene
   */
  async getSceneTrendHistory(
    sceneSlug: string,
    metric: TrendMetric,
    daysBack: number = 90
  ): Promise<TrendAnalysis> {
    try {
      const startDate = getBucketsAgo(daysBack, 'day');
      const endDate = new Date();

      const trends = await this.scenesStore.getTrendHistory(
        sceneSlug,
        metric,
        formatDateString(startDate),
        formatDateString(endDate)
      );

      if (trends.length === 0) {
        return this.emptyTrendAnalysis(sceneSlug, metric, startDate, endDate);
      }

      // Extract values
      const values = trends.map(t => ({
        date: t.time_bucket,
        value: Number(t.value),
      }));

      const numericValues = values.map(v => v.value);

      // Calculate summary statistics
      const mean = numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length;
      const sortedValues = [...numericValues].sort((a, b) => a - b);
      const median =
        sortedValues.length % 2 === 0
          ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
          : sortedValues[Math.floor(sortedValues.length / 2)];

      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const total = numericValues.reduce((sum, v) => sum + v, 0);

      // Calculate growth (first vs last)
      const firstValue = numericValues[0];
      const lastValue = numericValues[numericValues.length - 1];
      const growth = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

      // Calculate trend direction using linear regression
      const xValues = Array.from({ length: numericValues.length }, (_, i) => i);
      const regression = linearRegression(xValues, numericValues);

      let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (regression.slope > 0.1) {
        trendDirection = 'increasing';
      } else if (regression.slope < -0.1) {
        trendDirection = 'decreasing';
      }

      return {
        sceneSlug,
        metric,
        period: {
          start: formatDateString(startDate),
          end: formatDateString(endDate),
        },
        values,
        summary: {
          mean,
          median,
          min,
          max,
          total,
          growth,
          trend: trendDirection,
        },
      };
    } catch (error) {
      logger.error(`Failed to get trend history for ${sceneSlug}:`, error);
      const startDate = getBucketsAgo(daysBack, 'day');
      const endDate = new Date();
      return this.emptyTrendAnalysis(sceneSlug, metric, startDate, endDate);
    }
  }

  /**
   * Compare trends across multiple scenes
   */
  async compareSceneTrends(
    sceneSlugs: string[],
    metric: TrendMetric,
    daysBack: number = 30
  ): Promise<Record<string, TrendAnalysis>> {
    try {
      const analyses: Record<string, TrendAnalysis> = {};

      for (const sceneSlug of sceneSlugs) {
        analyses[sceneSlug] = await this.getSceneTrendHistory(
          sceneSlug,
          metric,
          daysBack
        );
      }

      return analyses;
    } catch (error) {
      logger.error('Failed to compare scene trends:', error);
      return {};
    }
  }

  /**
   * Get recent trend snapshot for quick pulse calculation
   */
  async getRecentTrendSnapshot(
    sceneSlug: string,
    daysBack: number = 7
  ): Promise<Record<TrendMetric, number[]>> {
    try {
      const startDate = getBucketsAgo(daysBack, 'day');
      const snapshot: Record<string, number[]> = {};

      const metrics: TrendMetric[] = [
        'campaign_volume',
        'coverage',
        'playlist_adds',
        'new_members',
      ];

      for (const metric of metrics) {
        const trends = await this.scenesStore.getTrendHistory(
          sceneSlug,
          metric,
          formatDateString(startDate)
        );

        snapshot[metric] = trends.map(t => Number(t.value));
      }

      return snapshot as Record<TrendMetric, number[]>;
    } catch (error) {
      logger.error(`Failed to get recent trend snapshot for ${sceneSlug}:`, error);
      return {} as Record<TrendMetric, number[]>;
    }
  }

  /**
   * Helper: Create empty trend analysis
   */
  private emptyTrendAnalysis(
    sceneSlug: string,
    metric: TrendMetric,
    startDate: Date,
    endDate: Date
  ): TrendAnalysis {
    return {
      sceneSlug,
      metric,
      period: {
        start: formatDateString(startDate),
        end: formatDateString(endDate),
      },
      values: [],
      summary: {
        mean: 0,
        median: 0,
        min: 0,
        max: 0,
        total: 0,
        growth: 0,
        trend: 'stable',
      },
    };
  }
}
