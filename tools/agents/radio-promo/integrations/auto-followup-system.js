#!/usr/bin/env node

/**
 * Automated Follow-up System
 *
 * Smart follow-up sequences that adapt based on response patterns
 * Handles different follow-up strategies for different engagement levels
 * Maintains relationships even without immediate success
 */

const fs = require('fs');
const path = require('path');

class AutoFollowupSystem {
  constructor() {
    this.followupSequences = new Map(); // campaignId -> followup config
    this.contactHistory = new Map(); // contactId -> interaction history
    this.responsePatterns = new Map(); // contactId -> response patterns
    this.scheduledFollowups = new Map(); // followupId -> scheduled time

    // Data persistence
    this.dataFile = path.join(__dirname, '..', 'data', 'followup-data.json');
    this.loadData();

    // Follow-up templates
    this.templates = this.initializeTemplates();

    // Timing strategies
    this.timingStrategies = {
      aggressive: [1, 3, 7, 14, 30], // days
      moderate: [3, 7, 14, 30, 60],
      gentle: [7, 14, 30, 60, 90],
      relationship: [14, 30, 60, 90, 180],
    };

    // Response types
    this.responseTypes = {
      no_response: 'no_response',
      opened_no_reply: 'opened_no_reply',
      replied_positive: 'replied_positive',
      replied_negative: 'replied_negative',
      replied_neutral: 'replied_neutral',
      bounced: 'bounced',
      unsubscribed: 'unsubscribed',
    };

    // Start the follow-up processor
    this.startFollowupProcessor();
  }

  /**
   * Initialize follow-up templates
   */
  initializeTemplates() {
    return {
      // Initial follow-up (no response)
      no_response_1: {
        subject: 'Quick follow-up on {artistName} - {trackTitle}',
        body: `Hi {contactName},

I hope you're well! I wanted to follow up on my email about {artistName}'s new track "{trackTitle}".

I know you're busy, but I thought you might be interested in this {genre} track that's been getting great feedback from other stations.

Would you like me to send over the press kit and MP3?

Best regards,
{yourName}`,
        tone: 'friendly',
        urgency: 'low',
      },

      no_response_2: {
        subject: 'Still interested in {artistName}?',
        body: `Hi {contactName},

I hope this finds you well. I wanted to check if you had a chance to listen to {artistName}'s track "{trackTitle}" that I sent over?

I know you receive a lot of music submissions, but this one really stands out in the {genre} space.

If you're interested, I can send over:
- High-quality MP3
- Press photos
- Artist bio
- Social media links

Let me know if you'd like to hear more!

Best,
{yourName}`,
        tone: 'persistent',
        urgency: 'medium',
      },

      no_response_3: {
        subject: 'Last chance for {artistName} - {trackTitle}',
        body: `Hi {contactName},

I hope you're doing well. This is my final follow-up about {artistName}'s track "{trackTitle}".

I understand if this isn't the right fit for your station, but I wanted to give you one last opportunity to hear it before I move on to other stations.

If you're interested, just reply and I'll send everything over immediately.

If not, no worries - I'll keep you in mind for future releases that might be a better fit.

Thanks for your time,
{yourName}`,
        tone: 'final',
        urgency: 'high',
      },

      // Opened but no reply
      opened_no_reply_1: {
        subject: 'I see you opened my email about {artistName}',
        body: `Hi {contactName},

I noticed you opened my email about {artistName}'s new track "{trackTitle}" - that's great!

I'm curious what you thought of it. Was it the right sound for your station, or would you prefer something different?

I have a few other tracks in the {genre} space that might be more suitable if this one wasn't quite right.

Let me know your thoughts!

Best,
{yourName}`,
        tone: 'curious',
        urgency: 'medium',
      },

      // Positive response
      replied_positive_1: {
        subject: 'Thanks for the interest in {artistName}!',
        body: `Hi {contactName},

Fantastic! I'm so glad you're interested in {artistName}'s track "{trackTitle}".

I'll send over the full press kit right away, including:
- High-quality MP3
- Press photos
- Artist bio and social links
- Any additional info you need

Is there anything specific you'd like to know about the artist or track?

Looking forward to hearing it on {stationName}!

Best regards,
{yourName}`,
        tone: 'enthusiastic',
        urgency: 'high',
      },

      // Negative response
      replied_negative_1: {
        subject: 'Thanks for the feedback on {artistName}',
        body: `Hi {contactName},

Thanks for getting back to me about {artistName}'s track "{trackTitle}".

I completely understand it's not the right fit for {stationName} at the moment. I appreciate you taking the time to listen and respond.

I'll keep you in mind for future releases that might be more suitable for your station's sound.

Thanks again for your time,
{yourName}`,
        tone: 'gracious',
        urgency: 'low',
      },

      // Relationship building
      relationship_1: {
        subject: "Hope you're well - new music coming soon",
        body: `Hi {contactName},

I hope you're doing well! I wanted to reach out and let you know that {artistName} has some new music in the works that I think would be perfect for {stationName}.

I know you weren't interested in the last track, but this new one has a different vibe that might be more your style.

Would you like me to send it over when it's ready?

Best regards,
{yourName}`,
        tone: 'friendly',
        urgency: 'low',
      },
    };
  }

