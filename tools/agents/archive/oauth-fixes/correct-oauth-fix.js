#!/usr/bin/env node

/**
 * CORRECT OAuth Scope Fix - Using the RIGHT client credentials
 * This uses the actual working OAuth client from gmail-credentials.json
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function fixOAuthScopesCorrect() {
  console.log('🔐 CORRECT OAUTH SCOPE FIX');
  console.log('===========================');
  console.log('✅ Using the ACTUAL working OAuth client');
  console.log('✅ Same client that Gmail currently uses');
  console.log('✅ Will fix Drive & Calendar scope issues');
  console.log('');

  try {
    // Load the CORRECT credentials (the ones Gmail actually uses)
    const credentialsPath = path.join(__dirname, 'radio-promo/gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    const { client_id, client_secret } = credentials.installed;

    console.log(`🔑 Using OAuth Client: ${client_id}`);
    console.log('📋 This is the SAME client that Gmail currently uses');
    console.log('');

    // Create OAuth client with CORRECT credentials
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, 'postmessage');

    // All the scopes we need (Gmail + Drive + Calendar)
    const SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    console.log('📋 STEP 1: Click this authorization URL (CORRECT client):');
    console.log('');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });

    console.log(authUrl);
    console.log('');

    console.log('📋 STEP 2: After authorizing:');
    console.log('1. Google will show a code in the browser');
    console.log('2. Copy that code');
    console.log('3. Paste it here when prompted');
    console.log('');

    // Wait for user to enter the code
    process.stdout.write('🔑 Paste the authorization code here: ');

    // Read from stdin
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('', async (code) => {
      try {
        console.log('\n🔄 Exchanging code for tokens with CORRECT client...');

        const { tokens } = await oauth2Client.getToken(code);

        // Save tokens to MULTIPLE locations (ensure all integrations find them)
        const tokenPaths = [
          path.join(__dirname, 'google-token.json'),
          path.join(__dirname, 'radio-promo/gmail-token.json')
        ];

        for (const tokenPath of tokenPaths) {
          fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
          console.log(`💾 Tokens saved to: ${tokenPath}`);
        }

        console.log('✅ SUCCESS! New tokens saved with ALL scopes');
        console.log('');

        // Test the APIs with the new tokens
        console.log('🧪 Testing ALL APIs with new tokens...');
        oauth2Client.setCredentials(tokens);

        let allWorking = true;

        try {
          // Test Gmail
          const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
          const profile = await gmail.users.getProfile({ userId: 'me' });
          console.log(`✅ Gmail API: ${profile.data.emailAddress}`);
        } catch (error) {
          console.log(`❌ Gmail API: ${error.message}`);
          allWorking = false;
        }

        try {
          // Test Drive
          const drive = google.drive({ version: 'v3', auth: oauth2Client });
          const files = await drive.files.list({ pageSize: 1 });
          console.log(`✅ Google Drive API: Access granted, found ${files.data.files?.length || 0} files`);
        } catch (error) {
          console.log(`❌ Google Drive API: ${error.message}`);
          allWorking = false;
        }

        try {
          // Test Calendar
          const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
          const calendars = await calendar.calendarList.list();
          console.log(`✅ Google Calendar API: Access granted, found ${calendars.data.items?.length || 0} calendars`);
        } catch (error) {
          console.log(`❌ Google Calendar API: ${error.message}`);
          allWorking = false;
        }

        console.log('');

        if (allWorking) {
          console.log('🎉 COMPLETE SUCCESS!');
          console.log('✅ Gmail API: WORKING');
          console.log('✅ Google Drive API: WORKING (scope issue FIXED)');
          console.log('✅ Google Calendar API: WORKING (scope issue FIXED)');
          console.log('');
          console.log('🚀 Your Liberty Radio Promo Agent is now FULLY functional!');
        } else {
          console.log('⚠️  Some APIs still have issues - but scope fix attempted');
        }

        console.log('');
        console.log('🎯 Next steps:');
        console.log('   Run: node test-api-fixes.js (to verify all fixes)');
        console.log('   Run: node test-liberty-agent.js (full test)');
        console.log('   Run: node radio-promo-agent.js (production)');
        console.log('');

      } catch (error) {
        console.error('❌ Token exchange failed:', error.message);
      } finally {
        rl.close();
      }
    });

  } catch (error) {
    console.error('❌ OAuth setup failed:', error.message);
    console.error('Make sure gmail-credentials.json exists in radio-promo/ directory');
  }
}

// Run if called directly
if (require.main === module) {
  fixOAuthScopesCorrect();
}