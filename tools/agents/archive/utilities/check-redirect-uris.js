#!/usr/bin/env node

/**
 * Check what redirect URIs are actually configured
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function checkRedirectUris() {
  console.log('🔍 Checking OAuth Client Configuration...\n');

  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    const { client_id, client_secret } = credentials.installed;

    console.log('📋 Your OAuth Client ID:');
    console.log(`   ${client_id}`);
    console.log('');

    console.log('🔧 What you need to do in Google Cloud Console:');
    console.log('');
    console.log(
      '1. Go to: https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3'
    );
    console.log('');
    console.log('2. Find your OAuth 2.0 Client ID (should match the one above)');
    console.log('');
    console.log('3. Click the EDIT icon (pencil) next to it');
    console.log('');
    console.log('4. In "Authorized redirect URIs" section, make sure you have EXACTLY:');
    console.log('   ✅ http://localhost:8080/callback');
    console.log('   ✅ postmessage');
    console.log('');
    console.log('5. Remove any other redirect URIs like:');
    console.log('   ❌ http://localhost:3000/callback');
    console.log('   ❌ urn:ietf:wg:oauth:2.0:oob');
    console.log('');
    console.log('6. Click "Save"');
    console.log('');
    console.log('7. Wait 1-2 minutes for changes to propagate');
    console.log('');
    console.log('8. Try the OAuth flow again');
    console.log('');

    // Test the exact redirect URI we're using
    console.log("🧪 Testing the exact redirect URI we're using:");
    const redirectUri = 'http://localhost:8080/callback';
    console.log(`   Redirect URI: ${redirectUri}`);

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

    try {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly'],
        prompt: 'consent',
      });

      console.log('   ✅ OAuth URL generated successfully');
      console.log(`   📱 Test URL: ${authUrl}`);
      console.log('');
    } catch (error) {
      console.log(`   ❌ Failed to generate OAuth URL: ${error.message}`);
      console.log('');
    }
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

// Run the check
checkRedirectUris();
