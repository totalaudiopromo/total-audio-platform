/**
 * Tests for AutosaveEngine
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AutosaveEngine } from '../autosaveEngine';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('AutosaveEngine', () => {
  let mockSupabase: Partial<SupabaseClient>;
  let engine: AutosaveEngine;

  beforeEach(() => {
    vi.useFakeTimers();

    mockSupabase = {
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: 'test-session' },
              error: null,
            })),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: null,
            error: null,
          })),
        })),
      })) as any,
      rpc: vi.fn(() => ({
        data: null,
        error: null,
      })) as any,
    };

    engine = new AutosaveEngine(mockSupabase as SupabaseClient);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('startAutosaveSession', () => {
    it('should create a new session', async () => {
      const sessionId = await engine.startAutosaveSession(
        'test-project',
        'test-user'
      );

      expect(sessionId).toBe('test-session');
    });

    it('should start heartbeat interval', async () => {
      await engine.startAutosaveSession('test-project', 'test-user');

      // Fast-forward time by 60 seconds
      vi.advanceTimersByTime(60000);

      // Heartbeat should have been called
      expect(mockSupabase.rpc).toHaveBeenCalled();
    });
  });

  describe('queueSnapshot', () => {
    it('should queue snapshot for next save', () => {
      const snapshot = { test: 'data' };
      engine.queueSnapshot(snapshot);

      expect(engine['pendingSnapshot']).toEqual(snapshot);
    });
  });

  describe('recordSnapshot', () => {
    it('should save snapshot to database', async () => {
      const success = await engine.recordSnapshot(
        'test-project',
        'test-user',
        'test-session',
        { test: 'data' }
      );

      expect(success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('cis_autosave_snapshots');
    });

    it('should calculate snapshot size', async () => {
      const snapshot = { large: 'data'.repeat(1000) };
      await engine.recordSnapshot(
        'test-project',
        'test-user',
        'test-session',
        snapshot
      );

      const insertCall = (mockSupabase.from as any).mock.results[0].value.insert;
      expect(insertCall).toHaveBeenCalledWith(
        expect.objectContaining({
          size_bytes: expect.any(Number),
        })
      );
    });
  });

  describe('stopAutosave', () => {
    it('should clear intervals and close session', async () => {
      const sessionId = await engine.startAutosaveSession(
        'test-project',
        'test-user'
      );

      await engine.stopAutosave();

      // Should have updated session to closed
      expect(mockSupabase.from).toHaveBeenCalledWith('cis_project_sessions');
    });
  });
});
