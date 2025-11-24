/**
 * Replay Engine
 *
 * Re-run missions with identical context and decisions
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AutopilotMission, AutopilotRun, AutopilotTask, AgentContext } from '../types';
import { createReplayStore, type MissionReplay } from './replayStore';

export interface ReplayContext {
  originalContext: Record<string, unknown>;
  frozenDecisions: Map<string, unknown>;
  deterministicMode: boolean;
}

export interface ReplayResult {
  replayId: string;
  runId: string;
  deviations: Array<{
    taskId: string;
    original: unknown;
    replay: unknown;
    reason: string;
  }>;
  matchPercentage: number;
}

export class ReplayEngine {
  private store: ReturnType<typeof createReplayStore>;

  constructor(private supabase: SupabaseClient) {
    this.store = createReplayStore(supabase);
  }

  /**
   * Capture replay context from a run
   */
  async captureReplayContext(runId: string): Promise<{
    contextSnapshot: Record<string, unknown>;
    decisions: Record<string, unknown>;
  }> {
    // Get run details
    const { data: run } = await this.supabase
      .from('autopilot_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (!run) {
      throw new Error('Run not found');
    }

    // Get all tasks from this run
    const { data: tasks } = await this.supabase
      .from('autopilot_tasks')
      .select('*')
      .eq('mission_id', run.mission_id)
      .order('sequence_order', { ascending: true });

    // Get mission config
    const { data: mission } = await this.supabase
      .from('autopilot_missions')
      .select('*')
      .eq('id', run.mission_id)
      .single();

    // Capture context
    const contextSnapshot = {
      mission: mission,
      runConfig: run.config,
      initialTasks: tasks?.filter((t) => t.status === 'pending') || [],
      timestamp: run.created_at,
    };

    // Capture decisions from task outputs
    const decisions: Record<string, unknown> = {};
    tasks?.forEach((task) => {
      if (task.output) {
        decisions[task.id] = {
          output: task.output,
          status: task.status,
          sequence: task.sequence_order,
        };
      }
    });

    return { contextSnapshot, decisions };
  }

  /**
   * Create replay from original run
   */
  async createReplay(params: {
    userId: string;
    missionId: string;
    originalRunId: string;
  }): Promise<MissionReplay> {
    // Capture context from original run
    const { contextSnapshot, decisions } = await this.captureReplayContext(
      params.originalRunId
    );

    // Create replay record
    return this.store.createReplay({
      userId: params.userId,
      missionId: params.missionId,
      originalRunId: params.originalRunId,
      contextSnapshot,
      decisions,
    });
  }

  /**
   * Execute replay
   */
  async executeReplay(replayId: string): Promise<ReplayResult> {
    const replay = await this.store.getReplay(replayId);

    if (!replay) {
      throw new Error('Replay not found');
    }

    // TODO: Execute run with frozen context
    // This would integrate with RunEngine to:
    // 1. Use captured context
    // 2. Force deterministic execution
    // 3. Compare outputs with original decisions
    // 4. Track deviations

    // For now, return placeholder
    const runId = 'replay_run_' + Date.now();

    await this.store.updateReplayRunId(replayId, runId);

    return {
      replayId,
      runId,
      deviations: [],
      matchPercentage: 100,
    };
  }

  /**
   * Compare replay results with original
   */
  async compareReplayResults(replayId: string): Promise<{
    originalRun: AutopilotRun;
    replayRun: AutopilotRun;
    taskComparisons: Array<{
      taskId: string;
      originalOutput: unknown;
      replayOutput: unknown;
      matches: boolean;
    }>;
    overallMatch: number;
  }> {
    const replay = await this.store.getReplay(replayId);

    if (!replay || !replay.original_run_id || !replay.replay_run_id) {
      throw new Error('Replay incomplete');
    }

    // Get both runs
    const { data: originalRun } = await this.supabase
      .from('autopilot_runs')
      .select('*')
      .eq('id', replay.original_run_id)
      .single();

    const { data: replayRun } = await this.supabase
      .from('autopilot_runs')
      .select('*')
      .eq('id', replay.replay_run_id)
      .single();

    if (!originalRun || !replayRun) {
      throw new Error('Run data not found');
    }

    // Get tasks from both runs
    const { data: originalTasks } = await this.supabase
      .from('autopilot_tasks')
      .select('*')
      .eq('mission_id', replay.mission_id)
      .order('sequence_order');

    const taskComparisons =
      originalTasks?.map((task) => {
        const originalDecision = (replay.decisions as Record<string, any>)[task.id];
        const matches = JSON.stringify(task.output) === JSON.stringify(originalDecision?.output);

        return {
          taskId: task.id,
          originalOutput: originalDecision?.output,
          replayOutput: task.output,
          matches,
        };
      }) || [];

    const matchingTasks = taskComparisons.filter((c) => c.matches).length;
    const overallMatch =
      taskComparisons.length > 0 ? matchingTasks / taskComparisons.length : 0;

    return {
      originalRun: originalRun as AutopilotRun,
      replayRun: replayRun as AutopilotRun,
      taskComparisons,
      overallMatch,
    };
  }

  /**
   * Get all replays for mission
   */
  async listReplays(missionId: string): Promise<MissionReplay[]> {
    return this.store.listReplaysForMission(missionId);
  }
}

/**
 * Create replay engine
 */
export function createReplayEngine(supabase: SupabaseClient): ReplayEngine {
  return new ReplayEngine(supabase);
}
