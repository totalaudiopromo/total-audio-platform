/**
 * Policy Engine
 *
 * Implements safety constraints and behavior rules for the PR Autopilot system.
 * Enforces limits based on user/workspace/global policies.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  PolicyEngine,
  MissionMode,
  ActionType,
  AutopilotMission,
  PolicyConfig,
} from '../types';
import { MissionStore } from './missionStore';
import { PolicyViolationError, ModeNotAllowedError } from '../utils/errors';

export class PolicyEngineImpl implements PolicyEngine {
  private store: MissionStore;

  constructor(private supabase: SupabaseClient) {
    this.store = new MissionStore(supabase);
  }

  /**
   * Get effective policy for user/workspace (respects hierarchy)
   */
  private async getEffectivePolicy(
    userId: string,
    workspaceId?: string
  ): Promise<PolicyConfig> {
    // Policy hierarchy: workspace > user > global
    let policy = null;

    // Try workspace policy first
    if (workspaceId) {
      policy = await this.store.getPolicy('workspace', workspaceId);
    }

    // Fall back to user policy
    if (!policy) {
      policy = await this.store.getPolicy('user', userId);
    }

    // Fall back to global policy
    if (!policy) {
      policy = await this.store.getPolicy('global');
    }

    // Default policy if nothing is configured
    if (!policy) {
      return this.getDefaultPolicy();
    }

    return policy.config;
  }

  /**
   * Default policy configuration
   */
  private getDefaultPolicy(): PolicyConfig {
    return {
      allowed_modes: ['suggest'],
      max_emails_per_day: 50,
      max_contacts_per_mission: 500,
      approval_required: [
        'send_email',
        'create_campaign',
        'modify_segment',
        'send_followup',
      ],
      quiet_hours: {
        start: '22:00',
        end: '08:00',
      },
      contact_fatigue_days: 14,
    };
  }

  /**
   * Check if user can send N emails within time window
   */
  async canSendEmails(
    userId: string,
    workspaceId: string | undefined,
    count: number,
    timeWindow?: string
  ): Promise<boolean> {
    const policy = await this.getEffectivePolicy(userId, workspaceId);

    // Check daily limit
    if (count > policy.max_emails_per_day) {
      return false;
    }

    // TODO: Query actual sends in time window from email_campaigns table
    // For now, assume allowed
    return true;
  }

  /**
   * Check if action requires approval based on policy
   */
  async requiresApprovalFor(
    userId: string,
    workspaceId: string | undefined,
    actionType: ActionType
  ): Promise<boolean> {
    const policy = await this.getEffectivePolicy(userId, workspaceId);

    return policy.approval_required.includes(actionType);
  }

  /**
   * Get max contacts allowed for a mission
   */
  async maxContactsForMission(mission: AutopilotMission): Promise<number> {
    const policy = await this.getEffectivePolicy(
      mission.user_id,
      mission.workspace_id || undefined
    );

    // Check mission config override
    const configMax = mission.config?.targeting?.max_contacts;
    if (configMax && configMax < policy.max_contacts_per_mission) {
      return configMax;
    }

    return policy.max_contacts_per_mission;
  }

  /**
   * Get allowed modes for user
   */
  async allowedModesForUser(
    userId: string,
    workspaceId?: string
  ): Promise<MissionMode[]> {
    const policy = await this.getEffectivePolicy(userId, workspaceId);
    return policy.allowed_modes;
  }

  /**
   * Check if mode is allowed for user
   */
  async isModeAllowed(
    userId: string,
    workspaceId: string | undefined,
    mode: MissionMode
  ): Promise<boolean> {
    const allowedModes = await this.allowedModesForUser(userId, workspaceId);
    return allowedModes.includes(mode);
  }

  /**
   * Enforce quiet hours - returns true if time is OK, false if in quiet hours
   */
  async enforceQuietHours(
    userId: string,
    workspaceId: string | undefined,
    sendTime: string
  ): Promise<boolean> {
    const policy = await this.getEffectivePolicy(userId, workspaceId);

    if (!policy.quiet_hours) {
      return true; // No quiet hours configured
    }

    const time = new Date(sendTime);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const timeValue = hours * 100 + minutes;

    const [startHour, startMin] = policy.quiet_hours.start.split(':').map(Number);
    const startValue = startHour * 100 + startMin;

    const [endHour, endMin] = policy.quiet_hours.end.split(':').map(Number);
    const endValue = endHour * 100 + endMin;

    // Handle overnight quiet hours (e.g., 22:00 - 08:00)
    if (startValue > endValue) {
      return !(timeValue >= startValue || timeValue < endValue);
    }

    // Normal quiet hours (e.g., 12:00 - 14:00)
    return !(timeValue >= startValue && timeValue < endValue);
  }

  /**
   * Check contact fatigue - has this contact been contacted recently?
   */
  async checkContactFatigue(
    userId: string,
    workspaceId: string | undefined,
    contactId: string,
    missionId: string
  ): Promise<boolean> {
    const policy = await this.getEffectivePolicy(userId, workspaceId);
    const fatigueDays = policy.contact_fatigue_days || 14;

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - fatigueDays);

    // TODO: Query email_campaigns or tracker to see if contact was recently contacted
    // For now, assume no fatigue
    return true;
  }

  /**
   * Validate mission against policy before creation/update
   */
  async validateMission(mission: {
    userId: string;
    workspaceId?: string;
    mode: MissionMode;
    config?: {
      targeting?: {
        max_contacts?: number;
      };
      budget?: {
        max_sends_per_day?: number;
      };
    };
  }): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const policy = await this.getEffectivePolicy(
      mission.userId,
      mission.workspaceId
    );

    // Check mode allowed
    if (!policy.allowed_modes.includes(mission.mode)) {
      errors.push(
        `Mode '${mission.mode}' not allowed. Allowed: ${policy.allowed_modes.join(', ')}`
      );
    }

    // Check max contacts
    const requestedContacts = mission.config?.targeting?.max_contacts;
    if (
      requestedContacts &&
      requestedContacts > policy.max_contacts_per_mission
    ) {
      errors.push(
        `Requested contacts (${requestedContacts}) exceeds policy limit (${policy.max_contacts_per_mission})`
      );
    }

    // Check daily send limit
    const requestedDaily = mission.config?.budget?.max_sends_per_day;
    if (requestedDaily && requestedDaily > policy.max_emails_per_day) {
      errors.push(
        `Requested daily sends (${requestedDaily}) exceeds policy limit (${policy.max_emails_per_day})`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Enforce policy - throws if violation
   */
  async enforce(
    userId: string,
    workspaceId: string | undefined,
    check: 'mode' | 'emails' | 'contacts' | 'action',
    params: {
      mode?: MissionMode;
      emailCount?: number;
      contactCount?: number;
      actionType?: ActionType;
    }
  ): Promise<void> {
    const policy = await this.getEffectivePolicy(userId, workspaceId);

    switch (check) {
      case 'mode':
        if (params.mode && !policy.allowed_modes.includes(params.mode)) {
          throw new ModeNotAllowedError(params.mode, policy.allowed_modes);
        }
        break;

      case 'emails':
        if (
          params.emailCount &&
          params.emailCount > policy.max_emails_per_day
        ) {
          throw new PolicyViolationError(
            `Email count ${params.emailCount} exceeds daily limit ${policy.max_emails_per_day}`,
            'max_emails_per_day',
            { emailCount: params.emailCount, limit: policy.max_emails_per_day }
          );
        }
        break;

      case 'contacts':
        if (
          params.contactCount &&
          params.contactCount > policy.max_contacts_per_mission
        ) {
          throw new PolicyViolationError(
            `Contact count ${params.contactCount} exceeds mission limit ${policy.max_contacts_per_mission}`,
            'max_contacts_per_mission',
            {
              contactCount: params.contactCount,
              limit: policy.max_contacts_per_mission,
            }
          );
        }
        break;

      case 'action':
        if (
          params.actionType &&
          policy.approval_required.includes(params.actionType)
        ) {
          throw new PolicyViolationError(
            `Action '${params.actionType}' requires approval`,
            'approval_required',
            { actionType: params.actionType }
          );
        }
        break;
    }
  }
}

/**
 * Create a policy engine instance
 */
export function createPolicyEngine(supabase: SupabaseClient): PolicyEngine {
  return new PolicyEngineImpl(supabase);
}
