#!/usr/bin/env node

/**
 * Campaign Timeline & Scheduling System
 *
 * Coordinates campaign timing and scheduling
 * Plans follow-up sequences and campaign milestones
 * Tracks campaign progress and deadlines
 */

const fs = require('fs');
const path = require('path');

class CampaignScheduler {
  constructor() {
    this.campaigns = new Map();
    this.schedules = new Map();
    this.milestones = new Map();
    this.deadlines = new Map();

    // Data persistence
    this.dataFile = path.join(__dirname, '..', 'data', 'campaign-scheduler.json');
    this.loadData();

    // Start scheduler
    this.startScheduler();
  }

  /**
   * Create campaign timeline
   */
  async createCampaignTimeline(campaignData, options = {}) {
    console.log(`📅 Creating timeline for campaign: ${campaignData.campaignId}`);

    try {
      const timeline = {
        campaignId: campaignData.campaignId,
        artistName: campaignData.artistName,
        trackTitle: campaignData.trackTitle,
        startDate: campaignData.startDate || new Date().toISOString(),
        endDate:
          campaignData.endDate || this.calculateEndDate(campaignData.startDate, options.duration),
        duration: options.duration || 30, // days
        status: 'active',
        phases: this.generateCampaignPhases(campaignData, options),
        milestones: this.generateMilestones(campaignData, options),
        deadlines: this.generateDeadlines(campaignData, options),
        createdAt: Date.now(),
      };

      this.campaigns.set(campaignData.campaignId, timeline);
      this.saveData();

      console.log(
        `✅ Timeline created with ${timeline.phases.length} phases and ${timeline.milestones.length} milestones`
      );

      return timeline;
    } catch (error) {
      console.error('❌ Failed to create campaign timeline:', error.message);
      throw error;
    }
  }

  /**
   * Generate campaign phases
   */
  generateCampaignPhases(campaignData, options) {
    const phases = [
      {
        name: 'Pre-Launch',
        duration: 7,
        description: 'Preparation and setup phase',
        tasks: [
          'Create press materials',
          'Set up tracking systems',
          'Prepare contact lists',
          'Test email templates',
          'Configure analytics',
        ],
        status: 'pending',
      },
      {
        name: 'Initial Outreach',
        duration: 5,
        description: 'First wave of contacts and pitches',
        tasks: [
          'Send initial pitches',
          'Follow up on responses',
          'Track engagement',
          'Adjust strategy based on feedback',
        ],
        status: 'pending',
      },
      {
        name: 'Follow-up Phase',
        duration: 10,
        description: 'Systematic follow-up and relationship building',
        tasks: [
          'Execute follow-up sequences',
          'Handle responses automatically',
          'Build relationships',
          'Monitor social media opportunities',
        ],
        status: 'pending',
      },
      {
        name: 'Peak Activity',
        duration: 7,
        description: 'Maximum outreach and engagement',
        tasks: [
          'Intensify follow-ups',
          'Leverage positive responses',
          'Capitalize on momentum',
          'Monitor play results',
        ],
        status: 'pending',
      },
      {
        name: 'Maintenance',
        duration: 5,
        description: 'Sustain relationships and track results',
        tasks: [
          'Maintain relationships',
          'Track and report results',
          'Plan future campaigns',
          'Gather feedback',
        ],
        status: 'pending',
      },
    ];

    return phases;
  }

  /**
   * Generate campaign milestones
   */
  generateMilestones(campaignData, options) {
    const milestones = [
      {
        id: `milestone-${campaignData.campaignId}-1`,
        name: 'Campaign Launch',
        description: 'Official campaign start',
        dueDate: new Date(campaignData.startDate).toISOString(),
        status: 'pending',
        priority: 'high',
      },
      {
        id: `milestone-${campaignData.campaignId}-2`,
        name: 'First 10 Contacts',
        description: 'Reach first 10 contacts',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
      },
      {
        id: `milestone-${campaignData.campaignId}-3`,
        name: 'First Response',
        description: 'Receive first positive response',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'medium',
      },
      {
        id: `milestone-${campaignData.campaignId}-4`,
        name: 'First Play',
        description: 'Achieve first radio play',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
      },
      {
        id: `milestone-${campaignData.campaignId}-5`,
        name: '50% Contact Coverage',
        description: 'Contact 50% of target list',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'medium',
      },
      {
        id: `milestone-${campaignData.campaignId}-6`,
        name: 'Campaign Midpoint',
        description: 'Reach campaign midpoint',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'medium',
      },
      {
        id: `milestone-${campaignData.campaignId}-7`,
        name: '100% Contact Coverage',
        description: 'Contact entire target list',
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
      },
      {
        id: `milestone-${campaignData.campaignId}-8`,
        name: 'Campaign Completion',
        description: 'Complete all campaign activities',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
      },
    ];

    return milestones;
  }

