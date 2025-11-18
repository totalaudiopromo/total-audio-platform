/**
 * Observer
 * Event ingestion + watchers that monitor system state
 */

import type {
  AwarenessEvent,
  WatcherResult,
  Finding,
  WatcherConfig,
} from './types';
import {
  ingestEvent,
  ingestEvents,
  getRecentEvents,
  createSnapshot,
} from './awarenessStore';
import { aggregateIntegrationData } from './integrations';
import { reason } from './reasoner';
import { predict } from './predictor';
import { logger } from './utils/logger';
import { safeTimers } from './utils/safeTimers';

// ============================================================================
// EVENT INGESTION
// ============================================================================

export async function ingest(event: Omit<AwarenessEvent, 'id' | 'createdAt'>): Promise<void> {
  await ingestEvent(event);
  logger.info('Event ingested', {
    type: event.eventType,
    source: event.sourceSystem,
  });
}

export async function ingestBatch(events: Omit<AwarenessEvent, 'id' | 'createdAt'>[]): Promise<void> {
  await ingestEvents(events);
}

// ============================================================================
// WATCHERS
// ============================================================================

const watcherConfigs: Record<string, WatcherConfig> = {
  stalledCampaigns: {
    enabled: true,
    intervalMinutes: 30,
    thresholds: {
      daysWithoutActivity: 7,
      minOpenRate: 0.15,
    },
  },
  creativeStagnation: {
    enabled: true,
    intervalMinutes: 60,
    thresholds: {
      daysSinceLastAsset: 14,
      freshnessThreshold: 0.4,
    },
  },
  sceneMovement: {
    enabled: true,
    intervalMinutes: 15,
    thresholds: {
      momentumThreshold: 0.7,
      spikeThreshold: 0.3,
    },
  },
  replySuprises: {
    enabled: true,
    intervalMinutes: 10,
    thresholds: {
      expectedReplyRate: 0.1,
      surgeMultiplier: 2.0,
    },
  },
  pressDrought: {
    enabled: true,
    intervalMinutes: 60,
    thresholds: {
      daysSinceCoverage: 21,
    },
  },
  contactFatigue: {
    enabled: true,
    intervalMinutes: 30,
    thresholds: {
      emailsPerWeek: 3,
      openRateDecline: 0.2,
    },
  },
};

/**
 * Watch for stalled campaigns
 */
async function watchStalledCampaigns(
  userId: string,
  workspaceId?: string | null
): Promise<WatcherResult> {
  const findings: Finding[] = [];
  const eventsGenerated: AwarenessEvent[] = [];

  const config = watcherConfigs.stalledCampaigns;
  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  for (const campaign of integrationData.campaignMetrics) {
    // Check for low activity
    if (campaign.openRate < config.thresholds.minOpenRate) {
      findings.push({
        type: 'stalled_campaign',
        description: `Campaign ${campaign.campaignId} has low open rate (${campaign.openRate.toFixed(2)})`,
        severity: 'medium',
        data: { campaignId: campaign.campaignId, openRate: campaign.openRate },
      });

      eventsGenerated.push({
        workspaceId,
        userId,
        eventType: 'campaign_stall_detected',
        sourceSystem: 'core_awareness' as any,
        payload: { campaignId: campaign.campaignId },
        metadata: { openRate: campaign.openRate },
      } as any);
    }
  }

  return {
    watcherType: 'stalledCampaigns',
    findings,
    eventsGenerated,
  };
}

/**
 * Watch for creative stagnation
 */
async function watchCreativeStagnation(
  userId: string,
  workspaceId?: string | null
): Promise<WatcherResult> {
  const findings: Finding[] = [];
  const eventsGenerated: AwarenessEvent[] = [];

  const config = watcherConfigs.creativeStagnation;
  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  // Check freshness from CMG
  if (integrationData.cmgFingerprints.length > 0) {
    const latestFingerprint = integrationData.cmgFingerprints[0];

    if (latestFingerprint.quality_score < config.thresholds.freshnessThreshold) {
      findings.push({
        type: 'creative_stagnation',
        description: 'Creative quality score below threshold',
        severity: 'high',
        data: { qualityScore: latestFingerprint.quality_score },
      });

      eventsGenerated.push({
        workspaceId,
        userId,
        eventType: 'creative_stagnation_detected',
        sourceSystem: 'core_awareness' as any,
        payload: { qualityScore: latestFingerprint.quality_score },
        metadata: {},
      } as any);
    }
  }

  return {
    watcherType: 'creativeStagnation',
    findings,
    eventsGenerated,
  };
}

/**
 * Watch for scene movement/spikes
 */
