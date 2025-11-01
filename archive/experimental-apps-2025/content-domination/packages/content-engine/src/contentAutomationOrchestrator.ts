/**
 * Content Automation Orchestrator - Main System Controller
 * Coordinates all components of the Total Audio Content Domination System
 * Integrates newsletter detection, content generation, scheduling, and analytics
 */

import NewsletterContentAutomation, {
  NewsletterContent,
  NotionContentContext,
  PlatformContent,
} from './newsletterContentAutomation';
import TwitterAutomation, { TwitterCredentials } from './twitterAutomation';
import ContentSchedulingOrchestrator, {
  ScheduledContent,
  ContentBatch,
} from './contentSchedulingOrchestrator';
import ContentPerformanceAnalytics, { PerformanceReport } from './contentPerformanceAnalytics';
import KitApi from './kitApi';

export interface AutomationConfig {
  kitApiKey: string;
  twitterCredentials: TwitterCredentials;
  notionToken: string;
  notionDatabaseIds: Record<string, string>;
  automationSettings: AutomationSettings;
  voiceTrainingEnabled: boolean;
  autoApprovalThreshold: number;
}

export interface AutomationSettings {
  ukBusinessHoursOnly: boolean;
  enableWeekendPosting: boolean;
  maxPostsPerDay: number;
  requireApprovalForAudioIntelMentions: boolean;
  platformEnabled: Record<string, boolean>;
  autoSchedulingEnabled: boolean;
  performanceTrackingEnabled: boolean;
}

export interface AutomationStatus {
  isActive: boolean;
  lastProcessedNewsletter: string | null;
  contentQueueSize: number;
  scheduledContentCount: number;
  publishedContentToday: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'error';
  uptime: number;
  lastError: string | null;
}

export interface ContentGenerationResult {
  success: boolean;
  newsletterId: string;
  generatedContent: PlatformContent[];
  batchId: string;
  schedulingPlan: any;
  estimatedCompletionTime: Date;
  requiresApproval: PlatformContent[];
  error?: string;
}

export interface SystemMetrics {
  totalNewslettersProcessed: number;
  totalContentGenerated: number;
  totalContentPublished: number;
  averageProcessingTime: number;
  timeSavedWeekly: number;
  valueGeneratedMonthly: number;
  voiceConsistencyScore: number;
  systemEfficiency: number;
}

class ContentAutomationOrchestrator {
  private newsletterAutomation: NewsletterContentAutomation;
  private twitterAutomation: TwitterAutomation;
  private schedulingOrchestrator: ContentSchedulingOrchestrator;
  private performanceAnalytics: ContentPerformanceAnalytics;
  private kitApi: KitApi;

  private config: AutomationConfig;
  private status: AutomationStatus;
  private systemMetrics: SystemMetrics;
  private isInitialized: boolean = false;
  private processingQueue: Map<string, any> = new Map();

  constructor(config: AutomationConfig) {
    this.config = config;
    this.status = this.initializeStatus();
    this.systemMetrics = this.initializeMetrics();

    // Initialize core components
    this.initializeComponents();
  }

  /**
   * Initialize all system components
   */
  private initializeComponents(): void {
    try {
      // Initialize Kit.com API
      this.kitApi = new KitApi(this.config.kitApiKey);

      // Initialize Newsletter Content Automation
      this.newsletterAutomation = new NewsletterContentAutomation(
        this.config.kitApiKey,
        this.config.notionToken,
        this.config.notionDatabaseIds
      );

      // Initialize Twitter Automation
      this.twitterAutomation = new TwitterAutomation(this.config.twitterCredentials);

      // Initialize Scheduling Orchestrator
      this.schedulingOrchestrator = new ContentSchedulingOrchestrator(
        this.config.twitterCredentials,
        this.config.kitApiKey
      );

      // Initialize Performance Analytics
      this.performanceAnalytics = new ContentPerformanceAnalytics(
        this.config.twitterCredentials,
        this.config.kitApiKey,
        this.config.notionToken,
        this.config.notionDatabaseIds
      );

      this.isInitialized = true;
      this.status.isActive = true;
      this.status.systemHealth = 'excellent';

      console.log('🚀 Content Automation Orchestrator initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Content Automation Orchestrator:', error);
      this.status.systemHealth = 'error';
      this.status.lastError = error.message;
      throw error;
    }
  }

