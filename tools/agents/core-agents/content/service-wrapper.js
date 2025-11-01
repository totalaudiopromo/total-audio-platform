#!/usr/bin/env node

/**
 * Service Wrapper for Total Audio Promo Agents
 *
 * Provides a JavaScript interface to the TypeScript backend services
 * Works without requiring TypeScript compilation
 */

const { spawn } = require('child_process');
const path = require('path');

// Simple logger
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
};

class ServiceWrapper {
  constructor() {
    this.backendPath = path.join(__dirname, '..', 'backend');
    this.services = {
      airtable: new AirtableWrapper(),
      claude: new ClaudeWrapper(),
      gmail: new GmailWrapper(),
      mailchimp: new MailchimpWrapper(),
    };
  }

  /**
   * Get service wrapper
   */
  getService(serviceName) {
    if (!this.services[serviceName]) {
      throw new Error(`Service ${serviceName} not available`);
    }
    return this.services[serviceName];
  }

  /**
   * Check if service is configured
   */
  isServiceConfigured(serviceName) {
    return this.services[serviceName] && this.services[serviceName].isConfigured();
  }

  /**
   * Get all service statuses
   */
  getAllServiceStatuses() {
    const statuses = {};
    for (const [name, service] of Object.entries(this.services)) {
      statuses[name] = {
        configured: service.isConfigured(),
        status: service.isConfigured() ? 'available' : 'not_configured',
      };
    }
    return statuses;
  }
}

/**
 * Base service wrapper class
 */
class BaseServiceWrapper {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.requiredEnvVars = [];
  }

  isConfigured() {
    return this.requiredEnvVars.every(envVar => process.env[envVar]);
  }

  async healthCheck() {
    if (!this.isConfigured()) {
      return {
        status: 'not_configured',
        message: `Missing required environment variables: ${this.requiredEnvVars.filter(v => !process.env[v]).join(', ')}`,
      };
    }

    try {
      await this.performHealthCheck();
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date(),
      };
    }
  }

  async performHealthCheck() {
    // Override in subclasses
    throw new Error('Health check not implemented');
  }
}

/**
 * Airtable service wrapper
 */
class AirtableWrapper extends BaseServiceWrapper {
  constructor() {
    super('airtable');
    this.requiredEnvVars = ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID'];
  }

  async performHealthCheck() {
    const Airtable = require('airtable');
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

    // Try to list tables (minimal API call)
    await base('Contacts').select({ maxRecords: 1 }).firstPage();
  }

  async syncContacts() {
    if (!this.isConfigured()) {
      throw new Error('Airtable not configured');
    }

    try {
      const Airtable = require('airtable');
      Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
      const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

      const contacts = await base('Contacts').select({ maxRecords: 100 }).all();

      logger.info(`Retrieved ${contacts.length} contacts from Airtable`);

      return {
        success: true,
        count: contacts.length,
        contacts: contacts.map(record => ({
          id: record.id,
          fields: record.fields,
        })),
      };
    } catch (error) {
      logger.error('Airtable sync failed:', error);
      throw error;
    }
  }

  async createCampaignRecord(campaignData) {
    if (!this.isConfigured()) {
      throw new Error('Airtable not configured');
    }

    try {
      const Airtable = require('airtable');
      Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
      const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

      const record = await base('Campaigns').create({
        Name: campaignData.name || 'New Campaign',
        Artist: campaignData.artist || 'Unknown Artist',
        Status: campaignData.status || 'Active',
        'Start Date': campaignData.startDate || new Date().toISOString(),
        Type: campaignData.type || 'Email Campaign',
      });

      logger.info(`Created Airtable campaign record: ${record.id}`);
      return { success: true, recordId: record.id };
    } catch (error) {
      logger.error('Airtable campaign creation failed:', error);
      throw error;
    }
  }
}

/**
 * Claude AI service wrapper
 */
class ClaudeWrapper extends BaseServiceWrapper {
  constructor() {
    super('claude');
    this.requiredEnvVars = ['ANTHROPIC_API_KEY'];
  }

