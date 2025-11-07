/**
 * Timing Optimizer - Rapid Response Pipeline
 * Handles 15-minute news detection and 30-minute content generation pipeline
 * Optimizes posting times for maximum impact and engagement
 */

import { NewsItem, TrendAlert } from './trend-detection';
import { ScoringResult } from './relevance-scoring';
import { FusedContent } from './content-fusion';
import cron from 'node-cron';
import { addMinutes, isAfter, isBefore, parseISO, format, startOfDay, addHours } from 'date-fns';

export interface TimingStrategy {
  rapidResponse: RapidResponseConfig;
  optimalPosting: OptimalPostingConfig;
  contentLifecycle: ContentLifecycleConfig;
  competitiveMonitoring: CompetitiveMonitoringConfig;
  platformTiming: PlatformTimingConfig;
}

export interface RapidResponseConfig {
  detectionWindow: number; // minutes to detect trending news
  contentGenerationWindow: number; // minutes to generate content
  publicationDelay: number; // minutes before posting
  qualityThreshold: number; // minimum score for auto-publish
  platforms: {
    immediate: string[]; // platforms for immediate posting
    delayed: string[]; // platforms for delayed posting
    review: string[]; // platforms requiring manual review
  };
  escalationRules: EscalationRule[];
}

export interface OptimalPostingConfig {
  ukBusinessHours: {
    start: number;
    end: number;
    peakTimes: number[];
  };
  musicIndustryTimes: {
    professionalHours: number[];
    avoidTimes: number[];
    weekendMultiplier: number;
  };
  platformOptimization: {
    [platform: string]: {
      optimalHours: number[];
      minimumGap: number; // minutes between posts
      dailyLimit: number;
    };
  };
  audienceTimezones: string[];
  seasonalAdjustments: boolean;
}

export interface ContentLifecycleConfig {
  phases: ContentPhase[];
  crossPlatformSpacing: number; // minutes between platform posts
  followUpWindows: FollowUpWindow[];
  performanceMonitoring: PerformanceMonitoringConfig;
}

export interface ContentPhase {
  name: string;
  platforms: string[];
  delay: number; // minutes from previous phase
  conditions: string[];
  contentTypes: string[];
}

export interface FollowUpWindow {
  trigger: string; // 'high_engagement' | 'viral_threshold' | 'time_based'
  delay: number; // minutes
  action: 'double_down' | 'expand_content' | 'cross_promote' | 'engage_comments';
  platforms: string[];
}

export interface EscalationRule {
  condition: string;
  action: 'notify_human' | 'auto_publish' | 'hold_for_review' | 'emergency_post';
  threshold: number;
  timeLimit: number; // minutes
}

export interface CompetitiveMonitoringConfig {
  enabled: boolean;
  competitorHandles: string[];
  responseDelay: number; // minutes after competitor posts
  differentiationStrategy: 'unique_angle' | 'deeper_analysis' | 'automation_focus';
}

export interface PlatformTimingConfig {
  [platform: string]: {
    optimalTimes: OptimalTime[];
    rateLimits: RateLimit;
    engagementWindows: EngagementWindow[];
    audienceActivity: AudienceActivity;
  };
}

export interface OptimalTime {
  hour: number;
  confidence: number; // 0-1 based on historical data
  audienceSize: number;
  engagementRate: number;
  competitionLevel: 'low' | 'medium' | 'high';
}

export interface RateLimit {
  postsPerHour: number;
  postsPerDay: number;
  minimumGapMinutes: number;
  burstAllowance: number; // extra posts during trending opportunities
}

export interface EngagementWindow {
  start: number; // hour
  end: number; // hour
  multiplier: number; // engagement boost
  audienceType: string;
}

export interface AudienceActivity {
  peakHours: number[];
  timezone: string;
  weekdayPattern: number[]; // 0-6, Sunday to Saturday
  holidayAdjustments: boolean;
}

export interface TimingPlan {
  id: string;
  newsItemId: string;
  contentPieces: Array<{
    content: FusedContent;
    scheduledTime: Date;
    platform: string;
    priority: 'immediate' | 'high' | 'medium' | 'low';
    approvalRequired: boolean;
  }>;
  phases: Array<{
    name: string;
    startTime: Date;
    endTime: Date;
    platforms: string[];
    content: FusedContent[];
  }>;
  monitoring: {
    checkpoints: Date[];
    successMetrics: string[];
    escalationTriggers: string[];
  };
  competitiveContext: {
    competitorActivity: boolean;
    firstMoverAdvantage: boolean;
    responseWindow: number; // minutes
  };
}

