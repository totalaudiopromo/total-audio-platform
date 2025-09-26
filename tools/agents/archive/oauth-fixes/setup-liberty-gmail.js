const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load OAuth tokens
const tokenPath = path.join(__dirname, 'radio-promo/gmail-token.json');
const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));

// Setup OAuth client
const oauth2Client = new google.auth.OAuth2(
  '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
  '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',
  'http://localhost:3001/callback'
);

oauth2Client.setCredentials(tokens);
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function setupLibertyGmailOrganization() {
  console.log('🗂️  Setting up Liberty Music PR Gmail organization...');

  try {
    // 1. Create essential labels
    const labels = [
      { name: 'Liberty/Active-Campaigns', color: '#ff4444' },
      { name: 'Liberty/Campaign-Archive', color: '#888888' },
      { name: 'Liberty/New-Inquiries', color: '#00ff00' },
      { name: 'Liberty/Media-Contacts', color: '#0099ff' },
      { name: 'Liberty/Admin', color: '#ff8800' },
      { name: 'Liberty/Follow-Ups', color: '#ff00ff' },
      { name: 'Liberty/Team-Internal', color: '#444444' }
    ];

    console.log('📋 Creating labels...');
    for (const label of labels) {
      try {
        await gmail.users.labels.create({
          userId: 'me',
          resource: {
            name: label.name,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show',
            color: {
              backgroundColor: label.color,
              textColor: '#ffffff'
            }
          }
        });
        console.log(`✅ Created label: ${label.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`📌 Label already exists: ${label.name}`);
        } else {
          console.error(`❌ Error creating label ${label.name}:`, error.message);
        }
      }
    }

    // 2. Get label IDs for filters
    const labelList = await gmail.users.labels.list({ userId: 'me' });
    const labelMap = {};
    labelList.data.labels.forEach(label => {
      labelMap[label.name] = label.id;
    });

    // 3. Create filters
    const filters = [
      {
        name: 'Active Campaigns',
        criteria: {
          query: '(subject:"campaign" OR subject:"promo" OR subject:"release") -subject:"end of campaign" newer_than:30d'
        },
        action: {
          addLabelIds: [labelMap['Liberty/Active-Campaigns']]
        }
      },
      {
        name: 'Campaign Archive',
        criteria: {
          query: 'subject:"end of campaign" OR subject:"campaign completed" OR older_than:60d'
        },
        action: {
          addLabelIds: [labelMap['Liberty/Campaign-Archive']]
        }
      },
      {
        name: 'New Inquiries',
        criteria: {
          query: 'subject:"submission" OR subject:"inquiry" OR subject:"new client" OR body:"interested in"'
        },
        action: {
          addLabelIds: [labelMap['Liberty/New-Inquiries']],
          markImportant: true
        }
      },
      {
        name: 'Media Contacts',
        criteria: {
          query: 'from:@blog OR from:@magazine OR from:@radio OR from:@press OR body:"interview" OR body:"feature"'
        },
        action: {
          addLabelIds: [labelMap['Liberty/Media-Contacts']]
        }
      },
      {
        name: 'Team Internal',
        criteria: {
          query: 'from:joe@libertymusicpr.com OR from:jessa@libertymusicpr.com OR from:georgem@libertymusicpr.com OR cc:campaigns@libertymusicpr.com'
        },
        action: {
          addLabelIds: [labelMap['Liberty/Team-Internal']]
        }
      },
      {
        name: 'Admin & Billing',
        criteria: {
          query: 'subject:"invoice" OR subject:"payment" OR subject:"contract" OR subject:"billing"'
        },
        action: {
          addLabelIds: [labelMap['Liberty/Admin']]
        }
      },
      {
        name: 'Follow-Ups Needed',
        criteria: {
          query: 'body:"follow up" OR body:"get back" OR body:"let me know" OR body:"waiting for"'
        },
        action: {
          addLabelIds: [labelMap['Liberty/Follow-Ups']],
          markImportant: true
        }
      }
    ];

    console.log('🎯 Creating filters...');
    for (const filter of filters) {
      try {
        await gmail.users.settings.filters.create({
          userId: 'me',
          resource: {
            criteria: filter.criteria,
            action: filter.action
          }
        });
        console.log(`✅ Created filter: ${filter.name}`);
      } catch (error) {
        console.error(`❌ Error creating filter ${filter.name}:`, error.message);
      }
    }

    // 4. Apply labels to existing emails (last 30 days)
    console.log('📧 Organizing existing emails...');

    // Get recent emails
    const recentEmails = await gmail.users.messages.list({
      userId: 'me',
      q: 'newer_than:30d',
      maxResults: 100
    });

    if (recentEmails.data.messages) {
      console.log(`🔄 Processing ${recentEmails.data.messages.length} recent emails...`);

      let processed = 0;
      for (const message of recentEmails.data.messages.slice(0, 20)) { // Limit to avoid rate limits
        try {
          // Get email details
          const emailData = await gmail.users.messages.get({
            userId: 'me',
            id: message.id
          });

          const headers = emailData.data.payload.headers;
          const subject = headers.find(h => h.name === 'Subject')?.value || '';
          const from = headers.find(h => h.name === 'From')?.value || '';

          // Apply appropriate labels based on content
          const labelsToAdd = [];

          if (subject.toLowerCase().includes('campaign') && !subject.toLowerCase().includes('end of')) {
            labelsToAdd.push(labelMap['Liberty/Active-Campaigns']);
          }

          if (from.includes('joe@libertymusicpr.com') || from.includes('jessa@libertymusicpr.com')) {
            labelsToAdd.push(labelMap['Liberty/Team-Internal']);
          }

          if (subject.toLowerCase().includes('submission') || subject.toLowerCase().includes('inquiry')) {
            labelsToAdd.push(labelMap['Liberty/New-Inquiries']);
          }

          // Apply labels
          if (labelsToAdd.length > 0) {
            await gmail.users.messages.modify({
              userId: 'me',
              id: message.id,
              resource: {
                addLabelIds: labelsToAdd
              }
            });
          }

          processed++;
          if (processed % 5 === 0) {
            console.log(`📊 Processed ${processed} emails...`);
          }

        } catch (error) {
          console.error(`⚠️  Error processing message ${message.id}:`, error.message);
        }
      }
    }

    console.log('✅ Gmail organization complete!');
    console.log('\n🎯 Your Liberty Music PR Gmail is now organized with:');
    console.log('   📋 7 category labels');
    console.log('   🎯 7 smart filters');
    console.log('   📧 Recent emails organized');
    console.log('\n💡 You can now use Gmail shortcuts:');
    console.log('   • l + "Liberty/Active" - View active campaigns');
    console.log('   • l + "Liberty/New" - View new inquiries');
    console.log('   • l + "Liberty/Follow" - View follow-ups needed');

  } catch (error) {
    console.error('❌ Error setting up Gmail organization:', error);
  }
}

setupLibertyGmailOrganization();