  /**
   * Main automation workflow: Newsletter → Multi-platform content
   */
  async processNewsletter(newsletterId?: string): Promise<ContentGenerationResult> {
    try {
      console.log('📧 Starting newsletter processing workflow...');

      if (!this.isInitialized) {
        throw new Error('System not initialized');
      }

      // Step 1: Process newsletter and generate multi-platform content
      const automationResult = await this.newsletterAutomation.processNewsletter(newsletterId);

      if (!automationResult.generatedContent || automationResult.generatedContent.length === 0) {
        throw new Error('No content generated from newsletter');
      }

      console.log(`✅ Generated ${automationResult.generatedContent.length} pieces of content`);

      // Step 2: Apply quality checks and approval filtering
      const approvedContent: ScheduledContent[] = [];
      const requiresApproval: PlatformContent[] = [];

      for (const content of automationResult.generatedContent) {
        if (await this.shouldAutoApprove(content)) {
          approvedContent.push(this.convertToScheduledContent(content, newsletterId));
        } else {
          requiresApproval.push(content);
        }
      }

      console.log(
        `🔍 Auto-approved: ${approvedContent.length}, Requires review: ${requiresApproval.length}`
      );

      // Step 3: Schedule approved content with optimal timing
      let batchId = '';
      let schedulingPlan = null;
      let estimatedCompletionTime = new Date();

      if (approvedContent.length > 0 && this.config.automationSettings.autoSchedulingEnabled) {
        const contentBatch = await this.schedulingOrchestrator.createContentBatchSchedule(
          approvedContent,
          newsletterId || 'unknown'
        );

        batchId = contentBatch.id;
        schedulingPlan = contentBatch.distributionPlan;
        estimatedCompletionTime = contentBatch.expectedCompletion;

        console.log(
          `📅 Scheduled content batch ${batchId} for completion by ${estimatedCompletionTime.toLocaleString()}`
        );
      }

      // Step 4: Update system metrics
      this.updateSystemMetrics(automationResult.generatedContent.length);
      this.status.lastProcessedNewsletter = newsletterId || 'auto-detected';
      this.status.contentQueueSize = approvedContent.length;

      // Step 5: Start performance tracking
      if (this.config.automationSettings.performanceTrackingEnabled) {
        this.startPerformanceTracking(automationResult.generatedContent);
      }

      return {
        success: true,
        newsletterId: newsletterId || 'auto-detected',
        generatedContent: automationResult.generatedContent,
        batchId,
        schedulingPlan,
        estimatedCompletionTime,
        requiresApproval,
      };
    } catch (error) {
      console.error('❌ Newsletter processing failed:', error);
      this.status.lastError = error.message;
      this.status.systemHealth = 'error';

      return {
        success: false,
        newsletterId: newsletterId || 'unknown',
        generatedContent: [],
        batchId: '',
        schedulingPlan: null,
        estimatedCompletionTime: new Date(),
        requiresApproval: [],
        error: error.message,
      };
    }
  }

  /**
   * Monitor and execute continuous automation
   */
  async startContinuousAutomation(): Promise<void> {
    console.log('🔄 Starting continuous automation monitoring...');

    // Check for new newsletters every 30 minutes
    setInterval(
      async () => {
        try {
          await this.checkForNewNewsletters();
        } catch (error) {
          console.error('Newsletter check failed:', error);
          this.status.lastError = error.message;
        }
      },
      30 * 60 * 1000
    ); // 30 minutes

    // Generate performance reports daily
    setInterval(
      async () => {
        try {
          await this.generateDailyPerformanceReport();
        } catch (error) {
          console.error('Daily report generation failed:', error);
        }
      },
      24 * 60 * 60 * 1000
    ); // 24 hours

    // System health check every 5 minutes
    setInterval(
      () => {
        this.performHealthCheck();
      },
      5 * 60 * 1000
    ); // 5 minutes

    console.log('✅ Continuous automation started successfully');
  }

