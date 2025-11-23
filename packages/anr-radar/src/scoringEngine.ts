/**
 * A&R Scoring Engine
 *
 * Core scoring logic for A&R Radar system.
 * Computes heuristic scores across multiple dimensions.
 *
 * Scoring Model v1.0:
 * - Breakout Score: Coverage growth + scene pulse + MIG connectivity
 * - Momentum Score: Velocity of composite score changes
 * - Scene Alignment Score: Fit between artist sound and booming scenes
 * - Creative Uniqueness Score: Distance from genre/scene norms
 * - Campaign Efficiency Score: Outcome vs input ratio
 * - Engagement Quality Score: Quality metrics (reply rate, etc.)
 * - Risk Score: Volatility, overexposure, diversity
 * - Composite Score: Weighted sum adjusted for risk
 */

import type {
  ANRScoreSnapshot,
  ANRContext,
  ScoringConfig,
  ScoreDimensions,
  DEFAULT_SCORING_CONFIG,
} from './types.js';
import { getFusionContext } from './contextAdapters/fusionAdapter.js';
import { getMIGNeighborhood } from './contextAdapters/migAdapter.js';
import { getSceneContext } from './contextAdapters/scenesAdapter.js';
import { getCMGSummary } from './contextAdapters/cmgAdapter.js';
import { listEvents, getCandidateBySlug, saveScoreSnapshot } from './anrStore.js';
import { normalize, clamp, weightedAverage, safeDivide, round } from './utils/math.js';
import { logger } from './utils/logger.js';
import { today, lastNDays } from './utils/dates.js';

/**
 * Build ANR context for scoring
 */
export async function buildANRContext(artistSlug: string): Promise<ANRContext> {
  const timeframe = lastNDays(90); // Last 90 days by default

  logger.debug('Building ANR context', { artistSlug, timeframe });

  // Fetch all context data in parallel
  const [fusionContext, migNeighbors, sceneContext, cmgSummary] = await Promise.all([
    getFusionContext(artistSlug),
    getMIGNeighborhood(artistSlug),
    getSceneContext(artistSlug),
    getCMGSummary(artistSlug),
  ]);

  // Get campaign history from Fusion
  const campaignHistory = fusionContext
    ? {
        artist_slug: artistSlug,
        campaigns: fusionContext.campaigns || [],
        total_campaigns: fusionContext.campaigns?.length || 0,
        success_rate: 0.5, // TODO: Calculate from campaign outcomes
        avg_coverage: 0,
      }
    : undefined;

  // Build community signals (stub for now)
  const communitySignals = {
    artist_slug: artistSlug,
    fan_engagement: 0.5,
    social_mentions: 0,
    community_growth_rate: 0,
    sentiment: 'neutral' as const,
  };

  const context: ANRContext = {
    fusionContext: fusionContext || undefined,
    cmgSummary: cmgSummary || undefined,
    migNeighbors: migNeighbors || undefined,
    sceneContext: sceneContext || undefined,
    campaignHistory,
    communitySignals,
    timeframe: {
      start_date: timeframe.start_date,
      end_date: timeframe.end_date,
      days: 90,
    },
  };

  return context;
}

/**
 * Compute breakout score
 *
 * Formula: 0.4 * coverage_growth + 0.3 * scene_pulse + 0.3 * mig_connectivity
 */
export function computeBreakoutScore(context: ANRContext): number {
  // Coverage growth (from Fusion + MIG)
  const coverageGrowth = (() => {
    const contactCount = context.fusionContext?.contacts_coverage?.total_contacts || 0;
    const playlistCount = context.migNeighbors?.playlists?.length || 0;
    const blogCount = context.migNeighbors?.blogs?.length || 0;

    const totalCoverage = contactCount + playlistCount + blogCount;
    return normalize(totalCoverage, 0, 100); // Normalize to 0-1
  })();

  // Scene pulse (from Scenes Engine)
  const scenePulse = (() => {
    const scenes = context.sceneContext?.scenes || [];
    if (scenes.length === 0) return 0.5;

    const avgPulse = scenes.reduce((sum, s) => sum + (s.pulse || 0.5), 0) / scenes.length;
    return clamp(avgPulse, 0, 1);
  })();

  // MIG connectivity
  const migConnectivity = context.migNeighbors?.connectivity_score || 0.5;

  // Weighted combination
  const breakoutScore = weightedAverage(
    [coverageGrowth, scenePulse, migConnectivity],
    [0.4, 0.3, 0.3]
  );

  return round(clamp(breakoutScore, 0, 1));
}

/**
 * Compute momentum score
 * Note: This is a simple version. Use momentumEngine for full analysis.
 */