  /**
   * Generate deadlines
   */
  generateDeadlines(campaignData, options) {
    const deadlines = [
      {
        id: `deadline-${campaignData.campaignId}-1`,
        name: 'Press Kit Ready',
        description: 'Complete press kit and media assets',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
        type: 'preparation',
      },
      {
        id: `deadline-${campaignData.campaignId}-2`,
        name: 'Email Templates Ready',
        description: 'Finalize email templates and personalization',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
        type: 'preparation',
      },
      {
        id: `deadline-${campaignData.campaignId}-3`,
        name: 'First Follow-up Round',
        description: 'Complete first round of follow-ups',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'medium',
        type: 'execution',
      },
      {
        id: `deadline-${campaignData.campaignId}-4`,
        name: 'Mid-Campaign Review',
        description: 'Review progress and adjust strategy',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'medium',
        type: 'review',
      },
      {
        id: `deadline-${campaignData.campaignId}-5`,
        name: 'Final Follow-up Round',
        description: 'Complete final round of follow-ups',
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
        type: 'execution',
      },
      {
        id: `deadline-${campaignData.campaignId}-6`,
        name: 'Campaign Report',
        description: 'Generate final campaign report',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
        type: 'reporting',
      },
    ];

    return deadlines;
  }

  /**
   * Calculate end date
   */
  calculateEndDate(startDate, duration) {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
    return end.toISOString();
  }

  /**
   * Schedule task
   */
  async scheduleTask(taskData) {
    console.log(`⏰ Scheduling task: ${taskData.name}`);

    try {
      const task = {
        id: `task-${Date.now()}`,
        campaignId: taskData.campaignId,
        name: taskData.name,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority || 'medium',
        status: 'scheduled',
        type: taskData.type || 'general',
        assignedTo: taskData.assignedTo,
        createdAt: Date.now(),
      };

      this.schedules.set(task.id, task);
      this.saveData();

      console.log(`✅ Task scheduled: ${task.name} (${task.dueDate})`);

      return task;
    } catch (error) {
      console.error('❌ Failed to schedule task:', error.message);
      throw error;
    }
  }

  /**
   * Update milestone status
   */
  updateMilestoneStatus(milestoneId, status, notes = '') {
    const milestone = this.milestones.get(milestoneId);
    if (!milestone) {
      throw new Error(`Milestone not found: ${milestoneId}`);
    }

    milestone.status = status;
    milestone.updatedAt = Date.now();
    milestone.notes = notes;

    this.milestones.set(milestoneId, milestone);
    this.saveData();

    console.log(`📊 Milestone updated: ${milestone.name} - ${status}`);

    return milestone;
  }

  /**
   * Update deadline status
   */
  updateDeadlineStatus(deadlineId, status, notes = '') {
    const deadline = this.deadlines.get(deadlineId);
    if (!deadline) {
      throw new Error(`Deadline not found: ${deadlineId}`);
    }

    deadline.status = status;
    deadline.updatedAt = Date.now();
    deadline.notes = notes;

    this.deadlines.set(deadlineId, deadline);
    this.saveData();

    console.log(`⏰ Deadline updated: ${deadline.name} - ${status}`);

    return deadline;
  }

  /**
   * Get campaign timeline
   */
  getCampaignTimeline(campaignId) {
    return this.campaigns.get(campaignId);
  }

