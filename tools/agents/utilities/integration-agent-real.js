#!/usr/bin/env node

/**
 * Real Integration Agent for Total Audio Promo
 *
 * Uses actual service implementations from the backend instead of mocks
 * Manages all third-party integrations with proper error handling and logging
 */

const path = require('path');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
};

class RealIntegrationAgent {
  constructor() {
    this.name = 'RealIntegrationAgent';
    this.services = {};
    this.healthStatus = {};
    this.initialized = false;
  }

  /**
   * Initialize all real integration services
   */
  async initialize() {
    logger.info(`${this.name} initializing with real services...`);

    const results = {};

    try {
      // Initialize Airtable service
      results.airtable = await this.initializeAirtable();
    } catch (error) {
      results.airtable = `failed: ${error.message}`;
      logger.error('Airtable service initialization failed:', error);
    }

    try {
      // Initialize Mailchimp service
      results.mailchimp = await this.initializeMailchimp();
    } catch (error) {
      results.mailchimp = `failed: ${error.message}`;
      logger.error('Mailchimp service initialization failed:', error);
    }

    try {
      // Initialize Gmail service
      results.gmail = await this.initializeGmail();
    } catch (error) {
      results.gmail = `failed: ${error.message}`;
      logger.error('Gmail service initialization failed:', error);
    }

    try {
      // Initialize Claude service
      results.claude = await this.initializeClaude();
    } catch (error) {
      results.claude = `failed: ${error.message}`;
      logger.error('Claude service initialization failed:', error);
    }

    this.initialized = true;
    logger.info(`${this.name} initialization completed`);

    return results;
  }

  /**
   * Initialize Airtable service
   */
  async initializeAirtable() {
    try {
      // Import the real AirtableService
      // Note: Since backend is TypeScript, we need to use compiled JS or ts-node
      let AirtableService;
      try {
        // Try to require compiled JS first
        AirtableService = require('../backend/dist/integrations/airtable').AirtableService;
      } catch (e) {
        // Fall back to requiring TS directly with ts-node
        try {
          require('ts-node/register');
          AirtableService = require('../backend/src/integrations/airtable').AirtableService;
        } catch (e2) {
          throw new Error(
            'Cannot load AirtableService. Please compile backend or install ts-node.'
          );
        }
      }

      // Check for required environment variables
      const apiKey = process.env.AIRTABLE_API_KEY;
      const baseId = process.env.AIRTABLE_BASE_ID;

      if (!apiKey || !baseId) {
        logger.warn(
          'Airtable configuration missing - service will be available but not functional'
        );
        this.services.airtable = null;
        return 'configured but not connected (missing credentials)';
      }

      const config = {
        apiKey,
        baseId,
        contactsTableId: process.env.AIRTABLE_CONTACTS_TABLE_ID || 'Contacts',
        campaignsTableId: process.env.AIRTABLE_CAMPAIGNS_TABLE_ID || 'Campaigns',
        interactionsTableId: process.env.AIRTABLE_INTERACTIONS_TABLE_ID || 'Interactions',
        emailsTableId: process.env.AIRTABLE_EMAILS_TABLE_ID || 'Emails',
      };

      this.services.airtable = new AirtableService(config);
      logger.info('Airtable service initialized successfully');
      return 'initialized';
    } catch (error) {
      logger.error('Airtable initialization error:', error);
      this.services.airtable = null;
      return `failed: ${error.message}`;
    }
  }

  /**
   * Initialize Mailchimp service
   */
  async initializeMailchimp() {
    try {
      let MailchimpService;
      try {
        MailchimpService = require('../backend/dist/integrations/mailchimp').MailchimpService;
      } catch (e) {
        try {
          require('ts-node/register');
          MailchimpService = require('../backend/src/integrations/mailchimp').MailchimpService;
        } catch (e2) {
          throw new Error(
            'Cannot load MailchimpService. Please compile backend or install ts-node.'
          );
        }
      }

      const apiKey = process.env.MAILCHIMP_API_KEY;
      const listId = process.env.MAILCHIMP_LIST_ID;

      if (!apiKey || !listId) {
        logger.warn(
          'Mailchimp configuration missing - service will be available but not functional'
        );
        this.services.mailchimp = null;
        return 'configured but not connected (missing credentials)';
      }

      const config = {
        apiKey,
        serverPrefix: apiKey.split('-')[1], // Extract server prefix from API key
        listId,
      };

      this.services.mailchimp = new MailchimpService(config);
      logger.info('Mailchimp service initialized successfully');
      return 'initialized';
    } catch (error) {
      logger.error('Mailchimp initialization error:', error);
      this.services.mailchimp = null;
      return `failed: ${error.message}`;
    }
  }

