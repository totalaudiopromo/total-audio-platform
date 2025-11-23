/**
 * Metrics
 * Scoring functions for various system health and performance metrics
 */

import type {
  CampaignMetric,
  CMGFingerprint,
  MIGCluster,
  IdentityProfile,
  AutopilotMissionState,
  MALFlowState,
} from './types';
import { logger } from './utils/logger';

/**
 * Calculate overall momentum score
 * Combines campaign activity, creative output, and scene engagement
 */
export function calculateMomentumScore(
  campaignMetrics: CampaignMetric[],
  cmgFingerprints: CMGFingerprint[],
  migClusters: MIGCluster[]
): number {
  if (campaignMetrics.length === 0 && cmgFingerprints.length === 0 && migClusters.length === 0) {
    return 0.5; // Neutral baseline
  }

  let totalScore = 0;
  let components = 0;

  // Campaign momentum (0-1)
  if (campaignMetrics.length > 0) {
    const avgOpenRate = campaignMetrics.reduce((sum, c) => sum + c.openRate, 0) / campaignMetrics.length;
    const avgReplyRate = campaignMetrics.reduce((sum, c) => sum + c.replyRate, 0) / campaignMetrics.length;
    const campaignMomentum = (avgOpenRate * 0.4 + avgReplyRate * 0.6);
    totalScore += campaignMomentum;
    components++;
  }

  // Creative momentum (0-1)
  if (cmgFingerprints.length > 0) {
    const latestFingerprint = cmgFingerprints[0];
    const creativeMomentum = (
      latestFingerprint.quality_score * 0.4 +
      latestFingerprint.evolution_rate * 0.3 +
      latestFingerprint.consistency_score * 0.3
    );
    totalScore += creativeMomentum;
    components++;
  }

  // Scene momentum (0-1)
  if (migClusters.length > 0) {
    const avgSceneMomentum = migClusters.reduce((sum, c) => sum + c.momentum, 0) / migClusters.length;
    totalScore += avgSceneMomentum;
    components++;
  }

  return components > 0 ? totalScore / components : 0.5;
}

/**
 * Calculate identity cohesion score
 * Measures alignment between identity kernel and creative output
 */
export function calculateIdentityCohesionScore(
  identityProfile: IdentityProfile,
  cmgFingerprints: CMGFingerprint[]
): number {
  if (!identityProfile || cmgFingerprints.length === 0) {
    return 0.5; // Neutral if insufficient data
  }

  const latestFingerprint = cmgFingerprints[0];

  // Start with identity kernel's own cohesion score
  let cohesionScore = identityProfile.cohesionScore * 0.4;

  // Add creative consistency
  cohesionScore += latestFingerprint.consistency_score * 0.3;

  // Check alignment between identity motifs and creative motifs
  const identityMotifs = identityProfile.narrative?.themes || [];
  const creativeMotifs = latestFingerprint.creative_motifs || [];

  if (identityMotifs.length > 0 && creativeMotifs.length > 0) {
    let matches = 0;
    for (const identityMotif of identityMotifs) {
      for (const creativeMotif of creativeMotifs) {
        if (
          identityMotif.toLowerCase().includes(creativeMotif.toLowerCase()) ||
          creativeMotif.toLowerCase().includes(identityMotif.toLowerCase())
        ) {
          matches++;
        }
      }
    }
    const alignmentScore = Math.min(matches / Math.max(identityMotifs.length, creativeMotifs.length), 1.0);
    cohesionScore += alignmentScore * 0.3;
  } else {
    cohesionScore += 0.15; // Neutral contribution if no motifs available
  }

  return Math.min(cohesionScore, 1.0);
}

/**
 * Calculate scene alignment score
 * Measures how well creative output aligns with active music scenes
 */
