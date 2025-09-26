#!/usr/bin/env node

/**
 * Simple OAuth Fix for Liberty Music PR
 * 
 * This uses a simpler approach to get the OAuth token
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function simpleOAuthFix() {
  console.log('🔑 Simple OAuth Fix for Liberty Music PR...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Create OAuth2 client with postmessage redirect (for popup flow)
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'postmessage');
    
    // Define scopes for Gmail, Drive, and Calendar
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
      prompt: 'consent'
    });
    
    console.log('📧 Gmail + Drive + Calendar + Chat OAuth Setup');
    console.log('===============================================');
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
    console.log('   - Google Chat (read-only)');
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
    
    console.log('✅ OAuth setup complete!');
    console.log('📁 Tokens saved to:', tokenPath);
    console.log('');
    console.log('🎉 Your Liberty Music PR agent now has access to:');
    console.log('   - Gmail (read-only)');
    console.log('   - Google Drive (read-only)');
    console.log('   - Google Calendar (read-only)');
    console.log('   - Google Chat (read-only)');
    console.log('');
    console.log('🚀 You can now run your agent commands!');
    
  } catch (error) {
    console.error('❌ OAuth setup failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   - Make sure you copied the FULL authorization code');
    console.log('   - Check that your Google account has the right permissions');
    console.log('   - Try running the script again');
  }
}

// Run the setup
if (require.main === module) {
  simpleOAuthFix().catch(console.error);
}

module.exports = { simpleOAuthFix };