  /**
   * Initialize Gmail service
   */
  async initializeGmail() {
    try {
      let GmailService;
      try {
        GmailService = require('../backend/dist/integrations/gmail').GmailService;
      } catch (e) {
        try {
          require('ts-node/register');
          GmailService = require('../backend/src/integrations/gmail').GmailService;
        } catch (e2) {
          throw new Error('Cannot load GmailService. Please compile backend or install ts-node.');
        }
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
      const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

      if (!clientId || !clientSecret || !refreshToken) {
        logger.warn('Gmail configuration missing - service will be available but not functional');
        this.services.gmail = null;
        return 'configured but not connected (missing credentials)';
      }

      const config = {
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
        expiryDate: process.env.GOOGLE_TOKEN_EXPIRY
          ? parseInt(process.env.GOOGLE_TOKEN_EXPIRY)
          : undefined,
      };

      this.services.gmail = new GmailService(config);
      logger.info('Gmail service initialized successfully');
      return 'initialized';
    } catch (error) {
      logger.error('Gmail initialization error:', error);
      this.services.gmail = null;
      return `failed: ${error.message}`;
    }
  }

  /**
   * Initialize Claude service
   */
  async initializeClaude() {
    try {
      let ClaudeService;
      try {
        ClaudeService = require('../backend/dist/integrations/claude').ClaudeService;
      } catch (e) {
        try {
          require('ts-node/register');
          ClaudeService = require('../backend/src/integrations/claude').ClaudeService;
        } catch (e2) {
          throw new Error('Cannot load ClaudeService. Please compile backend or install ts-node.');
        }
      }

      const apiKey = process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        logger.warn('Claude configuration missing - service will be available but not functional');
        this.services.claude = null;
        return 'configured but not connected (missing credentials)';
      }

      const config = {
        apiKey,
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
      };

      this.services.claude = new ClaudeService(config);
      logger.info('Claude service initialized successfully');
      return 'initialized';
    } catch (error) {
      logger.error('Claude initialization error:', error);
      this.services.claude = null;
      return `failed: ${error.message}`;
    }
  }

  /**
   * Check health of all real integrations
   */
  async healthCheck() {
    const health = {};

    // Airtable health check
    if (this.services.airtable) {
      try {
        // Simple API call to test connection
        await this.services.airtable.syncContacts('health-check-user');
        health.airtable = { status: 'healthy', timestamp: new Date() };
      } catch (error) {
        health.airtable = {
          status: error.message.includes('User not found') ? 'healthy' : 'error',
          message: error.message,
          timestamp: new Date(),
        };
      }
    } else {
      health.airtable = { status: 'not_configured', message: 'Service not initialized' };
    }

    // Mailchimp health check
    if (this.services.mailchimp) {
      try {
        // Test with a dummy campaign ID
        await this.services.mailchimp.getCampaignAnalytics('test-campaign-id');
        health.mailchimp = { status: 'healthy', timestamp: new Date() };
      } catch (error) {
        health.mailchimp = {
          status: error.message.includes('not found') ? 'healthy' : 'error',
          message: error.message,
          timestamp: new Date(),
        };
      }
    } else {
      health.mailchimp = { status: 'not_configured', message: 'Service not initialized' };
    }

    // Gmail health check
    if (this.services.gmail) {
      try {
        // Test with a simple search query
        await this.services.gmail.searchEmails('test', 1);
        health.gmail = { status: 'healthy', timestamp: new Date() };
      } catch (error) {
        health.gmail = {
          status: 'error',
          message: error.message,
          timestamp: new Date(),
        };
      }
    } else {
      health.gmail = { status: 'not_configured', message: 'Service not initialized' };
    }

    // Claude health check
    if (this.services.claude) {
      try {
        // Test with a simple prompt
        await this.services.claude.generateResponse('Health check');
        health.claude = { status: 'healthy', timestamp: new Date() };
      } catch (error) {
        health.claude = {
          status: 'error',
          message: error.message,
          timestamp: new Date(),
        };
      }
    } else {
      health.claude = { status: 'not_configured', message: 'Service not initialized' };
    }

    this.healthStatus = health;
    return health;
  }

