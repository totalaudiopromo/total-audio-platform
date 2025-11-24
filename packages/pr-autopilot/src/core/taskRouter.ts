/**
 * Task Router
 *
 * Core routing logic for task management and agent coordination.
 * Handles task selection, completion routing, and dependency management.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AutopilotTask,
  AgentRole,
  TaskDefinition,
  MissionMode,
} from '../types';
import { MissionStore } from './missionStore';
import { createPolicyEngine } from './policyEngine';

export class TaskRouter {
  private store: MissionStore;

  constructor(private supabase: SupabaseClient) {
    this.store = new MissionStore(supabase);
  }

  /**
   * Get next task for a specific agent role
   */
  async getNextTaskForAgent(
    missionId: string,
    agentRole: AgentRole,
    options?: {
      skipBlocked?: boolean;
    }
  ): Promise<AutopilotTask | null> {
    // Get all pending tasks for this agent
    const tasks = await this.store.listTasksForMission(missionId, {
      agentRole,
      status: 'pending',
    });

    if (tasks.length === 0) {
      return null;
    }

    // Filter out blocked tasks if requested
    const eligibleTasks = options?.skipBlocked
      ? tasks.filter((t) => !t.blocking_reason)
      : tasks;

    if (eligibleTasks.length === 0) {
      return null;
    }

    // Return highest priority task
    return eligibleTasks[0];
  }

  /**
   * Route task completion - create follow-up tasks based on output
   */
  async routeTaskCompletion(
    task: AutopilotTask,
    output: Record<string, unknown>
  ): Promise<AutopilotTask[]> {
    const createdTasks: AutopilotTask[] = [];

    // Get mission to check mode
    const mission = await this.store.getMission(task.mission_id);

    // Route based on agent role and task type
    const downstreamTasks = this.getDownstreamTasks(task, output, mission.mode);

    // Create downstream tasks
    for (const taskDef of downstreamTasks) {
      const newTask = await this.store.createTask({
        missionId: task.mission_id,
        agentRole: taskDef.agent_role,
        type: taskDef.type,
        input: taskDef.input,
        priority: taskDef.priority,
        parentTaskId: task.id,
      });
      createdTasks.push(newTask);
    }

    return createdTasks;
  }

  /**
   * Determine downstream tasks based on completed task
   */
  private getDownstreamTasks(
    task: AutopilotTask,
    output: Record<string, unknown>,
    mode: MissionMode
  ): TaskDefinition[] {
    const tasks: TaskDefinition[] = [];

    switch (task.agent_role) {
      case 'strategist':
        if (task.type === 'plan_campaign') {
          // Strategy complete → generate pitches, select contacts, create schedule
          tasks.push({
            agent_role: 'pitch',
            type: 'generate_pitch_set',
            priority: 10,
            input: {
              strategy: output.strategy || {},
              target_styles: output.pitch_styles || [],
            },
          });

          tasks.push({
            agent_role: 'contact',
            type: 'build_contact_pool',
            priority: 10,
            input: {
              targeting: output.contact_targeting || {},
              criteria: output.segment_criteria || {},
            },
          });

          tasks.push({
            agent_role: 'scheduler',
            type: 'propose_send_schedule',
            priority: 5,
            input: {
              timeline: output.timeline || {},
              phases: output.phases || [],
            },
          });
        }
        break;

      case 'pitch':
        if (task.type === 'generate_pitch_set') {
          // Pitches ready → can proceed with scheduling (if contacts ready)
          // This task doesn't create new tasks, but unblocks scheduler
        }
        break;

      case 'contact':
        if (task.type === 'build_contact_pool') {
          // Contacts selected → can proceed with scheduling
          // Create analyst task to validate contact quality
          tasks.push({
            agent_role: 'analyst',
            type: 'analyze_contact_pool',
            priority: 7,
            input: {
              contacts: output.primary_contacts || [],
              segment_ids: output.segment_ids || [],
            },
          });
        }
        break;

      case 'scheduler':
        if (task.type === 'propose_send_schedule') {
          // Schedule proposed
          if (mode === 'suggest') {
            // In suggest mode, wait for approval
            // No downstream tasks
          } else if (mode === 'semi_auto') {
            // In semi-auto, schedule needs approval before execution
            // No downstream tasks yet
          } else {
            // In full-auto, can create execution tasks
            tasks.push({
              agent_role: 'scheduler',
              type: 'execute_send_schedule',
              priority: 15,
              input: {
                schedule: output.scheduled_sends || [],
              },
            });
          }
        } else if (task.type === 'execute_send_schedule') {
          // Sends executed → create follow-up and analyst tasks
          tasks.push({
            agent_role: 'followup',
            type: 'plan_followups',
            priority: 5,
            input: {
              sent_emails: output.executed_sends || [],
            },
          });

          tasks.push({
            agent_role: 'analyst',
            type: 'analyze_initial_sends',
            priority: 3,
            input: {
              campaign_id: output.campaign_id,
              send_count: output.executed_sends?.length || 0,
            },
          });
        }
        break;

      case 'followup':
        if (task.type === 'plan_followups') {
          // Follow-ups planned → can execute in appropriate mode
          if (mode === 'full_auto') {
            tasks.push({
              agent_role: 'followup',
              type: 'execute_followups',
              priority: 5,
              input: {
                followup_tasks: output.followup_tasks || [],
              },
            });
          }
        } else if (task.type === 'execute_followups') {
          // Follow-ups sent → analyze results
          tasks.push({
            agent_role: 'analyst',
            type: 'analyze_followup_impact',
            priority: 3,
            input: {
              followup_results: output.results || [],
            },
          });
        }
        break;

      case 'analyst':
        if (task.type === 'analyze_campaign_performance') {
          // Analysis complete → archive learnings
          tasks.push({
            agent_role: 'archivist',
            type: 'archive_campaign_learnings',
            priority: 2,
            input: {
              insights: output.insights || [],
              recommendations: output.recommendations || [],
              metrics: output.performance_summary || {},
            },
          });
        }
        break;

      case 'simulator':
        // Simulations don't create downstream tasks
        break;

      case 'archivist':
        // Archiving is terminal - no downstream tasks
        break;

      case 'coordinator':
        // Coordinator orchestrates but doesn't create direct downstream tasks
        break;
    }

    return tasks;
  }

  /**
   * Check if task dependencies are satisfied
   */
  async areDependenciesSatisfied(taskId: string): Promise<boolean> {
    const task = await this.store.getTask(taskId);

    // If no parent task, dependencies are satisfied
    if (!task.parent_task_id) {
      return true;
    }

    // Check parent task status
    const parentTask = await this.store.getTask(task.parent_task_id);
    return parentTask.status === 'completed';
  }

  /**
   * Get all tasks in dependency chain
   */
  async getTaskChain(taskId: string): Promise<AutopilotTask[]> {
    const chain: AutopilotTask[] = [];
    let currentTask = await this.store.getTask(taskId);

    while (currentTask) {
      chain.unshift(currentTask);

      if (!currentTask.parent_task_id) {
        break;
      }

      currentTask = await this.store.getTask(currentTask.parent_task_id);
    }

    return chain;
  }

  /**
   * Get child tasks
   */
  async getChildTasks(parentTaskId: string): Promise<AutopilotTask[]> {
    const { data } = await this.supabase
      .from('autopilot_tasks')
      .select('*')
      .eq('parent_task_id', parentTaskId)
      .order('priority', { ascending: false });

    return (data || []) as AutopilotTask[];
  }

  /**
   * Determine if a task requires approval based on mode and type
   */
  async requiresApproval(
    task: AutopilotTask,
    mode: MissionMode
  ): Promise<boolean> {
    if (mode === 'suggest') {
      // In suggest mode, all external actions require approval
      return this.isExternalAction(task.type);
    }

    if (mode === 'semi_auto') {
      // In semi-auto, only critical actions require approval
      return this.isCriticalAction(task.type);
    }

    // In full_auto, no approval required (but still subject to policy limits)
    return false;
  }

  /**
   * Check if task type is an external action
   */
  private isExternalAction(taskType: string): boolean {
    const externalActions = [
      'execute_send_schedule',
      'execute_followups',
      'create_campaign',
      'modify_segment',
    ];
    return externalActions.includes(taskType);
  }

  /**
   * Check if task type is a critical action
   */
  private isCriticalAction(taskType: string): boolean {
    const criticalActions = [
      'execute_send_schedule',
      'execute_followups',
      'create_campaign',
    ];
    return criticalActions.includes(taskType);
  }
}