export function calculateSceneAlignmentScore(
  cmgFingerprints: CMGFingerprint[],
  migClusters: MIGCluster[]
): number {
  if (cmgFingerprints.length === 0 || migClusters.length === 0) {
    return 0.5; // Neutral if insufficient data
  }

  const latestFingerprint = cmgFingerprints[0];
  const creativeMotifs = latestFingerprint.creative_motifs || [];

  let totalAlignment = 0;
  let clusterCount = 0;

  for (const cluster of migClusters) {
    const sceneGenre = cluster.microgenre;
    const sceneKeywords = cluster.scene.split(/[\s-]+/); // Split scene name into keywords

    let matches = 0;
    let total = creativeMotifs.length + sceneKeywords.length;

    for (const motif of creativeMotifs) {
      for (const keyword of sceneKeywords) {
        if (
          motif.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(motif.toLowerCase())
        ) {
          matches++;
        }
      }

      // Also check against microgenre
      if (
        motif.toLowerCase().includes(sceneGenre.toLowerCase()) ||
        sceneGenre.toLowerCase().includes(motif.toLowerCase())
      ) {
        matches++;
      }
    }

    const clusterAlignment = total > 0 ? matches / total : 0.5;

    // Weight by scene momentum (higher momentum scenes matter more)
    totalAlignment += clusterAlignment * cluster.momentum;
    clusterCount += cluster.momentum;
  }

  return clusterCount > 0 ? totalAlignment / clusterCount : 0.5;
}

/**
 * Calculate creative quality score
 * Aggregates quality metrics from CMG fingerprints
 */
export function calculateCreativeQualityScore(
  cmgFingerprints: CMGFingerprint[]
): number {
  if (cmgFingerprints.length === 0) {
    return 0.5; // Neutral if no data
  }

  const latestFingerprint = cmgFingerprints[0];

  // Weighted average of quality metrics
  const qualityScore = (
    latestFingerprint.quality_score * 0.5 +
    latestFingerprint.consistency_score * 0.25 +
    latestFingerprint.evolution_rate * 0.25
  );

  return Math.min(qualityScore, 1.0);
}

/**
 * Calculate press effectiveness score
 * Measures success of press campaigns and outreach
 */
export function calculatePressEffectivenessScore(
  campaignMetrics: CampaignMetric[]
): number {
  if (campaignMetrics.length === 0) {
    return 0.5; // Neutral if no data
  }

  let totalSent = 0;
  let totalCoverage = 0;
  let totalReplied = 0;
  let totalOpens = 0;

  for (const campaign of campaignMetrics) {
    totalSent += campaign.sent;
    totalCoverage += campaign.coverage;
    totalReplied += campaign.replied;
    totalOpens += campaign.sent * campaign.openRate;
  }

  if (totalSent === 0) {
    return 0.5;
  }

  // Coverage rate (most important)
  const coverageRate = totalCoverage / totalSent;

  // Reply rate (good signal)
  const replyRate = totalReplied / totalSent;

  // Open rate (baseline engagement)
  const openRate = totalOpens / totalSent;

  // Weighted combination
  const effectiveness = (
    coverageRate * 0.5 +
    replyRate * 0.3 +
    openRate * 0.2
  );

  return Math.min(effectiveness, 1.0);
}

/**
 * Calculate burnout risk score
 * Detects creative stagnation and overwork patterns
 */