  /**
   * Get upcoming deadlines
   */
  getUpcomingDeadlines(days = 7) {
    const now = Date.now();
    const cutoff = now + days * 24 * 60 * 60 * 1000;

    const upcoming = Array.from(this.deadlines.values())
      .filter(deadline => {
        const dueDate = new Date(deadline.dueDate).getTime();
        return dueDate <= cutoff && deadline.status === 'pending';
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return upcoming;
  }

  /**
   * Get overdue items
   */
  getOverdueItems() {
    const now = Date.now();

    const overdue = {
      milestones: Array.from(this.milestones.values()).filter(milestone => {
        const dueDate = new Date(milestone.dueDate).getTime();
        return dueDate < now && milestone.status === 'pending';
      }),
      deadlines: Array.from(this.deadlines.values()).filter(deadline => {
        const dueDate = new Date(deadline.dueDate).getTime();
        return dueDate < now && deadline.status === 'pending';
      }),
      tasks: Array.from(this.schedules.values()).filter(task => {
        const dueDate = new Date(task.dueDate).getTime();
        return dueDate < now && task.status === 'scheduled';
      }),
    };

    return overdue;
  }

  /**
   * Get campaign progress
   */
  getCampaignProgress(campaignId) {
    const timeline = this.campaigns.get(campaignId);
    if (!timeline) return null;

    const milestones = Array.from(this.milestones.values()).filter(m => m.id.includes(campaignId));

    const deadlines = Array.from(this.deadlines.values()).filter(d => d.id.includes(campaignId));

    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const completedDeadlines = deadlines.filter(d => d.status === 'completed').length;

    const progress = {
      campaignId,
      totalMilestones: milestones.length,
      completedMilestones,
      milestoneProgress:
        milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0,
      totalDeadlines: deadlines.length,
      completedDeadlines,
      deadlineProgress: deadlines.length > 0 ? (completedDeadlines / deadlines.length) * 100 : 0,
      overallProgress: 0,
      status: timeline.status,
      daysRemaining: this.calculateDaysRemaining(timeline.endDate),
    };

    // Calculate overall progress
    progress.overallProgress = (progress.milestoneProgress + progress.deadlineProgress) / 2;

    return progress;
  }

  /**
   * Calculate days remaining
   */
  calculateDaysRemaining(endDate) {
    const now = Date.now();
    const end = new Date(endDate).getTime();
    const diff = end - now;
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  }

  /**
   * Start scheduler
   */
  startScheduler() {
    console.log('⏰ Starting campaign scheduler...');

    // Check for overdue items every hour
    setInterval(() => {
      this.checkOverdueItems();
    }, 60 * 60 * 1000);

    // Check for upcoming deadlines every 6 hours
    setInterval(() => {
      this.checkUpcomingDeadlines();
    }, 6 * 60 * 60 * 1000);

    console.log('✅ Campaign scheduler started');
  }

  /**
   * Check for overdue items
   */
  checkOverdueItems() {
    const overdue = this.getOverdueItems();
    const totalOverdue =
      overdue.milestones.length + overdue.deadlines.length + overdue.tasks.length;

    if (totalOverdue > 0) {
      console.log(`⚠️  OVERDUE ITEMS ALERT: ${totalOverdue} items overdue`);
      console.log(`   Milestones: ${overdue.milestones.length}`);
      console.log(`   Deadlines: ${overdue.deadlines.length}`);
      console.log(`   Tasks: ${overdue.tasks.length}`);
    }
  }

  /**
   * Check for upcoming deadlines
   */
  checkUpcomingDeadlines() {
    const upcoming = this.getUpcomingDeadlines(3); // Next 3 days

    if (upcoming.length > 0) {
      console.log(`📅 UPCOMING DEADLINES: ${upcoming.length} items due soon`);
      upcoming.forEach(deadline => {
        const days = this.calculateDaysRemaining(deadline.dueDate);
        console.log(`   ${deadline.name} - ${days} days (${deadline.priority} priority)`);
      });
    }
  }

  /**
   * Get scheduler analytics
   */
  getSchedulerAnalytics() {
    const campaigns = Array.from(this.campaigns.values());
    const milestones = Array.from(this.milestones.values());
    const deadlines = Array.from(this.deadlines.values());
    const tasks = Array.from(this.schedules.values());

    const analytics = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalMilestones: milestones.length,
      completedMilestones: milestones.filter(m => m.status === 'completed').length,
      totalDeadlines: deadlines.length,
      completedDeadlines: deadlines.filter(d => d.status === 'completed').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      overdueItems: this.getOverdueItems(),
      upcomingDeadlines: this.getUpcomingDeadlines(7),
      lastUpdated: new Date().toISOString(),
    };

    return analytics;
  }

  /**
   * Data persistence
   */
  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.campaigns = new Map(data.campaigns || []);
        this.schedules = new Map(data.schedules || []);
        this.milestones = new Map(data.milestones || []);
        this.deadlines = new Map(data.deadlines || []);
        console.log(`📚 Loaded scheduler data: ${this.campaigns.size} campaigns`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load scheduler data:', error.message);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = {
        campaigns: Array.from(this.campaigns.entries()),
        schedules: Array.from(this.schedules.entries()),
        milestones: Array.from(this.milestones.entries()),
        deadlines: Array.from(this.deadlines.entries()),
        lastSaved: Date.now(),
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save scheduler data:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const analytics = this.getSchedulerAnalytics();

    return {
      status: 'healthy',
      totalCampaigns: analytics.totalCampaigns,
      activeCampaigns: analytics.activeCampaigns,
      totalMilestones: analytics.totalMilestones,
      completedMilestones: analytics.completedMilestones,
      totalDeadlines: analytics.totalDeadlines,
      completedDeadlines: analytics.completedDeadlines,
      overdueItems: analytics.overdueItems,
      upcomingDeadlines: analytics.upcomingDeadlines,
      lastChecked: new Date().toISOString(),
    };
  }
}

module.exports = CampaignScheduler;
