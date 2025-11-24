/**
 * Adaptive Loop Engine
 *
 * Self-adjusting system that learns from mission outcomes and adapts behavior
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentRole } from '../types';

export interface AdaptiveMetrics {
  missionId: string;
  successRate: number;
  avgConfidence: number;
  avgLatency: number;
  approvalRate: number;
  errorRate: number;
  userSatisfaction?: number;
}

export interface AdaptiveAdjustment {
  parameter: string;
  oldValue: unknown;
  newValue: unknown;
  reason: string;
  confidence: number;
  appliedAt: string;
}

export interface AdaptiveState {
  agentRole: AgentRole;
  riskTolerance: number;
  confidenceThreshold: number;
  retryAttempts: number;
  aggressiveness: number; // 0-1 scale
  learningRate: number; // How quickly to adapt
  adjustments: AdaptiveAdjustment[];
}

export const DEFAULT_ADAPTIVE_STATE: Omit<AdaptiveState, 'agentRole' | 'adjustments'> = {
  riskTolerance: 0.5,
  confidenceThreshold: 0.7,
  retryAttempts: 3,
  aggressiveness: 0.5,
  learningRate: 0.1,
};

/**
 * Analyze mission performance and recommend adjustments
 */
export async function analyzeMissionPerformance(
  supabase: SupabaseClient,
  missionId: string
): Promise<AdaptiveMetrics> {
  // Get telemetry summary
  const { data: summary } = await supabase.rpc('get_mission_telemetry_summary', {
    p_mission_id: missionId,
  });

  if (!summary) {
    return {
      missionId,
      successRate: 0,
      avgConfidence: 0,
      avgLatency: 0,
      approvalRate: 0,
      errorRate: 0,
    };
  }

  return {
    missionId,
    successRate: summary.success_rate || 0,
    avgConfidence: summary.avg_confidence || 0,
    avgLatency: summary.avg_latency_ms || 0,
    approvalRate: summary.approval_rate || 0,
    errorRate: (summary.total_errors / (summary.total_events || 1)) || 0,
  };
}

/**
 * Generate adaptive adjustments based on performance
 */
