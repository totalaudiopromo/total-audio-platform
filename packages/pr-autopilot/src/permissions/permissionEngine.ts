/**
 * Workspace Roles & Permissions Engine
 *
 * Role-based access control for PR Autopilot missions and agents
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentRole, ActionType } from '../types';

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Permission {
  resource: string;
  action: 'read' | 'write' | 'execute' | 'delete' | 'approve';
  granted: boolean;
}

export interface RolePermissions {
  role: WorkspaceRole;
  permissions: Permission[];
  canCreateMissions: boolean;
  canEditMissions: boolean;
  canDeleteMissions: boolean;
  canRunMissions: boolean;
  canApproveTasks: boolean;
  canInvokeAgents: AgentRole[];
  canModifyPolicies: boolean;
  canViewTelemetry: boolean;
  canManageTeam: boolean;
}

/**
 * Default permission sets for each role
 */
export const ROLE_PERMISSIONS: Record<WorkspaceRole, RolePermissions> = {
  owner: {
    role: 'owner',
    permissions: [
      { resource: '*', action: 'read', granted: true },
      { resource: '*', action: 'write', granted: true },
      { resource: '*', action: 'execute', granted: true },
      { resource: '*', action: 'delete', granted: true },
      { resource: '*', action: 'approve', granted: true },
    ],
    canCreateMissions: true,
    canEditMissions: true,
    canDeleteMissions: true,
    canRunMissions: true,
    canApproveTasks: true,
    canInvokeAgents: [
      'strategist',
      'pitch',
      'contact',
      'scheduler',
      'followup',
      'analyst',
      'archivist',
      'simulator',
      'coordinator',
    ],
    canModifyPolicies: true,
    canViewTelemetry: true,
    canManageTeam: true,
  },

  admin: {
    role: 'admin',
    permissions: [
      { resource: 'missions', action: 'read', granted: true },
      { resource: 'missions', action: 'write', granted: true },
      { resource: 'missions', action: 'execute', granted: true },
      { resource: 'missions', action: 'delete', granted: true },
      { resource: 'tasks', action: 'approve', granted: true },
      { resource: 'telemetry', action: 'read', granted: true },
    ],
    canCreateMissions: true,
    canEditMissions: true,
    canDeleteMissions: true,
    canRunMissions: true,
    canApproveTasks: true,
    canInvokeAgents: [
      'strategist',
      'pitch',
      'contact',
      'scheduler',
      'followup',
      'analyst',
      'archivist',
      'simulator',
      'coordinator',
    ],
    canModifyPolicies: true,
    canViewTelemetry: true,
    canManageTeam: false,
  },

  member: {
    role: 'member',
    permissions: [
      { resource: 'missions', action: 'read', granted: true },
      { resource: 'missions', action: 'write', granted: true },
      { resource: 'missions', action: 'execute', granted: true },
      { resource: 'tasks', action: 'approve', granted: true },
      { resource: 'telemetry', action: 'read', granted: true },
    ],
    canCreateMissions: true,
    canEditMissions: true,
    canDeleteMissions: false,
    canRunMissions: true,
    canApproveTasks: true,
    canInvokeAgents: ['pitch', 'contact', 'scheduler', 'followup', 'analyst'],
    canModifyPolicies: false,
    canViewTelemetry: true,
    canManageTeam: false,
  },

  viewer: {
    role: 'viewer',
    permissions: [
      { resource: 'missions', action: 'read', granted: true },
      { resource: 'telemetry', action: 'read', granted: true },
    ],
    canCreateMissions: false,
    canEditMissions: false,
    canDeleteMissions: false,
    canRunMissions: false,
    canApproveTasks: false,
    canInvokeAgents: [],
    canModifyPolicies: false,
    canViewTelemetry: true,
    canManageTeam: false,
  },
};

/**
 * Get user's role in a workspace
 */
export async function getUserWorkspaceRole(
  supabase: SupabaseClient,
  userId: string,
  workspaceId: string
): Promise<WorkspaceRole | null> {
  // Query workspace_members table (assuming it exists)
  const { data, error } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('user_id', userId)
    .eq('workspace_id', workspaceId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.role as WorkspaceRole;
}

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(
  role: WorkspaceRole,
  resource: string,
  action: Permission['action']
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];

  // Check for wildcard permission
  const wildcardPerm = rolePerms.permissions.find(
    (p) => p.resource === '*' && p.action === action
  );
  if (wildcardPerm?.granted) return true;

  // Check for specific resource permission
  const specificPerm = rolePerms.permissions.find(
    (p) => p.resource === resource && p.action === action
  );
  return specificPerm?.granted || false;
}

