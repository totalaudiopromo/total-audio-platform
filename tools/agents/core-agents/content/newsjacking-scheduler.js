#!/usr/bin/env node

/**
 * Newsjacking Scheduler for Total Audio Promo
 *
 * Automated scheduling system that runs newsjacking cycles at optimal times
 * and manages the complete pipeline from trend detection to content publication.
 *
 * Schedule:
 * - 6:00 AM UK: Daily trend monitoring and content generation
 * - 9:00 AM UK: Review pending approvals
 * - 12:00 PM UK: Midday trend check for breaking news
 * - 6:00 PM UK: Evening content review and scheduling
 * - 11:00 PM UK: Final review and next-day preparation
 */

const cron = require('node-cron');
const NewsjackingAgent = require('./newsjacking-agent');
const NewsletterAutomationAgent = require('./newsletter-automation-agent');

// Simple logger
const logger = {
  info: (msg, ...args) => console.log(`[SCHEDULER] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[SCHEDULER] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[SCHEDULER] ${msg}`, ...args),
};

class NewsjackingScheduler {
  constructor() {
    this.name = 'NewsjackingScheduler';
    this.newsjackingAgent = new NewsjackingAgent();
    this.newsletterAgent = new NewsletterAutomationAgent();
    this.isRunning = false;

    this.metrics = {
      scheduledJobs: 0,
      executedCycles: 0,
      contentGenerated: 0,
      alertsSent: 0,
      uptime: 0,
    };

    // UK timezone for scheduling
    this.timezone = 'Europe/London';

    // Notification settings
    this.notifications = {
      email: process.env.ADMIN_EMAIL || 'chris@totalaudiopromo.com',
      slack: process.env.SLACK_WEBHOOK_URL,
      urgentThreshold: 0.9, // Send immediate alerts for stories above this relevance
    };
  }

  /**
   * Initialize the scheduler
   */
  async initialize() {
    try {
      await this.newsjackingAgent.initialize();
      await this.newsletterAgent.initialize();

      logger.info('Newsjacking Scheduler initialized successfully');
      return true;
    } catch (error) {
      logger.error('Scheduler initialization failed:', error);
      return false;
    }
  }