  async performHealthCheck() {
    const Anthropic = require('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Simple test message
    await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Health check' }],
    });
  }

  async generateResponse(prompt, maxTokens = 1000) {
    if (!this.isConfigured()) {
      throw new Error('Claude not configured');
    }

    try {
      const Anthropic = require('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      });

      return message.content[0]?.text || 'No response generated';
    } catch (error) {
      logger.error('Claude response generation failed:', error);
      throw error;
    }
  }

  async generateCampaignReport(campaignData) {
    const prompt = `
As a music promotion expert, analyze this campaign data and provide insights:

Campaign: ${campaignData.name || 'Unknown'}
Artist: ${campaignData.artist || 'Unknown'}
Status: ${campaignData.status || 'Unknown'}

Please provide:
1. Key performance insights
2. Recommendations for improvement
3. Next steps

Keep the response concise and actionable.
`;

    const response = await this.generateResponse(prompt, 2000);

    return {
      content: response,
      insights: this.extractInsights(response),
      recommendations: this.extractRecommendations(response),
    };
  }

  extractInsights(text) {
    const lines = text.split('\n');
    const insights = lines
      .filter(
        line => line.includes('insight') || line.includes('performance') || line.includes('metric')
      )
      .map(line => line.trim())
      .filter(line => line.length > 10)
      .slice(0, 3);

    return insights.length > 0 ? insights : ['Campaign data analyzed successfully'];
  }

  extractRecommendations(text) {
    const lines = text.split('\n');
    const recommendations = lines
      .filter(
        line => line.includes('recommend') || line.includes('suggest') || line.includes('should')
      )
      .map(line => line.trim())
      .filter(line => line.length > 10)
      .slice(0, 3);

    return recommendations.length > 0
      ? recommendations
      : ['Continue monitoring campaign performance'];
  }
}

/**
 * Gmail service wrapper
 */
class GmailWrapper extends BaseServiceWrapper {
  constructor() {
    super('gmail');
    this.requiredEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'];
  }

  async performHealthCheck() {
    const { google } = require('googleapis');

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3001/api/integrations/gmail/callback'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Test with simple profile request
    await gmail.users.getProfile({ userId: 'me' });
  }

  async searchEmails(query = 'test', maxResults = 10) {
    if (!this.isConfigured()) {
      throw new Error('Gmail not configured');
    }

    try {
      const { google } = require('googleapis');

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3001/api/integrations/gmail/callback'
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        access_token: process.env.GOOGLE_ACCESS_TOKEN,
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults,
      });

      const messages = response.data.messages || [];
      logger.info(`Found ${messages.length} emails matching query: ${query}`);

      return {
        success: true,
        count: messages.length,
        messages: messages.slice(0, 5), // Limit for demo
      };
    } catch (error) {
      logger.error('Gmail search failed:', error);
      throw error;
    }
  }

  async trackReplies(campaignSubject) {
    const query = `subject:"Re: ${campaignSubject}"`;
    return await this.searchEmails(query, 50);
  }
}

/**
 * Mailchimp service wrapper
 */
class MailchimpWrapper extends BaseServiceWrapper {
  constructor() {
    super('mailchimp');
    this.requiredEnvVars = ['MAILCHIMP_API_KEY'];
  }

  async performHealthCheck() {
    const mailchimp = require('mailchimp-api-v3');
    const mc = new mailchimp(process.env.MAILCHIMP_API_KEY);

    // Test API connection
    await mc.get('/');
  }

