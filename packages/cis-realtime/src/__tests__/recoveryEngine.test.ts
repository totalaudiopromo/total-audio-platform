/**
 * Tests for RecoveryEngine
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecoveryEngine } from '../recoveryEngine';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('RecoveryEngine', () => {
  let mockSupabase: Partial<SupabaseClient>;
  let engine: RecoveryEngine;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                data: [
                  {
                    id: 'session-1',
                    project_id: 'test-project',
                    status: 'active',
                    last_heartbeat_at: new Date(Date.now() - 120000).toISOString(), // 2 min ago
                  },
                ],
                error: null,
              })),
            })),
          })),
        })),
      })) as any,
      rpc: vi.fn(() => ({
        data: {
          id: 'snapshot-1',
          snapshot: { test: 'data' },
          created_at: new Date().toISOString(),
        },
        error: null,
      })) as any,
    };

    engine = new RecoveryEngine(mockSupabase as SupabaseClient);
  });

  describe('detectCrashedSessions', () => {
    it('should detect stale sessions', async () => {
      const crashed = await engine.detectCrashedSessions(
        'test-project',
        'test-user'
      );

      expect(crashed).toHaveLength(1);
      expect(crashed[0].id).toBe('session-1');
    });

    it('should return empty array when no crashed sessions', async () => {
      mockSupabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                data: [],
                error: null,
              })),
            })),
          })),
        })),
      })) as any;

      const crashed = await engine.detectCrashedSessions(
        'test-project',
        'test-user'
      );

      expect(crashed).toHaveLength(0);
    });
  });

  describe('recoverLatestSnapshot', () => {
    it('should recover snapshot from session', async () => {
      const snapshot = await engine.recoverLatestSnapshot('session-1');

      expect(snapshot).toBeDefined();
      expect(snapshot?.snapshot).toEqual({ test: 'data' });
    });

    it('should return null when no snapshot found', async () => {
      mockSupabase.rpc = vi.fn(() => ({
        data: null,
        error: null,
      })) as any;

      const snapshot = await engine.recoverLatestSnapshot('session-1');

      expect(snapshot).toBeNull();
    });
  });

  describe('dismissCrashedSession', () => {
    it('should mark session as closed', async () => {
      const success = await engine.dismissCrashedSession('session-1');

      expect(success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('cis_project_sessions');
    });
  });
});