  /**
   * Sync contacts from Airtable
   */
  async syncAirtableContacts(userId) {
    if (!this.services.airtable) {
      throw new Error('Airtable service not available');
    }

    try {
      logger.info('Starting Airtable contact sync...');
      await this.services.airtable.syncContacts(userId);
      logger.info('Airtable contact sync completed successfully');
      return { status: 'success', message: 'Contacts synced successfully' };
    } catch (error) {
      logger.error('Airtable contact sync failed:', error);
      throw error;
    }
  }

  /**
   * Create campaign record in Airtable
   */
  async createAirtableCampaignRecord(campaignData) {
    if (!this.services.airtable) {
      throw new Error('Airtable service not available');
    }

    try {
      logger.info('Creating Airtable campaign record...');
      await this.services.airtable.createCampaignRecord(campaignData);
      logger.info('Airtable campaign record created successfully');
      return { status: 'success', message: 'Campaign record created' };
    } catch (error) {
      logger.error('Airtable campaign creation failed:', error);
      throw error;
    }
  }

  /**
   * Get Mailchimp campaign analytics
   */
  async getMailchimpCampaignAnalytics(campaignId) {
    if (!this.services.mailchimp) {
      throw new Error('Mailchimp service not available');
    }

    try {
      logger.info(`Getting Mailchimp analytics for campaign ${campaignId}...`);
      const analytics = await this.services.mailchimp.getCampaignAnalytics(campaignId);
      logger.info('Mailchimp analytics retrieved successfully');
      return analytics;
    } catch (error) {
      logger.error('Mailchimp analytics retrieval failed:', error);
      throw error;
    }
  }

  /**
   * Monitor Gmail for new replies
   */
  async monitorGmailReplies(campaignId) {
    if (!this.services.gmail) {
      throw new Error('Gmail service not available');
    }

    try {
      logger.info(`Monitoring Gmail replies for campaign ${campaignId}...`);
      await this.services.gmail.trackReplies(campaignId);
      logger.info('Gmail reply monitoring completed');
      return { status: 'success', message: 'Reply monitoring completed' };
    } catch (error) {
      logger.error('Gmail reply monitoring failed:', error);
      throw error;
    }
  }

  /**
   * Search Gmail for specific emails
   */
  async searchGmailEmails(query, maxResults = 50) {
    if (!this.services.gmail) {
      throw new Error('Gmail service not available');
    }

    try {
      logger.info(`Searching Gmail with query: ${query}`);
      const emails = await this.services.gmail.searchEmails(query, maxResults);
      logger.info(`Found ${emails.length} emails matching query`);
      return emails;
    } catch (error) {
      logger.error('Gmail email search failed:', error);
      throw error;
    }
  }

  /**
   * Send bulk emails via Gmail
   */
  async sendBulkGmailEmails(recipients, subject, content) {
    if (!this.services.gmail) {
      throw new Error('Gmail service not available');
    }

    try {
      logger.info(`Sending bulk emails to ${recipients.length} recipients...`);
      const results = await this.services.gmail.sendBulkEmail(recipients, subject, content);
      logger.info(
        `Bulk email completed: ${results.success.length} sent, ${results.failed.length} failed`
      );
      return results;
    } catch (error) {
      logger.error('Bulk email sending failed:', error);
      throw error;
    }
  }

