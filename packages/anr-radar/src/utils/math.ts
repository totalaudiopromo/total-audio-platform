/**
 * Math Utilities for A&R Radar Scoring
 */

/**
 * Normalize a value to 0.0-1.0 range
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  const normalized = (value - min) / (max - min);
  return clamp(normalized, 0, 1);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate weighted average
 */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length) {
    throw new Error('Values and weights arrays must have same length');
  }
  if (values.length === 0) return 0;

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = values.reduce((sum, val, i) => sum + val * weights[i], 0);
  return weightedSum / totalWeight;
}

/**
 * Calculate exponential moving average (EMA)
 * @param values - Array of values (oldest first)
 * @param alpha - Smoothing factor (0-1, higher = more weight on recent values)
 */
export function exponentialMovingAverage(values: number[], alpha: number = 0.3): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];

  let ema = values[0];
  for (let i = 1; i < values.length; i++) {
    ema = alpha * values[i] + (1 - alpha) * ema;
  }
  return ema;
}

/**
 * Calculate velocity (rate of change) from time series
 * Returns average change per time unit
 */
export function calculateVelocity(values: number[]): number {
  if (values.length < 2) return 0;

  let totalChange = 0;
  for (let i = 1; i < values.length; i++) {
    totalChange += values[i] - values[i - 1];
  }

  return totalChange / (values.length - 1);
}

/**
 * Calculate acceleration (change in velocity) from time series
 */
export function calculateAcceleration(values: number[]): number {
  if (values.length < 3) return 0;

  const velocities: number[] = [];
  for (let i = 1; i < values.length; i++) {
    velocities.push(values[i] - values[i - 1]);
  }

  return calculateVelocity(velocities);
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

  return Math.sqrt(variance);
}

/**
 * Calculate coefficient of variation (CV)
 * Measures volatility/risk (stdev / mean)
 */
export function coefficientOfVariation(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  if (mean === 0) return 0;

  const stdev = standardDeviation(values);
  return stdev / mean;
}

/**
 * Calculate growth rate between two values
 */
export function growthRate(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 1 : 0;
  return (newValue - oldValue) / oldValue;
}

/**
 * Calculate compound annual growth rate (CAGR)
 * @param startValue - Starting value
 * @param endValue - Ending value
 * @param periods - Number of periods
 */
export function compoundGrowthRate(startValue: number, endValue: number, periods: number): number {
  if (startValue <= 0 || endValue <= 0 || periods <= 0) return 0;
  return Math.pow(endValue / startValue, 1 / periods) - 1;
}

/**
 * Sigmoid function for smooth 0-1 scaling
 * @param x - Input value
 * @param k - Steepness parameter (default 1)
 */
export function sigmoid(x: number, k: number = 1): number {
  return 1 / (1 + Math.exp(-k * x));
}

/**
 * Calculate euclidean distance between two vectors
 */
export function euclideanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length');
  }

  let sumSquares = 0;
  for (let i = 0; i < vec1.length; i++) {
    sumSquares += Math.pow(vec1[i] - vec2[i], 2);
  }

  return Math.sqrt(sumSquares);
}

/**
 * Calculate cosine similarity between two vectors
 * Returns value between -1 and 1 (1 = identical direction)
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;

  return dotProduct / (mag1 * mag2);
}

/**
 * Round to specified decimal places
 */
export function round(value: number, decimals: number = 4): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Safe division (returns 0 if denominator is 0)
 */
export function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculate percentile of a value in a dataset
 */
export function percentile(values: number[], value: number): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const index = sorted.findIndex(v => v >= value);

  if (index === -1) return 100; // Value is greater than all values
  if (index === 0) return 0;

  return (index / sorted.length) * 100;
}
