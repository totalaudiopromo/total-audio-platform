#!/usr/bin/env node

/**
 * Simple OAuth Setup - Uses urn:ietf:wg:oauth:2.0:oob redirect
 * This should work without Google Cloud Console changes
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function setupOAuth() {
  console.log('🔧 Simple OAuth Setup - Liberty Radio Promo Agent\n');

  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      console.error('❌ gmail-credentials.json not found');
      process.exit(1);
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    const { client_id, client_secret } = credentials.installed;

    // Use urn:ietf:wg:oauth:2.0:oob redirect URI (should work without console changes)
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      'urn:ietf:wg:oauth:2.0:oob'
    );

    // Define scopes
    const SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];

    // Generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });

    console.log('🔗 OAuth Authorization Required');
    console.log('================================\n');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authUrl}\n`);
    console.log('2. Sign in and authorize access');
    console.log('3. Copy the authorization code\n');

    // Get authorization code from user
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const code = await new Promise((resolve) => {
      rl.question('Enter the authorization code: ', (answer) => {
        resolve(answer.trim());
      });
    });

    rl.close();

    console.log('\n🔄 Processing authorization code...');

    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens
    const tokenPath = path.join(__dirname, 'gmail-token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

    console.log('✅ Tokens saved successfully!');
    console.log(`   File: ${tokenPath}\n`);

    // Test connections
    console.log('🧪 Testing connections...\n');

    try {
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      console.log(`   ✅ Gmail: Connected as ${profile.data.emailAddress}`);
    } catch (error) {
      console.log(`   ❌ Gmail: ${error.message}`);
    }

    try {
      const drive = google.drive({ version: 'v3', auth: oAuth2Client });
      const about = await drive.about.get({ fields: 'user' });
      console.log(`   ✅ Drive: Connected as ${about.data.user.displayName}`);
    } catch (error) {
      console.log(`   ❌ Drive: ${error.message}`);
    }

    try {
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
      const calendarList = await calendar.calendarList.list();
      console.log(`   ✅ Calendar: Connected with ${calendarList.data.items.length} calendars`);
    } catch (error) {
      console.log(`   ❌ Calendar: ${error.message}`);
    }

    console.log('\n🎉 OAuth setup complete!\n');
    console.log('📋 Test your agent:');
    console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail\n');

  } catch (error) {
    console.error('❌ OAuth setup failed:', error.message);

    if (error.message.includes('invalid_grant')) {
      console.log('\n💡 This usually means:');
      console.log('   - The code expired (they expire quickly)');
      console.log('   - You copied the code incorrectly');
      console.log('   - Try getting a fresh code from the browser');
    }

    if (error.message.includes('invalid_client')) {
      console.log('\n💡 This usually means:');
      console.log('   - Google Cloud Console OAuth consent screen needs setup');
      console.log('   - Check oauth-setup-guide.md for manual setup');
    }

    if (error.message.includes('redirect_uri_mismatch')) {
      console.log('\n💡 This usually means:');
      console.log('   - The redirect URI is not authorized');
      console.log('   - Add "urn:ietf:wg:oauth:2.0:oob" to your OAuth credentials');
    }
  }
}

// Run the setup
setupOAuth();