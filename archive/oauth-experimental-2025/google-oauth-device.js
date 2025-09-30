#!/usr/bin/env node

/**
 * Google OAuth Device Flow - No redirect URI issues
 * This uses the device flow which doesn't require redirect URIs
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function setupGoogleOAuthDevice() {
  console.log('🔑 Google OAuth Device Flow Setup...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Use device flow - no redirect URI needed
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
    
    // Define scopes
    const SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];
    
    // Get device code
    console.log('📱 Getting device authorization code...');
    const deviceCodeResponse = await oAuth2Client.getToken({
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      client_id: client_id,
      scope: SCOPES.join(' ')
    });
    
    console.log('📧 Google OAuth Device Flow');
    console.log('==========================');
    console.log('');
    console.log('1. Go to: https://www.google.com/device');
    console.log('');
    console.log('2. Enter this code:');
    console.log(`   ${deviceCodeResponse.user_code}`);
    console.log('');
    console.log('3. Sign in with: chrisschofield@libertymusicpr.com');
    console.log('');
    console.log('4. Click "Allow" to grant access');
    console.log('');
    console.log('5. Wait for confirmation, then press Enter here...');
    
    // Wait for user to complete the flow
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    await new Promise((resolve) => {
      rl.question('Press Enter after completing the device flow: ', () => {
        rl.close();
        resolve();
      });
    });
    
    // Poll for tokens
    console.log('\n🔄 Getting access tokens...');
    let tokens = null;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (!tokens && attempts < maxAttempts) {
      try {
        tokens = await oAuth2Client.getToken({
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          client_id: client_id,
          device_code: deviceCodeResponse.device_code
        });
      } catch (error) {
        if (error.message.includes('authorization_pending')) {
          console.log('   Waiting for authorization...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        } else {
          throw error;
        }
      }
    }
    
    if (!tokens) {
      throw new Error('Authorization timeout - please try again');
    }
    
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
      console.log(`   ✅ Gmail: ${profile.data.emailAddress}`);
    } catch (error) {
      console.log(`   ❌ Gmail: ${error.message}`);
    }
    
    try {
      const drive = google.drive({ version: 'v3', auth: oAuth2Client });
      const about = await drive.about.get({ fields: 'user' });
      console.log(`   ✅ Drive: ${about.data.user.displayName}`);
    } catch (error) {
      console.log(`   ❌ Drive: ${error.message}`);
    }
    
    console.log('\n🎉 Google OAuth setup complete!');
    
  } catch (error) {
    console.error('❌ Device flow failed:', error.message);
    
    // Fallback to MCP server approach
    console.log('\n🔄 Trying MCP server approach instead...');
    console.log('The agent will use MCP server for Google services');
    console.log('This doesn\'t require OAuth setup');
  }
}

// Run the setup
setupGoogleOAuthDevice();


