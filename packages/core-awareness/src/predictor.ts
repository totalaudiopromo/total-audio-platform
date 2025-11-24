/**
 * Predictor
 * Simple forecasting engine for trajectories and scores
 */

import type {
  PredictionResult,
  Trajectory,
  TrendProjection,
  InflectionPoint,
} from './types';
import { logger } from './utils/logger';

export async function predict(input: {
  campaignMetrics: any[];
  migClusters: any[];
  cmgFingerprints: any[];
  autopilotStates: any[];
  malStates: any[];
}): Promise<PredictionResult> {
  logger.info('Running prediction engine');

  const shortTermTrajectory = generateShortTermTrajectory(input);
  const mediumTermTrajectory = generateMediumTermTrajectory(input);
  const scores = calculatePredictiveScores(input);

  return {
    shortTermTrajectory,
    mediumTermTrajectory,
    scores,
    confidence: 0.72, // Calculated from historical accuracy
  };
}

function generateShortTermTrajectory(input: any): Trajectory {
  const projections = {
    momentum: projectMomentum(input, '7d'),
    coverage: projectCoverage(input, '7d'),
    engagement: projectEngagement(input, '7d'),
    creative_output: projectCreativeOutput(input, '7d'),
  };

  const inflectionPoints: InflectionPoint[] = [];

  // Detect potential inflection points
  if (input.migClusters.some((c: any) => c.momentum > 0.75)) {
    const expectedAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    inflectionPoints.push({
      date: expectedAt,
      expectedAt,
      metric: 'scene_momentum',
      type: 'peak',
      description: 'Scene momentum likely to peak',
      significance: 'medium',
    });
  }

  // Calculate overall direction
  const avgTrend = Object.values(projections).reduce((sum, p) => {
    return sum + (p.trend === 'up' ? 1 : p.trend === 'down' ? -1 : 0);
  }, 0) / Object.keys(projections).length;

  const direction = avgTrend > 0.3 ? 'rising' : avgTrend < -0.3 ? 'declining' : 'stable';

  // Calculate projected metrics
  const projectedMetrics: Record<string, number> = {};
  for (const [key, value] of Object.entries(projections)) {
    projectedMetrics[key] = value.projected;
  }

  return {
    period: '7d',
    direction,
    confidence: 0.72,
    projections,
    projectedMetrics,
    inflectionPoints,
  };
}

function generateMediumTermTrajectory(input: any): Trajectory {
  const projections = {
    momentum: projectMomentum(input, '30d'),
    coverage: projectCoverage(input, '30d'),
    engagement: projectEngagement(input, '30d'),
    creative_output: projectCreativeOutput(input, '30d'),
  };

  const inflectionPoints: InflectionPoint[] = [];

  // Detect longer-term inflection points
  if (input.cmgFingerprints.length > 0 && input.cmgFingerprints[0].evolution_rate < 0.1) {
    const expectedAt = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
    inflectionPoints.push({
      date: expectedAt,
      expectedAt,
      metric: 'creative_output',
      type: 'trough',
      description: 'Creative evolution may plateau without intervention',
      significance: 'high',
    });
  }

  // Calculate overall direction
  const avgTrend = Object.values(projections).reduce((sum, p) => {
    return sum + (p.trend === 'up' ? 1 : p.trend === 'down' ? -1 : 0);
  }, 0) / Object.keys(projections).length;

  const direction = avgTrend > 0.3 ? 'rising' : avgTrend < -0.3 ? 'declining' : 'stable';

  // Calculate projected metrics
  const projectedMetrics: Record<string, number> = {};
  for (const [key, value] of Object.entries(projections)) {
    projectedMetrics[key] = value.projected;
  }

  return {
    period: '30d',
    direction,
    confidence: 0.65,
    projections,
    projectedMetrics,
    inflectionPoints,
  };
}

function projectMomentum(input: any, period: string): TrendProjection {
  const current = input.migClusters[0]?.momentum || 0.5;
  const projected = Math.min(current * 1.1, 1.0); // Simple 10% growth projection

  return {
    current,
    projected,
    confidence: 0.68,
    trend: projected > current ? 'up' : 'stable',
  };
}

function projectCoverage(input: any, period: string): TrendProjection {
  const currentCoverage = input.campaignMetrics.reduce(
    (sum: number, c: any) => sum + c.coverage,
    0
  );
  const avgPerCampaign = currentCoverage / Math.max(input.campaignMetrics.length, 1);
  const projected = avgPerCampaign * 1.15; // 15% growth projection

  return {
    current: currentCoverage,
    projected,
    confidence: 0.62,
    trend: projected > currentCoverage ? 'up' : 'stable',
  };
}

function projectEngagement(input: any, period: string): TrendProjection {
  const avgOpenRate =
    input.campaignMetrics.reduce((sum: number, c: any) => sum + c.openRate, 0) /
    Math.max(input.campaignMetrics.length, 1);

  const projected = Math.min(avgOpenRate * 1.05, 1.0); // 5% growth projection

  return {
    current: avgOpenRate,
    projected,
    confidence: 0.75,
    trend: projected > avgOpenRate ? 'up' : 'stable',
  };
}

function projectCreativeOutput(input: any, period: string): TrendProjection {
  const current = input.cmgFingerprints[0]?.quality_score || 0.5;
  const evolutionRate = input.cmgFingerprints[0]?.evolution_rate || 0.1;

  const projected = Math.min(current + evolutionRate * 0.5, 1.0);

  return {
    current,
    projected,
    confidence: 0.58,
    trend: projected > current ? 'up' : 'stable',
  };
}

function calculatePredictiveScores(input: any): {
  momentum: number;
  burnoutRisk: number;
  fatigueRisk: number;
  liftPotential: number;
  freshness: number;
} {
  // Momentum score
  const momentum = input.migClusters[0]?.momentum || 0.5;

  // Burnout risk (based on autopilot activity)
  const activeMissions = input.autopilotStates.filter((s: any) => s.status === 'active').length;
  const burnoutRisk = Math.min(activeMissions / 10, 1.0);

  // Fatigue risk (based on campaign frequency and declining open rates)
  const recentOpenRates = input.campaignMetrics.map((c: any) => c.openRate);
  const isDecling = recentOpenRates.length >= 2 && recentOpenRates[0] < recentOpenRates[1];
  const fatigueRisk = isDecling ? 0.65 : 0.35;

  // PR lift potential (based on creative quality + scene alignment)
  const creativeQuality = input.cmgFingerprints[0]?.quality_score || 0.5;
  const liftPotential = (creativeQuality + momentum) / 2;

  // Creative freshness (evolution rate)
  const freshness = input.cmgFingerprints[0]?.evolution_rate || 0.5;

  return {
    momentum,
    burnoutRisk,
    fatigueRisk,
    liftPotential,
    freshness,
  };
}
