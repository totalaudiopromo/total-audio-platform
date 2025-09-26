/**
 * Enhanced Content Orchestrator - Integrates Regular Newsletter + Newsjacking
 * Combines the existing Total Audio Content Domination System with the Newsjacker Engine
 * for comprehensive content automation covering both planned and reactive content
 */

import NewsjackerEngine, { 
  NewsjackingOpportunity, 
  NewsjackingAlert,
  type NewsjackerConfig 
} from '@content-domination/newsjacker-engine';

import ContentAutomationOrchestrator, {
  ContentGenerationResult,
  AutomationConfig,
  SystemMetrics
} from './contentAutomationOrchestrator';

export interface EnhancedContentConfig {
  // Existing newsletter automation config
  newsletterAutomation: AutomationConfig;
  
  // New newsjacking config
  newsjacking: NewsjackerConfig;
  
  // Integration settings
  integration: {
    prioritizeNewsjacking: boolean; // Give newsjacking content priority over newsletter content
    crossPlatformSpacing: number; // Minutes between newsletter and newsjacking posts
    dailyContentLimit: number; // Maximum content pieces per day across both systems
    qualityThreshold: number; // Minimum quality score for auto-publishing
    approvalWorkflow: {
      requireApprovalForNewsjacking: boolean;
      requireApprovalForNewsletterContent: boolean;
      autoApproveThreshold: number;
    };
    conflictResolution: {
      strategy: 'newsjacking_priority' | 'newsletter_priority' | 'quality_based' | 'timing_based';
      maxConflicts: number; // Maximum simultaneous content pieces
    };
  };
  
  // Performance optimization
  performance: {
    enableCrossSystemAnalytics: boolean;
    trackROICorrelation: boolean; // Track ROI correlation between newsjacking and newsletter content
    optimizeTimingBasedOnHistory: boolean;
  };
}

export interface ContentOrchestrationResult {
  newsletterContent: ContentGenerationResult | null;
  newsjackingOpportunities: NewsjackingOpportunity[];
  activeAlerts: NewsjackingAlert[];
  conflictResolutions: ContentConflict[];
  performanceMetrics: EnhancedSystemMetrics;
  recommendedActions: string[];
}

export interface ContentConflict {
  id: string;
  type: 'timing' | 'platform' | 'audience' | 'topic';
  newsletterContent: any;
  newsjackingContent: any;
  resolution: 'delay_newsletter' | 'delay_newsjacking' | 'merge_content' | 'cancel_lower_priority';
  rationale: string;
}

export interface EnhancedSystemMetrics extends SystemMetrics {
  newsjacking: {
    totalOpportunitiesDetected: number;
    opportunitiesExecuted: number;
    averageResponseTime: number; // minutes from detection to publication
    averageRelevanceScore: number;
    totalNewsjackingReach: number;
    newsjackingROI: number;
  };
  integration: {
    contentConflicts: number;
    successfulResolutions: number;
    crossSystemSynergy: number; // How well newsletter and newsjacking content complement each other
    audienceOverlapOptimization: number;
  };
  performance: {
    totalWeeklyReach: number; // Combined reach across both systems
    totalWeeklyEngagement: number;
    contentVelocity: number; // Content pieces per week
    qualityConsistency: number; // Voice consistency across both systems
  };
}

class EnhancedContentOrchestrator {
  private newsletterOrchestrator: ContentAutomationOrchestrator;
  private newsjackerEngine: NewsjackerEngine;
  private config: EnhancedContentConfig;
  
  private activeConflicts: Map<string, ContentConflict> = new Map();
  private performanceHistory: Map<string, any> = new Map();
  private isRunning: boolean = false;
  private lastNewsletterProcessed: Date | null = null;
  private dailyContentCount: number = 0;

  constructor(config: EnhancedContentConfig) {
    this.config = config;
    this.initializeOrchestrators();
  }

  /**
   * Initialize both content systems
   */
  private initializeOrchestrators(): void {
    console.log('🚀 Initializing Enhanced Content Orchestrator...');
    
    // Initialize existing newsletter automation
    this.newsletterOrchestrator = new ContentAutomationOrchestrator(this.config.newsletterAutomation);
    
    // Initialize newsjacking engine
    this.newsjackerEngine = new NewsjackerEngine(this.config.newsjacking);
    
    console.log('✅ Enhanced Content Orchestrator initialized');
  }

