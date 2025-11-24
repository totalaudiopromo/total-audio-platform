/**
 * Scoring Engine Tests
 */

import { describe, it, expect } from 'vitest';
import { computeCompositeScore, DEFAULT_SCORING_CONFIG } from '../scoringEngine';
import type { ScoreDimensions } from '../types';

describe('Scoring Engine', () => {
  it('should compute composite score correctly', () => {
    const dimensions: ScoreDimensions = {
      breakout: 0.8,
      momentum: 0.7,
      scene_alignment: 0.6,
      creative_uniqueness: 0.5,
      campaign_efficiency: 0.4,
      engagement_quality: 0.3,
      risk: 0.2,
    };

    const composite = computeCompositeScore(dimensions, DEFAULT_SCORING_CONFIG);

    // Should be between 0 and 1
    expect(composite).toBeGreaterThanOrEqual(0);
    expect(composite).toBeLessThanOrEqual(1);

    // Should be weighted average adjusted for risk
    expect(composite).toBeGreaterThan(0.4);
    expect(composite).toBeLessThan(0.8);
  });

  it('should handle high risk scenarios', () => {
    const dimensions: ScoreDimensions = {
      breakout: 0.9,
      momentum: 0.9,
      scene_alignment: 0.9,
      creative_uniqueness: 0.9,
      campaign_efficiency: 0.9,
      engagement_quality: 0.9,
      risk: 0.9, // High risk
    };

    const composite = computeCompositeScore(dimensions, DEFAULT_SCORING_CONFIG);

    // High risk should significantly reduce composite score
    expect(composite).toBeLessThan(0.9);
    expect(composite).toBeGreaterThan(0.5); // But not collapse it entirely
  });

  it('should handle all zeros', () => {
    const dimensions: ScoreDimensions = {
      breakout: 0,
      momentum: 0,
      scene_alignment: 0,
      creative_uniqueness: 0,
      campaign_efficiency: 0,
      engagement_quality: 0,
      risk: 0,
    };

    const composite = computeCompositeScore(dimensions, DEFAULT_SCORING_CONFIG);

    expect(composite).toBe(0);
  });

  it('should respect custom weights', () => {
    const dimensions: ScoreDimensions = {
      breakout: 1.0,
      momentum: 0.0,
      scene_alignment: 0.0,
      creative_uniqueness: 0.0,
      campaign_efficiency: 0.0,
      engagement_quality: 0.0,
      risk: 0.0,
    };

    const customConfig = {
      model_version: 'test',
      weights: {
        breakout: 1.0, // 100% weight on breakout
        momentum: 0.0,
        creative_uniqueness: 0.0,
        scene_alignment: 0.0,
        engagement_quality: 0.0,
        campaign_efficiency: 0.0,
      },
      risk_penalty: 0,
    };

    const composite = computeCompositeScore(dimensions, customConfig);

    expect(composite).toBe(1.0);
  });
});
