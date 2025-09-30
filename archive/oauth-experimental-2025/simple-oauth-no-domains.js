#!/usr/bin/env node

/**
 * Simple OAuth Setup - No Domain Requirements
 * 
 * This uses a different OAuth flow that doesn't require authorized domains
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function setupOAuthNoDomains() {
  console.log('🔑 Simple OAuth Setup (No Domain Requirements)...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Use a different redirect URI that doesn't require domains
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'urn:ietf:wg:oauth:2.0:oob');
    
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
    
    console.log('📧 OAuth Setup (No Domain Requirements)');
    console.log('=======================================');
    console.log('');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('2. Sign in with your Google account:');
    console.log('   chrisschofield@libertymusicpr.com');
    console.log('');
    console.log('3. Click "Allow" to grant access');
    console.log('');
    console.log('4. You\'ll see a page with an authorization code');
    console.log('   Copy the ENTIRE code from the page');
    console.log('');
    console.log('5. Run this command with your code:');
    console.log(`   node simple-oauth-no-domains.js <your-code>`);
    console.log('');
    
    // Check if code was provided as argument
    const code = process.argv[2];
    if (code) {
      console.log('🔄 Processing authorization code...');
      
      // Exchange code for tokens
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      
      // Save tokens
      const tokenPath = path.join(__dirname, 'gmail-token.json');
      fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
      
      console.log('✅ Tokens saved successfully!');
      console.log(`   File: ${tokenPath}`);
      console.log('');
      
      // Test the connection
      console.log('🧪 Testing connection...');
      
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
      
      console.log('\n🎉 OAuth setup complete!');
      console.log('');
      console.log('📋 Test your agent:');
      console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
      console.log('');
    }
    
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
      console.log('   - Your Google Cloud Console needs updating');
      console.log('   - The redirect URI might not be configured correctly');
    }
  }
}

// Run the setup
setupOAuthNoDomains();


