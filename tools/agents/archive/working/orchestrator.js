#!/usr/bin/env node

/**
 * Agent Orchestrator for Total Audio Promo
 * 
 * Coordinates and manages all specialized agents, handles workflows,
 * and provides a unified interface for complex multi-agent operations
 */

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args)
};
const DatabaseAgent = require('./database-agent');
const IntegrationAgent = require('./integration-agent-real');
const CampaignAgent = require('./campaign-agent');
const ContactAgent = require('./contact-agent');
const AgencyAgent = require('./agency-agent');
const MusicTechAgent = require('./music-tech-agent');
const RadioPromoAgent = require('./radio-promo-agent');
const ContentGenerationAgent = require('./content-generation-agent');
const AnalyticsAgent = require('./analytics-agent');
const SocialMediaAgent = require('./social-media-agent');
// const BetaUserAcquisitionAgent = require('./beta-user-acquisition-agent'); // PARKED - moved to parked/

class AgentOrchestrator {
  constructor() {
    this.name = 'AgentOrchestrator';
    this.agents = {
      database: new DatabaseAgent(),
      integration: new IntegrationAgent(),
      campaign: new CampaignAgent(),
      contact: new ContactAgent(),
      agency: new AgencyAgent(),
      musicTech: new MusicTechAgent(),
      radioPromo: new RadioPromoAgent(),
      contentGeneration: new ContentGenerationAgent(),
      analytics: new AnalyticsAgent(),
      socialMedia: new SocialMediaAgent(),
      // betaUserAcquisition: new BetaUserAcquisitionAgent() // PARKED - agent moved to parked/
    };
    this.workflows = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize all agents
   */
  async initialize() {
    try {
      logger.info('Initializing Agent Orchestrator...');
      
      const results = {};
      for (const [name, agent] of Object.entries(this.agents)) {
        try {
          const result = await agent.initialize();
          results[name] = result ? 'initialized' : 'failed';
          logger.info(`${name} agent: ${results[name]}`);
        } catch (error) {
          results[name] = `error: ${error.message}`;
          logger.error(`${name} agent initialization failed:`, error);
        }
      }

      this.isInitialized = true;
      this.setupWorkflows();
      
      logger.info('Agent Orchestrator initialized successfully');
      return results;
    } catch (error) {
      logger.error('Agent Orchestrator initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up predefined workflows
   */
  setupWorkflows() {
    // Full agency onboarding workflow
    this.workflows.set('agency-onboarding', {
      description: 'Complete agency onboarding with all setup steps',
      steps: [
        { agent: 'agency', action: 'onboardAgency' },
        { agent: 'database', action: 'verifyDataIsolation' },
        { agent: 'integration', action: 'setupAgencyIntegrations' },
        { agent: 'agency', action: 'setupAgencyBilling' }
      ]
    });

    // Campaign launch workflow
    this.workflows.set('campaign-launch', {
      description: 'Complete campaign launch across all platforms',
      steps: [
        { agent: 'campaign', action: 'createCampaign' },
        { agent: 'contact', action: 'segmentContacts' },
        { agent: 'integration', action: 'createMailchimpCampaign' },
        { agent: 'campaign', action: 'launchCampaign' },
        { agent: 'integration', action: 'monitorGmailReplies' }
      ]
    });

    // Contact enrichment workflow
    this.workflows.set('contact-enrichment', {
      description: 'Bulk contact enrichment and deduplication',
      steps: [
        { agent: 'contact', action: 'removeDuplicates' },
        { agent: 'contact', action: 'bulkProcessContacts' },
        { agent: 'contact', action: 'segmentContacts' },
        { agent: 'integration', action: 'syncAirtableContacts' }
      ]
    });

    // Daily maintenance workflow
    this.workflows.set('daily-maintenance', {
      description: 'Daily system maintenance and health checks',
      steps: [
        { agent: 'database', action: 'healthCheck' },
        { agent: 'integration', action: 'healthCheck' },
        { agent: 'database', action: 'performanceCheck' },
        { agent: 'integration', action: 'bulkSync' },
        { agent: 'contact', action: 'bulkProcessContacts' }
      ]
    });

    // Performance optimization workflow
    this.workflows.set('performance-optimization', {
      description: 'Optimize campaigns and system performance',
      steps: [
        { agent: 'campaign', action: 'checkOptimizationOpportunities' },
        { agent: 'contact', action: 'calculateEngagementScore' },
        { agent: 'integration', action: 'autoRecover' },
        { agent: 'database', action: 'cleanupOldData' },
        { agent: 'musicTech', action: 'analyzePerformance' }
      ]
    });

    // Music technology workflow
    this.workflows.set('music-analysis', {
      description: 'Comprehensive music analysis and platform integration',
      steps: [
        { agent: 'musicTech', action: 'analyzeAudioFile' },
        { agent: 'musicTech', action: 'searchMusic' },
        { agent: 'musicTech', action: 'optimizeStreaming' },
        { agent: 'integration', action: 'syncAirtableContacts' },
        { agent: 'campaign', action: 'createCampaign' }
      ]
    });

    // Technical recommendations workflow
    this.workflows.set('tech-recommendations', {
      description: 'Generate technical architecture and optimization recommendations',
      steps: [
        { agent: 'musicTech', action: 'generateTechnicalRecommendations' },
        { agent: 'musicTech', action: 'analyzePerformance' },
        { agent: 'database', action: 'performanceCheck' }
      ]
    });

    // Complete music release workflow
    this.workflows.set('music-release-campaign', {
      description: 'Full music release campaign with radio, social, and content',
      steps: [
        { agent: 'musicTech', action: 'analyzeAudioFile' },
        { agent: 'contentGeneration', action: 'generatePressRelease' },
        { agent: 'contentGeneration', action: 'generateCampaignContentSuite' },
        { agent: 'socialMedia', action: 'createSocialCampaign' },
        { agent: 'radioPromo', action: 'generateRadioCampaign' },
        { agent: 'radioPromo', action: 'executeOutreachCampaign' },
        { agent: 'socialMedia', action: 'executeCrossPlatformPost' },
        { agent: 'analytics', action: 'analyzeCampaignPerformance' }
      ]
    });

    // Influencer marketing workflow
    this.workflows.set('influencer-marketing', {
      description: 'Comprehensive influencer outreach and content collaboration',
      steps: [
        { agent: 'socialMedia', action: 'executeInfluencerOutreach' },
        { agent: 'contentGeneration', action: 'generateSocialContent' },
        { agent: 'socialMedia', action: 'manageCommunityEngagement' },
        { agent: 'analytics', action: 'analyzeUserBehavior' }
      ]
    });

    // Crisis management workflow
    this.workflows.set('crisis-management', {
      description: 'Handle social media crisis with coordinated response',
      steps: [
        { agent: 'socialMedia', action: 'handleSocialCrisis' },
        { agent: 'contentGeneration', action: 'generatePressRelease' },
        { agent: 'socialMedia', action: 'manageCommunityEngagement' },
        { agent: 'analytics', action: 'generateBusinessIntelligence' }
      ]
    });

    // Content marketing workflow
    this.workflows.set('content-marketing', {
      description: 'Create and distribute comprehensive content marketing campaign',
      steps: [
        { agent: 'contentGeneration', action: 'generateBlogContent' },
        { agent: 'contentGeneration', action: 'generateEmailCampaign' },
        { agent: 'socialMedia', action: 'createSocialCampaign' },
        { agent: 'socialMedia', action: 'executeCrossPlatformPost' },
        { agent: 'analytics', action: 'generateCustomReport' }
      ]
    });

    // Radio promotion workflow
    this.workflows.set('radio-promotion', {
      description: 'Targeted radio promotion with follow-up and tracking',
      steps: [
        { agent: 'radioPromo', action: 'generateRadioCampaign' },
        { agent: 'contentGeneration', action: 'generatePressRelease' },
        { agent: 'radioPromo', action: 'executeOutreachCampaign' },
        { agent: 'radioPromo', action: 'trackAirplayResults' },
        { agent: 'analytics', action: 'analyzeCampaignPerformance' }
      ]
    });

    // Social media growth workflow
    this.workflows.set('social-growth', {
      description: 'Accelerate social media growth through content and engagement',
      steps: [
        { agent: 'socialMedia', action: 'analyzeSocialTrends' },
        { agent: 'contentGeneration', action: 'generateSocialContent' },
        { agent: 'socialMedia', action: 'createSocialCampaign' },
        { agent: 'socialMedia', action: 'manageCommunityEngagement' },
        { agent: 'analytics', action: 'generateSocialAnalyticsReport' }
      ]
    });

    // Analytics and optimization workflow
    this.workflows.set('analytics-optimization', {
      description: 'Deep analytics analysis with optimization recommendations',
      steps: [
        { agent: 'analytics', action: 'analyzeCampaignPerformance' },
        { agent: 'analytics', action: 'generatePredictiveAnalysis' },
        { agent: 'analytics', action: 'generateBusinessIntelligence' },
        { agent: 'contentGeneration', action: 'generateCustomReport' },
        { agent: 'musicTech', action: 'generateTechnicalRecommendations' }
      ]
    });

    // Artist branding workflow
    this.workflows.set('artist-branding', {
      description: 'Complete artist brand development and content creation',
      steps: [
        { agent: 'contentGeneration', action: 'generateArtistBio' },
        { agent: 'contentGeneration', action: 'generateCampaignContentSuite' },
        { agent: 'socialMedia', action: 'createSocialCampaign' },
        { agent: 'analytics', action: 'analyzeUserBehavior' },
        { agent: 'contentGeneration', action: 'generateCustomReport' }
      ]
    });

    // Multi-platform launch workflow
    this.workflows.set('multi-platform-launch', {
      description: 'Coordinate launch across radio, social, streaming, and press',
      steps: [
        { agent: 'musicTech', action: 'analyzeAudioFile' },
        { agent: 'musicTech', action: 'searchMusic' },
        { agent: 'contentGeneration', action: 'generateCampaignContentSuite' },
        { agent: 'radioPromo', action: 'generateRadioCampaign' },
        { agent: 'socialMedia', action: 'createSocialCampaign' },
        { agent: 'radioPromo', action: 'executeOutreachCampaign' },
        { agent: 'socialMedia', action: 'executeCrossPlatformPost' },
        { agent: 'socialMedia', action: 'executeInfluencerOutreach' },
        { agent: 'analytics', action: 'generateRealTimeDashboard' },
        { agent: 'analytics', action: 'analyzeCampaignPerformance' }
      ]
    });

    // Beta user acquisition workflow
    this.workflows.set('beta-user-acquisition', {
      description: 'Comprehensive beta user acquisition strategy and execution',
      steps: [
        { agent: 'betaUserAcquisition', action: 'createBetaAcquisitionStrategy' },
        { agent: 'betaUserAcquisition', action: 'analyzeTargetMarkets' },
        { agent: 'betaUserAcquisition', action: 'generateOutreachCampaigns' },
        { agent: 'betaUserAcquisition', action: 'optimizeConversionFunnels' },
        { agent: 'betaUserAcquisition', action: 'createContentStrategy' },
        { agent: 'betaUserAcquisition', action: 'executeInfluencerOutreach' },
        { agent: 'betaUserAcquisition', action: 'trackBetaMetrics' },
        { agent: 'betaUserAcquisition', action: 'generateBetaReports' }
      ]
    });

    // Command Centre comprehensive audit workflow
    this.workflows.set('command-centre-audit', {
      description: 'Comprehensive UI/UX and backend audit of Command Centre application',
      steps: [
        { agent: 'database', action: 'performanceCheck' },
        { agent: 'integration', action: 'healthCheck' },
        { agent: 'musicTech', action: 'analyzePerformance' },
        { agent: 'analytics', action: 'analyzeCampaignPerformance' },
        { agent: 'contentGeneration', action: 'auditContent' },
        { agent: 'socialMedia', action: 'analyzeEngagement' },
        { agent: 'musicTech', action: 'generateTechnicalRecommendations' },
        { agent: 'analytics', action: 'generateOptimizationReport' }
      ]
    });

    logger.info(`${this.workflows.size} workflows configured`);
  }

  /**
   * Execute a predefined workflow
   */
  async executeWorkflow(workflowName, parameters = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('Orchestrator not initialized');
      }

      const workflow = this.workflows.get(workflowName);
      if (!workflow) {
        throw new Error(`Workflow '${workflowName}' not found`);
      }

      logger.info(`Executing workflow: ${workflowName}`);
      const startTime = Date.now();
      const results = [];

      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        const stepStartTime = Date.now();

        try {
          logger.info(`Step ${i + 1}/${workflow.steps.length}: ${step.agent}.${step.action}`);
          
          const agent = this.agents[step.agent];
          if (!agent) {
            throw new Error(`Agent '${step.agent}' not found`);
          }

          let result;
          if (typeof agent[step.action] === 'function') {
            // Pass parameters specific to this step, or general parameters
            const stepParams = parameters[`step${i + 1}`] || parameters[step.action] || parameters;
            result = await agent[step.action](stepParams);
          } else {
            throw new Error(`Action '${step.action}' not found on agent '${step.agent}'`);
          }

          const stepDuration = Date.now() - stepStartTime;
          results.push({
            step: i + 1,
            agent: step.agent,
            action: step.action,
            duration: stepDuration,
            result,
            status: 'completed'
          });

          logger.info(`Step ${i + 1} completed in ${stepDuration}ms`);
        } catch (error) {
          const stepDuration = Date.now() - stepStartTime;
          results.push({
            step: i + 1,
            agent: step.agent,
            action: step.action,
            duration: stepDuration,
            error: error.message,
            status: 'failed'
          });

          logger.error(`Step ${i + 1} failed:`, error);
          
          // Continue with remaining steps or fail fast based on workflow configuration
          if (workflow.failFast !== false) {
            break;
          }
        }
      }

      const totalDuration = Date.now() - startTime;
      const successfulSteps = results.filter(r => r.status === 'completed').length;
      
      const workflowResult = {
        workflow: workflowName,
        description: workflow.description,
        totalSteps: workflow.steps.length,
        successfulSteps,
        failedSteps: workflow.steps.length - successfulSteps,
        duration: totalDuration,
        steps: results,
        status: successfulSteps === workflow.steps.length ? 'completed' : 'partial',
        timestamp: new Date()
      };

      logger.info(`Workflow '${workflowName}' completed: ${successfulSteps}/${workflow.steps.length} steps successful`);
      return workflowResult;
    } catch (error) {
      logger.error(`Workflow execution failed:`, error);
      throw error;
    }
  }

  /**
   * Execute custom multi-agent operation
   */
  async executeCustomOperation(operations) {
    try {
      logger.info('Executing custom multi-agent operation...');
      const results = [];

      for (const operation of operations) {
        const { agent: agentName, action, parameters, parallel } = operation;
        
        if (parallel && Array.isArray(operations)) {
          // Execute operations in parallel
          const promises = operations.map(op => 
            this.executeSingleOperation(op.agent, op.action, op.parameters)
          );
          const parallelResults = await Promise.allSettled(promises);
          results.push(...parallelResults.map((result, index) => ({
            operation: operations[index],
            result: result.status === 'fulfilled' ? result.value : result.reason,
            status: result.status === 'fulfilled' ? 'completed' : 'failed'
          })));
          break; // Exit loop since we processed all operations in parallel
        } else {
          // Execute operations sequentially
          const result = await this.executeSingleOperation(agentName, action, parameters);
          results.push({
            operation,
            result,
            status: 'completed'
          });
        }
      }

      return {
        operationType: 'custom',
        results,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Custom operation execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute a single operation on an agent
   */
  async executeSingleOperation(agentName, action, parameters) {
    const agent = this.agents[agentName];
    if (!agent) {
      throw new Error(`Agent '${agentName}' not found`);
    }

    if (typeof agent[action] !== 'function') {
      throw new Error(`Action '${action}' not found on agent '${agentName}'`);
    }

    logger.info(`Executing ${agentName}.${action}`);
    return await agent[action](parameters);
  }

  /**
   * Get system-wide health status
   */
  async getSystemHealth() {
    try {
      const health = {
        orchestrator: {
          status: this.isInitialized ? 'healthy' : 'unhealthy',
          uptime: process.uptime(),
          workflows: this.workflows.size
        },
        agents: {}
      };

      // Get health status from each agent
      for (const [name, agent] of Object.entries(this.agents)) {
        try {
          if (agent.healthCheck) {
            health.agents[name] = await agent.healthCheck();
          } else {
            health.agents[name] = { status: 'unknown', message: 'No health check available' };
          }
        } catch (error) {
          health.agents[name] = { status: 'error', message: error.message };
        }
      }

      return health;
    } catch (error) {
      logger.error('System health check failed:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive system statistics
   */
  async getSystemStatistics() {
    try {
      const stats = {
        orchestrator: {
          uptime: process.uptime(),
          workflows: this.workflows.size,
          initialized: this.isInitialized
        },
        agents: {}
      };

      // Get statistics from each agent
      for (const [name, agent] of Object.entries(this.agents)) {
        try {
          if (agent.getAgentStatistics) {
            stats.agents[name] = agent.getAgentStatistics();
          } else if (agent.getStatistics) {
            stats.agents[name] = await agent.getStatistics();
          } else {
            stats.agents[name] = { message: 'No statistics available' };
          }
        } catch (error) {
          stats.agents[name] = { error: error.message };
        }
      }

      return stats;
    } catch (error) {
      logger.error('System statistics collection failed:', error);
      throw error;
    }
  }

  /**
   * List available workflows
   */
  listWorkflows() {
    return Array.from(this.workflows.entries()).map(([name, workflow]) => ({
      name,
      description: workflow.description,
      steps: workflow.steps.length
    }));
  }

  /**
   * Shutdown all agents
   */
  async shutdown() {
    try {
      logger.info('Shutting down Agent Orchestrator...');
      
      for (const [name, agent] of Object.entries(this.agents)) {
        try {
          if (agent.shutdown) {
            await agent.shutdown();
          }
          logger.info(`${name} agent shut down successfully`);
        } catch (error) {
          logger.error(`Failed to shutdown ${name} agent:`, error);
        }
      }

      this.isInitialized = false;
      logger.info('Agent Orchestrator shutdown completed');
    } catch (error) {
      logger.error('Agent Orchestrator shutdown failed:', error);
      throw error;
    }
  }
}

// Command line interface
if (require.main === module) {
  const orchestrator = new AgentOrchestrator();
  const command = process.argv[2];

  async function run() {
    await orchestrator.initialize();

    switch (command) {
      case 'health':
        const health = await orchestrator.getSystemHealth();
        console.log(JSON.stringify(health, null, 2));
        break;
      
      case 'stats':
        const stats = await orchestrator.getSystemStatistics();
        console.log(JSON.stringify(stats, null, 2));
        break;
      
      case 'workflows':
        const workflows = orchestrator.listWorkflows();
        console.log(JSON.stringify(workflows, null, 2));
        break;
      
      case 'execute':
        const workflowName = process.argv[3];
        if (!workflowName) {
          console.log('Usage: node orchestrator.js execute <workflowName>');
          console.log('Available workflows:');
          orchestrator.listWorkflows().forEach(w => console.log(`  - ${w.name}: ${w.description}`));
          return;
        }
        const result = await orchestrator.executeWorkflow(workflowName);
        console.log(JSON.stringify(result, null, 2));
        break;
      
      case 'maintenance':
        const maintenance = await orchestrator.executeWorkflow('daily-maintenance');
        console.log(JSON.stringify(maintenance, null, 2));
        break;
      
      default:
        console.log('Usage: node orchestrator.js [health|stats|workflows|execute|maintenance]');
        console.log('');
        console.log('Commands:');
        console.log('  health     - Check system health');
        console.log('  stats      - Get system statistics');
        console.log('  workflows  - List available workflows');
        console.log('  execute    - Execute a workflow');
        console.log('  maintenance- Run daily maintenance');
    }

    await orchestrator.shutdown();
  }

  run().catch(console.error);
}

module.exports = AgentOrchestrator;