export function calculateBurnoutRiskScore(
  cmgFingerprints: CMGFingerprint[],
  autopilotStates: AutopilotMissionState[],
  malStates: MALFlowState[]
): number {
  let riskScore = 0;
  let components = 0;

  // Creative stagnation indicator
  if (cmgFingerprints.length > 0) {
    const latestFingerprint = cmgFingerprints[0];

    // Low evolution rate suggests stagnation
    if (latestFingerprint.evolution_rate < 0.2) {
      riskScore += 0.7;
    } else if (latestFingerprint.evolution_rate < 0.4) {
      riskScore += 0.4;
    } else {
      riskScore += 0.1;
    }
    components++;

    // Declining quality suggests burnout
    if (latestFingerprint.quality_score < 0.5) {
      riskScore += 0.8;
    } else if (latestFingerprint.quality_score < 0.7) {
      riskScore += 0.3;
    } else {
      riskScore += 0.1;
    }
    components++;
  }

  // Autopilot overload indicator
  const activeAutopilotMissions = autopilotStates.filter(s => s.isActive).length;
  if (activeAutopilotMissions > 10) {
    riskScore += 0.8;
    components++;
  } else if (activeAutopilotMissions > 5) {
    riskScore += 0.4;
    components++;
  } else {
    riskScore += 0.1;
    components++;
  }

  // MAL workflow overload indicator
  const activeMALFlows = malStates.filter(s => s.isActive).length;
  if (activeMALFlows > 8) {
    riskScore += 0.7;
    components++;
  } else if (activeMALFlows > 4) {
    riskScore += 0.3;
    components++;
  } else {
    riskScore += 0.1;
    components++;
  }

  return components > 0 ? Math.min(riskScore / components, 1.0) : 0.3;
}

/**
 * Calculate fatigue risk score
 * Detects contact fatigue and declining engagement patterns
 */
export function calculateFatigueRiskScore(
  campaignMetrics: CampaignMetric[]
): number {
  if (campaignMetrics.length < 2) {
    return 0.3; // Not enough data, assume low risk
  }

  let riskScore = 0;
  let components = 0;

  // Compare recent vs previous campaigns
  const recentCampaigns = campaignMetrics.slice(0, Math.min(3, campaignMetrics.length));
  const previousCampaigns = campaignMetrics.slice(3, Math.min(6, campaignMetrics.length));

  if (recentCampaigns.length > 0 && previousCampaigns.length > 0) {
    const recentAvgOpenRate = recentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / recentCampaigns.length;
    const previousAvgOpenRate = previousCampaigns.reduce((sum, c) => sum + c.openRate, 0) / previousCampaigns.length;

    // Declining open rates suggest fatigue
    const openRateDecline = previousAvgOpenRate - recentAvgOpenRate;
    if (openRateDecline > 0.2) {
      riskScore += 0.8;
    } else if (openRateDecline > 0.1) {
      riskScore += 0.5;
    } else if (openRateDecline > 0.05) {
      riskScore += 0.3;
    } else {
      riskScore += 0.1;
    }
    components++;

    const recentAvgReplyRate = recentCampaigns.reduce((sum, c) => sum + c.replyRate, 0) / recentCampaigns.length;
    const previousAvgReplyRate = previousCampaigns.reduce((sum, c) => sum + c.replyRate, 0) / previousCampaigns.length;

    // Declining reply rates suggest fatigue
    const replyRateDecline = previousAvgReplyRate - recentAvgReplyRate;
    if (replyRateDecline > 0.15) {
      riskScore += 0.8;
    } else if (replyRateDecline > 0.08) {
      riskScore += 0.5;
    } else if (replyRateDecline > 0.03) {
      riskScore += 0.3;
    } else {
      riskScore += 0.1;
    }
    components++;
  }

  // Check for very low absolute engagement (fatigue symptom)
  const avgOpenRate = campaignMetrics.reduce((sum, c) => sum + c.openRate, 0) / campaignMetrics.length;
  const avgReplyRate = campaignMetrics.reduce((sum, c) => sum + c.replyRate, 0) / campaignMetrics.length;

  if (avgOpenRate < 0.15 && avgReplyRate < 0.03) {
    riskScore += 0.9;
    components++;
  } else if (avgOpenRate < 0.25 && avgReplyRate < 0.05) {
    riskScore += 0.5;
    components++;
  } else {
    riskScore += 0.1;
    components++;
  }

  return components > 0 ? Math.min(riskScore / components, 1.0) : 0.3;
}

/**
 * Calculate lift potential score
 * Measures potential for PR/marketing breakthrough
 */
