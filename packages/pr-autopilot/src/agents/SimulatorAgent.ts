/**
 * Simulator Agent
 *
 * Purpose: Run "what-if" simulations without actually sending anything.
 * Estimates outcomes and risk levels for proposed strategies.
 */

import type { AgentContext, AutopilotTask, SimulationOutput, SimulationScenario } from '../types';

export class SimulatorAgent {
  async execute(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<SimulationOutput> {
    context.logger.info('SimulatorAgent executing task', {
      taskType: task.type,
    });

    if (task.type === 'simulate_campaign') {
      return await this.simulateCampaign(task, context);
    } else if (task.type === 'simulate_strategy_variants') {
      return await this.simulateStrategyVariants(task, context);
    }

    throw new Error(`Unknown task type for Simulator: ${task.type}`);
  }

  private async simulateCampaign(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<SimulationOutput> {
    const { clients, logger, mission } = context;
    const input = task.input;

    logger.info('Simulating campaign outcomes');

    // Get historical success profiles for similar campaigns
    const similarCampaigns = await clients.successProfiles.findSimilarCampaigns({
      genre: mission.config.targeting?.genres?.[0],
      campaign_type: 'pr',
    });

    // Create simulation scenarios
    const scenarios: SimulationScenario[] = [];

    // Scenario 1: Conservative approach
    scenarios.push({
      id: 'conservative',
      name: 'Conservative Approach',
      description: 'Focus on tier 1 contacts only, personalized pitches, slow rollout',
      estimated_outcomes: {
        reach: this.estimateReach(mission, 0.3),
        engagement: 0.45,
        resource_usage: 0.3,
      },
      confidence: 0.85,
    });

    // Scenario 2: Balanced approach (recommended)
    scenarios.push({
      id: 'balanced',
      name: 'Balanced Approach',
      description: 'Mix of tier 1-2 contacts, AB tested pitches, phased rollout',
      estimated_outcomes: {
        reach: this.estimateReach(mission, 0.6),
        engagement: 0.35,
        resource_usage: 0.6,
      },
      confidence: 0.75,
    });

    // Scenario 3: Aggressive approach
    scenarios.push({
      id: 'aggressive',
      name: 'Aggressive Approach',
      description: 'All tiers, multiple pitch variants, rapid rollout',
      estimated_outcomes: {
        reach: this.estimateReach(mission, 1.0),
        engagement: 0.25,
        resource_usage: 1.0,
      },
      confidence: 0.65,
    });

    // Assess risks
    const risk_assessment = this.assessRisk(mission, scenarios);

    // Recommend scenario (default to balanced)
    const recommended_scenario = 'balanced';

    logger.info('Campaign simulation complete', {
      scenarios: scenarios.length,
      recommended: recommended_scenario,
      overall_risk: risk_assessment.overall_risk,
    });

    return {
      scenarios,
      recommended_scenario,
      risk_assessment,
    };
  }

  private async simulateStrategyVariants(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<SimulationOutput> {
    const { logger } = context;
    const input = task.input;

    logger.info('Simulating strategy variants');

    const variants = input.variants as any[];
    const scenarios = variants.map((variant, idx) => ({
      id: `variant-${idx}`,
      name: variant.name,
      description: variant.description,
      estimated_outcomes: {
        reach: Math.random() * 100,
        engagement: Math.random(),
        resource_usage: Math.random(),
      },
      confidence: 0.7 + Math.random() * 0.2,
    }));

    return {
      scenarios,
      recommended_scenario: scenarios[0].id,
      risk_assessment: {
        overall_risk: 'medium',
        risk_factors: ['Untested strategy', 'Limited historical data'],
      },
    };
  }

  private estimateReach(mission: any, multiplier: number): number {
    const baseReach = mission.config.targeting?.max_contacts || 500;
    return Math.floor(baseReach * multiplier);
  }

  private assessRisk(
    mission: any,
    scenarios: SimulationScenario[]
  ): { overall_risk: 'low' | 'medium' | 'high'; risk_factors: string[] } {
    const risk_factors: string[] = [];

    // Check for risk factors
    if (mission.mode === 'full_auto') {
      risk_factors.push('Full automation without approval gates');
    }

    const maxReach = Math.max(...scenarios.map((s) => s.estimated_outcomes.reach));
    if (maxReach > 1000) {
      risk_factors.push('High contact volume increases spam risk');
    }

    if (mission.config.budget?.max_sends_per_day > 100) {
      risk_factors.push('High daily send volume may trigger rate limits');
    }

    // Determine overall risk
    let overall_risk: 'low' | 'medium' | 'high';
    if (risk_factors.length === 0) {
      overall_risk = 'low';
    } else if (risk_factors.length <= 2) {
      overall_risk = 'medium';
    } else {
      overall_risk = 'high';
    }

    return { overall_risk, risk_factors };
  }
}
