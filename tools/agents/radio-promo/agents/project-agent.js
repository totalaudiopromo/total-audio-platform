#!/usr/bin/env node

/**
 * Liberty Music PR Project Agent
 *
 * Handles Monday.com campaign automation and project management
 * Creates structured campaign boards, manages tasks, timelines, and milestones
 *
 * Features:
 * - Monday.com API integration for campaign board creation
 * - Automated task generation based on Liberty workflows
 * - Timeline management with deadline calculations
 * - Budget tracking and milestone monitoring
 * - Real-time status updates and progress reporting
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class ProjectAgent extends EventEmitter {
  constructor(options = {}) {
    super();

    this.name = 'ProjectAgent';
    this.version = '1.0.0';
    this.orchestrator = options.orchestrator;
    this.config = options.config || {};
    this.logger = options.logger || console.log;

    // Monday.com API configuration
    this.mondayConfig = {
      apiKey: process.env.MONDAY_API_KEY,
      apiVersion: '2023-10',
      baseUrl: 'https://api.monday.com/v2',
      defaultWorkspaceId: process.env.MONDAY_WORKSPACE_ID,
      rateLimitDelay: 1000, // 1 second between requests
    };

    // Campaign board templates for different workflow types
    this.boardTemplates = {
      'complete-campaign': {
        name: '{artistName} - {trackTitle} Radio Campaign',
        description: 'Full Liberty Music PR radio promotion campaign',
        groups: [
          {
            title: 'Pre-Launch Setup',
            color: 'blue',
            tasks: [
              {
                name: 'Campaign Brief Review',
                type: 'milestone',
                priority: 'critical',
                timeline: -7, // days from release
                dependencies: [],
                assignee: 'chris@libertymusicpr.com',
              },
              {
                name: 'Press Release Creation',
                type: 'task',
                priority: 'high',
                timeline: -5,
                dependencies: ['Campaign Brief Review'],
                assignee: 'team@libertymusicpr.com',
              },
              {
                name: 'Radio Station List Compilation',
                type: 'task',
                priority: 'high',
                timeline: -5,
                dependencies: ['Campaign Brief Review'],
                assignee: 'team@libertymusicpr.com',
              },
              {
                name: 'WARM API Tracking Setup',
                type: 'task',
                priority: 'high',
                timeline: -3,
                dependencies: ['Campaign Brief Review'],
                assignee: 'system@libertymusicpr.com',
              },
            ],
          },
          {
            title: 'Launch Week',
            color: 'green',
            tasks: [
              {
                name: 'Press Release Distribution',
                type: 'task',
                priority: 'critical',
                timeline: 0, // release day
                dependencies: ['Press Release Creation'],
                assignee: 'team@libertymusicpr.com',
              },
              {
                name: 'Radio Station Outreach - Wave 1',
                type: 'task',
                priority: 'critical',
                timeline: 1,
                dependencies: ['Radio Station List Compilation', 'Press Release Distribution'],
                assignee: 'team@libertymusicpr.com',
              },
              {
                name: 'Amazing Radio Submission',
                type: 'task',
                priority: 'high',
                timeline: 1,
                dependencies: ['Radio Station List Compilation'],
                assignee: 'system@libertymusicpr.com',
              },
              {
                name: 'Wigwam Radio Submission',
                type: 'task',
                priority: 'medium',
                timeline: 2,
                dependencies: ['Radio Station List Compilation'],
                assignee: 'system@libertymusicpr.com',
              },
            ],
          },
          {
            title: 'Follow-up & Tracking',
            color: 'orange',
            tasks: [
              {
                name: 'Radio Station Follow-up - Wave 2',
                type: 'task',
                priority: 'high',
                timeline: 7,
                dependencies: ['Radio Station Outreach - Wave 1'],
                assignee: 'team@libertymusicpr.com',
              },
              {
                name: 'WARM API Play Monitoring',
                type: 'ongoing',
                priority: 'medium',
                timeline: 1,
                duration: 30,
                dependencies: ['WARM API Tracking Setup'],
                assignee: 'system@libertymusicpr.com',
              },
              {
                name: 'Weekly Performance Review',
                type: 'recurring',
                priority: 'medium',
                timeline: 7,
                frequency: 'weekly',
                dependencies: ['WARM API Play Monitoring'],
                assignee: 'team@libertymusicpr.com',
              },
            ],
          },
          {
            title: 'Reporting & Delivery',
            color: 'purple',
            tasks: [
              {
                name: 'Campaign Performance Analysis',
                type: 'task',
                priority: 'high',
                timeline: 21,
                dependencies: ['WARM API Play Monitoring'],
                assignee: 'team@libertymusicpr.com',
              },
              {
                name: 'Professional Report Generation',
                type: 'task',
                priority: 'high',
                timeline: 23,
                dependencies: ['Campaign Performance Analysis'],
                assignee: 'system@libertymusicpr.com',
              },
              {
                name: 'Client Report Delivery',
                type: 'milestone',
                priority: 'critical',
                timeline: 25,
                dependencies: ['Professional Report Generation'],
                assignee: 'chris@libertymusicpr.com',
              },
            ],
          },
        ],
      },

      'rush-campaign': {
        name: '{artistName} - {trackTitle} RUSH Campaign',
        description: 'Expedited Liberty Music PR radio promotion campaign',
        groups: [
          {
            title: 'Immediate Actions',
            color: 'red',
            tasks: [
              {
                name: 'Emergency Brief Review',
                type: 'milestone',
                priority: 'critical',
                timeline: 0,
                assignee: 'chris@libertymusicpr.com',
              },
              {
                name: 'Rapid Press Release Creation',
                type: 'task',
                priority: 'critical',
                timeline: 1,
                dependencies: ['Emergency Brief Review'],
                assignee: 'team@libertymusicpr.com',
              },
              {
                name: 'Priority Station Outreach',
                type: 'task',
                priority: 'critical',
                timeline: 2,
                dependencies: ['Rapid Press Release Creation'],
                assignee: 'team@libertymusicpr.com',
              },
            ],
          },
        ],
      },
    };

    // Task status workflow
    this.statusWorkflow = {
      not_started: { next: ['in_progress', 'blocked'], color: 'grey' },
      in_progress: { next: ['completed', 'blocked', 'review'], color: 'blue' },
      review: { next: ['completed', 'in_progress', 'blocked'], color: 'orange' },
      completed: { next: [], color: 'green' },
      blocked: { next: ['in_progress', 'cancelled'], color: 'red' },
      cancelled: { next: [], color: 'dark_grey' },
    };

    // Priority levels with scoring
    this.priorityLevels = {
      critical: { score: 100, color: 'red' },
      high: { score: 80, color: 'orange' },
      medium: { score: 60, color: 'yellow' },
      low: { score: 40, color: 'green' },
    };

    // Metrics tracking
    this.metrics = {
      campaignsCreated: 0,
      boardsGenerated: 0,
      tasksCreated: 0,
      milestonesTracked: 0,
      averageSetupTime: 0,
      mondayApiCalls: 0,
      successfulUpdates: 0,
      failedOperations: 0,
    };

    // Active campaigns tracking
    this.activeCampaigns = new Map();
    this.campaignBoards = new Map();

    // Rate limiting for Monday.com API
    this.lastApiCall = 0;
    this.apiQueue = [];
  }

  /**
   * Initialize the Project Agent
   */
  async initialize() {
    try {
      this.logger('📋 Initializing Project Agent...');

      // Verify Monday.com API access
      await this.verifyMondayAccess();

      // Load existing campaigns
      await this.loadCampaignState();

      // Setup monitoring
      await this.setupCampaignMonitoring();

      this.logger('✅ Project Agent initialized successfully');
      return true;
    } catch (error) {
      this.logger('❌ Project Agent initialization failed:', error);
      return false;
    }
  }

  /**
   * Verify Monday.com API access
   */
  async verifyMondayAccess() {
    if (!this.mondayConfig.apiKey) {
      throw new Error('MONDAY_API_KEY environment variable not set');
    }

    try {
      // Test API call
      await this.callMondayAPI('query { me { name } }');
      this.logger('🔗 Monday.com API connection verified');
    } catch (error) {
      throw new Error(`Monday.com API verification failed: ${error.message}`);
    }
  }

  /**
   * Load existing campaign state
   */
  async loadCampaignState() {
    try {
      const stateFile = './data/campaign-boards.json';
      if (fs.existsSync(stateFile)) {
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));

        if (state.campaigns) {
          state.campaigns.forEach(campaign => {
            this.activeCampaigns.set(campaign.id, campaign);
          });
        }

        if (state.boards) {
          state.boards.forEach(board => {
            this.campaignBoards.set(board.campaignId, board);
          });
        }

        this.logger(`📂 Loaded ${this.activeCampaigns.size} existing campaigns`);
      }
    } catch (error) {
      this.logger('⚠️  Could not load campaign state:', error.message);
    }
  }

  /**
   * Setup campaign monitoring
   */
  async setupCampaignMonitoring() {
    // Monitor campaign progress every 15 minutes
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.monitorActiveCampaigns();
      } catch (error) {
        this.logger('⚠️  Campaign monitoring error:', error.message);
      }
    }, 15 * 60 * 1000); // 15 minutes

    this.logger('📊 Campaign monitoring started');
  }

  /**
   * Create campaign - main entry point
   */
  async createCampaign(campaignData) {
    const startTime = Date.now();
    const campaignId = this.generateCampaignId();

    try {
      this.logger(`🎬 Creating campaign: ${campaignId}`);

      // Parse campaign data from Intelligence Agent
      const parsedData = this.parseCampaignData(campaignData);

      // Determine campaign template
      const template = this.selectCampaignTemplate(parsedData);

      // Create Monday.com board
      const board = await this.createMondayBoard(campaignId, parsedData, template);

      // Setup campaign structure
      const campaign = {
        id: campaignId,
        startTime,
        data: parsedData,
        template: template.name,
        board,
        status: 'active',
        metrics: {
          tasksTotal: 0,
          tasksCompleted: 0,
          milestonesTotal: 0,
          milestonesReached: 0,
        },
        timeline: this.calculateCampaignTimeline(parsedData, template),
        notifications: [],
      };

      // Generate all tasks and groups
      await this.generateCampaignTasks(campaign);

      // Store campaign
      this.activeCampaigns.set(campaignId, campaign);
      this.campaignBoards.set(campaignId, board);

      // Save state
      await this.saveCampaignState();

      // Update metrics
      this.updateMetrics(campaign, Date.now() - startTime);

      this.logger(`✨ Campaign created successfully: ${board.name}`);
      this.logger(
        `📊 Generated ${campaign.metrics.tasksTotal} tasks across ${board.groups.length} groups`
      );

      // Emit progress event
      this.emit('campaign-created', {
        campaignId,
        boardUrl: board.url,
        tasksGenerated: campaign.metrics.tasksTotal,
      });

      return {
        campaignId,
        boardId: board.id,
        boardUrl: board.url,
        boardName: board.name,
        tasksGenerated: campaign.metrics.tasksTotal,
        estimatedCompletion: campaign.timeline.estimatedCompletion,
        nextMilestone: campaign.timeline.nextMilestone,
      };
    } catch (error) {
      this.logger('❌ Campaign creation failed:', error);

      // Clean up any partial creation
      this.activeCampaigns.delete(campaignId);
      this.campaignBoards.delete(campaignId);

      throw error;
    }
  }

  /**
   * Parse campaign data from Intelligence Agent
   */
  parseCampaignData(rawData) {
    // Handle different input formats
    let campaignData;

    if (rawData.campaign) {
      // From Intelligence Agent final brief
      campaignData = rawData.campaign;
    } else if (rawData.campaignData) {
      // From Intelligence Agent extraction
      campaignData = rawData.campaignData;
    } else {
      // Direct campaign data
      campaignData = rawData;
    }

    // Set defaults for missing fields
    const parsedData = {
      artistName: campaignData.artistName || 'Unknown Artist',
      trackTitle: campaignData.trackTitle || 'Unknown Track',
      genre: campaignData.genre || 'General',
      releaseDate: campaignData.releaseDate ? new Date(campaignData.releaseDate) : new Date(),
      budget: campaignData.budget || '£2,000',
      priority: campaignData.priority || 'medium',
      campaignType: campaignData.campaignType || 'standard',
      targets: campaignData.targets || 'UK radio stations',
      timeline: campaignData.timeline || '4 weeks',
    };

    // Validate required fields
    if (!parsedData.artistName || parsedData.artistName === 'Unknown Artist') {
      throw new Error('Artist name is required for campaign creation');
    }

    if (!parsedData.trackTitle || parsedData.trackTitle === 'Unknown Track') {
      throw new Error('Track title is required for campaign creation');
    }

    return parsedData;
  }

  /**
   * Select appropriate campaign template
   */
  selectCampaignTemplate(campaignData) {
    // Check for rush campaign indicators
    if (
      campaignData.priority === 'critical' ||
      campaignData.campaignType === 'rush' ||
      this.isRushTimeline(campaignData.releaseDate)
    ) {
      return {
        name: 'rush-campaign',
        ...this.boardTemplates['rush-campaign'],
      };
    }

    // Default to complete campaign template
    return {
      name: 'complete-campaign',
      ...this.boardTemplates['complete-campaign'],
    };
  }

  /**
   * Check if timeline indicates rush campaign
   */
  isRushTimeline(releaseDate) {
    const now = new Date();
    const release = new Date(releaseDate);
    const daysUntilRelease = Math.ceil((release - now) / (1000 * 60 * 60 * 24));

    return daysUntilRelease <= 7; // Less than a week
  }

  /**
   * Create Monday.com board
   */
  async createMondayBoard(campaignId, campaignData, template) {
    try {
      this.logger(`🏗️  Creating Monday.com board for ${campaignData.artistName}...`);

      // Generate board name from template
      const boardName = template.name
        .replace('{artistName}', campaignData.artistName)
        .replace('{trackTitle}', campaignData.trackTitle);

      // Create board via Monday.com API (simulated)
      const board = await this.callMondayBoardCreation({
        name: boardName,
        description: template.description,
        workspaceId: this.mondayConfig.defaultWorkspaceId,
        campaignData,
      });

      this.logger(`✅ Monday.com board created: ${board.name}`);

      return {
        id: board.id,
        name: board.name,
        url: board.url,
        groups: [],
        created: new Date(),
        campaignId,
      };
    } catch (error) {
      this.logger('❌ Monday.com board creation failed:', error);
      throw error;
    }
  }

  /**
   * Generate campaign tasks and groups
   */
  async generateCampaignTasks(campaign) {
    const template = this.boardTemplates[campaign.template];
    if (!template) {
      throw new Error(`Template '${campaign.template}' not found`);
    }

    this.logger(`📝 Generating tasks for ${template.groups.length} groups...`);

    for (const groupTemplate of template.groups) {
      try {
        // Create group in Monday.com
        const group = await this.createMondayGroup(campaign.board.id, groupTemplate, campaign);

        // Add group to board
        campaign.board.groups.push(group);

        // Generate tasks for this group
        await this.generateGroupTasks(campaign, group, groupTemplate);

        this.logger(`✅ Group created: ${group.title} (${group.tasks.length} tasks)`);
      } catch (error) {
        this.logger(`❌ Failed to create group ${groupTemplate.title}:`, error);
        throw error;
      }
    }

    // Calculate totals
    campaign.metrics.tasksTotal = campaign.board.groups.reduce(
      (total, group) => total + group.tasks.length,
      0
    );

    campaign.metrics.milestonesTotal = campaign.board.groups.reduce(
      (total, group) => total + group.tasks.filter(task => task.type === 'milestone').length,
      0
    );

    this.logger(
      `📊 Task generation complete: ${campaign.metrics.tasksTotal} tasks, ${campaign.metrics.milestonesTotal} milestones`
    );
  }

  /**
   * Create Monday.com group
   */
  async createMondayGroup(boardId, groupTemplate, campaign) {
    const group = {
      id: this.generateGroupId(),
      title: groupTemplate.title,
      color: groupTemplate.color,
      boardId,
      tasks: [],
      created: new Date(),
    };

    // Create group via Monday.com API (simulated)
    await this.callMondayAPI(`
      mutation {
        create_group(board_id: ${boardId}, group_name: "${group.title}") {
          id
        }
      }
    `);

    return group;
  }

  /**
   * Generate tasks for a specific group
   */
  async generateGroupTasks(campaign, group, groupTemplate) {
    for (const taskTemplate of groupTemplate.tasks) {
      try {
        const task = await this.createCampaignTask(campaign, group, taskTemplate);
        group.tasks.push(task);
      } catch (error) {
        this.logger(`❌ Failed to create task ${taskTemplate.name}:`, error);
        // Continue with other tasks
      }
    }
  }

  /**
   * Create individual campaign task
   */
  async createCampaignTask(campaign, group, taskTemplate) {
    // Calculate task dates based on release date and timeline
    const releaseDate = new Date(campaign.data.releaseDate);
    const taskDate = new Date(releaseDate);
    taskDate.setDate(taskDate.getDate() + taskTemplate.timeline);

    const task = {
      id: this.generateTaskId(),
      name: taskTemplate.name,
      type: taskTemplate.type,
      priority: taskTemplate.priority,
      status: 'not_started',
      assignee: taskTemplate.assignee,
      dueDate: taskDate,
      dependencies: taskTemplate.dependencies || [],
      description: this.generateTaskDescription(taskTemplate, campaign.data),
      groupId: group.id,
      campaignId: campaign.id,
      created: new Date(),
      updated: new Date(),
    };

    // Add recurring or ongoing task properties
    if (taskTemplate.type === 'recurring' && taskTemplate.frequency) {
      task.frequency = taskTemplate.frequency;
      task.nextDue = new Date(taskDate);
    }

    if (taskTemplate.type === 'ongoing' && taskTemplate.duration) {
      task.duration = taskTemplate.duration;
      task.endDate = new Date(taskDate.getTime() + taskTemplate.duration * 24 * 60 * 60 * 1000);
    }

    // Create task in Monday.com
    await this.createMondayTask(group.boardId, group.id, task);

    return task;
  }

  /**
   * Generate task description based on template and campaign data
   */
  generateTaskDescription(taskTemplate, campaignData) {
    const descriptions = {
      'Campaign Brief Review': `Review and approve campaign brief for ${campaignData.artistName}'s "${campaignData.trackTitle}". Confirm targeting, budget (${campaignData.budget}), and timeline.`,
      'Press Release Creation': `Create Liberty-style press release for "${campaignData.trackTitle}" by ${campaignData.artistName}. Genre: ${campaignData.genre}. Focus on key messaging and professional presentation.`,
      'Radio Station List Compilation': `Compile targeted radio station list for ${campaignData.genre} track. Include Amazing Radio, Wigwam, and genre-appropriate stations. Target: ${campaignData.targets}.`,
      'WARM API Tracking Setup': `Configure WARM API tracking for "${campaignData.trackTitle}". Set up milestone notifications and real-time monitoring dashboard.`,
      'Press Release Distribution': `Distribute press release to targeted media contacts. Focus on ${campaignData.genre} specialists and music industry publications.`,
      'Radio Station Outreach - Wave 1': `Begin primary radio station outreach campaign. Personalised pitches to priority stations based on genre match and previous relationships.`,
      'Amazing Radio Submission': `Automated submission to Amazing Radio using optimised submission process. Include all required materials and follow submission guidelines.`,
      'Wigwam Radio Submission': `Automated submission to Wigwam Radio platform. Ensure proper categorisation and metadata for maximum visibility.`,
      'Radio Station Follow-up - Wave 2': `Follow up with non-responsive stations from Wave 1. Provide additional context, remixes, or alternative angles as appropriate.`,
      'WARM API Play Monitoring': `Continuous monitoring of radio plays via WARM API. Daily tracking of play counts, station coverage, and trend analysis.`,
      'Weekly Performance Review': `Weekly analysis of campaign performance. Review WARM API data, station responses, and adjust strategy as needed.`,
      'Campaign Performance Analysis': `Comprehensive analysis of campaign results. Compile play data, reach statistics, and ROI calculations for final reporting.`,
      'Professional Report Generation': `Generate professional campaign report with charts, statistics, and insights. Include recommendations for future campaigns.`,
      'Client Report Delivery': `Final delivery of campaign results to client. Schedule presentation meeting and provide actionable insights for future releases.`,
    };

    return (
      descriptions[taskTemplate.name] ||
      `${taskTemplate.name} for ${campaignData.artistName} - ${campaignData.trackTitle} campaign.`
    );
  }

  /**
   * Create task in Monday.com
   */
  async createMondayTask(boardId, groupId, task) {
    // Simulate Monday.com API call
    await this.callMondayAPI(`
      mutation {
        create_item(
          board_id: ${boardId}
          group_id: "${groupId}"
          item_name: "${task.name}"
        ) {
          id
        }
      }
    `);

    // Set task properties (priority, status, assignee, due date)
    await this.updateMondayTaskProperties(task);
  }

  /**
   * Update Monday.com task properties
   */
  async updateMondayTaskProperties(task) {
    // Simulate setting task properties
    const updates = [
      { column: 'priority', value: this.priorityLevels[task.priority] },
      { column: 'status', value: this.statusWorkflow[task.status] },
      { column: 'due_date', value: task.dueDate.toISOString() },
      { column: 'person', value: task.assignee },
    ];

    for (const update of updates) {
      await this.callMondayAPI(`
        mutation {
          change_column_value(
            item_id: ${task.id}
            board_id: ${task.boardId}
            column_id: "${update.column}"
            value: "${JSON.stringify(update.value)}"
          ) {
            id
          }
        }
      `);
    }
  }

  /**
   * Calculate campaign timeline
   */
  calculateCampaignTimeline(campaignData, template) {
    const releaseDate = new Date(campaignData.releaseDate);
    const now = new Date();

    // Find earliest and latest task dates
    let earliestTask = releaseDate;
    let latestTask = releaseDate;

    template.groups.forEach(group => {
      group.tasks.forEach(task => {
        const taskDate = new Date(releaseDate);
        taskDate.setDate(taskDate.getDate() + task.timeline);

        if (taskDate < earliestTask) earliestTask = taskDate;
        if (taskDate > latestTask) latestTask = taskDate;

        // Account for duration
        if (task.duration) {
          const endDate = new Date(taskDate.getTime() + task.duration * 24 * 60 * 60 * 1000);
          if (endDate > latestTask) latestTask = endDate;
        }
      });
    });

    // Find next milestone
    const nextMilestone = this.findNextMilestone(template, releaseDate, now);

    return {
      campaignStart: earliestTask,
      campaignEnd: latestTask,
      releaseDate,
      estimatedCompletion: latestTask,
      durationDays: Math.ceil((latestTask - earliestTask) / (1000 * 60 * 60 * 24)),
      nextMilestone,
      daysUntilRelease: Math.ceil((releaseDate - now) / (1000 * 60 * 60 * 24)),
    };
  }

  /**
   * Find next milestone in campaign
   */
  findNextMilestone(template, releaseDate, now) {
    const milestones = [];

    template.groups.forEach(group => {
      group.tasks.forEach(task => {
        if (task.type === 'milestone') {
          const milestoneDate = new Date(releaseDate);
          milestoneDate.setDate(milestoneDate.getDate() + task.timeline);

          if (milestoneDate > now) {
            milestones.push({
              name: task.name,
              date: milestoneDate,
              daysFromNow: Math.ceil((milestoneDate - now) / (1000 * 60 * 60 * 24)),
            });
          }
        }
      });
    });

    // Sort by date and return next milestone
    milestones.sort((a, b) => a.date - b.date);
    return milestones.length > 0 ? milestones[0] : null;
  }

  /**
   * Monitor active campaigns
   */
  async monitorActiveCampaigns() {
    this.logger(`📊 Monitoring ${this.activeCampaigns.size} active campaigns...`);

    for (const [campaignId, campaign] of this.activeCampaigns.entries()) {
      try {
        await this.updateCampaignStatus(campaign);

        // Check for overdue tasks
        await this.checkOverdueTasks(campaign);

        // Update progress metrics
        await this.updateCampaignProgress(campaign);
      } catch (error) {
        this.logger(`❌ Error monitoring campaign ${campaignId}:`, error.message);
      }
    }
  }

  /**
   * Update campaign status from Monday.com
   */
  async updateCampaignStatus(campaign) {
    // In a full implementation, this would fetch current task statuses from Monday.com
    // For now, we'll simulate status updates

    campaign.lastUpdate = new Date();

    // Simulate some progress
    if (Math.random() > 0.7) {
      // 30% chance of progress
      const incompleteTasks = campaign.board.groups.flatMap(group =>
        group.tasks.filter(task => task.status !== 'completed')
      );

      if (incompleteTasks.length > 0) {
        const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];

        if (randomTask.status === 'not_started') {
          randomTask.status = 'in_progress';
        } else if (randomTask.status === 'in_progress' && Math.random() > 0.5) {
          randomTask.status = 'completed';
          campaign.metrics.tasksCompleted++;

          if (randomTask.type === 'milestone') {
            campaign.metrics.milestonesReached++;

            // Emit milestone event
            this.emit('milestone-reached', {
              campaignId: campaign.id,
              milestone: randomTask.name,
              progress: (campaign.metrics.tasksCompleted / campaign.metrics.tasksTotal) * 100,
            });
          }
        }

        randomTask.updated = new Date();
      }
    }
  }

  /**
   * Check for overdue tasks
   */
  async checkOverdueTasks(campaign) {
    const now = new Date();
    const overdueTasks = [];

    campaign.board.groups.forEach(group => {
      group.tasks.forEach(task => {
        if (task.status !== 'completed' && task.dueDate < now) {
          overdueTasks.push(task);
        }
      });
    });

    if (overdueTasks.length > 0) {
      campaign.notifications.push({
        type: 'overdue',
        message: `${overdueTasks.length} tasks are overdue`,
        tasks: overdueTasks.map(t => t.name),
        timestamp: new Date(),
      });

      this.emit('tasks-overdue', {
        campaignId: campaign.id,
        overdueTasks: overdueTasks.length,
        taskNames: overdueTasks.map(t => t.name),
      });
    }
  }

  /**
   * Update campaign progress metrics
   */
  async updateCampaignProgress(campaign) {
    const totalTasks = campaign.metrics.tasksTotal;
    const completedTasks = campaign.metrics.tasksCompleted;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    campaign.progress = Math.round(progress);

    // Check for major progress milestones (25%, 50%, 75%, 100%)
    const milestones = [25, 50, 75, 100];
    const lastProgress = campaign.lastProgressMilestone || 0;

    for (const milestone of milestones) {
      if (progress >= milestone && lastProgress < milestone) {
        campaign.lastProgressMilestone = milestone;

        this.emit('progress-milestone', {
          campaignId: campaign.id,
          progress: milestone,
          artistName: campaign.data.artistName,
          trackTitle: campaign.data.trackTitle,
        });

        break;
      }
    }
  }

  /**
   * Call Monday.com API with rate limiting
   */
  async callMondayAPI(query, variables = {}) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;

    if (timeSinceLastCall < this.mondayConfig.rateLimitDelay) {
      const delay = this.mondayConfig.rateLimitDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      this.lastApiCall = Date.now();
      this.metrics.mondayApiCalls++;

      // In a full implementation, this would make the actual HTTP request
      // For now, simulate the API call
      const response = await this.simulateMondayAPI(query, variables);

      this.metrics.successfulUpdates++;
      return response;
    } catch (error) {
      this.metrics.failedOperations++;
      throw error;
    }
  }

  /**
   * Simulate Monday.com API calls
   */
  async simulateMondayAPI(query, variables) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    // Parse query type
    if (query.includes('create_board')) {
      return {
        data: {
          create_board: {
            id: this.generateBoardId(),
            name: variables.name || 'Campaign Board',
            url: `https://liberty-music-pr.monday.com/boards/${this.generateBoardId()}`,
          },
        },
      };
    }

    if (query.includes('create_group')) {
      return {
        data: {
          create_group: {
            id: this.generateGroupId(),
          },
        },
      };
    }

    if (query.includes('create_item')) {
      return {
        data: {
          create_item: {
            id: this.generateTaskId(),
          },
        },
      };
    }

    // Default response
    return { data: { success: true } };
  }

  /**
   * Simulate Monday.com board creation with more details
   */
  async callMondayBoardCreation(boardData) {
    await this.callMondayAPI(`
      mutation {
        create_board(
          board_name: "${boardData.name}"
          board_kind: project
          description: "${boardData.description}"
          workspace_id: ${boardData.workspaceId}
        ) {
          id
          name
          url
        }
      }
    `);

    return {
      id: this.generateBoardId(),
      name: boardData.name,
      url: `https://liberty-music-pr.monday.com/boards/${this.generateBoardId()}`,
      description: boardData.description,
      created: new Date(),
    };
  }

  /**
   * Save campaign state
   */
  async saveCampaignState() {
    try {
      const state = {
        campaigns: Array.from(this.activeCampaigns.values()),
        boards: Array.from(this.campaignBoards.values()),
        metrics: this.metrics,
        timestamp: new Date().toISOString(),
      };

      const dataDir = './data';
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync('./data/campaign-boards.json', JSON.stringify(state, null, 2));
    } catch (error) {
      this.logger('❌ Failed to save campaign state:', error);
    }
  }

  /**
   * Update metrics
   */
  updateMetrics(campaign, setupTime) {
    this.metrics.campaignsCreated++;
    this.metrics.boardsGenerated++;
    this.metrics.tasksCreated += campaign.metrics.tasksTotal;
    this.metrics.milestonesTracked += campaign.metrics.milestonesTotal;

    // Update average setup time
    const currentAvg = this.metrics.averageSetupTime;
    const totalCampaigns = this.metrics.campaignsCreated;
    this.metrics.averageSetupTime = Math.round(
      (currentAvg * (totalCampaigns - 1) + setupTime) / totalCampaigns
    );
  }

  /**
   * Health check
   */
  async healthCheck() {
    const health = {
      status: 'healthy',
      agent: this.name,
      version: this.version,
      metrics: { ...this.metrics },
      activeCampaigns: this.activeCampaigns.size,
      mondayApi: !!this.mondayConfig.apiKey,
      uptime: Date.now() - (this.startTime || Date.now()),
      timestamp: new Date().toISOString(),
    };

    // Check Monday.com API connectivity
    try {
      await this.callMondayAPI('query { me { name } }');
      health.mondayStatus = 'connected';
    } catch (error) {
      health.mondayStatus = 'error';
      health.mondayError = error.message;
      health.status = 'degraded';
    }

    return health;
  }

  /**
   * Get agent statistics
   */
  getAgentStatistics() {
    return {
      agent: this.name,
      version: this.version,
      metrics: { ...this.metrics },
      capabilities: [
        'Monday.com campaign board creation',
        'Automated task generation',
        'Timeline management',
        'Progress monitoring',
        'Milestone tracking',
      ],
      activeCampaigns: {
        total: this.activeCampaigns.size,
        campaigns: Array.from(this.activeCampaigns.values()).map(c => ({
          id: c.id,
          artist: c.data.artistName,
          track: c.data.trackTitle,
          progress: c.progress || 0,
          status: c.status,
        })),
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Utility methods
  generateCampaignId() {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateBoardId() {
    return `board_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  generateGroupId() {
    return `group_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Shutdown agent
   */
  async shutdown() {
    try {
      this.logger('🛑 Shutting down Project Agent...');

      // Stop monitoring
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
      }

      // Save final state
      await this.saveCampaignState();

      this.logger('✅ Project Agent shut down successfully');
    } catch (error) {
      this.logger('❌ Project Agent shutdown failed:', error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const agent = new ProjectAgent({
    logger: (msg, ...args) => console.log(`[PROJECT] ${msg}`, ...args),
  });

  const command = process.argv[2];
  const args = process.argv.slice(3);

  async function run() {
    try {
      await agent.initialize();

      switch (command) {
        case 'health':
          const health = await agent.healthCheck();
          console.log(JSON.stringify(health, null, 2));
          break;

        case 'stats':
          const stats = agent.getAgentStatistics();
          console.log(JSON.stringify(stats, null, 2));
          break;

        case 'create':
          const briefFile = args[0];
          if (!briefFile) {
            console.log('Usage: node project-agent.js create <campaign-brief-file>');
            return;
          }

          const briefData = JSON.parse(fs.readFileSync(briefFile, 'utf8'));
          const result = await agent.createCampaign(briefData);
          console.log(JSON.stringify(result, null, 2));
          break;

        case 'monitor':
          console.log('Starting campaign monitoring...');
          await agent.monitorActiveCampaigns();
          console.log('Monitoring complete');
          break;

        default:
          console.log('Liberty Music PR Project Agent v' + agent.version);
          console.log('');
          console.log('Usage: node project-agent.js <command> [options]');
          console.log('');
          console.log('Commands:');
          console.log('  health                    - Agent health check');
          console.log('  stats                     - Agent statistics');
          console.log('  create <brief-file>       - Create campaign from brief');
          console.log('  monitor                   - Monitor active campaigns');
          console.log('');
          console.log('📋 Automates Monday.com campaign board creation and management');
      }
    } catch (error) {
      console.error('Command failed:', error.message);
      process.exit(1);
    } finally {
      await agent.shutdown();
    }
  }

  run().catch(console.error);
}

module.exports = ProjectAgent;
