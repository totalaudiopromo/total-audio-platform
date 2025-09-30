#!/usr/bin/env node
/**
 * Liberty Gmail Autopilot
 * Runs hourly to maintain inbox organization automatically
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class LibertyAutopilot {
  constructor() {
    // Use existing OAuth credentials
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      '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',
      'http://localhost:3001/callback'
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    // Load existing tokens
    const tokenPath = path.join(__dirname, '../radio-promo/gmail-token.json');
    if (fs.existsSync(tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      this.oauth2Client.setCredentials(tokens);
    } else {
      throw new Error('❌ Gmail tokens not found');
    }

    // Log file
    this.logFile = path.join(__dirname, 'autopilot.log');

    // Track actions
    this.actions = [];
  }

  /**
   * Log with timestamp
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);

    // Append to log file
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  /**
   * Get label ID by name
   */
  async getLabelId(labelName) {
    const response = await this.gmail.users.labels.list({ userId: 'me' });
    const label = response.data.labels.find(l => l.name === labelName);
    return label ? label.id : null;
  }

  /**
   * Search for recent emails matching query
   */
  async searchRecentEmails(query, hours = 2) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: `${query} newer_than:${hours}h`,
        maxResults: 50
      });

      return response.data.messages || [];
    } catch (error) {
      this.log(`❌ Search failed for "${query}": ${error.message}`);
      return [];
    }
  }

  /**
   * Modify labels on a message
   */
  async modifyLabels(messageId, addLabelIds = [], removeLabelIds = []) {
    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds,
          removeLabelIds
        }
      });
      return true;
    } catch (error) {
      this.log(`❌ Failed to modify ${messageId}: ${error.message}`);
      return false;
    }
  }

  /**
   * Process Otter AI emails
   */
  async processOtterAI() {
    const messages = await this.searchRecentEmails('from:otter.ai');
    if (messages.length === 0) return;

    this.log(`Found ${messages.length} new Otter AI emails`);

    const otterLabel = await this.getLabelId('Personal Tools/Otter AI');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');

    for (const message of messages) {
      const addLabels = otterLabel ? [otterLabel] : [];
      const removeLabels = stationFeedbackLabel ? [stationFeedbackLabel] : [];

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        this.actions.push('Otter AI: moved to Personal Tools');
      }
    }
  }

  /**
   * Process Gemini emails
   */
  async processGemini() {
    const messages = await this.searchRecentEmails('from:gemini OR subject:"Gemini"');
    if (messages.length === 0) return;

    this.log(`Found ${messages.length} new Gemini emails`);

    const geminiLabel = await this.getLabelId('Personal Tools/Gemini');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');

    for (const message of messages) {
      const addLabels = geminiLabel ? [geminiLabel] : [];
      const removeLabels = stationFeedbackLabel ? [stationFeedbackLabel] : [];

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        this.actions.push('Gemini: moved to Personal Tools');
      }
    }
  }

  /**
   * Process WARM marketing
   */
  async processWARM() {
    const messages = await this.searchRecentEmails('from:WARM OR from:warmmusichelp.com');
    if (messages.length === 0) return;

    this.log(`Found ${messages.length} new WARM emails`);

    const warmLabel = await this.getLabelId('Marketing Junk/WARM');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');
    const inboxLabel = await this.getLabelId('INBOX');

    for (const message of messages) {
      const addLabels = warmLabel ? [warmLabel] : [];
      const removeLabels = [];
      if (stationFeedbackLabel) removeLabels.push(stationFeedbackLabel);
      if (inboxLabel) removeLabels.push(inboxLabel);

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        // Mark as read
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: message.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        }).catch(() => {});

        this.actions.push('WARM: archived to Marketing Junk');
      }
    }
  }

  /**
   * Process Machina marketing
   */
  async processMachina() {
    const messages = await this.searchRecentEmails('from:machina OR subject:"Machina Account"');
    if (messages.length === 0) return;

    this.log(`Found ${messages.length} new Machina emails`);

    const machinaLabel = await this.getLabelId('Marketing Junk/Machina');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');
    const inboxLabel = await this.getLabelId('INBOX');

    for (const message of messages) {
      const addLabels = machinaLabel ? [machinaLabel] : [];
      const removeLabels = [];
      if (stationFeedbackLabel) removeLabels.push(stationFeedbackLabel);
      if (inboxLabel) removeLabels.push(inboxLabel);

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        // Mark as read
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: message.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        }).catch(() => {});

        this.actions.push('Machina: archived to Marketing Junk');
      }
    }
  }

  /**
   * Process other marketing junk
   */
  async processOtherMarketing() {
    const messages = await this.searchRecentEmails('from:musicreaction OR subject:"grow your audience" -from:libertymusicpr.com');
    if (messages.length === 0) return;

    this.log(`Found ${messages.length} new marketing emails`);

    const otherLabel = await this.getLabelId('Marketing Junk/Other');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');
    const inboxLabel = await this.getLabelId('INBOX');

    for (const message of messages) {
      const addLabels = otherLabel ? [otherLabel] : [];
      const removeLabels = [];
      if (stationFeedbackLabel) removeLabels.push(stationFeedbackLabel);
      if (inboxLabel) removeLabels.push(inboxLabel);

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        // Mark as read
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: message.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        }).catch(() => {});

        this.actions.push('Marketing: archived to Marketing Junk');
      }
    }
  }

  /**
   * Auto-create campaign sub-labels
   */
  async autoCreateCampaignLabels() {
    // Find new campaign assignments
    const messages = await this.searchRecentEmails('cc:chrisschofield@libertymusicpr.com (subject:R4 OR subject:R6) -subject:Re:');

    if (messages.length === 0) return;

    this.log(`Found ${messages.length} new campaign assignments`);

    for (const message of messages) {
      try {
        // Get message details to extract subject
        const details = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'metadata',
          metadataHeaders: ['Subject']
        });

        const subject = details.data.payload.headers.find(h => h.name === 'Subject')?.value || '';

        // Extract campaign name (e.g., "Artist - Release" from subject)
        const campaignMatch = subject.match(/^(?:Re: |Fwd: )?(.*?)(?:\s*-\s*R[46])?$/i);
        if (campaignMatch && campaignMatch[1]) {
          const campaignName = campaignMatch[1].trim();
          const labelName = `Liberty/Active Campaigns/${campaignName}`;

          // Try to create the sub-label
          try {
            await this.gmail.users.labels.create({
              userId: 'me',
              requestBody: {
                name: labelName,
                labelListVisibility: 'labelShow',
                messageListVisibility: 'show'
              }
            });

            this.log(`✅ Created campaign label: ${labelName}`);
            this.actions.push(`Campaign label created: ${campaignName}`);
          } catch (error) {
            if (error.code !== 409) { // Ignore "already exists" errors
              this.log(`⚠️  Failed to create label ${labelName}: ${error.message}`);
            }
          }
        }
      } catch (error) {
        this.log(`⚠️  Failed to process campaign ${message.id}: ${error.message}`);
      }
    }
  }

  /**
   * Run autopilot
   */
  async run() {
    this.log('🚁 Liberty Gmail Autopilot starting...');
    this.actions = [];

    try {
      await this.processOtterAI();
      await this.processGemini();
      await this.processWARM();
      await this.processMachina();
      await this.processOtherMarketing();
      await this.autoCreateCampaignLabels();

      if (this.actions.length === 0) {
        this.log('✅ No new emails to process - inbox is clean');
      } else {
        this.log(`✅ Autopilot complete - ${this.actions.length} actions taken:`);
        this.actions.forEach(action => this.log(`  - ${action}`));
      }

    } catch (error) {
      this.log(`❌ Autopilot failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test the autopilot
   */
  async test() {
    this.log('🧪 Testing autopilot...');

    try {
      // Just check we can access Gmail
      const labels = await this.gmail.users.labels.list({ userId: 'me' });
      this.log(`✅ Gmail access OK - ${labels.data.labels.length} labels found`);

      // Check our labels exist
      const requiredLabels = [
        'Personal Tools/Otter AI',
        'Personal Tools/Gemini',
        'Marketing Junk/WARM',
        'Marketing Junk/Machina',
        'Liberty/Station Feedback'
      ];

      for (const labelName of requiredLabels) {
        const labelId = await this.getLabelId(labelName);
        if (labelId) {
          this.log(`✅ Label exists: ${labelName}`);
        } else {
          this.log(`⚠️  Label missing: ${labelName}`);
        }
      }

      this.log('✅ Autopilot test complete');
      return true;

    } catch (error) {
      this.log(`❌ Test failed: ${error.message}`);
      return false;
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const autopilot = new LibertyAutopilot();

  try {
    switch (command) {
      case 'run':
        await autopilot.run();
        break;

      case 'test':
        await autopilot.test();
        break;

      default:
        console.log('🚁 Liberty Gmail Autopilot');
        console.log('');
        console.log('Commands:');
        console.log('  run   - Run autopilot (processes recent emails)');
        console.log('  test  - Test autopilot setup');
        console.log('');
        console.log('Example: node liberty-autopilot.js run');
        console.log('');
        console.log('For overnight automation, add to crontab:');
        console.log('  0 * * * * cd /path/to/gmail-setup && node liberty-autopilot.js run');
    }

  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = LibertyAutopilot;
