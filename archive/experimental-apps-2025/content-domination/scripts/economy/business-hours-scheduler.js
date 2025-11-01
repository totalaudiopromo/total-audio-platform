/**
 * Business Hours Scheduler for Economy Mode
 * Manages system operation during UK business hours only
 * Automatically pauses/resumes system to conserve free tier resources
 */

const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config();

class BusinessHoursScheduler {
  constructor() {
    this.timezone = process.env.TIMEZONE || 'Europe/London';
    this.businessStart = parseInt(process.env.BUSINESS_HOURS_START || 9);
    this.businessEnd = parseInt(process.env.BUSINESS_HOURS_END || 18);
    this.weekendMode = process.env.WEEKEND_MODE || 'off'; // off, reduced, normal
    this.economyMode = process.env.ECONOMY_MODE === 'true';
    this.isSystemActive = false;
    this.statusFile = path.join(process.cwd(), 'data', 'system-status.json');
    this.schedules = new Map();
  }

  /**
   * Initialize business hours scheduler
   */
  async init() {
    console.log('🕐 Initializing Business Hours Scheduler...');
    console.log(`Business Hours: ${this.businessStart}:00 - ${this.businessEnd}:00 UK time`);
    console.log(`Weekend Mode: ${this.weekendMode}`);
    console.log(`Economy Mode: ${this.economyMode ? 'ON' : 'OFF'}`);

    // Check current status
    await this.checkCurrentBusinessHours();

    // Set up automated schedules
    this.setupBusinessHoursSchedules();

    // Set up resource conservation schedules
    if (this.economyMode) {
      this.setupEconomySchedules();
    }

    console.log('✅ Business Hours Scheduler initialized');
  }

  /**
   * Check if current time is within business hours
   */
  isBusinessHours() {
    const now = new Date();
    const ukTime = new Date(now.toLocaleString('en-US', { timeZone: this.timezone }));
    const hour = ukTime.getHours();
    const day = ukTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Check if it's a weekday
    const isWeekday = day >= 1 && day <= 5;

    // Check if it's within business hours
    const inBusinessHours = hour >= this.businessStart && hour < this.businessEnd;

    if (!isWeekday) {
      return this.weekendMode === 'normal';
    }

    return inBusinessHours;
  }

  /**
   * Check current business hours status and update system accordingly
   */
  async checkCurrentBusinessHours() {
    const shouldBeActive = this.isBusinessHours();
    const currentTime = new Date().toLocaleString('en-US', { timeZone: this.timezone });

    console.log(`🕐 Current UK time: ${currentTime}`);
    console.log(`📊 System should be: ${shouldBeActive ? 'ACTIVE' : 'PAUSED'}`);

    if (shouldBeActive && !this.isSystemActive) {
      await this.activateSystem();
    } else if (!shouldBeActive && this.isSystemActive) {
      await this.pauseSystem();
    } else {
      console.log(`✅ System status already correct: ${this.isSystemActive ? 'ACTIVE' : 'PAUSED'}`);
    }
  }

  /**
   * Activate the system for business hours
   */
  async activateSystem() {
    console.log('🟢 ACTIVATING SYSTEM for business hours...');

    this.isSystemActive = true;

    // Save status
    await this.saveSystemStatus({
      active: true,
      timestamp: new Date().toISOString(),
      reason: 'Business hours started',
      nextAction: 'Pause at business hours end',
    });

    // Start business hours monitoring
    this.startBusinessHoursMonitoring();

    // Send activation notification
    await this.sendNotification(
      'system_activated',
      'Content monitoring activated for business hours'
    );

    console.log('✅ System ACTIVATED - monitoring started');
  }

  /**
   * Pause the system outside business hours
   */
  async pauseSystem() {
    console.log('🔴 PAUSING SYSTEM outside business hours...');

    this.isSystemActive = false;

    // Stop all monitoring
    this.stopBusinessHoursMonitoring();

    // Save status
    await this.saveSystemStatus({
      active: false,
      timestamp: new Date().toISOString(),
      reason: 'Outside business hours',
      nextAction: 'Resume at business hours start',
    });

    // Send pause notification
    await this.sendNotification('system_paused', 'Content monitoring paused until business hours');

    console.log('✅ System PAUSED - conserving resources');
  }

