/**
 * Core Awareness Layer - Usage Examples
 *
 * This file demonstrates how to use the Core Awareness Layer
 * in various scenarios within the Total Audio platform.
 */

import {
  runAwarenessCycle,
  ingest,
  startObserver,
  stopObserver,
  reason,
  predict,
  recommend,
  pushToAutopilot,
  pushToDashboard,
  getRecentSnapshots,
  getPendingRecommendations,
  type AwarenessEvent,
} from '@total-audio/core-awareness';

// ============================================================================
// EXAMPLE 1: Starting the Observer (Background Processing)
// ============================================================================

export async function startAwarenessObserver() {
  const userId = 'user-123';
  const workspaceId = 'workspace-456';

  // Start the observer with 10-minute snapshot intervals
  startObserver(userId, workspaceId, 10);

  console.log('✅ Core Awareness Observer started');
  console.log('   - Watchers running every 30 minutes');
  console.log('   - Snapshots created every 10 minutes');

  // To stop the observer later:
  // stopObserver();
}

// ============================================================================
// EXAMPLE 2: Ingesting Events from Downstream Systems
// ============================================================================

export async function ingestCampaignEvent() {
  // When a campaign is sent, ingest an event
  const event: Omit<AwarenessEvent, 'id' | 'createdAt'> = {
    workspaceId: 'workspace-456',
    userId: 'user-123',
    eventType: 'campaign_sent',
    sourceSystem: 'email_engine',
    payload: {
      campaignId: 'campaign-789',
      sent: 150,
      targetScene: 'UK-Indie-Electronic',
    },
    metadata: {
      timestamp: new Date().toISOString(),
    },
  };

  await ingest(event);

  console.log('✅ Campaign event ingested into Core Awareness');
}

export async function ingestCreativeAssetEvent() {
  // When a new creative asset is uploaded
  const event: Omit<AwarenessEvent, 'id' | 'createdAt'> = {
    workspaceId: 'workspace-456',
    userId: 'user-123',
    eventType: 'asset_uploaded',
    sourceSystem: 'cis',
    payload: {
      assetId: 'asset-999',
      type: 'track',
      genre: 'indie electronic',
      quality_estimate: 0.88,
    },
    metadata: {},
  };

  await ingest(event);

  console.log('✅ Creative asset event ingested');
}

// ============================================================================
// EXAMPLE 3: Manually Running Awareness Cycle
// ============================================================================

export async function runManualAwarenessCycle() {
  const userId = 'user-123';
  const workspaceId = 'workspace-456';

  console.log('🔄 Running awareness cycle...');

  const result = await runAwarenessCycle(userId, workspaceId);

  console.log('✅ Awareness cycle complete:');
  console.log(`   - Snapshot ID: ${result.snapshot.id}`);
  console.log(`   - ${result.recommendations.length} recommendations generated`);
  console.log(`   - ${result.alerts.length} alerts created`);
  console.log(`   - ${result.signals.length} signals pushed`);

  // Access specific data
  const { scores } = result.snapshot.data;
  console.log('\n📊 Performance Scores:');
  console.log(`   - Momentum: ${(scores.momentum * 100).toFixed(0)}%`);
  console.log(`   - Identity Cohesion: ${(scores.identity_cohesion * 100).toFixed(0)}%`);
  console.log(`   - Creative Quality: ${(scores.creative_quality * 100).toFixed(0)}%`);
  console.log(`   - Burnout Risk: ${(scores.burnout_risk * 100).toFixed(0)}%`);

  return result;
}

// ============================================================================
// EXAMPLE 4: Using Individual Components
// ============================================================================

export async function useReasoningEngineDirectly() {
  // Import integration data first
  const { aggregateIntegrationData } = await import('@total-audio/core-awareness');

  const userId = 'user-123';
  const workspaceId = 'workspace-456';

  // Gather data from all systems
  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  // Run reasoning engine
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

  console.log('🧠 Reasoning Results:');
  console.log(`   - ${reasoningResult.correlations.length} correlations found`);
  console.log(`   - ${reasoningResult.mismatches.length} mismatches detected`);
  console.log(`   - ${reasoningResult.opportunities.length} opportunities identified`);
  console.log(`   - ${reasoningResult.risks.length} risks flagged`);

  // Example: Print first opportunity
  if (reasoningResult.opportunities.length > 0) {
    const opp = reasoningResult.opportunities[0];
    console.log(`\n🎯 Top Opportunity: ${opp.description}`);
    console.log(`   Suggested actions:`);
    opp.suggestedActions.forEach((action) => {
      console.log(`   - ${action}`);
    });
  }

  return reasoningResult;
}

