/**
 * MIG Graph Store Tests
 */

import { describe, it, expect } from '@jest/globals';

describe('MIG Graph Store', () => {
  describe('Neighborhood Operations', () => {
    it('should export getGraphNeighborhood function', () => {
      const { getGraphNeighborhood } = require('../src/graphStore');
      expect(typeof getGraphNeighborhood).toBe('function');
    });

    it('should export getGraphForScene function', () => {
      const { getGraphForScene } = require('../src/graphStore');
      expect(typeof getGraphForScene).toBe('function');
    });

    it('should export getGraphForMicrogenre function', () => {
      const { getGraphForMicrogenre } = require('../src/graphStore');
      expect(typeof getGraphForMicrogenre).toBe('function');
    });
  });

  describe('Cluster Operations', () => {
    it('should export computeClusterWeights function', () => {
      const { computeClusterWeights } = require('../src/graphStore');
      expect(typeof computeClusterWeights).toBe('function');
    });

    it('should export computeInfluenceScore function', () => {
      const { computeInfluenceScore } = require('../src/graphStore');
      expect(typeof computeInfluenceScore).toBe('function');
    });
  });

  describe('Statistics', () => {
    it('should export getGraphStatistics function', () => {
      const { getGraphStatistics } = require('../src/graphStore');
      expect(typeof getGraphStatistics).toBe('function');
    });

    it('should export getNodesByCountry function', () => {
      const { getNodesByCountry } = require('../src/graphStore');
      expect(typeof getNodesByCountry).toBe('function');
    });
  });
});