  /**
   * Start follow-up sequence for a campaign
   */
  async startFollowupSequence(campaignId, contacts, options = {}) {
    console.log(`🔄 Starting follow-up sequence for campaign: ${campaignId}`);

    const config = {
      campaignId,
      contacts: contacts.map(contact => ({
        id: contact.id || contact.email,
        name: contact.name || contact.contactName,
        email: contact.email,
        station: contact.station || contact.stationName,
        genre: contact.genre || options.genre,
        responseType: this.responseTypes.no_response,
        followupCount: 0,
        lastContact: Date.now(),
        nextFollowup: null,
        status: 'active',
      })),
      artistName: options.artistName,
      trackTitle: options.trackTitle,
      genre: options.genre,
      yourName: options.yourName || 'Chris',
      strategy: options.strategy || 'moderate',
      maxFollowups: options.maxFollowups || 5,
      startDate: Date.now(),
      status: 'active',
    };

    this.followupSequences.set(campaignId, config);

    // Schedule first follow-ups
    await this.scheduleNextFollowups(campaignId);

    this.saveData();
    console.log(`✅ Follow-up sequence started for ${contacts.length} contacts`);

    return config;
  }

  /**
   * Schedule next follow-ups for a campaign
   */
  async scheduleNextFollowups(campaignId) {
    const config = this.followupSequences.get(campaignId);
    if (!config) return;

    const timing = this.timingStrategies[config.strategy] || this.timingStrategies.moderate;

    for (const contact of config.contacts) {
      if (contact.status !== 'active' || contact.followupCount >= config.maxFollowups) {
        continue;
      }

      const nextFollowupDays = timing[contact.followupCount] || timing[timing.length - 1];
      const nextFollowupTime = Date.now() + nextFollowupDays * 24 * 60 * 60 * 1000;

      contact.nextFollowup = nextFollowupTime;

      // Schedule the follow-up
      const followupId = `${campaignId}-${contact.id}-${contact.followupCount + 1}`;
      this.scheduledFollowups.set(followupId, {
        campaignId,
        contactId: contact.id,
        followupNumber: contact.followupCount + 1,
        scheduledTime: nextFollowupTime,
        status: 'scheduled',
      });
    }
  }

  /**
   * Process follow-ups (called by the processor)
   */
  async processFollowups() {
    const now = Date.now();
    const dueFollowups = [];

    // Find due follow-ups
    for (const [followupId, followup] of this.scheduledFollowups) {
      if (followup.status === 'scheduled' && followup.scheduledTime <= now) {
        dueFollowups.push(followup);
      }
    }

    // Process each due follow-up
    for (const followup of dueFollowups) {
      await this.sendFollowup(followup);
    }
  }

