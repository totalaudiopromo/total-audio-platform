/**
 * Enhanced Guardrails & Safety
 *
 * Hard limits and safety checks for autopilot operations
 */

import type { AgentRole, ActionType } from '../types';
import { checkBrandVoice, type BrandVoice } from '../identity/identityKernel';

export interface SafetyLimits {
  maxEmailsPerRun: number;
  maxEmailsPerHour: number;
  maxContactsPerEmail: number;
  maxRetries: number;
  requiredApprovalThreshold: number;
}

export const DEFAULT_SAFETY_LIMITS: SafetyLimits = {
  maxEmailsPerRun: 100,
  maxEmailsPerHour: 50,
  maxContactsPerEmail: 1,
  maxRetries: 3,
  requiredApprovalThreshold: 0.7,
};

export interface SafetyCheck {
  passed: boolean;
  violations: string[];
  warnings: string[];
  blockingViolations: string[];
}

/**
 * Check outbound operation limits
 */
export function checkOutboundLimits(params: {
  actionType: ActionType;
  emailCount: number;
  contactCount: number;
  limits: SafetyLimits;
  hourlyEmailCount?: number;
}): SafetyCheck {
  const violations: string[] = [];
  const warnings: string[] = [];
  const blockingViolations: string[] = [];

  // Check email limits
  if (params.emailCount > params.limits.maxEmailsPerRun) {
    blockingViolations.push(
      `Email count (${params.emailCount}) exceeds max per run (${params.limits.maxEmailsPerRun})`
    );
  }

  if (params.hourlyEmailCount && params.hourlyEmailCount > params.limits.maxEmailsPerHour) {
    blockingViolations.push(
      `Hourly email count (${params.hourlyEmailCount}) exceeds limit (${params.limits.maxEmailsPerHour})`
    );
  }

  // Check contact limits
  if (params.contactCount > params.limits.maxContactsPerEmail) {
    warnings.push(
      `Contact count (${params.contactCount}) exceeds recommended max (${params.limits.maxContactsPerEmail})`
    );
  }

  // Warn on bulk operations
  if (params.actionType === 'send_batch_email' && params.emailCount > 25) {
    warnings.push('Large batch email operation - consider splitting');
  }

  return {
    passed: blockingViolations.length === 0,
    violations,
    warnings,
    blockingViolations,
  };
}

/**
 * Enhanced VoiceGuard check
 */
export function enhancedVoiceGuard(message: string, brandVoice?: BrandVoice): SafetyCheck {
  const result = checkBrandVoice(message, brandVoice);

  const blockingViolations: string[] = [];
  const warnings: string[] = [];

  // Block on non-compliance
  if (!result.compliant) {
    blockingViolations.push(...result.violations);
  }

  // Warn on low authenticity
  if (result.authenticityScore < 0.6) {
    warnings.push(`Low authenticity score: ${(result.authenticityScore * 100).toFixed(0)}%`);
  }

  // Add suggestions as warnings
  warnings.push(...result.suggestions);

  return {
    passed: result.compliant && result.authenticityScore >= 0.6,
    violations: result.violations,
    warnings,
    blockingViolations,
  };
}

/**
 * Cross-agent conflict fence
 */
export function checkAgentConflict(params: {
  agentRole: AgentRole;
  actionType: ActionType;
  activeAgents: AgentRole[];
}): SafetyCheck {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Check for conflicting agents
  const conflicts: Record<AgentRole, AgentRole[]> = {
    scheduler: ['followup'], // Can't schedule while followup is active
    followup: ['scheduler'], // Can't followup while scheduler is active
    strategist: [], // Strategist can run with anyone
    pitch: [],
    contact: [],
    analyst: [],
    archivist: [],
    simulator: [],
    coordinator: [], // Coordinator can run with anyone
  };

  const conflictingAgents = conflicts[params.agentRole] || [];
  const activeConflicts = params.activeAgents.filter((a) => conflictingAgents.includes(a));

  if (activeConflicts.length > 0) {
    violations.push(
      `Agent ${params.agentRole} conflicts with active agents: ${activeConflicts.join(', ')}`
    );
  }

  // Warn on concurrent expensive operations
  if (
    params.agentRole === 'analyst' &&
    params.activeAgents.includes('simulator')
  ) {
    warnings.push('Analyst and Simulator running concurrently may be slow');
  }

  return {
    passed: violations.length === 0,
    violations,
    warnings,
    blockingViolations: violations,
  };
}

/**
 * Combined safety check
 */
export function runSafetyChecks(params: {
  agentRole: AgentRole;
  actionType: ActionType;
  message?: string;
  emailCount?: number;
  contactCount?: number;
  activeAgents?: AgentRole[];
  limits?: SafetyLimits;
  brandVoice?: BrandVoice;
}): SafetyCheck {
  const allViolations: string[] = [];
  const allWarnings: string[] = [];
  const allBlockingViolations: string[] = [];

  // Check outbound limits
  if (params.emailCount !== undefined && params.contactCount !== undefined) {
    const limitsCheck = checkOutboundLimits({
      actionType: params.actionType,
      emailCount: params.emailCount,
      contactCount: params.contactCount,
      limits: params.limits || DEFAULT_SAFETY_LIMITS,
    });

    allViolations.push(...limitsCheck.violations);
    allWarnings.push(...limitsCheck.warnings);
    allBlockingViolations.push(...limitsCheck.blockingViolations);
  }

  // Check VoiceGuard
  if (params.message) {
    const voiceCheck = enhancedVoiceGuard(params.message, params.brandVoice);
    allViolations.push(...voiceCheck.violations);
    allWarnings.push(...voiceCheck.warnings);
    allBlockingViolations.push(...voiceCheck.blockingViolations);
  }

  // Check agent conflicts
  if (params.activeAgents) {
    const conflictCheck = checkAgentConflict({
      agentRole: params.agentRole,
      actionType: params.actionType,
      activeAgents: params.activeAgents,
    });

    allViolations.push(...conflictCheck.violations);
    allWarnings.push(...conflictCheck.warnings);
    allBlockingViolations.push(...conflictCheck.blockingViolations);
  }

  return {
    passed: allBlockingViolations.length === 0,
    violations: allViolations,
    warnings: allWarnings,
    blockingViolations: allBlockingViolations,
  };
}