  /**
   * Set up automated business hours schedules
   */
  setupBusinessHoursSchedules() {
    console.log('⏰ Setting up business hours schedules...');

    // Start of business day (Monday-Friday 9 AM UK)
    const startSchedule = cron.schedule(
      `0 ${this.businessStart} * * 1-5`,
      async () => {
        console.log('🌅 Business hours starting...');
        await this.activateSystem();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('business_start', startSchedule);

    // End of business day (Monday-Friday 6 PM UK)
    const endSchedule = cron.schedule(
      `0 ${this.businessEnd} * * 1-5`,
      async () => {
        console.log('🌆 Business hours ending...');
        await this.pauseSystem();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('business_end', endSchedule);

    // Weekend start (Friday 6 PM UK)
    const weekendStartSchedule = cron.schedule(
      `0 ${this.businessEnd} * * 5`,
      async () => {
        console.log('🏖️ Weekend starting...');
        await this.handleWeekendStart();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('weekend_start', weekendStartSchedule);

    // Weekend end (Monday 9 AM UK)
    const weekendEndSchedule = cron.schedule(
      `0 ${this.businessStart} * * 1`,
      async () => {
        console.log('💼 Weekend ending, back to business...');
        await this.handleWeekendEnd();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('weekend_end', weekendEndSchedule);

    console.log('✅ Business hours schedules configured');
  }

  /**
   * Set up economy mode resource conservation schedules
   */
  setupEconomySchedules() {
    console.log('💰 Setting up economy mode schedules...');

    // Hourly resource check during business hours
    const resourceCheckSchedule = cron.schedule(
      '0 * * * *',
      async () => {
        if (this.isSystemActive) {
          await this.performResourceCheck();
        }
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('resource_check', resourceCheckSchedule);

    // Daily budget check at start of business day
    const budgetCheckSchedule = cron.schedule(
      `5 ${this.businessStart} * * 1-5`,
      async () => {
        await this.performDailyBudgetCheck();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('budget_check', budgetCheckSchedule);

    // Weekly resource planning (Monday 8 AM)
    const weeklyPlanningSchedule = cron.schedule(
      `0 8 * * 1`,
      async () => {
        await this.performWeeklyResourcePlanning();
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('weekly_planning', weeklyPlanningSchedule);

    console.log('✅ Economy mode schedules configured');
  }

  /**
   * Start business hours monitoring activities
   */
  startBusinessHoursMonitoring() {
    if (!this.economyMode) return;

    console.log('📊 Starting business hours monitoring...');

    // RSS monitoring schedule (every 30 minutes during business hours)
    const rssSchedule = cron.schedule(
      '*/30 * * * *',
      async () => {
        if (this.isSystemActive && this.isBusinessHours()) {
          await this.triggerRSSMonitoring();
        }
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('rss_monitoring', rssSchedule);

    // Opportunity processing (every hour during business hours)
    const opportunitySchedule = cron.schedule(
      '15 * * * *',
      async () => {
        if (this.isSystemActive && this.isBusinessHours()) {
          await this.processOpportunities();
        }
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('opportunity_processing', opportunitySchedule);
  }

  /**
   * Stop business hours monitoring activities
   */
  stopBusinessHoursMonitoring() {
    console.log('⏹️ Stopping business hours monitoring...');

    // Stop active monitoring schedules
    ['rss_monitoring', 'opportunity_processing'].forEach(scheduleKey => {
      const schedule = this.schedules.get(scheduleKey);
      if (schedule) {
        schedule.stop();
        this.schedules.delete(scheduleKey);
      }
    });
  }

  /**
   * Handle weekend start
   */
  async handleWeekendStart() {
    if (this.weekendMode === 'off') {
      await this.pauseSystem();
      console.log('🏖️ Weekend mode: OFF - system fully paused');
    } else if (this.weekendMode === 'reduced') {
      await this.setupReducedWeekendMonitoring();
      console.log('🏖️ Weekend mode: REDUCED - minimal monitoring only');
    } else {
      console.log('🏖️ Weekend mode: NORMAL - continuing regular monitoring');
    }
  }

  /**
   * Handle weekend end
   */
  async handleWeekendEnd() {
    // Stop weekend monitoring if it was running
    this.stopWeekendMonitoring();

    // Resume normal business hours operation
    await this.activateSystem();
    console.log('💼 Weekend ended - resuming normal business hours operation');
  }

  /**
   * Set up reduced weekend monitoring
   */
  async setupReducedWeekendMonitoring() {
    this.isSystemActive = true;

    // Reduced RSS scanning (every 2 hours)
    const weekendRSSSchedule = cron.schedule(
      '0 */2 * * 0,6',
      async () => {
        await this.triggerRSSMonitoring('weekend_mode');
      },
      {
        scheduled: true,
        timezone: this.timezone,
      }
    );
    this.schedules.set('weekend_rss', weekendRSSSchedule);

    await this.saveSystemStatus({
      active: true,
      mode: 'weekend_reduced',
      timestamp: new Date().toISOString(),
      reason: 'Weekend reduced monitoring',
      nextAction: 'Resume full monitoring Monday',
    });
  }

  /**
   * Stop weekend monitoring
   */
  stopWeekendMonitoring() {
    const weekendSchedule = this.schedules.get('weekend_rss');
    if (weekendSchedule) {
      weekendSchedule.stop();
      this.schedules.delete('weekend_rss');
    }
  }

  /**
   * Perform hourly resource check
   */
  async performResourceCheck() {
    console.log('🔍 Performing hourly resource check...');

    try {
      const CostMonitor = require('./cost-monitor');
      const monitor = new CostMonitor();

      const alerts = await monitor.checkAllLimits();
      const emergencyCheck = await monitor.shouldEmergencyShutdown();

      if (emergencyCheck.shutdown) {
        console.log('🚨 EMERGENCY: Resource limits exceeded - pausing system');
        await this.pauseSystem();
        await this.sendNotification('emergency_pause', `System paused: ${emergencyCheck.reason}`);
        return;
      }

      // Check if we should switch to template-only mode
      const criticalAlerts = alerts.filter(alert => alert.severity === 'emergency');
      if (criticalAlerts.length > 0) {
        console.log('⚠️ Switching to template-only mode due to resource constraints');
        await this.switchToTemplateMode();
      }
    } catch (error) {
      console.error('❌ Resource check failed:', error.message);
    }
  }

  /**
   * Perform daily budget check
   */
  async performDailyBudgetCheck() {
    console.log('💰 Performing daily budget check...');

    try {
      const CostMonitor = require('./cost-monitor');
      const monitor = new CostMonitor();
      const dashboard = await monitor.getDashboardData();

      console.log(`💰 Current spend: £${dashboard.currentUsage.totalCost.toFixed(2)}`);
      console.log(`📈 Projected month-end: £${dashboard.projectedCosts.projected.toFixed(2)}`);
      console.log(`🏥 Health score: ${dashboard.healthScore}/100`);

      // Send daily budget summary
      await this.sendNotification('daily_budget', {
        currentSpend: dashboard.currentUsage.totalCost,
        projected: dashboard.projectedCosts.projected,
        healthScore: dashboard.healthScore,
        recommendations: dashboard.recommendations,
      });
    } catch (error) {
      console.error('❌ Daily budget check failed:', error.message);
    }
  }

  /**
   * Perform weekly resource planning
   */
  async performWeeklyResourcePlanning() {
    console.log('📋 Performing weekly resource planning...');

    try {
      const CostMonitor = require('./cost-monitor');
      const monitor = new CostMonitor();
      const dashboard = await monitor.getDashboardData();

      // Generate weekly recommendations
      const weeklyPlan = {
        budget_remaining: dashboard.budgetRemaining,
        days_remaining: dashboard.daysRemainingInMonth,
        recommended_daily_spend: dashboard.budgetRemaining / dashboard.daysRemainingInMonth,
        priority_focus: this.generatePriorityFocus(dashboard),
        scaling_recommendations: this.generateScalingRecommendations(dashboard),
      };

      console.log('📋 Weekly Plan Generated:');
      console.log(`   Budget remaining: £${weeklyPlan.budget_remaining.toFixed(2)}`);
      console.log(`   Daily spend target: £${weeklyPlan.recommended_daily_spend.toFixed(2)}`);
      console.log(`   Priority focus: ${weeklyPlan.priority_focus}`);

      await this.sendNotification('weekly_planning', weeklyPlan);
    } catch (error) {
      console.error('❌ Weekly planning failed:', error.message);
    }
  }

  /**
   * Trigger RSS monitoring
   */
  async triggerRSSMonitoring(mode = 'normal') {
    console.log(`📡 Triggering RSS monitoring (${mode} mode)...`);

    try {
      // This would trigger the RSS scanner
      const { spawn } = require('child_process');
      const scanner = spawn('node', ['scripts/economy/rss-scanner.js'], {
        env: { ...process.env, MONITORING_MODE: mode },
      });

      scanner.on('close', code => {
        console.log(`📡 RSS scan completed with code ${code}`);
      });
    } catch (error) {
      console.error('❌ RSS monitoring failed:', error.message);
    }
  }

  /**
   * Process opportunities
   */
  async processOpportunities() {
    console.log('🎯 Processing opportunities...');

    try {
      // This would trigger opportunity processing
      const { spawn } = require('child_process');
      const processor = spawn('node', ['scripts/economy/opportunity-processor.js']);

      processor.on('close', code => {
        console.log(`🎯 Opportunity processing completed with code ${code}`);
      });
    } catch (error) {
      console.error('❌ Opportunity processing failed:', error.message);
    }
  }

  /**
   * Switch to template-only mode
   */
  async switchToTemplateMode() {
    console.log('🎨 Switching to template-only mode...');

    // Update environment to disable AI
    process.env.TEMPLATE_MODE_THRESHOLD = '0'; // Use templates for all content
    process.env.ENABLE_AI_GENERATION = 'false';

    await this.saveSystemStatus({
      active: true,
      mode: 'template_only',
      timestamp: new Date().toISOString(),
      reason: 'Resource conservation',
      nextAction: 'Resume AI when budget allows',
    });

    console.log('✅ Switched to template-only mode');
  }

  /**
   * Save system status to file
   */
  async saveSystemStatus(status) {
    try {
      await fs.mkdir(path.dirname(this.statusFile), { recursive: true });
      await fs.writeFile(this.statusFile, JSON.stringify(status, null, 2));
    } catch (error) {
      console.error('❌ Failed to save system status:', error.message);
    }
  }

  /**
   * Send notification
   */
  async sendNotification(type, data) {
    const timestamp = new Date().toISOString();

    console.log(`📢 Notification: ${type}`);

    // In a real implementation, this would send emails, webhooks, etc.
    // For now, just log to console
    if (typeof data === 'object') {
      console.log('   Data:', JSON.stringify(data, null, 2));
    } else {
      console.log('   Message:', data);
    }
  }

  /**
   * Generate priority focus based on current usage
   */
  generatePriorityFocus(dashboard) {
    if (dashboard.currentUsage.totalCost > dashboard.budgetRemaining * 0.8) {
      return 'Cost optimization - switch to templates';
    }

    if (dashboard.healthScore < 70) {
      return 'System health - reduce API calls';
    }

    if (dashboard.alerts.length > 3) {
      return 'Alert resolution - address warnings';
    }

    return 'Growth optimization - maximize opportunities';
  }

  /**
   * Generate scaling recommendations
   */
  generateScalingRecommendations(dashboard) {
    const recommendations = [];

    if (dashboard.budgetRemaining > dashboard.currentUsage.totalCost) {
      recommendations.push('Consider increasing AI threshold for better content quality');
    }

    if (dashboard.healthScore > 90) {
      recommendations.push('System running efficiently - maintain current settings');
    }

    if (dashboard.currentUsage.serviceBreakdown.claude?.calls < 10) {
      recommendations.push('AI usage low - consider lowering quality threshold');
    }

    return recommendations;
  }

  /**
   * Get current system status
   */
  async getSystemStatus() {
    try {
      const statusData = await fs.readFile(this.statusFile, 'utf8');
      const status = JSON.parse(statusData);

      return {
        ...status,
        isBusinessHours: this.isBusinessHours(),
        currentTime: new Date().toLocaleString('en-US', { timeZone: this.timezone }),
        systemActive: this.isSystemActive,
      };
    } catch (error) {
      return {
        active: false,
        timestamp: new Date().toISOString(),
        reason: 'Status file not found',
        isBusinessHours: this.isBusinessHours(),
        currentTime: new Date().toLocaleString('en-US', { timeZone: this.timezone }),
        systemActive: this.isSystemActive,
      };
    }
  }

  /**
   * Cleanup and stop all schedules
   */
  cleanup() {
    console.log('🧹 Cleaning up business hours scheduler...');

    this.schedules.forEach((schedule, key) => {
      schedule.stop();
      console.log(`   Stopped: ${key}`);
    });

    this.schedules.clear();
    console.log('✅ Cleanup completed');
  }
}

// Export for use in other scripts
module.exports = BusinessHoursScheduler;

// CLI usage
if (require.main === module) {
  const scheduler = new BusinessHoursScheduler();

  const command = process.argv[2];

  switch (command) {
    case 'start':
      scheduler.init().then(() => {
        console.log('🕐 Business Hours Scheduler running...');

        // Graceful shutdown
        process.on('SIGINT', () => {
          console.log('\n🛑 Shutting down...');
          scheduler.cleanup();
          process.exit(0);
        });
      });
      break;

    case 'status':
      scheduler.getSystemStatus().then(status => {
        console.log('\n🕐 BUSINESS HOURS STATUS');
        console.log('='.repeat(40));
        console.log(`Current UK Time: ${status.currentTime}`);
        console.log(`Business Hours: ${status.isBusinessHours ? 'YES' : 'NO'}`);
        console.log(`System Active: ${status.systemActive ? 'YES' : 'NO'}`);
        console.log(`Last Update: ${status.timestamp}`);
        console.log(`Reason: ${status.reason}`);
        if (status.mode) console.log(`Mode: ${status.mode}`);
      });
      break;

    case 'check':
      scheduler.checkCurrentBusinessHours().then(() => {
        console.log('✅ Business hours check completed');
      });
      break;

    default:
      console.log('Usage: node business-hours-scheduler.js [start|status|check]');
  }
}