export interface TimingExecutionResult {
  success: boolean;
  planId: string;
  executed: Array<{
    contentId: string;
    platform: string;
    actualPostTime: Date;
    scheduledTime: Date;
    delayReason?: string;
    performance?: {
      immediateEngagement: number;
      reach: number;
      virality: boolean;
    };
  }>;
  pending: Array<{
    contentId: string;
    platform: string;
    scheduledTime: Date;
    approvalRequired: boolean;
  }>;
  failed: Array<{
    contentId: string;
    platform: string;
    error: string;
    retryScheduled?: Date;
  }>;
}

class TimingOptimizer {
  private strategy: TimingStrategy;
  private activePlans: Map<string, TimingPlan> = new Map();
  private executionHistory: Map<string, TimingExecutionResult> = new Map();
  private competitorLastSeen: Map<string, Date> = new Map();
  private platformLastPost: Map<string, Date> = new Map();
  private isMonitoringActive: boolean = false;

  constructor(strategy?: Partial<TimingStrategy>) {
    this.strategy = {
      ...this.getDefaultStrategy(),
      ...strategy,
    };
    this.initializeTimingOptimizer();
  }

  /**
   * Create rapid response timing plan for trending news
   */
  async createRapidResponsePlan(
    newsItem: NewsItem,
    scoringResult: ScoringResult,
    fusedContent: FusedContent[],
    alertLevel: 'critical' | 'high' | 'medium' | 'low' = 'high'
  ): Promise<TimingPlan> {
    const now = new Date();
    const detectionTime = newsItem.publishedAt;
    const responseWindow = this.calculateResponseWindow(scoringResult, alertLevel);

    // Check if we're still within competitive response window
    const competitiveContext = this.analyzeCompetitiveContext(newsItem, detectionTime);

    // Create phased timing plan
    const phases = this.createPhasedPlan(fusedContent, responseWindow, competitiveContext);

    // Schedule content pieces with optimal timing
    const contentPieces = await this.scheduleContentPieces(fusedContent, phases, alertLevel);

    // Set up monitoring checkpoints
    const monitoring = this.createMonitoringPlan(contentPieces, responseWindow);

    const timingPlan: TimingPlan = {
      id: `timing_${newsItem.id}_${Date.now()}`,
      newsItemId: newsItem.id,
      contentPieces,
      phases,
      monitoring,
      competitiveContext,
    };

    // Store and start execution
    this.activePlans.set(timingPlan.id, timingPlan);
    await this.startPlanExecution(timingPlan);

    return timingPlan;
  }

  /**
   * Calculate optimal response window based on news characteristics
   */
  private calculateResponseWindow(scoringResult: ScoringResult, alertLevel: string): number {
    let baseWindow = 240; // 4 hours default

    // Adjust for alert level
    const alertMultipliers = {
      critical: 0.25, // 1 hour
      high: 0.5, // 2 hours
      medium: 1.0, // 4 hours
      low: 2.0, // 8 hours
    };
    baseWindow *= alertMultipliers[alertLevel] || 1.0;

    // Adjust for competitive advantage
    if (scoringResult.breakdown.competitiveAdvantage > 0.7) {
      baseWindow *= 0.5; // Faster for competitive opportunities
    }

    // Adjust for trending potential
    if (scoringResult.breakdown.trendingPotential > 0.6) {
      baseWindow *= 0.75; // Faster for viral opportunities
    }

    // Minimum 30 minutes for quality content
    return Math.max(baseWindow, 30);
  }

  /**
   * Analyze competitive context for timing decisions
   */
  private analyzeCompetitiveContext(newsItem: NewsItem, detectionTime: Date): any {
    const competitorActivity = this.checkCompetitorActivity(newsItem);
    const timeSincePublication = Date.now() - detectionTime.getTime();
    const firstMoverAdvantage = timeSincePublication < 60 * 60 * 1000; // Within 1 hour

    return {
      competitorActivity,
      firstMoverAdvantage,
      responseWindow: firstMoverAdvantage ? 120 : 240, // 2 hours vs 4 hours
    };
  }