export async function usePredictionEngineDirectly() {
  const { aggregateIntegrationData } = await import('@total-audio/core-awareness');

  const userId = 'user-123';
  const workspaceId = 'workspace-456';

  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  // Run prediction engine
  const predictionResult = await predict({
    campaignMetrics: integrationData.campaignMetrics,
    migClusters: integrationData.migClusters,
    cmgFingerprints: integrationData.cmgFingerprints,
    autopilotStates: integrationData.autopilotStates,
    malStates: integrationData.malStates,
  });

  console.log('🔮 Prediction Results:');
  console.log(`   Short-term direction: ${predictionResult.shortTermTrajectory.direction}`);
  console.log(
    `   Medium-term direction: ${predictionResult.mediumTermTrajectory.direction}`
  );
  console.log(
    `   Momentum score: ${(predictionResult.scores.momentum * 100).toFixed(0)}%`
  );
  console.log(
    `   Burnout risk: ${(predictionResult.scores.burnoutRisk * 100).toFixed(0)}%`
  );

  // Check for inflection points
  if (predictionResult.shortTermTrajectory.inflectionPoints.length > 0) {
    console.log('\n⚠️  Inflection points detected:');
    predictionResult.shortTermTrajectory.inflectionPoints.forEach((point) => {
      console.log(`   - ${point.type} in ${point.metric} expected ${point.expectedAt}`);
    });
  }

  return predictionResult;
}

// ============================================================================
// EXAMPLE 5: Pushing Signals to Downstream Systems
// ============================================================================

export async function pushSignalToAutopilot() {
  // Push a signal recommending autopilot escalation
  const signal = await pushToAutopilot({
    workspaceId: 'workspace-456',
    userId: 'user-123',
    signalType: 'recommend_escalation',
    payload: {
      campaignId: 'campaign-789',
      reason: 'High reply rate detected - opportunity for faster follow-up',
      recommendedPhase: 'accelerated_followup',
    },
    confidence: 0.85,
    status: 'pending',
  });

  console.log('✅ Signal pushed to Autopilot:');
  console.log(`   Signal ID: ${signal.id}`);
  console.log(`   Type: ${signal.signalType}`);
  console.log(`   Confidence: ${(signal.confidence * 100).toFixed(0)}%`);

  return signal;
}

export async function pushInsightToDashboard() {
  // Push a high-level insight to the dashboard
  const signal = await pushToDashboard({
    workspaceId: 'workspace-456',
    userId: 'user-123',
    signalType: 'scene_momentum_alert',
    payload: {
      scene: 'UK-Indie-Electronic',
      momentum: 0.85,
      message: 'High momentum detected in UK Indie Electronic scene',
      suggestedAction: 'Prioritize outreach to this scene',
    },
    confidence: 0.78,
    status: 'pending',
  });

  console.log('✅ Insight pushed to Dashboard');

  return signal;
}

// ============================================================================
// EXAMPLE 6: Retrieving Data for UI
// ============================================================================

export async function getSnapshotsForDashboard() {
  const workspaceId = 'workspace-456';
  const userId = 'user-123';

  // Get last 10 snapshots
  const snapshots = await getRecentSnapshots(workspaceId, userId, 10);

  console.log(`📸 Retrieved ${snapshots.length} recent snapshots`);

  // Display trend
  if (snapshots.length > 1) {
    const latest = snapshots[0].data.scores.momentum;
    const previous = snapshots[1].data.scores.momentum;
    const trend = latest > previous ? '📈 UP' : '📉 DOWN';

    console.log(`   Momentum trend: ${trend}`);
    console.log(`   Latest: ${(latest * 100).toFixed(0)}%`);
    console.log(`   Previous: ${(previous * 100).toFixed(0)}%`);
  }

  return snapshots;
}

export async function getPendingRecommendationsForUI() {
  const workspaceId = 'workspace-456';
  const userId = 'user-123';

  const recommendations = await getPendingRecommendations(workspaceId, userId, 20);

  console.log(`📋 ${recommendations.length} pending recommendations`);

  // Group by priority
  const critical = recommendations.filter((r) => r.priority === 'critical');
  const high = recommendations.filter((r) => r.priority === 'high');

  console.log(`   - ${critical.length} critical`);
  console.log(`   - ${high.length} high priority`);

  return recommendations;
}

// ============================================================================
// EXAMPLE 7: Complete Integration Example
// ============================================================================

