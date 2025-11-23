/**
 * Run Engine
 *
 * Orchestration engine for the PR Autopilot system.
 * Manages execution loops, agent invocation, and mode-based behavior.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AutopilotRun,
  AutopilotTask,
  AgentRole,
  RunSummary,
  AgentContext,
  ActionType,
} from '../types';
import { MissionStore } from './missionStore';
import { TaskRouter } from './taskRouter';
import { createPolicyEngine } from './policyEngine';
import { buildAgentContext } from './contextBuilder';
import {
  AgentExecutionError,
  ApprovalRequiredError,
  PolicyViolationError,
} from '../utils/errors';
import { emitGlobalEvent, createEvent } from './events';
import { calculateConfidence } from '../confidence/confidenceEngine';
import { createTelemetryEngine, type TelemetryEngine } from '../telemetry/telemetryEngine';
import { shouldRetry, type RetryConfig } from '../retry/retryEngine';

export interface RunOptions {
  maxIterations?: number;
  agentTimeout?: number;
  stopOnApprovalRequired?: boolean;
}

export class RunEngine {
  private store: MissionStore;
  private router: TaskRouter;
  private telemetry: TelemetryEngine;

  constructor(private supabase: SupabaseClient) {
    this.store = new MissionStore(supabase);
    this.router = new TaskRouter(supabase);
    this.telemetry = createTelemetryEngine(supabase);
  }

  /**
   * Start a new run for a mission
   */
  async startRun(
    missionId: string,
    triggerType: 'manual' | 'schedule' | 'event',
    triggeredBy?: string,
    options?: RunOptions
  ): Promise<AutopilotRun> {
    // Create run record
    const run = await this.store.createRun({
      missionId,
      triggeredBy,
      triggerType,
    });

    // Emit event
    await emitGlobalEvent(
      createEvent('run_started', missionId, {
        runId: run.id,
        triggerType,
      })
    );

    // Execute the run
    try {
      const summary = await this.executeRun(run, options);

      // Update run with success
      const completedRun = await this.store.updateRunStatus(
        run.id,
        'succeeded',
        summary as Record<string, unknown>
      );

      await emitGlobalEvent(
        createEvent('run_completed', missionId, {
          runId: run.id,
          status: 'succeeded',
          summary,
        })
      );

      return completedRun;
    } catch (error) {
      // Handle different error types
      if (error instanceof ApprovalRequiredError) {
        // Run paused waiting for approval
        const summary: RunSummary = {
          tasks_executed: 0,
          tasks_succeeded: 0,
          tasks_failed: 0,
          tasks_blocked: 1,
          agents_invoked: [],
          actions_taken: [],
          approvals_required: 1,
          errors: [error.message],
        };

        const pausedRun = await this.store.updateRunStatus(
          run.id,
          'partial',
          summary as Record<string, unknown>
        );

        return pausedRun;
      }

      // Other errors mark run as failed
      const summary: RunSummary = {
        tasks_executed: 0,
        tasks_succeeded: 0,
        tasks_failed: 1,
        tasks_blocked: 0,
        agents_invoked: [],
        actions_taken: [],
        approvals_required: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };

      const failedRun = await this.store.updateRunStatus(
        run.id,
        'failed',
        summary as Record<string, unknown>
      );

      return failedRun;
    }
  }

  /**
   * Execute run - main orchestration loop
   */
  private async executeRun(
    run: AutopilotRun,
    options?: RunOptions
  ): Promise<RunSummary> {
    const maxIterations = options?.maxIterations || 100;
    const stopOnApproval = options?.stopOnApprovalRequired ?? true;

    let iteration = 0;
    const summary: RunSummary = {
      tasks_executed: 0,
      tasks_succeeded: 0,
      tasks_failed: 0,
      tasks_blocked: 0,
      agents_invoked: [],
      actions_taken: [],
      approvals_required: 0,
      errors: [],
    };

    // Get mission and context
    const mission = await this.store.getMission(run.mission_id);
    const context = await buildAgentContext(run.mission_id, this.supabase);

    // Main execution loop
    while (iteration < maxIterations) {
      iteration++;

      // Get next pending task (any agent role)
      const task = await this.store.getNextPendingTask(run.mission_id);

      if (!task) {
        // No more pending tasks
        break;
      }

      // Check if task requires approval
      const requiresApproval = await this.router.requiresApproval(
        task,
        mission.mode
      );

      if (requiresApproval) {
        // Mark task as waiting approval
        await this.store.updateTaskStatus(task.id, 'waiting_approval');
        summary.approvals_required++;

        await emitGlobalEvent(
          createEvent('approval_requested', run.mission_id, {
            taskId: task.id,
            actionType: task.type as ActionType,
            details: task.input,
          })
        );

        if (stopOnApproval) {
          throw new ApprovalRequiredError(task.type, task.id);
        }

        continue;
      }

      // Execute task
      try {
        await this.executeTask(task, context);
        summary.tasks_executed++;
        summary.tasks_succeeded++;

        if (!summary.agents_invoked.includes(task.agent_role)) {
          summary.agents_invoked.push(task.agent_role);
        }
      } catch (error) {
        summary.tasks_failed++;
        if (error instanceof Error) {
          summary.errors?.push(`${task.agent_role}:${task.type} - ${error.message}`);
        }
      }
    }

    return summary;
  }

  /**
   * Execute a single task
   */
  private async executeTask(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<void> {
    const taskStartTime = Date.now();

    // Step 1: Calculate confidence score BEFORE execution
    const confidence = calculateConfidence({
      agentRole: task.agent_role,
      task,
      mission: context.mission,
      fusionContext: context.fusionContext,
      availableData: task.input,
    });

    // Log confidence score to telemetry
    await this.telemetry.logConfidence(
      context.mission.id,
      task.id,
      task.agent_role,
      confidence.score,
      confidence.breakdown
    );

    // Log confidence score to logger
    context.logger.info(
      `Confidence assessment for ${task.agent_role}:${task.task_type}`,
      {
        score: confidence.score,
        label: confidence.score >= 0.75 ? 'High' : confidence.score >= 0.5 ? 'Moderate' : 'Low',
        shouldEscalate: confidence.shouldEscalate,
        warnings: confidence.warnings.length,
        blockers: confidence.blockers.length,
      }
    );

    // Step 2: Check if confidence is too low - auto-escalate to approval
    if (confidence.shouldEscalate || confidence.score < 0.5) {
      context.logger.warn(
        `Low confidence (${confidence.score.toFixed(2)}) - escalating to human approval`,
        {
          rationale: confidence.rationale,
          warnings: confidence.warnings,
          blockers: confidence.blockers,
        }
      );

      // Update task metadata with confidence details
      await this.store.updateTask(task.id, {
        metadata: {
          ...((task.metadata as Record<string, unknown>) || {}),
          confidence: {
            score: confidence.score,
            rationale: confidence.rationale,
            warnings: confidence.warnings,
            blockers: confidence.blockers,
            timestamp: new Date().toISOString(),
          },
        },
      });

      // Mark task as waiting approval and throw approval required error
      await this.store.updateTaskStatus(task.id, 'waiting_approval');

      await emitGlobalEvent(
        createEvent('approval_requested', context.mission.id, {
          taskId: task.id,
          actionType: task.type as ActionType,
          reason: 'low_confidence',
          confidence: confidence.score,
          details: {
            rationale: confidence.rationale,
            warnings: confidence.warnings,
            blockers: confidence.blockers,
          },
        })
      );

      throw new ApprovalRequiredError(task.type, task.id);
    }

    // Step 3: Confidence is acceptable - proceed with execution
    // Mark task as in progress
    await this.store.updateTaskStatus(task.id, 'in_progress');

    await emitGlobalEvent(
      createEvent('task_started', context.mission.id, {
        taskId: task.id,
        agentRole: task.agent_role,
        confidence: confidence.score,
      })
    );

    try {
      // Import and execute appropriate agent
      // NOTE: This is a simplified version - actual implementation would
      // dynamically import agent classes
      const output = await this.invokeAgent(
        task.agent_role,
        task.type,
        task.input,
        context
      );

      // Calculate task duration
      const taskDuration = Date.now() - taskStartTime;

      // Log latency to telemetry
      await this.telemetry.logLatency(
        context.mission.id,
        task.id,
        task.agent_role,
        taskDuration
      );

      // Log success to telemetry
      await this.telemetry.logTaskResult(
        context.mission.id,
        task.id,
        task.agent_role,
        true
      );

      // Mark task as completed with confidence metadata
      await this.store.updateTaskStatus(task.id, 'completed', {
        ...output,
        confidence: {
          score: confidence.score,
          breakdown: confidence.breakdown,
        },
        duration_ms: taskDuration,
      });

      await emitGlobalEvent(
        createEvent('task_completed', context.mission.id, {
          taskId: task.id,
          agentRole: task.agent_role,
          output,
          durationMs: taskDuration,
        })
      );

      // Route completion - create downstream tasks
      await this.router.routeTaskCompletion(task, output);
    } catch (error) {
      // Calculate task duration (even for failures)
      const taskDuration = Date.now() - taskStartTime;

      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check if task should be retried
      const retryDecision = shouldRetry(task, error);

      // Log retry attempt to telemetry if applicable
      if (retryDecision.shouldRetry && retryDecision.attemptNumber) {
        await this.telemetry.logRetry(
          context.mission.id,
          task.id,
          task.agent_role,
          retryDecision.attemptNumber,
          {
            reason: retryDecision.reason,
          }
        );

        context.logger.info(retryDecision.reason!, {
          taskId: task.id,
          attemptNumber: retryDecision.attemptNumber,
          backoffMs: retryDecision.backoffMs,
        });

        // Update task with retry information (but keep it in failed state)
        // The scheduler/orchestrator will pick it up for retry after backoff
        await this.store.updateTask(task.id, {
          retry_count: retryDecision.attemptNumber,
          metadata: {
            ...((task.metadata as Record<string, unknown>) || {}),
            lastRetry: {
              attemptNumber: retryDecision.attemptNumber,
              backoffMs: retryDecision.backoffMs,
              scheduledRetryAt: new Date(
                Date.now() + (retryDecision.backoffMs || 0)
              ).toISOString(),
              error: errorMessage,
            },
          },
        });
      }

      // Log failure to telemetry
      await this.telemetry.logTaskResult(
        context.mission.id,
        task.id,
        task.agent_role,
        false,
        {
          error: errorMessage,
        }
      );

      // Log error to telemetry
      await this.telemetry.logError(
        context.mission.id,
        errorMessage,
        {
          taskId: task.id,
          agentRole: task.agent_role,
          severity: retryDecision.shouldRetry ? 'medium' : 'high',
          metadata: {
            retryable: retryDecision.shouldRetry,
            retryAttempt: task.retry_count || 0,
          },
        }
      );

      // Mark task as failed (or pending for retry)
      const taskStatus = retryDecision.shouldRetry ? 'pending' : 'failed';
      await this.store.updateTaskStatus(task.id, taskStatus, {
        error: errorMessage,
        duration_ms: taskDuration,
        will_retry: retryDecision.shouldRetry,
        retry_count: task.retry_count || 0,
      });

      await emitGlobalEvent(
        createEvent(retryDecision.shouldRetry ? 'task_retry_scheduled' : 'task_failed', context.mission.id, {
          taskId: task.id,
          agentRole: task.agent_role,
          error: errorMessage,
          durationMs: taskDuration,
          willRetry: retryDecision.shouldRetry,
          retryAttempt: task.retry_count || 0,
          backoffMs: retryDecision.backoffMs,
        })
      );

      // If not retrying, throw error to stop execution
      if (!retryDecision.shouldRetry) {
        throw new AgentExecutionError(
          task.agent_role,
          error instanceof Error ? error : new Error(String(error))
        );
      }

      // If retrying, don't throw - the task will be picked up again after backoff
      context.logger.info(
        `Task ${task.id} will be retried after ${retryDecision.backoffMs}ms backoff`
      );
    }
  }

  /**
   * Invoke an agent for a specific task
   *
   * This is a placeholder that agents will fill in.
   * In the full implementation, this would dynamically import
   * the appropriate agent class and call its execute method.
   */
  private async invokeAgent(
    agentRole: AgentRole,
    taskType: string,
    input: Record<string, unknown>,
    context: AgentContext
  ): Promise<Record<string, unknown>> {
    context.logger.info(`Invoking ${agentRole} agent for task type: ${taskType}`, {
      taskType,
      inputKeys: Object.keys(input),
    });

    // TODO: Dynamic agent import and execution
    // Example:
    // const agent = await import(`../agents/${agentRole}Agent`);
    // const instance = new agent[`${capitalize(agentRole)}Agent`]();
    // return await instance.execute({ type: taskType, input }, context);

    // Placeholder - return empty output
    return {
      placeholder: true,
      agentRole,
      taskType,
      message: 'Agent execution not yet implemented',
    };
  }

  /**
   * Process tasks for a specific agent role
   */
  async processTasksForAgent(
    missionId: string,
    agentRole: AgentRole,
    options?: {
      maxTasks?: number;
    }
  ): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
  }> {
    const maxTasks = options?.maxTasks || 10;
    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    const context = await buildAgentContext(missionId, this.supabase);

    while (processed < maxTasks) {
      const task = await this.router.getNextTaskForAgent(missionId, agentRole);

      if (!task) {
        break;
      }

      try {
        await this.executeTask(task, context);
        succeeded++;
      } catch (error) {
        failed++;
      }

      processed++;
    }

    return { processed, succeeded, failed };
  }

  /**
   * Resume a paused run (e.g., after approval granted)
   */
  async resumeRun(runId: string, options?: RunOptions): Promise<AutopilotRun> {
    const { data: run } = await this.supabase
      .from('autopilot_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (!run) {
      throw new Error(`Run not found: ${runId}`);
    }

    // Continue execution
    try {
      const summary = await this.executeRun(run as AutopilotRun, options);
      return await this.store.updateRunStatus(
        runId,
        'succeeded',
        summary as Record<string, unknown>
      );
    } catch (error) {
      const summary: RunSummary = {
        tasks_executed: 0,
        tasks_succeeded: 0,
        tasks_failed: 1,
        tasks_blocked: 0,
        agents_invoked: [],
        actions_taken: [],
        approvals_required: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };

      return await this.store.updateRunStatus(
        runId,
        'failed',
        summary as Record<string, unknown>
      );
    }
  }
}
