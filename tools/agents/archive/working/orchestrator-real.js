#!/usr/bin/env node

/**
 * Real Agent Orchestrator for Total Audio Promo
 *
 * Coordinates real integration services and manages workflows
 * Uses actual backend services instead of mocks
 */

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
};

const DatabaseAgent = require('./database-agent');
const RealIntegrationAgent = require('./integration-agent-real');
const CampaignAgent = require('./campaign-agent');
const ContactAgent = require('./contact-agent');
const AgencyAgent = require('./agency-agent');

class RealAgentOrchestrator {
  constructor() {
    this.name = 'RealAgentOrchestrator';
    this.agents = {
      database: new DatabaseAgent(),
      integration: new RealIntegrationAgent(),
      campaign: new CampaignAgent(),
      contact: new ContactAgent(),
      agency: new AgencyAgent(),
    };
    this.workflows = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize all agents with real services
   */
  async initialize() {
    try {
      logger.info('Initializing Real Agent Orchestrator...');

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
      this.setupRealWorkflows();

      logger.info('Real Agent Orchestrator initialized successfully');
      return results;
    } catch (error) {
      logger.error('Real Agent Orchestrator initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up workflows optimized for real services
   */
  setupRealWorkflows() {
    // Real agency onboarding workflow
    this.workflows.set('real-agency-onboarding', {
      description: 'Complete agency onboarding with real service setup',
      steps: [
        { agent: 'agency', action: 'onboardAgency' },
        { agent: 'database', action: 'verifyDataIsolation' },
        { agent: 'integration', action: 'initialize' },
        { agent: 'integration', action: 'healthCheck' },
      ],
    });

    // Real campaign launch workflow
    this.workflows.set('real-campaign-launch', {
      description: 'Launch campaign using real integrations',
      steps: [
        { agent: 'integration', action: 'healthCheck' },
        { agent: 'campaign', action: 'createCampaign' },
        { agent: 'integration', action: 'createAirtableCampaignRecord' },
        { agent: 'integration', action: 'monitorGmailReplies' },
      ],
    });

    // Real contact enrichment workflow
    this.workflows.set('real-contact-enrichment', {
      description: 'Contact enrichment using real services',
      steps: [
        { agent: 'integration', action: 'syncAirtableContacts' },
        { agent: 'contact', action: 'removeDuplicates' },
        { agent: 'contact', action: 'bulkProcessContacts' },
        { agent: 'integration', action: 'analyzeContactEngagement' },
      ],
    });

    // Real service maintenance workflow
    this.workflows.set('real-service-maintenance', {
      description: 'Maintenance using real service connections',
      steps: [
        { agent: 'integration', action: 'healthCheck' },
        { agent: 'integration', action: 'autoRecover' },
        { agent: 'database', action: 'healthCheck' },
        { agent: 'integration', action: 'bulkSync' },
      ],
    });

    // AI-powered campaign optimization workflow
    this.workflows.set('ai-campaign-optimization', {
      description: 'Optimize campaigns using Claude AI insights',
      steps: [
        { agent: 'integration', action: 'generateCampaignReport' },
        { agent: 'campaign', action: 'checkOptimizationOpportunities' },
        { agent: 'integration', action: 'analyzeContactEngagement' },
        { agent: 'integration', action: 'generateEmailContent' },
      ],
    });

    logger.info(`${this.workflows.size} real service workflows configured`);
  }

  /**
   * Execute workflow with real service parameters
   */
  async executeWorkflow(workflowName, parameters = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('Real Orchestrator not initialized');
      }

      const workflow = this.workflows.get(workflowName);
      if (!workflow) {
        throw new Error(`Workflow '${workflowName}' not found`);
      }

      logger.info(`Executing real workflow: ${workflowName}`);
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
            // Pass parameters specific to this step, action, or general parameters
            const stepParams =
              parameters[`step${i + 1}`] ||
              parameters[step.action] ||
              parameters.general ||
              parameters;
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
            status: 'completed',
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
            status: 'failed',
          });

          logger.error(`Step ${i + 1} failed:`, error);

          // Continue with remaining steps unless it's a critical failure
          if (workflow.failFast !== false && this.isCriticalFailure(error)) {
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
        timestamp: new Date(),
      };

      logger.info(
        `Workflow '${workflowName}' completed: ${successfulSteps}/${workflow.steps.length} steps successful`
      );
      return workflowResult;
    } catch (error) {
      logger.error(`Workflow execution failed:`, error);
      throw error;
    }
  }

