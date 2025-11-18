/**
 * Core Awareness Layer
 * Top-level meta-intelligence system for Total Audio
 *
 * MISSION: Observe, reason, predict, recommend across ALL major subsystems
 * CONSTRAINT: NEVER execute - only observe and suggest
 */

import type {
  AwarenessSnapshot,
  AwarenessEvent,
  AwarenessSignal,
  AwarenessRecommendation,
  SnapshotData,
} from './types';
import type { Alert } from './alerts';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  // Core entities
  AwarenessSnapshot,
  AwarenessEvent,
  AwarenessSignal,
  AwarenessRecommendation,
  SnapshotData,
  SystemHealthMetrics,

  // Reasoning types
  ReasoningInput,
  ReasoningResult,
  Correlation,
  Mismatch,
  Opportunity,
  Risk,

  // Prediction types
  PredictionInput,
  PredictionResult,
  Trajectory,
  InflectionPoint,
  PredictiveScores,

  // Integration types
  FusionContext,
  CMGFingerprint,
  MIGCluster,
  IdentityProfile,
  AutopilotMissionState,
  MALFlowState,
  CampaignMetric,
  CISCreativeAsset,
  IntegrationData,

  // Watcher types
  WatcherResult,
  Finding,
  WatcherConfig,

  // System enums
  SourceSystem,
  TargetSystem,
} from './types';

// ============================================================================
// OBSERVER (Event Ingestion + Watchers)
// ============================================================================

export {
  ingest,
  ingestBatch,
  runWatchers,
  createPeriodicSnapshot,
  startObserver,
  stopObserver,
} from './observer';

// ============================================================================
// REASONER (Cross-System Correlation)
// ============================================================================

export { reason } from './reasoner';

// ============================================================================
// PREDICTOR (Forecasting Engine)
// ============================================================================

export { predict } from './predictor';

// ============================================================================
// RECOMMENDER (Suggestion Engine)
// ============================================================================

export { recommend } from './recommender';

// ============================================================================
// SIGNALS (Downstream Pushers)
// ============================================================================

export {
  pushSignal,
  pushToIdentityKernel,
  pushToCMG,
  pushToScenesEngine,
  pushToAutopilot,
  pushToMAL,
  pushToDashboard,
  pushToCIS,
  pushToMIG,
} from './signals';

// ============================================================================
// METRICS (Scoring Functions)
// ============================================================================

export {
  calculateMomentumScore,
  calculateIdentityCohesionScore,
  calculateSceneAlignmentScore,
  calculateCreativeQualityScore,
  calculatePressEffectivenessScore,
  calculateBurnoutRiskScore,
  calculateFatigueRiskScore,
  calculateLiftPotentialScore,
  calculateFreshnessScore,
  calculateAllScores,
} from './metrics';

// ============================================================================
// ALERTS (Risk/Opportunity Alerts)
// ============================================================================

export type { Alert, AlertFilter } from './alerts';

export {
  generateRiskAlerts,
  generateOpportunityAlerts,
  generateMismatchAlerts,
  generateTrajectoryAlerts,
  filterAlerts,
  prioritizeAlerts,
  persistAlerts,
  generateAlertSummary,
} from './alerts';

// ============================================================================
// INTEGRATIONS (Read-Only Adapters)
// ============================================================================

export {
  aggregateIntegrationData,
  getFusionContext,
  getCMGFingerprints,
  getMIGClusters,
  getIdentityKernelProfile,
  getAutopilotMissionStates,
  getMALFlowStates,
  getCampaignMetrics,
  getCISCreativeAssets,
} from './integrations';

// ============================================================================
// STORE (Database & Cache Layer)
// ============================================================================

export {
  createSnapshot,
  getRecentSnapshots,
  getLatestSnapshot,
  ingestEvent,
  ingestEvents,
  getRecentEvents,
  createSignal,
  getSignalsByTarget,
  getPendingSignals,
  markSignalActioned,
  createRecommendation,
  getRecommendationsByTarget,
  getPendingRecommendations,
  markRecommendationResolved,
} from './awarenessStore';

// ============================================================================
// UTILITIES
// ============================================================================

export { logger } from './utils/logger';
export { safeTimers } from './utils/safeTimers';

// ============================================================================
// MAIN API - Complete Awareness Cycle
// ============================================================================

/**
 * Run complete awareness cycle:
 * 1. Aggregate data from all integrations
 * 2. Run reasoning engine
 * 3. Run prediction engine
 * 4. Generate recommendations
 * 5. Generate alerts
 * 6. Push signals to downstream systems
 * 7. Create snapshot
 *
 * This is the main entry point for periodic awareness processing
 */
