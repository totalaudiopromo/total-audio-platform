/**
 * Decay Functions for Time-based Signal Processing
 * Used to reduce weight of older signals
 */

/**
 * Exponential decay - older values decay exponentially
 * @param age - Age in days
 * @param halfLife - Half-life in days (default 30)
 */
export function exponentialDecay(age: number, halfLife: number = 30): number {
  return Math.exp(-Math.log(2) * age / halfLife);
}

/**
 * Linear decay - older values decay linearly
 * @param age - Age in days
 * @param maxAge - Maximum age before value is 0 (default 90)
 */
export function linearDecay(age: number, maxAge: number = 90): number {
  if (age >= maxAge) return 0;
  return 1 - (age / maxAge);
}

/**
 * Inverse decay - older values decay slower initially, faster later
 * @param age - Age in days
 * @param steepness - Steepness factor (default 0.1)
 */
export function inverseDecay(age: number, steepness: number = 0.1): number {
  return 1 / (1 + steepness * age);
}

/**
 * Sigmoid decay - S-curve decay
 * @param age - Age in days
 * @param midpoint - Midpoint of decay curve (default 45)
 * @param steepness - Steepness of curve (default 0.1)
 */
export function sigmoidDecay(age: number, midpoint: number = 45, steepness: number = 0.1): number {
  return 1 / (1 + Math.exp(steepness * (age - midpoint)));
}

/**
 * Calculate weighted value with decay
 * @param value - Original value
 * @param age - Age in days
 * @param decayType - Type of decay function
 */
export function applyDecay(
  value: number,
  age: number,
  decayType: 'exponential' | 'linear' | 'inverse' | 'sigmoid' = 'exponential'
): number {
  let decayFactor: number;

  switch (decayType) {
    case 'exponential':
      decayFactor = exponentialDecay(age);
      break;
    case 'linear':
      decayFactor = linearDecay(age);
      break;
    case 'inverse':
      decayFactor = inverseDecay(age);
      break;
    case 'sigmoid':
      decayFactor = sigmoidDecay(age);
      break;
  }

  return value * decayFactor;
}

/**
 * Freshn</s score - how "fresh" a signal is
 * Returns 0-1, where 1 is very fresh (< 7 days) and 0 is very old (> 90 days)
 */
export function freshnessScore(age: number): number {
  if (age <= 7) return 1;
  if (age >= 90) return 0;
  return linearDecay(age - 7, 83); // Decay from day 7 to day 90
}
