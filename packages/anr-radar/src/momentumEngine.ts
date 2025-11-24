/**
 * Momentum Engine
 *
 * Analyzes momentum and breakout probability for artists.
 * Examines score velocity, acceleration, and trend direction.
 */

import type {
  MomentumAnalysis,
  MomentumDirection,
  BreakoutProbability,
  ANRScoreSnapshot,
} from './types.js';
import { getScoreHistory } from './anrStore.js';
import { calculateVelocity, calculateAcceleration, standardDeviation, clamp, round } from './utils/math.js';
import { logger } from './utils/logger.js';

/**
 * Compute momentum for a candidate
 */
export async function computeMomentum(
  candidateId: string,
  lookbackPeriods: number = 6
): Promise<MomentumAnalysis | null> {
  try {
    logger.debug('Computing momentum', { candidateId, lookbackPeriods });

    // Get score history
    const scores = await getScoreHistory(candidateId, lookbackPeriods);

    if (scores.length < 2) {
      logger.warn('Insufficient score history for momentum analysis', {
        candidateId,
        scoreCount: scores.length,
      });
      return null;
    }

    // Extract composite scores (oldest first for velocity calculation)
    const compositeScores = scores.reverse().map(s => s.composite_score);

    // Calculate velocity and acceleration
    const velocity = calculateVelocity(compositeScores);
    const acceleration = calculateAcceleration(compositeScores);

    // Determine direction based on velocity and acceleration
    const direction = determineMomentumDirection(velocity, acceleration);

    // Calculate amplitude (magnitude of momentum)
    const amplitude = Math.abs(velocity);

    const analysis: MomentumAnalysis = {
      candidate_id: candidateId,
      direction,
      amplitude: round(amplitude),
      recent_scores: scores.reverse(), // Back to newest first
      velocity: round(velocity),
      acceleration: round(acceleration),
    };

    logger.debug('Momentum computed', {
      candidateId,
      direction,
      velocity,
      acceleration,
    });

    return analysis;
  } catch (error) {
    logger.error('Failed to compute momentum', error, { candidateId });
    return null;
  }
}

/**
 * Determine momentum direction from velocity and acceleration
 */
function determineMomentumDirection(
  velocity: number,
  acceleration: number
): MomentumDirection {
  const velocityThreshold = 0.05; // 5% change is significant
  const accelerationThreshold = 0.02;

  // Strongly up: positive velocity and acceleration
  if (velocity > velocityThreshold && acceleration > accelerationThreshold) {
    return 'strongly_up';
  }

  // Moderately up: positive velocity
  if (velocity > velocityThreshold) {
    return 'moderately_up';
  }

  // Down: negative velocity
  if (velocity < -velocityThreshold) {
    return 'down';
  }

  // Flat: minimal velocity
  return 'flat';
}

/**
 * Compute breakout probability
 *
 * Combines breakout score + momentum score + scene alignment score
 * with weighting towards high momentum
 */
export async function computeBreakoutProbability(
  candidateId: string
): Promise<BreakoutProbability | null> {
  try {
    logger.debug('Computing breakout probability', { candidateId });

    // Get latest scores
    const scores = await getScoreHistory(candidateId, 1);
    if (scores.length === 0) {
      logger.warn('No scores found for breakout probability', { candidateId });
      return null;
    }

    const latestScore = scores[0];

    // Get momentum analysis
    const momentum = await computeMomentum(candidateId);

    // Base factors from latest score
    const breakoutScore = latestScore.breakout_score;
    const momentumScore = latestScore.momentum_score;
    const sceneAlignmentScore = latestScore.scene_alignment_score;

    // Boost momentum score if direction is strongly up
    let adjustedMomentumScore = momentumScore;
    if (momentum?.direction === 'strongly_up') {
      adjustedMomentumScore = Math.min(momentumScore * 1.2, 1.0);
    } else if (momentum?.direction === 'down') {
      adjustedMomentumScore = momentumScore * 0.8;
    }

    // Calculate probability as weighted combination
    const weights = [0.4, 0.35, 0.25]; // breakout, momentum, scene_alignment
    const values = [breakoutScore, adjustedMomentumScore, sceneAlignmentScore];

    const probability =
      values[0] * weights[0] + values[1] * weights[1] + values[2] * weights[2];

    // Calculate confidence based on score history consistency
    const confidence = momentum ? calculateConfidence(momentum) : 0.5;

    const result: BreakoutProbability = {
      candidate_id: candidateId,
      probability: round(clamp(probability, 0, 1)),
      confidence: round(confidence),
      factors: {
        breakout_score: breakoutScore,
        momentum_score: adjustedMomentumScore,
        scene_alignment_score: sceneAlignmentScore,
      },
      explanation: generateBreakoutExplanation(
        probability,
        confidence,
        momentum?.direction || 'flat'
      ),
    };

    logger.debug('Breakout probability computed', {
      candidateId,
      probability: result.probability,
      confidence: result.confidence,
    });

    return result;
  } catch (error) {
    logger.error('Failed to compute breakout probability', error, { candidateId });
    return null;
  }
}

