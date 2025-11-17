/**
 * Momentum Engine Tests
 */

import { describe, it, expect } from 'vitest';
import { calculateVelocity, calculateAcceleration } from '../utils/math';

describe('Momentum Engine', () => {
  it('should calculate positive velocity for upward trend', () => {
    const scores = [0.4, 0.5, 0.6, 0.7, 0.8];
    const velocity = calculateVelocity(scores);

    expect(velocity).toBeGreaterThan(0);
    expect(velocity).toBeCloseTo(0.1, 2);
  });

  it('should calculate negative velocity for downward trend', () => {
    const scores = [0.8, 0.7, 0.6, 0.5, 0.4];
    const velocity = calculateVelocity(scores);

    expect(velocity).toBeLessThan(0);
    expect(velocity).toBeCloseTo(-0.1, 2);
  });

  it('should calculate zero velocity for flat trend', () => {
    const scores = [0.5, 0.5, 0.5, 0.5, 0.5];
    const velocity = calculateVelocity(scores);

    expect(velocity).toBe(0);
  });

  it('should calculate positive acceleration for accelerating growth', () => {
    const scores = [0.4, 0.5, 0.65, 0.85];
    const acceleration = calculateAcceleration(scores);

    expect(acceleration).toBeGreaterThan(0);
  });

  it('should calculate negative acceleration for decelerating growth', () => {
    const scores = [0.4, 0.55, 0.65, 0.7];
    const acceleration = calculateAcceleration(scores);

    expect(acceleration).toBeLessThan(0);
  });
});
