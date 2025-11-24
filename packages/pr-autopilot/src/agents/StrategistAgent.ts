/**
 * Strategist Agent
 *
 * Purpose: Interprets mission brief, decides high-level strategy, and creates execution plan.
 * Breaks work into downstream tasks for other agents.
 */

import type { AgentContext, AutopilotTask, StrategyOutput } from '../types';

export class StrategistAgent {
  async execute(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<StrategyOutput> {
    context.logger.info('StrategistAgent executing task', {
      taskType: task.type,
      missionMode: context.mission.mode,
    });

    if (task.type === 'plan_campaign') {
      return await this.planCampaign(task, context);
    }

    throw new Error(`Unknown task type for Strategist: ${task.type}`);
  }

  private async planCampaign(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<StrategyOutput> {
    const { mission, clients, logger } = context;
    const config = mission.config;

    logger.info('Planning campaign strategy', {
      goals: config.strategy?.goals,
      timeline: config.strategy?.timeline,
    });

    // Analyze existing campaigns using CMG
    const campaignHistory = await clients.cmg.getMemories({
      type: 'campaign',
      user_id: context.userId,
    });

    // Get success profiles for similar campaigns
    const similarCampaigns = await clients.successProfiles.findSimilarCampaigns({
      genre: config.targeting?.genres?.[0],
      campaign_type: 'pr',
    });

    // Get best practices
    const bestPractices = config.targeting?.genres?.[0]
      ? await clients.successProfiles.getBestPractices(
          config.targeting.genres[0],
          'pr'
        )
      : [];

    // Build campaign phases
    const phases: StrategyOutput['phases'] = [
      {
        name: 'Warm-up',
        description: 'Build awareness with tier 1 contacts',
        start_date: config.strategy?.timeline?.start_date || new Date().toISOString(),
        end_date: this.addDays(config.strategy?.timeline?.start_date || new Date().toISOString(), 7),
        goals: ['Initial contact with tier 1 outlets', 'Build early momentum'],
        tactics: ['Personalized pitches', 'Exclusive previews'],
      },
      {
        name: 'Launch',
        description: 'Maximize coverage at release',
        start_date: this.addDays(config.strategy?.timeline?.start_date || new Date().toISOString(), 7),
        end_date: this.addDays(config.strategy?.timeline?.start_date || new Date().toISOString(), 14),
        goals: ['Tier 1 and 2 coverage', 'Social proof generation'],
        tactics: ['Tiered pitching', 'Follow-up on interested contacts'],
      },
      {
        name: 'Sustain',
        description: 'Maintain visibility post-launch',
        start_date: this.addDays(config.strategy?.timeline?.start_date || new Date().toISOString(), 14),
        end_date: this.addDays(config.strategy?.timeline?.start_date || new Date().toISOString(), 30),
        goals: ['Long-tail coverage', 'International reach'],
        tactics: ['Territory expansion', 'Secondary outlets'],
      },
    ];

    // Channel mix strategy
    const channel_mix: StrategyOutput['channel_mix'] = [
      {
        channel: 'radio',
        priority: 'high',
        allocation: 40,
        rationale: 'Primary reach driver for genre',
      },
      {
        channel: 'blog',
        priority: 'high',
        allocation: 30,
        rationale: 'Written coverage for SEO and credibility',
      },
      {
        channel: 'playlist',
        priority: 'medium',
        allocation: 20,
        rationale: 'Streaming discovery and algorithmic boost',
      },
      {
        channel: 'press',
        priority: 'low',
        allocation: 10,
        rationale: 'Prestige and social proof',
      },
    ];

    // Contact targeting
    const contact_targeting: StrategyOutput['contact_targeting'] = {
      primary_pool: {
        criteria: {
          genres: config.targeting?.genres || [],
          territories: config.targeting?.territories || ['UK'],
          contact_types: ['radio', 'blog'],
          tiers: ['tier_1', 'tier_2'],
        },
        estimated_size: Math.min(
          config.targeting?.max_contacts || 500,
          300
        ),
      },
      secondary_pool: {
        criteria: {
          genres: config.targeting?.genres || [],
          territories: ['US', 'EU'],
          contact_types: ['playlist', 'press'],
          tiers: ['tier_2', 'tier_3'],
        },
        estimated_size: Math.min(
          config.targeting?.max_contacts || 500,
          150
        ),
      },
      experimental_pool: {
        criteria: {
          genres: this.getRelatedGenres(config.targeting?.genres?.[0] || ''),
          territories: config.targeting?.territories || [],
          contact_types: ['blog', 'playlist'],
        },
        estimated_size: 50,
      },
    };

    // Timeline strategy
    const timeline: StrategyOutput['timeline'] = {
      start_date: config.strategy?.timeline?.start_date || new Date().toISOString(),
      end_date: config.strategy?.timeline?.end_date || this.addDays(new Date().toISOString(), 30),
      milestones: [
        {
          date: this.addDays(new Date().toISOString(), 7),
          event: 'Complete tier 1 outreach',
          importance: 'high',
        },
        {
          date: this.addDays(new Date().toISOString(), 14),
          event: 'Launch day push',
          importance: 'high',
        },
        {
          date: this.addDays(new Date().toISOString(), 21),
          event: 'Follow-up wave complete',
          importance: 'medium',
        },
      ],
    };

    // Downstream tasks for other agents
    const downstream_tasks: StrategyOutput['downstream_tasks'] = [
      {
        agent_role: 'pitch',
        type: 'generate_pitch_set',
        priority: 10,
        input: {
          artist_name: config.assets?.artist_id || 'Artist',
          release_title: config.assets?.release_id || 'Release',
          genre: config.targeting?.genres?.[0] || 'indie',
          target_outlets: ['radio', 'blog', 'playlist'],
          style: config.preferences?.pitch_style || 'personal',
        },
      },
      {
        agent_role: 'contact',
        type: 'build_contact_pool',
        priority: 10,
        input: {
          targeting: contact_targeting,
          max_contacts: config.targeting?.max_contacts || 500,
        },
      },
      {
        agent_role: 'scheduler',
        type: 'propose_send_schedule',
        priority: 5,
        input: {
          timeline,
          phases,
          quiet_hours: config.preferences?.quiet_hours,
        },
      },
    ];

    logger.info('Campaign strategy complete', {
      phases: phases.length,
      channels: channel_mix.length,
      downstream_tasks: downstream_tasks.length,
    });

    return {
      phases,
      channel_mix,
      contact_targeting,
      timeline,
      downstream_tasks,
    };
  }

  private addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  private getRelatedGenres(genre: string): string[] {
    const genreMap: Record<string, string[]> = {
      indie: ['alternative', 'indie-rock', 'indie-pop'],
      electronic: ['techno', 'house', 'ambient'],
      'hip-hop': ['rap', 'trap', 'r&b'],
      rock: ['alternative', 'indie-rock', 'punk'],
    };

    return genreMap[genre.toLowerCase()] || [genre];
  }
}
