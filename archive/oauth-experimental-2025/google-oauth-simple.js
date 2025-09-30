#!/usr/bin/env node

/**
 * Simple Google OAuth that works with your current credentials
 * Uses the exact redirect URI from your credentials file
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function setupGoogleOAuthSimple() {
  console.log('🔑 Simple Google OAuth Setup (No Origin Issues)...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Use the EXACT redirect URI from your credentials
    const redirectUri = credentials.installed.redirect_uris[0]; // "postmessage"
    console.log(`Using redirect URI: ${redirectUri}`);
    
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
      prompt: 'consent' // Force consent screen to get refresh token
    });
    
    console.log('📧 Google OAuth Setup (Simple)');
    console.log('=============================');
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
    console.log('⚠️  IMPORTANT: Don\'t close the browser tab yet!');
    console.log('   Copy the code first, then come back here');
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
    
    // Exchange code for tokens using the correct redirect URI
    const { tokens } = await oAuth2Client.getToken({
      code: code,
      redirect_uri: redirectUri
    });
    
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
      console.log(`   ✅ Connected to Gmail as: ${profile.data.emailAddress}`);
    } catch (error) {
      console.log(`   ❌ Gmail test failed: ${error.message}`);
    }
    
    try {
      const drive = google.drive({ version: 'v3', auth: oAuth2Client });
      const about = await drive.about.get({ fields: 'user' });
      console.log(`   ✅ Connected to Drive as: ${about.data.user.displayName}`);
    } catch (error) {
      console.log(`   ❌ Drive test failed: ${error.message}`);
    }
    
    console.log('\n🎉 Google OAuth setup complete!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Test your agent:');
    console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
    console.log('');
    
  } catch (error) {
    console.error('❌ OAuth setup failed:', error.message);
    console.log('');
    
    if (error.message.includes('invalid_grant')) {
      console.log('💡 This usually means:');
      console.log('   - The code expired (they expire in ~10 minutes)');
      console.log('   - You copied the code incorrectly');
      console.log('   - Try getting a fresh code from the browser');
    }
    
    if (error.message.includes('invalid_client')) {
      console.log('💡 This usually means:');
      console.log('   - Your Google Cloud Console project needs updating');
      console.log('   - The redirect URI in your credentials doesn\'t match');
      console.log('   - Try using a different OAuth flow');
    }
    
    console.log('\n🔧 Alternative: Use the MCP server approach');
    console.log('   The agent can work with MCP server instead of direct OAuth');
  }
}

// Run the setup
setupGoogleOAuthSimple();