  /**
   * Check if error is critical enough to stop workflow
   */
  isCriticalFailure(error) {
    const criticalErrors = [
      'Database connection failed',
      'Authentication failed',
      'Service permanently unavailable',
    ];

    return criticalErrors.some(criticalError =>
      error.message.toLowerCase().includes(criticalError.toLowerCase())
    );
  }

  /**
   * Test specific integration service
   */
  async testIntegration(serviceName, testType = 'health') {
    try {
      const integrationAgent = this.agents.integration;

      if (!integrationAgent.isServiceAvailable(serviceName)) {
        return {
          service: serviceName,
          test: testType,
          status: 'not_available',
          message: `${serviceName} service is not configured or available`,
        };
      }

      let result;

      switch (testType) {
        case 'health':
          const health = await integrationAgent.healthCheck();
          result = health[serviceName];
          break;

        case 'functionality':
          result = await this.testServiceFunctionality(serviceName, integrationAgent);
          break;

        default:
          throw new Error(`Unknown test type: ${testType}`);
      }

      return {
        service: serviceName,
        test: testType,
        status: 'tested',
        result,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error(`Integration test failed for ${serviceName}:`, error);
      return {
        service: serviceName,
        test: testType,
        status: 'error',
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Test service functionality beyond health check
   */
  async testServiceFunctionality(serviceName, integrationAgent) {
    switch (serviceName) {
      case 'claude':
        return await integrationAgent.services.claude.generateResponse('Test functionality check');

      case 'gmail':
        return await integrationAgent.searchGmailEmails('test', 1);

      case 'airtable':
        // Test would require valid user ID
        return { message: 'Airtable functionality test requires valid user ID' };

      case 'mailchimp':
        // Test would require valid campaign ID
        return { message: 'Mailchimp functionality test requires valid campaign ID' };

      default:
        throw new Error(`Functionality test not implemented for ${serviceName}`);
    }
  }

  /**
   * Generate comprehensive system report using real services
   */
  async generateSystemReport() {
    try {
      logger.info('Generating comprehensive system report with real services...');

      const report = {
        timestamp: new Date(),
        orchestrator: {
          status: this.isInitialized ? 'initialized' : 'not_initialized',
          uptime: process.uptime(),
          workflows: this.workflows.size,
        },
        agents: {},
        integrations: {},
        recommendations: [],
      };

      // Get agent statuses
      for (const [name, agent] of Object.entries(this.agents)) {
        try {
          if (agent.getAgentStatistics) {
            report.agents[name] = agent.getAgentStatistics();
          } else if (agent.getStatistics) {
            report.agents[name] = await agent.getStatistics();
          } else if (agent.healthCheck) {
            report.agents[name] = await agent.healthCheck();
          } else {
            report.agents[name] = { status: 'no_status_available' };
          }
        } catch (error) {
          report.agents[name] = { error: error.message };
        }
      }

      // Get detailed integration status
      if (this.agents.integration) {
        report.integrations = await this.agents.integration.getStatistics();
        const health = await this.agents.integration.healthCheck();
        report.integrations.health = health;
      }

      // Generate AI-powered recommendations if Claude is available
      if (this.agents.integration.isServiceAvailable('claude')) {
        try {
          const claudeService = this.agents.integration.getService('claude');
          const recommendationPrompt = `Based on this system status data, provide 3-5 specific recommendations for improving the Total Audio Promo platform: ${JSON.stringify(
            report,
            null,
            2
          )}`;
          const aiRecommendations = await claudeService.generateResponse(recommendationPrompt);
          report.recommendations = this.parseRecommendations(aiRecommendations);
        } catch (error) {
          logger.error('Failed to generate AI recommendations:', error);
          report.recommendations = ['Unable to generate AI recommendations'];
        }
      }

      logger.info('System report generated successfully');
      return report;
    } catch (error) {
      logger.error('System report generation failed:', error);
      throw error;
    }
  }

  /**
   * Parse AI recommendations from Claude response
   */
  parseRecommendations(aiResponse) {
    try {
      // Try to extract recommendations from AI response
      const lines = aiResponse.split('\n').filter(line => line.trim().length > 0);
      const recommendations = lines
        .filter(line => line.match(/^\d+\./) || line.includes('•') || line.includes('-'))
        .map(line =>
          line
            .replace(/^\d+\.\s*/, '')
            .replace(/^[•\-]\s*/, '')
            .trim()
        )
        .filter(rec => rec.length > 10); // Filter out short/meaningless recommendations

      return recommendations.length > 0 ? recommendations : [aiResponse];
    } catch (error) {
      return [aiResponse];
    }
  }

  /**
   * Get system health with real service details
   */
  async getSystemHealth() {
    try {
      const health = {
        orchestrator: {
          status: this.isInitialized ? 'healthy' : 'unhealthy',
          uptime: process.uptime(),
          workflows: this.workflows.size,
        },
        agents: {},
        integrations: {},
        overall: 'unknown',
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

      // Get detailed integration health
      if (this.agents.integration) {
        health.integrations = await this.agents.integration.healthCheck();
      }

      // Determine overall health
      const agentStatuses = Object.values(health.agents).map(a => a.status);
      const integrationStatuses = Object.values(health.integrations).map(i => i.status);

      if (agentStatuses.includes('error') || integrationStatuses.includes('error')) {
        health.overall = 'degraded';
      } else if (
        agentStatuses.every(s => s === 'healthy') &&
        integrationStatuses.every(s => s === 'healthy')
      ) {
        health.overall = 'healthy';
      } else {
        health.overall = 'partial';
      }

      return health;
    } catch (error) {
      logger.error('System health check failed:', error);
      throw error;
    }
  }

  /**
   * List available workflows with real service descriptions
   */
  listWorkflows() {
    return Array.from(this.workflows.entries()).map(([name, workflow]) => ({
      name,
      description: workflow.description,
      steps: workflow.steps.length,
      usesRealServices: true,
    }));
  }

  /**
   * Shutdown all agents
   */
  async shutdown() {
    try {
      logger.info('Shutting down Real Agent Orchestrator...');

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
      logger.info('Real Agent Orchestrator shutdown completed');
    } catch (error) {
      logger.error('Real Agent Orchestrator shutdown failed:', error);
      throw error;
    }
  }
}

// Command line interface
if (require.main === module) {
  const orchestrator = new RealAgentOrchestrator();
  const command = process.argv[2];

  async function run() {
    await orchestrator.initialize();

    switch (command) {
      case 'health':
        const health = await orchestrator.getSystemHealth();
        console.log(JSON.stringify(health, null, 2));
        break;

      case 'report':
        const report = await orchestrator.generateSystemReport();
        console.log(JSON.stringify(report, null, 2));
        break;

      case 'workflows':
        const workflows = orchestrator.listWorkflows();
        console.log(JSON.stringify(workflows, null, 2));
        break;

      case 'execute':
        const workflowName = process.argv[3];
        if (!workflowName) {
          console.log('Usage: node orchestrator-real.js execute <workflowName> [parameters]');
          console.log('Available workflows:');
          orchestrator.listWorkflows().forEach(w => console.log(`  - ${w.name}: ${w.description}`));
          return;
        }

        // Parse parameters if provided
        const params = {};
        if (process.argv[4]) {
          try {
            Object.assign(params, JSON.parse(process.argv[4]));
          } catch (e) {
            // Treat as simple parameter
            params.general = process.argv[4];
          }
        }

        const result = await orchestrator.executeWorkflow(workflowName, params);
        console.log(JSON.stringify(result, null, 2));
        break;

      case 'test':
        const serviceName = process.argv[3];
        const testType = process.argv[4] || 'health';

        if (!serviceName) {
          console.log('Usage: node orchestrator-real.js test <service> [health|functionality]');
          console.log('Available services: airtable, mailchimp, gmail, claude');
          return;
        }

        const testResult = await orchestrator.testIntegration(serviceName, testType);
        console.log(JSON.stringify(testResult, null, 2));
        break;

      case 'maintenance':
        const maintenance = await orchestrator.executeWorkflow('real-service-maintenance');
        console.log(JSON.stringify(maintenance, null, 2));
        break;

      default:
        console.log(
          'Usage: node orchestrator-real.js [health|report|workflows|execute|test|maintenance]'
        );
        console.log('');
        console.log('Real Service Commands:');
        console.log('  health       - Check system health with real services');
        console.log('  report       - Generate comprehensive system report');
        console.log('  workflows    - List available real service workflows');
        console.log('  execute      - Execute a workflow with real services');
        console.log('  test         - Test specific integration service');
        console.log('  maintenance  - Run maintenance with real services');
    }

    await orchestrator.shutdown();
  }

  run().catch(console.error);
}

module.exports = RealAgentOrchestrator;
