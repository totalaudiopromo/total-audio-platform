#!/usr/bin/env node

/**
 * Follow-up Agent
 * 
 * Manages automated follow-up sequences for radio promo campaigns
 * Integrates with email tracking and response analysis
 */

const AutoFollowupSystem = require('../integrations/auto-followup-system');

class FollowupAgent {
  constructor(options = {}) {
    this.name = 'FollowupAgent';
    this.version = '1.0.0';
    this.orchestrator = options.orchestrator;
    this.config = options.config || {};
    this.logger = options.logger || console.log;
    
    // Initialize follow-up system
    this.followupSystem = new AutoFollowupSystem();
    
    // Follow-up strategies
    this.strategies = {
      aggressive: {
        name: 'Aggressive',
        description: 'Quick follow-ups for time-sensitive campaigns',
        timing: [1, 3, 7, 14, 30],
        maxFollowups: 5,
        tone: 'persistent'
      },
      moderate: {
        name: 'Moderate',
        description: 'Balanced approach for most campaigns',
        timing: [3, 7, 14, 30, 60],
        maxFollowups: 5,
        tone: 'professional'
      },
      gentle: {
        name: 'Gentle',
        description: 'Slow, relationship-focused approach',
        timing: [7, 14, 30, 60, 90],
        maxFollowups: 5,
        tone: 'friendly'
      },
      relationship: {
        name: 'Relationship Building',
        description: 'Long-term relationship maintenance',
        timing: [14, 30, 60, 90, 180],
        maxFollowups: 5,
        tone: 'warm'
      }
    };
  }

  async initialize() {
    this.logger('🔄 Initializing Follow-up Agent...');
    
    try {
      // Test follow-up system
      const health = await this.followupSystem.healthCheck();
      if (health.status !== 'healthy') {
        this.logger('⚠️  Follow-up system not healthy - follow-ups may not work');
      }
      
      this.logger('✅ Follow-up Agent initialized');
      return true;
    } catch (error) {
      this.logger('❌ Failed to initialize Follow-up Agent:', error.message);
      return false;
    }
  }

  /**
   * Start follow-up sequence for a campaign
   */
  async startFollowupSequence(campaignData, contacts, options = {}) {
    this.logger(`🔄 Starting follow-up sequence for campaign: ${campaignData.campaignId}`);
    
    try {
      // Determine strategy based on campaign type and budget
      const strategy = this.determineStrategy(campaignData, options);
      
      // Start the follow-up sequence
      const config = await this.followupSystem.startFollowupSequence(
        campaignData.campaignId,
        contacts,
        {
          artistName: campaignData.artistName,
          trackTitle: campaignData.trackTitle,
          genre: campaignData.genre,
          yourName: options.yourName || 'Chris',
          strategy: strategy,
          maxFollowups: options.maxFollowups || 5
        }
      );
      
      this.logger(`✅ Follow-up sequence started with ${strategy} strategy`);
      
      // Notify orchestrator
      if (this.orchestrator) {
        this.orchestrator.emit('followupStarted', {
          campaignId: campaignData.campaignId,
          strategy: strategy,
          contactCount: contacts.length
        });
      }
      
      return config;
      
    } catch (error) {
      this.logger('❌ Failed to start follow-up sequence:', error.message);
      throw error;
    }
  }

  /**
   * Determine best follow-up strategy
   */
  determineStrategy(campaignData, options) {
    // Use explicit strategy if provided
    if (options.strategy && this.strategies[options.strategy]) {
      return options.strategy;
    }
    
    // Determine based on campaign characteristics
    const budget = campaignData.budget || 0;
    const urgency = campaignData.urgency || 'normal';
    const genre = campaignData.genre || 'unknown';
    
    // High budget + urgent = aggressive
    if (budget > 1000 && urgency === 'high') {
      return 'aggressive';
    }
    
    // High budget + normal = moderate
    if (budget > 500 && urgency === 'normal') {
      return 'moderate';
    }
    
    // Low budget + any urgency = gentle
    if (budget < 500) {
      return 'gentle';
    }
    
    // Relationship building for established contacts
    if (options.relationshipBuilding) {
      return 'relationship';
    }
    
    // Default to moderate
    return 'moderate';
  }

  /**
   * Update contact response
   */
  async updateContactResponse(contactId, responseType, campaignId, additionalData = {}) {
    this.logger(`📝 Updating response for contact ${contactId}: ${responseType}`);
    
    try {
      // Update in follow-up system
      this.followupSystem.updateContactResponse(contactId, responseType, campaignId);
      
      // Record additional data
      if (additionalData.notes) {
        this.followupSystem.recordInteraction(contactId, {
          type: 'response_notes',
          notes: additionalData.notes,
          timestamp: Date.now()
        });
      }
      
      // Notify orchestrator
      if (this.orchestrator) {
        this.orchestrator.emit('contactResponse', {
          contactId,
          responseType,
          campaignId,
          additionalData
        });
      }
      
      this.logger(`✅ Response updated for ${contactId}`);
      
    } catch (error) {
      this.logger('❌ Failed to update contact response:', error.message);
      throw error;
    }
  }

  /**
   * Get follow-up status for a campaign
   */
  getFollowupStatus(campaignId) {
    return this.followupSystem.getFollowupStatus(campaignId);
  }

