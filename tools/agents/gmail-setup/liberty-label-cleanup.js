#!/usr/bin/env node
/**
 * Liberty Label Cleanup - Create clean, organized structure
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class LibertyLabelCleanup {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      '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',
      'http://localhost:3001/callback'
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const tokenPath = path.join(__dirname, '../radio-promo/gmail-token.json');
    const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    this.oauth2Client.setCredentials(tokens);

    // CLEAN structure - everything organized
    this.newStructure = {
      'Liberty/Active': 'Current campaigns you\'re working on',
      'Liberty/Station Feedback': 'Responses from stations',
      'Liberty/Needs Action': 'Campaigns requiring your response',
      'Liberty/Internal': 'Liberty team communication',
      'Liberty/Completed/2025': 'Finished campaigns from 2025',
      'Liberty/Completed/2024': 'Finished campaigns from 2024',
      'Liberty/Archive': 'Old campaigns for reference',
      'Personal/Otter AI': 'Your call transcripts',
      'Personal/Gemini': 'Your AI transcripts',
      'Junk/Marketing': 'Spam and marketing emails'
    };

    // Old labels to delete/merge
    this.oldLabelsToRemove = [
      'Active Campaigns',
      'Completed',
      'Old Campaigns',
      'Station Feedback',
      'Station Responses',
      'Radio Campaigns',
      'Completed Radio Campaigns',
      'Liberty/Active-Campaigns',
      'Liberty/Admin',
      'Liberty/Archived',
      'Liberty/Campaign-Archive',
      'Liberty/Completed',
      'Liberty/Follow-Ups',
      'Liberty/Media-Contacts',
      'Liberty/New-Inquiries',
      'Liberty/Station Auto-Responses',
      'Liberty/Team-Internal',
      'Personal Tools/Otter AI',
      'Personal Tools/Gemini',
      'Marketing Junk/WARM',
      'Marketing Junk/Machina',
      'Marketing Junk/Other'
    ];
  }

  async getLabelMap() {
    const response = await this.gmail.users.labels.list({ userId: 'me' });
    const map = {};
    response.data.labels.forEach(l => map[l.name] = l.id);
    return map;
  }

  async createNewStructure() {
    console.log('📋 Creating clean label structure...\n');

    for (const [labelName, description] of Object.entries(this.newStructure)) {
      try {
        await this.gmail.users.labels.create({
          userId: 'me',
          requestBody: {
            name: labelName,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show'
          }
        });
        console.log(`✅ Created: ${labelName}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Already exists: ${labelName}`);
        } else {
          console.error(`❌ Failed: ${labelName}`);
        }
      }
    }

    console.log('\n✅ New structure created');
  }

  async migrateCampaigns() {
    console.log('\n🔄 Migrating campaign emails...\n');

    const labelMap = await this.getLabelMap();
    const stats = { active: 0, completed: 0 };

    // Move active campaigns
    console.log('Moving active campaigns...');
    const activeSearch = await this.gmail.users.messages.list({
      userId: 'me',
      q: 'label:active-campaigns OR label:radio-campaigns',
      maxResults: 500
    });

    if (activeSearch.data.messages) {
      for (const msg of activeSearch.data.messages) {
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: {
            addLabelIds: [labelMap['Liberty/Active']],
            removeLabelIds: [
              labelMap['Active Campaigns'],
              labelMap['Radio Campaigns'],
              labelMap['Liberty/Active-Campaigns']
            ].filter(Boolean)
          }
        });
        stats.active++;
        if (stats.active % 10 === 0) console.log(`  Moved ${stats.active} active campaigns...`);
      }
    }
    console.log(`✅ Moved ${stats.active} active campaigns\n`);

    // Move completed campaigns
    console.log('Moving completed campaigns...');
    const completedSearch = await this.gmail.users.messages.list({
      userId: 'me',
      q: 'label:completed-radio-campaigns OR label:completed',
      maxResults: 500
    });

    if (completedSearch.data.messages) {
      for (const msg of completedSearch.data.messages) {
        // Check date to determine 2024 vs 2025
        const msgData = await this.gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'minimal'
        });

        const date = new Date(parseInt(msgData.data.internalDate));
        const year = date.getFullYear();
        const targetLabel = year >= 2025 ? 'Liberty/Completed/2025' : 'Liberty/Completed/2024';

        await this.gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: {
            addLabelIds: [labelMap[targetLabel]],
            removeLabelIds: [
              labelMap['Completed'],
              labelMap['Completed Radio Campaigns'],
              labelMap['Liberty/Completed']
            ].filter(Boolean)
          }
        });
        stats.completed++;
        if (stats.completed % 10 === 0) console.log(`  Moved ${stats.completed} completed campaigns...`);
      }
    }
    console.log(`✅ Moved ${stats.completed} completed campaigns\n`);

    return stats;
  }

  async migrateStationFeedback() {
    console.log('🔄 Consolidating station feedback...\n');

    const labelMap = await this.getLabelMap();
    let moved = 0;

    const search = await this.gmail.users.messages.list({
      userId: 'me',
      q: 'label:station-feedback OR label:station-responses',
      maxResults: 500
    });

    if (search.data.messages) {
      for (const msg of search.data.messages) {
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: {
            addLabelIds: [labelMap['Liberty/Station Feedback']],
            removeLabelIds: [
              labelMap['Station Feedback'],
              labelMap['Station Responses']
            ].filter(Boolean)
          }
        });
        moved++;
        if (moved % 10 === 0) console.log(`  Moved ${moved}...`);
      }
    }

    console.log(`✅ Consolidated ${moved} station feedback emails\n`);
    return moved;
  }

  async migratePersonalTools() {
    console.log('🔄 Moving personal tools...\n');

    const labelMap = await this.getLabelMap();
    let stats = { otter: 0, gemini: 0 };

    // Otter AI
    const otterSearch = await this.gmail.users.messages.list({
      userId: 'me',
      q: 'label:personal-tools-otter-ai',
      maxResults: 500
    });

    if (otterSearch.data.messages) {
      for (const msg of otterSearch.data.messages) {
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: {
            addLabelIds: [labelMap['Personal/Otter AI']],
            removeLabelIds: [labelMap['Personal Tools/Otter AI']].filter(Boolean)
          }
        });
        stats.otter++;
      }
    }
    console.log(`✅ Moved ${stats.otter} Otter AI emails`);

    // Gemini
    const geminiSearch = await this.gmail.users.messages.list({
      userId: 'me',
      q: 'label:personal-tools-gemini',
      maxResults: 500
    });

    if (geminiSearch.data.messages) {
      for (const msg of geminiSearch.data.messages) {
        await this.gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: {
            addLabelIds: [labelMap['Personal/Gemini']],
            removeLabelIds: [labelMap['Personal Tools/Gemini']].filter(Boolean)
          }
        });
        stats.gemini++;
      }
    }
    console.log(`✅ Moved ${stats.gemini} Gemini emails\n`);

    return stats;
  }

  async deleteOldLabels() {
    console.log('🗑️  Removing old redundant labels...\n');

    const labelMap = await this.getLabelMap();
    let deleted = 0;

    for (const labelName of this.oldLabelsToRemove) {
      const labelId = labelMap[labelName];
      if (labelId) {
        try {
          await this.gmail.users.labels.delete({
            userId: 'me',
            id: labelId
          });
          console.log(`✅ Deleted: ${labelName}`);
          deleted++;
        } catch (error) {
          console.log(`⚠️  Couldn't delete: ${labelName} (${error.message})`);
        }
      }
    }

    // Delete all old campaign sub-labels
    console.log('\nDeleting old campaign sub-labels...');
    const allLabels = await this.gmail.users.labels.list({ userId: 'me' });
    const campaignSubLabels = allLabels.data.labels.filter(l =>
      l.name.includes('Completed Radio Campaigns/') ||
      l.name.includes('Radio Campaigns/')
    );

    for (const label of campaignSubLabels) {
      try {
        await this.gmail.users.labels.delete({
          userId: 'me',
          id: label.id
        });
        console.log(`✅ Deleted: ${label.name}`);
        deleted++;
      } catch (error) {
        console.log(`⚠️  Couldn't delete: ${label.name}`);
      }
    }

    console.log(`\n✅ Deleted ${deleted} old labels\n`);
    return deleted;
  }

  async run() {
    console.log('🧹 Liberty Label Cleanup - Creating Organized Structure\n');
    console.log('='.repeat(60));
    console.log('\n');

    try {
      // Step 1: Create new clean structure
      await this.createNewStructure();

      // Step 2: Migrate campaigns
      const campaignStats = await this.migrateCampaigns();

      // Step 3: Consolidate station feedback
      const feedbackCount = await this.migrateStationFeedback();

      // Step 4: Move personal tools
      const personalStats = await this.migratePersonalTools();

      // Step 5: Delete old labels
      const deletedCount = await this.deleteOldLabels();

      console.log('='.repeat(60));
      console.log('\n🎉 CLEANUP COMPLETE!\n');
      console.log('📊 Summary:');
      console.log(`  Active campaigns: ${campaignStats.active} moved`);
      console.log(`  Completed campaigns: ${campaignStats.completed} moved`);
      console.log(`  Station feedback: ${feedbackCount} consolidated`);
      console.log(`  Otter AI: ${personalStats.otter} moved`);
      console.log(`  Gemini: ${personalStats.gemini} moved`);
      console.log(`  Old labels: ${deletedCount} deleted`);
      console.log('\n📋 NEW STRUCTURE:');
      console.log('\n  Liberty/');
      console.log('    ├── Active (current campaigns)');
      console.log('    ├── Station Feedback (station responses)');
      console.log('    ├── Needs Action (requires response)');
      console.log('    ├── Internal (team communication)');
      console.log('    ├── Completed/');
      console.log('    │   ├── 2025');
      console.log('    │   └── 2024');
      console.log('    └── Archive (old campaigns)');
      console.log('\n  Personal/');
      console.log('    ├── Otter AI');
      console.log('    └── Gemini');
      console.log('\n  Junk/');
      console.log('    └── Marketing\n');
      console.log('✅ Clean, simple, organized!');

    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }
}

async function main() {
  const cleanup = new LibertyLabelCleanup();
  await cleanup.run();
}

if (require.main === module) {
  main();
}

module.exports = LibertyLabelCleanup;