  /**
   * Start the enhanced content domination system
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Enhanced Content Orchestrator already running');
      return;
    }

    console.log('🚀 Starting Enhanced Content Domination System...');
    console.log('📧 Newsletter Automation + 🔥 Newsjacking Engine = Total Content Domination');
    
    this.isRunning = true;

    // Start both systems
    await this.newsjackerEngine.start();
    
    // The newsletter orchestrator doesn't have a start method, so we'll set up monitoring
    this.startEnhancedMonitoring();
    
    // Reset daily counter at midnight
    this.scheduleDailyReset();

    console.log('✅ Enhanced Content Domination System is now active');
    console.log(`📊 Daily content limit: ${this.config.integration.dailyContentLimit}`);
    console.log(`🎯 Quality threshold: ${this.config.integration.qualityThreshold}`);
    console.log(`⚡ Newsjacking priority: ${this.config.integration.prioritizeNewsjacking}`);
  }

  /**
   * Stop the enhanced system
   */
  async stop(): Promise<void> {
    if (!this.isRunning) return;

    console.log('⏹️ Stopping Enhanced Content Domination System...');
    
    this.isRunning = false;
    await this.newsjackerEngine.stop();
    
    console.log('✅ Enhanced Content Domination System stopped');
  }

  /**
   * Process newsletter with newsjacking integration
   */
  async processNewsletterWithNewsjacking(newsletterId?: string): Promise<ContentOrchestrationResult> {
    console.log('📧 Processing newsletter with newsjacking integration...');
    
    const startTime = Date.now();
    
    try {
      // Step 1: Process regular newsletter content
      const newsletterResult = await this.newsletterOrchestrator.processNewsletter(newsletterId);
      this.lastNewsletterProcessed = new Date();
      
      // Step 2: Get active newsjacking opportunities
      const newsjackingOpportunities = await this.newsjackerEngine.getActiveOpportunities();
      const activeAlerts = await this.newsjackerEngine.getActiveAlerts();
      
      // Step 3: Detect and resolve conflicts
      const conflicts = await this.detectContentConflicts(newsletterResult, newsjackingOpportunities);
      const resolvedConflicts = await this.resolveContentConflicts(conflicts);
      
      // Step 4: Optimize cross-system timing
      await this.optimizeCrossSystemTiming(newsletterResult, newsjackingOpportunities);
      
      // Step 5: Generate performance metrics
      const performanceMetrics = await this.generateEnhancedMetrics();
      
      // Step 6: Generate recommendations
      const recommendedActions = this.generateRecommendations(
        newsletterResult,
        newsjackingOpportunities,
        activeAlerts
      );
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ Enhanced content orchestration completed in ${processingTime}ms`);
      
      return {
        newsletterContent: newsletterResult,
        newsjackingOpportunities,
        activeAlerts,
        conflictResolutions: resolvedConflicts,
        performanceMetrics,
        recommendedActions
      };
      
    } catch (error) {
      console.error('❌ Enhanced content orchestration failed:', error);
      throw error;
    }
  }

  /**
   * Detect conflicts between newsletter and newsjacking content
   */
  private async detectContentConflicts(
    newsletterResult: ContentGenerationResult,
    newsjackingOpportunities: NewsjackingOpportunity[]
  ): Promise<ContentConflict[]> {
    const conflicts: ContentConflict[] = [];
    
    if (!newsletterResult.success || newsjackingOpportunities.length === 0) {
      return conflicts;
    }
    
    // Check for timing conflicts (posts too close together)
    for (const opportunity of newsjackingOpportunities) {
      for (const fusedContent of opportunity.fusedContent) {
        // Check if newsjacking content conflicts with newsletter content timing
        const timingConflict = this.checkTimingConflict(
          newsletterResult.generatedContent,
          fusedContent,
          opportunity.timingPlan
        );
        
        if (timingConflict) {
          conflicts.push({
            id: `conflict_${opportunity.id}_${fusedContent.id}`,
            type: 'timing',
            newsletterContent: newsletterResult.generatedContent.find(nc => 
              nc.platform === fusedContent.platform
            ),
            newsjackingContent: fusedContent,
            resolution: this.determineConflictResolution(timingConflict),
            rationale: `Both systems want to post to ${fusedContent.platform} within ${this.config.integration.crossPlatformSpacing} minutes`
          });
        }
        
        // Check for topic overlap conflicts
        const topicConflict = this.checkTopicConflict(
          newsletterResult.generatedContent,
          fusedContent
        );
        
        if (topicConflict) {
          conflicts.push({
            id: `topic_conflict_${opportunity.id}_${fusedContent.id}`,
            type: 'topic',
            newsletterContent: topicConflict.newsletterContent,
            newsjackingContent: fusedContent,
            resolution: 'merge_content',
            rationale: 'Similar topics detected - merge for stronger narrative'
          });
        }
      }
    }
    
    console.log(`🔍 Detected ${conflicts.length} content conflicts`);
    return conflicts;
  }

  /**
   * Resolve content conflicts based on strategy
   */
  private async resolveContentConflicts(conflicts: ContentConflict[]): Promise<ContentConflict[]> {
    const resolvedConflicts: ContentConflict[] = [];
    
    for (const conflict of conflicts) {
      switch (this.config.integration.conflictResolution.strategy) {
        case 'newsjacking_priority':
          conflict.resolution = 'delay_newsletter';
          break;
          
        case 'newsletter_priority':
          conflict.resolution = 'delay_newsjacking';
          break;
          
        case 'quality_based':
          conflict.resolution = this.resolveByQuality(conflict);
          break;
          
        case 'timing_based':
          conflict.resolution = this.resolveByTiming(conflict);
          break;
      }
      
      // Execute resolution
      await this.executeConflictResolution(conflict);
      resolvedConflicts.push(conflict);
      
      console.log(`✅ Resolved conflict ${conflict.id}: ${conflict.resolution}`);
    }
    
    return resolvedConflicts;
  }

  /**
   * Optimize timing across both systems
   */
  private async optimizeCrossSystemTiming(
    newsletterResult: ContentGenerationResult,
    newsjackingOpportunities: NewsjackingOpportunity[]
  ): Promise<void> {
    console.log('⚡ Optimizing cross-system timing...');
    
    // Create unified posting schedule
    const unifiedSchedule = this.createUnifiedSchedule(newsletterResult, newsjackingOpportunities);
    
    // Apply cross-platform spacing
    this.applyCrossPlatformSpacing(unifiedSchedule);
    
    // Optimize for UK business hours
    this.optimizeForBusinessHours(unifiedSchedule);
    
    console.log(`📅 Unified schedule created with ${unifiedSchedule.length} content pieces`);
  }

  /**
   * Start enhanced monitoring for both systems
   */
  private startEnhancedMonitoring(): void {
    // Monitor newsjacking opportunities every 5 minutes
    setInterval(async () => {
      if (!this.isRunning) return;
      
      const activeOpportunities = await this.newsjackerEngine.getActiveOpportunities();
      const criticalAlerts = activeOpportunities.filter(opp => 
        opp.competitiveContext.firstMover && opp.scoringResult.totalScore > 0.8
      );
      
      if (criticalAlerts.length > 0) {
        console.log(`🚨 ${criticalAlerts.length} critical newsjacking opportunities detected!`);
        
        // Auto-execute if configured
        if (this.config.integration.prioritizeNewsjacking) {
          for (const alert of criticalAlerts) {
            await this.newsjackerEngine.approveOpportunity(alert.id);
          }
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Check for new newsletter content every 30 minutes
    setInterval(async () => {
      if (!this.isRunning) return;
      
      // Check if we should process newsletter content
      const shouldProcess = this.shouldProcessNewsletter();
      if (shouldProcess) {
        await this.processNewsletterWithNewsjacking();
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Generate performance reports daily
    setInterval(async () => {
      await this.generateDailyPerformanceReport();
    }, 24 * 60 * 60 * 1000); // 24 hours
  }

  /**
   * Generate enhanced system metrics
   */
  private async generateEnhancedMetrics(): Promise<EnhancedSystemMetrics> {
    const newsletterMetrics = await this.newsletterOrchestrator.getSystemMetrics();
    const newsjackingPipeline = await this.newsjackerEngine.getPipelineStatus();
    
    return {
      ...newsletterMetrics,
      newsjacking: {
        totalOpportunitiesDetected: newsjackingPipeline.performance.totalOpportunities,
        opportunitiesExecuted: newsjackingPipeline.performance.successfulExecutions,
        averageResponseTime: newsjackingPipeline.performance.averageResponseTime,
        averageRelevanceScore: this.calculateAverageRelevanceScore(),
        totalNewsjackingReach: newsjackingPipeline.performance.totalReach,
        newsjackingROI: this.calculateNewsjackingROI()
      },
      integration: {
        contentConflicts: this.activeConflicts.size,
        successfulResolutions: this.getSuccessfulResolutions(),
        crossSystemSynergy: this.calculateCrossSystemSynergy(),
        audienceOverlapOptimization: this.calculateAudienceOverlapOptimization()
      },
      performance: {
        totalWeeklyReach: newsletterMetrics.totalContentPublished * 2000 + newsjackingPipeline.performance.totalReach,
        totalWeeklyEngagement: newsjackingPipeline.performance.totalEngagement * 1.2,
        contentVelocity: this.calculateContentVelocity(),
        qualityConsistency: this.calculateQualityConsistency()
      }
    };
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(
    newsletterResult: ContentGenerationResult,
    newsjackingOpportunities: NewsjackingOpportunity[],
    activeAlerts: NewsjackingAlert[]
  ): string[] {
    const recommendations = [];
    
    // Newsletter-based recommendations
    if (newsletterResult && newsletterResult.requiresApproval.length > 0) {
      recommendations.push(`Review ${newsletterResult.requiresApproval.length} newsletter content pieces requiring approval`);
    }
    
    // Newsjacking-based recommendations
    const criticalOpportunities = newsjackingOpportunities.filter(opp => 
      opp.scoringResult.totalScore > 0.8
    );
    
    if (criticalOpportunities.length > 0) {
      recommendations.push(`Execute ${criticalOpportunities.length} high-score newsjacking opportunities immediately`);
    }
    
    const firstMoverOpportunities = newsjackingOpportunities.filter(opp => 
      opp.competitiveContext.firstMover
    );
    
    if (firstMoverOpportunities.length > 0) {
      recommendations.push(`Capitalize on ${firstMoverOpportunities.length} first-mover advantages`);
    }
    
    // Content optimization recommendations
    if (this.dailyContentCount > this.config.integration.dailyContentLimit * 0.8) {
      recommendations.push('Approaching daily content limit - prioritize highest-quality opportunities');
    }
    
    // Cross-system recommendations
    const conflicts = this.activeConflicts.size;
    if (conflicts > 0) {
      recommendations.push(`Resolve ${conflicts} active content conflicts for optimal performance`);
    }
    
    // Performance recommendations
    const avgQuality = this.calculateAverageQualityScore(newsletterResult, newsjackingOpportunities);
    if (avgQuality < this.config.integration.qualityThreshold) {
      recommendations.push('Consider raising content quality standards or adjusting automation settings');
    }
    
    return recommendations;
  }

  /**
   * Utility methods
   */
  private shouldProcessNewsletter(): boolean {
    // Check if enough time has passed since last processing
    if (!this.lastNewsletterProcessed) return true;
    
    const timeSinceLastProcess = Date.now() - this.lastNewsletterProcessed.getTime();
    const minimumInterval = 60 * 60 * 1000; // 1 hour
    
    return timeSinceLastProcess > minimumInterval;
  }

  private scheduleDailyReset(): void {
    // Reset daily content counter at midnight UK time
    setInterval(() => {
      const ukTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
      const hour = new Date(ukTime).getHours();
      
      if (hour === 0) { // Midnight UK time
        this.dailyContentCount = 0;
        console.log('🌅 Daily content counter reset');
      }
    }, 60 * 60 * 1000); // Check every hour
  }

  private checkTimingConflict(newsletterContent: any[], newsjackingContent: any, timingPlan: any): boolean {
    // Check if content pieces are scheduled too close together
    const spacingMinutes = this.config.integration.crossPlatformSpacing;
    
    for (const content of newsletterContent) {
      if (content.platform === newsjackingContent.platform) {
        const timeDiff = Math.abs(
          (content.scheduledTime?.getTime() || Date.now()) - 
          (newsjackingContent.timing?.optimalPostTime?.getTime() || Date.now())
        );
        
        if (timeDiff < spacingMinutes * 60 * 1000) {
          return true;
        }
      }
    }
    
    return false;
  }

  private checkTopicConflict(newsletterContent: any[], newsjackingContent: any): any {
    // Simple topic overlap detection based on keywords
    const newsjackingKeywords = newsjackingContent.metadata?.newsjackingAngle?.toLowerCase() || '';
    
    for (const content of newsletterContent) {
      const contentText = content.content.toLowerCase();
      
      // Check for keyword overlap
      if (newsjackingKeywords.length > 0 && contentText.includes(newsjackingKeywords)) {
        return { newsletterContent: content };
      }
    }
    
    return null;
  }

  private determineConflictResolution(conflict: any): string {
    if (this.config.integration.prioritizeNewsjacking) {
      return 'delay_newsletter';
    }
    return 'delay_newsjacking';
  }

  private resolveByQuality(conflict: ContentConflict): string {
    // Compare quality scores and prioritize higher quality content
    const newsletterQuality = conflict.newsletterContent?.voiceAuthenticityScore || 0;
    const newsjackingQuality = conflict.newsjackingContent?.metadata?.voiceConsistencyScore || 0;
    
    return newsjackingQuality > newsletterQuality ? 'delay_newsletter' : 'delay_newsjacking';
  }

  private resolveByTiming(conflict: ContentConflict): string {
    // Prioritize content with more urgent timing requirements
    const newsjackingUrgency = conflict.newsjackingContent?.timing?.urgency;
    
    return newsjackingUrgency === 'immediate' ? 'delay_newsletter' : 'delay_newsjacking';
  }

  private async executeConflictResolution(conflict: ContentConflict): Promise<void> {
    // Mock implementation - in real system, would adjust scheduling
    console.log(`🔧 Executing resolution for ${conflict.id}: ${conflict.resolution}`);
  }

  private createUnifiedSchedule(newsletterResult: any, newsjackingOpportunities: any[]): any[] {
    const schedule = [];
    
    // Add newsletter content to schedule
    if (newsletterResult?.generatedContent) {
      schedule.push(...newsletterResult.generatedContent.map(content => ({
        ...content,
        source: 'newsletter',
        priority: 'medium'
      })));
    }
    
    // Add newsjacking content to schedule
    for (const opportunity of newsjackingOpportunities) {
      for (const content of opportunity.fusedContent) {
        schedule.push({
          ...content,
          source: 'newsjacking',
          priority: opportunity.scoringResult.totalScore > 0.8 ? 'high' : 'medium',
          scheduledTime: content.timing?.optimalPostTime
        });
      }
    }
    
    // Sort by priority and timing
    return schedule.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      const aTime = a.scheduledTime?.getTime() || Date.now();
      const bTime = b.scheduledTime?.getTime() || Date.now();
      return aTime - bTime;
    });
  }

  private applyCrossPlatformSpacing(schedule: any[]): void {
    const spacingMs = this.config.integration.crossPlatformSpacing * 60 * 1000;
    
    for (let i = 1; i < schedule.length; i++) {
      const current = schedule[i];
      const previous = schedule[i - 1];
      
      if (current.platform === previous.platform) {
        const timeDiff = current.scheduledTime - previous.scheduledTime;
        if (timeDiff < spacingMs) {
          current.scheduledTime = new Date(previous.scheduledTime.getTime() + spacingMs);
        }
      }
    }
  }

  private optimizeForBusinessHours(schedule: any[]): void {
    // Ensure all content is scheduled within UK business hours
    for (const item of schedule) {
      if (item.scheduledTime) {
        const ukTime = new Date(item.scheduledTime.toLocaleString("en-US", { timeZone: "Europe/London" }));
        const hour = ukTime.getHours();
        
        if (hour < 9 || hour > 18) {
          // Move to next business hour
          const adjustedTime = new Date(ukTime);
          if (hour < 9) {
            adjustedTime.setHours(9, 0, 0, 0);
          } else {
            adjustedTime.setDate(adjustedTime.getDate() + 1);
            adjustedTime.setHours(9, 0, 0, 0);
          }
          item.scheduledTime = adjustedTime;
        }
      }
    }
  }

  private calculateAverageRelevanceScore(): number {
    // Mock calculation - would track historical relevance scores
    return 0.75;
  }

  private calculateNewsjackingROI(): number {
    // Mock calculation - would track actual ROI from newsjacking content
    return 450; // 450% ROI
  }

  private getSuccessfulResolutions(): number {
    // Mock calculation - would track resolved conflicts
    return Array.from(this.activeConflicts.values()).length;
  }

  private calculateCrossSystemSynergy(): number {
    // Mock calculation - would measure how well both systems work together
    return 0.85;
  }

  private calculateAudienceOverlapOptimization(): number {
    // Mock calculation - would measure audience overlap efficiency
    return 0.78;
  }

  private calculateContentVelocity(): number {
    // Mock calculation - content pieces per week
    return 25;
  }

  private calculateQualityConsistency(): number {
    // Mock calculation - voice consistency across both systems
    return 0.88;
  }

  private calculateAverageQualityScore(newsletterResult: any, newsjackingOpportunities: any[]): number {
    let totalScore = 0;
    let count = 0;
    
    if (newsletterResult?.generatedContent) {
      for (const content of newsletterResult.generatedContent) {
        totalScore += content.voiceAuthenticityScore || 0;
        count++;
      }
    }
    
    for (const opportunity of newsjackingOpportunities) {
      for (const content of opportunity.fusedContent) {
        totalScore += content.metadata?.voiceConsistencyScore || 0;
        count++;
      }
    }
    
    return count > 0 ? totalScore / count : 0;
  }

  private async generateDailyPerformanceReport(): Promise<void> {
    const metrics = await this.generateEnhancedMetrics();
    
    console.log('📊 Daily Enhanced Content Performance Report');
    console.log('=' .repeat(60));
    console.log(`📧 Newsletter Content: ${metrics.totalContentGenerated} pieces`);
    console.log(`🔥 Newsjacking Opportunities: ${metrics.newsjacking.opportunitiesExecuted} executed`);
    console.log(`⚡ Average Response Time: ${metrics.newsjacking.averageResponseTime} minutes`);
    console.log(`📈 Total Weekly Reach: ${metrics.performance.totalWeeklyReach.toLocaleString()}`);
    console.log(`🎯 Quality Consistency: ${(metrics.performance.qualityConsistency * 100).toFixed(1)}%`);
    console.log(`💰 Newsjacking ROI: ${metrics.newsjacking.newsjackingROI}%`);
  }

  /**
   * Public API methods
   */
  public async getEnhancedStatus(): Promise<{
    isRunning: boolean;
    newsletterStatus: any;
    newsjackingStatus: any;
    activeConflicts: number;
    dailyContentCount: number;
  }> {
    const newsletterStatus = await this.newsletterOrchestrator.getSystemStatus();
    const newsjackingStatus = await this.newsjackerEngine.getPipelineStatus();
    
    return {
      isRunning: this.isRunning,
      newsletterStatus,
      newsjackingStatus,
      activeConflicts: this.activeConflicts.size,
      dailyContentCount: this.dailyContentCount
    };
  }

  public async forceNewsletterProcessing(newsletterId?: string): Promise<ContentOrchestrationResult> {
    return await this.processNewsletterWithNewsjacking(newsletterId);
  }

  public async getActiveOpportunities(): Promise<NewsjackingOpportunity[]> {
    return await this.newsjackerEngine.getActiveOpportunities();
  }

  public async approveNewsjackingOpportunity(opportunityId: string): Promise<boolean> {
    return await this.newsjackerEngine.approveOpportunity(opportunityId);
  }

  public async rejectNewsjackingOpportunity(opportunityId: string): Promise<boolean> {
    return await this.newsjackerEngine.rejectOpportunity(opportunityId);
  }

  public async getEnhancedMetrics(): Promise<EnhancedSystemMetrics> {
    return await this.generateEnhancedMetrics();
  }

  public updateConfig(newConfig: Partial<EnhancedContentConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };
    
    // Update sub-system configs
    if (newConfig.newsletterAutomation) {
      this.newsletterOrchestrator.updateSettings(newConfig.newsletterAutomation.automationSettings);
    }
    
    if (newConfig.newsjacking) {
      this.newsjackerEngine.updateConfig(newConfig.newsjacking);
    }
    
    console.log('⚙️ Enhanced Content Orchestrator configuration updated');
  }
}

export default EnhancedContentOrchestrator;
export type {
  EnhancedContentConfig,
  ContentOrchestrationResult,
  ContentConflict,
  EnhancedSystemMetrics
};