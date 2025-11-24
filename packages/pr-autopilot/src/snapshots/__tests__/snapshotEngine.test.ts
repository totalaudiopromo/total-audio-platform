/**
 * Snapshot Engine Tests
 */

import { SnapshotEngine, type SnapshotData, type SnapshotDiff } from '../snapshotEngine';
import type { SupabaseClient } from '@supabase/supabase-js';

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

describe('SnapshotEngine', () => {
  let engine: SnapshotEngine;

  beforeEach(() => {
    engine = new SnapshotEngine(mockSupabase);
    jest.clearAllMocks();
  });

  const mockMission = {
    id: 'mission-123',
    title: 'Test Campaign',
    status: 'active',
    mode: 'suggest',
    config: { maxContacts: 50 },
  };

  const mockTasks = [
    {
      id: 'task-1',
      agent_role: 'strategist',
      task_type: 'analyze',
      status: 'completed',
      priority: 1,
      sequence_order: 1,
      output: { decision: 'approve' },
    },
    {
      id: 'task-2',
      agent_role: 'pitch',
      task_type: 'draft',
      status: 'pending',
      priority: 2,
      sequence_order: 2,
      output: null,
    },
  ];

  describe('captureSnapshot', () => {
    it('should capture current mission state', async () => {
      const mockFrom = mockSupabase.from as jest.Mock;

      mockFrom.mockImplementation((table: string) => {
        if (table === 'autopilot_missions') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: mockMission,
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
        if (table === 'pr_mission_snapshots') {
          return {
            insert: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: 'snapshot-123',
                      mission_id: 'mission-123',
                      snapshot: {},
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

      const snapshot = await engine.captureSnapshot('mission-123');

      expect(snapshot).toBeDefined();
      expect(snapshot.mission_id).toBe('mission-123');
    });

    it('should calculate correct task stats', async () => {
      const mockFrom = mockSupabase.from as jest.Mock;
      let capturedSnapshot: SnapshotData | null = null;

      mockFrom.mockImplementation((table: string) => {
        if (table === 'autopilot_missions') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: mockMission,
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
        if (table === 'pr_mission_snapshots') {
          return {
            insert: jest.fn((data: { snapshot: SnapshotData }) => {
              capturedSnapshot = data.snapshot;
              return {
                select: jest.fn(() => ({
                  single: jest.fn(() =>
                    Promise.resolve({
                      data: {
                        id: 'snapshot-123',
                        mission_id: 'mission-123',
                        snapshot: data.snapshot,
                        created_at: new Date().toISOString(),
                      },
                      error: null,
                    })
                  ),
                })),
              };
            }),
          };
        }
        return {};
      });

      await engine.captureSnapshot('mission-123');

      expect(capturedSnapshot).toBeDefined();
      expect(capturedSnapshot!.stats).toEqual({
        totalTasks: 2,
        completedTasks: 1,
        pendingTasks: 1,
        failedTasks: 0,
      });
    });

    it('should throw error if mission not found', async () => {
      const mockFrom = mockSupabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: null,
                error: null,
              })
            ),
          })),
        })),
      });

      await expect(engine.captureSnapshot('invalid-mission')).rejects.toThrow(
        'Mission not found'
      );
    });
  });

  describe('compareSnapshots', () => {
    it('should detect mission status changes', async () => {
      const snapshot1: SnapshotData = {
        mission: {
          id: 'mission-123',
          title: 'Test',
          status: 'active',
          mode: 'suggest',
          config: {},
        },
        tasks: [],
        stats: { totalTasks: 0, completedTasks: 0, pendingTasks: 0, failedTasks: 0 },
        timestamp: '2025-01-01T00:00:00Z',
      };

      const snapshot2: SnapshotData = {
        ...snapshot1,
        mission: { ...snapshot1.mission, status: 'completed' },
        timestamp: '2025-01-01T01:00:00Z',
      };

      const mockFrom = mockSupabase.from as jest.Mock;
      mockFrom.mockImplementation((table: string) => {
        if (table === 'pr_mission_snapshots') {
          const selectMock = jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(),
            })),
          }));

          let callCount = 0;
          selectMock().eq().single = jest.fn(() => {
            callCount++;
            return Promise.resolve({
              data: {
                id: callCount === 1 ? 'snapshot-1' : 'snapshot-2',
                snapshot: callCount === 1 ? snapshot1 : snapshot2,
              },
              error: null,
            });
          });

          return { select: selectMock };
        }
        return {};
      });

      const diff = await engine.compareSnapshots('snapshot-1', 'snapshot-2');

      expect(diff).toBeDefined();
      expect(diff!.changes.missionChanges).toContain('Status: active → completed');
    });

    it('should detect task status changes', async () => {
      const snapshot1: SnapshotData = {
        mission: {
          id: 'mission-123',
          title: 'Test',
          status: 'active',
          mode: 'suggest',
          config: {},
        },
        tasks: [
          {
            id: 'task-1',
            agent_role: 'strategist',
            task_type: 'analyze',
            status: 'pending',
            priority: 1,
            sequence_order: 1,
            output: {},
          },
        ],
        stats: { totalTasks: 1, completedTasks: 0, pendingTasks: 1, failedTasks: 0 },
        timestamp: '2025-01-01T00:00:00Z',
      };

      const snapshot2: SnapshotData = {
        ...snapshot1,
        tasks: [{ ...snapshot1.tasks[0], status: 'completed' }],
        stats: { totalTasks: 1, completedTasks: 1, pendingTasks: 0, failedTasks: 0 },
        timestamp: '2025-01-01T01:00:00Z',
      };

      const mockFrom = mockSupabase.from as jest.Mock;
      mockFrom.mockImplementation((table: string) => {
        if (table === 'pr_mission_snapshots') {
          const selectMock = jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(),
            })),
          }));

          let callCount = 0;
          selectMock().eq().single = jest.fn(() => {
            callCount++;
            return Promise.resolve({
              data: {
                id: callCount === 1 ? 'snapshot-1' : 'snapshot-2',
                snapshot: callCount === 1 ? snapshot1 : snapshot2,
              },
              error: null,
            });
          });

          return { select: selectMock };
        }
        return {};
      });

      const diff = await engine.compareSnapshots('snapshot-1', 'snapshot-2');

      expect(diff).toBeDefined();
      expect(diff!.changes.taskChanges).toContainEqual({
        taskId: 'task-1',
        field: 'status',
        oldValue: 'pending',
        newValue: 'completed',
      });
    });

    it('should detect stats changes', async () => {
      const snapshot1: SnapshotData = {
        mission: {
          id: 'mission-123',
          title: 'Test',
          status: 'active',
          mode: 'suggest',
          config: {},
        },
        tasks: [],
        stats: { totalTasks: 2, completedTasks: 0, pendingTasks: 2, failedTasks: 0 },
        timestamp: '2025-01-01T00:00:00Z',
      };

      const snapshot2: SnapshotData = {
        ...snapshot1,
        stats: { totalTasks: 2, completedTasks: 1, pendingTasks: 1, failedTasks: 0 },
        timestamp: '2025-01-01T01:00:00Z',
      };

      const mockFrom = mockSupabase.from as jest.Mock;
      mockFrom.mockImplementation((table: string) => {
        if (table === 'pr_mission_snapshots') {
          const selectMock = jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(),
            })),
          }));

          let callCount = 0;
          selectMock().eq().single = jest.fn(() => {
            callCount++;
            return Promise.resolve({
              data: {
                id: callCount === 1 ? 'snapshot-1' : 'snapshot-2',
                snapshot: callCount === 1 ? snapshot1 : snapshot2,
              },
              error: null,
            });
          });

          return { select: selectMock };
        }
        return {};
      });

      const diff = await engine.compareSnapshots('snapshot-1', 'snapshot-2');

      expect(diff).toBeDefined();
      expect(diff!.changes.statsChanges.completedTasks).toEqual({
        old: 0,
        new: 1,
      });
    });

    it('should return null if snapshot not found', async () => {
      const mockFrom = mockSupabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: null,
                error: null,
              })
            ),
          })),
        })),
      });

      const diff = await engine.compareSnapshots('invalid-1', 'invalid-2');
      expect(diff).toBeNull();
    });
  });

  describe('autoSnapshot', () => {
    it('should create snapshot with label', async () => {
      const mockFrom = mockSupabase.from as jest.Mock;

      mockFrom.mockImplementation((table: string) => {
        if (table === 'autopilot_missions') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: mockMission,
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
        if (table === 'pr_mission_snapshots') {
          return {
            insert: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: 'snapshot-123',
                      mission_id: 'mission-123',
                      snapshot: {},
                      created_at: new Date().toISOString(),
                    },
                    error: null,
                  })
                ),
              })),
            })),
            update: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ error: null })),
            })),
          };
        }
        return {};
      });

      const snapshot = await engine.autoSnapshot('mission-123', undefined, 'Before major change');

      expect(snapshot).toBeDefined();
      expect(mockSupabase.from).toHaveBeenCalledWith('pr_mission_snapshots');
    });
  });
});
