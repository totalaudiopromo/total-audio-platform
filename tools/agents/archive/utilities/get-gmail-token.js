#!/usr/bin/env node

/**
 * Get Gmail Access Token for Liberty Music PR
 *
 * This script runs the OAuth flow to get your Gmail access token
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function getGmailToken() {
  console.log('🔑 Getting Gmail Access Token for Liberty Music PR...\n');

  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    const { client_id, client_secret } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      'urn:ietf:wg:oauth:2.0:oob'
    );

    // Define scopes
    const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

    // Generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('📧 Gmail OAuth Setup');
    console.log('==================');
    console.log('');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('2. Sign in with your Google account (chrisschofield@libertymusicpr.com)');
    console.log('');
    console.log('3. Click "Allow" to grant Gmail access');
    console.log('');
    console.log('4. Copy the authorization code from the browser');
    console.log('');

    // Get authorization code from user
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const code = await new Promise(resolve => {
      rl.question('Enter the authorization code: ', answer => {
        rl.close();
        resolve(answer.trim());
      });
    });

    if (!code) {
      throw new Error('No authorization code provided');
    }

    // Exchange code for tokens
    console.log('\n🔄 Exchanging authorization code for tokens...');
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens
    const tokenPath = path.join(__dirname, 'gmail-token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

    console.log('✅ Gmail access token saved successfully!');
    console.log(`   Token file: ${tokenPath}`);
    console.log('');

    // Test Gmail access
    console.log('🧪 Testing Gmail access...');
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    console.log(`   ✅ Connected to Gmail as: ${profile.data.emailAddress}`);
    console.log(`   📧 Total messages: ${profile.data.messagesTotal}`);
    console.log(`   📥 Total threads: ${profile.data.threadsTotal}`);
    console.log('');

    console.log('🎉 Gmail integration is ready!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Test Gmail+Typeform campaign discovery:');
    console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
    console.log('');
    console.log('2. Generate press releases with artist assets:');
    console.log('   node radio-promo-agent.js generate-press-release "Artist Name"');
    console.log('');
    console.log('3. Process recent campaigns:');
    console.log('   node radio-promo-agent.js generate-recent-press-releases');
  } catch (error) {
    console.error('❌ Failed to get Gmail access token:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you copied the full authorization code');
    console.log('2. Check that Gmail API is enabled in Google Cloud Console');
    console.log('3. Verify your credentials file is correct');
    console.log('4. Try running the script again');
  }
}

// Run the OAuth flow
getGmailToken();