  /**
   * Get contact history
   */
  getContactHistory(contactId) {
    return this.followupSystem.getContactHistory(contactId);
  }

  /**
   * Get all active follow-up campaigns
   */
  getActiveCampaigns() {
    const campaigns = [];
    
    for (const [campaignId, config] of this.followupSystem.followupSequences) {
      if (config.status === 'active') {
        campaigns.push({
          campaignId,
          artistName: config.artistName,
          trackTitle: config.trackTitle,
          genre: config.genre,
          strategy: config.strategy,
          totalContacts: config.contacts.length,
          activeContacts: config.contacts.filter(c => c.status === 'active').length,
          completedContacts: config.contacts.filter(c => c.status === 'completed').length,
          totalFollowups: config.contacts.reduce((sum, c) => sum + c.followupCount, 0),
          startDate: config.startDate
        });
      }
    }
    
    return campaigns;
  }

  /**
   * Get follow-up analytics
   */
  getFollowupAnalytics() {
    const campaigns = Array.from(this.followupSystem.followupSequences.values());
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
    
    const totalContacts = campaigns.reduce((sum, c) => sum + c.contacts.length, 0);
    const totalFollowups = campaigns.reduce((sum, c) => 
      sum + c.contacts.reduce((contactSum, contact) => contactSum + contact.followupCount, 0), 0
    );
    
    const responseTypes = {};
    campaigns.forEach(campaign => {
      campaign.contacts.forEach(contact => {
        const type = contact.responseType;
        responseTypes[type] = (responseTypes[type] || 0) + 1;
      });
    });
    
    const strategyUsage = {};
    campaigns.forEach(campaign => {
      const strategy = campaign.strategy;
      strategyUsage[strategy] = (strategyUsage[strategy] || 0) + 1;
    });
    
    return {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalContacts,
      totalFollowups,
      averageFollowupsPerContact: totalContacts > 0 ? totalFollowups / totalContacts : 0,
      responseTypes,
      strategyUsage,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Pause follow-up sequence
   */
  pauseFollowupSequence(campaignId) {
    const config = this.followupSystem.followupSequences.get(campaignId);
    if (config) {
      config.status = 'paused';
      this.logger(`⏸️  Paused follow-up sequence for campaign: ${campaignId}`);
    }
  }

  /**
   * Resume follow-up sequence
   */
  resumeFollowupSequence(campaignId) {
    const config = this.followupSystem.followupSequences.get(campaignId);
    if (config) {
      config.status = 'active';
      this.logger(`▶️  Resumed follow-up sequence for campaign: ${campaignId}`);
    }
  }

  /**
   * Stop follow-up sequence
   */
  stopFollowupSequence(campaignId) {
    const config = this.followupSystem.followupSequences.get(campaignId);
    if (config) {
      config.status = 'stopped';
      this.logger(`🛑 Stopped follow-up sequence for campaign: ${campaignId}`);
    }
  }

  /**
   * Get follow-up templates
   */
  getFollowupTemplates() {
    return this.followupSystem.templates;
  }

  /**
   * Add custom follow-up template
   */
  addCustomTemplate(templateKey, template) {
    this.followupSystem.templates[templateKey] = template;
    this.logger(`📝 Added custom template: ${templateKey}`);
  }

  /**
   * Get available strategies
   */
  getStrategies() {
    return this.strategies;
  }

  /**
   * Test follow-up system
   */
  async testFollowupSystem() {
    this.logger('🧪 Testing follow-up system...');
    
    try {
      // Test with mock data
      const testCampaign = {
        campaignId: 'test-followup-' + Date.now(),
        artistName: 'Test Artist',
        trackTitle: 'Test Track',
        genre: 'Electronic'
      };
      
      const testContacts = [
        {
          id: 'test-contact-1',
          name: 'Test Contact 1',
          email: 'test1@example.com',
          station: 'Test Station 1'
        },
        {
          id: 'test-contact-2',
          name: 'Test Contact 2',
          email: 'test2@example.com',
          station: 'Test Station 2'
        }
      ];
      
      // Start test sequence
      const config = await this.startFollowupSequence(testCampaign, testContacts, {
        strategy: 'moderate',
        maxFollowups: 3
      });
      
      // Get status
      const status = this.getFollowupStatus(testCampaign.campaignId);
      
      // Clean up test data
      this.stopFollowupSequence(testCampaign.campaignId);
      
      this.logger('✅ Follow-up system test completed');
      return {
        success: true,
        config,
        status
      };
      
    } catch (error) {
      this.logger('❌ Follow-up system test failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async healthCheck() {
    const followupHealth = await this.followupSystem.healthCheck();
    const analytics = this.getFollowupAnalytics();
    
    return {
      status: 'healthy',
      agent: this.name,
      version: this.version,
      followupSystem: followupHealth,
      analytics: {
        totalCampaigns: analytics.totalCampaigns,
        activeCampaigns: analytics.activeCampaigns,
        totalContacts: analytics.totalContacts,
        totalFollowups: analytics.totalFollowups
      },
      timestamp: new Date().toISOString()
    };
  }

  async shutdown() {
    this.logger('🛑 Shutting down Follow-up Agent...');
    await this.followupSystem.shutdown();
    this.logger('✅ Follow-up Agent shutdown complete');
  }
}

module.exports = FollowupAgent;