export async function completeIntegrationExample() {
  const userId = 'user-123';
  const workspaceId = 'workspace-456';

  console.log('🚀 Complete Awareness Integration Example\n');

  // Step 1: Start observer (runs in background)
  console.log('1️⃣  Starting background observer...');
  startObserver(userId, workspaceId, 10);

  // Step 2: Ingest some events
  console.log('2️⃣  Ingesting events...');
  await ingestCampaignEvent();
  await ingestCreativeAssetEvent();

  // Step 3: Manually trigger awareness cycle
  console.log('3️⃣  Running awareness cycle...');
  const result = await runAwarenessCycle(userId, workspaceId);

  // Step 4: Check for high-priority items
  console.log('4️⃣  Checking for critical items...');

  const criticalAlerts = result.alerts.filter((a) => a.severity === 'critical');
  const highPriorityRecs = result.recommendations.filter((r) => r.priority === 'high');

  if (criticalAlerts.length > 0) {
    console.log(`\n⚠️  ${criticalAlerts.length} CRITICAL ALERTS:`);
    criticalAlerts.forEach((alert) => {
      console.log(`   - ${alert.title}`);
    });
  }

  if (highPriorityRecs.length > 0) {
    console.log(`\n📌 ${highPriorityRecs.length} HIGH-PRIORITY RECOMMENDATIONS:`);
    highPriorityRecs.forEach((rec) => {
      console.log(`   - ${rec.title}`);
    });
  }

  // Step 5: Display key metrics
  console.log('\n📊 KEY METRICS:');
  const { scores, currentState } = result.snapshot.data;

  console.log(`   Momentum: ${(scores.momentum * 100).toFixed(0)}%`);
  console.log(`   Identity Cohesion: ${(scores.identity_cohesion * 100).toFixed(0)}%`);
  console.log(`   Active Campaigns: ${currentState.activeCampaigns}`);
  console.log(`   Recent Coverage: ${currentState.recentCoverage}`);

  console.log('\n✅ Integration example complete');

  // Clean up
  stopObserver();

  return result;
}

// ============================================================================
// EXAMPLE 8: Mock Data for Testing
// ============================================================================

export const mockIntegrationData = {
  fusionContext: {
    fusionId: 'fusion-001',
    contextualSignals: [
      {
        source: 'cmg',
        signal: 'high_quality_creative',
        confidence: 0.88,
      },
    ],
    orchestrationHints: [],
  },
  cmgFingerprints: [
    {
      fingerprintId: 'fp-001',
      quality_score: 0.88,
      consistency_score: 0.82,
      evolution_rate: 0.65,
      creative_motifs: ['indie', 'electronic', 'experimental', 'atmospheric'],
    },
  ],
  migClusters: [
    {
      clusterId: 'cluster-001',
      scene: 'UK-Indie-Electronic',
      microgenre: 'indie electronic',
      momentum: 0.85,
    },
    {
      clusterId: 'cluster-002',
      scene: 'Experimental-Ambient',
      microgenre: 'experimental ambient',
      momentum: 0.62,
    },
  ],
  identityProfile: {
    profileId: 'profile-001',
    narrative: {
      themes: ['indie', 'electronic', 'experimental'],
      archetype: 'The Innovator',
    },
    cohesionScore: 0.86,
  },
  autopilotStates: [
    {
      missionId: 'mission-001',
      isActive: true,
      currentPhase: 'outreach',
    },
    {
      missionId: 'mission-002',
      isActive: true,
      currentPhase: 'followup',
    },
  ],
  malStates: [
    {
      flowId: 'flow-001',
      isActive: true,
      currentStep: 3,
    },
  ],
  campaignMetrics: [
    {
      campaignId: 'campaign-001',
      sent: 150,
      openRate: 0.38,
      replyRate: 0.14,
      coverage: 8,
      replied: 21,
    },
    {
      campaignId: 'campaign-002',
      sent: 120,
      openRate: 0.32,
      replyRate: 0.09,
      coverage: 4,
      replied: 11,
    },
  ],
  creativeAssets: [
    {
      assetId: 'asset-001',
      type: 'track',
      quality: 0.91,
    },
    {
      assetId: 'asset-002',
      type: 'cover_art',
      quality: 0.85,
    },
  ],
};

// ============================================================================
// Run Example (for demonstration)
// ============================================================================

if (require.main === module) {
  console.log('🎯 Core Awareness Layer - Usage Examples\n');
  console.log('Run individual examples by importing the functions you need.\n');
  console.log('Available examples:');
  console.log('  - startAwarenessObserver()');
  console.log('  - ingestCampaignEvent()');
  console.log('  - runManualAwarenessCycle()');
  console.log('  - useReasoningEngineDirectly()');
  console.log('  - usePredictionEngineDirectly()');
  console.log('  - pushSignalToAutopilot()');
  console.log('  - getSnapshotsForDashboard()');
  console.log('  - completeIntegrationExample()');
  console.log('\nSee examples/usage-examples.ts for full code.\n');
}
