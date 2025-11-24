/**
 * Trends Engine Tests
 */

import { calculateTrends, calculateAcceleration, calculateChange } from '../src/trends/trendsEngine';

describe('trendsEngine', () => {
  describe('calculateAcceleration', () => {
    it('should calculate acceleration correctly', () => {
      const acceleration = calculateAcceleration(10, 5, 1);
      expect(acceleration).toBe(5);
    });

    it('should return 0 for zero window', () => {
      const acceleration = calculateAcceleration(10, 5, 0);
      expect(acceleration).toBe(0);
    });
  });

  describe('calculateChange', () => {
    it('should calculate percentage change', () => {
      const change = calculateChange(150, 100);
      expect(change).toBe(50);
    });

    it('should handle zero previous value', () => {
      const change = calculateChange(100, 0);
      expect(change).toBe(100);
    });

    it('should calculate negative change', () => {
      const change = calculateChange(50, 100);
      expect(change).toBe(-50);
    });
  });

  describe('calculateTrends', () => {
    it('should calculate trends from events', async () => {
      const trends = await calculateTrends('24h', []);
      expect(Array.isArray(trends)).toBe(true);
    });
  });
});
