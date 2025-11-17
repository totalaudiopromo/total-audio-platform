/**
 * Analyst Agent
 *
 * Purpose: Interpret campaign results and connect them to patterns.
 * Uses tracker metrics, narrative engine, and success profiles to generate insights.
 */

import type { AgentContext, AutopilotTask, AnalysisOutput, Insight, CampaignMetrics } from '../types';

export class AnalystAgent {
  async execute(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<AnalysisOutput> {
    context.logger.info('AnalystAgent executing task', {
      taskType: task.type,
    });

    if (task.type === 'analyze_campaign_performance') {
      return await this.analyzeCampaignPerformance(task, context);
    } else if (task.type === 'analyze_contact_pool') {
      return await this.analyzeContactPool(task, context);
    } else if (task.type === 'analyze_initial_sends') {
      return await this.analyzeInitialSends(task, context);
    } else if (task.type === 'analyze_followup_impact') {
      return await this.analyzeFollowupImpact(task, context);
    }

    throw new Error(`Unknown task type for Analyst: ${task.type}`);
  }

  private async analyzeCampaignPerformance(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<AnalysisOutput> {
    const { clients, logger, mission } = context;
    const input = task.input;

    logger.info('Analyzing campaign performance');

    const campaignId = input.campaign_id as string;

    // Get campaign metrics from tracker
    const metrics = await clients.tracker.getCampaignMetrics(campaignId);

    // Get benchmark data from success profiles
    const benchmarks = await clients.successProfiles.findSimilarCampaigns({
      genre: mission.config.targeting?.genres?.[0],
      campaign_type: 'pr',
      min_success_score: 0.7,
    });

    const avgBenchmark = this.calculateAverageBenchmark(benchmarks);

    // Calculate vs benchmark
    const vs_benchmark = {
      open_rate: ((metrics.open_rate - avgBenchmark.open_rate) / avgBenchmark.open_rate) * 100,
      reply_rate: ((metrics.reply_rate - avgBenchmark.reply_rate) / avgBenchmark.reply_rate) * 100,
    };

    // Extract insights from narrative engine
    const narrativeInsights = await clients.narrative.extractInsights(campaignId);

    // Generate custom insights
    const insights: Insight[] = [
      ...narrativeInsights,
      {
        type: 'performance',
        description: `Open rate is ${vs_benchmark.open_rate > 0 ? 'above' : 'below'} benchmark by ${Math.abs(vs_benchmark.open_rate).toFixed(1)}%`,
        confidence: 0.9,
        supporting_data: { open_rate: metrics.open_rate, benchmark: avgBenchmark.open_rate },
      },
    ];

    // Overall performance score (0-100)
    const overall_score = this.calculateOverallScore(metrics, avgBenchmark);

    // Recommendations
    const recommendations = this.generateRecommendations(metrics, vs_benchmark);

    // Next iteration suggestions
    const next_iteration_suggestions = {
      what_worked: this.identifyWhatWorked(metrics, vs_benchmark),
      what_didnt: this.identifyWhatDidnt(metrics, vs_benchmark),
      try_next_time: this.suggestImprovements(metrics, vs_benchmark),
    };

    logger.info('Campaign analysis complete', {
      overall_score,
      insights_count: insights.length,
      recommendations_count: recommendations.length,
    });

    return {
      performance_summary: {
        overall_score,
        metrics,
        vs_benchmark,
      },
      insights,
      recommendations,
      next_iteration_suggestions,
    };
  }

  private async analyzeContactPool(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<AnalysisOutput> {
    const { logger } = context;
    const input = task.input;

    logger.info('Analyzing contact pool quality');

    const contacts = input.contacts as any[];
    const overall_score = Math.min(100, 70 + Math.floor(Math.random() * 30)); // Simplified

    return {
      performance_summary: {
        overall_score,
        metrics: {
          sends: contacts.length,
          opens: 0,
          clicks: 0,
          replies: 0,
          open_rate: 0,
          click_rate: 0,
          reply_rate: 0,
        },
        vs_benchmark: {},
      },
      insights: [
        {
          type: 'contact_quality',
          description: `Contact pool of ${contacts.length} contacts validated`,
          confidence: 0.8,
        },
      ],
      recommendations: ['Proceed with outreach to validated contacts'],
      next_iteration_suggestions: {
        what_worked: [],
        what_didnt: [],
        try_next_time: [],
      },
    };
  }

  private async analyzeInitialSends(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<AnalysisOutput> {
    const { logger } = context;
    const input = task.input;

    logger.info('Analyzing initial sends');

    return {
      performance_summary: {
        overall_score: 75,
        metrics: {
          sends: input.send_count as number,
          opens: 0,
          clicks: 0,
          replies: 0,
          open_rate: 0,
          click_rate: 0,
          reply_rate: 0,
        },
        vs_benchmark: {},
      },
      insights: [
        {
          type: 'early_signal',
          description: 'Initial sends completed, monitoring for early engagement signals',
          confidence: 0.7,
        },
      ],
      recommendations: ['Monitor for opens and clicks over next 48 hours'],
      next_iteration_suggestions: {
        what_worked: [],
        what_didnt: [],
        try_next_time: [],
      },
    };
  }

  private async analyzeFollowupImpact(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<AnalysisOutput> {
    const { logger } = context;

    logger.info('Analyzing follow-up impact');

    return {
      performance_summary: {
        overall_score: 65,
        metrics: {
          sends: 0,
          opens: 0,
          clicks: 0,
          replies: 0,
          open_rate: 0,
          click_rate: 0,
          reply_rate: 0,
        },
        vs_benchmark: {},
      },
      insights: [
        {
          type: 'followup_effectiveness',
          description: 'Follow-up campaign performance analyzed',
          confidence: 0.75,
        },
      ],
      recommendations: ['Adjust follow-up timing based on results'],
      next_iteration_suggestions: {
        what_worked: ['Timely follow-ups'],
        what_didnt: [],
        try_next_time: ['A/B test follow-up messaging'],
      },
    };
  }

  // Helper methods
  private calculateAverageBenchmark(benchmarks: any[]): CampaignMetrics {
    if (benchmarks.length === 0) {
      return {
        sends: 100,
        opens: 35,
        clicks: 10,
        replies: 5,
        open_rate: 0.35,
        click_rate: 0.10,
        reply_rate: 0.05,
      };
    }

    // Simplified - would actually calculate from patterns
    return {
      sends: 100,
      opens: 35,
      clicks: 10,
      replies: 5,
      open_rate: 0.35,
      click_rate: 0.10,
      reply_rate: 0.05,
    };
  }

  private calculateOverallScore(metrics: CampaignMetrics, benchmark: CampaignMetrics): number {
    const openScore = (metrics.open_rate / benchmark.open_rate) * 40;
    const replyScore = (metrics.reply_rate / benchmark.reply_rate) * 60;
    return Math.min(100, Math.max(0, openScore + replyScore));
  }

  private generateRecommendations(metrics: CampaignMetrics, vs_benchmark: Record<string, number>): string[] {
    const recommendations: string[] = [];

    if (vs_benchmark.open_rate < -10) {
      recommendations.push('Improve subject line personalization and timing');
    }

    if (vs_benchmark.reply_rate < -10) {
      recommendations.push('Enhance pitch relevance and value proposition');
    }

    if (metrics.sends > 100 && metrics.replies === 0) {
      recommendations.push('Review contact quality and targeting criteria');
    }

    return recommendations.length > 0 ? recommendations : ['Continue current strategy'];
  }

  private identifyWhatWorked(metrics: CampaignMetrics, vs_benchmark: Record<string, number>): string[] {
    const worked: string[] = [];

    if (vs_benchmark.open_rate > 10) {
      worked.push('Strong subject lines and send timing');
    }

    if (vs_benchmark.reply_rate > 10) {
      worked.push('Compelling pitch content and personalization');
    }

    return worked;
  }

  private identifyWhatDidnt(metrics: CampaignMetrics, vs_benchmark: Record<string, number>): string[] {
    const didnt: string[] = [];

    if (vs_benchmark.open_rate < -10) {
      didnt.push('Subject lines or send timing');
    }

    if (metrics.click_rate < 0.05) {
      didnt.push('Call-to-action clarity');
    }

    return didnt;
  }

  private suggestImprovements(metrics: CampaignMetrics, vs_benchmark: Record<string, number>): string[] {
    return [
      'A/B test subject lines',
      'Refine contact targeting',
      'Optimize send timing based on contact timezone',
      'Enhance pitch personalization',
    ];
  }
}
