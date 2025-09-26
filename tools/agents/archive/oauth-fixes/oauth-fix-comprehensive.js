#!/usr/bin/env node

const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// OAuth2 credentials (using existing config)
const CLIENT_ID = '479728379742-pbl2oq3bnqm8bgkh6d7n6u4ifrh1kql4.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';
const REDIRECT_URI = 'http://localhost:3001/oauth/callback';

// COMPREHENSIVE SCOPES - Include all services needed
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents'
];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const TOKEN_PATH = path.join(__dirname, 'google-token.json');

const app = express();
let server;

console.log('🔧 COMPREHENSIVE OAUTH SETUP - Total Audio Platform');
console.log('================================================');
console.log('This will authorize ALL Google services needed:');
console.log('✅ Gmail (read/send/modify)');
console.log('✅ Google Drive (full access)');
console.log('✅ Google Calendar (events)');
console.log('✅ Google Chat (messages/spaces)');
console.log('✅ Google Sheets & Docs');
console.log('================================================\n');

// Generate authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent' // Force consent screen to ensure refresh token
});

console.log('📋 STEP 1: Copy this URL and open in browser:');
console.log('\n' + authUrl + '\n');

// Handle OAuth callback
app.get('/oauth/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('❌ OAuth error:', error);
    res.status(400).send(`OAuth Error: ${error}`);
    return;
  }

  try {
    console.log('🔄 Step 2: Exchanging code for tokens...');

    const { tokens } = await oauth2Client.getToken(code);

    console.log('✅ Step 3: Tokens received!');
    console.log('📊 Token details:');
    console.log(`   Access Token: ${tokens.access_token ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Refresh Token: ${tokens.refresh_token ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Expiry: ${tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString() : 'Never'}`);

    // Save tokens
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log(`💾 Tokens saved to: ${TOKEN_PATH}`);

    // Set credentials for testing
    oauth2Client.setCredentials(tokens);

    // Test APIs
    console.log('\n🧪 TESTING APIS...');
    await testAPIs();

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>OAuth Success - Total Audio Platform</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .api-test { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .status { font-weight: bold; }
            .pass { color: #28a745; }
            .fail { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1>🚀 OAuth Authorization Successful!</h1>
          <div class="success">
            Your Google APIs are now authorized for Total Audio Platform.
            You can close this tab and return to your terminal.
          </div>
          <h2>API Status:</h2>
          <div id="api-results">Testing APIs...</div>
          <script>
            // Auto-refresh to show API test results
            setTimeout(() => window.location.reload(), 2000);
          </script>
        </body>
      </html>
    `);

    // Close server after success
    setTimeout(() => {
      console.log('\n✅ OAUTH SETUP COMPLETE!');
      console.log('🔧 Next steps:');
      console.log('   1. Your Liberty agent should now work with all Google services');
      console.log('   2. Run: node test-liberty-agent.js');
      console.log('   3. Or run: node liberty-radio-promo-agent.js\n');

      server.close();
      process.exit(0);
    }, 3000);

  } catch (error) {
    console.error('❌ Token exchange failed:', error.message);
    res.status(500).send(`Token Exchange Error: ${error.message}`);
  }
});

// Test all APIs
async function testAPIs() {
  const results = {};

  try {
    // Test Gmail
    console.log('   📧 Testing Gmail API...');
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const gmailProfile = await gmail.users.getProfile({ userId: 'me' });
    results.gmail = `✅ Gmail: ${gmailProfile.data.emailAddress}`;
  } catch (error) {
    results.gmail = `❌ Gmail: ${error.message}`;
  }

  try {
    // Test Drive
    console.log('   📁 Testing Google Drive API...');
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const driveFiles = await drive.files.list({ pageSize: 1 });
    results.drive = `✅ Drive: ${driveFiles.data.files ? driveFiles.data.files.length : 0} files accessible`;
  } catch (error) {
    results.drive = `❌ Drive: ${error.message}`;
  }

  try {
    // Test Calendar
    console.log('   📅 Testing Google Calendar API...');
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const calendars = await calendar.calendarList.list();
    results.calendar = `✅ Calendar: ${calendars.data.items ? calendars.data.items.length : 0} calendars found`;
  } catch (error) {
    results.calendar = `❌ Calendar: ${error.message}`;
  }

  console.log('\n📊 API TEST RESULTS:');
  Object.values(results).forEach(result => console.log(`   ${result}`));

  return results;
}

// Start server
server = app.listen(3001, () => {
  console.log('🌐 OAuth callback server running on http://localhost:3001');
  console.log('⏳ Waiting for authorization...\n');
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n👋 OAuth setup cancelled');
  server.close();
  process.exit(0);
});