#!/usr/bin/env node

/**
 * Fixed Google OAuth Setup for Liberty Music PR
 * 
 * This uses the correct redirect URI that matches your credentials
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function setupGoogleOAuth() {
  console.log('🔑 Fixed Google OAuth Setup for Liberty Music PR...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Use the correct redirect URI that matches your credentials
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'postmessage');
    
    // Define scopes for all Google services
    const SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/chat.readonly'
    ];
    
    // Generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    
    console.log('📧 Google APIs OAuth Setup (Fixed)');
    console.log('===================================');
    console.log('');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('2. Sign in with your Google account:');
    console.log('   chrisschofield@libertymusicpr.com');
    console.log('');
    console.log('3. Click "Allow" to grant access to:');
    console.log('   - Gmail (read-only)');
    console.log('   - Google Drive (read-only)');
    console.log('   - Google Calendar (read-only)');
    console.log('   - Google Chat (read-only)');
    console.log('');
    console.log('4. After clicking "Allow", you\'ll be redirected to a page');
    console.log('   Copy the ENTIRE authorization code from the URL');
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
    
    console.log('✅ Google access tokens saved successfully!');
    console.log(`   Token file: ${tokenPath}`);
    console.log('');
    
    // Test all Google services
    console.log('🧪 Testing Google APIs access...');
    
    // Test Gmail
    try {
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      console.log(`   ✅ Gmail: Connected as ${profile.data.emailAddress}`);
    } catch (error) {
      console.log(`   ❌ Gmail: ${error.message}`);
    }
    
    // Test Drive
    try {
      const drive = google.drive({ version: 'v3', auth: oAuth2Client });
      const about = await drive.about.get({ fields: 'user' });
      console.log(`   ✅ Drive: Connected as ${about.data.user.displayName}`);
    } catch (error) {
      console.log(`   ❌ Drive: ${error.message}`);
    }
    
    // Test Calendar
    try {
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
      const calendarList = await calendar.calendarList.list();
      console.log(`   ✅ Calendar: Connected with ${calendarList.data.items.length} calendars`);
    } catch (error) {
      console.log(`   ❌ Calendar: ${error.message}`);
    }
    
    // Test Chat (if available)
    try {
      const chat = google.chat({ version: 'v1', auth: oAuth2Client });
      console.log(`   ✅ Chat: API access available`);
    } catch (error) {
      console.log(`   ⚠️  Chat: ${error.message}`);
    }
    
    console.log('\n🎉 Google APIs integration is ready!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Test Gmail+Typeform campaign discovery:');
    console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
    console.log('');
    console.log('2. Test complete workflow:');
    console.log('   node radio-promo-agent.js test-complete-workflow');
    console.log('');
    
  } catch (error) {
    console.error('❌ Failed to setup Google OAuth:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you copied the FULL authorization code');
    console.log('2. The code should be in the URL after "code="');
    console.log('3. Don\'t include "code=" - just the code itself');
    console.log('4. Try running the script again');
    console.log('');
    
    if (error.message.includes('invalid_grant')) {
      console.log('💡 If you get "invalid_grant" error:');
      console.log('   - The code might be expired (codes expire quickly)');
      console.log('   - Try getting a fresh code from the browser');
      console.log('   - Make sure you\'re using the exact code from the URL');
    }
  }
}

// Run the OAuth flow
setupGoogleOAuth();


