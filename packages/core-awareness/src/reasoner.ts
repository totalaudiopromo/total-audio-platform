/**
 * Reasoner
 * Cross-system correlation and pattern detection
 */

import type {
  ReasoningInput,
  ReasoningResult,
  Correlation,
  Mismatch,
  Opportunity,
  Risk,
} from './types';
import { logger } from './utils/logger';

export async function reason(input: ReasoningInput): Promise<ReasoningResult> {
  logger.info('Running reasoning engine');

  const correlations = detectCorrelations(input);
  const mismatches = detectMismatches(input);
  const opportunities = detectOpportunities(input);
  const risks = detectRisks(input);

  const insights = generateInsights(correlations, mismatches, opportunities, risks);

  return {
    correlations,
    mismatches,
    opportunities,
    risks,
    insights,
    confidence: calculateOverallConfidence(correlations, mismatches, opportunities, risks),
  };
}

function detectCorrelations(input: ReasoningInput): Correlation[] {
  const correlations: Correlation[] = [];

  // Scene-Creative alignment
  if (input.cmgFingerprints.length > 0 && input.migClusters.length > 0) {
    const creativeMotifs = input.cmgFingerprints[0].creative_motifs;
    const sceneGenre = input.migClusters[0].microgenre;

    const alignment = calculateAlignment(creativeMotifs, [sceneGenre]);

    correlations.push({
      id: `corr_scene_creative_${Date.now()}`,
      type: 'scene_creative_alignment',
      description: alignment > 0.7
        ? 'Creative output strongly aligned with active scene'
        : 'Creative diverging from scene direction',
      systems: ['cmg', 'mig'],
      strength: alignment,
      insights: [
        `Creative motifs: ${creativeMotifs.join(', ')}`,
        `Scene genre: ${sceneGenre}`,
      ],
      data: { alignment, creativeMotifs, sceneGenre },
    });
  }

  // Campaign-Coverage correlation
  if (input.campaignMetrics.length > 0) {
    const totalSent = input.campaignMetrics.reduce((sum, c) => sum + c.sent, 0);
    const totalCoverage = input.campaignMetrics.reduce((sum, c) => sum + c.coverage, 0);
    const coverageRate = totalSent > 0 ? totalCoverage / totalSent : 0;

    correlations.push({
      id: `corr_campaign_coverage_${Date.now()}`,
      type: 'campaign_coverage_correlation',
      description: `Coverage rate: ${(coverageRate * 100).toFixed(1)}%`,
      systems: ['tracker', 'email_engine'],
      strength: coverageRate,
      insights: [
        `Total sent: ${totalSent}`,
        `Total coverage: ${totalCoverage}`,
      ],
      data: { totalSent, totalCoverage, coverageRate },
    });
  }

  // Reply quality surge
  const highReplyRateCampaigns = input.campaignMetrics.filter(c => c.replyRate > 0.15);
  if (highReplyRateCampaigns.length > 0) {
    correlations.push({
      id: `corr_reply_surge_${Date.now()}`,
      type: 'reply_quality_surge',
      description: `${highReplyRateCampaigns.length} campaigns with high reply rates`,
      systems: ['email_engine', 'tracker'],
      strength: 0.75,
      insights: highReplyRateCampaigns.map(c => `Campaign ${c.campaignId}: ${(c.replyRate * 100).toFixed(1)}%`),
      data: { campaigns: highReplyRateCampaigns.map(c => c.campaignId) },
    });
  }

  return correlations;
}

