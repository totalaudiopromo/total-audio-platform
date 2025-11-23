/**
 * Tests for FusionContextBridge
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FusionContextBridge } from '../FusionContextBridge';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('FusionContextBridge', () => {
  let mockSupabase: Partial<SupabaseClient>;
  let bridge: FusionContextBridge;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null,
            })),
          })),
        })),
      })) as any,
    };

    bridge = new FusionContextBridge(mockSupabase as SupabaseClient);
  });

  describe('getArtistContext', () => {
    it('should return null when artist not found', async () => {
      const result = await bridge.getArtistContext('nonexistent');
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      mockSupabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: { message: 'Database error' },
            })),
          })),
        })),
      })) as any;

      const result = await bridge.getArtistContext('test-artist');
      expect(result).toBeNull();
    });
  });

  describe('getCampaignContext', () => {
    it('should return null when campaign not found', async () => {
      const result = await bridge.getCampaignContext('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('getSceneContext', () => {
    it('should return null when no release provided', async () => {
      const result = await bridge.getSceneContext();
      expect(result).toBeNull();
    });
  });

  describe('getAudienceSignals', () => {
    it('should return default signals when campaign not found', async () => {
      const result = await bridge.getAudienceSignals('nonexistent-id');
      expect(result).toEqual({
        demographics: [],
        interests: [],
        platforms: [],
      });
    });
  });
});
