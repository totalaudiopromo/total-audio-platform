/**
 * Replay Store
 *
 * Database operations for mission replays
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface MissionReplay {
  id: string;
  user_id: string;
  mission_id: string;
  original_run_id: string | null;
  replay_run_id: string | null;
  context_snapshot: Record<string, unknown>;
  decisions: Record<string, unknown>;
  created_at: string;
}

export class ReplayStore {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Create replay record
   */
  async createReplay(params: {
    userId: string;
    missionId: string;
    originalRunId: string;
    contextSnapshot: Record<string, unknown>;
    decisions: Record<string, unknown>;
  }): Promise<MissionReplay> {
    const { data, error } = await this.supabase
      .from('pr_mission_replays')
      .insert({
        user_id: params.userId,
        mission_id: params.missionId,
        original_run_id: params.originalRunId,
        context_snapshot: params.contextSnapshot,
        decisions: params.decisions,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create replay: ${error.message}`);
    }

    return data as MissionReplay;
  }

  /**
   * Update replay with run ID
   */
  async updateReplayRunId(replayId: string, runId: string): Promise<void> {
    const { error } = await this.supabase
      .from('pr_mission_replays')
      .update({ replay_run_id: runId })
      .eq('id', replayId);

    if (error) {
      throw new Error(`Failed to update replay: ${error.message}`);
    }
  }

  /**
   * Get replay by ID
   */
  async getReplay(replayId: string): Promise<MissionReplay | null> {
    const { data, error } = await this.supabase
      .from('pr_mission_replays')
      .select('*')
      .eq('id', replayId)
      .single();

    if (error) return null;
    return data as MissionReplay;
  }

  /**
   * List replays for mission
   */
  async listReplaysForMission(missionId: string): Promise<MissionReplay[]> {
    const { data, error } = await this.supabase
      .from('pr_mission_replays')
      .select('*')
      .eq('mission_id', missionId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data as MissionReplay[]) || [];
  }

  /**
   * Delete replay
   */
  async deleteReplay(replayId: string): Promise<void> {
    await this.supabase.from('pr_mission_replays').delete().eq('id', replayId);
  }
}

/**
 * Create replay store
 */
export function createReplayStore(supabase: SupabaseClient): ReplayStore {
  return new ReplayStore(supabase);
}