function detectMismatches(input: ReasoningInput): Mismatch[] {
  const mismatches: Mismatch[] = [];

  // Creative vs Scene
  if (input.cmgFingerprints.length > 0 && input.migClusters.length > 0) {
    const creativeMotifs = input.cmgFingerprints[0].creative_motifs;
    const sceneGenre = input.migClusters[0].microgenre;
    const alignment = calculateAlignment(creativeMotifs, [sceneGenre]);

    if (alignment < 0.5) {
      mismatches.push({
        id: `mismatch_creative_scene_${Date.now()}`,
        type: 'creative_vs_scene',
        description: 'Creative identity drifting from scene direction',
        severity: 'medium',
        systems: ['cmg', 'mig'],
        suggestedActions: [
          'Review creative direction vs scene trends',
          'Consider adjusting positioning or doubling down on uniqueness',
        ],
        data: { alignment, creativeMotifs, sceneGenre },
      });
    }
  }

  // Identity vs Output
  if (input.identityProfile && input.cmgFingerprints.length > 0) {
    const identityCohesion = input.identityProfile.cohesionScore;
    const creativeConsistency = input.cmgFingerprints[0].consistency_score;

    if (Math.abs(identityCohesion - creativeConsistency) > 0.3) {
      mismatches.push({
        id: `mismatch_identity_output_${Date.now()}`,
        type: 'identity_vs_output',
        description: 'Identity kernel and creative output misaligned',
        severity: 'high',
        systems: ['identity_kernel', 'cmg'],
        suggestedActions: [
          'Refresh identity kernel with recent creative outputs',
          'Align creative strategy with core identity',
        ],
        data: { identityCohesion, creativeConsistency },
      });
    }
  }

  // Coverage vs Effort
  if (input.campaignMetrics.length > 0) {
    const totalSent = input.campaignMetrics.reduce((sum, c) => sum + c.sent, 0);
    const totalCoverage = input.campaignMetrics.reduce((sum, c) => sum + c.coverage, 0);
    const efficiency = totalSent > 0 ? totalCoverage / totalSent : 0;

    if (efficiency < 0.03 && totalSent > 50) {
      mismatches.push({
        id: `mismatch_coverage_effort_${Date.now()}`,
        type: 'coverage_vs_effort',
        description: 'Low coverage relative to outreach effort',
        severity: 'high',
        systems: ['tracker', 'email_engine'],
        suggestedActions: [
          'Review contact targeting quality',
          'Analyze successful coverage patterns',
          'Consider pitch/creative adjustments',
        ],
        data: { totalSent, totalCoverage, efficiency },
      });
    }
  }

  return mismatches;
}

function detectOpportunities(input: ReasoningInput): Opportunity[] {
  const opportunities: Opportunity[] = [];

  // Scene spike
  const highMomentumScenes = input.migClusters.filter(c => c.momentum > 0.7);
  if (highMomentumScenes.length > 0) {
    opportunities.push({
      id: `opp_scene_spike_${Date.now()}`,
      type: 'scene_spike',
      description: `High momentum in ${highMomentumScenes.length} scene(s)`,
      confidence: 0.85,
      potentialImpact: 'high',
      window: {
        opensAt: new Date(),
        duration: '2-4 weeks',
      },
      suggestedActions: [
        'Prioritise outreach in high-momentum scenes',
        'Create scene-specific creative assets',
        'Engage with trending artists in these scenes',
      ],
      data: { scenes: highMomentumScenes.map(s => s.scene) },
    });
  }

  // Reply momentum
  const recentHighReplyRate = input.campaignMetrics.some(c => c.replyRate > 0.15);
  if (recentHighReplyRate) {
    opportunities.push({
      id: `opp_reply_momentum_${Date.now()}`,
      type: 'reply_momentum',
      description: 'Reply rates above average - strong engagement window',
      confidence: 0.78,
      potentialImpact: 'medium',
      window: {
        opensAt: new Date(),
        duration: '1-2 weeks',
      },
      suggestedActions: [
        'Accelerate follow-up cadence',
        'Prepare additional assets for engaged contacts',
        'Consider expanding similar campaigns',
      ],
      data: {},
    });
  }

  // Creative resonance
  if (input.cmgFingerprints.length > 0) {
    const qualityScore = input.cmgFingerprints[0].quality_score;
    if (qualityScore > 0.8) {
      opportunities.push({
        id: `opp_creative_resonance_${Date.now()}`,
        type: 'creative_resonance',
        description: 'Recent creative output showing strong quality signals',
        confidence: 0.82,
        potentialImpact: 'high',
        window: {
          opensAt: new Date(),
          duration: '3-6 weeks',
        },
        suggestedActions: [
          'Maximise distribution of high-quality assets',
          'Consider PR lift campaign',
          'Leverage for playlist pitching',
        ],
        data: { qualityScore },
      });
    }
  }

  return opportunities;
}

