/**
 * Campaign Orchestrator - Intel-Driven Campaign Planning System
 * Coordinates Campaign Planner Agent with Intel Research Agent for strategic insights
 */

import axios from 'axios';

export interface CampaignRequest {
  artistName: string;
  trackTitle: string;
  genre: string;
  releaseDate: string;
  budget: number;
  primaryGoals: string[];
  targetContacts?: any[];
  existingIntel?: any;
}

export interface CampaignPlan {
  campaignOverview: {
    name: string;
    duration: string;
    primaryGoal: string;
    targetAudience: string;
    budgetAllocation: string[];
    successMetrics: string[];
  };
  timeline: CampaignPhase[];
  intelligenceInsights: any;
  riskAssessment: string[];
  crossPlatformStrategy: any;
  successProbability: string;
}

export interface CampaignPhase {
  week: number;
  name: string;
  phase: 'pre-release' | 'release' | 'post-release';
  tasks: string[];
  deliverables: string[];
  budget: string;
  milestones: string[];
  intelInsights?: any;
}

class CampaignOrchestrator {
  private apiBase: string;

  constructor(apiBase: string = '/api') {
    this.apiBase = apiBase;
  }

  /**
   * Generate comprehensive campaign plan with intel integration
   */
  async generateIntelDrivenCampaign(request: CampaignRequest): Promise<CampaignPlan> {
    try {
      // Step 1: Gather strategic intelligence for campaign planning
      const intelInsights = await this.gatherCampaignIntelligence(request);

      // Step 2: Generate comprehensive campaign plan with intel context
      const campaignPlan = await this.generateCampaignStrategy(request, intelInsights);

      // Step 3: Enhance campaign phases with intel insights
      const enhancedCampaign = await this.enhanceCampaignWithIntelligence(
        campaignPlan,
        intelInsights
      );

      return enhancedCampaign;
    } catch (error) {
      console.error('Campaign orchestration failed:', error);
      throw new Error('Failed to generate intel-driven campaign plan');
    }
  }

  /**
   * Gather strategic intelligence for campaign planning
   */
  private async gatherCampaignIntelligence(request: CampaignRequest): Promise<any> {
    const intelQuery = `Analyze strategic intelligence for music campaign planning:

Artist: ${request.artistName}
Track: ${request.trackTitle}
Genre: ${request.genre}
Release Date: ${request.releaseDate}
Budget: $${request.budget}
Goals: ${request.primaryGoals.join(', ')}

Provide strategic intelligence for:
1. Market timing analysis and competitive landscape
2. Genre-specific promotion strategies and key contacts
3. Budget optimization across different phases
4. Risk assessment and success probability factors
5. Platform-specific strategies and timing recommendations`;

    try {
      const response = await axios.post(`${this.apiBase}/ai-agent`, {
        agentType: 'intel-research-agent',
        query: intelQuery,
        context: {
          campaign: request,
          targetContacts: request.targetContacts || [],
        },
      });

      const data = response.data as any;
      if (data.success) {
        return {
          analysis: data.response,
          recommendations: data.recommendations,
          intelligenceData: data.data,
          marketInsights: this.extractMarketInsights(data.response),
          contactStrategy: this.extractContactStrategy(data.response),
          timingRecommendations: this.extractTimingRecommendations(data.response),
        };
      }
    } catch (error) {
      console.warn('Intel research failed, using fallback strategy:', error);
    }

    // Fallback intelligence
    return {
      analysis: 'Basic campaign intelligence generated',
      recommendations: ['Focus on genre-specific contacts', 'Optimize timing for maximum impact'],
      intelligenceData: null,
      marketInsights: { competitiveLevel: 'Medium', optimalTiming: 'Standard' },
      contactStrategy: { primaryTargets: 'Genre curators', outreachTiming: 'Pre-release' },
      timingRecommendations: { startPhase: '6 weeks pre-release', peakEffort: 'Release week' },
    };
  }