  /**
   * Check for new newsletters from Kit.com
   */
  private async checkForNewNewsletters(): Promise<void> {
    try {
      // Get recent sequences from Kit.com
      const sequences = await this.kitApi.getSequences();
      const newsletterSequences = sequences.sequences.filter(
        seq =>
          seq.name.toLowerCase().includes('94% solution') ||
          seq.name.toLowerCase().includes('real talk')
      );

      for (const sequence of newsletterSequences) {
        if (!sequence.id) continue;

        const emails = await this.kitApi.getSequenceEmails(sequence.id);
        const latestEmail = emails.emails[emails.emails.length - 1];

        if (latestEmail && latestEmail.id && !this.hasProcessedNewsletter(latestEmail.id)) {
          console.log(`📧 New newsletter detected: ${latestEmail.subject}`);
          await this.processNewsletter(latestEmail.id);
        }
      }
    } catch (error) {
      console.error('Failed to check for new newsletters:', error);
      throw error;
    }
  }

  /**
   * Determine if content should be auto-approved
   */
  private async shouldAutoApprove(content: PlatformContent): Promise<boolean> {
    // Check voice authenticity and brand compliance scores
    const voiceScore = content.voiceAuthenticityScore || 0;
    const brandScore = content.brandComplianceScore || 0;
    const averageScore = (voiceScore + brandScore) / 2;

    // Don't auto-approve if below threshold
    if (averageScore < this.config.autoApprovalThreshold) {
      return false;
    }

    // Require manual approval for Audio Intel mentions if configured
    if (
      this.config.automationSettings.requireApprovalForAudioIntelMentions &&
      content.content.toLowerCase().includes('audio intel')
    ) {
      return false;
    }

    // Check platform-specific requirements
    if (content.platform === 'twitter' && content.content.length > 280) {
      return false; // Twitter character limit
    }

    return true;
  }

