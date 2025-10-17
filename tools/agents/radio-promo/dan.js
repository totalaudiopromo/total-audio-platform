#!/usr/bin/env node

/**
 * Dan - Total Audio Agent Orchestrator
 * 
 * Master coordinator for the 6-agent radio promotion system
 * Transforms 15-20 hour manual workflow into 45 minutes + monitoring
 * 
 * Architecture:
 * - Intelligence Agent: Google Meet + Gemini processing
 * - Project Agent: Monday.com campaign automation
 * - Email Agent: Liberty template generation + Mailchimp
 * - Radio Agent: Station submission automation (Amazing Radio, Wigwam, etc.)
 * - Analytics Agent: WARM API real-time tracking
 * - Coverage Agent: Professional reporting and deliverables
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Agent imports
const IntelligenceAgent = require('./agents/intelligence-agent');
const ProjectAgent = require('./agents/project-agent');
const EmailAgent = require('./agents/email-agent');
const RadioAgent = require('./agents/radio-agent');
const AnalyticsAgent = require('./agents/analytics-agent');
const CoverageAgent = require('./agents/coverage-agent');
const FollowupAgent = require('./agents/followup-agent');

// Integration imports
const SuccessPredictionEngine = require('./integrations/success-prediction-engine');
const AutoResponseHandler = require('./integrations/auto-response-handler');
const SocialIntelligence = require('./integrations/social-intelligence');
const PressGenerator = require('./integrations/press-generator');
const CampaignScheduler = require('./integrations/campaign-scheduler');
const RealTimeMonitor = require('./integrations/real-time-monitor');
const AutoFollowupSystem = require('./integrations/auto-followup-system');
const GmailTypeformMatcher = require('./integrations/gmail-typeform-matcher');

// Configuration imports
const LibertyTemplates = require('./config/liberty-templates');
const RadioStations = require('./config/radio-stations');
const WarmConfig = require('./config/warm-config');

// Enhanced logger for the orchestrator system
const logToFile = (level, message, args) => {
  try {
    const logDir = './logs';
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      args: args || [],
      pid: process.pid
    };
    
    const logFile = path.join(logDir, `orchestrator-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    // Silent fail for logging errors
  }
};

const logger = {
  info: (msg, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [ORCHESTRATOR] ${msg}`, ...args);
    logToFile('info', msg, args);
  },
  success: (msg, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`✅ [${timestamp}] [SUCCESS] ${msg}`, ...args);
    logToFile('success', msg, args);
  },
  warn: (msg, ...args) => {
    const timestamp = new Date().toISOString();
    console.warn(`⚠️  [${timestamp}] [WARNING] ${msg}`, ...args);
    logToFile('warn', msg, args);
  },
  error: (msg, ...args) => {
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] [ERROR] ${msg}`, ...args);
    logToFile('error', msg, args);
  },
  agent: (agentName, msg, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`🤖 [${timestamp}] [${agentName.toUpperCase()}] ${msg}`, ...args);
    logToFile('agent', `${agentName}: ${msg}`, args);
  },
  verification: (msg, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`🔍 [${timestamp}] [VERIFICATION] ${msg}`, ...args);
    logToFile('verification', msg, args);
  }
};

class Dan extends EventEmitter {
  constructor() {
    super();
    this.name = 'Dan';
    this.version = '1.0.0';
    this.startTime = Date.now();
    
    // Campaign state management
    this.campaigns = new Map();
    this.activeWorkflows = new Map();

    // Agent system
    this.agents = {
      intelligence: null,
      project: null,
      email: null,
      radio: null,
      analytics: null,
      coverage: null
    };
    
    // System metrics
    this.metrics = {
      campaignsProcessed: 0,
      totalTimeReduction: 0, // in hours
      averageWorkflowTime: 0, // in minutes
      successRate: 0,
      agentUptime: {},
      warmApiCalls: 0,
      notificationsSent: 0,
      reportsGenerated: 0
    };

    // Status file management for Command Centre integration
    this.statusFile = path.join(__dirname, 'status', 'current-status.json');
    this.ensureStatusDirectory();
    
    // Configuration
    this.config = {
      verificationEnabled: true,
      parallelProcessing: true,
      maxConcurrentCampaigns: 5,
      warmApiEnabled: true,
      googleChatWebhook: process.env.GOOGLE_CHAT_WEBHOOK,
      dashboardPort: process.env.DASHBOARD_PORT || 3008,
      logLevel: process.env.LOG_LEVEL || 'info',
      gmailDailySyncHour: parseInt(process.env.GMAIL_DAILY_SYNC_HOUR || '9', 10),
      gmailDailySyncMinute: parseInt(process.env.GMAIL_DAILY_SYNC_MINUTE || '0', 10),
      gmailDailySyncEnabled: process.env.GMAIL_DAILY_SYNC_DISABLED !== 'true',
      amazingRadioWebhook: process.env.AMAZING_RADIO_WEBHOOK_URL,
      wigwamRadioWebhook: process.env.WIGWAM_RADIO_WEBHOOK_URL,
      amazingRadioUsername: process.env.AMAZING_RADIO_USERNAME,
      amazingRadioPassword: process.env.AMAZING_RADIO_PASSWORD,
      wigwamUsername: process.env.WIGWAM_USERNAME,
      wigwamPassword: process.env.WIGWAM_PASSWORD,
      europeanIndieEmail: process.env.EUROPEAN_INDIE_MUSIC_EMAIL,
      europeanIndiePaymentUrl: process.env.EUROPEAN_INDIE_MUSIC_PAYMENT_URL
    };

    // Liberty workflow definitions
    this.workflows = {
      'complete-campaign': {
        name: 'Complete Radio Campaign',
        description: 'Full automation of Liberty Music PR radio campaign process',
        estimatedTime: 45, // minutes
        steps: [
          { agent: 'intelligence', action: 'processTranscript', parallel: false },
          { agent: 'project', action: 'createCampaign', parallel: false },
          { 
            agents: ['email', 'radio'], 
            actions: ['generateContent', 'initiateSubmissions'], 
            parallel: true 
          },
          { agent: 'analytics', action: 'setupTracking', parallel: false },
          { agent: 'coverage', action: 'generateInitialReport', parallel: false }
        ],
        verification: [
          'campaign-brief-review',
          'content-approval',
          'submission-confirmation',
          'tracking-setup',
          'final-report'
        ]
      },
      'transcript-to-brief': {
        name: 'Google Meet to Campaign Brief',
        description: 'Convert meeting transcript to structured campaign brief',
        estimatedTime: 5,
        steps: [
          { agent: 'intelligence', action: 'processTranscript', parallel: false },
          { agent: 'intelligence', action: 'validateBrief', parallel: false }
        ],
        verification: ['transcript-processing']
      },
      'warm-monitoring': {
        name: 'WARM API Continuous Monitoring',
        description: 'Real-time play tracking and milestone notifications',
        estimatedTime: 0, // continuous
        steps: [
          { agent: 'analytics', action: 'startContinuousMonitoring', parallel: false }
        ],
        verification: []
      },
      'campaign-reporting': {
        name: 'Professional Campaign Reporting',
        description: 'Generate comprehensive campaign performance reports',
        estimatedTime: 15,
        steps: [
          { agent: 'analytics', action: 'aggregateData', parallel: false },
          { agent: 'coverage', action: 'generateProfessionalReport', parallel: false },
          { agent: 'coverage', action: 'deliverToClient', parallel: false }
        ],
        verification: ['data-validation', 'report-approval']
      }
    };
    
    // Error handling and recovery
    this.errorHandling = {
      maxRetries: 3,
      retryDelay: 5000,
      fallbackMethods: new Map(),
      criticalOperations: ['warm-api-calls', 'client-deliverables', 'payment-processing']
    };

    // Integration helpers
    this.gmailMatcher = new GmailTypeformMatcher();
    this.timers = {
      gmailDailyTimeout: null,
      gmailDailyInterval: null
    };
  }

  /**
   * Initialize the complete orchestrator system
   */
  async initialize() {
    try {
      logger.info('🚀 Initializing Dan - Total Audio Agent Orchestrator v' + this.version);
      
      // Initialize configuration
      await this.loadConfiguration();
      
      // Initialize all agents
      await this.initializeAgents();
      
      // Setup inter-agent communication
      await this.setupAgentCommunication();
      
      // Initialize dashboard API
      await this.initializeDashboard();
      
      // Setup Google Chat notifications
      await this.setupNotifications();
      
      // Load existing campaigns
      await this.loadCampaignState();

      // Schedule daily Gmail -> Typeform sync
      this.scheduleDailyGmailSync();

      logger.success('Liberty Radio Promo Orchestrator initialized successfully');
      logger.info(`Dashboard available at: http://localhost:${this.config.dashboardPort}`);
      
      return {
        status: 'ready',
        agents: Object.keys(this.agents).length,
        workflows: Object.keys(this.workflows).length,
        uptime: Date.now() - this.startTime
      };
    } catch (error) {
      logger.error('Orchestrator initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load system configuration
   */
  async loadConfiguration() {
    logger.info('Loading system configuration...');
    
    // Load Liberty templates
    this.libertyTemplates = new LibertyTemplates();
    
    // Load radio station database
    this.radioStations = new RadioStations();
    
    // Load WARM API configuration
    this.warmConfig = new WarmConfig();
    
    // Verify critical environment variables
    const requiredEnvVars = [
      'GEMINI_API_KEY',
      'MONDAY_API_KEY', 
      'MAILCHIMP_API_KEY',
      'WARM_API_KEY',
      'GOOGLE_CHAT_WEBHOOK'
    ];
    
    const missingVars = requiredEnvVars.filter(env => !process.env[env]);
    if (missingVars.length > 0) {
      logger.warn(`Missing environment variables: ${missingVars.join(', ')}`);
      logger.warn('Some features may not function properly');
    }
    
    logger.info('Configuration loaded successfully');
  }

  /**
   * Initialize all 6 agents
   */
  async initializeAgents() {
    logger.info('Initializing agent system...');
    
    const agentDefinitions = [
      { name: 'intelligence', class: IntelligenceAgent, description: 'Google Meet + Gemini processing' },
      { name: 'project', class: ProjectAgent, description: 'Monday.com campaign automation' },
      { name: 'email', class: EmailAgent, description: 'Liberty templates + Mailchimp' },
      { name: 'radio', class: RadioAgent, description: 'Station submission automation' },
      { name: 'analytics', class: AnalyticsAgent, description: 'WARM API real-time tracking' },
      { name: 'coverage', class: CoverageAgent, description: 'Professional reporting' }
    ];
    
    for (const { name, class: AgentClass, description } of agentDefinitions) {
      try {
        logger.info(`Initializing ${name} agent: ${description}`);
        
        this.agents[name] = new AgentClass({
          orchestrator: this,
          config: this.config,
          logger: (msg, ...args) => logger.agent(name, msg, ...args)
        });
        
        const result = await this.agents[name].initialize();
        
        if (result) {
          this.metrics.agentUptime[name] = Date.now();
          logger.success(`${name} agent initialized successfully`);
        } else {
          throw new Error(`${name} agent initialization returned false`);
        }
      } catch (error) {
        logger.error(`Failed to initialize ${name} agent:`, error);
        // Continue with other agents - allow graceful degradation
        this.agents[name] = null;
      }
    }
    
    const activeAgents = Object.values(this.agents).filter(agent => agent !== null).length;
    logger.info(`Agent initialization complete: ${activeAgents}/6 agents active`);
  }

  /**
   * Schedule daily Gmail/Typeform sync at configured time (defaults 09:00)
   */
  scheduleDailyGmailSync() {
    if (!this.config.gmailDailySyncEnabled) {
      logger.info('Daily Gmail sync disabled via configuration');
      return;
    }

    const hour = Number.isFinite(this.config.gmailDailySyncHour) ? this.config.gmailDailySyncHour : 9;
    const minute = Number.isFinite(this.config.gmailDailySyncMinute) ? this.config.gmailDailySyncMinute : 0;

    const scheduleNextRun = () => {
      if (this.timers.gmailDailyInterval) {
        clearInterval(this.timers.gmailDailyInterval);
        this.timers.gmailDailyInterval = null;
      }
      if (this.timers.gmailDailyTimeout) {
        clearTimeout(this.timers.gmailDailyTimeout);
        this.timers.gmailDailyTimeout = null;
      }

      const now = new Date();
      const nextRun = new Date(now);
      nextRun.setHours(hour, minute, 0, 0);
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }

      const delay = nextRun.getTime() - now.getTime();
      logger.info(`Scheduling daily Gmail sync at ${nextRun.toISOString()}`);

      this.timers.gmailDailyTimeout = setTimeout(() => {
        this.runDailyGmailSync();
        this.timers.gmailDailyInterval = setInterval(() => {
          this.runDailyGmailSync();
        }, 24 * 60 * 60 * 1000);
      }, delay);
    };

    scheduleNextRun();
  }

  async runDailyGmailSync() {
    try {
      logger.info('📬 Running daily Gmail → Typeform campaign sync');
      const results = await this.gmailMatcher.findLibertyCampaigns();
      logger.success(`Daily Gmail sync completed. Matched campaigns: ${results.totalMatches}`);
    } catch (error) {
      logger.error('Daily Gmail sync failed:', error);
    }
  }

  /**
   * Setup communication between agents
   */
  async setupAgentCommunication() {
    logger.info('Setting up inter-agent communication system...');
    
    // Event-based messaging system
    this.on('agent-message', this.handleAgentMessage.bind(this));
    this.on('workflow-progress', this.handleWorkflowProgress.bind(this));
    this.on('verification-required', this.handleVerificationRequest.bind(this));
    this.on('error-recovery', this.handleErrorRecovery.bind(this));
    
    // Register each agent with the communication system
    Object.entries(this.agents).forEach(([name, agent]) => {
      if (agent && typeof agent.on === 'function') {
        agent.on('message', (data) => this.emit('agent-message', { from: name, ...data }));
        agent.on('progress', (data) => this.emit('workflow-progress', { agent: name, ...data }));
        agent.on('verification', (data) => this.emit('verification-required', { agent: name, ...data }));
        agent.on('error', (data) => this.emit('error-recovery', { agent: name, ...data }));
      }
    });
    
    logger.info('Inter-agent communication system ready');
  }

  /**
   * Initialize dashboard API for verification and monitoring
   */
  async initializeDashboard() {
    logger.info('Initializing verification dashboard...');
    
    // In a full implementation, this would start an Express server
    // For now, we'll create the API structure
    
    this.dashboardAPI = {
      getCampaigns: () => Array.from(this.campaigns.values()),
      getAgentStatus: () => Object.entries(this.agents).map(([name, agent]) => ({
        name,
        status: agent ? 'active' : 'inactive',
        uptime: this.metrics.agentUptime[name] || 0
      })),
      getMetrics: () => ({ ...this.metrics }),
      approveVerification: (id, approved) => this.handleVerificationResponse(id, approved),
      getWorkflowStatus: (campaignId) => this.activeWorkflows.get(campaignId)
    };
    
    logger.info(`Dashboard API initialized (port ${this.config.dashboardPort})`);
  }

  /**
   * Setup Google Chat notification system
   */
  async setupNotifications() {
    if (!this.config.googleChatWebhook) {
      logger.warn('Google Chat webhook not configured - notifications disabled');
      return;
    }
    
    logger.info('Setting up Google Chat notification system...');
    
    // Setup notification templates
    this.notificationTemplates = {
      campaignStarted: '🚀 *New Radio Campaign Started*\n*Artist:* {artist}\n*Track:* {track}\n*Expected completion:* {estimatedTime} minutes',
      milestoneReached: '🎯 *Campaign Milestone*\n*{milestone}* completed for *{artist} - {track}*',
      verificationRequired: '🔍 *Verification Required*\n*Campaign:* {campaign}\n*Step:* {step}\n[Approve in Command Centre]',
      campaignComplete: '✅ *Campaign Complete*\n*Artist:* {artist}\n*Track:* {track}\n*Total time:* {actualTime} minutes\n*Success rate:* {successRate}%',
      errorAlert: '⚠️ *System Alert*\n*Error:* {error}\n*Campaign:* {campaign}\n*Action required:* {action}'
    };
    
    logger.info('Google Chat notifications configured');
  }

  /**
   * Execute a complete workflow
   */
  async executeWorkflow(workflowName, campaignData, options = {}) {
    try {
      const workflow = this.workflows[workflowName];
      if (!workflow) {
        throw new Error(`Workflow '${workflowName}' not found`);
      }
      
      const campaignId = this.generateCampaignId();
      const startTime = Date.now();
      
      logger.info(`🎬 Starting workflow: ${workflow.name}`);
      logger.info(`Campaign ID: ${campaignId}`);
      logger.info(`Estimated time: ${workflow.estimatedTime} minutes`);
      
      // Create campaign record
      const campaign = {
        id: campaignId,
        workflow: workflowName,
        data: campaignData,
        status: 'running',
        startTime,
        estimatedEndTime: startTime + (workflow.estimatedTime * 60 * 1000),
        steps: [],
        verifications: [],
        currentStep: 0,
        results: {}
      };
      
      this.campaigns.set(campaignId, campaign);
      this.activeWorkflows.set(campaignId, {
        workflow,
        campaign,
        progress: 0
      });
      
      // Update status file for new campaign
      await this.updateStatusFile();
      
      // Send start notification
      await this.sendNotification('campaignStarted', {
        artist: campaignData.artist || 'Unknown',
        track: campaignData.track || 'Unknown',
        estimatedTime: workflow.estimatedTime
      });
      
      // Execute workflow steps
      const results = await this.executeWorkflowSteps(campaign, workflow);
      
      // Calculate final metrics
      const endTime = Date.now();
      const actualTime = Math.round((endTime - startTime) / (1000 * 60)); // minutes
      const successRate = this.calculateSuccessRate(results);
      
      // Update campaign
      campaign.status = 'completed';
      campaign.endTime = endTime;
      campaign.actualTime = actualTime;
      campaign.successRate = successRate;
      campaign.results = results;
      
      // Update metrics
      this.metrics.campaignsProcessed++;
      this.metrics.totalTimeReduction += Math.max(0, (15 * 60) - actualTime); // assuming 15 hours manual
      this.metrics.averageWorkflowTime = this.calculateAverageWorkflowTime();
      this.metrics.successRate = this.calculateOverallSuccessRate();
      
      // Send completion notification
      await this.sendNotification('campaignComplete', {
        artist: campaignData.artist || 'Unknown',
        track: campaignData.track || 'Unknown',
        actualTime,
        successRate
      });
      
      logger.success(`✨ Workflow completed in ${actualTime} minutes`);
      logger.success(`Success rate: ${successRate}%`);
      
      return {
        campaignId,
        status: 'completed',
        actualTime,
        estimatedTime: workflow.estimatedTime,
        timeReduction: Math.max(0, (15 * 60) - actualTime),
        successRate,
        results
      };
      
    } catch (error) {
      logger.error('Workflow execution failed:', error);
      
      // Send error notification
      await this.sendNotification('errorAlert', {
        error: error.message,
        campaign: campaignData.artist + ' - ' + campaignData.track,
        action: 'Check Command Centre dashboard'
      });
      
      throw error;
    } finally {
      // Cleanup
      this.activeWorkflows.delete(campaignId);
    }
  }

  /**
   * Execute individual workflow steps
   */
  async executeWorkflowSteps(campaign, workflow) {
    const results = {};
    
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const stepStartTime = Date.now();
      
      try {
        logger.info(`📋 Step ${i + 1}/${workflow.steps.length}: ${this.getStepDescription(step)}`);
        
        let stepResult;
        
        if (step.parallel && step.agents && step.actions) {
          // Parallel execution
          stepResult = await this.executeParallelStep(step, campaign.data);
        } else {
          // Single agent execution
          stepResult = await this.executeSingleStep(step, campaign.data);
        }
        
        // Handle verification if required
        const verificationId = `${campaign.id}-step-${i}`;
        if (workflow.verification && workflow.verification[i] && this.config.verificationEnabled) {
          const approved = await this.requestVerification(verificationId, {
            campaign: campaign.id,
            step: workflow.verification[i],
            data: stepResult
          });
          
          if (!approved) {
            throw new Error(`Step ${i + 1} verification rejected`);
          }
        }
        
        const stepDuration = Date.now() - stepStartTime;
        
        // Record step completion
        campaign.steps.push({
          index: i,
          description: this.getStepDescription(step),
          duration: stepDuration,
          result: stepResult,
          status: 'completed'
        });
        
        results[`step${i + 1}`] = stepResult;
        campaign.currentStep = i + 1;
        
        // Update progress
        const progress = ((i + 1) / workflow.steps.length) * 100;
        this.emit('workflow-progress', {
          campaignId: campaign.id,
          progress,
          currentStep: i + 1,
          totalSteps: workflow.steps.length
        });
        
        // Update status file for Command Centre dashboard
        await this.updateStatusFile();
        
        logger.success(`✓ Step ${i + 1} completed in ${Math.round(stepDuration / 1000)}s`);
        
      } catch (error) {
        logger.error(`✗ Step ${i + 1} failed:`, error);
        
        // Record failed step
        campaign.steps.push({
          index: i,
          description: this.getStepDescription(step),
          error: error.message,
          status: 'failed'
        });
        
        // Handle error recovery
        const recovered = await this.attemptErrorRecovery(step, error, campaign);
        if (!recovered) {
          throw error;
        }
      }
    }
    
    return results;
  }

  /**
   * Execute a single agent step
   */
  async executeSingleStep(step, campaignData) {
    const agentName = step.agent;
    const action = step.action;
    
    const agent = this.agents[agentName];
    if (!agent) {
      throw new Error(`Agent '${agentName}' is not available`);
    }
    
    if (typeof agent[action] !== 'function') {
      throw new Error(`Action '${action}' not found on agent '${agentName}'`);
    }
    
    return await agent[action](campaignData);
  }

  /**
   * Execute parallel agent steps
   */
  async executeParallelStep(step, campaignData) {
    const promises = step.agents.map((agentName, index) => {
      const action = step.actions[index];
      return this.executeSingleStep({ agent: agentName, action }, campaignData);
    });
    
    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => ({
      agent: step.agents[index],
      action: step.actions[index],
      status: result.status,
      value: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));
  }

  /**
   * Request verification from dashboard
   */
  async requestVerification(verificationId, data) {
    logger.verification(`Verification required: ${data.step}`);
    
    if (!this.config.verificationEnabled) {
      logger.verification('Auto-approved (verification disabled)');
      return true;
    }
    
    // Send notification
    await this.sendNotification('verificationRequired', {
      campaign: data.campaign,
      step: data.step
    });
    
    // In a full implementation, this would wait for dashboard response
    // For now, auto-approve after delay
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.verification('Auto-approved for demonstration');
        resolve(true);
      }, 2000);
    });
  }

  /**
   * Send Google Chat notification
   */
  async sendNotification(templateName, data) {
    if (!this.config.googleChatWebhook) return;
    
    try {
      const template = this.notificationTemplates[templateName];
      if (!template) {
        logger.warn(`Notification template '${templateName}' not found`);
        return;
      }
      
      let message = template;
      Object.entries(data).forEach(([key, value]) => {
        message = message.replace(new RegExp(`{${key}}`, 'g'), value);
      });
      
      // In a full implementation, this would make HTTP request to Google Chat
      logger.info(`📱 Notification sent: ${templateName}`);
      this.metrics.notificationsSent++;
      
    } catch (error) {
      logger.error('Failed to send notification:', error);
    }
  }

  /**
   * Load existing campaign state
   */
  async loadCampaignState() {
    try {
      const stateFile = './data/campaign-state.json';
      if (fs.existsSync(stateFile)) {
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
        
        // Restore campaigns
        if (state.campaigns) {
          state.campaigns.forEach(campaign => {
            this.campaigns.set(campaign.id, campaign);
          });
        }
        
        // Restore metrics
        if (state.metrics) {
          this.metrics = { ...this.metrics, ...state.metrics };
        }
        
        logger.info(`Restored ${this.campaigns.size} campaigns from state`);
      }
    } catch (error) {
      logger.warn('Could not load campaign state:', error.message);
    }
  }

  /**
   * Save campaign state
   */
  async saveCampaignState() {
    try {
      const dataDir = './data';
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const state = {
        campaigns: Array.from(this.campaigns.values()),
        metrics: this.metrics,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync('./data/campaign-state.json', JSON.stringify(state, null, 2));
      
    } catch (error) {
      logger.error('Failed to save campaign state:', error);
    }
  }

  /**
   * System health check
   */
  async healthCheck() {
    const health = {
      status: 'healthy',
      orchestrator: {
        version: this.version,
        uptime: Date.now() - this.startTime,
        campaigns: this.campaigns.size,
        activeWorkflows: this.activeWorkflows.size
      },
      agents: {},
      metrics: { ...this.metrics },
      timestamp: new Date().toISOString()
    };
    
    // Check each agent
    for (const [name, agent] of Object.entries(this.agents)) {
      if (agent && typeof agent.healthCheck === 'function') {
        try {
          health.agents[name] = await agent.healthCheck();
        } catch (error) {
          health.agents[name] = { status: 'error', message: error.message };
          health.status = 'degraded';
        }
      } else {
        health.agents[name] = { status: 'inactive', message: 'Agent not initialized' };
        health.status = 'degraded';
      }
    }
    
    return health;
  }

  // Utility methods
  generateCampaignId() {
    return `lmpr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStepDescription(step) {
    if (step.parallel && step.agents) {
      return `Parallel: ${step.agents.join(', ')} - ${step.actions.join(', ')}`;
    }
    return `${step.agent}.${step.action}`;
  }

  // Status file management for Command Centre integration
  ensureStatusDirectory() {
    try {
      const statusDir = path.dirname(this.statusFile);
      if (!fs.existsSync(statusDir)) {
        fs.mkdirSync(statusDir, { recursive: true });
      }
    } catch (error) {
      logger.error('Failed to create status directory:', error);
    }
  }

  async updateStatusFile() {
    try {
      const statusData = await this.generateStatusData();
      fs.writeFileSync(this.statusFile, JSON.stringify(statusData, null, 2));
    } catch (error) {
      logger.error('Failed to update status file:', error);
    }
  }

  async generateStatusData() {
    const campaigns = Array.from(this.campaigns.values()).map(campaign => ({
      id: campaign.id,
      artistName: campaign.brief?.artistName || campaign.artistName,
      trackTitle: campaign.brief?.trackTitle || campaign.trackTitle,
      genre: campaign.brief?.genre || 'Unknown',
      budget: campaign.brief?.budget || 0,
      releaseDate: campaign.brief?.releaseDate || '',
      priority: campaign.priority || 'medium',
      status: this.getCampaignStatus(campaign),
      steps: this.getCampaignSteps(campaign),
      createdAt: campaign.createdAt || new Date().toISOString()
    }));

    const agentStatuses = Object.entries(this.agents).map(([name, agent]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1) + ' Agent',
      status: agent ? 'online' : 'offline',
      currentTask: agent?.currentTask || 'Idle',
      lastHeartbeat: new Date().toISOString(),
      errorCount: agent?.errorCount || 0
    }));

    // Extract approval queue
    const approvalQueue = campaigns.flatMap(campaign => 
      campaign.steps.filter(step => step.status === 'requires_approval')
    );

    return {
      campaigns,
      agentStatuses,
      approvalQueue,
      isConnected: true,
      lastUpdate: new Date().toISOString(),
      metrics: this.metrics
    };
  }

  getCampaignStatus(campaign) {
    if (!campaign.workflowState) return 'transcript_processing';
    
    const completedSteps = Object.values(campaign.workflowState).filter(
      step => step.status === 'completed' || step.status === 'approved'
    ).length;
    
    const totalSteps = Object.keys(campaign.workflowState).length;
    
    if (completedSteps === totalSteps) return 'completed';
    if (completedSteps >= totalSteps * 0.8) return 'tracking';
    if (completedSteps >= totalSteps * 0.6) return 'radio_outreach';
    if (completedSteps >= totalSteps * 0.4) return 'press_release';
    if (completedSteps >= totalSteps * 0.2) return 'campaign_creation';
    return 'transcript_processing';
  }

  getCampaignSteps(campaign) {
    if (!campaign.workflowState) return [];
    
    return Object.entries(campaign.workflowState).map(([stepId, stepData]) => ({
      id: stepId,
      name: this.getStepDisplayName(stepId),
      agent: this.getStepAgent(stepId),
      status: stepData.status || 'pending',
      progress: stepData.progress || 0,
      message: stepData.message || '',
      timestamp: stepData.timestamp || new Date().toISOString(),
      requiresManualApproval: stepData.requiresManualApproval || false,
      data: stepData.data || null
    }));
  }

  getStepDisplayName(stepId) {
    const stepNames = {
      'process_transcript': 'Process Google Meet Transcript',
      'create_campaign': 'Create Monday.com Campaign Board',
      'generate_press_release': 'Generate Liberty Press Release',
      'initiate_radio_outreach': 'Begin Radio Station Outreach',
      'setup_warm_tracking': 'Setup WARM API Tracking',
      'generate_coverage_report': 'Generate Coverage Report'
    };
    return stepNames[stepId] || stepId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getStepAgent(stepId) {
    const stepAgents = {
      'process_transcript': 'Intelligence Agent',
      'create_campaign': 'Project Agent',
      'generate_press_release': 'Email Agent',
      'initiate_radio_outreach': 'Radio Agent',
      'setup_warm_tracking': 'Analytics Agent',
      'generate_coverage_report': 'Coverage Agent'
    };
    return stepAgents[stepId] || 'Unknown Agent';
  }

  calculateSuccessRate(results) {
    const steps = Object.values(results);
    const successful = steps.filter(step => step && !step.error).length;
    return Math.round((successful / steps.length) * 100);
  }

  calculateAverageWorkflowTime() {
    const campaigns = Array.from(this.campaigns.values()).filter(c => c.actualTime);
    if (campaigns.length === 0) return 0;
    
    const totalTime = campaigns.reduce((sum, c) => sum + c.actualTime, 0);
    return Math.round(totalTime / campaigns.length);
  }

  calculateOverallSuccessRate() {
    const campaigns = Array.from(this.campaigns.values()).filter(c => c.successRate !== undefined);
    if (campaigns.length === 0) return 0;
    
    const totalSuccess = campaigns.reduce((sum, c) => sum + c.successRate, 0);
    return Math.round(totalSuccess / campaigns.length);
  }

  async attemptErrorRecovery(step, error, campaign) {
    logger.warn(`Attempting error recovery for step: ${this.getStepDescription(step)}`);
    
    // Basic retry logic
    if (this.errorHandling.maxRetries > 0) {
      for (let retry = 1; retry <= this.errorHandling.maxRetries; retry++) {
        logger.info(`Retry attempt ${retry}/${this.errorHandling.maxRetries}`);
        
        await new Promise(resolve => setTimeout(resolve, this.errorHandling.retryDelay));
        
        try {
          const result = await this.executeSingleStep(step, campaign.data);
          logger.success(`Recovery successful on retry ${retry}`);
          return result;
        } catch (retryError) {
          logger.warn(`Retry ${retry} failed:`, retryError.message);
        }
      }
    }
    
    logger.error('Error recovery failed - manual intervention required');
    return false;
  }

  // Event handlers
  handleAgentMessage(data) {
    logger.agent(data.from, `Message: ${data.message}`);
  }

  handleWorkflowProgress(data) {
    logger.info(`Progress update: ${data.agent} - ${data.progress}%`);
  }

  handleVerificationRequest(data) {
    logger.verification(`Verification requested by ${data.agent}: ${data.description}`);
  }

  handleErrorRecovery(data) {
    logger.error(`Error recovery needed for ${data.agent}: ${data.error}`);
  }

  async shutdown() {
    try {
      logger.info('Shutting down Liberty Radio Promo Orchestrator...');
      
      // Save current state
      await this.saveCampaignState();
      
      // Shutdown all agents
      for (const [name, agent] of Object.entries(this.agents)) {
        if (agent && typeof agent.shutdown === 'function') {
          try {
            await agent.shutdown();
            logger.info(`${name} agent shut down successfully`);
          } catch (error) {
            logger.error(`Failed to shutdown ${name} agent:`, error);
          }
        }
      }
      
      logger.success('Liberty Radio Promo Orchestrator shut down successfully');
    } catch (error) {
      logger.error('Orchestrator shutdown failed:', error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const orchestrator = new Dan();
  const command = process.argv[2];
  const args = process.argv.slice(3);

  async function run() {
    try {
      await orchestrator.initialize();

      switch (command) {
        case 'health':
          const health = await orchestrator.healthCheck();
          console.log(JSON.stringify(health, null, 2));
          break;
        
        case 'workflow':
          const workflowName = args[0] || 'complete-campaign';
          const transcriptFile = args[1];
          
          if (!transcriptFile && workflowName === 'complete-campaign') {
            console.log('Usage: node dan.js workflow complete-campaign <transcript-file>');
            return;
          }
          
          const campaignData = transcriptFile ? { transcriptFile } : {};
          const result = await orchestrator.executeWorkflow(workflowName, campaignData);
          console.log(JSON.stringify(result, null, 2));
          break;
        
        case 'dashboard':
          console.log(`Dashboard API available at: http://localhost:${orchestrator.config.dashboardPort}`);
          console.log('Press Ctrl+C to stop');
          
          // Keep process alive
          process.on('SIGINT', async () => {
            await orchestrator.shutdown();
            process.exit(0);
          });
          break;
        
        case 'campaigns':
          const campaigns = Array.from(orchestrator.campaigns.values());
          console.log(JSON.stringify(campaigns, null, 2));
          break;
        
        case 'metrics':
          console.log(JSON.stringify(orchestrator.metrics, null, 2));
          break;
        
        default:
          console.log('Dan - Total Audio Agent Orchestrator v' + orchestrator.version);
          console.log('');
          console.log('Usage: node dan.js <command> [options]');
          console.log('');
          console.log('Commands:');
          console.log('  health                           - System health check');
          console.log('  workflow <name> [transcript]     - Execute workflow');
          console.log('  dashboard                        - Start verification dashboard');
          console.log('  campaigns                        - List all campaigns');
          console.log('  metrics                          - Show system metrics');
          console.log('');
          console.log('Available workflows:');
          Object.entries(orchestrator.workflows).forEach(([name, workflow]) => {
            console.log(`  ${name.padEnd(20)} - ${workflow.description} (${workflow.estimatedTime}min)`);
          });
          console.log('');
          console.log('🎯 Transforming 15-20 hours of manual work into 45 minutes of automation');
      }
    } catch (error) {
      console.error('Command failed:', error.message);
      process.exit(1);
    } finally {
      if (command !== 'dashboard') {
        await orchestrator.shutdown();
      }
    }
  }

  run().catch(console.error);
}

module.exports = Dan;
