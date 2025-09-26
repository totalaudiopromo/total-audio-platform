#!/usr/bin/env node

/**
 * Liberty Music PR OAuth Setup
 * 
 * Proper OAuth flow for Liberty account with correct configuration
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function setupLibertyOAuth() {
  console.log('🎵 Liberty Music PR OAuth Setup');
  console.log('================================\n');
  
  try {
    // Check if we have credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      console.log('❌ No credentials file found. Please download from Google Cloud Console:');
      console.log('1. Go to https://console.cloud.google.com/');
      console.log('2. Select your project');
      console.log('3. Go to APIs & Services > Credentials');
      console.log('4. Create OAuth 2.0 Client ID');
      console.log('5. Download as JSON and save as gmail-credentials.json');
      return;
    }
    
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    const { client_id, client_secret } = credentials.installed || credentials.web;
    
    if (!client_id || !client_secret) {
      console.log('❌ Invalid credentials file. Please check your Google Cloud Console setup.');
      return;
    }
    
    // Create OAuth2 client with proper redirect URI for web application
    const oAuth2Client = new google.auth.OAuth2(
      client_id, 
      client_secret, 
      'http://localhost:8080' // Web application redirect URI
    );
    
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
    
    console.log('🔑 OAuth Setup Instructions:');
    console.log('============================');
    console.log('');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('2. Sign in with your LIBERTY account: chrisschofield@libertymusicpr.com');
    console.log('');
    console.log('3. Click "Allow" to grant access');
    console.log('');
    console.log('4. Copy the authorization code from the page');
    console.log('');
    
    // Get authorization code from user
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const authCode = await new Promise((resolve) => {
      rl.question('Enter the authorization code: ', (code) => {
        rl.close();
        resolve(code.trim());
      });
    });
    
    if (!authCode) {
      console.log('❌ No authorization code provided');
      return;
    }
    
    // Exchange code for tokens
    console.log('🔄 Exchanging code for tokens...');
    const { tokens } = await oAuth2Client.getToken(authCode);
    oAuth2Client.setCredentials(tokens);
    
    // Save tokens
    const tokenPath = path.join(__dirname, 'liberty-tokens.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
    
    console.log('✅ OAuth setup complete!');
    console.log(`📁 Tokens saved to: ${tokenPath}`);
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Test the connection: node test-liberty-oauth.js');
    console.log('2. Run the agent: node radio-promo-agent.js health');
    
  } catch (error) {
    console.error('❌ OAuth setup failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you\'re using the correct Google account');
    console.log('2. Check that the OAuth consent screen is configured');
    console.log('3. Verify the redirect URI in Google Cloud Console');
  }
}

// Run the setup
setupLibertyOAuth();
