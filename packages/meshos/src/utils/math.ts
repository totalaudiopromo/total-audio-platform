/**
 * MeshOS Math Utilities
 * Mathematical helper functions
 */

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalize value to 0-1 range
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Calculate weighted average
 */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length) {
    throw new Error('Values and weights must have same length');
  }
  if (values.length === 0) return 0;

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = values.reduce((sum, v, i) => sum + v * weights[i], 0);
  return weightedSum / totalWeight;
}

/**
 * Calculate confidence score based on data quality and quantity
 */
export function calculateConfidence(params: {
  dataPoints: number;
  dataQuality: number; // 0-1
  recency: number; // 0-1, higher = more recent
  consistency: number; // 0-1, higher = more consistent
}): number {
  const { dataPoints, dataQuality, recency, consistency } = params;

  // More data points = higher confidence, but with diminishing returns
  const dataPointScore = Math.min(dataPoints / 100, 1);

  // Weighted average of all factors
  return weightedAverage(
    [dataPointScore, dataQuality, recency, consistency],
    [0.2, 0.3, 0.25, 0.25]
  );
}

/**
 * Calculate risk score
 */
export function calculateRisk(params: {
  probability: number; // 0-1
  impact: number; // 0-1
  uncertainty: number; // 0-1
}): number {
  const { probability, impact, uncertainty } = params;
  // Risk = probability × impact, amplified by uncertainty
  return clamp(probability * impact * (1 + uncertainty * 0.5), 0, 1);
}

/**
 * Calculate opportunity value
 */
export function calculateOpportunityValue(params: {
  benefit: number; // 0-1
  probability: number; // 0-1
  effort: number; // 0-1, higher = more effort
  timeWindow: number; // 0-1, higher = more urgent
}): number {
  const { benefit, probability, effort, timeWindow } = params;

  // Value = (benefit × probability × time sensitivity) / effort
  const value = (benefit * probability * (0.5 + timeWindow * 0.5)) / Math.max(effort, 0.1);

  return clamp(value, 0, 1);
}

/**
 * Calculate drift score between two values
 */
export function calculateDrift(expected: number, actual: number, sensitivity = 1): number {
  const diff = Math.abs(expected - actual);
  const avgValue = (expected + actual) / 2;

  if (avgValue === 0) return diff > 0 ? 1 : 0;

  // Normalized drift with sensitivity adjustment
  return clamp((diff / avgValue) * sensitivity, 0, 1);
}

/**
 * Calculate consensus score from participant scores
 */
export function calculateConsensus(scores: number[]): number {
  if (scores.length === 0) return 0;
  if (scores.length === 1) return scores[0];

  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // High consensus = high average, low variance
  // Normalize std dev to 0-1 (assuming scores are 0-1)
  const consensusScore = avg * (1 - Math.min(stdDev, 1));

  return clamp(consensusScore, 0, 1);
}

/**
 * Exponential decay function (for time-based weighting)
 */
export function exponentialDecay(
  value: number,
  ageInDays: number,
  halfLife: number = 7
): number {
  return value * Math.pow(0.5, ageInDays / halfLife);
}

/**
 * Sigmoid function (for smooth 0-1 transitions)
 */
export function sigmoid(x: number, steepness: number = 1): number {
  return 1 / (1 + Math.exp(-x * steepness));
}
