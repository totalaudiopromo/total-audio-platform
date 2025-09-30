#!/usr/bin/env node

/**
 * Working Google OAuth Setup for Liberty Music PR
 * 
 * This should work with your current Google Cloud Console setup
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function setupWorkingOAuth() {
  console.log('🔑 Working Google OAuth Setup...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Use the redirect URI that matches your credentials exactly
    const redirectUri = 'postmessage'; // This matches your credentials file
    
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
    
    // Define scopes
    const SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];
    
    // Generate auth URL - NO origin parameter for postmessage
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });
    
    console.log('📧 Google OAuth Setup');
    console.log('====================');
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
    console.log('⚠️  IMPORTANT: The code will be in the URL or on the page');
    console.log('   Look for something like: code=4/0AX4XfWh...');
    console.log('   Copy everything after "code=" but before any "&" symbols');
    console.log('');
    
    // Get authorization code from user
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    const code = await new Promise((resolve) => {
      rl.question('Paste the authorization code here: ', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
    
    if (!code) {
      throw new Error('No authorization code provided');
    }
    
    console.log('\n🔄 Exchanging code for tokens...');
    
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
    
    console.log('\n🎉 Google OAuth setup complete!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Test your agent:');
    console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
    console.log('');
    console.log('2. Test complete workflow:');
    console.log('   node radio-promo-agent.js test-complete-workflow');
    console.log('');
    
  } catch (error) {
    console.error('❌ OAuth setup failed:', error.message);
    console.log('');
    
    if (error.message.includes('invalid_grant')) {
      console.log('💡 "invalid_grant" error means:');
      console.log('   - The code expired (they expire quickly)');
      console.log('   - You copied the code incorrectly');
      console.log('   - Try getting a fresh code from the browser');
      console.log('');
    }
    
    if (error.message.includes('invalid_client')) {
      console.log('💡 "invalid_client" error means:');
      console.log('   - Your Google Cloud Console needs updating');
      console.log('   - Check the google-cloud-console-fix.md file');
      console.log('   - Make sure OAuth consent screen is configured');
      console.log('');
    }
    
    console.log('🔧 If this continues to fail, we can use the MCP server approach');
    console.log('   which doesn\'t require OAuth setup');
  }
}

// Run the setup
setupWorkingOAuth();


