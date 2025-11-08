/**
 * Newsjacker Engine - Complete Music Industry Newsjacking System
 * Integrates trend detection, content fusion, and timing optimization
 * for rapid response to industry news and opportunities
 */

import TrendDetectionEngine, {
  NewsItem,
  TrendAlert,
  NewsSource,
  AutomationOpportunity,
} from './trend-detection';
import RelevanceScoringEngine, { ScoringResult, ScoringCriteria } from './relevance-scoring';
import ContentFusionEngine, { FusedContent, ContentFusionConfig } from './content-fusion';
import TimingOptimizer, { TimingPlan, TimingStrategy } from './timing-optimizer';

export interface NewsjackerConfig {
  trendDetection: {
    customSources?: NewsSource[];
    monitoringEnabled?: boolean;
    updateFrequency?: number;
  };
  relevanceScoring: {
    customCriteria?: Partial<ScoringCriteria>;
    minimumScore?: number;
  };
  contentFusion: {
    voiceProfile?: Partial<ContentFusionConfig>;
    platforms?: string[];
  };
  timingOptimization: {
    rapidResponse?: boolean;
    strategy?: Partial<TimingStrategy>;
  };
  integration: {
    webhookUrl?: string;
    notificationChannels?: string[];
    autoPublish?: boolean;
    requireApproval?: boolean;
  };
}

export interface NewsjackingOpportunity {
  id: string;
  newsItem: NewsItem;
  scoringResult: ScoringResult;
  fusedContent: FusedContent[];
  timingPlan: TimingPlan;
  status: 'detected' | 'processing' | 'ready' | 'executing' | 'completed' | 'expired';
  competitiveContext: {
    firstMover: boolean;
    competitorActivity: string[];
    responseWindow: number;
  };
  performance: {
    estimated: {
      reach: number;
      engagement: number;
      virality: number;
    };
    actual?: {
      reach: number;
      engagement: number;
      conversions: number;
      roi: number;
    };
  };
  created: Date;
  expires: Date;
}

export interface NewsjackingPipeline {
  opportunities: Map<string, NewsjackingOpportunity>;
  processing: Set<string>;
  executed: Set<string>;
  performance: {
    totalOpportunities: number;
    successfulExecutions: number;
    averageResponseTime: number;
    totalReach: number;
    totalEngagement: number;
  };
}

export interface NewsjackingAlert {
  id: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  opportunity: NewsjackingOpportunity;
  message: string;
  actionRequired: boolean;
  responseDeadline: Date;
  suggestedActions: string[];
}

class NewsjackerEngine {
  private trendDetection: TrendDetectionEngine;
  private relevanceScoring: RelevanceScoringEngine;
  private contentFusion: ContentFusionEngine;
  private timingOptimizer: TimingOptimizer;

  private config: NewsjackerConfig;
  private pipeline: NewsjackingPipeline;
  private activeAlerts: Map<string, NewsjackingAlert> = new Map();
  private isRunning: boolean = false;

  constructor(config: NewsjackerConfig = {}) {
    this.config = {
      trendDetection: {
        monitoringEnabled: true,
        updateFrequency: 15,
        ...config.trendDetection,
      },
      relevanceScoring: {
        minimumScore: 0.4,
        ...config.relevanceScoring,
      },
      contentFusion: {
        platforms: ['twitter', 'linkedin', 'instagram', 'newsletter'],
        ...config.contentFusion,
      },
      timingOptimization: {
        rapidResponse: true,
        ...config.timingOptimization,
      },
      integration: {
        autoPublish: false,
        requireApproval: true,
        ...config.integration,
      },
    };

    this.initializeEngines();
    this.initializePipeline();
  }

