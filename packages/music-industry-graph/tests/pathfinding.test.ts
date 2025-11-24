/**
 * MIG Pathfinding Tests
 */

import { describe, it, expect } from '@jest/globals';

describe('MIG Pathfinding', () => {
  describe('Shortest Path', () => {
    it('should export findShortestPath function', () => {
      const { findShortestPath } = require('../src/pathfinding');
      expect(typeof findShortestPath).toBe('function');
    });

    it('should export findInfluencePath function', () => {
      const { findInfluencePath } = require('../src/pathfinding');
      expect(typeof findInfluencePath).toBe('function');
    });
  });

  describe('Degrees of Separation', () => {
    it('should export getDegreesOfSeparation function', () => {
      const { getDegreesOfSeparation } = require('../src/pathfinding');
      expect(typeof getDegreesOfSeparation).toBe('function');
    });
  });

  describe('All Paths', () => {
    it('should export findAllPaths function', () => {
      const { findAllPaths } = require('../src/pathfinding');
      expect(typeof findAllPaths).toBe('function');
    });
  });
});
