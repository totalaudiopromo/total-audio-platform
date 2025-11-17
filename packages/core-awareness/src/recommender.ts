/**
 * Recommender
 * Generates recommendations for downstream systems
 */

import type {
  RecommendationInput,
  RecommendationOutput,
  AwarenessRecommendation,
  AwarenessSignal,
  TargetSystem,
} from './types';
import { logger } from './utils/logger';

export async function recommend(input: RecommendationInput): Promise<RecommendationOutput> {
  logger.info('Generating recommendations', { target: input.targetSystem });

  const recommendations: AwarenessRecommendation[] = [];
  const signals: AwarenessSignal[] = [];

  // Generate recommendations based on target system
  switch (input.targetSystem) {
    case 'autopilot':
      recommendations.push(...generateAutopilotRecommendations(input));
      signals.push(...generateAutopilotSignals(input));
      break;

    case 'mal':
      recommendations.push(...generateMALRecommendations(input));
      signals.push(...generateMALSignals(input));
      break;

    case 'dashboard':
      recommendations.push(...generateDashboardRecommendations(input));
      signals.push(...generateDashboardSignals(input));
      break;

    case 'cis':
      recommendations.push(...generateCISRecommendations(input));
      signals.push(...generateCISSignals(input));
      break;

    case 'identity_kernel':
      recommendations.push(...generateIdentityKernelRecommendations(input));
      signals.push(...generateIdentityKernelSignals(input));
      break;

    case 'cmg':
      signals.push(...generateCMGSignals(input));
      break;

    case 'scenes_engine':
      signals.push(...generateScenesEngineSignals(input));
      break;

    case 'mig':
      signals.push(...generateMIGSignals(input));
      break;
  }

  return { recommendations, signals };
}

function generateAutopilotRecommendations(input: RecommendationInput): AwarenessRecommendation[] {
  const recs: Partial<AwarenessRecommendation>[] = [];

  // Escalation suggestions
  if (input.reasoning.opportunities.some((o) => o.type === 'reply_momentum')) {
    recs.push({
      targetSystem: 'autopilot',
      recommendationType: 'escalate_follow_ups',
      title: 'Escalate Follow-Up Cadence',
      description: 'Reply momentum detected - accelerate follow-up schedule',
      data: { suggestedCadence: 'daily' },
      confidence: 0.82,
      priority: 'high',
      status: 'pending',
    });
  }

  // Phase shift suggestions
  if (input.reasoning.risks.some((r) => r.type === 'campaign_stall')) {
    recs.push({
      targetSystem: 'autopilot',
      recommendationType: 'shift_phase',
      title: 'Shift to Reactivation Phase',
      description: 'Campaign stalls detected - consider reactivation strategies',
      data: { suggestedPhase: 'reactivation' },
      confidence: 0.75,
      priority: 'medium',
      status: 'pending',
    });
  }

  return recs as AwarenessRecommendation[];
}

function generateAutopilotSignals(input: RecommendationInput): AwarenessSignal[] {
  const signals: Partial<AwarenessSignal>[] = [];

  for (const opportunity of input.reasoning.opportunities) {
    if (opportunity.type === 'scene_spike') {
      signals.push({
        targetSystem: 'autopilot',
        signalType: 'scene_momentum_spike',
        payload: opportunity.data,
        confidence: opportunity.confidence,
        status: 'pending',
      });
    }
  }

  return signals as AwarenessSignal[];
}

function generateMALRecommendations(input: RecommendationInput): AwarenessRecommendation[] {
  const recs: Partial<AwarenessRecommendation>[] = [];

  if (input.reasoning.opportunities.some((o) => o.type === 'reply_momentum')) {
    recs.push({
      targetSystem: 'mal',
      recommendationType: 'activate_workflow',
      title: 'Activate Warm Contact Workflow',
      description: 'High engagement detected - activate nurture sequence',
      data: { workflowType: 'warm_contact_reactivation' },
      confidence: 0.78,
      priority: 'medium',
      status: 'pending',
    });
  }

  return recs as AwarenessRecommendation[];
}

function generateMALSignals(input: RecommendationInput): AwarenessSignal[] {
  const signals: Partial<AwarenessSignal>[] = [];

  for (const risk of input.reasoning.risks) {
    if (risk.type === 'contact_fatigue') {
      signals.push({
        targetSystem: 'mal',
        signalType: 'contact_fatigue_detected',
        payload: risk.data,
        confidence: risk.probability,
        status: 'pending',
      });
    }
  }

  return signals as AwarenessSignal[];
}

