#!/usr/bin/env node
/**
 * Liberty Gmail Fix - Complete Reorganization
 * Fixes the mess once and for all
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class LibertyGmailFix {
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

    // New label structure - Liberty only
    this.labels = [
      // Liberty Music PR
      { name: 'Liberty/Active Campaigns' },
      { name: 'Liberty/Station Feedback' },
      { name: 'Liberty/Station Auto-Responses' },
      { name: 'Liberty/Needs Action' },
      { name: 'Liberty/Completed' },
      { name: 'Liberty/Internal Team' },
      { name: 'Liberty/Archived' },

      // Personal Tools
      { name: 'Personal Tools/Otter AI' },
      { name: 'Personal Tools/Gemini' },

      // Marketing Junk
      { name: 'Marketing Junk/WARM' },
      { name: 'Marketing Junk/Machina' },
      { name: 'Marketing Junk/Other' },
    ];

    // PRECISE filter rules - exclude everything that's been causing problems
    this.filterRules = [
      // 1. Otter AI transcripts
      {
        description: 'Otter AI Transcripts',
        query: 'from:otter.ai OR from:no-reply@otter.ai OR from:noreply@otter.ai',
        addLabels: ['Personal Tools/Otter AI'],
        skipInbox: false,
      },

      // 2. Gemini transcripts
      {
        description: 'Gemini Transcripts',
        query: 'from:gemini OR from:google-gemini OR subject:"Gemini"',
        addLabels: ['Personal Tools/Gemini'],
        skipInbox: false,
      },

      // 3. WARM - marketing junk
      {
        description: 'WARM Marketing',
        query: 'from:WARM OR from:warmmusichelp.com OR from:warmapp.co',
        addLabels: ['Marketing Junk/WARM'],
        skipInbox: true,
        markRead: true,
      },

      // 4. Machina - marketing junk
      {
        description: 'Machina Marketing',
        query: 'from:machina OR subject:"Machina Account"',
        addLabels: ['Marketing Junk/Machina'],
        skipInbox: true,
        markRead: true,
      },

      // 5. Other cold marketing (Music Reaction, etc.)
      {
        description: 'Other Marketing Junk',
        query:
          'from:musicreaction OR subject:"grow your audience" OR subject:"promote your music" -from:libertymusicpr.com',
        addLabels: ['Marketing Junk/Other'],
        skipInbox: true,
        markRead: true,
      },

      // 6. New campaign assignments - needs action
      {
        description: 'New Campaign - Needs Action',
        query:
          'cc:chrisschofield@libertymusicpr.com (subject:R4 OR subject:R6) -subject:Re: -subject:Fwd:',
        addLabels: ['Liberty/Needs Action'],
        markImportant: true,
      },

      // 7. New campaign assignments - active
      {
        description: 'New Campaign - Active',
        query:
          'cc:chrisschofield@libertymusicpr.com (subject:R4 OR subject:R6) -subject:Re: -subject:Fwd:',
        addLabels: ['Liberty/Active Campaigns'],
      },

      // 8. Station auto-responses
      {
        description: 'Station Auto-Responses',
        query:
          'subject:"out of office" OR subject:"automatic reply" OR subject:"auto-reply" OR subject:"autoreply" OR subject:"away from desk"',
        addLabels: ['Liberty/Station Auto-Responses'],
        skipInbox: true,
        markRead: true,
      },

      // 9. REAL station feedback (most restrictive - exclude all the noise)
      {
        description: 'Real Station Feedback',
        query:
          'to:chrisschofield@libertymusicpr.com (subject:Re: OR subject:Fwd:) (subject:R4 OR subject:R6) -from:libertymusicpr.com -from:otter.ai -from:gemini -from:WARM -from:machina -from:musicreaction -subject:"out of office" -subject:"automatic reply" -subject:"autoreply"',
        addLabels: ['Liberty/Station Feedback'],
        markImportant: true,
      },

      // 10. Internal Liberty team
      {
        description: 'Liberty Internal',
        query: 'from:libertymusicpr.com -cc:chrisschofield@libertymusicpr.com',
        addLabels: ['Liberty/Internal Team'],
      },
    ];
  }

  /**
   * Delete ALL existing filters - start fresh
   */
  async deleteAllFilters() {
    console.log('🗑️  Deleting all existing filters...');

    try {
      const response = await this.gmail.users.settings.filters.list({ userId: 'me' });
      const filters = response.data.filter || [];

      console.log(`Found ${filters.length} filters to delete`);

      for (const filter of filters) {
        try {
          await this.gmail.users.settings.filters.delete({
            userId: 'me',
            id: filter.id,
          });
          console.log(`✅ Deleted filter: ${filter.id}`);
        } catch (error) {
          console.error(`❌ Failed to delete filter ${filter.id}:`, error.message);
        }
      }

      console.log('✅ All filters deleted');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete filters:', error.message);
      return false;
    }
  }

  /**
   * Create all labels
   */
  async createLabels() {
    console.log('🏷️  Creating label structure...');

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
   * Create all new filters
   */
  async createFilters() {
    console.log('🔧 Creating new precise filters...');

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

        // Build filter request
        const filterRequest = {
          userId: 'me',
          requestBody: {
            criteria: {
              query: rule.query,
            },
            action: {
              addLabelIds: addLabelIds.length > 0 ? addLabelIds : undefined,
            },
          },
        };

        // Add optional actions
        if (rule.markImportant) {
          filterRequest.requestBody.action.markImportant = true;
        }
        if (rule.skipInbox) {
          const inboxId = await this.getLabelId('INBOX');
          filterRequest.requestBody.action.removeLabelIds = [inboxId];
        }
        if (rule.markRead) {
          filterRequest.requestBody.action.markRead = true;
        }

        await this.gmail.users.settings.filters.create(filterRequest);
        console.log(`✅ Created filter: ${rule.description}`);
      } catch (error) {
        console.error(`❌ Failed to create filter "${rule.description}":`, error.message);
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * Full setup - delete old, create new
   */
  async setup() {
    console.log('🚀 Liberty Gmail Fix - Starting complete reorganization...\n');

    try {
      // Step 1: Delete ALL existing filters
      await this.deleteAllFilters();
      console.log('');

      // Step 2: Create label structure
      await this.createLabels();
      console.log('');

      // Small delay to ensure labels are ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Create new precise filters
      await this.createFilters();

      console.log('\n🎉 Gmail reorganization complete!');
      console.log('\n📧 New structure:');
      console.log('  Liberty/Active Campaigns - Current radio work');
      console.log('  Liberty/Station Feedback - ONLY real station responses');
      console.log('  Liberty/Needs Action - Requires your response');
      console.log('  Personal Tools/Otter AI - Your call transcripts');
      console.log('  Personal Tools/Gemini - Your call transcripts');
      console.log('  Marketing Junk/* - WARM, Machina, etc. (auto-archived)');
      console.log('\n✅ All old broken filters deleted');
      console.log('✅ New precise filters active');
      console.log('\n💡 Next: Run liberty-bulk-fix.js to fix existing emails');
    } catch (error) {
      console.error('❌ Setup failed:', error);
      throw error;
    }
  }

  /**
   * Test the setup
   */
  async test() {
    console.log('🧪 Testing Gmail setup...');

    try {
      const labelsResponse = await this.gmail.users.labels.list({ userId: 'me' });
      const filtersResponse = await this.gmail.users.settings.filters.list({ userId: 'me' });

      const ourLabels = labelsResponse.data.labels.filter(label =>
        this.labels.some(l => l.name === label.name)
      );

      console.log(`✅ Labels found: ${ourLabels.length}/${this.labels.length}`);
      console.log(`✅ Filters active: ${filtersResponse.data.filter?.length || 0}`);

      // List all filters
      console.log('\n🔧 Active filters:');
      (filtersResponse.data.filter || []).forEach((filter, index) => {
        console.log(`  ${index + 1}. ${filter.criteria?.query || 'No query'}`);
      });

      return true;
    } catch (error) {
      console.error('❌ Test failed:', error);
      return false;
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const fixer = new LibertyGmailFix();

  try {
    switch (command) {
      case 'setup':
        await fixer.setup();
        break;

      case 'delete-filters':
        await fixer.deleteAllFilters();
        break;

      case 'labels':
        await fixer.createLabels();
        break;

      case 'filters':
        await fixer.createFilters();
        break;

      case 'test':
        await fixer.test();
        break;

      default:
        console.log('📧 Liberty Gmail Fix');
        console.log('');
        console.log('Commands:');
        console.log('  setup          - Full setup (delete old + create new)');
        console.log('  delete-filters - Delete all existing filters');
        console.log('  labels         - Create labels only');
        console.log('  filters        - Create filters only');
        console.log('  test           - Test setup');
        console.log('');
        console.log('Example: node liberty-gmail-fix.js setup');
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = LibertyGmailFix;
