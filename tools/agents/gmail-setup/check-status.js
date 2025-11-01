#!/usr/bin/env node
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
  '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
  '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',
  'http://localhost:3001/callback'
);

const tokens = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../radio-promo/gmail-token.json'), 'utf8')
);
oauth2Client.setCredentials(tokens);
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function checkLabels() {
  const response = await gmail.users.labels.list({ userId: 'me' });
  const labels = response.data.labels
    .filter(l => !l.id.startsWith('Label_') && !l.id.startsWith('CATEGORY_'))
    .sort((a, b) => a.name.localeCompare(b.name));

  console.log('\n📊 CURRENT GMAIL STATUS\n');
  console.log('='.repeat(70));

  for (const label of labels) {
    const msgs = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [label.id],
      maxResults: 1,
    });
    const count = msgs.data.resultSizeEstimate || 0;

    const colorInfo = label.color ? `(${label.color.backgroundColor})` : '';
    console.log(`${label.name.padEnd(40)} ${String(count).padStart(5)} emails ${colorInfo}`);
  }

  console.log('\n' + '='.repeat(70));
}

checkLabels().catch(console.error);
