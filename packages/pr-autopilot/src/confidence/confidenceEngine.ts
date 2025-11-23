/**
 * Confidence Scoring Engine
 *
 * Calculates confidence scores for agent task execution based on:
 * - Data completeness and quality
 * - Risk assessment
 * - Policy compliance
 * - Agent capabilities match
 */

import type { AgentRole, AutopilotTask, AutopilotMission, FusionContext } from '../types';
import { getCapability } from '../capabilities/capabilitiesLoader';
import { getPersonality } from '../personalities/personalityEngine';

export interface ConfidenceScore {
  score: number; // 0.0 - 1.0
  rationale: string[];
  warnings: string[];
  blockers: string[];
  shouldEscalate: boolean;
  breakdown: {
    dataCompleteness: number;
    riskAssessment: number;
    policyCompliance: number;
    capabilityMatch: number;
    contextQuality: number;
  };
}

export interface ConfidenceInputs {
  agentRole: AgentRole;
  task: AutopilotTask;
  mission: AutopilotMission;
  fusionContext?: FusionContext;
  availableData?: Record<string, unknown>;
  previousTaskResults?: Array<{ success: boolean; confidence: number }>;
}

/**
 * Calculate confidence score for an agent task
 */
export function calculateConfidence(inputs: ConfidenceInputs): ConfidenceScore {
  const { agentRole, task, mission, fusionContext, availableData, previousTaskResults } = inputs;

  const capability = getCapability(agentRole);
  const personality = getPersonality(agentRole);

  const rationale: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];

  // 1. Data Completeness Score (0-1)
  const dataCompleteness = assessDataCompleteness(
    capability.inputs,
    fusionContext,
    availableData,
    rationale,
    warnings,
    blockers
  );

  // 2. Risk Assessment Score (0-1)
  const riskAssessment = assessRisk(
    agentRole,
    task,
    mission,
    personality.riskTolerance,
    rationale,
    warnings
  );

  // 3. Policy Compliance Score (0-1)
  const policyCompliance = assessPolicyCompliance(
    agentRole,
    task,
    mission,
    rationale,
    warnings,
    blockers
  );

  // 4. Capability Match Score (0-1)
  const capabilityMatch = assessCapabilityMatch(
    agentRole,
    task,
    capability,
    rationale,
    warnings
  );

  // 5. Context Quality Score (0-1)
  const contextQuality = assessContextQuality(
    fusionContext,
    previousTaskResults,
    rationale,
    warnings
  );

  // Calculate weighted average
  const weights = {
    dataCompleteness: 0.3,
    riskAssessment: 0.25,
    policyCompliance: 0.25,
    capabilityMatch: 0.1,
    contextQuality: 0.1,
  };

  const score =
    dataCompleteness * weights.dataCompleteness +
    riskAssessment * weights.riskAssessment +
    policyCompliance * weights.policyCompliance +
    capabilityMatch * weights.capabilityMatch +
    contextQuality * weights.contextQuality;

  // Determine if should escalate
  const shouldEscalate = score < 0.5 || blockers.length > 0;

  if (shouldEscalate) {
    rationale.push(
      `Confidence score (${score.toFixed(2)}) below threshold (0.5) - escalating to human approval`
    );
  }

  if (blockers.length > 0) {
    rationale.push(`Blockers detected: ${blockers.join(', ')}`);
  }

  return {
    score,
    rationale,
    warnings,
    blockers,
    shouldEscalate,
    breakdown: {
      dataCompleteness,
      riskAssessment,
      policyCompliance,
      capabilityMatch,
      contextQuality,
    },
  };
}

/**
 * Assess data completeness
 */
