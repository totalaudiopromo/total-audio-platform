#!/usr/bin/env node
/**
 * COMPLETE FIX - Actually put emails in folders with color coding
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

async function getLabelMap() {
  const response = await gmail.users.labels.list({ userId: 'me' });
  const map = {};
  response.data.labels.forEach(l => map[l.name] = l.id);
  return map;
}

async function createOrUpdateLabel(name, color) {
  const labelMap = await getLabelMap();

  if (labelMap[name]) {
    // Update existing label with color
    try {
      await gmail.users.labels.update({
        userId: 'me',
        id: labelMap[name],
        requestBody: {
          name: name,
          color: color,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show'
        }
      });
      console.log(`✅ Updated: ${name} with color`);
    } catch (error) {
      console.log(`ℹ️  ${name} exists (color update may not be supported)`);
    }
  } else {
    // Create new label with color
    try {
      await gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name: name,
          color: color,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show'
        }
      });
      console.log(`✅ Created: ${name} with color`);
    } catch (error) {
      console.log(`❌ Failed to create: ${name}`);
    }
  }
}

async function labelEmails(query, labelName, description) {
  console.log(`\n${description}...`);

  const labelMap = await getLabelMap();
  const targetLabelId = labelMap[labelName];

  if (!targetLabelId) {
    console.log(`❌ Label "${labelName}" not found`);
    return 0;
  }

  const search = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 500
  });

  if (!search.data.messages) {
    console.log('  No emails found');
    return 0;
  }

  let labeled = 0;
  for (const msg of search.data.messages) {
    try {
      await gmail.users.messages.modify({
        userId: 'me',
        id: msg.id,
        requestBody: {
          addLabelIds: [targetLabelId]
        }
      });
      labeled++;
      if (labeled % 20 === 0) console.log(`  Labeled ${labeled}...`);
    } catch (error) {
      // Skip if already has label
    }
  }

  console.log(`✅ Labeled ${labeled} emails`);
  return labeled;
}

async function main() {
  console.log('🎯 COMPLETE FIX - Organize & Color Code Everything\n');
  console.log('='.repeat(60));

  try {
    // Step 1: Create/Update labels with colors
    console.log('\n1. SETTING UP LABELS WITH COLOR CODING\n');

    await createOrUpdateLabel('Kiara Bloodshot', {
      textColor: '#ffffff',
      backgroundColor: '#fb4c2f' // Red
    });

    await createOrUpdateLabel('Senior Dunce Bestial', {
      textColor: '#ffffff',
      backgroundColor: '#f691b2' // Pink
    });

    await createOrUpdateLabel('Weekly Releases', {
      textColor: '#000000',
      backgroundColor: '#fad165' // Yellow
    });

    await createOrUpdateLabel('Liberty/Station Feedback', {
      textColor: '#ffffff',
      backgroundColor: '#ff7537' // Orange
    });

    await createOrUpdateLabel('Liberty/Internal', {
      textColor: '#ffffff',
      backgroundColor: '#a4c2f4' // Light Blue
    });

    await createOrUpdateLabel('Liberty/Archive', {
      textColor: '#ffffff',
      backgroundColor: '#cabdbf' // Grey
    });

    await createOrUpdateLabel('Personal/Otter AI', {
      textColor: '#ffffff',
      backgroundColor: '#16a765' // Green
    });

    await createOrUpdateLabel('Personal/Gemini', {
      textColor: '#ffffff',
      backgroundColor: '#16a765' // Green
    });

    console.log('\n2. LABELING ALL EMAILS\n');

    const stats = {};

    // Label Kiara emails
    stats.kiara = await labelEmails(
      'Kiara OR Bloodshot OR KYARA',
      'Kiara Bloodshot',
      'Labeling Kiara Bloodshot emails'
    );

    // Label Senior Dunce emails
    stats.seniorDunce = await labelEmails(
      '"Senior Dunce" OR Bestial',
      'Senior Dunce Bestial',
      'Labeling Senior Dunce Bestial emails'
    );

    // Label Weekly Releases
    stats.weeklyReleases = await labelEmails(
      'subject:"weekly releases" OR (from:sam@libertymusicpr.com subject:releases)',
      'Weekly Releases',
      'Labeling Weekly Releases'
    );

    // Label Station Feedback (exclude campaigns)
    stats.stationFeedback = await labelEmails(
      'to:chrisschofield@libertymusicpr.com subject:Re: -from:libertymusicpr.com -from:otter.ai -from:WARM -from:gemini -Kiara -Bloodshot -KYARA -"Senior Dunce" -Bestial',
      'Liberty/Station Feedback',
      'Labeling Station Feedback'
    );

    // Label Internal
    stats.internal = await labelEmails(
      'from:libertymusicpr.com -from:sam -subject:"weekly releases"',
      'Liberty/Internal',
      'Labeling Internal emails'
    );

    // Label Otter AI
    stats.otter = await labelEmails(
      'from:otter.ai',
      'Personal/Otter AI',
      'Labeling Otter AI'
    );

    // Label Gemini
    stats.gemini = await labelEmails(
      'from:gemini',
      'Personal/Gemini',
      'Labeling Gemini'
    );

    // Archive Otter and Gemini from inbox
    console.log('\n3. ARCHIVING PERSONAL TOOLS FROM INBOX\n');

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
    } else {
      console.log('✅ No Otter AI in inbox');
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
    } else {
      console.log('✅ No Gemini in inbox');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`  🔴 Kiara Bloodshot: ${stats.kiara} emails`);
    console.log(`  🩷 Senior Dunce Bestial: ${stats.seniorDunce} emails`);
    console.log(`  🟡 Weekly Releases: ${stats.weeklyReleases} emails`);
    console.log(`  🟠 Station Feedback: ${stats.stationFeedback} emails`);
    console.log(`  🔵 Internal: ${stats.internal} emails`);
    console.log(`  🟢 Otter AI: ${stats.otter} emails (archived)`);
    console.log(`  🟢 Gemini: ${stats.gemini} emails (archived)`);
    console.log('\n📋 Your Gmail sidebar (color coded):');
    console.log('  🔴 Kiara Bloodshot');
    console.log('  🩷 Senior Dunce Bestial');
    console.log('  🟡 Weekly Releases');
    console.log('  Liberty/');
    console.log('    🟠 Station Feedback');
    console.log('    🔵 Internal');
    console.log('    ⚪ Archive');
    console.log('  Personal/');
    console.log('    🟢 Otter AI');
    console.log('    🟢 Gemini');
    console.log('\n✅ Everything organized and color coded!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
}

main().catch(console.error);
