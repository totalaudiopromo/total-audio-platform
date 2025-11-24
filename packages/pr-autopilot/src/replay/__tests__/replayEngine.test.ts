/**
 * Replay Engine Tests
 */

import { ReplayEngine, type ReplayResult } from '../replayEngine';
import { createReplayStore } from '../replayStore';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AutopilotRun, AutopilotTask } from '../../types';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
        order: jest.fn(),
      })),
      order: jest.fn(),
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(),
    })),
  })),
} as unknown as SupabaseClient;

describe('ReplayEngine', () => {
  let engine: ReplayEngine;

  beforeEach(() => {
    engine = new ReplayEngine(mockSupabase);
    jest.clearAllMocks();
  });

  const mockRun: Partial<AutopilotRun> = {
    id: 'run-123',
    mission_id: 'mission-123',
    status: 'completed',
    started_at: '2025-01-01T00:00:00Z',
    completed_at: '2025-01-01T01:00:00Z',
  };

  const mockTasks: Partial<AutopilotTask>[] = [
    {
      id: 'task-1',
      mission_id: 'mission-123',
      run_id: 'run-123',
      agent_role: 'strategist',
      task_type: 'analyze',
      status: 'completed',
      output: { decision: 'approve', confidence: 0.9 },
    },
    {
      id: 'task-2',
      mission_id: 'mission-123',
      run_id: 'run-123',
      agent_role: 'pitch',
      task_type: 'draft',
      status: 'completed',
      output: { pitch: 'Great opportunity', confidence: 0.85 },
    },
  ];

  describe('captureReplayContext', () => {
    it('should capture mission config and tasks from original run', async () => {
      // Mock database responses
      const mockFrom = mockSupabase.from as jest.Mock;
      mockFrom.mockImplementation((table: string) => {
        if (table === 'autopilot_runs') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: mockRun,
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'autopilot_missions') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: 'mission-123',
                      config: { mode: 'suggest', maxContacts: 50 },
                    },
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'autopilot_tasks') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn(() =>
                  Promise.resolve({
                    data: mockTasks,
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        return {};
      });

      const context = await engine.captureReplayContext('run-123');

      expect(context.contextSnapshot).toBeDefined();
      expect(context.contextSnapshot.missionConfig).toBeDefined();
      expect(context.decisions).toBeDefined();
      expect(Object.keys(context.decisions)).toHaveLength(mockTasks.length);
    });

    it('should throw error if run not found', async () => {
      const mockFrom = mockSupabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: null,
                error: { message: 'Run not found' },
              })
            ),
          })),
        })),
      });

      await expect(engine.captureReplayContext('invalid-run')).rejects.toThrow();
    });
  });

  describe('createReplay', () => {
    it('should create replay with captured context', async () => {
      const mockFrom = mockSupabase.from as jest.Mock;

      // Mock run fetch
      mockFrom.mockImplementation((table: string) => {
        if (table === 'autopilot_runs') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: mockRun,
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'autopilot_missions') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: 'mission-123',
                      config: { mode: 'suggest' },
                    },
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'autopilot_tasks') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn(() =>
                  Promise.resolve({
                    data: mockTasks,
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'pr_mission_replays') {
          return {
            insert: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: 'replay-123',
                      user_id: 'user-123',
                      mission_id: 'mission-123',
                      original_run_id: 'run-123',
                      context_snapshot: {},
                      decisions: {},
                      created_at: new Date().toISOString(),
                    },
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        return {};
      });

      const replay = await engine.createReplay({
        userId: 'user-123',
        missionId: 'mission-123',
        originalRunId: 'run-123',
      });

      expect(replay).toBeDefined();
      expect(replay.id).toBe('replay-123');
      expect(replay.original_run_id).toBe('run-123');
    });
  });

  describe('compareReplayResults', () => {
    it('should calculate match percentage between runs', async () => {
      const mockFrom = mockSupabase.from as jest.Mock;

      mockFrom.mockImplementation((table: string) => {
        if (table === 'pr_mission_replays') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: 'replay-123',
                      original_run_id: 'run-original',
                      replay_run_id: 'run-replay',
                    },
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'autopilot_runs') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: mockRun,
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'autopilot_tasks') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn(() =>
                  Promise.resolve({
                    data: mockTasks,
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        return {};
      });

      const comparison = await engine.compareReplayResults('replay-123');

      expect(comparison).toBeDefined();
      expect(comparison.overallMatch).toBeGreaterThanOrEqual(0);
      expect(comparison.overallMatch).toBeLessThanOrEqual(1);
      expect(comparison.taskComparisons).toBeDefined();
    });

    it('should detect differences in task outputs', async () => {
      const originalTasks = [
        {
          id: 'task-1',
          status: 'completed',
          output: { decision: 'approve', confidence: 0.9 },
        },
      ];

      const replayTasks = [
        {
          id: 'task-1',
          status: 'completed',
          output: { decision: 'reject', confidence: 0.8 },
        },
      ];

      const mockFrom = mockSupabase.from as jest.Mock;

      mockFrom.mockImplementation((table: string) => {
        if (table === 'pr_mission_replays') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: 'replay-123',
                      original_run_id: 'run-original',
                      replay_run_id: 'run-replay',
                    },
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'autopilot_runs') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: mockRun,
                    error: null,
                  })
                ),
              })),
            })),
          };
        }
        if (table === 'autopilot_tasks') {
          const selectMock = jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(),
            })),
          }));

          // Return different data based on call order
          let callCount = 0;
          selectMock().eq().order = jest.fn(() => {
            callCount++;
            return Promise.resolve({
              data: callCount === 1 ? originalTasks : replayTasks,
              error: null,
            });
          });

          return { select: selectMock };
        }
        return {};
      });

      const comparison = await engine.compareReplayResults('replay-123');

      expect(comparison.taskComparisons[0].matched).toBe(false);
      expect(comparison.taskComparisons[0].differences.length).toBeGreaterThan(0);
    });
  });
});