  /**
   * Initialize all component engines
   */
  private initializeEngines(): void {
    // Initialize trend detection
    this.trendDetection = new TrendDetectionEngine();

    // Initialize relevance scoring with custom criteria if provided
    this.relevanceScoring = new RelevanceScoringEngine();
    if (this.config.relevanceScoring.customCriteria) {
      this.relevanceScoring.updateScoringCriteria(this.config.relevanceScoring.customCriteria);
    }

    // Initialize content fusion with voice profile
    this.contentFusion = new ContentFusionEngine(this.config.contentFusion.voiceProfile);

    // Initialize timing optimizer
    this.timingOptimizer = new TimingOptimizer(this.config.timingOptimization.strategy);
  }

  /**
   * Initialize newsjacking pipeline
   */
  private initializePipeline(): void {
    this.pipeline = {
      opportunities: new Map(),
      processing: new Set(),
      executed: new Set(),
      performance: {
        totalOpportunities: 0,
        successfulExecutions: 0,
        averageResponseTime: 0,
        totalReach: 0,
        totalEngagement: 0,
      },
    };
  }

  /**
   * Start the complete newsjacking engine
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Newsjacker Engine already running');
      return;
    }

    console.log('🚀 Starting Newsjacker Engine - Music Industry Trend Detection & Response System');

    this.isRunning = true;

    // Start trend monitoring
    if (this.config.trendDetection.monitoringEnabled) {
      await this.trendDetection.startMonitoring();
    }

    // Set up pipeline processing
    this.startPipelineProcessing();

    // Set up alert monitoring
    this.startAlertMonitoring();

    console.log('✅ Newsjacker Engine started successfully');
    console.log(`📡 Monitoring enabled: ${this.config.trendDetection.monitoringEnabled}`);
    console.log(`⚡ Rapid response: ${this.config.timingOptimization.rapidResponse}`);
    console.log(`🎯 Platforms: ${this.config.contentFusion.platforms.join(', ')}`);
  }

  /**
   * Stop the newsjacking engine
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Newsjacker Engine not running');
      return;
    }

    console.log('⏹️ Stopping Newsjacker Engine...');

    this.isRunning = false;
    this.trendDetection.stopMonitoring();

    console.log('✅ Newsjacker Engine stopped');
  }

  /**
   * Process complete newsjacking pipeline for a news item
   */
  async processNewsOpportunity(newsItem: NewsItem): Promise<NewsjackingOpportunity> {
    console.log(`🔍 Processing newsjacking opportunity: ${newsItem.title}`);

    const startTime = Date.now();

    try {
      // Step 1: Score relevance and automation opportunity
      const scoringResult = await this.relevanceScoring.scoreNewsItem(newsItem);

      if (scoringResult.totalScore < this.config.relevanceScoring.minimumScore) {
        console.log(
          `⏭️ Skipping low-relevance news (score: ${scoringResult.totalScore.toFixed(2)})`
        );
        return null;
      }

      // Step 2: Generate fused content for all platforms
      const fusedContent = await this.contentFusion.generateMultiPlatformContent(
        newsItem,
        scoringResult,
        this.config.contentFusion.platforms
      );

      // Step 3: Create optimal timing plan
      const alertLevel = this.determineAlertLevel(scoringResult);
      const timingPlan = await this.timingOptimizer.createRapidResponsePlan(
        newsItem,
        scoringResult,
        fusedContent,
        alertLevel
      );

      // Step 4: Create newsjacking opportunity
      const opportunity: NewsjackingOpportunity = {
        id: `newsjack_${newsItem.id}_${Date.now()}`,
        newsItem,
        scoringResult,
        fusedContent,
        timingPlan,
        status: 'ready',
        competitiveContext: {
          firstMover: this.checkFirstMoverAdvantage(newsItem),
          competitorActivity: this.getCompetitorActivity(newsItem),
          responseWindow: this.calculateResponseWindow(scoringResult, alertLevel),
        },
        performance: {
          estimated: this.calculateEstimatedPerformance(fusedContent),
          actual: undefined,
        },
        created: new Date(),
        expires: this.calculateExpiryTime(newsItem, alertLevel),
      };

      // Step 5: Store and process
      this.pipeline.opportunities.set(opportunity.id, opportunity);
      this.pipeline.performance.totalOpportunities++;

      // Step 6: Create alert if needed
      if (alertLevel === 'critical' || alertLevel === 'high') {
        await this.createNewsjackingAlert(opportunity, alertLevel);
      }

      const processingTime = Date.now() - startTime;
      console.log(`✅ Newsjacking opportunity processed in ${processingTime}ms: ${opportunity.id}`);
      console.log(
        `🎯 Score: ${scoringResult.totalScore.toFixed(2)}, Content pieces: ${
          fusedContent.length
        }, Alert: ${alertLevel}`
      );

      // Auto-execute if configured
      if (this.config.integration.autoPublish && !this.config.integration.requireApproval) {
        await this.executeOpportunity(opportunity.id);
      }

      return opportunity;
    } catch (error) {
      console.error('❌ Failed to process newsjacking opportunity:', error);
      throw error;
    }
  }