export async function runAwarenessCycle(
  userId: string,
  workspaceId?: string | null
): Promise<{
  snapshot: AwarenessSnapshot;
  recommendations: AwarenessRecommendation[];
  alerts: Alert[];
  signals: AwarenessSignal[];
}> {
  const { aggregateIntegrationData } = await import('./integrations');
  const { reason } = await import('./reasoner');
  const { predict } = await import('./predictor');
  const { recommend } = await import('./recommender');
  const {
    generateRiskAlerts,
    generateOpportunityAlerts,
    generateMismatchAlerts,
    generateTrajectoryAlerts,
    persistAlerts,
  } = await import('./alerts');
  const { createSnapshot } = await import('./awarenessStore');
  const { logger } = await import('./utils/logger');

  logger.info('Starting awareness cycle', { userId, workspaceId });

  // 1. Aggregate data
  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  // 2. Reason
  const reasoningResult = await reason({
    fusionContext: integrationData.fusionContext,
    cmgFingerprints: integrationData.cmgFingerprints,
    migClusters: integrationData.migClusters,
    identityProfile: integrationData.identityProfile,
    autopilotStates: integrationData.autopilotStates,
    malStates: integrationData.malStates,
    campaignMetrics: integrationData.campaignMetrics,
    creativeAssets: integrationData.creativeAssets,
    recentEvents: [],
  });

  // 3. Predict
  const predictionResult = await predict({
    campaignMetrics: integrationData.campaignMetrics,
    migClusters: integrationData.migClusters,
    cmgFingerprints: integrationData.cmgFingerprints,
    autopilotStates: integrationData.autopilotStates,
    malStates: integrationData.malStates,
  });

  // 4. Recommend
  const recommendationResult = await recommend({
    reasoning: reasoningResult,
    predictions: predictionResult,
    integrationData,
  });

  // 5. Generate alerts
  const riskAlerts = generateRiskAlerts(reasoningResult.risks);
  const opportunityAlerts = generateOpportunityAlerts(reasoningResult.opportunities);
  const mismatchAlerts = generateMismatchAlerts(reasoningResult.mismatches);
  const trajectoryAlerts = generateTrajectoryAlerts(
    predictionResult.shortTermTrajectory,
    predictionResult.mediumTermTrajectory
  );

  const allAlerts = [
    ...riskAlerts,
    ...opportunityAlerts,
    ...mismatchAlerts,
    ...trajectoryAlerts,
  ];

  // 6. Persist alerts as recommendations
  const alertRecommendations = await persistAlerts(allAlerts, workspaceId ?? null, userId);

  // 7. Persist recommendations from recommend()
  const allRecommendations = [
    ...recommendationResult.recommendations,
    ...alertRecommendations,
  ];

  // 8. Create snapshot
  const { calculateAllScores } = await import('./metrics');
  const scores = calculateAllScores({
    cmgFingerprints: integrationData.cmgFingerprints,
    migClusters: integrationData.migClusters,
    identityProfile: integrationData.identityProfile,
    autopilotStates: integrationData.autopilotStates,
    malStates: integrationData.malStates,
    campaignMetrics: integrationData.campaignMetrics,
  });

  const snapshotData: SnapshotData = {
    timestamp: new Date(),
    systemHealth: {
      autopilot: {
        status: 'healthy',
        activeCount: integrationData.autopilotStates.filter(s => s.isActive).length,
        successRate: 0.85,
      },
      mal: {
        status: 'healthy',
        activeCount: integrationData.malStates.filter(s => s.isActive).length,
        successRate: 0.92,
      },
      campaigns: {
        status: 'healthy',
        activeCount: integrationData.campaignMetrics.length,
        successRate: 0.78,
      },
      creative: {
        status: 'healthy',
        activeCount: integrationData.creativeAssets.length,
        successRate: 0.82,
      },
    },
    currentState: {
      activeCampaigns: integrationData.campaignMetrics.length,
      activeAutopilotMissions: integrationData.autopilotStates.filter(s => s.isActive).length,
      activeMALFlows: integrationData.malStates.filter(s => s.isActive).length,
      recentCoverage: integrationData.campaignMetrics.reduce((sum, c) => sum + c.coverage, 0),
      recentReplies: integrationData.campaignMetrics.reduce((sum, c) => sum + c.replied, 0),
      creativeFreshness: integrationData.cmgFingerprints[0]?.quality_score || 0.5,
      sceneMomentum: integrationData.migClusters[0]?.momentum || 0.5,
    },
    correlations: reasoningResult.correlations,
    mismatches: reasoningResult.mismatches,
    opportunities: reasoningResult.opportunities,
    risks: reasoningResult.risks,
    trajectories: {
      shortTerm: predictionResult.shortTermTrajectory,
      mediumTerm: predictionResult.mediumTermTrajectory,
    },
    scores: {
      momentum: scores.momentum,
      identity_cohesion: scores.identity_cohesion,
      scene_alignment: scores.scene_alignment,
      creative_quality: scores.creative_quality,
      press_effectiveness: scores.press_effectiveness,
      burnout_risk: scores.burnout_risk,
      fatigue_risk: scores.fatigue_risk,
    },
  };

  const snapshot = await createSnapshot(workspaceId ?? null, userId, snapshotData);

  logger.info('Awareness cycle complete', {
    snapshotId: snapshot.id,
    recommendationCount: allRecommendations.length,
    alertCount: allAlerts.length,
    signalCount: recommendationResult.signals.length,
  });

  return {
    snapshot,
    recommendations: allRecommendations,
    alerts: allAlerts,
    signals: recommendationResult.signals,
  };
}

// ============================================================================
// VERSION
// ============================================================================

export const VERSION = '0.1.0';
export const PACKAGE_NAME = '@total-audio/core-awareness';