  /**
   * Create phased content distribution plan
   */
  private createPhasedPlan(
    fusedContent: FusedContent[],
    responseWindow: number,
    competitiveContext: any
  ): Array<any> {
    const phases = [];
    const phaseConfig = this.strategy.contentLifecycle.phases;

    let currentDelay = competitiveContext.firstMoverAdvantage ? 15 : 30; // Start delay

    for (let i = 0; i < phaseConfig.length; i++) {
      const phase = phaseConfig[i];
      const phaseContent = fusedContent.filter(content =>
        phase.platforms.includes(content.platform)
      );

      if (phaseContent.length > 0) {
        phases.push({
          name: phase.name,
          startTime: addMinutes(new Date(), currentDelay),
          endTime: addMinutes(new Date(), currentDelay + phase.delay),
          platforms: phase.platforms,
          content: phaseContent,
        });

        currentDelay += phase.delay + this.strategy.contentLifecycle.crossPlatformSpacing;
      }
    }

    return phases;
  }

  /**
   * Schedule individual content pieces with platform optimization
   */
  private async scheduleContentPieces(
    fusedContent: FusedContent[],
    phases: Array<any>,
    alertLevel: string
  ): Promise<Array<any>> {
    const contentPieces = [];

    for (const content of fusedContent) {
      const phase = phases.find(p => p.platforms.includes(content.platform));
      if (!phase) continue;

      // Calculate optimal posting time within phase window
      const optimalTime = await this.calculateOptimalPostingTime(
        content.platform,
        phase.startTime,
        phase.endTime
      );

      // Determine priority based on content and alert level
      const priority = this.determinePriority(content, alertLevel);

      // Check if approval required
      const approvalRequired = this.requiresApproval(content, priority);

      contentPieces.push({
        content,
        scheduledTime: optimalTime,
        platform: content.platform,
        priority,
        approvalRequired,
      });
    }

    // Sort by priority and timing
    return contentPieces.sort((a, b) => {
      const priorityOrder = { immediate: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.scheduledTime.getTime() - b.scheduledTime.getTime();
    });
  }

  /**
   * Calculate optimal posting time for platform within window
   */
  private async calculateOptimalPostingTime(
    platform: string,
    windowStart: Date,
    windowEnd: Date
  ): Promise<Date> {
    const platformConfig = this.strategy.platformTiming[platform];
    if (!platformConfig) return windowStart;

    // Find optimal times within the window
    const optimalTimes = platformConfig.optimalTimes.filter(opt => {
      const optimalDate = new Date(windowStart);
      optimalDate.setHours(opt.hour, 0, 0, 0);
      return isAfter(optimalDate, windowStart) && isBefore(optimalDate, windowEnd);
    });

    if (optimalTimes.length === 0) {
      // No optimal times in window, use window start
      return this.adjustForBusinessHours(windowStart);
    }

    // Select highest confidence optimal time
    const bestTime = optimalTimes.reduce((best, current) =>
      current.confidence > best.confidence ? current : best
    );

    const scheduledTime = new Date(windowStart);
    scheduledTime.setHours(bestTime.hour, 0, 0, 0);

    // Check rate limits and adjust if needed
    return this.adjustForRateLimits(platform, scheduledTime);
  }

  /**
   * Adjust timing for UK business hours
   */
  private adjustForBusinessHours(time: Date): Date {
    const ukTime = new Date(time.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    const hour = ukTime.getHours();
    const businessHours = this.strategy.optimalPosting.ukBusinessHours;

    // If outside business hours, move to next business hour
    if (hour < businessHours.start || hour >= businessHours.end) {
      const adjustedTime = new Date(ukTime);

      if (hour >= businessHours.end) {
        // Move to next day's start
        adjustedTime.setDate(adjustedTime.getDate() + 1);
        adjustedTime.setHours(businessHours.start, 0, 0, 0);
      } else {
        // Move to today's start
        adjustedTime.setHours(businessHours.start, 0, 0, 0);
      }

      return adjustedTime;
    }

    return ukTime;
  }

  /**
   * Adjust timing for platform rate limits
   */
  private adjustForRateLimits(platform: string, scheduledTime: Date): Date {
    const lastPost = this.platformLastPost.get(platform);
    if (!lastPost) return scheduledTime;

    const platformConfig = this.strategy.platformTiming[platform];
    if (!platformConfig) return scheduledTime;

    const minimumGap = platformConfig.rateLimits.minimumGapMinutes * 60 * 1000;
    const timeSinceLastPost = scheduledTime.getTime() - lastPost.getTime();

    if (timeSinceLastPost < minimumGap) {
      return new Date(lastPost.getTime() + minimumGap);
    }

    return scheduledTime;
  }

  /**
   * Start executing timing plan
   */
  private async startPlanExecution(plan: TimingPlan): Promise<void> {
    console.log(`🚀 Starting execution of timing plan ${plan.id}`);

    // Schedule immediate content
    const immediateContent = plan.contentPieces.filter(cp => cp.priority === 'immediate');
    for (const contentPiece of immediateContent) {
      if (!contentPiece.approvalRequired) {
        setTimeout(
          () => {
            this.executeContentPublication(contentPiece, plan.id);
          },
          Math.max(0, contentPiece.scheduledTime.getTime() - Date.now())
        );
      }
    }

    // Schedule high-priority content
    const highPriorityContent = plan.contentPieces.filter(cp => cp.priority === 'high');
    for (const contentPiece of highPriorityContent) {
      if (!contentPiece.approvalRequired) {
        setTimeout(
          () => {
            this.executeContentPublication(contentPiece, plan.id);
          },
          Math.max(0, contentPiece.scheduledTime.getTime() - Date.now())
        );
      }
    }

    // Set up monitoring
    this.setupPlanMonitoring(plan);
  }

  /**
   * Execute content publication
   */
  private async executeContentPublication(contentPiece: any, planId: string): Promise<void> {
    try {
      console.log(`📱 Publishing ${contentPiece.platform} content at ${new Date()}`);

      // Update platform last post time
      this.platformLastPost.set(contentPiece.platform, new Date());

      // Record execution
      this.recordExecution(planId, contentPiece, true);

      // Monitor immediate performance
      setTimeout(
        () => {
          this.monitorImmediatePerformance(contentPiece);
        },
        15 * 60 * 1000
      ); // 15 minutes
    } catch (error) {
      console.error(`Failed to publish ${contentPiece.platform} content:`, error);
      this.recordExecution(planId, contentPiece, false, error.message);
    }
  }

  /**
   * Monitor immediate performance and trigger follow-ups
   */
  private async monitorImmediatePerformance(contentPiece: any): Promise<void> {
    // Mock performance data - in real implementation, fetch from platform APIs
    const performance = {
      immediateEngagement: Math.random() * 100,
      reach: Math.random() * 5000,
      virality: Math.random() > 0.8,
    };

    console.log(`📊 Performance check for ${contentPiece.platform}:`, performance);

    // Check for viral threshold
    if (performance.virality || performance.immediateEngagement > 50) {
      await this.triggerFollowUpContent(contentPiece, performance);
    }
  }

  /**
   * Trigger follow-up content for high-performing posts
   */
  private async triggerFollowUpContent(contentPiece: any, performance: any): Promise<void> {
    console.log(`🔥 Triggering follow-up content for viral ${contentPiece.platform} post`);

    const followUpWindows = this.strategy.contentLifecycle.followUpWindows;
    const applicableWindows = followUpWindows.filter(
      fw => fw.trigger === 'viral_threshold' && fw.platforms.includes(contentPiece.platform)
    );

    for (const window of applicableWindows) {
      setTimeout(
        () => {
          this.executeFollowUpAction(window, contentPiece, performance);
        },
        window.delay * 60 * 1000
      );
    }
  }

  /**
   * Execute follow-up action
   */
  private async executeFollowUpAction(
    window: any,
    originalContent: any,
    performance: any
  ): Promise<void> {
    switch (window.action) {
      case 'double_down':
        console.log(
          `📈 Doubling down on ${originalContent.platform} success with expanded content`
        );
        break;
      case 'cross_promote':
        console.log(
          `🔄 Cross-promoting viral ${originalContent.platform} content to other platforms`
        );
        break;
      case 'engage_comments':
        console.log(`💬 Actively engaging with comments on viral ${originalContent.platform} post`);
        break;
    }
  }

  /**
   * Setup plan monitoring
   */
  private setupPlanMonitoring(plan: TimingPlan): void {
    // Monitor at checkpoints
    plan.monitoring.checkpoints.forEach(checkpoint => {
      setTimeout(() => {
        this.performMonitoringCheck(plan.id, checkpoint);
      }, checkpoint.getTime() - Date.now());
    });

    // Overall plan completion check
    const lastContentTime = Math.max(...plan.contentPieces.map(cp => cp.scheduledTime.getTime()));
    setTimeout(
      () => {
        this.completePlanExecution(plan.id);
      },
      lastContentTime - Date.now() + 60 * 60 * 1000
    ); // 1 hour after last content
  }

  /**
   * Create monitoring plan with checkpoints
   */
  private createMonitoringPlan(contentPieces: Array<any>, responseWindow: number): any {
    const checkpoints = [];
    const now = new Date();

    // 15-minute checkpoint for immediate response validation
    checkpoints.push(addMinutes(now, 15));

    // 1-hour checkpoint for early performance
    checkpoints.push(addMinutes(now, 60));

    // Response window checkpoint
    checkpoints.push(addMinutes(now, responseWindow));

    // 24-hour checkpoint for full cycle
    checkpoints.push(addMinutes(now, 24 * 60));

    return {
      checkpoints,
      successMetrics: ['engagement_rate', 'reach', 'virality', 'audio_intel_mentions'],
      escalationTriggers: ['low_performance', 'competitor_response', 'viral_opportunity'],
    };
  }

  /**
   * Utility methods
   */
  private determinePriority(
    content: FusedContent,
    alertLevel: string
  ): 'immediate' | 'high' | 'medium' | 'low' {
    if (alertLevel === 'critical' && content.platform === 'twitter') return 'immediate';
    if (alertLevel === 'high' && content.estimatedPerformance.virality > 0.7) return 'immediate';
    if (content.metadata.competitiveAdvantage) return 'high';
    if (content.estimatedPerformance.authority > 0.8) return 'high';
    return 'medium';
  }

  private requiresApproval(content: FusedContent, priority: string): boolean {
    // Require approval for Audio Intel mentions above certain threshold
    if (content.audioIntelIntegration && content.metadata.expertiseDepth > 0.8) return true;

    // Require approval for critical/immediate content
    if (priority === 'immediate' || priority === 'high') return false; // Auto-approve for speed

    return false;
  }

  private checkCompetitorActivity(newsItem: NewsItem): boolean {
    // Mock competitor monitoring - in real implementation, check social media APIs
    return Math.random() > 0.7; // 30% chance competitors are active
  }

  private recordExecution(
    planId: string,
    contentPiece: any,
    success: boolean,
    error?: string
  ): void {
    let result = this.executionHistory.get(planId);
    if (!result) {
      result = { success: true, planId, executed: [], pending: [], failed: [] };
      this.executionHistory.set(planId, result);
    }

    if (success) {
      result.executed.push({
        contentId: contentPiece.content.id,
        platform: contentPiece.platform,
        actualPostTime: new Date(),
        scheduledTime: contentPiece.scheduledTime,
      });
    } else {
      result.failed.push({
        contentId: contentPiece.content.id,
        platform: contentPiece.platform,
        error: error || 'Unknown error',
      });
      result.success = false;
    }
  }

  private async performMonitoringCheck(planId: string, checkpoint: Date): Promise<void> {
    console.log(`🔍 Performing monitoring check for plan ${planId} at ${checkpoint}`);

    const result = this.executionHistory.get(planId);
    if (!result) return;

    // Check performance metrics
    const executedCount = result.executed.length;
    const failedCount = result.failed.length;
    const successRate = executedCount / (executedCount + failedCount);

    console.log(
      `📊 Plan ${planId} status: ${executedCount} executed, ${failedCount} failed (${(
        successRate * 100
      ).toFixed(1)}% success rate)`
    );

    // Trigger escalations if needed
    if (successRate < 0.8) {
      console.log(`⚠️ Plan ${planId} underperforming - triggering escalation`);
    }
  }

  private async completePlanExecution(planId: string): Promise<void> {
    console.log(`✅ Completing execution of plan ${planId}`);

    const plan = this.activePlans.get(planId);
    const result = this.executionHistory.get(planId);

    if (plan && result) {
      console.log(`📊 Final results for plan ${planId}:`, {
        totalContent: plan.contentPieces.length,
        executed: result.executed.length,
        failed: result.failed.length,
        successRate: ((result.executed.length / plan.contentPieces.length) * 100).toFixed(1) + '%',
      });
    }

    // Clean up
    this.activePlans.delete(planId);
  }

  private initializeTimingOptimizer(): void {
    console.log('⏰ Timing Optimizer initialized');

    // Start competitive monitoring if enabled
    if (this.strategy.competitiveMonitoring.enabled) {
      this.startCompetitiveMonitoring();
    }
  }

  private startCompetitiveMonitoring(): void {
    console.log('👀 Starting competitive monitoring');

    // Monitor competitor activity every 10 minutes
    cron.schedule('*/10 * * * *', () => {
      this.checkCompetitorUpdates();
    });
  }

  private async checkCompetitorUpdates(): Promise<void> {
    // Mock competitor monitoring
    const competitorHandles = this.strategy.competitiveMonitoring.competitorHandles;

    for (const handle of competitorHandles) {
      const lastUpdate = Math.random() > 0.9; // 10% chance of update
      if (lastUpdate) {
        console.log(`🚨 Competitor ${handle} posted new content - adjusting timing strategy`);
        this.competitorLastSeen.set(handle, new Date());
      }
    }
  }

  private getDefaultStrategy(): TimingStrategy {
    return {
      rapidResponse: {
        detectionWindow: 15,
        contentGenerationWindow: 30,
        publicationDelay: 5,
        qualityThreshold: 0.7,
        platforms: {
          immediate: ['twitter'],
          delayed: ['linkedin', 'instagram'],
          review: ['newsletter', 'email'],
        },
        escalationRules: [
          {
            condition: 'viral_opportunity',
            action: 'auto_publish',
            threshold: 0.8,
            timeLimit: 30,
          },
          {
            condition: 'competitor_response',
            action: 'emergency_post',
            threshold: 0.6,
            timeLimit: 15,
          },
        ],
      },
      optimalPosting: {
        ukBusinessHours: {
          start: 9,
          end: 18,
          peakTimes: [9, 13, 17],
        },
        musicIndustryTimes: {
          professionalHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
          avoidTimes: [6, 7, 8, 19, 20, 21, 22, 23],
          weekendMultiplier: 0.6,
        },
        platformOptimization: {
          twitter: {
            optimalHours: [9, 13, 17],
            minimumGap: 30,
            dailyLimit: 8,
          },
          linkedin: {
            optimalHours: [8, 12, 16],
            minimumGap: 60,
            dailyLimit: 3,
          },
          instagram: {
            optimalHours: [11, 15, 19],
            minimumGap: 45,
            dailyLimit: 2,
          },
        },
        audienceTimezones: ['Europe/London', 'America/New_York', 'America/Los_Angeles'],
        seasonalAdjustments: true,
      },
      contentLifecycle: {
        phases: [
          {
            name: 'immediate_response',
            platforms: ['twitter'],
            delay: 15,
            conditions: ['trending', 'competitive'],
            contentTypes: ['thread', 'quick_take'],
          },
          {
            name: 'authority_building',
            platforms: ['linkedin'],
            delay: 120,
            conditions: ['high_relevance'],
            contentTypes: ['article', 'analysis'],
          },
          {
            name: 'visual_engagement',
            platforms: ['instagram'],
            delay: 480,
            conditions: ['visual_opportunity'],
            contentTypes: ['carousel', 'story'],
          },
          {
            name: 'detailed_analysis',
            platforms: ['newsletter'],
            delay: 1440,
            conditions: ['comprehensive_coverage'],
            contentTypes: ['newsletter_section', 'email_update'],
          },
        ],
        crossPlatformSpacing: 30,
        followUpWindows: [
          {
            trigger: 'viral_threshold',
            delay: 60,
            action: 'double_down',
            platforms: ['twitter', 'linkedin'],
          },
          {
            trigger: 'high_engagement',
            delay: 120,
            action: 'cross_promote',
            platforms: ['instagram'],
          },
        ],
        performanceMonitoring: {
          checkpoints: [15, 60, 240, 1440], // minutes
          metrics: ['engagement', 'reach', 'virality'],
          thresholds: {
            viral: 0.8,
            high_engagement: 0.6,
            low_performance: 0.3,
          },
        },
      },
      competitiveMonitoring: {
        enabled: true,
        competitorHandles: ['@musicmarketing', '@industryinsider', '@musictech'],
        responseDelay: 60,
        differentiationStrategy: 'automation_focus',
      },
      platformTiming: {
        twitter: {
          optimalTimes: [
            {
              hour: 9,
              confidence: 0.9,
              audienceSize: 5000,
              engagementRate: 4.2,
              competitionLevel: 'medium',
            },
            {
              hour: 13,
              confidence: 0.8,
              audienceSize: 6000,
              engagementRate: 3.8,
              competitionLevel: 'high',
            },
            {
              hour: 17,
              confidence: 0.85,
              audienceSize: 5500,
              engagementRate: 4.0,
              competitionLevel: 'medium',
            },
          ],
          rateLimits: {
            postsPerHour: 2,
            postsPerDay: 8,
            minimumGapMinutes: 30,
            burstAllowance: 3,
          },
          engagementWindows: [
            { start: 9, end: 11, multiplier: 1.2, audienceType: 'professionals' },
            { start: 13, end: 14, multiplier: 1.1, audienceType: 'lunch_break' },
            { start: 17, end: 19, multiplier: 1.3, audienceType: 'evening_commute' },
          ],
          audienceActivity: {
            peakHours: [9, 13, 17],
            timezone: 'Europe/London',
            weekdayPattern: [0.4, 1.0, 1.0, 1.0, 1.0, 0.8, 0.5],
            holidayAdjustments: true,
          },
        },
        linkedin: {
          optimalTimes: [
            {
              hour: 8,
              confidence: 0.85,
              audienceSize: 3000,
              engagementRate: 3.5,
              competitionLevel: 'low',
            },
            {
              hour: 12,
              confidence: 0.9,
              audienceSize: 4000,
              engagementRate: 4.0,
              competitionLevel: 'medium',
            },
            {
              hour: 16,
              confidence: 0.8,
              audienceSize: 3500,
              engagementRate: 3.8,
              competitionLevel: 'medium',
            },
          ],
          rateLimits: {
            postsPerHour: 1,
            postsPerDay: 3,
            minimumGapMinutes: 60,
            burstAllowance: 1,
          },
          engagementWindows: [
            { start: 8, end: 10, multiplier: 1.3, audienceType: 'morning_professionals' },
            { start: 12, end: 13, multiplier: 1.2, audienceType: 'lunch_networking' },
            { start: 16, end: 17, multiplier: 1.1, audienceType: 'afternoon_professionals' },
          ],
          audienceActivity: {
            peakHours: [8, 12, 16],
            timezone: 'Europe/London',
            weekdayPattern: [0.2, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
            holidayAdjustments: true,
          },
        },
      },
    };
  }

  /**
   * Public API methods
   */
  public async getActivePlans(): Promise<TimingPlan[]> {
    return Array.from(this.activePlans.values());
  }

  public async getPlanResults(planId: string): Promise<TimingExecutionResult | null> {
    return this.executionHistory.get(planId) || null;
  }

  public async cancelPlan(planId: string): Promise<boolean> {
    const plan = this.activePlans.get(planId);
    if (plan) {
      this.activePlans.delete(planId);
      console.log(`❌ Cancelled timing plan ${planId}`);
      return true;
    }
    return false;
  }

  public updateStrategy(newStrategy: Partial<TimingStrategy>): void {
    this.strategy = {
      ...this.strategy,
      ...newStrategy,
    };
    console.log('⚙️ Timing strategy updated');
  }

  public getStrategy(): TimingStrategy {
    return { ...this.strategy };
  }
}

export default TimingOptimizer;
export type {
  TimingStrategy,
  RapidResponseConfig,
  OptimalPostingConfig,
  ContentLifecycleConfig,
  TimingPlan,
  TimingExecutionResult,
};