function assessDataCompleteness(
  requiredInputs: string[],
  fusionContext: FusionContext | undefined,
  availableData: Record<string, unknown> | undefined,
  rationale: string[],
  warnings: string[],
  blockers: string[]
): number {
  if (!fusionContext && !availableData) {
    warnings.push('No fusion context or available data provided');
    return 0.3;
  }

  const missingInputs: string[] = [];
  requiredInputs.forEach((input) => {
    // Check if input is available in fusion context or available data
    const hasInFusion = fusionContext && input in fusionContext;
    const hasInData = availableData && input in availableData;

    if (!hasInFusion && !hasInData) {
      missingInputs.push(input);
    }
  });

  if (missingInputs.length === 0) {
    rationale.push('All required data inputs are available');
    return 1.0;
  }

  const completeness = 1 - missingInputs.length / requiredInputs.length;

  if (completeness < 0.5) {
    blockers.push(`Missing critical inputs: ${missingInputs.join(', ')}`);
  } else {
    warnings.push(`Missing some inputs: ${missingInputs.join(', ')}`);
  }

  rationale.push(
    `Data completeness: ${(completeness * 100).toFixed(0)}% (${
      requiredInputs.length - missingInputs.length
    }/${requiredInputs.length} inputs available)`
  );

  return completeness;
}

/**
 * Assess risk level
 */
function assessRisk(
  agentRole: AgentRole,
  task: AutopilotTask,
  mission: AutopilotMission,
  riskTolerance: number,
  rationale: string[],
  warnings: string[]
): number {
  let riskScore = 1.0; // Start with high confidence (low risk)

  // Check mission mode
  if (mission.mode === 'full_auto') {
    riskScore -= 0.1; // Full auto has inherent risk
    warnings.push('Full-auto mode increases risk - reduced confidence by 10%');
  }

  // Check task status - if task has failed before
  if (task.retry_count && task.retry_count > 0) {
    const penalty = Math.min(0.3, task.retry_count * 0.1);
    riskScore -= penalty;
    warnings.push(
      `Task has ${task.retry_count} previous failures - reduced confidence by ${(penalty * 100).toFixed(0)}%`
    );
  }

  // Check risk tolerance match
  const taskRiskLevel = (task.config as Record<string, unknown>)?.riskLevel as number | undefined;
  if (taskRiskLevel && taskRiskLevel > riskTolerance) {
    riskScore -= 0.2;
    warnings.push(
      `Task risk level (${taskRiskLevel.toFixed(2)}) exceeds agent tolerance (${riskTolerance.toFixed(2)})`
    );
  }

  rationale.push(
    `Risk assessment score: ${(riskScore * 100).toFixed(0)}% (agent tolerance: ${(riskTolerance * 100).toFixed(0)}%)`
  );

  return Math.max(0, riskScore);
}

/**
 * Assess policy compliance
 */
function assessPolicyCompliance(
  agentRole: AgentRole,
  task: AutopilotTask,
  mission: AutopilotMission,
  rationale: string[],
  warnings: string[],
  blockers: string[]
): number {
  let complianceScore = 1.0;

  // Check if mission is in valid state
  if (mission.status === 'paused') {
    blockers.push('Mission is paused - cannot execute tasks');
    return 0;
  }

  if (mission.status === 'failed' || mission.status === 'completed') {
    blockers.push(`Mission is ${mission.status} - cannot execute new tasks`);
    return 0;
  }

  // Check task status
  if (task.status === 'completed') {
    blockers.push('Task already completed');
    return 0;
  }

  if (task.status === 'in_progress') {
    warnings.push('Task already in progress - may cause conflicts');
    complianceScore -= 0.2;
  }

  // Check quiet hours compliance (if configured)
  const config = mission.config as Record<string, unknown>;
  if (config.quietHoursStart && config.quietHoursEnd) {
    const now = new Date();
    const currentHour = now.getHours();
    const quietStart = parseInt((config.quietHoursStart as string).split(':')[0]);
    const quietEnd = parseInt((config.quietHoursEnd as string).split(':')[0]);

    const inQuietHours =
      quietStart < quietEnd
        ? currentHour >= quietStart && currentHour < quietEnd
        : currentHour >= quietStart || currentHour < quietEnd;

    if (inQuietHours && agentRole === 'scheduler') {
      warnings.push('Currently in quiet hours - scheduling may be delayed');
      complianceScore -= 0.15;
    }
  }

  rationale.push(`Policy compliance score: ${(complianceScore * 100).toFixed(0)}%`);

  return Math.max(0, complianceScore);
}

