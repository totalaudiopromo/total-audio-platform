/**
 * Human Override Hooks
 *
 * Pre-execution hooks that allow human intervention before critical actions
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AutopilotTask, AgentRole, ActionType } from '../types';

export type OverrideAction = 'approve' | 'reject' | 'modify' | 'defer';

export interface OverrideRequest {
  id: string;
  task_id: string;
  mission_id: string;
  agent_role: AgentRole;
  action_type: ActionType;
  proposed_action: Record<string, unknown>;
  reason: string;
  confidence_score?: number;
  requested_at: string;
  expires_at?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  modified_action?: Record<string, unknown>;
}

export interface OverrideHookConfig {
  requireApprovalFor: ActionType[];
  autoApproveUnder?: number; // Auto-approve if confidence > this threshold
  autoRejectUnder?: number; // Auto-reject if confidence < this threshold
  expirationMinutes?: number; // Auto-expire requests after N minutes
  notificationChannels?: ('email' | 'sms' | 'slack' | 'webhook')[];
}

export const DEFAULT_OVERRIDE_CONFIG: OverrideHookConfig = {
  requireApprovalFor: ['send_email', 'send_batch_email', 'schedule_email', 'post_social'],
  autoApproveUnder: 0.9, // Only auto-approve if confidence > 90%
  autoRejectUnder: 0.3, // Auto-reject if confidence < 30%
  expirationMinutes: 60, // Expire after 1 hour
  notificationChannels: ['email'],
};

/**
 * Check if an action requires human approval based on config
 */
export function requiresOverride(
  actionType: ActionType,
  config: OverrideHookConfig = DEFAULT_OVERRIDE_CONFIG
): boolean {
  return config.requireApprovalFor.includes(actionType);
}

/**
 * Check if action can be auto-approved based on confidence
 */
export function canAutoApprove(
  confidenceScore: number,
  config: OverrideHookConfig = DEFAULT_OVERRIDE_CONFIG
): boolean {
  if (!config.autoApproveUnder) return false;
  return confidenceScore >= config.autoApproveUnder;
}

/**
 * Check if action should be auto-rejected based on confidence
 */
export function shouldAutoReject(
  confidenceScore: number,
  config: OverrideHookConfig = DEFAULT_OVERRIDE_CONFIG
): boolean {
  if (!config.autoRejectUnder) return false;
  return confidenceScore < config.autoRejectUnder;
}

/**
 * Create an override request
 */
export async function createOverrideRequest(
  supabase: SupabaseClient,
  params: {
    taskId: string;
    missionId: string;
    agentRole: AgentRole;
    actionType: ActionType;
    proposedAction: Record<string, unknown>;
    reason: string;
    confidenceScore?: number;
    config?: OverrideHookConfig;
  }
): Promise<OverrideRequest> {
  const config = params.config || DEFAULT_OVERRIDE_CONFIG;

  const expiresAt = config.expirationMinutes
    ? new Date(Date.now() + config.expirationMinutes * 60 * 1000).toISOString()
    : undefined;

  const request: Partial<OverrideRequest> = {
    task_id: params.taskId,
    mission_id: params.missionId,
    agent_role: params.agentRole,
    action_type: params.actionType,
    proposed_action: params.proposedAction,
    reason: params.reason,
    confidence_score: params.confidenceScore,
    requested_at: new Date().toISOString(),
    expires_at: expiresAt,
    status: 'pending',
  };

  // Store in a hypothetical override_requests table (would need migration)
  // For now, we'll use task metadata
  const { data: task } = await supabase
    .from('autopilot_tasks')
    .select('metadata')
    .eq('id', params.taskId)
    .single();

  const metadata = (task?.metadata as Record<string, unknown>) || {};
  metadata.override_request = request;

  await supabase
    .from('autopilot_tasks')
    .update({ metadata })
    .eq('id', params.taskId);

  return {
    id: params.taskId, // Use task ID as override request ID for simplicity
    ...request,
  } as OverrideRequest;
}

/**
 * Resolve an override request (approve/reject/modify)
 */
