/**
 * Coordinator Agent
 *
 * Purpose: Orchestrate the entire autopilot system.
 * Manages mission lifecycle, coordinates other agents, and handles high-level flow.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { MissionStore } from '../core/missionStore';
import { RunEngine } from '../core/runEngine';
import { TaskRouter } from '../core/taskRouter';
import { buildAgentContext } from '../core/contextBuilder';
import { emitGlobalEvent, createEvent } from '../core/events';

export class CoordinatorAgent {
  private store: MissionStore;
  private engine: RunEngine;
  private router: TaskRouter;

  constructor(private supabase: SupabaseClient) {
    this.store = new MissionStore(supabase);
    this.engine = new RunEngine(supabase);
    this.router = new TaskRouter(supabase);
  }

  /**
   * Kickoff a mission - initialize and start execution
   */
  async kickoffMission(missionId: string): Promise<void> {
    const mission = await this.store.getMission(missionId);

    // Validate mission is in correct state
    if (mission.status !== 'draft') {
      throw new Error(`Mission must be in draft status to kickoff (current: ${mission.status})`);
    }

    // Update mission to active
    await this.store.updateMissionStatus(missionId, 'active');

    // Emit event
    await emitGlobalEvent(
      createEvent('mission_started', missionId, {
        userId: mission.user_id,
        mode: mission.mode,
      })
    );

    // Create initial strategist task to plan the campaign
    await this.store.createTask({
      missionId,
      agentRole: 'strategist',
      type: 'plan_campaign',
      input: {
        mission_config: mission.config,
        user_id: mission.user_id,
        workspace_id: mission.workspace_id,
      },
      priority: 100, // Highest priority
    });

    // Start initial run
    await this.engine.startRun(missionId, 'manual', mission.user_id);
  }

  /**
   * Execute one iteration/tick of the mission
   */
  async tick(missionId: string): Promise<{
    tasks_processed: number;
    status: string;
  }> {
    const mission = await this.store.getMission(missionId);

    if (mission.status !== 'active') {
      return {
        tasks_processed: 0,
        status: mission.status,
      };
    }

    // Start a scheduled run
    const run = await this.engine.startRun(missionId, 'schedule');

    return {
      tasks_processed: run.summary?.tasks_executed || 0,
      status: run.status,
    };
  }

  /**
   * Resume mission from paused state
   */
  async resumeFromPause(missionId: string): Promise<void> {
    const mission = await this.store.getMission(missionId);

    if (mission.status !== 'paused') {
      throw new Error(`Mission must be paused to resume (current: ${mission.status})`);
    }

    // Update to active
    await this.store.updateMissionStatus(missionId, 'active');

    // Get the last run
    const runs = await this.store.listRunsForMission(missionId, 1);
    if (runs.length > 0 && runs[0].status === 'partial') {
      // Resume the partial run
      await this.engine.resumeRun(runs[0].id);
    } else {
      // Start a new run
      await this.engine.startRun(missionId, 'manual');
    }
  }

  /**
   * Pause a mission
   */
  async pauseMission(missionId: string, reason?: string): Promise<void> {
    const mission = await this.store.getMission(missionId);

    if (mission.status !== 'active') {
      throw new Error(`Can only pause active missions (current: ${mission.status})`);
    }

    await this.store.updateMissionStatus(missionId, 'paused');

    await emitGlobalEvent(
      createEvent('mission_paused', missionId, { reason })
    );
  }

  /**
   * Complete a mission
   */
  async completeMission(missionId: string): Promise<void> {
    const mission = await this.store.getMission(missionId);

    // Check if all tasks are complete
    const pendingCount = await this.store.getPendingTaskCount(missionId);

    if (pendingCount > 0) {
      throw new Error(`Cannot complete mission with ${pendingCount} pending tasks`);
    }

    await this.store.updateMissionStatus(missionId, 'completed');

    // Get final metrics
    const runs = await this.store.listRunsForMission(missionId);
    const summary = {
      total_runs: runs.length,
      successful_runs: runs.filter((r) => r.status === 'succeeded').length,
    };

    await emitGlobalEvent(
      createEvent('mission_completed', missionId, { summary })
    );
  }

  /**
   * Get mission status summary
   */
  async getMissionStatus(missionId: string): Promise<{
    mission: any;
    pending_tasks: number;
    completed_tasks: number;
    total_runs: number;
    last_run: any;
  }> {
    const mission = await this.store.getMission(missionId);
    const allTasks = await this.store.listTasksForMission(missionId);
    const pending_tasks = allTasks.filter((t) => t.status === 'pending').length;
    const completed_tasks = allTasks.filter((t) => t.status === 'completed').length;
    const runs = await this.store.listRunsForMission(missionId, 1);

    return {
      mission,
      pending_tasks,
      completed_tasks,
      total_runs: runs.length,
      last_run: runs[0] || null,
    };
  }

  /**
   * Approve a waiting task
   */
  async approveTask(taskId: string, approvedBy: string): Promise<void> {
    const task = await this.store.getTask(taskId);

    if (task.status !== 'waiting_approval') {
      throw new Error(`Task must be waiting approval (current: ${task.status})`);
    }

    // Update to pending so it will be picked up in next run
    await this.store.updateTaskStatus(taskId, 'pending');

    await emitGlobalEvent(
      createEvent('approval_granted', task.mission_id, {
        taskId,
        approvedBy,
      })
    );

    // Resume mission if it was paused
    const mission = await this.store.getMission(task.mission_id);
    if (mission.status === 'paused') {
      await this.resumeFromPause(task.mission_id);
    }
  }

  /**
   * Reject a waiting task
   */
  async rejectTask(taskId: string, rejectedBy: string, reason?: string): Promise<void> {
    const task = await this.store.getTask(taskId);

    if (task.status !== 'waiting_approval') {
      throw new Error(`Task must be waiting approval (current: ${task.status})`);
    }

    // Mark as failed
    await this.store.updateTaskStatus(taskId, 'failed', {
      rejection_reason: reason,
      rejected_by: rejectedBy,
    });

    await emitGlobalEvent(
      createEvent('approval_rejected', task.mission_id, {
        taskId,
        rejectedBy,
        reason,
      })
    );
  }
}