export function computeMomentumScore(context: ANRContext): number {
  // For initial score, use scene trend as proxy
  const scenes = context.sceneContext?.scenes || [];

  if (scenes.length === 0) return 0.5;

  const risingScenes = scenes.filter(s => s.trend === 'rising').length;
  const totalScenes = scenes.length;

  const momentumScore = safeDivide(risingScenes, totalScenes);

  return round(clamp(momentumScore, 0, 1));
}

/**
 * Compute scene alignment score
 */
export function computeSceneAlignmentScore(context: ANRContext): number {
  const sceneFitScore = context.sceneContext?.scene_fit_score || 0.5;
  const opportunityScore = context.sceneContext?.opportunity_score || 0.5;

  const alignmentScore = weightedAverage([sceneFitScore, opportunityScore], [0.6, 0.4]);

  return round(clamp(alignmentScore, 0, 1));
}

/**
 * Compute creative uniqueness score
 */
export function computeCreativeUniquenessScore(context: ANRContext): number {
  const uniquenessSignals = context.cmgSummary?.uniqueness_signals;

  if (!uniquenessSignals) return 0.5;

  const genreDistance = uniquenessSignals.genre_distance || 0.5;
  const sceneDistance = uniquenessSignals.scene_distance || 0.5;
  const innovationScore = uniquenessSignals.innovation_score || 0.5;

  const uniquenessScore = weightedAverage(
    [genreDistance, sceneDistance, innovationScore],
    [0.3, 0.3, 0.4]
  );

  return round(clamp(uniquenessScore, 0, 1));
}

/**
 * Compute campaign efficiency score
 */
export function computeCampaignEfficiencyScore(context: ANRContext): number {
  const engagement = context.fusionContext?.engagement_metrics;
  const campaignHistory = context.campaignHistory;

  if (!engagement || !campaignHistory) return 0.5;

  // Efficiency = success rate + engagement quality
  const successRate = campaignHistory.success_rate || 0.5;
  const replyRate = engagement.reply_rate || 0;

  // Normalize reply rate (assume 10% is excellent)
  const normalizedReplyRate = Math.min(replyRate / 0.1, 1);

  const efficiencyScore = weightedAverage([successRate, normalizedReplyRate], [0.6, 0.4]);

  return round(clamp(efficiencyScore, 0, 1));
}

/**
 * Compute engagement quality score
 */
export function computeEngagementQualityScore(context: ANRContext): number {
  const engagement = context.fusionContext?.engagement_metrics;

  if (!engagement) return 0.5;

  const openRate = engagement.open_rate || 0;
  const replyRate = engagement.reply_rate || 0;

  // Normalize rates (20% open, 5% reply is good)
  const normalizedOpenRate = Math.min(openRate / 0.2, 1);
  const normalizedReplyRate = Math.min(replyRate / 0.05, 1);

  const qualityScore = weightedAverage(
    [normalizedOpenRate, normalizedReplyRate],
    [0.3, 0.7] // Reply rate more important
  );

  return round(clamp(qualityScore, 0, 1));
}

/**
 * Compute risk score
 *
 * Risk factors:
 * - Low scene diversity
 * - Low MIG connectivity
 * - Inconsistent creative output
 */
export function computeRiskScore(context: ANRContext): number {
  const riskFactors: number[] = [];

  // Low scene diversity risk
  const sceneCount = context.sceneContext?.scenes?.length || 0;
  const sceneDiversityRisk = sceneCount < 2 ? 0.7 : 0.3;
  riskFactors.push(sceneDiversityRisk);

  // Low connectivity risk
  const connectivity = context.migNeighbors?.connectivity_score || 0;
  const connectivityRisk = 1 - connectivity;
  riskFactors.push(connectivityRisk);

  // Creative inconsistency risk
  const consistency = context.cmgSummary?.consistency_score || 0.7;
  const consistencyRisk = 1 - consistency;
  riskFactors.push(consistencyRisk);

  // Average risk
  const riskScore = riskFactors.reduce((sum, r) => sum + r, 0) / riskFactors.length;

  return round(clamp(riskScore, 0, 1));
}

/**
 * Compute composite score
 *
 * Weighted sum of dimension scores, adjusted for risk:
 * composite = weighted_sum * (1 - risk_penalty * risk_score)
 */
export function computeCompositeScore(
  dimensions: ScoreDimensions,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): number {
  const { weights, risk_penalty } = config;

  const dimensionValues = [
    dimensions.breakout,
    dimensions.momentum,
    dimensions.creative_uniqueness,
    dimensions.scene_alignment,
    dimensions.engagement_quality,
    dimensions.campaign_efficiency,
  ];

  const dimensionWeights = [
    weights.breakout,
    weights.momentum,
    weights.creative_uniqueness,
    weights.scene_alignment,
    weights.engagement_quality,
    weights.campaign_efficiency,
  ];

  const baseScore = weightedAverage(dimensionValues, dimensionWeights);

  // Apply risk penalty
  const riskAdjustment = 1 - risk_penalty * dimensions.risk;
  const compositeScore = baseScore * riskAdjustment;

  return round(clamp(compositeScore, 0, 1));
}