function generateDashboardRecommendations(input: RecommendationInput): AwarenessRecommendation[] {
  const recs: Partial<AwarenessRecommendation>[] = [];

  for (const opportunity of input.reasoning.opportunities) {
    if (opportunity.type === 'scene_spike') {
      recs.push({
        targetSystem: 'dashboard',
        recommendationType: 'highlight_insight',
        title: 'Scene Momentum Alert',
        description: opportunity.description,
        data: opportunity.data,
        confidence: opportunity.confidence,
        priority: 'high',
        status: 'pending',
      });
    }
  }

  return recs as AwarenessRecommendation[];
}

function generateDashboardSignals(input: RecommendationInput): AwarenessSignal[] {
  const signals: Partial<AwarenessSignal>[] = [];

  signals.push({
    targetSystem: 'dashboard',
    signalType: 'snapshot_update',
    payload: {
      scores: input.currentSnapshot.scores,
      trajectories: input.currentSnapshot.trajectories,
    },
    confidence: 1.0,
    status: 'pending',
  });

  return signals as AwarenessSignal[];
}

function generateCISRecommendations(input: RecommendationInput): AwarenessRecommendation[] {
  const recs: Partial<AwarenessRecommendation>[] = [];

  for (const mismatch of input.reasoning.mismatches) {
    if (mismatch.type === 'identity_vs_output') {
      recs.push({
        targetSystem: 'cis',
        recommendationType: 'creative_prompt',
        title: 'Realign Creative with Identity',
        description: 'Creative output deviating from core identity',
        data: { suggestedThemes: ['authenticity', 'core_values'] },
        confidence: 0.72,
        priority: 'medium',
        status: 'pending',
      });
    }
  }

  return recs as AwarenessRecommendation[];
}

function generateCISSignals(input: RecommendationInput): AwarenessSignal[] {
  const signals: Partial<AwarenessSignal>[] = [];

  for (const mismatch of input.reasoning.mismatches) {
    if (mismatch.type === 'creative_vs_scene') {
      signals.push({
        targetSystem: 'cis',
        signalType: 'scene_drift_detected',
        payload: mismatch.data,
        confidence: 0.75,
        status: 'pending',
      });
    }
  }

  return signals as AwarenessSignal[];
}

function generateIdentityKernelRecommendations(input: RecommendationInput): AwarenessRecommendation[] {
  const recs: Partial<AwarenessRecommendation>[] = [];

  for (const mismatch of input.reasoning.mismatches) {
    if (mismatch.type === 'identity_vs_output') {
      recs.push({
        targetSystem: 'identity_kernel',
        recommendationType: 'refresh_narrative',
        title: 'Refresh Identity Narrative',
        description: 'Identity kernel and creative output misaligned',
        data: mismatch.data,
        confidence: 0.68,
        priority: 'high',
        status: 'pending',
      });
    }
  }

  return recs as AwarenessRecommendation[];
}

function generateIdentityKernelSignals(input: RecommendationInput): AwarenessSignal[] {
  const signals: Partial<AwarenessSignal>[] = [];

  signals.push({
    targetSystem: 'identity_kernel',
    signalType: 'cohesion_update',
    payload: {
      cohesionScore: input.currentSnapshot.scores.identity_cohesion,
      sceneAlignment: input.currentSnapshot.scores.scene_alignment,
    },
    confidence: 0.85,
    status: 'pending',
  });

  return signals as AwarenessSignal[];
}

function generateCMGSignals(input: RecommendationInput): AwarenessSignal[] {
  const signals: Partial<AwarenessSignal>[] = [];

  for (const correlation of input.reasoning.correlations) {
    if (correlation.type === 'creative_identity_drift') {
      signals.push({
        targetSystem: 'cmg',
        signalType: 'creative_drift_detected',
        payload: correlation.data,
        confidence: correlation.strength,
        status: 'pending',
      });
    }
  }

  return signals as AwarenessSignal[];
}

function generateScenesEngineSignals(input: RecommendationInput): AwarenessSignal[] {
  const signals: Partial<AwarenessSignal>[] = [];

  for (const opportunity of input.reasoning.opportunities) {
    if (opportunity.type === 'scene_spike') {
      signals.push({
        targetSystem: 'scenes_engine',
        signalType: 'scene_spike_acknowledged',
        payload: opportunity.data,
        confidence: opportunity.confidence,
        status: 'pending',
      });
    }
  }

  return signals as AwarenessSignal[];
}

function generateMIGSignals(input: RecommendationInput): AwarenessSignal[] {
  const signals: Partial<AwarenessSignal>[] = [];

  for (const correlation of input.reasoning.correlations) {
    if (correlation.type === 'scene_creative_alignment') {
      signals.push({
        targetSystem: 'mig',
        signalType: 'alignment_update',
        payload: correlation.data,
        confidence: correlation.strength,
        status: 'pending',
      });
    }
  }

  return signals as AwarenessSignal[];
}