function detectRisks(input: ReasoningInput): Risk[] {
  const risks: Risk[] = [];

  // Campaign stall
  const lowPerformanceCampaigns = input.campaignMetrics.filter(
    c => c.openRate < 0.2 && c.replyRate < 0.05
  );
  if (lowPerformanceCampaigns.length > 0) {
    risks.push({
      id: `risk_campaign_stall_${Date.now()}`,
      type: 'campaign_stall',
      description: `${lowPerformanceCampaigns.length} campaign(s) underperforming`,
      severity: 'medium',
      probability: 0.75,
      mitigationActions: [
        'Review subject lines and pitch angles',
        'Segment contact list for better targeting',
        'Test new creative hooks',
      ],
      data: { campaigns: lowPerformanceCampaigns.map(c => c.campaignId) },
    });
  }

  // Creative stagnation
  if (input.cmgFingerprints.length > 0) {
    const evolutionRate = input.cmgFingerprints[0].evolution_rate;
    if (evolutionRate < 0.1) {
      risks.push({
        id: `risk_creative_stagnation_${Date.now()}`,
        type: 'creative_stagnation',
        description: 'Low creative evolution rate detected',
        severity: 'medium',
        probability: 0.65,
        mitigationActions: [
          'Introduce new creative motifs',
          'Experiment with fresh production techniques',
          'Collaborate with different artists',
        ],
        data: { evolutionRate },
      });
    }
  }

  // Scene misalignment
  if (input.cmgFingerprints.length > 0 && input.migClusters.length > 0) {
    const alignment = calculateAlignment(
      input.cmgFingerprints[0].creative_motifs,
      [input.migClusters[0].microgenre]
    );
    if (alignment < 0.4) {
      risks.push({
        id: `risk_scene_misalignment_${Date.now()}`,
        type: 'scene_misalignment',
        description: 'Creative output misaligned with active scenes',
        severity: 'low',
        probability: 0.55,
        mitigationActions: [
          'Reassess scene positioning strategy',
          'Identify adjacent scenes for expansion',
          'Consider niche vs mainstream trade-offs',
        ],
        data: { alignment },
      });
    }
  }

  return risks;
}

function generateInsights(
  correlations: Correlation[],
  mismatches: Mismatch[],
  opportunities: Opportunity[],
  risks: Risk[]
): string[] {
  const insights: string[] = [];

  if (correlations.length > 0) {
    insights.push(`Detected ${correlations.length} cross-system correlations`);
  }

  if (mismatches.length > 0) {
    insights.push(`Found ${mismatches.length} strategic misalignments requiring attention`);
  }

  if (opportunities.length > 0) {
    insights.push(`Identified ${opportunities.length} time-sensitive opportunities`);
  }

  if (risks.length > 0) {
    insights.push(`${risks.length} potential risks detected`);
  }

  return insights;
}

function calculateOverallConfidence(
  correlations: Correlation[],
  mismatches: Mismatch[],
  opportunities: Opportunity[],
  risks: Risk[]
): number {
  const totalStrength = correlations.reduce((sum, c) => sum + c.strength, 0);
  const totalConfidence = opportunities.reduce((sum, o) => sum + o.confidence, 0);
  const totalProbability = risks.reduce((sum, r) => sum + r.probability, 0);

  const count = correlations.length + opportunities.length + risks.length;
  return count > 0 ? (totalStrength + totalConfidence + totalProbability) / count : 0.5;
}

function calculateAlignment(motifs: string[], genres: string[]): number {
  // Simple alignment calculation based on keyword matching
  // In production, this would use semantic similarity
  let matches = 0;
  let total = motifs.length + genres.length;

  for (const motif of motifs) {
    for (const genre of genres) {
      if (motif.toLowerCase().includes(genre.toLowerCase()) ||
          genre.toLowerCase().includes(motif.toLowerCase())) {
        matches++;
      }
    }
  }

  return total > 0 ? matches / total : 0.5;
}