export function calculateLiftPotentialScore(
  cmgFingerprints: CMGFingerprint[],
  migClusters: MIGCluster[],
  campaignMetrics: CampaignMetric[]
): number {
  let potentialScore = 0;
  let components = 0;

  // High-quality creative with strong evolution = lift potential
  if (cmgFingerprints.length > 0) {
    const latestFingerprint = cmgFingerprints[0];

    if (latestFingerprint.quality_score > 0.8 && latestFingerprint.evolution_rate > 0.6) {
      potentialScore += 0.9;
    } else if (latestFingerprint.quality_score > 0.7 && latestFingerprint.evolution_rate > 0.4) {
      potentialScore += 0.6;
    } else if (latestFingerprint.quality_score > 0.6) {
      potentialScore += 0.4;
    } else {
      potentialScore += 0.2;
    }
    components++;
  }

  // High momentum scenes = market opportunity
  const highMomentumScenes = migClusters.filter(c => c.momentum > 0.7);
  if (highMomentumScenes.length > 0) {
    potentialScore += Math.min(highMomentumScenes.length * 0.15, 0.8);
    components++;
  } else {
    potentialScore += 0.2;
    components++;
  }

  // Recent reply surges = engagement momentum
  const recentHighReplyRate = campaignMetrics.some(c => c.replyRate > 0.15);
  if (recentHighReplyRate) {
    potentialScore += 0.7;
    components++;
  } else {
    potentialScore += 0.2;
    components++;
  }

  return components > 0 ? Math.min(potentialScore / components, 1.0) : 0.5;
}

/**
 * Calculate freshness score
 * Measures recency and novelty of creative output
 */
export function calculateFreshnessScore(
  cmgFingerprints: CMGFingerprint[]
): number {
  if (cmgFingerprints.length === 0) {
    return 0.3; // Low freshness if no data
  }

  const latestFingerprint = cmgFingerprints[0];

  // Evolution rate is primary indicator of freshness
  let freshnessScore = latestFingerprint.evolution_rate * 0.6;

  // Quality score contributes (fresh doesn't mean bad)
  freshnessScore += latestFingerprint.quality_score * 0.4;

  return Math.min(freshnessScore, 1.0);
}

/**
 * Calculate all scores from aggregated integration data
 */
export function calculateAllScores(data: {
  cmgFingerprints: CMGFingerprint[];
  migClusters: MIGCluster[];
  identityProfile: IdentityProfile;
  autopilotStates: AutopilotMissionState[];
  malStates: MALFlowState[];
  campaignMetrics: CampaignMetric[];
}): {
  momentum: number;
  identity_cohesion: number;
  scene_alignment: number;
  creative_quality: number;
  press_effectiveness: number;
  burnout_risk: number;
  fatigue_risk: number;
  lift_potential: number;
  freshness: number;
} {
  logger.info('Calculating all awareness scores');

  return {
    momentum: calculateMomentumScore(
      data.campaignMetrics,
      data.cmgFingerprints,
      data.migClusters
    ),
    identity_cohesion: calculateIdentityCohesionScore(
      data.identityProfile,
      data.cmgFingerprints
    ),
    scene_alignment: calculateSceneAlignmentScore(
      data.cmgFingerprints,
      data.migClusters
    ),
    creative_quality: calculateCreativeQualityScore(
      data.cmgFingerprints
    ),
    press_effectiveness: calculatePressEffectivenessScore(
      data.campaignMetrics
    ),
    burnout_risk: calculateBurnoutRiskScore(
      data.cmgFingerprints,
      data.autopilotStates,
      data.malStates
    ),
    fatigue_risk: calculateFatigueRiskScore(
      data.campaignMetrics
    ),
    lift_potential: calculateLiftPotentialScore(
      data.cmgFingerprints,
      data.migClusters,
      data.campaignMetrics
    ),
    freshness: calculateFreshnessScore(
      data.cmgFingerprints
    ),
  };
}