/**
 * Check if user can perform an action on a mission
 */
export async function canPerformAction(
  supabase: SupabaseClient,
  userId: string,
  missionId: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'approve'
): Promise<boolean> {
  // Get mission to find workspace
  const { data: mission } = await supabase
    .from('autopilot_missions')
    .select('workspace_id, user_id')
    .eq('id', missionId)
    .single();

  if (!mission) return false;

  // Owner of mission always has full access
  if (mission.user_id === userId) return true;

  // If no workspace, only owner can access
  if (!mission.workspace_id) return false;

  // Get user's workspace role
  const role = await getUserWorkspaceRole(supabase, userId, mission.workspace_id);
  if (!role) return false;

  const rolePerms = ROLE_PERMISSIONS[role];

  switch (action) {
    case 'create':
      return rolePerms.canCreateMissions;
    case 'read':
      return hasPermission(role, 'missions', 'read');
    case 'update':
      return rolePerms.canEditMissions;
    case 'delete':
      return rolePerms.canDeleteMissions;
    case 'execute':
      return rolePerms.canRunMissions;
    case 'approve':
      return rolePerms.canApproveTasks;
    default:
      return false;
  }
}

/**
 * Check if user can invoke a specific agent
 */
export function canInvokeAgent(role: WorkspaceRole, agentRole: AgentRole): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];
  return rolePerms.canInvokeAgents.includes(agentRole);
}

/**
 * Get all permissions for a user's role
 */
export function getRolePermissions(role: WorkspaceRole): RolePermissions {
  return ROLE_PERMISSIONS[role];
}

/**
 * Validate action is allowed before execution
 */
export async function validateActionPermission(
  supabase: SupabaseClient,
  params: {
    userId: string;
    missionId: string;
    actionType: ActionType;
    agentRole?: AgentRole;
  }
): Promise<{ allowed: boolean; reason?: string }> {
  const { userId, missionId, actionType, agentRole } = params;

  // Get mission workspace
  const { data: mission } = await supabase
    .from('autopilot_missions')
    .select('workspace_id, user_id')
    .eq('id', missionId)
    .single();

  if (!mission) {
    return { allowed: false, reason: 'Mission not found' };
  }

  // Owner always allowed
  if (mission.user_id === userId) {
    return { allowed: true };
  }

  // No workspace = private mission
  if (!mission.workspace_id) {
    return { allowed: false, reason: 'Not authorized for private mission' };
  }

  // Get user role
  const role = await getUserWorkspaceRole(supabase, userId, mission.workspace_id);
  if (!role) {
    return { allowed: false, reason: 'Not a member of workspace' };
  }

  const rolePerms = ROLE_PERMISSIONS[role];

  // Check if action requires approval permission
  const requiresApproval = ['send_email', 'send_batch_email', 'post_social'].includes(
    actionType
  );
  if (requiresApproval && !rolePerms.canApproveTasks) {
    return { allowed: false, reason: 'Insufficient permissions for approval actions' };
  }

  // Check if agent role is allowed
  if (agentRole && !canInvokeAgent(role, agentRole)) {
    return {
      allowed: false,
      reason: `Role ${role} cannot invoke ${agentRole} agent`,
    };
  }

  return { allowed: true };
}

/**
 * Audit log entry for permission checks
 */
export interface PermissionAuditLog {
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  allowed: boolean;
  reason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log permission check (for compliance/audit trail)
 */
export async function logPermissionCheck(
  supabase: SupabaseClient,
  log: Omit<PermissionAuditLog, 'timestamp'>
): Promise<void> {
  const entry: PermissionAuditLog = {
    ...log,
    timestamp: new Date().toISOString(),
  };

  // Store in autopilot_logs table
  await supabase.from('autopilot_logs').insert({
    mission_id: (log.metadata?.missionId as string) || null,
    level: log.allowed ? 'info' : 'warning',
    message: `Permission check: ${log.action} on ${log.resource}`,
    metadata: entry,
  });
}
