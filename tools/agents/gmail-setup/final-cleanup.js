#!/usr/bin/env node
/**
 * FINAL CLEANUP - Do this right with no mistakes
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
  '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
  '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',
  'http://localhost:3001/callback'
);

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '../radio-promo/gmail-token.json'), 'utf8'));
oauth2Client.setCredentials(tokens);
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Protected Gmail labels that cannot be removed
const PROTECTED_LABELS = ['UNREAD', 'STARRED', 'IMPORTANT', 'SENT', 'DRAFT', 'INBOX', 'TRASH', 'SPAM', 'CATEGORY_PERSONAL', 'CATEGORY_SOCIAL', 'CATEGORY_UPDATES', 'CATEGORY_FORUMS', 'CATEGORY_PROMOTIONS'];

async function getLabelMap() {
  const response = await gmail.users.labels.list({ userId: 'me' });
  const map = {};
  response.data.labels.forEach(l => map[l.name] = l.id);
  return map;
}

async function deleteLabel(labelName, labelMap) {
  const labelId = labelMap[labelName];
  if (!labelId) return false;

  try {
    await gmail.users.labels.delete({ userId: 'me', id: labelId });
    console.log(`✅ Deleted: ${labelName}`);
    return true;
  } catch (error) {
    console.log(`⚠️  Couldn't delete: ${labelName}`);
    return false;
  }
}

async function createLabel(labelName) {
  try {
    await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show'
      }
    });
    console.log(`✅ Created: ${labelName}`);
    return true;
  } catch (error) {
    if (error.code === 409) {
      console.log(`ℹ️  Exists: ${labelName}`);
      return true;
    }
    console.log(`❌ Failed: ${labelName}`);
    return false;
  }
}

async function organizeEmails(query, targetLabel, description, labelMap) {
  console.log(`\n${description}...`);

  const search = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 500
  });

  if (!search.data.messages) {
    console.log('  No emails found');
    return 0;
  }

  let processed = 0;
  for (const msg of search.data.messages) {
    try {
      // Get current labels
      const msgData = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'minimal'
      });

      // Filter out protected labels and get removable ones
      const labelsToRemove = msgData.data.labelIds.filter(id => {
        const labelName = Object.keys(labelMap).find(k => labelMap[k] === id);
        return labelName && !PROTECTED_LABELS.includes(labelName) && !PROTECTED_LABELS.includes(id);
      });

      await gmail.users.messages.modify({
        userId: 'me',
        id: msg.id,
        requestBody: {
          addLabelIds: [labelMap[targetLabel]],
          removeLabelIds: labelsToRemove
        }
      });

      processed++;
      if (processed % 20 === 0) console.log(`  Processed ${processed}...`);
    } catch (error) {
      console.log(`  ⚠️  Skipped message ${msg.id}: ${error.message}`);
    }
  }

  console.log(`✅ Processed ${processed} emails`);
  return processed;
}

async function main() {
  console.log('🎯 FINAL CLEANUP - No Mistakes\n');
  console.log('='.repeat(60));

  try {
    // Step 1: Get current label map
    let labelMap = await getLabelMap();

    // Step 2: Delete junk labels
    console.log('\n1. DELETING JUNK LABELS\n');
    const toDelete = [
      '🎵 Kiara - Bloodshot',
      '🎵 Senior Dunce - Bestial',
      '📅 Weekly Releases',
      'Agent',
      'Notes',
      'Radio Work',
      'Liberty/Internal Team',
      'Needs Action',
      'Liberty/Active',
      'Liberty/Completed/2024',
      'Liberty/Completed/2025',
      'Junk/Marketing'
    ];

    for (const label of toDelete) {
      await deleteLabel(label, labelMap);
      await new Promise(r => setTimeout(r, 300));
    }

    // Step 3: Create clean labels
    console.log('\n2. CREATING CLEAN LABELS (NO EMOJIS)\n');
    const cleanLabels = [
      'Kiara Bloodshot',
      'Senior Dunce Bestial',
      'Weekly Releases',
      'Liberty/Station Feedback',
      'Liberty/Internal',
      'Liberty/Archive',
      'Personal/Otter AI',
      'Personal/Gemini'
    ];

    for (const label of cleanLabels) {
      await createLabel(label);
      await new Promise(r => setTimeout(r, 300));
    }

    // Refresh label map
    labelMap = await getLabelMap();

    // Step 4: Organize ALL emails
    console.log('\n3. ORGANIZING ALL EMAILS');
    console.log('='.repeat(60));

    const stats = {};

    stats.kiara = await organizeEmails(
      'Kiara OR Bloodshot OR KYARA',
      'Kiara Bloodshot',
      'Moving Kiara Bloodshot emails',
      labelMap
    );

    stats.seniorDunce = await organizeEmails(
      '"Senior Dunce" OR Bestial',
      'Senior Dunce Bestial',
      'Moving Senior Dunce Bestial emails',
      labelMap
    );

    stats.weeklyReleases = await organizeEmails(
      'from:libertymusicpr.com (subject:"weekly releases" OR subject:releases OR from:sam@libertymusicpr.com)',
      'Weekly Releases',
      'Moving Weekly Releases',
      labelMap
    );

    stats.stationFeedback = await organizeEmails(
      'to:chrisschofield@libertymusicpr.com subject:Re: -from:libertymusicpr.com -from:otter.ai -from:WARM -from:gemini -Kiara -Bloodshot -"Senior Dunce" -Bestial',
      'Liberty/Station Feedback',
      'Moving Station Feedback',
      labelMap
    );

    stats.internal = await organizeEmails(
      'from:libertymusicpr.com -from:sam -subject:releases',
      'Liberty/Internal',
      'Moving Internal emails',
      labelMap
    );

    stats.otter = await organizeEmails(
      'from:otter.ai',
      'Personal/Otter AI',
      'Moving Otter AI',
      labelMap
    );

    stats.gemini = await organizeEmails(
      'from:gemini',
      'Personal/Gemini',
      'Moving Gemini',
      labelMap
    );

    // Archive Otter and Gemini from inbox
    console.log('\n4. ARCHIVING PERSONAL TOOLS FROM INBOX');
    const otterInbox = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:otter.ai in:inbox',
      maxResults: 500
    });

    if (otterInbox.data.messages) {
      for (const msg of otterInbox.data.messages) {
        await gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: {
            removeLabelIds: ['INBOX']
          }
        });
      }
      console.log(`✅ Archived ${otterInbox.data.messages.length} Otter AI from inbox`);
    }

    const geminiInbox = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:gemini in:inbox',
      maxResults: 500
    });

    if (geminiInbox.data.messages) {
      for (const msg of geminiInbox.data.messages) {
        await gmail.users.messages.modify({
          userId: 'me',
          id: msg.id,
          requestBody: {
            removeLabelIds: ['INBOX']
          }
        });
      }
      console.log(`✅ Archived ${geminiInbox.data.messages.length} Gemini from inbox`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 CLEANUP COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`  Kiara Bloodshot: ${stats.kiara} emails`);
    console.log(`  Senior Dunce Bestial: ${stats.seniorDunce} emails`);
    console.log(`  Weekly Releases: ${stats.weeklyReleases} emails`);
    console.log(`  Station Feedback: ${stats.stationFeedback} emails`);
    console.log(`  Internal: ${stats.internal} emails`);
    console.log(`  Otter AI: ${stats.otter} emails (archived)`);
    console.log(`  Gemini: ${stats.gemini} emails (archived)`);
    console.log('\n📋 Your Gmail sidebar:');
    console.log('  Kiara Bloodshot');
    console.log('  Senior Dunce Bestial');
    console.log('  Weekly Releases');
    console.log('  Liberty/Archive');
    console.log('  Liberty/Internal');
    console.log('  Liberty/Station Feedback');
    console.log('  Personal/Gemini');
    console.log('  Personal/Otter AI');
    console.log('\n✅ Clean, simple, no emojis, no duplicates');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
}

main().catch(console.error);
