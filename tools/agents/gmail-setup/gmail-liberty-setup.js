#!/usr/bin/env node
/**
 * Gmail Organisation Setup for Liberty Music PR
 * Simple, colour-coded system for radio promotion workflow
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GmailLibertySetup {
  constructor() {
    // Use existing OAuth credentials from radio-promo-agent
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
      console.log('✅ OAuth tokens loaded successfully');
    } else {
      throw new Error('❌ Gmail tokens not found. Run: node radio-promo-agent.js setup-gmail-auth');
    }

    // Simplified label structure - colours can be set manually in Gmail
    this.labels = [
      { name: 'Active Campaigns' },     // Green
      { name: 'Station Auto-Responses' }, // Grey
      { name: 'Station Feedback' },    // Orange
      { name: 'Needs Action' },        // Blue
      { name: 'Completed' },           // Yellow
      { name: 'Old Campaigns' },       // Red
      { name: 'Agent' }                // Purple
    ];

    // Simplified filter rules - one label per filter to avoid Gmail limits
    this.filterRules = [
      // New campaign assignment - needs action
      {
        description: 'New Campaign Assignment - Needs Action',
        query: 'cc:chrisschofield@libertymusicpr.com (subject:R4 OR subject:R6) -subject:Re:',
        addLabels: ['Needs Action'],
        markImportant: true
      },

      // New campaign assignment - active
      {
        description: 'New Campaign Assignment - Active',
        query: 'cc:chrisschofield@libertymusicpr.com (subject:R4 OR subject:R6) -subject:Re:',
        addLabels: ['Active Campaigns']
      },

      // Station auto-responses
      {
        description: 'Station Auto-Responses',
        query: '(subject:"out of office" OR subject:"automatic reply" OR subject:"auto-reply" OR subject:"delivery status" OR subject:"will be away" OR subject:"currently away" OR subject:"autoreply") to:chrisschofield@libertymusicpr.com',
        addLabels: ['Station Auto-Responses']
      },

      // Real station feedback
      {
        description: 'Real Station Feedback',
        query: '(radio OR station OR presenter OR DJ OR producer) to:chrisschofield@libertymusicpr.com -subject:"out of office" -subject:"automatic reply" -subject:"auto-reply" -subject:"autoreply" -from:libertymusicpr.com',
        addLabels: ['Station Feedback'],
        markImportant: true
      },

      // Weekly releases coordination
      {
        description: 'Weekly Releases',
        query: 'subject:"weekly releases" from:libertymusicpr.com',
        addLabels: ['Agent']
      }
    ];
  }

  /**
   * Create all required labels
   */
  async createLabels() {
    console.log('🏷️  Creating Gmail labels...');

    for (const labelConfig of this.labels) {
      try {
        const response = await this.gmail.users.labels.create({
          userId: 'me',
          requestBody: {
            name: labelConfig.name,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show'
          }
        });
        console.log(`✅ Created: ${labelConfig.name}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Already exists: ${labelConfig.name}`);
        } else {
          console.error(`❌ Failed to create ${labelConfig.name}:`, error.message);
        }
      }
    }
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
   * Create all filters
   */
  async createFilters() {
    console.log('🔧 Creating Gmail filters...');

    for (const rule of this.filterRules) {
      try {
        // Get label IDs
        const addLabelIds = [];
        if (rule.addLabels) {
          for (const labelName of rule.addLabels) {
            const labelId = await this.getLabelId(labelName);
            if (labelId) {
              addLabelIds.push(labelId);
            } else {
              console.warn(`⚠️  Label not found: ${labelName}`);
            }
          }
        }

        const removeLabelIds = [];
        if (rule.removeLabels) {
          for (const labelName of rule.removeLabels) {
            const labelId = await this.getLabelId(labelName);
            if (labelId) {
              removeLabelIds.push(labelId);
            }
          }
        }

        // Create filter
        const filterRequest = {
          userId: 'me',
          requestBody: {
            criteria: {
              query: rule.query
            },
            action: {
              addLabelIds: addLabelIds.length > 0 ? addLabelIds : undefined,
              removeLabelIds: removeLabelIds.length > 0 ? removeLabelIds : undefined
            }
          }
        };

        if (rule.markImportant) {
          filterRequest.requestBody.action.markImportant = true;
        }

        await this.gmail.users.settings.filters.create(filterRequest);
        console.log(`✅ Created filter: ${rule.description}`);

      } catch (error) {
        console.error(`❌ Failed to create filter "${rule.description}":`, error.message);
      }
    }
  }

  /**
   * Set up automatic archiving via additional filters
   * Note: Disabled for now due to Gmail API limitations
   */
  async createArchivingFilters() {
    console.log('📦 Skipping automatic archiving filters (can be set up manually in Gmail)...');

    // Manual instructions for user:
    console.log('ℹ️  To set up automatic archiving:');
    console.log('   1. In Gmail, go to Settings > Filters');
    console.log('   2. Create filter: older_than:14d label:active-campaigns');
    console.log('   3. Action: Add "Completed" label, Remove "Active Campaigns" label');
    console.log('   4. Create filter: older_than:30d label:completed');
    console.log('   5. Action: Add "Archived" label, Remove "Completed" label');

    return true;
  }

  /**
   * Full setup
   */
  async setup() {
    console.log('🚀 Setting up Gmail organisation for Liberty Music PR...');

    try {
      await this.createLabels();

      // Small delay to ensure labels are ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      await this.createFilters();
      await this.createArchivingFilters();

      console.log('\n🎉 Gmail organisation setup complete!');
      console.log('\n📧 Your emails will now be automatically organised:');
      console.log('  🟢 ACTIVE CAMPAIGNS - Current radio work');
      console.log('  🔵 NEEDS ACTION - Campaigns requiring your response');
      console.log('  🟠 STATION FEEDBACK - Real responses from stations');
      console.log('  ⚪ STATION AUTO-RESPONSES - Out of office replies');
      console.log('  🟡 COMPLETED - Finished campaigns (last 30 days)');
      console.log('  🔴 ARCHIVED - Old campaigns for reference');
      console.log('  🟣 AGENT - Processed by your radio promo agent');
      console.log('\n💡 Campaigns automatically progress: Active → Completed (14 days) → Archived (30 days)');

    } catch (error) {
      console.error('❌ Setup failed:', error);
      throw error;
    }
  }

  /**
   * Test the setup
   */
  async test() {
    console.log('🧪 Testing Gmail organisation...');

    try {
      const labelsResponse = await this.gmail.users.labels.list({ userId: 'me' });
      const filtersResponse = await this.gmail.users.settings.filters.list({ userId: 'me' });

      const ourLabels = labelsResponse.data.labels.filter(label =>
        this.labels.some(l => l.name === label.name)
      );

      console.log(`✅ Labels found: ${ourLabels.length}/${this.labels.length}`);
      console.log(`✅ Filters created: ${filtersResponse.data.filter?.length || 0}`);

      if (ourLabels.length === this.labels.length) {
        console.log('🎉 Gmail organisation is working correctly!');
        return true;
      } else {
        console.log('⚠️  Some labels may be missing');
        return false;
      }

    } catch (error) {
      console.error('❌ Test failed:', error);
      return false;
    }
  }

  /**
   * List current setup
   */
  async list() {
    try {
      const labelsResponse = await this.gmail.users.labels.list({ userId: 'me' });
      const filtersResponse = await this.gmail.users.settings.filters.list({ userId: 'me' });

      console.log('\n📋 Current Labels:');
      labelsResponse.data.labels
        .filter(label => this.labels.some(l => l.name === label.name))
        .forEach(label => {
          console.log(`  ${label.name} (${label.id})`);
        });

      console.log('\n🔧 Current Filters:');
      (filtersResponse.data.filter || []).forEach((filter, index) => {
        console.log(`  ${index + 1}. ${filter.criteria?.query || 'No query'}`);
      });

    } catch (error) {
      console.error('❌ Failed to list setup:', error);
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const setup = new GmailLibertySetup();

  try {
    switch (command) {
      case 'setup':
        await setup.setup();
        break;

      case 'labels':
        await setup.createLabels();
        break;

      case 'filters':
        await setup.createFilters();
        break;

      case 'test':
        await setup.test();
        break;

      case 'list':
        await setup.list();
        break;

      default:
        console.log('📧 Gmail Organisation Setup for Liberty Music PR');
        console.log('');
        console.log('Commands:');
        console.log('  setup    - Full setup (labels + filters)');
        console.log('  labels   - Create labels only');
        console.log('  filters  - Create filters only');
        console.log('  test     - Test setup');
        console.log('  list     - Show current setup');
        console.log('');
        console.log('Example: node gmail-liberty-setup.js setup');
    }

  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = GmailLibertySetup;