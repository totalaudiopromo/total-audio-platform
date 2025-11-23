/**
 * Tests for ContextBuilder
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContextBuilder } from '../ContextBuilder';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('ContextBuilder', () => {
  let mockSupabase: Partial<SupabaseClient>;
  let builder: ContextBuilder;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: {
                id: 'test-project',
                user_id: 'test-user',
                artist_slug: 'test-artist',
                campaign_id: 'test-campaign',
                release_id: 'test-release',
              },
              error: null,
            })),
          })),
        })),
      })) as any,
    };

    builder = new ContextBuilder(mockSupabase as SupabaseClient);
  });

  describe('buildContext', () => {
    it('should build basic context with project data', async () => {
      const context = await builder.buildContext('test-project', 'test-user');

      expect(context).toBeDefined();
      expect(context.projectId).toBe('test-project');
      expect(context.userId).toBe('test-user');
      expect(context.artistSlug).toBe('test-artist');
      expect(context.campaignId).toBe('test-campaign');
      expect(context.releaseId).toBe('test-release');
      expect(context.timestamp).toBeDefined();
    });

    it('should handle missing project gracefully', async () => {
      mockSupabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: { message: 'Project not found' },
            })),
          })),
        })),
      })) as any;

      const context = await builder.buildContext('nonexistent', 'test-user');

      expect(context.projectId).toBe('nonexistent');
      expect(context.userId).toBe('test-user');
      expect(context.artistSlug).toBeUndefined();
    });

    it('should collect all contexts in parallel', async () => {
      const startTime = Date.now();
      await builder.buildContext('test-project', 'test-user');
      const duration = Date.now() - startTime;

      // Should complete quickly due to parallel execution
      expect(duration).toBeLessThan(1000);
    });
  });
});