  async getCampaignAnalytics(campaignId) {
    if (!this.isConfigured()) {
      throw new Error('Mailchimp not configured');
    }

    try {
      const mailchimp = require('mailchimp-api-v3');
      const mc = new mailchimp(process.env.MAILCHIMP_API_KEY);

      const reports = await mc.get(`/reports/${campaignId}`);

      return {
        opens: reports.opens.opens_total || 0,
        clicks: reports.clicks.clicks_total || 0,
        bounces: (reports.bounces.hard_bounces || 0) + (reports.bounces.soft_bounces || 0),
        unsubscribes: reports.unsubscribed.unsubscribe_count || 0,
        openRate: reports.opens.open_rate || 0,
        clickRate: reports.clicks.click_rate || 0,
      };
    } catch (error) {
      // For demo purposes, return mock data if campaign not found
      if (error.message.includes('not found') || error.status === 404) {
        logger.warn(`Campaign ${campaignId} not found, returning mock data`);
        return {
          opens: 0,
          clicks: 0,
          bounces: 0,
          unsubscribes: 0,
          openRate: 0,
          clickRate: 0,
          note: 'Mock data - campaign not found',
        };
      }

      logger.error('Mailchimp analytics failed:', error);
      throw error;
    }
  }

  async getCampaigns(count = 10) {
    if (!this.isConfigured()) {
      throw new Error('Mailchimp not configured');
    }

    try {
      const mailchimp = require('mailchimp-api-v3');
      const mc = new mailchimp(process.env.MAILCHIMP_API_KEY);

      const response = await mc.get('/campaigns', { count });

      logger.info(`Retrieved ${response.campaigns.length} campaigns from Mailchimp`);

      return {
        success: true,
        count: response.campaigns.length,
        campaigns: response.campaigns.map(campaign => ({
          id: campaign.id,
          subject: campaign.settings.subject_line,
          status: campaign.status,
          send_time: campaign.send_time,
        })),
      };
    } catch (error) {
      logger.error('Mailchimp campaigns retrieval failed:', error);
      throw error;
    }
  }
}

// Export for use in other modules
module.exports = ServiceWrapper;

// Command line interface for testing
if (require.main === module) {
  const wrapper = new ServiceWrapper();
  const command = process.argv[2];
  const service = process.argv[3];

  async function run() {
    switch (command) {
      case 'status':
        const statuses = wrapper.getAllServiceStatuses();
        console.log('Service Statuses:');
        console.log(JSON.stringify(statuses, null, 2));
        break;

      case 'health':
        if (!service) {
          console.log('Usage: node service-wrapper.js health <service>');
          console.log('Available services: airtable, claude, gmail, mailchimp');
          return;
        }

        try {
          const serviceInstance = wrapper.getService(service);
          const health = await serviceInstance.healthCheck();
          console.log(`${service} health:`, JSON.stringify(health, null, 2));
        } catch (error) {
          console.error(`Health check failed:`, error.message);
        }
        break;

      case 'test':
        if (!service) {
          console.log('Usage: node service-wrapper.js test <service>');
          return;
        }

        try {
          const serviceInstance = wrapper.getService(service);

          switch (service) {
            case 'claude':
              const response = await serviceInstance.generateResponse(
                'Hello from the service wrapper test!'
              );
              console.log('Claude response:', response);
              break;

            case 'gmail':
              const emails = await serviceInstance.searchEmails('test', 3);
              console.log('Gmail search:', JSON.stringify(emails, null, 2));
              break;

            case 'airtable':
              const contacts = await serviceInstance.syncContacts();
              console.log('Airtable sync:', JSON.stringify(contacts, null, 2));
              break;

            case 'mailchimp':
              const campaigns = await serviceInstance.getCampaigns(3);
              console.log('Mailchimp campaigns:', JSON.stringify(campaigns, null, 2));
              break;

            default:
              console.log(`Test not implemented for ${service}`);
          }
        } catch (error) {
          console.error(`Test failed:`, error.message);
        }
        break;

      default:
        console.log('Usage: node service-wrapper.js [status|health|test] [service]');
        console.log('');
        console.log('Commands:');
        console.log('  status           - Show all service configuration status');
        console.log('  health <service> - Check health of specific service');
        console.log('  test <service>   - Test functionality of specific service');
        console.log('');
        console.log('Services: airtable, claude, gmail, mailchimp');
    }
  }

  run().catch(console.error);
}