export function generateAdjustments(
  metrics: AdaptiveMetrics,
  currentState: AdaptiveState
): AdaptiveAdjustment[] {
  const adjustments: AdaptiveAdjustment[] = [];

  // Adjust risk tolerance based on success rate
  if (metrics.successRate > 0.9) {
    // High success - can increase risk tolerance
    const newRiskTolerance = Math.min(
      1.0,
      currentState.riskTolerance + currentState.learningRate
    );
    adjustments.push({
      parameter: 'riskTolerance',
      oldValue: currentState.riskTolerance,
      newValue: newRiskTolerance,
      reason: `High success rate (${(metrics.successRate * 100).toFixed(0)}%) - increasing risk tolerance`,
      confidence: 0.8,
      appliedAt: new Date().toISOString(),
    });
  } else if (metrics.successRate < 0.6) {
    // Low success - decrease risk tolerance
    const newRiskTolerance = Math.max(
      0.1,
      currentState.riskTolerance - currentState.learningRate
    );
    adjustments.push({
      parameter: 'riskTolerance',
      oldValue: currentState.riskTolerance,
      newValue: newRiskTolerance,
      reason: `Low success rate (${(metrics.successRate * 100).toFixed(0)}%) - decreasing risk tolerance`,
      confidence: 0.9,
      appliedAt: new Date().toISOString(),
    });
  }

  // Adjust confidence threshold based on approval rate
  if (metrics.approvalRate < 0.3) {
    // Too many rejections - increase confidence threshold
    const newThreshold = Math.min(
      0.95,
      currentState.confidenceThreshold + currentState.learningRate
    );
    adjustments.push({
      parameter: 'confidenceThreshold',
      oldValue: currentState.confidenceThreshold,
      newValue: newThreshold,
      reason: `Low approval rate (${(metrics.approvalRate * 100).toFixed(0)}%) - increasing confidence threshold`,
      confidence: 0.85,
      appliedAt: new Date().toISOString(),
    });
  } else if (metrics.approvalRate > 0.95) {
    // Almost all approved - can lower threshold slightly
    const newThreshold = Math.max(
      0.5,
      currentState.confidenceThreshold - currentState.learningRate * 0.5
    );
    adjustments.push({
      parameter: 'confidenceThreshold',
      oldValue: currentState.confidenceThreshold,
      newValue: newThreshold,
      reason: `Very high approval rate (${(metrics.approvalRate * 100).toFixed(0)}%) - lowering confidence threshold`,
      confidence: 0.7,
      appliedAt: new Date().toISOString(),
    });
  }

  // Adjust retry attempts based on error rate
  if (metrics.errorRate > 0.3 && currentState.retryAttempts < 5) {
    adjustments.push({
      parameter: 'retryAttempts',
      oldValue: currentState.retryAttempts,
      newValue: currentState.retryAttempts + 1,
      reason: `High error rate (${(metrics.errorRate * 100).toFixed(0)}%) - increasing retry attempts`,
      confidence: 0.75,
      appliedAt: new Date().toISOString(),
    });
  } else if (metrics.errorRate < 0.05 && currentState.retryAttempts > 1) {
    adjustments.push({
      parameter: 'retryAttempts',
      oldValue: currentState.retryAttempts,
      newValue: currentState.retryAttempts - 1,
      reason: `Low error rate (${(metrics.errorRate * 100).toFixed(0)}%) - decreasing retry attempts`,
      confidence: 0.6,
      appliedAt: new Date().toISOString(),
    });
  }

  // Adjust aggressiveness based on avg confidence
  if (metrics.avgConfidence > 0.85) {
    const newAggr = Math.min(1.0, currentState.aggressiveness + currentState.learningRate);
    adjustments.push({
      parameter: 'aggressiveness',
      oldValue: currentState.aggressiveness,
      newValue: newAggr,
      reason: `High average confidence (${(metrics.avgConfidence * 100).toFixed(0)}%) - increasing aggressiveness`,
      confidence: 0.8,
      appliedAt: new Date().toISOString(),
    });
  } else if (metrics.avgConfidence < 0.5) {
    const newAggr = Math.max(0.1, currentState.aggressiveness - currentState.learningRate);
    adjustments.push({
      parameter: 'aggressiveness',
      oldValue: currentState.aggressiveness,
      newValue: newAggr,
      reason: `Low average confidence (${(metrics.avgConfidence * 100).toFixed(0)}%) - decreasing aggressiveness`,
      confidence: 0.85,
      appliedAt: new Date().toISOString(),
    });
  }

  return adjustments;
}

/**
 * Apply adjustments to adaptive state
 */
export function applyAdjustments(
  currentState: AdaptiveState,
  adjustments: AdaptiveAdjustment[]
): AdaptiveState {
  const newState = { ...currentState };

  adjustments.forEach((adj) => {
    switch (adj.parameter) {
      case 'riskTolerance':
        newState.riskTolerance = adj.newValue as number;
        break;
      case 'confidenceThreshold':
        newState.confidenceThreshold = adj.newValue as number;
        break;
      case 'retryAttempts':
        newState.retryAttempts = adj.newValue as number;
        break;
      case 'aggressiveness':
        newState.aggressiveness = adj.newValue as number;
        break;
    }
  });

  newState.adjustments = [...currentState.adjustments, ...adjustments];

  return newState;
}

/**
 * Run adaptive loop for a completed mission
 */
export async function runAdaptiveLoop(
  supabase: SupabaseClient,
  missionId: string,
  agentRole: AgentRole
): Promise<{ adjustments: AdaptiveAdjustment[]; newState: AdaptiveState }> {
  // Get current adaptive state (from database or default)
  const currentState: AdaptiveState = {
    ...DEFAULT_ADAPTIVE_STATE,
    agentRole,
    adjustments: [],
  };

  // Analyze performance
  const metrics = await analyzeMissionPerformance(supabase, missionId);

  // Generate adjustments
  const adjustments = generateAdjustments(metrics, currentState);

  // Apply adjustments
  const newState = applyAdjustments(currentState, adjustments);

  return { adjustments, newState };
}
