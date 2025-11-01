/**
 * AgentRegistry - Central Agent Management
 * Discovers, registers, and provides access to all Total Audio agents
 */

import { IntelAgent } from '../intel/IntelAgent';
import { PitchAgent } from '../pitch/PitchAgent';
import { TrackerAgent } from '../tracker/TrackerAgent';
import { InsightAgent } from '../insight/InsightAgent';
import { VoiceGuardAgent } from '../voiceguard/VoiceGuardAgent';
import type { BaseAgent } from './BaseAgent';
import type { AgentManifest } from './AgentTypes';

export class AgentRegistry {
  private static agents: Map<string, BaseAgent> = new Map();
  private static manifests: Map<string, AgentManifest> = new Map();

  /**
   * Initialise registry with all available agents
   */
  static init() {
    // Register agents
    this.register('intel', new IntelAgent());
    this.register('pitch', new PitchAgent());
    this.register('tracker', new TrackerAgent());
    this.register('insight', new InsightAgent());
    this.register('voiceguard', new VoiceGuardAgent());

    // Load manifests
    this.loadManifests();

    console.log(`[AgentRegistry] Initialised with ${this.agents.size} agents`);
  }

  /**
   * Register an agent
   */
  static register(name: string, agent: BaseAgent) {
    this.agents.set(name, agent);
  }

  /**
   * Get agent by name
   */
  static get(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  /**
   * Get all registered agents
   */
  static getAll(): Map<string, BaseAgent> {
    return this.agents;
  }

  /**
   * List all agent names
   */
  static list(): string[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Get agent manifest
   */
  static getManifest(name: string): AgentManifest | undefined {
    return this.manifests.get(name);
  }

  /**
   * Get all manifests
   */
  static getAllManifests(): Map<string, AgentManifest> {
    return this.manifests;
  }

  /**
   * Get agent statistics
   */
  static getStats(name?: string) {
    if (name) {
      const agent = this.get(name);
      return agent ? agent.getStats() : null;
    }

    // Return stats for all agents
    const stats: Record<string, any> = {};
    this.agents.forEach((agent, name) => {
      stats[name] = agent.getStats();
    });
    return stats;
  }

  /**
   * Health check - verify all agents are operational
   */
  static async healthCheck(): Promise<{
    healthy: boolean;
    agents: Record<string, { status: 'ok' | 'error'; message?: string }>;
  }> {
    const results: Record<string, { status: 'ok' | 'error'; message?: string }> = {};
    let allHealthy = true;

    for (const [name, agent] of this.agents) {
      try {
        // Simple health check - verify agent exists and has run method
        if (typeof agent.run === 'function') {
          results[name] = { status: 'ok' };
        } else {
          results[name] = {
            status: 'error',
            message: 'Agent missing run method',
          };
          allHealthy = false;
        }
      } catch (error) {
        results[name] = {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        };
        allHealthy = false;
      }
    }

    return {
      healthy: allHealthy,
      agents: results,
    };
  }

  /**
   * Load agent manifests
   */
  private static loadManifests() {
    // Load manifests from JSON files
    // In production, these would be dynamically loaded
    // For now, we'll create them inline

    this.manifests.set('intel', {
      name: 'IntelAgent',
      version: '1.0.0',
      description: 'Contact enrichment and validation agent',
      capabilities: [
        'contact_discovery',
        'label_matching',
        'enrichment_validation',
        'quality_scoring',
      ],
      subAgents: ['ContactFinder', 'LabelMatcher', 'EnrichmentValidator'],
      dependencies: ['supabase', 'perplexity'],
    });

    this.manifests.set('pitch', {
      name: 'PitchAgent',
      version: '1.0.0',
      description: 'Pitch drafting, tone checking, and follow-up management',
      capabilities: [
        'pitch_drafting',
        'tone_validation',
        'follow_up_generation',
        'brand_voice_enforcement',
      ],
      subAgents: ['PitchFormatter', 'ToneChecker', 'FollowUpWriter'],
    });

    this.manifests.set('tracker', {
      name: 'TrackerAgent',
      version: '1.0.0',
      description: 'Campaign tracking, analytics, and reminders',
      capabilities: [
        'submission_logging',
        'campaign_analytics',
        'follow_up_reminders',
        'status_tracking',
      ],
      subAgents: ['SubmissionLogger', 'AnalyticsSummariser', 'ReminderAgent'],
      dependencies: ['supabase'],
    });

    this.manifests.set('insight', {
      name: 'InsightAgent',
      version: '1.0.0',
      description: 'Campaign performance analysis and insights',
      capabilities: [
        'performance_analysis',
        'engagement_insights',
        'conversion_tracking',
        'trend_detection',
      ],
      dependencies: ['supabase'],
    });

    this.manifests.set('voiceguard', {
      name: 'VoiceGuardAgent',
      version: '1.0.0',
      description: "Brand voice enforcement - ensures authentic 'honest maker' tone",
      capabilities: [
        'tone_validation',
        'brand_voice_checking',
        'corporate_speak_detection',
        'authenticity_scoring',
      ],
    });
  }
}

// Initialise registry on import
AgentRegistry.init();

// Export convenience object for direct access
export const Agents = {
  intel: AgentRegistry.get('intel')!,
  pitch: AgentRegistry.get('pitch')!,
  tracker: AgentRegistry.get('tracker')!,
  insight: AgentRegistry.get('insight')!,
  voiceguard: AgentRegistry.get('voiceguard')!,
};