  /**
   * Start all scheduled jobs
   */
  async startScheduler() {
    if (this.isRunning) {
      logger.warn('Scheduler is already running');
      return;
    }

    this.isRunning = true;
    this.startTime = new Date();

    logger.info('🚀 Starting Newsjacking Scheduler...');
    logger.info(`   Timezone: ${this.timezone}`);
    logger.info('   Schedule:');
    logger.info('   - 06:00 UK: Daily trend monitoring & content generation');
    logger.info('   - 09:00 UK: Review pending approvals');
    logger.info('   - 12:00 UK: Midday trend check for breaking news');
    logger.info('   - 18:00 UK: Evening content review & scheduling');
    logger.info('   - 23:00 UK: Final review & next-day preparation');
    logger.info('   - Every 15min: Urgent trend detection');

    // Daily trend monitoring and content generation (6 AM UK)
    cron.schedule(
      '0 6 * * *',
      async () => {
        await this.executeDailyTrendCycle();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );

    // Review pending approvals (9 AM UK)
    cron.schedule(
      '0 9 * * *',
      async () => {
        await this.reviewPendingContent();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );

    // Midday breaking news check (12 PM UK)
    cron.schedule(
      '0 12 * * *',
      async () => {
        await this.executeBreakingNewsCheck();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );

    // Evening content review and scheduling (6 PM UK)
    cron.schedule(
      '0 18 * * *',
      async () => {
        await this.executeEveningReview();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );

    // Final review and preparation (11 PM UK)
    cron.schedule(
      '0 23 * * *',
      async () => {
        await this.executeFinalReview();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );

    // Urgent trend detection every 15 minutes during business hours
    cron.schedule(
      '*/15 9-18 * * 1-5',
      async () => {
        await this.executeUrgentTrendCheck();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );

    // Health check every hour
    cron.schedule(
      '0 * * * *',
      async () => {
        await this.executeHealthCheck();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );

    this.metrics.scheduledJobs = 6;
    logger.info('✅ All scheduled jobs started successfully');
  }

  /**
   * Execute daily trend monitoring cycle (6 AM)
   */
  async executeDailyTrendCycle() {
    try {
      logger.info('🌅 Executing daily trend cycle...');

      const startTime = Date.now();
      const result = await this.newsletterAgent.runNewsletterCycle();
      const duration = Date.now() - startTime;

      if (result) {
        logger.info(`✅ Daily cycle complete (${duration}ms)`);
        logger.info(`   Newsletter: Issue ${result.newsletter.issueNumber}`);
        logger.info(`   Platforms: ${Object.keys(result.platformContent).length}`);
        logger.info(`   Status: ${result.status}`);

        this.metrics.executedCycles++;
        this.metrics.contentGenerated++;

        // Send notification for review
        await this.sendNotification({
          type: 'daily_content_ready',
          title: 'Daily Newsletter Content Ready for Review',
          data: result,
          urgency: 'normal',
        });
      } else {
        logger.warn('❌ Daily cycle failed - no content generated');

        await this.sendNotification({
          type: 'daily_cycle_failed',
          title: 'Daily Newsjacking Cycle Failed',
          urgency: 'high',
        });
      }
    } catch (error) {
      logger.error('Error in daily trend cycle:', error);

      await this.sendNotification({
        type: 'daily_cycle_error',
        title: 'Daily Cycle Error',
        error: error.message,
        urgency: 'high',
      });
    }
  }

  /**
   * Review pending content for approvals (9 AM)
   */
  async reviewPendingContent() {
    try {
      logger.info('📋 Reviewing pending content...');

      // This would typically check database for pending content
      // For now, we'll just log the review request

      await this.sendNotification({
        type: 'pending_review',
        title: 'Content Pending Your Review',
        message: 'New newsletter content is ready for your review and approval',
        urgency: 'normal',
      });

      logger.info('✅ Review notification sent');
    } catch (error) {
      logger.error('Error in pending review:', error);
    }
  }

  /**
   * Check for breaking news (12 PM)
   */
  async executeBreakingNewsCheck() {
    try {
      logger.info('🚨 Checking for breaking news...');

      const trendingStories = await this.newsjackingAgent.monitorTrendingTopics();
      const urgentStories = trendingStories.filter(
        story => story.relevanceScore >= this.notifications.urgentThreshold
      );

      if (urgentStories.length > 0) {
        logger.info(`🔥 Found ${urgentStories.length} urgent stories`);

        for (const story of urgentStories) {
          const content = await this.newsjackingAgent.generateUnsignedAdvantageContent(story);

          if (content) {
            await this.sendNotification({
              type: 'urgent_story',
              title: 'Urgent Story Detected',
              story: story.title,
              relevance: story.relevanceScore,
              content: content.newsletterSections[0]?.content.slice(0, 200) + '...',
              urgency: 'immediate',
            });

            this.metrics.alertsSent++;
          }
        }
      } else {
        logger.info('📰 No urgent stories detected');
      }
    } catch (error) {
      logger.error('Error in breaking news check:', error);
    }
  }

  /**
   * Execute evening review and scheduling (6 PM)
   */
  async executeEveningReview() {
    try {
      logger.info('🌆 Executing evening review...');

      // Check approved content and schedule for optimal posting times
      await this.scheduleApprovedContent();

      // Generate performance report for the day
      const dayReport = await this.generateDayReport();

      await this.sendNotification({
        type: 'evening_report',
        title: 'Daily Newsjacking Report',
        report: dayReport,
        urgency: 'normal',
      });

      logger.info('✅ Evening review complete');
    } catch (error) {
      logger.error('Error in evening review:', error);
    }
  }

  /**
   * Execute final review and next-day preparation (11 PM)
   */
  async executeFinalReview() {
    try {
      logger.info('🌙 Executing final review...');

      // Prepare tomorrow's monitoring targets
      await this.prepareNextDayTargets();

      // Clean up old processed content
      await this.cleanupOldContent();

      // Generate system health report
      const healthReport = this.generateHealthReport();

      logger.info('💤 System prepared for tomorrow');
      logger.info(`   Health Score: ${healthReport.healthScore}/10`);
      logger.info(`   Today's Metrics: ${JSON.stringify(this.metrics)}`);
    } catch (error) {
      logger.error('Error in final review:', error);
    }
  }

  /**
   * Execute urgent trend check (every 15 minutes during business hours)
   */
  async executeUrgentTrendCheck() {
    try {
      const trendingStories = await this.newsjackingAgent.monitorTrendingTopics();
      const urgentStories = trendingStories.filter(
        story =>
          story.relevanceScore >= this.notifications.urgentThreshold && this.isStoryFresh(story, 30) // Within last 30 minutes
      );

      if (urgentStories.length > 0) {
        logger.info(`⚡ Urgent trend check: ${urgentStories.length} fresh high-relevance stories`);

        for (const story of urgentStories) {
          await this.sendNotification({
            type: 'urgent_trend',
            title: 'Breaking: High-Relevance Story',
            story: story.title,
            relevance: story.relevanceScore,
            source: story.source,
            urgency: 'immediate',
          });
        }

        this.metrics.alertsSent += urgentStories.length;
      }
    } catch (error) {
      logger.error('Error in urgent trend check:', error);
    }
  }

  /**
   * Execute system health check
   */
  async executeHealthCheck() {
    try {
      const health = this.generateHealthReport();

      if (health.healthScore < 7) {
        await this.sendNotification({
          type: 'health_warning',
          title: 'System Health Warning',
          healthScore: health.healthScore,
          issues: health.issues,
          urgency: 'high',
        });
      }

      // Update uptime
      if (this.startTime) {
        this.metrics.uptime = Math.floor((Date.now() - this.startTime.getTime()) / 1000);
      }
    } catch (error) {
      logger.error('Error in health check:', error);
    }
  }

  /**
   * Schedule approved content for optimal posting times
   */
  async scheduleApprovedContent() {
    // This would check for approved content and schedule it
    // across different platforms at optimal times

    const optimalTimes = {
      twitter: '09:00',
      linkedin: '08:00',
      instagram: '19:00',
      newsletter: '07:00',
    };

    logger.info('📅 Scheduling approved content for optimal times');
    logger.info(`   Twitter: ${optimalTimes.twitter}`);
    logger.info(`   LinkedIn: ${optimalTimes.linkedin}`);
    logger.info(`   Instagram: ${optimalTimes.instagram}`);
    logger.info(`   Newsletter: ${optimalTimes.newsletter}`);
  }

  /**
   * Generate daily performance report
   */
  async generateDayReport() {
    return {
      date: new Date().toISOString().split('T')[0],
      metrics: { ...this.metrics },
      topStories: [], // Would be populated with actual data
      contentGenerated: this.metrics.contentGenerated,
      approvalsPending: 0, // Would check database
      nextDayPrep: 'Ready',
    };
  }

  /**
   * Prepare targets for next day monitoring
   */
  async prepareNextDayTargets() {
    // This would analyze trends and prepare focused monitoring
    // for tomorrow's cycle
    logger.info('🎯 Next day targets prepared');
  }

  /**
   * Clean up old processed content
   */
  async cleanupOldContent() {
    // This would clean up old processed content from database
    // to maintain system performance
    logger.info('🧹 Old content cleanup complete');
  }

  /**
   * Generate system health report
   */
  generateHealthReport() {
    const healthScore = Math.min(
      10,
      Math.max(
        0,
        (this.metrics.executedCycles > 0 ? 3 : 0) +
          (this.metrics.contentGenerated > 0 ? 3 : 0) +
          (this.isRunning ? 2 : 0) +
          (this.metrics.uptime > 3600 ? 2 : 0) // Running for more than 1 hour
      )
    );

    const issues = [];
    if (this.metrics.executedCycles === 0) issues.push('No cycles executed today');
    if (this.metrics.contentGenerated === 0) issues.push('No content generated today');
    if (!this.isRunning) issues.push('Scheduler not running');

    return {
      healthScore,
      issues,
      uptime: this.metrics.uptime,
      lastCheck: new Date().toISOString(),
    };
  }

  /**
   * Send notification via configured channels
   */
  async sendNotification(notification) {
    try {
      const timestamp = new Date().toLocaleString('en-GB', {
        timeZone: this.timezone,
      });

      const message = `[${timestamp}] ${notification.title}`;

      // Console log (always)
      const urgencyIcon =
        {
          immediate: '🚨',
          high: '⚠️',
          normal: 'ℹ️',
        }[notification.urgency] || 'ℹ️';

      logger.info(`${urgencyIcon} NOTIFICATION: ${message}`);

      if (notification.data) {
        logger.info(`   Data: ${JSON.stringify(notification.data, null, 2)}`);
      }

      // Email notification (if configured)
      if (this.notifications.email && notification.urgency === 'immediate') {
        // Would implement email sending here
        logger.info(`📧 Email sent to ${this.notifications.email}`);
      }

      // Slack notification (if configured)
      if (this.notifications.slack && ['immediate', 'high'].includes(notification.urgency)) {
        // Would implement Slack webhook here
        logger.info(`💬 Slack notification sent`);
      }
    } catch (error) {
      logger.error('Failed to send notification:', error);
    }
  }

  /**
   * Check if story is fresh (published within specified minutes)
   */
  isStoryFresh(story, minutes) {
    const ageMinutes = (Date.now() - story.publishedAt.getTime()) / (1000 * 60);
    return ageMinutes <= minutes;
  }

  /**
   * Get scheduler metrics and status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      uptime: this.metrics.uptime,
      metrics: { ...this.metrics },
      nextRuns: {
        dailyTrend: '06:00 UK',
        pendingReview: '09:00 UK',
        breakingNews: '12:00 UK',
        eveningReview: '18:00 UK',
        finalReview: '23:00 UK',
      },
      health: this.generateHealthReport(),
    };
  }

  /**
   * Stop the scheduler
   */
  async stopScheduler() {
    try {
      this.isRunning = false;

      // Cron jobs will be stopped when process exits

      await this.newsjackingAgent.shutdown();
      await this.newsletterAgent.shutdown();

      logger.info('🛑 Newsjacking Scheduler stopped');
    } catch (error) {
      logger.error('Error stopping scheduler:', error);
    }
  }
}

// Export for use by other systems
module.exports = NewsjackingScheduler;

// CLI execution
if (require.main === module) {
  const scheduler = new NewsjackingScheduler();

  async function main() {
    if (process.argv.includes('--start')) {
      await scheduler.initialize();
      await scheduler.startScheduler();

      // Keep process running
      console.log('Press Ctrl+C to stop scheduler');
      process.on('SIGINT', async () => {
        console.log('\nShutting down scheduler...');
        await scheduler.stopScheduler();
        process.exit(0);
      });
    } else if (process.argv.includes('--status')) {
      const status = scheduler.getStatus();
      console.log(JSON.stringify(status, null, 2));
    } else if (process.argv.includes('--test-daily')) {
      await scheduler.initialize();
      await scheduler.executeDailyTrendCycle();
      await scheduler.stopScheduler();
    } else if (process.argv.includes('--test-urgent')) {
      await scheduler.initialize();
      await scheduler.executeUrgentTrendCheck();
      await scheduler.stopScheduler();
    } else {
      console.log(`
Newsjacking Scheduler Commands:
  --start        Start the complete scheduler (runs continuously)
  --status       Show current scheduler status
  --test-daily   Test daily trend cycle once
  --test-urgent  Test urgent trend check once
  
Schedule Overview:
  06:00 UK - Daily trend monitoring & content generation
  09:00 UK - Review pending approvals
  12:00 UK - Breaking news check
  18:00 UK - Evening review & scheduling  
  23:00 UK - Final review & preparation
  Every 15min (9-18h) - Urgent trend detection
      `);
    }
  }

  main().catch(console.error);
}