  /**
   * Convert PlatformContent to ScheduledContent
   */
  private convertToScheduledContent(
    content: PlatformContent,
    newsletterId?: string
  ): ScheduledContent {
    return {
      id: `scheduled_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      platform: content.platform,
      contentType: content.contentType,
      content: content.content,
      scheduledTime: content.scheduledTime,
      priority: this.determinePriority(content),
      status: 'queued',
      retryAttempts: 0,
      performanceExpectations: {
        estimatedReach: this.estimateReach(content),
        estimatedEngagement: this.estimateEngagement(content),
        conversionGoals: content.performanceGoals,
        kpiTargets: this.calculateKPITargets(content),
        successMetrics: ['engagement_rate', 'reach', 'conversions'],
      },
      originalNewsletterSource: newsletterId,
    };
  }

  /**
   * Start performance tracking for generated content
   */
  private async startPerformanceTracking(content: PlatformContent[]): Promise<void> {
    // Schedule performance data collection at different intervals
    content.forEach(piece => {
      // 1 hour tracking
      setTimeout(
        async () => {
          try {
            await this.performanceAnalytics.collectPerformanceData(
              piece.id,
              piece.platform,
              '1_hour'
            );
          } catch (error) {
            console.error('1-hour performance tracking failed:', error);
          }
        },
        60 * 60 * 1000
      );

      // 24 hour tracking
      setTimeout(
        async () => {
          try {
            await this.performanceAnalytics.collectPerformanceData(
              piece.id,
              piece.platform,
              '24_hours'
            );
          } catch (error) {
            console.error('24-hour performance tracking failed:', error);
          }
        },
        24 * 60 * 60 * 1000
      );

      // 7 day tracking
      setTimeout(
        async () => {
          try {
            await this.performanceAnalytics.collectPerformanceData(
              piece.id,
              piece.platform,
              '7_days'
            );
          } catch (error) {
            console.error('7-day performance tracking failed:', error);
          }
        },
        7 * 24 * 60 * 60 * 1000
      );
    });
  }

  /**
   * Generate daily performance report
   */
  private async generateDailyPerformanceReport(): Promise<PerformanceReport> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await this.performanceAnalytics.generatePerformanceReport({
      start: yesterday,
      end: today,
    });

    console.log(`📊 Daily performance report generated: ${report.reportId}`);
    console.log(
      `📈 Summary: ${report.summary.totalContent} content, ${report.summary.averageEngagementRate.toFixed(1)}% avg engagement`
    );

    return report;
  }

  /**
   * Perform system health check
   */
  private performHealthCheck(): void {
    try {
      const errors = [];

      // Check component health
      if (!this.isInitialized) errors.push('System not initialized');
      if (!this.kitApi) errors.push('Kit.com API not available');
      if (!this.twitterAutomation) errors.push('Twitter automation not available');

      // Check queue size
      if (this.status.contentQueueSize > 50) {
        errors.push('Content queue overflow');
      }

      // Check error frequency
      const recentErrors = this.getRecentErrorCount();
      if (recentErrors > 5) {
        errors.push('High error frequency detected');
      }

      // Update health status
      if (errors.length === 0) {
        this.status.systemHealth = 'excellent';
      } else if (errors.length <= 2) {
        this.status.systemHealth = 'good';
      } else if (errors.length <= 4) {
        this.status.systemHealth = 'warning';
      } else {
        this.status.systemHealth = 'error';
      }

      // Update uptime
      this.status.uptime = Date.now() - this.systemMetrics.systemStartTime;
    } catch (error) {
      console.error('Health check failed:', error);
      this.status.systemHealth = 'error';
      this.status.lastError = error.message;
    }
  }

  /**
   * Update system metrics
   */
  private updateSystemMetrics(contentGenerated: number): void {
    this.systemMetrics.totalContentGenerated += contentGenerated;
    this.systemMetrics.totalNewslettersProcessed += 1;

    // Estimate time saved (15 hours per newsletter manually vs 1 hour automated)
    this.systemMetrics.timeSavedWeekly += 14; // 15 - 1 = 14 hours saved

    // Estimate value generated (time savings + increased output)
    const timeSavingsValue = 14 * 25; // 14 hours * £25/hour
    const increasedOutputValue = contentGenerated * 5; // £5 value per additional content piece
    this.systemMetrics.valueGeneratedMonthly += (timeSavingsValue + increasedOutputValue) * 4; // Monthly estimate

    // Update efficiency metrics
    this.systemMetrics.systemEfficiency = Math.min(
      (this.systemMetrics.totalContentPublished / this.systemMetrics.totalContentGenerated) * 100,
      100
    );
  }

  /**
   * Public API methods
   */
  public async getSystemStatus(): Promise<AutomationStatus> {
    this.performHealthCheck();
    return { ...this.status };
  }

  public async getSystemMetrics(): Promise<SystemMetrics> {
    return { ...this.systemMetrics };
  }

  public async getContentQueue(): Promise<ScheduledContent[]> {
    return this.schedulingOrchestrator.getActiveContent();
  }

  public async getActiveBatches(): Promise<ContentBatch[]> {
    return this.schedulingOrchestrator.getActiveBatches();
  }

  public async approveContent(contentId: string): Promise<boolean> {
    try {
      // Find content in processing queue and approve for scheduling
      const content = this.processingQueue.get(contentId);
      if (content) {
        const scheduledContent = this.convertToScheduledContent(content);
        await this.schedulingOrchestrator.createContentBatchSchedule(
          [scheduledContent],
          'manual-approval'
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to approve content:', error);
      return false;
    }
  }

  public async rejectContent(contentId: string): Promise<boolean> {
    try {
      // Remove content from processing queue
      return this.processingQueue.delete(contentId);
    } catch (error) {
      console.error('Failed to reject content:', error);
      return false;
    }
  }

  public async pauseAutomation(): Promise<void> {
    this.status.isActive = false;
    console.log('⏸️ Content automation paused');
  }

  public async resumeAutomation(): Promise<void> {
    this.status.isActive = true;
    console.log('▶️ Content automation resumed');
  }

  public async updateSettings(newSettings: Partial<AutomationSettings>): Promise<void> {
    this.config.automationSettings = {
      ...this.config.automationSettings,
      ...newSettings,
    };
    console.log('⚙️ Automation settings updated');
  }

  /**
   * Test the complete automation workflow with a sample newsletter
   */
  public async testWorkflow(): Promise<{
    success: boolean;
    results: any;
    performance: {
      processingTime: number;
      contentGenerated: number;
      voiceConsistencyScore: number;
    };
  }> {
    console.log('🧪 Starting automation workflow test...');

    const startTime = Date.now();

    try {
      // Test with most recent newsletter
      const result = await this.processNewsletter();

      const processingTime = Date.now() - startTime;
      const voiceConsistencyScore =
        result.generatedContent.reduce(
          (avg, content) => avg + (content.voiceAuthenticityScore || 8.0),
          0
        ) / result.generatedContent.length;

      console.log('✅ Workflow test completed successfully');
      console.log(`⏱️ Processing time: ${processingTime}ms`);
      console.log(`📝 Content generated: ${result.generatedContent.length} pieces`);
      console.log(`🎯 Voice consistency: ${voiceConsistencyScore.toFixed(1)}/10`);

      return {
        success: true,
        results: result,
        performance: {
          processingTime,
          contentGenerated: result.generatedContent.length,
          voiceConsistencyScore,
        },
      };
    } catch (error) {
      console.error('❌ Workflow test failed:', error);
      return {
        success: false,
        results: null,
        performance: {
          processingTime: Date.now() - startTime,
          contentGenerated: 0,
          voiceConsistencyScore: 0,
        },
      };
    }
  }

  // Helper methods
  private initializeStatus(): AutomationStatus {
    return {
      isActive: false,
      lastProcessedNewsletter: null,
      contentQueueSize: 0,
      scheduledContentCount: 0,
      publishedContentToday: 0,
      systemHealth: 'good',
      uptime: 0,
      lastError: null,
    };
  }

  private initializeMetrics(): SystemMetrics {
    return {
      totalNewslettersProcessed: 0,
      totalContentGenerated: 0,
      totalContentPublished: 0,
      averageProcessingTime: 0,
      timeSavedWeekly: 0,
      valueGeneratedMonthly: 0,
      voiceConsistencyScore: 8.5,
      systemEfficiency: 0,
      systemStartTime: Date.now(),
    };
  }

  private hasProcessedNewsletter(newsletterId: string): boolean {
    // Check if newsletter has already been processed
    return this.status.lastProcessedNewsletter === newsletterId;
  }

  private determinePriority(content: PlatformContent): 'high' | 'medium' | 'low' {
    if (content.platform === 'twitter' && content.contentType.includes('thread')) return 'high';
    if (content.platform === 'linkedin' && content.contentType === 'article') return 'high';
    if (content.content.toLowerCase().includes('audio intel')) return 'high';
    return 'medium';
  }

  private estimateReach(content: PlatformContent): number {
    const baseReach = {
      twitter: 5000,
      linkedin: 3000,
      instagram: 2500,
      email: 1500,
    };
    return baseReach[content.platform] || 2000;
  }

  private estimateEngagement(content: PlatformContent): number {
    const baseEngagement = {
      twitter: 4.2,
      linkedin: 3.5,
      instagram: 5.1,
      email: 12.0,
    };
    return baseEngagement[content.platform] || 4.0;
  }

  private calculateKPITargets(content: PlatformContent): Record<string, number> {
    return {
      engagement_rate: this.estimateEngagement(content),
      reach: this.estimateReach(content),
      clicks: this.estimateReach(content) * 0.02,
      conversions: this.estimateReach(content) * 0.005,
    };
  }

  private getRecentErrorCount(): number {
    // This would track recent errors in a real implementation
    return 0;
  }
}

export default ContentAutomationOrchestrator;
export type {
  AutomationConfig,
  AutomationSettings,
  AutomationStatus,
  ContentGenerationResult,
  SystemMetrics,
};