  /**
   * Generate campaign strategy with intel context
   */
  private async generateCampaignStrategy(
    request: CampaignRequest,
    intelInsights: any
  ): Promise<any> {
    const campaignQuery = `Create a comprehensive 6-8 week campaign strategy:

CAMPAIGN CONTEXT:
- Artist: ${request.artistName}
- Track: ${request.trackTitle}  
- Genre: ${request.genre}
- Release Date: ${request.releaseDate}
- Budget: $${request.budget}
- Goals: ${request.primaryGoals.join(', ')}

INTEL INSIGHTS:
- Market Analysis: ${intelInsights.marketInsights?.competitiveLevel || 'Standard'}
- Optimal Timing: ${intelInsights.timingRecommendations?.optimalTiming || 'Standard approach'}
- Contact Strategy: ${intelInsights.contactStrategy?.primaryTargets || 'Industry contacts'}
- Success Probability: ${intelInsights.intelligenceData?.successProbability || 'Medium'}

Generate a detailed 6-8 week campaign plan optimized with intelligence insights.`;

    try {
      const response = await axios.post(`${this.apiBase}/ai-agent`, {
        agentType: 'campaign-planner-agent',
        query: campaignQuery,
        context: {
          campaign: request,
          intelligence: intelInsights,
        },
      });

      const data = response.data as any;
      if (data.success) {
        return {
          plan: data.response,
          campaignData: data.data,
          recommendations: data.recommendations,
          nextSteps: data.nextSteps,
        };
      }
    } catch (error) {
      console.warn('Campaign planning failed:', error);
    }

    throw new Error('Campaign strategy generation failed');
  }

  /**
   * Enhance campaign phases with specific intelligence insights
   */
  private async enhanceCampaignWithIntelligence(
    campaignPlan: any,
    intelInsights: any
  ): Promise<CampaignPlan> {
    const phases = campaignPlan.campaignData?.phases || [];

    const enhancedPhases: CampaignPhase[] = phases.map((phase: any) => ({
      ...phase,
      intelInsights: {
        strategicFocus: this.getPhaseIntelligence(phase, intelInsights),
        contactRecommendations: this.getPhaseContacts(phase, intelInsights),
        optimizationTips: this.getPhaseOptimization(phase, intelInsights),
      },
    }));

    return {
      campaignOverview: {
        name: campaignPlan.campaignData?.campaignName || 'Strategic Campaign',
        duration: campaignPlan.campaignData?.duration || '8 weeks',
        primaryGoal: campaignPlan.campaignData?.primaryGoal || 'Maximize reach and engagement',
        targetAudience: campaignPlan.campaignData?.targetAudience || 'Genre-specific audience',
        budgetAllocation: campaignPlan.campaignData?.budgetAllocation || [],
        successMetrics: campaignPlan.campaignData?.successMetrics || [],
      },
      timeline: enhancedPhases,
      intelligenceInsights: intelInsights,
      riskAssessment: campaignPlan.campaignData?.riskAssessment || [],
      crossPlatformStrategy: {
        audioIntelStrategy: this.generateAudioIntelStrategy(intelInsights),
        playlistPulseStrategy: this.generatePlaylistPulseStrategy(intelInsights),
        socialMediaStrategy: this.generateSocialMediaStrategy(intelInsights),
      },
      successProbability: intelInsights.intelligenceData?.successProbability || 'Medium',
    };
  }

  /**
   * Extract market insights from intel response
   */
  private extractMarketInsights(intelResponse: string): any {
    const competitiveLevel = intelResponse.includes('high competition')
      ? 'High'
      : intelResponse.includes('low competition')
        ? 'Low'
        : 'Medium';

    const optimalTiming = intelResponse.includes('immediate release')
      ? 'Fast track'
      : intelResponse.includes('delayed release')
        ? 'Extended timeline'
        : 'Standard';

    return { competitiveLevel, optimalTiming };
  }

  /**
   * Extract contact strategy from intel response
   */
  private extractContactStrategy(intelResponse: string): any {
    const primaryTargets = intelResponse.includes('playlist curators')
      ? 'Playlist curators'
      : intelResponse.includes('radio DJs')
        ? 'Radio contacts'
        : 'Genre curators';

    const outreachTiming = intelResponse.includes('early outreach')
      ? '8 weeks pre-release'
      : intelResponse.includes('late outreach')
        ? '2 weeks pre-release'
        : 'Pre-release';

    return { primaryTargets, outreachTiming };
  }

  /**
   * Extract timing recommendations from intel response
   */
  private extractTimingRecommendations(intelResponse: string): any {
    const startPhase = intelResponse.includes('extended campaign')
      ? '8 weeks pre-release'
      : '6 weeks pre-release';
    const peakEffort = intelResponse.includes('sustained effort')
      ? 'Release + 2 weeks'
      : 'Release week';

    return { startPhase, peakEffort };
  }

