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
    // 1. Create essential labels (without custom colors - Gmail will assign defaults)
    const labels = [
      'Liberty/Active-Campaigns',
      'Liberty/Campaign-Archive',
      'Liberty/New-Inquiries',
      'Liberty/Media-Contacts',
      'Liberty/Admin',
      'Liberty/Follow-Ups',
      'Liberty/Team-Internal'
    ];

    console.log('📋 Creating labels...');
    for (const labelName of labels) {
      try {
        await gmail.users.labels.create({
          userId: 'me',
          resource: {
            name: labelName,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show'
          }
        });
        console.log(`✅ Created label: ${labelName}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`📌 Label already exists: ${labelName}`);
        } else {
          console.error(`❌ Error creating label ${labelName}:`, error.message);
        }
      }
    }

    // 2. Get label IDs for filters
    const labelList = await gmail.users.labels.list({ userId: 'me' });
    const labelMap = {};
    labelList.data.labels.forEach(label => {
      labelMap[label.name] = label.id;
    });

    console.log('🔍 Found label IDs:', Object.keys(labelMap).filter(name => name.startsWith('Liberty/')));

    // 3. Create filters with proper actions
    const filters = [
      {
        name: 'Active Campaigns',
        criteria: {
          query: '(subject:campaign OR subject:promo OR subject:release) -subject:"end of campaign" newer_than:30d'
        },
        action: {
          addLabelIds: labelMap['Liberty/Active-Campaigns'] ? [labelMap['Liberty/Active-Campaigns']] : []
        }
      },
      {
        name: 'Campaign Archive',
        criteria: {
          query: 'subject:"end of campaign" OR subject:"campaign completed"'
        },
        action: {
          addLabelIds: labelMap['Liberty/Campaign-Archive'] ? [labelMap['Liberty/Campaign-Archive']] : []
        }
      },
      {
        name: 'New Inquiries',
        criteria: {
          query: 'subject:submission OR subject:inquiry OR "interested in"'
        },
        action: {
          addLabelIds: labelMap['Liberty/New-Inquiries'] ? [labelMap['Liberty/New-Inquiries']] : []
        }
      },
      {
        name: 'Media Contacts',
        criteria: {
          query: 'from:blog OR from:magazine OR from:radio OR from:press OR subject:interview OR subject:feature'
        },
        action: {
          addLabelIds: labelMap['Liberty/Media-Contacts'] ? [labelMap['Liberty/Media-Contacts']] : []
        }
      },
      {
        name: 'Team Internal',
        criteria: {
          query: 'from:joe@libertymusicpr.com OR from:jessa@libertymusicpr.com OR from:georgem@libertymusicpr.com'
        },
        action: {
          addLabelIds: labelMap['Liberty/Team-Internal'] ? [labelMap['Liberty/Team-Internal']] : []
        }
      },
      {
        name: 'Admin & Billing',
        criteria: {
          query: 'subject:invoice OR subject:payment OR subject:contract OR subject:billing'
        },
        action: {
          addLabelIds: labelMap['Liberty/Admin'] ? [labelMap['Liberty/Admin']] : []
        }
      },
      {
        name: 'Follow-Ups Needed',
        criteria: {
          query: '"follow up" OR "get back" OR "let me know" OR "waiting for"'
        },
        action: {
          addLabelIds: labelMap['Liberty/Follow-Ups'] ? [labelMap['Liberty/Follow-Ups']] : []
        }
      }
    ];

    console.log('🎯 Creating filters...');
    for (const filter of filters) {
      try {
        // Only create filter if we have labels to apply
        if (filter.action.addLabelIds.length > 0) {
          await gmail.users.settings.filters.create({
            userId: 'me',
            resource: {
              criteria: filter.criteria,
              action: filter.action
            }
          });
          console.log(`✅ Created filter: ${filter.name}`);
        } else {
          console.log(`⚠️  Skipped filter ${filter.name} - no matching labels found`);
        }
      } catch (error) {
        console.error(`❌ Error creating filter ${filter.name}:`, error.message);
      }
    }

    // 4. Apply labels to recent campaign emails
    console.log('📧 Organizing recent campaign emails...');

    if (labelMap['Liberty/Active-Campaigns']) {
      try {
        // Find recent campaign emails
        const campaignEmails = await gmail.users.messages.list({
          userId: 'me',
          q: '(subject:campaign OR subject:promo) newer_than:30d',
          maxResults: 20
        });

        if (campaignEmails.data.messages) {
          console.log(`🔄 Applying labels to ${campaignEmails.data.messages.length} campaign emails...`);

          for (const message of campaignEmails.data.messages) {
            try {
              await gmail.users.messages.modify({
                userId: 'me',
                id: message.id,
                resource: {
                  addLabelIds: [labelMap['Liberty/Active-Campaigns']]
                }
              });
            } catch (error) {
              // Continue if individual message fails
              console.log(`⚠️  Could not label message ${message.id}: ${error.message}`);
            }
          }
        }
      } catch (error) {
        console.log(`⚠️  Could not organize campaign emails: ${error.message}`);
      }
    }

    console.log('✅ Gmail organization complete!');
    console.log('\n🎯 Your Liberty Music PR Gmail is now organized with:');
    console.log('   📋 7 category labels created');
    console.log('   🎯 Smart filters configured');
    console.log('   📧 Recent campaign emails labeled');
    console.log('\n💡 Gmail shortcuts:');
    console.log('   • Press "l" then type "Liberty/Active" to view active campaigns');
    console.log('   • Press "l" then type "Liberty/New" to view new inquiries');
    console.log('   • Press "l" then type "Liberty/Follow" to view follow-ups needed');

  } catch (error) {
    console.error('❌ Error setting up Gmail organization:', error);
  }
}

setupLibertyGmailOrganization();