export async function resolveOverrideRequest(
  supabase: SupabaseClient,
  requestId: string,
  resolution: {
    action: OverrideAction;
    userId: string;
    notes?: string;
    modifiedAction?: Record<string, unknown>;
  }
): Promise<OverrideRequest> {
  const { data: task } = await supabase
    .from('autopilot_tasks')
    .select('metadata')
    .eq('id', requestId)
    .single();

  const metadata = (task?.metadata as Record<string, unknown>) || {};
  const request = metadata.override_request as OverrideRequest;

  if (!request) {
    throw new Error('Override request not found');
  }

  // Check if expired
  if (request.expires_at && new Date(request.expires_at) < new Date()) {
    request.status = 'expired';
    throw new Error('Override request has expired');
  }

  // Update request with resolution
  request.status = resolution.action === 'approve' ? 'approved' : 'rejected';
  request.resolved_by = resolution.userId;
  request.resolved_at = new Date().toISOString();
  request.resolution_notes = resolution.notes;

  if (resolution.action === 'modify' && resolution.modifiedAction) {
    request.modified_action = resolution.modifiedAction;
    request.status = 'approved'; // Modified actions are approved
  }

  metadata.override_request = request;

  await supabase
    .from('autopilot_tasks')
    .update({ metadata })
    .eq('id', requestId);

  // Update task status based on resolution
  if (request.status === 'approved') {
    await supabase
      .from('autopilot_tasks')
      .update({ status: 'pending' }) // Re-queue for execution
      .eq('id', requestId);
  } else if (request.status === 'rejected') {
    await supabase
      .from('autopilot_tasks')
      .update({ status: 'failed' })
      .eq('id', requestId);
  }

  return request;
}

/**
 * Get pending override requests for a mission
 */
export async function getPendingOverrides(
  supabase: SupabaseClient,
  missionId: string
): Promise<OverrideRequest[]> {
  const { data: tasks } = await supabase
    .from('autopilot_tasks')
    .select('id, metadata')
    .eq('mission_id', missionId)
    .eq('status', 'waiting_approval');

  if (!tasks) return [];

  const requests: OverrideRequest[] = [];
  for (const task of tasks) {
    const metadata = task.metadata as Record<string, unknown>;
    const request = metadata?.override_request as OverrideRequest;
    if (request && request.status === 'pending') {
      requests.push({ ...request, id: task.id });
    }
  }

  return requests;
}

/**
 * Check and expire old override requests
 */
export async function expireOldRequests(
  supabase: SupabaseClient,
  missionId: string
): Promise<number> {
  const { data: tasks } = await supabase
    .from('autopilot_tasks')
    .select('id, metadata')
    .eq('mission_id', missionId)
    .eq('status', 'waiting_approval');

  if (!tasks) return 0;

  let expiredCount = 0;
  const now = new Date();

  for (const task of tasks) {
    const metadata = (task.metadata as Record<string, unknown>) || {};
    const request = metadata.override_request as OverrideRequest;

    if (request && request.status === 'pending' && request.expires_at) {
      if (new Date(request.expires_at) < now) {
        request.status = 'expired';
        metadata.override_request = request;

        await supabase
          .from('autopilot_tasks')
          .update({
            metadata,
            status: 'failed',
          })
          .eq('id', task.id);

        expiredCount++;
      }
    }
  }

  return expiredCount;
}

/**
 * Batch approve multiple override requests
 */
export async function batchApproveOverrides(
  supabase: SupabaseClient,
  requestIds: string[],
  userId: string,
  notes?: string
): Promise<{ approved: number; failed: string[] }> {
  const failed: string[] = [];
  let approved = 0;

  for (const requestId of requestIds) {
    try {
      await resolveOverrideRequest(supabase, requestId, {
        action: 'approve',
        userId,
        notes,
      });
      approved++;
    } catch (error) {
      failed.push(requestId);
    }
  }

  return { approved, failed };
}

/**
 * Notification helper (placeholder - would integrate with actual notification system)
 */
export async function notifyOverrideRequest(
  request: OverrideRequest,
  channels: ('email' | 'sms' | 'slack' | 'webhook')[]
): Promise<void> {
  // Placeholder for notification logic
  console.log('Override request notification:', {
    requestId: request.id,
    actionType: request.action_type,
    channels,
  });

  // In production, this would:
  // - Send email via Email Engine
  // - Send SMS via Twilio
  // - Post to Slack via webhook
  // - Trigger custom webhooks
}