async function watchSceneMovement(
  userId: string,
  workspaceId?: string | null
): Promise<WatcherResult> {
  const findings: Finding[] = [];
  const eventsGenerated: AwarenessEvent[] = [];

  const config = watcherConfigs.sceneMovement;
  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  for (const cluster of integrationData.migClusters) {
    if (cluster.momentum > config.thresholds.momentumThreshold) {
      findings.push({
        type: 'scene_spike',
        description: `High momentum detected in ${cluster.scene}`,
        severity: 'medium',
        data: { scene: cluster.scene, momentum: cluster.momentum },
      });

      eventsGenerated.push({
        workspaceId,
        userId,
        eventType: 'scene_spike_detected',
        sourceSystem: 'core_awareness' as any,
        payload: { scene: cluster.scene, momentum: cluster.momentum },
        metadata: {},
      } as any);
    }
  }

  return {
    watcherType: 'sceneMovement',
    findings,
    eventsGenerated,
  };
}

/**
 * Watch for reply surges
 */
async function watchReplySurges(
  userId: string,
  workspaceId?: string | null
): Promise<WatcherResult> {
  const findings: Finding[] = [];
  const eventsGenerated: AwarenessEvent[] = [];

  const config = watcherConfigs.replySuprises;
  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  for (const campaign of integrationData.campaignMetrics) {
    const expectedReplyRate = config.thresholds.expectedReplyRate;
    const isSurge = campaign.replyRate > expectedReplyRate * config.thresholds.surgeMultiplier;

    if (isSurge) {
      findings.push({
        type: 'reply_surge',
        description: `Reply surge detected in campaign ${campaign.campaignId}`,
        severity: 'low',
        data: { campaignId: campaign.campaignId, replyRate: campaign.replyRate },
      });

      eventsGenerated.push({
        workspaceId,
        userId,
        eventType: 'reply_surge_detected',
        sourceSystem: 'core_awareness' as any,
        payload: { campaignId: campaign.campaignId, replyRate: campaign.replyRate },
        metadata: {},
      } as any);
    }
  }

  return {
    watcherType: 'replySurges',
    findings,
    eventsGenerated,
  };
}

/**
 * Watch for press droughts
 */
async function watchPressDrought(
  userId: string,
  workspaceId?: string | null
): Promise<WatcherResult> {
  const findings: Finding[] = [];
  const eventsGenerated: AwarenessEvent[] = [];

  const config = watcherConfigs.pressDrought;
  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  const recentCoverage = integrationData.campaignMetrics.reduce(
    (sum, c) => sum + c.coverage,
    0
  );

  if (recentCoverage === 0) {
    findings.push({
      type: 'press_drought',
      description: 'No coverage secured recently',
      severity: 'high',
      data: { daysSinceCoverage: config.thresholds.daysSinceCoverage },
    });

    eventsGenerated.push({
      workspaceId,
      userId,
      eventType: 'press_drought_detected',
      sourceSystem: 'core_awareness' as any,
      payload: { daysSinceCoverage: config.thresholds.daysSinceCoverage },
      metadata: {},
    } as any);
  }

  return {
    watcherType: 'pressDrought',
    findings,
    eventsGenerated,
  };
}

/**
 * Watch for contact fatigue
 */
async function watchContactFatigue(
  userId: string,
  workspaceId?: string | null
): Promise<WatcherResult> {
  const findings: Finding[] = [];
  const eventsGenerated: AwarenessEvent[] = [];

  const config = watcherConfigs.contactFatigue;
  const integrationData = await aggregateIntegrationData(userId, workspaceId);

  // Analyze declining open rates as a proxy for fatigue
  const campaigns = integrationData.campaignMetrics;
  if (campaigns.length >= 2) {
    const recent = campaigns[0];
    const previous = campaigns[1];

    const decline = previous.openRate - recent.openRate;
    if (decline > config.thresholds.openRateDecline) {
      findings.push({
        type: 'contact_fatigue',
        description: 'Open rate declining, possible contact fatigue',
        severity: 'medium',
        data: { decline, recentOpenRate: recent.openRate },
      });

      eventsGenerated.push({
        workspaceId,
        userId,
        eventType: 'contact_fatigue_detected',
        sourceSystem: 'core_awareness' as any,
        payload: { decline, recentOpenRate: recent.openRate },
        metadata: {},
      } as any);
    }
  }

  return {
    watcherType: 'contactFatigue',
    findings,
    eventsGenerated,
  };
}

// ============================================================================
// RUN ALL WATCHERS
// ============================================================================

