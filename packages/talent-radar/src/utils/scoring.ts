/**
 * Scoring Utilities for Talent Radar
 * Combines multiple signals into meaningful scores
 */

import { weightedAverage, normalize, sigmoid, clamp } from './math.js';

/**
 * Calculate momentum score (0-100)
 * Combines campaign, coverage, creative, and audience momentum
 */
export function calculateMomentumScore(signals: {
  campaignVelocity: number;
  coverageVelocity: number;
  creativeShift: number;
  audienceChange: number;
  playlistVelocity: number;
}): number {
  const values = [
    normalize(signals.campaignVelocity, -0.5, 2.0), // -50% to +200% growth
    normalize(signals.coverageVelocity, -0.5, 2.0),
    normalize(signals.creativeShift, 0, 1),
    normalize(signals.audienceChange, -0.5, 2.0),
    normalize(signals.playlistVelocity, -0.5, 2.0),
  ];

  const weights = [0.25, 0.25, 0.2, 0.15, 0.15];

  return Math.round(weightedAverage(values, weights) * 100);
}

/**
 * Calculate breakout score (0-1)
 * Predicts probability of breakout success
 */
export function calculateBreakoutScore(signals: {
  momentum: number; // 0-100
  migConnectivity: number; // 0-1
  pressQuality: number; // 0-1
  creativeShift: number; // 0-1
  sceneHotness: number; // 0-100
  identityAlignment: number; // 0-1
}): number {
  // Normalize momentum to 0-1
  const normalizedMomentum = signals.momentum / 100;

  // Weighted factors
  const values = [
    normalizedMomentum,
    signals.migConnectivity,
    signals.pressQuality,
    signals.creativeShift,
    signals.sceneHotness / 100,
    signals.identityAlignment,
  ];

  const weights = [0.3, 0.2, 0.2, 0.1, 0.1, 0.1];

  const rawScore = weightedAverage(values, weights);

  // Apply sigmoid to create more pronounced breakout threshold
  // Artists with combined score > 0.6 get boosted
  return clamp(sigmoid((rawScore - 0.5) * 4, 1), 0, 1);
}

/**
 * Calculate risk score (0-1)
 * Detects stagnation, decline, and misalignment
 */
export function calculateRiskScore(signals: {
  momentum: number; // 0-100
  coverageVelocity: number; // growth rate
  creativeShift: number; // 0-1 (low = stagnation)
  identityAlignment: number; // 0-1 (low = misalignment)
  sceneHotness: number; // 0-100
  audienceChange: number; // growth rate
}): number {
  // Risk factors (higher = more risk)
  const stagnationRisk = 1 - (signals.momentum / 100); // Low momentum = high risk
  const declineRisk = signals.coverageVelocity < 0 ? Math.abs(signals.coverageVelocity) : 0;
  const creativeStagnationRisk = 1 - signals.creativeShift;
  const misalignmentRisk = 1 - signals.identityAlignment;
  const sceneDeclineRisk = 1 - (signals.sceneHotness / 100);
  const audienceDeclineRisk = signals.audienceChange < 0 ? Math.abs(signals.audienceChange) : 0;

  const values = [
    stagnationRisk,
    declineRisk,
    creativeStagnationRisk,
    misalignmentRisk,
    sceneDeclineRisk,
    audienceDeclineRisk,
  ];

  const weights = [0.25, 0.2, 0.15, 0.15, 0.15, 0.1];

  return clamp(weightedAverage(values, weights), 0, 1);
}

/**
 * Calculate press quality score (0-1)
 * Based on outlet tier, coverage depth, and sentiment
 */
export function calculatePressQuality(coverage: Array<{
  outletTier: number; // 1-5 (1 = top tier)
  depth: number; // words/minutes
  sentiment: number; // -1 to 1
}>): number {
  if (coverage.length === 0) return 0;

  const scores = coverage.map(c => {
    const tierScore = (6 - c.outletTier) / 5; // Invert so tier 1 = 1.0
    const depthScore = normalize(c.depth, 0, 2000); // 0-2000 words
    const sentimentScore = (c.sentiment + 1) / 2; // -1 to 1 → 0 to 1

    return weightedAverage([tierScore, depthScore, sentimentScore], [0.5, 0.3, 0.2]);
  });

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

/**
 * Calculate reply quality score (0-1)
 * Based on reply rate, reply tier, and sentiment
 */
export function calculateReplyQuality(replies: Array<{
  outletTier: number;
  sentiment: number;
  depth: number;
}>): number {
  if (replies.length === 0) return 0;

  const scores = replies.map(r => {
    const tierScore = (6 - r.outletTier) / 5;
    const sentimentScore = (r.sentiment + 1) / 2;
    const depthScore = normalize(r.depth, 0, 500); // 0-500 words

    return weightedAverage([tierScore, sentimentScore, depthScore], [0.4, 0.4, 0.2]);
  });

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

/**
 * Calculate opportunity score (0-1)
 * Measures fit between artist and opportunity
 */
export function calculateOpportunityScore(factors: {
  sceneAlignment: number; // 0-1
  momentumMatch: number; // 0-1
  creativeAlignment: number; // 0-1
  networkFit: number; // 0-1
}): number {
  const values = [
    factors.sceneAlignment,
    factors.momentumMatch,
    factors.creativeAlignment,
    factors.networkFit,
  ];

  const weights = [0.3, 0.3, 0.2, 0.2];

  return clamp(weightedAverage(values, weights), 0, 1);
}

/**
 * Calculate confidence score for a recommendation
 * Based on data completeness and signal strength
 */
export function calculateConfidenceScore(factors: {
  dataCompleteness: number; // 0-1 (how much data we have)
  signalStrength: number; // 0-1 (how strong the signals are)
  signalAgreement: number; // 0-1 (do signals agree?)
  recency: number; // 0-1 (how recent is the data?)
}): number {
  const values = [
    factors.dataCompleteness,
    factors.signalStrength,
    factors.signalAgreement,
    factors.recency,
  ];

  const weights = [0.3, 0.3, 0.2, 0.2];

  return clamp(weightedAverage(values, weights), 0, 1);
}
