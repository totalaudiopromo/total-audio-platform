#!/usr/bin/env node

/**
 * FIXED Google OAuth Setup for Liberty Music PR
 * 
 * This fixes the "origin parameter is required" error
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function setupGoogleOAuthFixed() {
  console.log('🔑 FIXED Google OAuth Setup for Liberty Music PR...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Use postmessage redirect URI (matches your credentials)
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'postmessage');
    
    // Define scopes for all Google services
    const SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/chat.readonly'
    ];
    
    // Generate auth URL with origin parameter (this fixes the error!)
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      // Add origin parameter to fix the error
      origin: 'http://localhost:8080',
      include_granted_scopes: true
    });
    
    console.log('📧 Google APIs OAuth Setup (FIXED for origin error)');
    console.log('==================================================');
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
    console.log('4. After clicking "Allow", you\'ll be redirected');
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
    
    // Use postmessage for token exchange (matches redirect URI)
    const { tokens } = await oAuth2Client.getToken({
      code: code,
      redirect_uri: 'postmessage'
    });
    
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
      console.log(`   📧 Total messages: ${profile.data.messagesTotal}`);
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
    
    if (error.message.includes('invalid_grant')) {
      console.log('💡 "invalid_grant" error means:');
      console.log('   - The authorization code expired (they expire quickly)');
      console.log('   - Try getting a fresh code from the browser');
      console.log('   - Make sure you copied the entire code from the URL');
      console.log('');
    }
    
    if (error.message.includes('invalid_request')) {
      console.log('💡 "invalid_request" error means:');
      console.log('   - The authorization code format is wrong');
      console.log('   - Make sure you copied the code exactly from the URL');
      console.log('   - Don\'t include "code=" - just the code itself');
      console.log('');
    }
    
    console.log('🔧 Try running the script again with a fresh authorization code');
  }
}

// Run the OAuth flow
setupGoogleOAuthFixed();