  /**
   * Send a specific follow-up
   */
  async sendFollowup(followup) {
    const config = this.followupSequences.get(followup.campaignId);
    if (!config) return;

    const contact = config.contacts.find(c => c.id === followup.contactId);
    if (!contact) return;

    // Get the appropriate template
    const template = this.getFollowupTemplate(contact, followup.followupNumber);
    if (!template) {
      console.log(
        `⚠️  No template found for ${contact.responseType} follow-up ${followup.followupNumber}`
      );
      return;
    }

    // Personalize the content
    const personalizedContent = this.personalizeContent(template, {
      contactName: contact.name,
      artistName: config.artistName,
      trackTitle: config.trackTitle,
      genre: config.genre,
      stationName: contact.station,
      yourName: config.yourName,
    });

    // Send the follow-up (integrate with your email system)
    const emailData = {
      to: contact.email,
      subject: personalizedContent.subject,
      body: personalizedContent.body,
      campaignId: followup.campaignId,
      followupNumber: followup.followupNumber,
      contactId: contact.id,
    };

    try {
      // This would integrate with your email sending system
      await this.sendEmail(emailData);

      // Update contact status
      contact.followupCount++;
      contact.lastContact = Date.now();
      contact.nextFollowup = null;

      // Mark follow-up as sent
      followup.status = 'sent';
      followup.sentAt = Date.now();

      // Record interaction
      this.recordInteraction(contact.id, {
        type: 'followup_sent',
        followupNumber: followup.followupNumber,
        template: template.tone,
        timestamp: Date.now(),
      });

      console.log(
        `📧 Sent follow-up ${followup.followupNumber} to ${contact.name} (${contact.email})`
      );

      // Schedule next follow-up if not at max
      if (contact.followupCount < config.maxFollowups) {
        await this.scheduleNextFollowup(contact, config);
      } else {
        contact.status = 'completed';
        console.log(`✅ Completed follow-up sequence for ${contact.name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to send follow-up to ${contact.name}:`, error.message);
      followup.status = 'failed';
      followup.error = error.message;
    }
  }

  /**
   * Get appropriate follow-up template
   */
  getFollowupTemplate(contact, followupNumber) {
    const responseType = contact.responseType;
    const templateKey = `${responseType}_${followupNumber}`;

    // Try specific template first
    if (this.templates[templateKey]) {
      return this.templates[templateKey];
    }

    // Fallback to generic templates
    if (responseType === this.responseTypes.no_response) {
      return this.templates[`no_response_${Math.min(followupNumber, 3)}`];
    }

    if (responseType === this.responseTypes.opened_no_reply) {
      return this.templates[`opened_no_reply_${Math.min(followupNumber, 2)}`];
    }

    if (responseType === this.responseTypes.replied_positive) {
      return this.templates[`replied_positive_${Math.min(followupNumber, 2)}`];
    }

    if (responseType === this.responseTypes.replied_negative) {
      return this.templates[`replied_negative_${Math.min(followupNumber, 2)}`];
    }

    // Default to relationship building
    return this.templates[`relationship_${Math.min(followupNumber, 2)}`];
  }

  /**
   * Personalize content with contact data
   */
  personalizeContent(template, data) {
    let subject = template.subject;
    let body = template.body;

    // Replace placeholders
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value || '');
      body = body.replace(new RegExp(placeholder, 'g'), value || '');
    });

    return { subject, body };
  }

  /**
   * Send email (integrate with your email system)
   */
  async sendEmail(emailData) {
    // This would integrate with your email sending system
    // For now, just log the email
    console.log(`📧 EMAIL TO SEND:`);
    console.log(`   To: ${emailData.to}`);
    console.log(`   Subject: ${emailData.subject}`);
    console.log(`   Body: ${emailData.body.substring(0, 200)}...`);
    console.log(`   Campaign: ${emailData.campaignId}`);
    console.log(`   Follow-up: ${emailData.followupNumber}`);

    // In real implementation, this would call your email service
    // await this.emailService.send(emailData);

    return { success: true, messageId: 'mock-' + Date.now() };
  }

  /**
   * Record interaction with contact
   */
  recordInteraction(contactId, interaction) {
    if (!this.contactHistory.has(contactId)) {
      this.contactHistory.set(contactId, []);
    }

    const history = this.contactHistory.get(contactId);
    history.push(interaction);

    // Keep only last 50 interactions
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
  }

  /**
   * Update contact response type
   */
  updateContactResponse(contactId, responseType, campaignId) {
    const config = this.followupSequences.get(campaignId);
    if (!config) return;

    const contact = config.contacts.find(c => c.id === contactId);
    if (!contact) return;

    contact.responseType = responseType;

    // Record the response
    this.recordInteraction(contactId, {
      type: 'response_received',
      responseType,
      timestamp: Date.now(),
    });

    // Adjust follow-up strategy based on response
    this.adjustFollowupStrategy(contact, responseType);

    console.log(`📝 Updated response type for ${contact.name}: ${responseType}`);
  }

  /**
   * Adjust follow-up strategy based on response
   */
  adjustFollowupStrategy(contact, responseType) {
    switch (responseType) {
      case this.responseTypes.replied_positive:
        // Reduce frequency, focus on relationship building
        contact.strategy = 'relationship';
        break;
      case this.responseTypes.replied_negative:
        // Stop aggressive follow-ups, switch to relationship building
        contact.strategy = 'relationship';
        contact.followupCount = Math.max(contact.followupCount - 1, 0);
        break;
      case this.responseTypes.opened_no_reply:
        // Increase urgency slightly
        contact.strategy = 'moderate';
        break;
      case this.responseTypes.no_response:
        // Continue with current strategy
        break;
    }
  }

  /**
   * Get follow-up status for a campaign
   */
  getFollowupStatus(campaignId) {
    const config = this.followupSequences.get(campaignId);
    if (!config) return null;

    const activeContacts = config.contacts.filter(c => c.status === 'active');
    const completedContacts = config.contacts.filter(c => c.status === 'completed');
    const totalFollowups = config.contacts.reduce((sum, c) => sum + c.followupCount, 0);

    return {
      campaignId,
      status: config.status,
      totalContacts: config.contacts.length,
      activeContacts: activeContacts.length,
      completedContacts: completedContacts.length,
      totalFollowups,
      averageFollowupsPerContact: totalFollowups / config.contacts.length,
      strategy: config.strategy,
      startDate: config.startDate,
    };
  }

  /**
   * Get contact history
   */
  getContactHistory(contactId) {
    return this.contactHistory.get(contactId) || [];
  }

  /**
   * Start the follow-up processor
   */
  startFollowupProcessor() {
    // Check for due follow-ups every minute
    setInterval(() => {
      this.processFollowups();
    }, 60 * 1000);

    console.log('🔄 Follow-up processor started');
  }

  /**
   * Data persistence
   */
  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.followupSequences = new Map(data.followupSequences || []);
        this.contactHistory = new Map(data.contactHistory || []);
        this.scheduledFollowups = new Map(data.scheduledFollowups || []);
        console.log(`📚 Loaded follow-up data: ${this.followupSequences.size} campaigns`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load follow-up data:', error.message);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = {
        followupSequences: Array.from(this.followupSequences.entries()),
        contactHistory: Array.from(this.contactHistory.entries()),
        scheduledFollowups: Array.from(this.scheduledFollowups.entries()),
        lastSaved: Date.now(),
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save follow-up data:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const activeCampaigns = Array.from(this.followupSequences.values()).filter(
      config => config.status === 'active'
    );

    const scheduledFollowups = Array.from(this.scheduledFollowups.values()).filter(
      f => f.status === 'scheduled'
    );

    return {
      status: 'healthy',
      activeCampaigns: activeCampaigns.length,
      scheduledFollowups: scheduledFollowups.length,
      totalContacts: activeCampaigns.reduce((sum, config) => sum + config.contacts.length, 0),
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Shutdown
   */
  async shutdown() {
    this.saveData();
    console.log('🛑 Auto follow-up system shutdown complete');
  }
}

module.exports = AutoFollowupSystem;