/**
 * Assess capability match
 */
function assessCapabilityMatch(
  agentRole: AgentRole,
  task: AutopilotTask,
  capability: ReturnType<typeof getCapability>,
  rationale: string[],
  warnings: string[]
): number {
  // Check if agent role matches task requirement
  if (task.agent_role !== agentRole) {
    warnings.push(`Agent role mismatch: task requires ${task.agent_role}, got ${agentRole}`);
    return 0.5;
  }

  // Check if task type is supported by agent
  const taskType = task.task_type;
  const supportedOutputs = capability.outputs;

  // Simple heuristic: if task type matches any output type, it's a good match
  const hasMatchingOutput = supportedOutputs.some((output) =>
    taskType.toLowerCase().includes(output.toLowerCase())
  );

  if (hasMatchingOutput) {
    rationale.push(`Agent ${agentRole} is well-suited for task type "${taskType}"`);
    return 1.0;
  }

  rationale.push(`Agent ${agentRole} can handle task type "${taskType}" (generic capability)`);
  return 0.8;
}

/**
 * Assess context quality
 */
function assessContextQuality(
  fusionContext: FusionContext | undefined,
  previousTaskResults: Array<{ success: boolean; confidence: number }> | undefined,
  rationale: string[],
  warnings: string[]
): number {
  let qualityScore = 0.5; // Neutral baseline

  // Boost if fusion context is available
  if (fusionContext) {
    qualityScore += 0.3;
    rationale.push('Fusion context available - increased confidence');
  } else {
    warnings.push('No fusion context available - operating with limited context');
  }

  // Boost if previous tasks succeeded
  if (previousTaskResults && previousTaskResults.length > 0) {
    const successRate =
      previousTaskResults.filter((r) => r.success).length / previousTaskResults.length;
    const avgConfidence =
      previousTaskResults.reduce((sum, r) => sum + r.confidence, 0) / previousTaskResults.length;

    if (successRate > 0.8 && avgConfidence > 0.7) {
      qualityScore += 0.2;
      rationale.push(
        `Previous tasks performing well (${(successRate * 100).toFixed(0)}% success, ${(avgConfidence * 100).toFixed(0)}% avg confidence)`
      );
    } else if (successRate < 0.5) {
      qualityScore -= 0.2;
      warnings.push(
        `Previous tasks struggling (${(successRate * 100).toFixed(0)}% success rate) - proceed with caution`
      );
    }
  }

  return Math.max(0, Math.min(1, qualityScore));
}

/**
 * Get confidence level label
 */
export function getConfidenceLabel(score: number): string {
  if (score >= 0.9) return 'Very High';
  if (score >= 0.75) return 'High';
  if (score >= 0.5) return 'Moderate';
  if (score >= 0.3) return 'Low';
  return 'Very Low';
}

/**
 * Format confidence score for UI display
 */
export function formatConfidenceDisplay(confidence: ConfidenceScore): {
  label: string;
  percentage: string;
  color: string;
  shouldEscalate: boolean;
} {
  const label = getConfidenceLabel(confidence.score);
  const percentage = `${(confidence.score * 100).toFixed(0)}%`;

  let color = '#10B981'; // green
  if (confidence.score < 0.75) color = '#F59E0B'; // amber
  if (confidence.score < 0.5) color = '#EF4444'; // red

  return {
    label,
    percentage,
    color,
    shouldEscalate: confidence.shouldEscalate,
  };
}
