/**
 * MeshOS Policy Engine
 * Global policy enforcement and validation
 */

import type { GlobalPolicy, PolicyRule } from '../types';
import { logger } from '../utils/logger';
import { isQuietHours } from '../utils/time';
import { clamp } from '../utils/math';

export class PolicyEngine {
  private policy: GlobalPolicy;

  constructor(workspaceId: string, policy?: Partial<GlobalPolicy>) {
    this.policy = {
      workspace_id: workspaceId,
      quiet_hours: policy?.quiet_hours,
      contact_fatigue: policy?.contact_fatigue || {
        max_contacts_per_day: 50,
        max_contacts_per_week: 200,
        min_days_between_contacts: 2,
      },
      risk_ceilings: policy?.risk_ceilings || {
        max_risk_score: 0.7,
        require_approval_above: 0.5,
      },
      autonomy_caps: policy?.autonomy_caps || {
        max_autonomous_actions_per_day: 100,
        require_human_approval: ['campaign_send', 'bulk_email', 'major_strategy_change'],
      },
      token_budgets: policy?.token_budgets || {
        daily_limit: 100000,
        monthly_limit: 2000000,
        alert_at_percentage: 80,
      },
      rate_limiting: policy?.rate_limiting || {
        max_actions_per_hour: 20,
        max_messages_per_hour: 100,
      },
      ethical_constraints: policy?.ethical_constraints || {
        no_spam: true,
        respect_privacy: true,
        transparent_ai_use: true,
        custom_rules: [],
      },
    };

    logger.setContext('PolicyEngine');
  }

  /**
   * Check if an action is allowed by policy
   */
  isActionAllowed(action: {
    type: string;
    timestamp?: Date | string;
    riskScore?: number;
    contactsToday?: number;
    contactsThisWeek?: number;
    tokensUsedToday?: number;
    actionsThisHour?: number;
  }): { allowed: boolean; reason?: string } {
    const timestamp = action.timestamp ? new Date(action.timestamp) : new Date();

    // Check quiet hours
    if (this.policy.quiet_hours && isQuietHours(timestamp, this.policy.quiet_hours)) {
      return { allowed: false, reason: 'Action blocked during quiet hours' };
    }

    // Check risk ceiling
    if (action.riskScore !== undefined && this.policy.risk_ceilings) {
      if (action.riskScore > this.policy.risk_ceilings.max_risk_score) {
        return { allowed: false, reason: `Risk score ${action.riskScore} exceeds maximum ${this.policy.risk_ceilings.max_risk_score}` };
      }
    }

    // Check contact fatigue
    if (this.policy.contact_fatigue) {
      if (action.contactsToday !== undefined && action.contactsToday >= this.policy.contact_fatigue.max_contacts_per_day) {
        return { allowed: false, reason: 'Daily contact limit reached' };
      }
      if (action.contactsThisWeek !== undefined && action.contactsThisWeek >= this.policy.contact_fatigue.max_contacts_per_week) {
        return { allowed: false, reason: 'Weekly contact limit reached' };
      }
    }

    // Check rate limiting
    if (this.policy.rate_limiting && action.actionsThisHour !== undefined) {
      if (action.actionsThisHour >= this.policy.rate_limiting.max_actions_per_hour) {
        return { allowed: false, reason: 'Hourly action rate limit reached' };
      }
    }

    // Check token budget
    if (this.policy.token_budgets && action.tokensUsedToday !== undefined) {
      if (action.tokensUsedToday >= this.policy.token_budgets.daily_limit) {
        return { allowed: false, reason: 'Daily token budget exhausted' };
      }
    }

    // Check if action requires human approval
    if (this.policy.autonomy_caps?.require_human_approval.includes(action.type)) {
      return { allowed: false, reason: `Action type "${action.type}" requires human approval` };
    }

    return { allowed: true };
  }

  /**
   * Check if action requires human approval
   */
  requiresApproval(action: {
    type: string;
    riskScore?: number;
  }): boolean {
    // Check explicit approval requirements
    if (this.policy.autonomy_caps?.require_human_approval.includes(action.type)) {
      return true;
    }

    // Check risk-based approval
    if (action.riskScore !== undefined && this.policy.risk_ceilings) {
      if (action.riskScore >= this.policy.risk_ceilings.require_approval_above) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get current policy summary
   */
  getPolicySummary(): GlobalPolicy {
    return { ...this.policy };
  }

  /**
   * Update policy
   */
  updatePolicy(updates: Partial<GlobalPolicy>): void {
    this.policy = { ...this.policy, ...updates };
    logger.info('Policy updated', updates);
  }

  /**
   * Simulate policy impact on proposed actions
   */
  simulatePolicyImpact(proposedActions: Array<{
    type: string;
    riskScore?: number;
    timestamp?: string;
  }>): {
    allowed: number;
    blocked: number;
    requireApproval: number;
    details: Array<{ action: any; result: { allowed: boolean; reason?: string } }>;
  } {
    const results = proposedActions.map(action => ({
      action,
      result: this.isActionAllowed(action),
    }));

    return {
      allowed: results.filter(r => r.result.allowed).length,
      blocked: results.filter(r => !r.result.allowed).length,
      requireApproval: results.filter(r => this.requiresApproval(r.action)).length,
      details: results,
    };
  }

  /**
   * Check token budget status
   */
  checkTokenBudget(tokensUsedToday: number, tokensUsedMonth: number): {
    status: 'ok' | 'warning' | 'critical';
    dailyRemaining: number;
    monthlyRemaining: number;
    alertTriggered: boolean;
  } {
    if (!this.policy.token_budgets) {
      return {
        status: 'ok',
        dailyRemaining: Infinity,
        monthlyRemaining: Infinity,
        alertTriggered: false,
      };
    }

    const dailyUsagePercent = (tokensUsedToday / this.policy.token_budgets.daily_limit) * 100;
    const monthlyUsagePercent = (tokensUsedMonth / this.policy.token_budgets.monthly_limit) * 100;

    const alertTriggered =
      dailyUsagePercent >= this.policy.token_budgets.alert_at_percentage ||
      monthlyUsagePercent >= this.policy.token_budgets.alert_at_percentage;

    let status: 'ok' | 'warning' | 'critical' = 'ok';
    if (dailyUsagePercent >= 90 || monthlyUsagePercent >= 90) {
      status = 'critical';
    } else if (alertTriggered) {
      status = 'warning';
    }

    return {
      status,
      dailyRemaining: this.policy.token_budgets.daily_limit - tokensUsedToday,
      monthlyRemaining: this.policy.token_budgets.monthly_limit - tokensUsedMonth,
      alertTriggered,
    };
  }
}
