/**
 * Math Utilities for Scenes Engine
 * Statistical and mathematical helpers for scoring and analysis
 */

/**
 * Normalize a value to 0-1 range
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Calculate weighted average
 */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length || values.length === 0) {
    return 0;
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = values.reduce((sum, val, i) => sum + val * weights[i], 0);
  return weightedSum / totalWeight;
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
 * Calculate exponential moving average
 * @param values - Time series values (oldest to newest)
 * @param alpha - Smoothing factor (0-1), higher = more weight on recent values
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
 * Calculate growth rate between two values
 * Returns percentage change (-1 to +infinity)
 */
export function growthRate(oldValue: number, newValue: number): number {
  if (oldValue === 0) {
    return newValue > 0 ? 1 : 0; // 100% growth if starting from 0
  }

  return (newValue - oldValue) / oldValue;
}

/**
 * Calculate momentum score (0-100)
 * Combines recent value, growth rate, and consistency
 */
export function momentumScore(
  recentValues: number[],
  options: {
    baselineValue?: number;
    growthWeight?: number;
    consistencyWeight?: number;
  } = {}
): number {
  if (recentValues.length === 0) return 0;

  const {
    baselineValue = 50,
    growthWeight = 0.4,
    consistencyWeight = 0.3,
  } = options;

  // Current value component (0-1)
  const currentValue = recentValues[recentValues.length - 1];
  const valueComponent = normalize(currentValue, 0, baselineValue * 2);

  // Growth component (0-1)
  let growthComponent = 0;
  if (recentValues.length >= 2) {
    const oldValue = recentValues[recentValues.length - 2];
    const growth = growthRate(oldValue, currentValue);
    growthComponent = normalize(growth, -0.5, 0.5); // -50% to +50% growth normalized
  }

  // Consistency component (0-1) - inverse of volatility
  let consistencyComponent = 0.5; // default neutral
  if (recentValues.length >= 3) {
    const stdDev = standardDeviation(recentValues);
    const mean = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;
    consistencyComponent = 1 - normalize(coefficientOfVariation, 0, 1);
  }

  // Weighted score
  const valueWeight = 1 - growthWeight - consistencyWeight;
  const score = weightedAverage(
    [valueComponent, growthComponent, consistencyComponent],
    [valueWeight, growthWeight, consistencyWeight]
  );

  return Math.round(score * 100);
}

/**
 * Calculate Jaccard similarity coefficient between two sets
 * Useful for measuring overlap between scene memberships
 */
export function jaccardSimilarity<T>(setA: Set<T>, setB: Set<T>): number {
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

/**
 * Calculate cosine similarity between two vectors
 * Useful for comparing scene feature vectors
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }
  if (vectorA.length === 0) return 0;

  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Simple linear regression for trend analysis
 * Returns { slope, intercept, r2 }
 */
export function linearRegression(
  xValues: number[],
  yValues: number[]
): { slope: number; intercept: number; r2: number } {
  if (xValues.length !== yValues.length || xValues.length === 0) {
    return { slope: 0, intercept: 0, r2: 0 };
  }

  const n = xValues.length;
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  const sumYY = yValues.reduce((sum, y) => sum + y * y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const meanY = sumY / n;
  const ssTotal = yValues.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
  const ssResidual = yValues.reduce(
    (sum, y, i) => sum + Math.pow(y - (slope * xValues[i] + intercept), 2),
    0
  );
  const r2 = ssTotal > 0 ? 1 - ssResidual / ssTotal : 0;

  return { slope, intercept, r2 };
}
