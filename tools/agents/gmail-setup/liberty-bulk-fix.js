#!/usr/bin/env node
/**
 * Liberty Bulk Fix - Fix ALL Misclassified Emails
 * One-time cleanup of existing mess
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class LibertyBulkFix {
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
      console.log('✅ OAuth tokens loaded');
    } else {
      throw new Error('❌ Gmail tokens not found');
    }

    // Track what we fix
    this.stats = {
      otterFixed: 0,
      geminiFixed: 0,
      warmFixed: 0,
      machinaFixed: 0,
      otherMarketingFixed: 0,
      stationFeedbackCleaned: 0,
      total: 0
    };
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
   * Search for emails matching query
   */
  async searchEmails(query, maxResults = 500) {
    const messages = [];
    let pageToken = null;

    while (messages.length < maxResults) {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: Math.min(100, maxResults - messages.length),
        pageToken: pageToken
      });

      if (response.data.messages) {
        messages.push(...response.data.messages);
      }

      if (!response.data.nextPageToken) break;
      pageToken = response.data.nextPageToken;
    }

    return messages;
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
      console.error(`Failed to modify ${messageId}:`, error.message);
      return false;
    }
  }

  /**
   * Fix Otter AI emails
   */
  async fixOtterAI() {
    console.log('\n🦦 Fixing Otter AI transcripts...');

    const query = 'from:otter.ai OR from:no-reply@otter.ai OR from:noreply@otter.ai';
    const messages = await this.searchEmails(query);

    console.log(`Found ${messages.length} Otter AI emails`);

    const otterLabel = await this.getLabelId('Personal Tools/Otter AI');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');
    const activeCampaignsLabel = await this.getLabelId('Liberty/Active Campaigns');

    for (const message of messages) {
      const addLabels = otterLabel ? [otterLabel] : [];
      const removeLabels = [];

      if (stationFeedbackLabel) removeLabels.push(stationFeedbackLabel);
      if (activeCampaignsLabel) removeLabels.push(activeCampaignsLabel);

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        this.stats.otterFixed++;
      }
    }

    console.log(`✅ Fixed ${this.stats.otterFixed} Otter AI emails`);
  }

  /**
   * Fix Gemini emails
   */
  async fixGemini() {
    console.log('\n🤖 Fixing Gemini transcripts...');

    const query = 'from:gemini OR from:google-gemini OR subject:"Gemini"';
    const messages = await this.searchEmails(query);

    console.log(`Found ${messages.length} Gemini emails`);

    const geminiLabel = await this.getLabelId('Personal Tools/Gemini');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');
    const activeCampaignsLabel = await this.getLabelId('Liberty/Active Campaigns');

    for (const message of messages) {
      const addLabels = geminiLabel ? [geminiLabel] : [];
      const removeLabels = [];

      if (stationFeedbackLabel) removeLabels.push(stationFeedbackLabel);
      if (activeCampaignsLabel) removeLabels.push(activeCampaignsLabel);

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        this.stats.geminiFixed++;
      }
    }

    console.log(`✅ Fixed ${this.stats.geminiFixed} Gemini emails`);
  }

  /**
   * Fix WARM emails
   */
  async fixWARM() {
    console.log('\n📧 Fixing WARM marketing emails...');

    const query = 'from:WARM OR from:warmmusichelp.com OR from:warmapp.co';
    const messages = await this.searchEmails(query);

    console.log(`Found ${messages.length} WARM emails`);

    const warmLabel = await this.getLabelId('Marketing Junk/WARM');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');
    const activeCampaignsLabel = await this.getLabelId('Liberty/Active Campaigns');
    const inboxLabel = await this.getLabelId('INBOX');

    for (const message of messages) {
      const addLabels = warmLabel ? [warmLabel] : [];
      const removeLabels = [];

      if (stationFeedbackLabel) removeLabels.push(stationFeedbackLabel);
      if (activeCampaignsLabel) removeLabels.push(activeCampaignsLabel);
      if (inboxLabel) removeLabels.push(inboxLabel);

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        // Also mark as read
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: message.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        }).catch(() => {});

        this.stats.warmFixed++;
      }
    }

    console.log(`✅ Fixed ${this.stats.warmFixed} WARM emails`);
  }

  /**
   * Fix Machina emails
   */
  async fixMachina() {
    console.log('\n🤖 Fixing Machina marketing emails...');

    const query = 'from:machina OR subject:"Machina Account"';
    const messages = await this.searchEmails(query);

    console.log(`Found ${messages.length} Machina emails`);

    const machinaLabel = await this.getLabelId('Marketing Junk/Machina');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');
    const activeCampaignsLabel = await this.getLabelId('Liberty/Active Campaigns');
    const inboxLabel = await this.getLabelId('INBOX');

    for (const message of messages) {
      const addLabels = machinaLabel ? [machinaLabel] : [];
      const removeLabels = [];

      if (stationFeedbackLabel) removeLabels.push(stationFeedbackLabel);
      if (activeCampaignsLabel) removeLabels.push(activeCampaignsLabel);
      if (inboxLabel) removeLabels.push(inboxLabel);

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        // Also mark as read
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: message.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        }).catch(() => {});

        this.stats.machinaFixed++;
      }
    }

    console.log(`✅ Fixed ${this.stats.machinaFixed} Machina emails`);
  }

  /**
   * Fix other marketing junk
   */
  async fixOtherMarketing() {
    console.log('\n📭 Fixing other marketing emails...');

    const query = 'from:musicreaction OR subject:"grow your audience" OR subject:"promote your music" -from:libertymusicpr.com';
    const messages = await this.searchEmails(query, 200); // Limit to 200

    console.log(`Found ${messages.length} other marketing emails`);

    const otherLabel = await this.getLabelId('Marketing Junk/Other');
    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');
    const activeCampaignsLabel = await this.getLabelId('Liberty/Active Campaigns');
    const inboxLabel = await this.getLabelId('INBOX');

    for (const message of messages) {
      const addLabels = otherLabel ? [otherLabel] : [];
      const removeLabels = [];

      if (stationFeedbackLabel) removeLabels.push(stationFeedbackLabel);
      if (activeCampaignsLabel) removeLabels.push(activeCampaignsLabel);
      if (inboxLabel) removeLabels.push(inboxLabel);

      if (await this.modifyLabels(message.id, addLabels, removeLabels)) {
        // Also mark as read
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: message.id,
          requestBody: { removeLabelIds: ['UNREAD'] }
        }).catch(() => {});

        this.stats.otherMarketingFixed++;
      }
    }

    console.log(`✅ Fixed ${this.stats.otherMarketingFixed} other marketing emails`);
  }

  /**
   * Clean up Station Feedback label
   */
  async cleanStationFeedback() {
    console.log('\n🧹 Cleaning Station Feedback label...');

    // Find all emails currently in Station Feedback that shouldn't be there
    const query = 'label:station-feedback (from:otter.ai OR from:gemini OR from:WARM OR from:machina OR from:musicreaction OR subject:"out of office")';
    const messages = await this.searchEmails(query);

    console.log(`Found ${messages.length} emails to remove from Station Feedback`);

    const stationFeedbackLabel = await this.getLabelId('Liberty/Station Feedback');

    for (const message of messages) {
      if (stationFeedbackLabel) {
        if (await this.modifyLabels(message.id, [], [stationFeedbackLabel])) {
          this.stats.stationFeedbackCleaned++;
        }
      }
    }

    console.log(`✅ Removed ${this.stats.stationFeedbackCleaned} emails from Station Feedback`);
  }

  /**
   * Run all fixes
   */
  async fixAll() {
    console.log('🚀 Liberty Bulk Fix - Cleaning up ALL misclassified emails...\n');

    try {
      await this.fixOtterAI();
      await this.fixGemini();
      await this.fixWARM();
      await this.fixMachina();
      await this.fixOtherMarketing();
      await this.cleanStationFeedback();

      // Calculate total
      this.stats.total =
        this.stats.otterFixed +
        this.stats.geminiFixed +
        this.stats.warmFixed +
        this.stats.machinaFixed +
        this.stats.otherMarketingFixed +
        this.stats.stationFeedbackCleaned;

      console.log('\n🎉 Bulk fix complete!');
      console.log('\n📊 Summary:');
      console.log(`  🦦 Otter AI: ${this.stats.otterFixed} fixed`);
      console.log(`  🤖 Gemini: ${this.stats.geminiFixed} fixed`);
      console.log(`  📧 WARM: ${this.stats.warmFixed} fixed`);
      console.log(`  🤖 Machina: ${this.stats.machinaFixed} fixed`);
      console.log(`  📭 Other Marketing: ${this.stats.otherMarketingFixed} fixed`);
      console.log(`  🧹 Station Feedback cleaned: ${this.stats.stationFeedbackCleaned}`);
      console.log(`  ✅ Total: ${this.stats.total} emails fixed\n`);

      console.log('💡 Your inbox is now properly organized!');

    } catch (error) {
      console.error('❌ Bulk fix failed:', error);
      throw error;
    }
  }

  /**
   * Dry run - show what would be fixed without actually fixing
   */
  async dryRun() {
    console.log('🧪 Dry run - showing what would be fixed...\n');

    const queries = [
      { name: 'Otter AI', query: 'from:otter.ai OR from:no-reply@otter.ai' },
      { name: 'Gemini', query: 'from:gemini OR subject:"Gemini"' },
      { name: 'WARM', query: 'from:WARM OR from:warmmusichelp.com' },
      { name: 'Machina', query: 'from:machina OR subject:"Machina Account"' },
      { name: 'Other Marketing', query: 'from:musicreaction OR subject:"grow your audience"' },
      { name: 'Wrong Station Feedback', query: 'label:station-feedback (from:otter.ai OR from:WARM OR from:machina)' }
    ];

    for (const { name, query } of queries) {
      try {
        const messages = await this.searchEmails(query);
        console.log(`${name}: ${messages.length} emails would be fixed`);
      } catch (error) {
        console.error(`Failed to check ${name}:`, error.message);
      }
    }

    console.log('\n💡 Run without --dry-run to actually fix these emails');
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const fixer = new LibertyBulkFix();

  try {
    if (command === '--dry-run') {
      await fixer.dryRun();
    } else if (command === 'fix' || command === 'all') {
      await fixer.fixAll();
    } else {
      console.log('📧 Liberty Bulk Fix');
      console.log('');
      console.log('Commands:');
      console.log('  fix        - Fix all misclassified emails (same as "all")');
      console.log('  all        - Fix all misclassified emails');
      console.log('  --dry-run  - Show what would be fixed without actually fixing');
      console.log('');
      console.log('Example: node liberty-bulk-fix.js fix');
    }

  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = LibertyBulkFix;