  /**
   * Get phase-specific intelligence insights
   */
  private getPhaseIntelligence(phase: any, intelInsights: any): string[] {
    const phaseInsights = [];

    if (phase.week < -3) {
      phaseInsights.push('Focus on strategic planning and content creation');
      phaseInsights.push('Begin relationship building with key contacts');
    } else if (phase.week < 0) {
      phaseInsights.push('Intensify outreach based on intel recommendations');
      phaseInsights.push('Implement platform-specific strategies');
    } else if (phase.week === 0) {
      phaseInsights.push('Execute high-impact launch activities');
      phaseInsights.push('Monitor real-time performance metrics');
    } else {
      phaseInsights.push('Optimize based on performance data');
      phaseInsights.push('Sustain momentum with targeted follow-ups');
    }

    return phaseInsights;
  }

  /**
   * Get phase-specific contact recommendations
   */
  private getPhaseContacts(phase: any, intelInsights: any): string[] {
    if (phase.week < -2) {
      return ['High-priority playlist curators', 'Genre-specific blogs and magazines'];
    } else if (phase.week < 1) {
      return ['Radio DJs and programmers', 'Social media influencers', 'Podcast hosts'];
    } else {
      return ['Follow-up contacts', 'New opportunity contacts', 'Performance feedback sources'];
    }
  }

  /**
   * Get phase-specific optimization tips
   */
  private getPhaseOptimization(phase: any, intelInsights: any): string[] {
    const tips = [];

    if (phase.week < 0) {
      tips.push('Use intel insights to personalize outreach messages');
      tips.push('Optimize timing based on contact preferences');
    } else {
      tips.push('Monitor performance and adjust strategy in real-time');
      tips.push('Leverage successful tactics for sustained momentum');
    }

    return tips;
  }

  /**
   * Generate Audio Intel integration strategy
   */
  private generateAudioIntelStrategy(intelInsights: any): any {
    return {
      contactEnrichment: 'Use Intel Research Agent for deep contact analysis',
      targetingStrategy: 'Leverage success probability assessments for contact prioritization',
      outreachOptimization: 'Apply strategic insights to personalize outreach messages',
      performanceTracking: 'Monitor contact engagement and campaign effectiveness',
    };
  }

  /**
   * Generate Playlist Pulse integration strategy
   */
  private generatePlaylistPulseStrategy(intelInsights: any): any {
    return {
      curatorTargeting: 'Focus on high-probability curator contacts from intel analysis',
      pitchCustomization: 'Customize pitch parameters based on intel recommendations',
      timingOptimization: 'Use intel timing insights for optimal submission windows',
      successTracking: 'Monitor playlist placement success rates and optimize',
    };
  }

  /**
   * Generate social media integration strategy
   */
  private generateSocialMediaStrategy(intelInsights: any): any {
    return {
      contentStrategy: 'Align social content with intel-identified opportunities',
      influencerTargeting: 'Target influencers based on genre and audience analysis',
      timingOptimization: 'Post content during optimal engagement windows',
      communityBuilding: 'Build sustained engagement through strategic community interaction',
    };
  }

  /**
   * Generate campaign milestone tracking system
   */
  async generateMilestoneTracker(campaignPlan: CampaignPlan): Promise<any> {
    const milestones = [];

    for (const phase of campaignPlan.timeline) {
      milestones.push({
        week: phase.week,
        phase: phase.phase,
        title: phase.name,
        tasks: phase.tasks,
        deadline: this.calculatePhaseDeadline(phase.week),
        status: 'pending',
        successMetrics: this.generatePhaseMetrics(phase),
        intelOptimizations: phase.intelInsights?.optimizationTips || [],
      });
    }

    return {
      campaignId: `campaign-${Date.now()}`,
      milestones,
      overallProgress: 0,
      successProbability: campaignPlan.successProbability,
      nextCriticalMilestone: milestones.find(m => m.status === 'pending'),
      intelligenceUpdates: [],
    };
  }

  /**
   * Calculate phase deadline based on week number
   */
  private calculatePhaseDeadline(weekNumber: number): string {
    const now = new Date();
    const targetDate = new Date(now.getTime() + weekNumber * 7 * 24 * 60 * 60 * 1000);
    return targetDate.toISOString().split('T')[0];
  }

  /**
   * Generate phase-specific success metrics
   */
  private generatePhaseMetrics(phase: any): string[] {
    const metrics = [];

    if (phase.phase === 'pre-release') {
      metrics.push('Contact outreach completion rate');
      metrics.push('Content creation progress');
      metrics.push('Pre-save/follow conversions');
    } else if (phase.phase === 'release') {
      metrics.push('Release week streams/plays');
      metrics.push('Playlist placements secured');
      metrics.push('Social media engagement rate');
    } else {
      metrics.push('Sustained engagement metrics');
      metrics.push('Long-term playlist retention');
      metrics.push('Fan base growth rate');
    }

    return metrics;
  }
}

export default CampaignOrchestrator;
