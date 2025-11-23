/**
 * MIG Client Tests
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

describe('MIG Client', () => {
  beforeAll(() => {
    // Setup test environment
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  });

  describe('Node Operations', () => {
    it('should export getNodeBySlug function', () => {
      const { getNodeBySlug } = require('../src/client');
      expect(typeof getNodeBySlug).toBe('function');
    });

    it('should export getNodeById function', () => {
      const { getNodeById } = require('../src/client');
      expect(typeof getNodeById).toBe('function');
    });

    it('should export searchNodesByType function', () => {
      const { searchNodesByType } = require('../src/client');
      expect(typeof searchNodesByType).toBe('function');
    });

    it('should export addNode function', () => {
      const { addNode } = require('../src/client');
      expect(typeof addNode).toBe('function');
    });

    it('should export bulkInsertNodes function', () => {
      const { bulkInsertNodes } = require('../src/client');
      expect(typeof bulkInsertNodes).toBe('function');
    });
  });

  describe('Edge Operations', () => {
    it('should export getOutgoingEdges function', () => {
      const { getOutgoingEdges } = require('../src/client');
      expect(typeof getOutgoingEdges).toBe('function');
    });

    it('should export getIncomingEdges function', () => {
      const { getIncomingEdges } = require('../src/client');
      expect(typeof getIncomingEdges).toBe('function');
    });

    it('should export addEdge function', () => {
      const { addEdge } = require('../src/client');
      expect(typeof addEdge).toBe('function');
    });

    it('should export bulkInsertEdges function', () => {
      const { bulkInsertEdges } = require('../src/client');
      expect(typeof bulkInsertEdges).toBe('function');
    });
  });

  describe('Health Check', () => {
    it('should export checkHealth function', () => {
      const { checkHealth } = require('../src/client');
      expect(typeof checkHealth).toBe('function');
    });
  });
});
