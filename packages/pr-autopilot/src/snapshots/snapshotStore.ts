/**
 * Snapshot Store
 *
 * Database operations for mission snapshots
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface MissionSnapshot {
  id: string;
  mission_id: string;
  run_id: string | null;
  snapshot: Record<string, unknown>;
  created_at: string;
}

export class SnapshotStore {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Create snapshot
   */
  async createSnapshot(params: {
    missionId: string;
    runId?: string;
    snapshot: Record<string, unknown>;
  }): Promise<MissionSnapshot> {
    const { data, error } = await this.supabase
      .from('pr_mission_snapshots')
      .insert({
        mission_id: params.missionId,
        run_id: params.runId || null,
        snapshot: params.snapshot,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create snapshot: ${error.message}`);
    }

    return data as MissionSnapshot;
  }

  /**
   * Get snapshot by ID
   */
  async getSnapshot(snapshotId: string): Promise<MissionSnapshot | null> {
    const { data, error } = await this.supabase
      .from('pr_mission_snapshots')
      .select('*')
      .eq('id', snapshotId)
      .single();

    if (error) return null;
    return data as MissionSnapshot;
  }

  /**
   * List snapshots for mission
   */
  async listSnapshotsForMission(missionId: string): Promise<MissionSnapshot[]> {
    const { data, error } = await this.supabase
      .from('pr_mission_snapshots')
      .select('*')
      .eq('mission_id', missionId)
      .order('created_at', { ascending: false })
      .limit(20); // Keep last 20

    if (error) return [];
    return (data as MissionSnapshot[]) || [];
  }

  /**
   * Get snapshot diff
   */
  async getSnapshotDiff(
    snapshotIdOld: string,
    snapshotIdNew: string
  ): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase.rpc('get_snapshot_diff', {
      p_snapshot_id_old: snapshotIdOld,
      p_snapshot_id_new: snapshotIdNew,
    });

    if (error) return null;
    return data as Record<string, unknown>;
  }

  /**
   * Delete snapshot
   */
  async deleteSnapshot(snapshotId: string): Promise<void> {
    await this.supabase.from('pr_mission_snapshots').delete().eq('id', snapshotId);
  }

  /**
   * Clean up old snapshots
   */
  async cleanupOldSnapshots(): Promise<number> {
    const { data, error } = await this.supabase.rpc('cleanup_old_snapshots');
    if (error) return 0;
    return (data as number) || 0;
  }
}

/**
 * Create snapshot store
 */
export function createSnapshotStore(supabase: SupabaseClient): SnapshotStore {
  return new SnapshotStore(supabase);
}
