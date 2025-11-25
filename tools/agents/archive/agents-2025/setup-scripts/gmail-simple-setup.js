#!/usr/bin/env node
/**
 * Simplified Gmail Setup for Chris - Liberty Freelancer
 * Based on actual workflow: You get CC'd on campaigns, respond within threads
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GmailSimpleSetup {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      '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',
      'http://localhost:3001/callback'
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const tokenPath = path.join(__dirname, 'radio-promo/gmail-token.json');
    if (fs.existsSync(tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      this.oauth2Client.setCredentials(tokens);
      console.log('✅ Gmail connected');
    } else {
      throw new Error('❌ Gmail tokens not found');
    }

    // Simple labels for your actual workflow
    this.labels = [
      { name: 'Radio Work', description: 'All radio campaigns - active' },
      { name: 'Station Responses', description: 'Real feedback from stations' },
      { name: 'Done', description: 'Completed campaigns' },
    ];

    // Simple filters for what you actually do
    this.filters = [
      {
        description: "Radio Campaigns (you get CC'd)",
        query: 'cc:chrisschofield@libertymusicpr.com (R4 OR R6)',
        addLabels: ['Radio Work'],
      },
      {
        description: 'Station Responses',
        query:
          'to:chrisschofield@libertymusicpr.com (radio OR station OR presenter OR DJ) -from:libertymusicpr.com -subject:"out of office"',
        addLabels: ['Station Responses'],
      },
    ];
  }

  async cleanup() {
    console.log("🧹 Removing complex labels you don't need...");

    const labelsResponse = await this.gmail.users.labels.list({ userId: 'me' });
    const existingLabels = labelsResponse.data.labels;

    // Remove admin labels you don't need as a freelancer
    const unnecessaryLabels = [
      'Active Campaigns',
      'Needs Action',
      'Station Auto-Responses',
      'Completed',
      'Old Campaigns',
      'Agent',
    ];

    for (const labelName of unnecessaryLabels) {
      const label = existingLabels.find(l => l.name === labelName);
      if (label) {
        try {
          await this.gmail.users.labels.delete({
            userId: 'me',
            id: label.id,
          });
          console.log(`✅ Removed: ${labelName}`);
        } catch (error) {
          console.log(`⚠️  Couldn't remove ${labelName}: ${error.message}`);
        }
      }
    }
  }

  async createSimpleLabels() {
    console.log('🏷️  Creating simple labels for your workflow...');

    for (const labelConfig of this.labels) {
      try {
        await this.gmail.users.labels.create({
          userId: 'me',
          requestBody: {
            name: labelConfig.name,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show',
          },
        });
        console.log(`✅ Created: ${labelConfig.name} - ${labelConfig.description}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Already exists: ${labelConfig.name}`);
        } else {
          console.log(`❌ Failed to create ${labelConfig.name}: ${error.message}`);
        }
      }
    }
  }

  async createSimpleFilters() {
    console.log('🔧 Creating simple filters...');

    // Get label IDs
    const labelsResponse = await this.gmail.users.labels.list({ userId: 'me' });
    const labelMap = {};
    labelsResponse.data.labels.forEach(label => {
      labelMap[label.name] = label.id;
    });

    for (const filter of this.filters) {
      try {
        const labelIds = filter.addLabels.map(name => labelMap[name]).filter(Boolean);

        await this.gmail.users.settings.filters.create({
          userId: 'me',
          requestBody: {
            criteria: { query: filter.query },
            action: { addLabelIds: labelIds },
          },
        });

        console.log(`✅ Created filter: ${filter.description}`);
      } catch (error) {
        console.log(`❌ Failed to create filter "${filter.description}": ${error.message}`);
      }
    }
  }

  async setup() {
    console.log('🎯 Setting up simplified Gmail for Liberty freelancer workflow...');
    console.log('');

    await this.cleanup();
    await this.createSimpleLabels();
    await this.createSimpleFilters();

    console.log('');
    console.log('🎉 Simple Gmail setup complete!');
    console.log('');
    console.log('📧 Your simplified workflow:');
    console.log("  🔵 Radio Work - All your campaigns (when CC'd on R4/R6)");
    console.log('  🟠 Station Responses - Real feedback from stations');
    console.log('  🟡 Done - Completed campaigns (manual)');
    console.log('');
    console.log('💡 Much cleaner! No admin clutter, just your actual work.');
    console.log('');
    console.log('🎨 Set colours in Gmail:');
    console.log('  Radio Work → Blue');
    console.log('  Station Responses → Orange');
    console.log('  Done → Yellow');
  }
}

// Run it
async function main() {
  try {
    const setup = new GmailSimpleSetup();
    await setup.setup();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = GmailSimpleSetup;