  /**
   * Execute a newsjacking opportunity
   */
  async executeOpportunity(opportunityId: string): Promise<boolean> {
    const opportunity = this.pipeline.opportunities.get(opportunityId);
    if (!opportunity) {
      console.error(`❌ Opportunity not found: ${opportunityId}`);
      return false;
    }

    if (opportunity.status !== 'ready') {
      console.log(
        `⚠️ Opportunity ${opportunityId} not ready for execution (status: ${opportunity.status})`
      );
      return false;
    }

    try {
      console.log(`🚀 Executing newsjacking opportunity: ${opportunityId}`);

      opportunity.status = 'executing';
      this.pipeline.processing.add(opportunityId);

      // Execute timing plan
      const executionResult = await this.timingOptimizer.getPlanResults(opportunity.timingPlan.id);

      if (executionResult && executionResult.success) {
        opportunity.status = 'completed';
        this.pipeline.executed.add(opportunityId);
        this.pipeline.performance.successfulExecutions++;

        // Start performance tracking
        setTimeout(() => {
          this.trackOpportunityPerformance(opportunityId);
        }, 60 * 60 * 1000); // 1 hour delay for initial metrics

        console.log(`✅ Successfully executed opportunity: ${opportunityId}`);
        return true;
      } else {
        opportunity.status = 'ready'; // Reset for retry
        console.log(`❌ Failed to execute opportunity: ${opportunityId}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error executing opportunity ${opportunityId}:`, error);
      opportunity.status = 'ready'; // Reset for retry
      return false;
    } finally {
      this.pipeline.processing.delete(opportunityId);
    }
  }

  /**
   * Start processing pipeline for detected trends
   */
  private startPipelineProcessing(): void {
    // Check for new trends every 5 minutes
    setInterval(async () => {
      if (!this.isRunning) return;

      try {
        const activeTrends = await this.trendDetection.getActiveTrends();
        const newTrends = activeTrends.filter(
          trend => !this.pipeline.opportunities.has(`newsjack_${trend.id}_*`)
        );

        if (newTrends.length > 0) {
          console.log(`🔥 Found ${newTrends.length} new trends to process`);

          for (const trend of newTrends) {
            await this.processNewsOpportunity(trend);
          }
        }
      } catch (error) {
        console.error('Pipeline processing error:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup expired opportunities every hour
    setInterval(() => {
      this.cleanupExpiredOpportunities();
    }, 60 * 60 * 1000); // 1 hour
  }

  /**
   * Start alert monitoring and notifications
   */
  private startAlertMonitoring(): void {
    // Check alert deadlines every minute
    setInterval(() => {
      this.checkAlertDeadlines();
    }, 60 * 1000); // 1 minute
  }

  /**
   * Create newsjacking alert for high-priority opportunities
   */
  private async createNewsjackingAlert(
    opportunity: NewsjackingOpportunity,
    level: 'critical' | 'high' | 'medium' | 'low'
  ): Promise<void> {
    const alert: NewsjackingAlert = {
      id: `alert_${opportunity.id}`,
      level,
      opportunity,
      message: this.generateAlertMessage(opportunity, level),
      actionRequired: level === 'critical' || level === 'high',
      responseDeadline: new Date(
        Date.now() + opportunity.competitiveContext.responseWindow * 60 * 1000
      ),
      suggestedActions: this.generateSuggestedActions(opportunity, level),
    };

    this.activeAlerts.set(alert.id, alert);

    console.log(`🚨 ${level.toUpperCase()} ALERT: ${alert.message}`);
    console.log(`⏰ Response deadline: ${alert.responseDeadline.toLocaleString()}`);
    console.log(`🎯 Suggested actions: ${alert.suggestedActions.join(', ')}`);

    // Send notification if webhook configured
    if (this.config.integration.webhookUrl) {
      await this.sendWebhookNotification(alert);
    }
  }

  /**
   * Generate alert message
   */
  private generateAlertMessage(opportunity: NewsjackingOpportunity, level: string): string {
    const news = opportunity.newsItem.title;
    const score = opportunity.scoringResult.totalScore.toFixed(2);

    if (level === 'critical') {
      return `CRITICAL: Viral newsjacking opportunity detected - "${news}" (Score: ${score})`;
    }

    if (level === 'high') {
      return `HIGH: Strong automation angle detected - "${news}" (Score: ${score})`;
    }

    return `${level.toUpperCase()}: Newsjacking opportunity - "${news}" (Score: ${score})`;
  }

  /**
   * Generate suggested actions
   */
  private generateSuggestedActions(opportunity: NewsjackingOpportunity, level: string): string[] {
    const actions = [];

    if (level === 'critical') {
      actions.push('Execute immediately for first-mover advantage');
      actions.push('Monitor competitor responses');
    }

    if (opportunity.scoringResult.audioIntelAngle) {
      actions.push('Include Audio Intel positioning');
    }

    if (opportunity.competitiveContext.firstMover) {
      actions.push('Capitalize on first-mover advantage');
    }

    actions.push('Review generated content for voice consistency');
    actions.push('Execute timing plan for optimal reach');

    return actions;
  }

  /**
   * Utility methods
   */
  private determineAlertLevel(
    scoringResult: ScoringResult
  ): 'critical' | 'high' | 'medium' | 'low' {
    if (scoringResult.totalScore > 0.8 && scoringResult.breakdown.urgencyBoost > 0.7)
      return 'critical';
    if (scoringResult.totalScore > 0.7 && scoringResult.breakdown.competitiveAdvantage > 0.6)
      return 'high';
    if (scoringResult.totalScore > 0.6) return 'medium';
    return 'low';
  }

  private checkFirstMoverAdvantage(newsItem: NewsItem): boolean {
    const timeSincePublication = Date.now() - newsItem.publishedAt.getTime();
    return timeSincePublication < 2 * 60 * 60 * 1000; // Within 2 hours
  }

  private getCompetitorActivity(newsItem: NewsItem): string[] {
    // Mock competitor monitoring - in real implementation, check social media APIs
    return Math.random() > 0.7 ? ['@musicmarketing', '@industryinsider'] : [];
  }

  private calculateResponseWindow(scoringResult: ScoringResult, alertLevel: string): number {
    const baseWindows = {
      critical: 60, // 1 hour
      high: 120, // 2 hours
      medium: 240, // 4 hours
      low: 480, // 8 hours
    };

    let window = baseWindows[alertLevel];

    if (scoringResult.breakdown.competitiveAdvantage > 0.7) {
      window *= 0.5; // Faster for competitive opportunities
    }

    return window;
  }

  private calculateEstimatedPerformance(fusedContent: FusedContent[]): any {
    return fusedContent.reduce(
      (total, content) => ({
        reach: total.reach + content.estimatedPerformance.reach,
        engagement: total.engagement + content.estimatedPerformance.engagement,
        virality: Math.max(total.virality, content.estimatedPerformance.virality),
      }),
      { reach: 0, engagement: 0, virality: 0 }
    );
  }

  private calculateExpiryTime(newsItem: NewsItem, alertLevel: string): Date {
    const hoursToExpiry = {
      critical: 4,
      high: 8,
      medium: 24,
      low: 48,
    };

    return new Date(Date.now() + hoursToExpiry[alertLevel] * 60 * 60 * 1000);
  }

  private async trackOpportunityPerformance(opportunityId: string): Promise<void> {
    // Mock performance tracking - in real implementation, fetch from platform APIs
    const opportunity = this.pipeline.opportunities.get(opportunityId);
    if (!opportunity) return;

    const actualPerformance = {
      reach: opportunity.performance.estimated.reach * (0.8 + Math.random() * 0.4), // 80-120% of estimated
      engagement: opportunity.performance.estimated.engagement * (0.7 + Math.random() * 0.6), // 70-130% of estimated
      conversions: Math.floor(Math.random() * 10),
      roi: 250 + Math.random() * 500, // 250-750% ROI
    };

    opportunity.performance.actual = actualPerformance;

    this.pipeline.performance.totalReach += actualPerformance.reach;
    this.pipeline.performance.totalEngagement += actualPerformance.engagement;

    console.log(`📊 Performance tracked for ${opportunityId}:`, actualPerformance);
  }

  private cleanupExpiredOpportunities(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [id, opportunity] of this.pipeline.opportunities) {
      if (opportunity.expires < now && opportunity.status !== 'executing') {
        this.pipeline.opportunities.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired opportunities`);
    }
  }

  private checkAlertDeadlines(): void {
    const now = new Date();

    for (const [id, alert] of this.activeAlerts) {
      if (alert.responseDeadline < now && alert.actionRequired) {
        console.log(`⚠️ Alert deadline passed: ${alert.message}`);

        // Auto-execute critical opportunities if configured
        if (alert.level === 'critical' && this.config.integration.autoPublish) {
          this.executeOpportunity(alert.opportunity.id);
        }

        this.activeAlerts.delete(id);
      }
    }
  }

  private async sendWebhookNotification(alert: NewsjackingAlert): Promise<void> {
    // Mock webhook notification - in real implementation, send HTTP request
    console.log(`🔔 Webhook notification sent for alert: ${alert.id}`);
  }

  /**
   * Public API methods
   */
  public async getActiveOpportunities(): Promise<NewsjackingOpportunity[]> {
    return Array.from(this.pipeline.opportunities.values())
      .filter(opp => opp.status !== 'expired')
      .sort((a, b) => b.scoringResult.totalScore - a.scoringResult.totalScore);
  }

  public async getActiveAlerts(): Promise<NewsjackingAlert[]> {
    return Array.from(this.activeAlerts.values()).sort((a, b) => {
      const levelOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return levelOrder[b.level] - levelOrder[a.level];
    });
  }

  public async getPipelineStatus(): Promise<NewsjackingPipeline> {
    return { ...this.pipeline };
  }

  public async approveOpportunity(opportunityId: string): Promise<boolean> {
    const opportunity = this.pipeline.opportunities.get(opportunityId);
    if (opportunity && opportunity.status === 'ready') {
      return await this.executeOpportunity(opportunityId);
    }
    return false;
  }

  public async rejectOpportunity(opportunityId: string): Promise<boolean> {
    const opportunity = this.pipeline.opportunities.get(opportunityId);
    if (opportunity) {
      opportunity.status = 'expired';
      this.pipeline.opportunities.delete(opportunityId);
      return true;
    }
    return false;
  }

  public updateConfig(newConfig: Partial<NewsjackerConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    console.log('⚙️ Newsjacker configuration updated');
  }

  public getConfig(): NewsjackerConfig {
    return { ...this.config };
  }
}

// Export main class and types
export default NewsjackerEngine;
export { TrendDetectionEngine, RelevanceScoringEngine, ContentFusionEngine, TimingOptimizer };

export type {
  NewsjackerConfig,
  NewsjackingOpportunity,
  NewsjackingPipeline,
  NewsjackingAlert,
  NewsItem,
  TrendAlert,
  ScoringResult,
  FusedContent,
  TimingPlan,
};
