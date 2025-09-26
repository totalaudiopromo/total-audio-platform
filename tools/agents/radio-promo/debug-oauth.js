#!/usr/bin/env node

/**
 * Debug OAuth Configuration
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function debugOAuth() {
  console.log('🔍 Debugging OAuth Configuration...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    console.log('📋 Current Configuration:');
    console.log(`   Client ID: ${client_id}`);
    console.log(`   Client Secret: ${client_secret.substring(0, 10)}...`);
    console.log('');
    
    // Test different redirect URIs
    const redirectUris = [
      'http://localhost:8080/callback',
      'http://localhost:3000/callback',
      'postmessage',
      'urn:ietf:wg:oauth:2.0:oob'
    ];
    
    for (const redirectUri of redirectUris) {
      console.log(`🧪 Testing redirect URI: ${redirectUri}`);
      
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
      
      try {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: ['https://www.googleapis.com/auth/gmail.readonly'],
          prompt: 'consent'
        });
        
        console.log(`   ✅ URL generated successfully`);
        console.log(`   📱 Test URL: ${authUrl.substring(0, 100)}...`);
        console.log('');
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        console.log('');
      }
    }
    
    console.log('📋 What you need to do:');
    console.log('1. Go to Google Cloud Console OAuth Credentials');
    console.log('2. Edit your "Liberty Music PR Gmail Agent" client ID');
    console.log('3. Make sure you have EXACTLY this redirect URI:');
    console.log('   http://localhost:8080/callback');
    console.log('4. Click Save');
    console.log('5. Try the OAuth flow again');
    console.log('');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run the debug
debugOAuth();


