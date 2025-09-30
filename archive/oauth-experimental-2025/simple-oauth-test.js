#!/usr/bin/env node

/**
 * Simple OAuth Test - No Interactive Prompts
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testOAuth() {
  console.log('🧪 Simple OAuth Test...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Use postmessage redirect URI
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'postmessage');
    
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
    
    console.log('📧 OAuth Test URL Generated');
    console.log('==========================');
    console.log('');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('2. Sign in and click "Allow"');
    console.log('');
    console.log('3. Copy the authorization code from the page');
    console.log('');
    console.log('4. Run this command with your code:');
    console.log(`   node simple-oauth-test.js <your-code>`);
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
    console.error('❌ OAuth test failed:', error.message);
    
    if (error.message.includes('invalid_grant')) {
      console.log('\n💡 This usually means:');
      console.log('   - The code expired (they expire quickly)');
      console.log('   - You copied the code incorrectly');
      console.log('   - Try getting a fresh code from the browser');
    }
    
    if (error.message.includes('invalid_client')) {
      console.log('\n💡 This usually means:');
      console.log('   - Your Google Cloud Console needs updating');
      console.log('   - Check the manual-oauth-setup.md file');
      console.log('   - Make sure OAuth consent screen is configured');
    }
  }
}

// Run the test
testOAuth();