/**
 * Calculate confidence based on consistency of scores
 */
function calculateConfidence(momentum: MomentumAnalysis): number {
  const scores = momentum.recent_scores.map(s => s.composite_score);

  if (scores.length < 3) return 0.5;

  // Lower standard deviation = higher confidence
  const stdev = standardDeviation(scores);

  // Normalize: stdev of 0.1 = 80% confidence, 0.2 = 60%, 0.3 = 40%
  const confidence = Math.max(0.2, 1 - stdev * 2);

  return clamp(confidence, 0, 1);
}

/**
 * Generate human-readable explanation of breakout probability
 */
function generateBreakoutExplanation(
  probability: number,
  confidence: number,
  direction: MomentumDirection
): string {
  const parts: string[] = [];

  // Probability assessment
  if (probability >= 0.75) {
    parts.push('High breakout probability.');
  } else if (probability >= 0.5) {
    parts.push('Moderate breakout probability.');
  } else if (probability >= 0.3) {
    parts.push('Low breakout probability.');
  } else {
    parts.push('Very early stage.');
  }

  // Momentum context
  if (direction === 'strongly_up') {
    parts.push('Strong upward momentum.');
  } else if (direction === 'moderately_up') {
    parts.push('Positive momentum.');
  } else if (direction === 'down') {
    parts.push('Declining momentum.');
  }

  // Confidence qualifier
  if (confidence >= 0.7) {
    parts.push('High confidence in assessment.');
  } else if (confidence < 0.5) {
    parts.push('Limited data, lower confidence.');
  }

  return parts.join(' ');
}

/**
 * Batch compute momentum for multiple candidates
 */
export async function batchComputeMomentum(
  candidateIds: string[]
): Promise<Map<string, MomentumAnalysis | null>> {
  const results = new Map<string, MomentumAnalysis | null>();

  logger.info('Batch computing momentum', { count: candidateIds.length });

  // Process in parallel (limited concurrency)
  const batchSize = 10;
  for (let i = 0; i < candidateIds.length; i += batchSize) {
    const batch = candidateIds.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async id => {
        const momentum = await computeMomentum(id);
        return { id, momentum };
      })
    );

    batchResults.forEach(({ id, momentum }) => {
      results.set(id, momentum);
    });
  }

  logger.info('Batch momentum computation complete', { total: candidateIds.length });

  return results;
}

/**
 * Batch compute breakout probability for multiple candidates
 */
export async function batchComputeBreakoutProbability(
  candidateIds: string[]
): Promise<Map<string, BreakoutProbability | null>> {
  const results = new Map<string, BreakoutProbability | null>();

  logger.info('Batch computing breakout probability', { count: candidateIds.length });

  const batchSize = 10;
  for (let i = 0; i < candidateIds.length; i += batchSize) {
    const batch = candidateIds.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async id => {
        const probability = await computeBreakoutProbability(id);
        return { id, probability };
      })
    );

    batchResults.forEach(({ id, probability }) => {
      results.set(id, probability);
    });
  }

  logger.info('Batch breakout probability computation complete', {
    total: candidateIds.length,
  });

  return results;
}
