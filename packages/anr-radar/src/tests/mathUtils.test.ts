/**
 * Math Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  normalize,
  clamp,
  weightedAverage,
  safeDivide,
  standardDeviation,
  growthRate,
} from '../utils/math';

describe('Math Utilities', () => {
  describe('normalize', () => {
    it('should normalize value to 0-1 range', () => {
      expect(normalize(5, 0, 10)).toBe(0.5);
      expect(normalize(0, 0, 10)).toBe(0);
      expect(normalize(10, 0, 10)).toBe(1);
    });

    it('should handle same min/max', () => {
      expect(normalize(5, 5, 5)).toBe(0);
    });

    it('should clamp values outside range', () => {
      expect(normalize(-5, 0, 10)).toBe(0);
      expect(normalize(15, 0, 10)).toBe(1);
    });
  });

  describe('clamp', () => {
    it('should clamp value between min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('weightedAverage', () => {
    it('should calculate weighted average correctly', () => {
      const values = [0.8, 0.6, 0.4];
      const weights = [0.5, 0.3, 0.2];

      const avg = weightedAverage(values, weights);

      expect(avg).toBeCloseTo(0.68, 2);
    });

    it('should handle equal weights', () => {
      const values = [0.6, 0.8, 1.0];
      const weights = [1, 1, 1];

      const avg = weightedAverage(values, weights);

      expect(avg).toBeCloseTo(0.8, 2);
    });
  });

  describe('safeDivide', () => {
    it('should divide numbers correctly', () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(7, 2)).toBe(3.5);
    });

    it('should return 0 when dividing by zero', () => {
      expect(safeDivide(10, 0)).toBe(0);
    });
  });

  describe('standardDeviation', () => {
    it('should calculate standard deviation', () => {
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const stdev = standardDeviation(values);

      expect(stdev).toBeGreaterThan(1.5);
      expect(stdev).toBeLessThan(2.5);
    });

    it('should return 0 for identical values', () => {
      const values = [5, 5, 5, 5, 5];
      expect(standardDeviation(values)).toBe(0);
    });
  });

  describe('growthRate', () => {
    it('should calculate positive growth rate', () => {
      expect(growthRate(100, 150)).toBe(0.5); // 50% growth
    });

    it('should calculate negative growth rate', () => {
      expect(growthRate(100, 80)).toBe(-0.2); // -20% growth
    });

    it('should handle zero old value', () => {
      expect(growthRate(0, 100)).toBe(1);
      expect(growthRate(0, 0)).toBe(0);
    });
  });
});
