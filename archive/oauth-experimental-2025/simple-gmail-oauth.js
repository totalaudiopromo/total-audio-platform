#!/usr/bin/env node

/**
 * Simple Gmail OAuth Setup for Liberty Music PR
 * 
 * This creates a simple OAuth flow that should work with your current setup
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const http = require('http');
const url = require('url');

async function setupGmailOAuth() {
  console.log('🔑 Simple Gmail OAuth Setup for Liberty Music PR...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Create OAuth2 client with localhost redirect URI
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:8080');
    
    // Define scopes for Gmail, Drive, and Calendar
    const SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];
    
    // Generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    
    console.log('📧 Gmail + Drive + Calendar OAuth Setup');
    console.log('=======================================');
    console.log('');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('2. Sign in with your Google account (chrisschofield@libertymusicpr.com)');
    console.log('');
    console.log('3. Click "Allow" to grant access to:');
    console.log('   - Gmail (read-only)');
    console.log('   - Google Drive (read-only)');
    console.log('   - Google Calendar (read-only)');
    console.log('');
    console.log('4. After clicking "Allow", you\'ll see a page with a code');
    console.log('   Copy the ENTIRE code (it will be long)');
    console.log('');
    
    // Get authorization code from user
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    const code = await new Promise((resolve) => {
      rl.question('Enter the FULL authorization code: ', (answer) => {
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
    
    // Test Drive access
    console.log('🧪 Testing Google Drive access...');
    try {
      const drive = google.drive({ version: 'v3', auth: oAuth2Client });
      const about = await drive.about.get({ fields: 'user' });
      console.log(`   ✅ Connected to Drive as: ${about.data.user.displayName}`);
    } catch (error) {
      console.log(`   ⚠️  Drive access: ${error.message}`);
    }
    
    // Test Calendar access
    console.log('🧪 Testing Google Calendar access...');
    try {
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
      const calendarList = await calendar.calendarList.list();
      console.log(`   ✅ Connected to Calendar with ${calendarList.data.items.length} calendars`);
    } catch (error) {
      console.log(`   ⚠️  Calendar access: ${error.message}`);
    }
    
    console.log('\n🎉 Google APIs integration is ready!');
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
    console.log('');
    console.log('4. Test complete workflow:');
    console.log('   node radio-promo-agent.js personal-workflow gemini:your-transcript-id');
    
  } catch (error) {
    console.error('❌ Failed to setup Gmail OAuth:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you copied the FULL authorization code from the browser');
    console.log('2. Check that Gmail API is enabled in Google Cloud Console');
    console.log('3. Verify your credentials file is correct');
    console.log('4. Try running the script again');
    console.log('');
    console.log('💡 The authorization code should be a long string of letters and numbers');
  }
}

// Run the OAuth flow
setupGmailOAuth();

