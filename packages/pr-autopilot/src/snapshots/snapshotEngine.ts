/**
 * Snapshot Engine
 *
 * Create and manage lightweight snapshots of mission state
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { createSnapshotStore, type MissionSnapshot } from './snapshotStore';

export interface SnapshotData {
  mission: {
    id: string;
    title: string;
    status: string;
    mode: string;
    config: Record<string, unknown>;
  };
  tasks: Array<{
    id: string;
    agent_role: string;
    task_type: string;
    status: string;
    priority: number;
    sequence_order: number;
    output?: Record<string, unknown>;
  }>;
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    failedTasks: number;
  };
  timestamp: string;
}

export interface SnapshotDiff {
  old: SnapshotData;
  new: SnapshotData;
  changes: {
    missionChanges: string[];
    taskChanges: Array<{
      taskId: string;
      field: string;
      oldValue: unknown;
      newValue: unknown;
    }>;
    statsChanges: Record<string, { old: number; new: number }>;
  };
}

export class SnapshotEngine {
  private store: ReturnType<typeof createSnapshotStore>;

  constructor(private supabase: SupabaseClient) {
    this.store = createSnapshotStore(supabase);
  }

  /**
   * Capture current mission state
   */
  async captureSnapshot(missionId: string, runId?: string): Promise<MissionSnapshot> {
    // Get mission
    const { data: mission } = await this.supabase
      .from('autopilot_missions')
      .select('*')
      .eq('id', missionId)
      .single();

    if (!mission) {
      throw new Error('Mission not found');
    }

    // Get all tasks
    const { data: tasks } = await this.supabase
      .from('autopilot_tasks')
      .select('*')
      .eq('mission_id', missionId)
      .order('sequence_order');

    const tasksData =
      tasks?.map((t) => ({
        id: t.id,
        agent_role: t.agent_role,
        task_type: t.task_type,
        status: t.status,
        priority: t.priority,
        sequence_order: t.sequence_order,
        output: t.output as Record<string, unknown>,
      })) || [];

    // Calculate stats
    const stats = {
      totalTasks: tasksData.length,
      completedTasks: tasksData.filter((t) => t.status === 'completed').length,
      pendingTasks: tasksData.filter((t) => t.status === 'pending').length,
      failedTasks: tasksData.filter((t) => t.status === 'failed').length,
    };

    const snapshotData: SnapshotData = {
      mission: {
        id: mission.id,
        title: mission.title,
        status: mission.status,
        mode: mission.mode,
        config: mission.config as Record<string, unknown>,
      },
      tasks: tasksData,
      stats,
      timestamp: new Date().toISOString(),
    };

    return this.store.createSnapshot({
      missionId,
      runId,
      snapshot: snapshotData,
    });
  }

  /**
   * Get snapshot
   */
  async getSnapshot(snapshotId: string): Promise<MissionSnapshot | null> {
    return this.store.getSnapshot(snapshotId);
  }

  /**
   * List snapshots for mission
   */
  async listSnapshots(missionId: string): Promise<MissionSnapshot[]> {
    return this.store.listSnapshotsForMission(missionId);
  }

  /**
   * Compare two snapshots
   */
  async compareSnapshots(snapshotId1: string, snapshotId2: string): Promise<SnapshotDiff | null> {
    const snapshot1 = await this.store.getSnapshot(snapshotId1);
    const snapshot2 = await this.store.getSnapshot(snapshotId2);

    if (!snapshot1 || !snapshot2) {
      return null;
    }

    const old = snapshot1.snapshot as SnapshotData;
    const newData = snapshot2.snapshot as SnapshotData;

    const changes = this.calculateChanges(old, newData);

    return {
      old,
      new: newData,
      changes,
    };
  }

  /**
   * Calculate changes between snapshots
   */
  private calculateChanges(
    old: SnapshotData,
    newData: SnapshotData
  ): SnapshotDiff['changes'] {
    const missionChanges: string[] = [];
    const taskChanges: SnapshotDiff['changes']['taskChanges'] = [];
    const statsChanges: SnapshotDiff['changes']['statsChanges'] = {};

    // Mission changes
    if (old.mission.status !== newData.mission.status) {
      missionChanges.push(
        `Status: ${old.mission.status} → ${newData.mission.status}`
      );
    }

    if (old.mission.mode !== newData.mission.mode) {
      missionChanges.push(`Mode: ${old.mission.mode} → ${newData.mission.mode}`);
    }

    // Task changes
    const oldTaskMap = new Map(old.tasks.map((t) => [t.id, t]));
    const newTaskMap = new Map(newData.tasks.map((t) => [t.id, t]));

    for (const [taskId, newTask] of newTaskMap) {
      const oldTask = oldTaskMap.get(taskId);

      if (oldTask && oldTask.status !== newTask.status) {
        taskChanges.push({
          taskId,
          field: 'status',
          oldValue: oldTask.status,
          newValue: newTask.status,
        });
      }

      if (oldTask && oldTask.priority !== newTask.priority) {
        taskChanges.push({
          taskId,
          field: 'priority',
          oldValue: oldTask.priority,
          newValue: newTask.priority,
        });
      }
    }

    // Stats changes
    for (const [key, newValue] of Object.entries(newData.stats)) {
      const oldValue = old.stats[key as keyof typeof old.stats];
      if (oldValue !== newValue) {
        statsChanges[key] = { old: oldValue, new: newValue };
      }
    }

    return { missionChanges, taskChanges, statsChanges };
  }

  /**
   * Auto-snapshot before major operations
   */
  async autoSnapshot(missionId: string, runId?: string, label?: string): Promise<MissionSnapshot> {
    const snapshot = await this.captureSnapshot(missionId, runId);

    // Add label to snapshot metadata if provided
    if (label) {
      const snapshotData = snapshot.snapshot as SnapshotData & { label?: string };
      snapshotData.label = label;

      await this.supabase
        .from('pr_mission_snapshots')
        .update({ snapshot: snapshotData })
        .eq('id', snapshot.id);
    }

    return snapshot;
  }

  /**
   * Restore from snapshot (read-only comparison)
   */
  async getRestorePreview(snapshotId: string): Promise<{
    snapshot: SnapshotData;
    currentState: SnapshotData;
    changes: SnapshotDiff['changes'];
  }> {
    const snapshot = await this.store.getSnapshot(snapshotId);

    if (!snapshot) {
      throw new Error('Snapshot not found');
    }

    // Get current state
    const currentSnapshot = await this.captureSnapshot(snapshot.mission_id);

    const snapshotData = snapshot.snapshot as SnapshotData;
    const currentData = currentSnapshot.snapshot as SnapshotData;

    const changes = this.calculateChanges(currentData, snapshotData);

    return {
      snapshot: snapshotData,
      currentState: currentData,
      changes,
    };
  }

  /**
   * Cleanup old snapshots
   */
  async cleanup(): Promise<number> {
    return this.store.cleanupOldSnapshots();
  }
}

/**
 * Create snapshot engine
 */
export function createSnapshotEngine(supabase: SupabaseClient): SnapshotEngine {
  return new SnapshotEngine(supabase);
}