  /**
   * Generate campaign report with Claude
   */
  async generateCampaignReport(campaignId, reportType = 'CAMPAIGN_SUMMARY') {
    if (!this.services.claude) {
      throw new Error('Claude service not available');
    }

    try {
      logger.info(`Generating ${reportType} report for campaign ${campaignId}...`);
      const report = await this.services.claude.generateCampaignReport(campaignId, reportType);
      logger.info('Campaign report generated successfully');
      return report;
    } catch (error) {
      logger.error('Campaign report generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate email content with Claude
   */
  async generateEmailContent(campaignData) {
    if (!this.services.claude) {
      throw new Error('Claude service not available');
    }

    try {
      logger.info(`Generating email content for ${campaignData.artistName}...`);
      const content = await this.services.claude.generateEmailContent(campaignData);
      logger.info('Email content generated successfully');
      return content;
    } catch (error) {
      logger.error('Email content generation failed:', error);
      throw error;
    }
  }

  /**
   * Analyze contact engagement with Claude
   */
  async analyzeContactEngagement(contactId) {
    if (!this.services.claude) {
      throw new Error('Claude service not available');
    }

    try {
      logger.info(`Analyzing engagement for contact ${contactId}...`);
      const analysis = await this.services.claude.analyzeContactEngagement(contactId);
      logger.info('Contact engagement analysis completed');
      return analysis;
    } catch (error) {
      logger.error('Contact engagement analysis failed:', error);
      throw error;
    }
  }

  /**
   * Auto-recover failed integrations
   */
  async autoRecover() {
    const recovered = {};

    for (const [name, status] of Object.entries(this.healthStatus)) {
      if (status.status === 'error') {
        try {
          logger.info(`Attempting to recover ${name} integration...`);

          // Reinitialize the service
          switch (name) {
            case 'airtable':
              recovered[name] = await this.initializeAirtable();
              break;
            case 'mailchimp':
              recovered[name] = await this.initializeMailchimp();
              break;
            case 'gmail':
              recovered[name] = await this.initializeGmail();
              break;
            case 'claude':
              recovered[name] = await this.initializeClaude();
              break;
            default:
              recovered[name] = 'unknown service';
          }

          logger.info(`${name} integration recovery result: ${recovered[name]}`);
        } catch (error) {
          recovered[name] = `recovery failed: ${error.message}`;
          logger.error(`Failed to recover ${name}:`, error);
        }
      }
    }

    return recovered;
  }

  /**
   * Bulk sync all data sources
   */
  async bulkSync(userId) {
    const results = {};

    try {
      if (this.services.airtable) {
        results.airtable = await this.syncAirtableContacts(userId);
      } else {
        results.airtable = { error: 'Airtable service not available' };
      }
    } catch (error) {
      results.airtable = { error: error.message };
    }

    // Add more bulk sync operations as needed

    return results;
  }

  /**
   * Get integration statistics
   */
  async getStatistics() {
    const stats = {
      timestamp: new Date(),
      initialized: this.initialized,
      services: {
        airtable: this.services.airtable ? 'available' : 'not_available',
        mailchimp: this.services.mailchimp ? 'available' : 'not_available',
        gmail: this.services.gmail ? 'available' : 'not_available',
        claude: this.services.claude ? 'available' : 'not_available',
      },
      healthStatus: this.healthStatus,
    };

    return stats;
  }

  /**
   * Check if service is available
   */
  isServiceAvailable(serviceName) {
    return this.services[serviceName] !== null && this.services[serviceName] !== undefined;
  }

  /**
   * Get service instance
   */
  getService(serviceName) {
    if (!this.isServiceAvailable(serviceName)) {
      throw new Error(`${serviceName} service is not available`);
    }
    return this.services[serviceName];
  }
}

// Command line interface
if (require.main === module) {
  const agent = new RealIntegrationAgent();
  const command = process.argv[2];

  async function run() {
    await agent.initialize();

    switch (command) {
      case 'health':
        const health = await agent.healthCheck();
        console.log(JSON.stringify(health, null, 2));
        break;

      case 'sync':
        const userId = process.argv[3] || 'test-user';
        const syncResults = await agent.bulkSync(userId);
        console.log(JSON.stringify(syncResults, null, 2));
        break;

      case 'recover':
        await agent.healthCheck(); // Update health status first
        const recovery = await agent.autoRecover();
        console.log(JSON.stringify(recovery, null, 2));
        break;

      case 'stats':
        const stats = await agent.getStatistics();
        console.log(JSON.stringify(stats, null, 2));
        break;

      case 'test-claude':
        if (agent.isServiceAvailable('claude')) {
          const response = await agent.services.claude.generateResponse(
            'Hello, this is a test prompt for the agent system.'
          );
          console.log('Claude Response:', response);
        } else {
          console.log('Claude service not available');
        }
        break;

      case 'test-gmail':
        if (agent.isServiceAvailable('gmail')) {
          const emails = await agent.searchGmailEmails('test', 5);
          console.log(`Found ${emails.length} emails`);
          console.log(JSON.stringify(emails, null, 2));
        } else {
          console.log('Gmail service not available');
        }
        break;

      default:
        console.log(
          'Usage: node integration-agent-real.js [health|sync|recover|stats|test-claude|test-gmail]'
        );
        console.log('');
        console.log('Real Integration Agent Commands:');
        console.log('  health       - Check all service health');
        console.log('  sync <userId>- Sync data from all sources');
        console.log('  recover      - Attempt to recover failed services');
        console.log('  stats        - Get integration statistics');
        console.log('  test-claude  - Test Claude AI service');
        console.log('  test-gmail   - Test Gmail service');
    }
  }

  run().catch(console.error);
}

module.exports = RealIntegrationAgent;
