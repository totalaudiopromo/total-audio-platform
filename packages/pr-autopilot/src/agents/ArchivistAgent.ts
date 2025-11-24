/**
 * Archivist Agent
 *
 * Purpose: Write long-term memories back into CMG and success profiles.
 * Distills campaign learnings into reusable patterns.
 */

import type { AgentContext, AutopilotTask, ArchivistOutput } from '../types';

export class ArchivistAgent {
  async execute(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<ArchivistOutput> {
    context.logger.info('ArchivistAgent executing task', {
      taskType: task.type,
    });

    if (task.type === 'archive_campaign_learnings') {
      return await this.archiveCampaignLearnings(task, context);
    }

    throw new Error(`Unknown task type for Archivist: ${task.type}`);
  }

  private async archiveCampaignLearnings(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<ArchivistOutput> {
    const { clients, logger, mission } = context;
    const input = task.input;

    logger.info('Archiving campaign learnings to CMG and success profiles');

    const insights = input.insights as any[];
    const recommendations = input.recommendations as string[];
    const metrics = input.metrics as any;

    // Create CMG memories for key learnings
    let memories_created = 0;
    const fingerprints_updated: string[] = [];

    // Archive overall campaign performance
    await clients.cmg.createMemory({
      type: 'campaign_outcome',
      mission_id: mission.id,
      mission_title: mission.title,
      performance_score: metrics.overall_score || 0,
      metrics,
      insights: insights.map((i) => i.description),
      timestamp: new Date().toISOString(),
    });
    memories_created++;

    // Archive successful tactics
    for (const insight of insights) {
      if (insight.confidence > 0.75) {
        await clients.cmg.createMemory({
          type: 'tactic',
          description: insight.description,
          confidence: insight.confidence,
          campaign_id: mission.campaign_id,
          supporting_data: insight.supporting_data,
        });
        memories_created++;
      }
    }

    // Archive recommendations for future campaigns
    for (const recommendation of recommendations) {
      await clients.cmg.createMemory({
        type: 'recommendation',
        text: recommendation,
        source_mission: mission.id,
        applicable_to: mission.config.targeting?.genres || [],
      });
      memories_created++;
    }

    // Update success profiles
    const success_profile_impact = [];

    try {
      await clients.successProfiles.recordOutcome({
        campaign_id: mission.campaign_id || mission.id,
        metrics: metrics as Record<string, number>,
        patterns: {
          genres: mission.config.targeting?.genres || [],
          contact_types: mission.config.targeting?.contact_types || [],
          pitch_style: mission.config.preferences?.pitch_style,
          timing: {
            start_date: mission.created_at,
            duration_days: this.calculateDurationDays(mission.created_at),
          },
          success_factors: insights
            .filter((i) => i.confidence > 0.75)
            .map((i) => i.description),
        },
      });

      success_profile_impact.push({
        profile_id: 'general-pr-profile',
        contribution: {
          weight: metrics.overall_score > 70 ? 'high' : 'medium',
          data_points: memories_created,
        },
      });
    } catch (error) {
      logger.warn('Failed to update success profiles', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Distill long-term learnings
    const long_term_learnings = this.distillLearnings(insights, recommendations, metrics);

    logger.info('Campaign learnings archived', {
      memories_created,
      success_profiles_updated: success_profile_impact.length,
      learnings: long_term_learnings.length,
    });

    return {
      memories_created,
      fingerprints_updated,
      success_profile_impact,
      long_term_learnings,
    };
  }

  private calculateDurationDays(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private distillLearnings(
    insights: any[],
    recommendations: string[],
    metrics: any
  ): string[] {
    const learnings: string[] = [];

    // Extract high-confidence patterns
    const highConfidenceInsights = insights.filter((i) => i.confidence > 0.8);
    learnings.push(
      ...highConfidenceInsights.map((i) => `Pattern: ${i.description}`)
    );

    // Extract performance-based learnings
    if (metrics.overall_score > 80) {
      learnings.push('High-performing campaign strategy validated');
    } else if (metrics.overall_score < 50) {
      learnings.push('Strategy needs refinement for this audience');
    }

    // Extract tactical learnings from recommendations
    learnings.push(...recommendations.map((r) => `Tactic: ${r}`));

    return learnings;
  }
}