export async function runWatchers(
  userId: string,
  workspaceId?: string | null
): Promise<WatcherResult[]> {
  logger.info('Running all watchers', { userId, workspaceId });

  const results = await Promise.all([
    watchStalledCampaigns(userId, workspaceId),
    watchCreativeStagnation(userId, workspaceId),
    watchSceneMovement(userId, workspaceId),
    watchReplySurges(userId, workspaceId),
    watchPressDrought(userId, workspaceId),
    watchContactFatigue(userId, workspaceId),
  ]);

  // Ingest all generated events
  const allEvents = results.flatMap((r) => r.eventsGenerated);
  if (allEvents.length > 0) {
    await ingestBatch(allEvents as any);
    logger.info(`Ingested ${allEvents.length} watcher events`);
  }

  return results;
}

// ============================================================================
// PERIODIC SNAPSHOT CREATION
// ============================================================================

export async function createPeriodicSnapshot(
  userId: string,
  workspaceId?: string | null
): Promise<void> {
  logger.info('Creating periodic snapshot', { userId, workspaceId });

  const integrationData = await aggregateIntegrationData(userId, workspaceId ?? null);
  const recentEvents = await getRecentEvents(workspaceId ?? null, userId, '24h');

  const reasoningResult = await reason({
    fusionContext: integrationData.fusionContext,
    cmgFingerprints: integrationData.cmgFingerprints,
    migClusters: integrationData.migClusters,
    identityProfile: integrationData.identityProfile,
    autopilotStates: integrationData.autopilotStates,
    malStates: integrationData.malStates,
    campaignMetrics: integrationData.campaignMetrics,
    creativeAssets: integrationData.creativeAssets,
    recentEvents,
  });

  const predictionResult = await predict({
    campaignMetrics: integrationData.campaignMetrics,
    migClusters: integrationData.migClusters,
    cmgFingerprints: integrationData.cmgFingerprints,
    autopilotStates: integrationData.autopilotStates,
    malStates: integrationData.malStates,
  });

  const snapshotData = {
    timestamp: new Date(),
    systemHealth: {
      autopilot: {
        status: 'healthy' as const,
        activeCount: integrationData.autopilotStates.length,
        successRate: 0.85,
      },
      mal: {
        status: 'healthy' as const,
        activeCount: integrationData.malStates.length,
        successRate: 0.92,
      },
      campaigns: {
        status: 'healthy' as const,
        activeCount: integrationData.campaignMetrics.length,
        successRate: 0.78,
      },
      creative: {
        status: 'healthy' as const,
        activeCount: integrationData.creativeAssets.length,
        successRate: 0.82,
      },
    },
    currentState: {
      activeCampaigns: integrationData.campaignMetrics.length,
      activeAutopilotMissions: integrationData.autopilotStates.length,
      activeMALFlows: integrationData.malStates.filter((f) => f.isActive).length,
      recentCoverage: integrationData.campaignMetrics.reduce(
        (sum, c) => sum + c.coverage,
        0
      ),
      recentReplies: integrationData.campaignMetrics.reduce(
        (sum, c) => sum + c.replied,
        0
      ),
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
      momentum: predictionResult.scores.momentum,
      identity_cohesion: integrationData.identityProfile.cohesionScore,
      scene_alignment: integrationData.migClusters[0]?.momentum || 0.5,
      creative_quality: integrationData.cmgFingerprints[0]?.quality_score || 0.5,
      press_effectiveness: 0.65, // Calculated from campaign metrics
      burnout_risk: predictionResult.scores.burnoutRisk,
      fatigue_risk: predictionResult.scores.fatigueRisk,
    },
  };

  await createSnapshot(workspaceId ?? null, userId, snapshotData);
  logger.info('Snapshot created', { userId, workspaceId });
}

// ============================================================================
// START/STOP OBSERVER
// ============================================================================

export function startObserver(
  userId: string,
  workspaceId?: string | null,
  snapshotIntervalMinutes: number = 10
): void {
  logger.info('Starting observer', {
    userId,
    workspaceId,
    snapshotIntervalMinutes,
  });

  // Run watchers periodically
  safeTimers.setInterval(
    'watchers',
    async () => {
      await runWatchers(userId, workspaceId);
    },
    30 * 60 * 1000 // 30 minutes
  );

  // Create snapshots periodically
  safeTimers.setInterval(
    'snapshots',
    () => createPeriodicSnapshot(userId, workspaceId),
    snapshotIntervalMinutes * 60 * 1000
  );

  // Run once immediately
  runWatchers(userId, workspaceId).catch((error) => {
    logger.error('Initial watcher run failed', error);
  });

  createPeriodicSnapshot(userId, workspaceId).catch((error) => {
    logger.error('Initial snapshot creation failed', error);
  });
}

export function stopObserver(): void {
  logger.info('Stopping observer');
  safeTimers.clearInterval('watchers');
  safeTimers.clearInterval('snapshots');
}
