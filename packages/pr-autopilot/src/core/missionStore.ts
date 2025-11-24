/**
 * Mission Store
 *
 * Database interaction layer for autopilot missions, tasks, runs, and logs.
 * Uses existing Supabase patterns from the TAP monorepo.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AutopilotMission,
  AutopilotTask,
  AutopilotRun,
  AutopilotLog,
  AutopilotPolicy,
  AutopilotSetting,
  MissionMode,
  MissionStatus,
  TaskStatus,
  RunStatus,
  AgentRole,
  LogLevel,
  MissionConfig,
  PolicyConfig,
} from '../types';
import {
  MissionNotFoundError,
  TaskNotFoundError,
} from '../utils/errors';

export class MissionStore {
  constructor(private supabase: SupabaseClient) {}

  // ============================================
  // Missions
  // ============================================

  async getMission(id: string): Promise<AutopilotMission> {
    const { data, error } = await this.supabase
      .from('autopilot_missions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new MissionNotFoundError(id);
    }

    return data as AutopilotMission;
  }

  async listMissionsForUser(userId: string): Promise<AutopilotMission[]> {
    const { data, error } = await this.supabase
      .from('autopilot_missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to list missions: ${error.message}`);
    }

    return (data || []) as AutopilotMission[];
  }

  async listMissionsForWorkspace(workspaceId: string): Promise<AutopilotMission[]> {
    const { data, error } = await this.supabase
      .from('autopilot_missions')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false});

    if (error) {
      throw new Error(`Failed to list workspace missions: ${error.message}`);
    }

    return (data || []) as AutopilotMission[];
  }

  async createMission(input: {
    userId: string;
    workspaceId?: string;
    title: string;
    description?: string;
    campaignId?: string;
    mode: MissionMode;
    config?: MissionConfig;
  }): Promise<AutopilotMission> {
    const { data, error } = await this.supabase
      .from('autopilot_missions')
      .insert({
        user_id: input.userId,
        workspace_id: input.workspaceId || null,
        title: input.title,
        description: input.description || null,
        campaign_id: input.campaignId || null,
        mode: input.mode,
        status: 'draft',
        config: input.config || {},
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create mission: ${error?.message}`);
    }

    return data as AutopilotMission;
  }

  async updateMissionStatus(
    id: string,
    status: MissionStatus
  ): Promise<AutopilotMission> {
    const { data, error } = await this.supabase
      .from('autopilot_missions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new MissionNotFoundError(id);
    }

    return data as AutopilotMission;
  }

  async updateMissionConfig(
    id: string,
    config: MissionConfig
  ): Promise<AutopilotMission> {
    const { data, error } = await this.supabase
      .from('autopilot_missions')
      .update({ config })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new MissionNotFoundError(id);
    }

    return data as AutopilotMission;
  }

  // ============================================
  // Tasks
  // ============================================

  async getTask(id: string): Promise<AutopilotTask> {
    const { data, error } = await this.supabase
      .from('autopilot_tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new TaskNotFoundError(id);
    }

    return data as AutopilotTask;
  }

  async listTasksForMission(
    missionId: string,
    filter?: {
      agentRole?: AgentRole;
      status?: TaskStatus;
    }
  ): Promise<AutopilotTask[]> {
    let query = this.supabase
      .from('autopilot_tasks')
      .select('*')
      .eq('mission_id', missionId);

    if (filter?.agentRole) {
      query = query.eq('agent_role', filter.agentRole);
    }

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    query = query.order('priority', { ascending: false }).order('created_at');

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list tasks: ${error.message}`);
    }

    return (data || []) as AutopilotTask[];
  }

  async createTask(input: {
    missionId: string;
    agentRole: AgentRole;
    type: string;
    input: Record<string, unknown>;
    priority?: number;
    parentTaskId?: string;
  }): Promise<AutopilotTask> {
    const { data, error } = await this.supabase
      .from('autopilot_tasks')
      .insert({
        mission_id: input.missionId,
        parent_task_id: input.parentTaskId || null,
        agent_role: input.agentRole,
        type: input.type,
        input: input.input,
        output: null,
        status: 'pending',
        priority: input.priority ?? 0,
        blocking_reason: null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create task: ${error?.message}`);
    }

    return data as AutopilotTask;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    output?: Record<string, unknown>,
    options?: {
      blockingReason?: string;
    }
  ): Promise<AutopilotTask> {
    const updates: Partial<AutopilotTask> = { status };

    if (output) {
      updates.output = output;
    }

    if (options?.blockingReason) {
      updates.blocking_reason = options.blockingReason;
    }

    const { data, error } = await this.supabase
      .from('autopilot_tasks')
      .update(updates as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new TaskNotFoundError(id);
    }

    return data as AutopilotTask;
  }

  async getNextPendingTask(
    missionId: string,
    agentRole?: AgentRole
  ): Promise<AutopilotTask | null> {
    let query = this.supabase
      .from('autopilot_tasks')
      .select('*')
      .eq('mission_id', missionId)
      .eq('status', 'pending');

    if (agentRole) {
      query = query.eq('agent_role', agentRole);
    }

    query = query.order('priority', { ascending: false }).order('created_at').limit(1);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get next pending task: ${error.message}`);
    }

    return data?.[0] ? (data[0] as AutopilotTask) : null;
  }

  // ============================================
  // Runs
  // ============================================

  async createRun(input: {
    missionId: string;
    triggeredBy?: string;
    triggerType: 'manual' | 'schedule' | 'event';
  }): Promise<AutopilotRun> {
    const { data, error } = await this.supabase
      .from('autopilot_runs')
      .insert({
        mission_id: input.missionId,
        triggered_by: input.triggeredBy || null,
        trigger_type: input.triggerType,
        status: 'running',
        summary: null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create run: ${error?.message}`);
    }

    return data as AutopilotRun;
  }

  async updateRunStatus(
    id: string,
    status: RunStatus,
    summary?: Record<string, unknown>
  ): Promise<AutopilotRun> {
    const updates: Partial<AutopilotRun> = {
      status,
      finished_at: new Date().toISOString(),
    };

    if (summary) {
      updates.summary = summary as AutopilotRun['summary'];
    }

    const { data, error } = await this.supabase
      .from('autopilot_runs')
      .update(updates as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Run not found: ${id}`);
    }

    return data as AutopilotRun;
  }

  async listRunsForMission(missionId: string, limit = 50): Promise<AutopilotRun[]> {
    const { data, error } = await this.supabase
      .from('autopilot_runs')
      .select('*')
      .eq('mission_id', missionId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to list runs: ${error.message}`);
    }

    return (data || []) as AutopilotRun[];
  }

  // ============================================
  // Logs
  // ============================================

  async appendLog(input: {
    missionId: string;
    taskId?: string;
    agentRole?: AgentRole;
    level: LogLevel;
    message: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const { error } = await this.supabase.from('autopilot_logs').insert({
      mission_id: input.missionId,
      task_id: input.taskId || null,
      agent_role: input.agentRole || null,
      level: input.level,
      message: input.message,
      metadata: input.metadata || null,
    });

    if (error) {
      // Log errors don't throw - fire and forget
      console.error('Failed to append log:', error);
    }
  }

  async listLogsForMission(
    missionId: string,
    filter?: {
      taskId?: string;
      agentRole?: AgentRole;
      level?: LogLevel;
      limit?: number;
    }
  ): Promise<AutopilotLog[]> {
    let query = this.supabase
      .from('autopilot_logs')
      .select('*')
      .eq('mission_id', missionId);

    if (filter?.taskId) {
      query = query.eq('task_id', filter.taskId);
    }

    if (filter?.agentRole) {
      query = query.eq('agent_role', filter.agentRole);
    }

    if (filter?.level) {
      query = query.eq('level', filter.level);
    }

    query = query.order('created_at', { ascending: false });

    if (filter?.limit) {
      query = query.limit(filter.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list logs: ${error.message}`);
    }

    return (data || []) as AutopilotLog[];
  }

  // ============================================
  // Policies
  // ============================================

  async getPolicy(scope: 'user' | 'workspace' | 'global', id?: string): Promise<AutopilotPolicy | null> {
    let query = this.supabase
      .from('autopilot_policies')
      .select('*')
      .eq('scope', scope);

    if (scope === 'user' && id) {
      query = query.eq('user_id', id);
    } else if (scope === 'workspace' && id) {
      query = query.eq('workspace_id', id);
    }

    query = query.limit(1);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get policy: ${error.message}`);
    }

    return data?.[0] ? (data[0] as AutopilotPolicy) : null;
  }

  async upsertPolicy(input: {
    scope: 'user' | 'workspace' | 'global';
    userId?: string;
    workspaceId?: string;
    config: PolicyConfig;
  }): Promise<AutopilotPolicy> {
    const { data, error } = await this.supabase
      .from('autopilot_policies')
      .upsert({
        scope: input.scope,
        user_id: input.userId || null,
        workspace_id: input.workspaceId || null,
        config: input.config,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to upsert policy: ${error?.message}`);
    }

    return data as AutopilotPolicy;
  }

  // ============================================
  // Settings
  // ============================================

  async getSetting(key: string, userId?: string, workspaceId?: string): Promise<AutopilotSetting | null> {
    let query = this.supabase
      .from('autopilot_settings')
      .select('*')
      .eq('key', key);

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    query = query.limit(1);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get setting: ${error.message}`);
    }

    return data?.[0] ? (data[0] as AutopilotSetting) : null;
  }

  async upsertSetting(input: {
    key: string;
    value: Record<string, unknown>;
    userId?: string;
    workspaceId?: string;
  }): Promise<AutopilotSetting> {
    const { data, error } = await this.supabase
      .from('autopilot_settings')
      .upsert({
        key: input.key,
        value: input.value,
        user_id: input.userId || null,
        workspace_id: input.workspaceId || null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to upsert setting: ${error?.message}`);
    }

    return data as AutopilotSetting;
  }

  // ============================================
  // Helper Functions
  // ============================================

  async getActiveMissionCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('autopilot_missions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['active', 'paused']);

    if (error) {
      throw new Error(`Failed to get active mission count: ${error.message}`);
    }

    return count || 0;
  }

  async getPendingTaskCount(missionId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('autopilot_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('mission_id', missionId)
      .in('status', ['pending', 'in_progress']);

    if (error) {
      throw new Error(`Failed to get pending task count: ${error.message}`);
    }

    return count || 0;
  }
}