/**
 * Compute all scores for an artist
 */
export async function computeScoresForArtist(
  artistSlug: string,
  asOfDate?: string,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): Promise<ANRScoreSnapshot | null> {
  try {
    logger.info('Computing scores for artist', { artistSlug, asOfDate });

    // Get candidate
    const candidate = await getCandidateBySlug(artistSlug);
    if (!candidate) {
      logger.warn('Candidate not found, cannot compute scores', { artistSlug });
      return null;
    }

    // Build context
    const context = await buildANRContext(artistSlug);

    // Compute dimension scores
    const dimensions: ScoreDimensions = {
      breakout: computeBreakoutScore(context),
      momentum: computeMomentumScore(context),
      scene_alignment: computeSceneAlignmentScore(context),
      creative_uniqueness: computeCreativeUniquenessScore(context),
      campaign_efficiency: computeCampaignEfficiencyScore(context),
      engagement_quality: computeEngagementQualityScore(context),
      risk: computeRiskScore(context),
    };

    // Compute composite score
    const composite_score = computeCompositeScore(dimensions, config);

    // Create score snapshot
    const snapshot: Omit<ANRScoreSnapshot, 'id' | 'created_at'> = {
      candidate_id: candidate.id,
      snapshot_date: asOfDate || today(),
      breakout_score: dimensions.breakout,
      momentum_score: dimensions.momentum,
      scene_alignment_score: dimensions.scene_alignment,
      creative_uniqueness_score: dimensions.creative_uniqueness,
      campaign_efficiency_score: dimensions.campaign_efficiency,
      engagement_quality_score: dimensions.engagement_quality,
      risk_score: dimensions.risk,
      composite_score,
      metadata: {
        model_version: config.model_version,
        weights: config.weights,
        explanation: generateScoreExplanation(dimensions, composite_score),
        components: {
          context_available: {
            fusion: !!context.fusionContext,
            mig: !!context.migNeighbors,
            scenes: !!context.sceneContext,
            cmg: !!context.cmgSummary,
          },
        },
      },
    };

    // Save snapshot
    const savedSnapshot = await saveScoreSnapshot(candidate.id, snapshot);

    logger.info('Scores computed successfully', {
      artistSlug,
      composite_score,
      breakout_score: dimensions.breakout,
    });

    return savedSnapshot;
  } catch (error) {
    logger.error('Failed to compute scores', error, { artistSlug });
    return null;
  }
}

/**
 * Generate human-readable explanation of scores
 */
function generateScoreExplanation(dimensions: ScoreDimensions, composite: number): string {
  const parts: string[] = [];

  // Composite assessment
  if (composite >= 0.75) {
    parts.push('High breakout potential.');
  } else if (composite >= 0.5) {
    parts.push('Moderate breakout potential.');
  } else {
    parts.push('Early-stage artist.');
  }

  // Top strengths
  const strengths: string[] = [];
  if (dimensions.breakout >= 0.7) strengths.push('strong coverage');
  if (dimensions.momentum >= 0.7) strengths.push('high momentum');
  if (dimensions.creative_uniqueness >= 0.7) strengths.push('creative uniqueness');
  if (dimensions.scene_alignment >= 0.7) strengths.push('scene alignment');

  if (strengths.length > 0) {
    parts.push(`Strengths: ${strengths.join(', ')}.`);
  }

  // Risk factors
  if (dimensions.risk >= 0.6) {
    parts.push('Risk factors: volatility or low diversity.');
  }

  return parts.join(' ');
}

/**
 * Batch compute scores for multiple artists
 */
export async function batchComputeScores(
  artistSlugs: string[],
  config?: ScoringConfig
): Promise<Map<string, ANRScoreSnapshot | null>> {
  const results = new Map<string, ANRScoreSnapshot | null>();

  logger.info('Batch computing scores', { count: artistSlugs.length });

  // Process in batches of 10 to avoid overwhelming the system
  const batchSize = 10;
  for (let i = 0; i < artistSlugs.length; i += batchSize) {
    const batch = artistSlugs.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async slug => {
        const score = await computeScoresForArtist(slug, undefined, config);
        return { slug, score };
      })
    );

    batchResults.forEach(({ slug, score }) => {
      results.set(slug, score);
    });

    logger.debug('Batch processed', { batch: i / batchSize + 1, completed: i + batch.length });
  }

  logger.info('Batch computation complete', { total: artistSlugs.length });

  return results;
}
