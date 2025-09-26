#!/usr/bin/env node

/**
 * Desktop OAuth Fix - NO SERVER CALLBACKS NEEDED
 * Uses desktop OAuth flow with manual code entry
 * Bypasses all redirect URI and origin parameter issues
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function desktopOAuthFix() {
  console.log('🖥️  DESKTOP OAUTH FIX - No Server Callbacks Required');
  console.log('====================================================');
  console.log('✅ Uses desktop OAuth flow (manual code entry)');
  console.log('✅ No redirect URI issues');
  console.log('✅ No origin parameter errors');
  console.log('✅ Uses existing working Gmail OAuth client');
  console.log('');

  try {
    // Use the ACTUAL working Gmail OAuth client from the integration
    const CLIENT_ID = '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com';
    const CLIENT_SECRET = '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';
    const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // Desktop flow

    console.log(`🔑 Using Gmail OAuth Client: ${CLIENT_ID}`);
    console.log('📱 Using desktop OAuth flow (no server needed)');
    console.log('');

    // Create OAuth client for desktop flow
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    // ALL scopes needed (Gmail + Drive + Calendar)
    const SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    console.log('📋 STEP 1: Click this authorization URL:');
    console.log('');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // Force consent to get refresh token
    });

    console.log(authUrl);
    console.log('');

    console.log('📋 STEP 2: After clicking "Allow":');
    console.log('1. Google will show you an authorization code');
    console.log('2. Copy the entire code');
    console.log('3. Paste it below when prompted');
    console.log('');

    // Create readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Prompt for authorization code
    const code = await new Promise((resolve) => {
      rl.question('🔑 Paste the authorization code here: ', (answer) => {
        resolve(answer.trim());
      });
    });

    rl.close();

    console.log('\n🔄 Exchanging authorization code for tokens...');

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    console.log('✅ SUCCESS! Received tokens with all required scopes');
    console.log('');

    // Save tokens to multiple locations (ensure all integrations find them)
    const tokenPaths = [
      path.join(__dirname, 'google-token.json'),           // Main token file
      path.join(__dirname, 'radio-promo/gmail-token.json') // Gmail integration token
    ];

    for (const tokenPath of tokenPaths) {
      // Ensure directory exists
      const dir = path.dirname(tokenPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
      console.log(`💾 Tokens saved to: ${tokenPath}`);
    }

    console.log('');
    console.log('🧪 Testing ALL APIs with new tokens...');

    // Set credentials for testing
    oauth2Client.setCredentials(tokens);

    let allWorking = true;
    const testResults = [];

    // Test Gmail API
    try {
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      const result = `✅ Gmail API: ${profile.data.emailAddress}`;
      testResults.push(result);
      console.log(result);
    } catch (error) {
      const result = `❌ Gmail API: ${error.message}`;
      testResults.push(result);
      console.log(result);
      allWorking = false;
    }

    // Test Google Drive API
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      const files = await drive.files.list({ pageSize: 5 });
      const fileCount = files.data.files?.length || 0;
      const result = `✅ Google Drive API: Access granted, ${fileCount} files accessible`;
      testResults.push(result);
      console.log(result);
    } catch (error) {
      const result = `❌ Google Drive API: ${error.message}`;
      testResults.push(result);
      console.log(result);
      allWorking = false;
    }

    // Test Google Calendar API
    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const calendars = await calendar.calendarList.list();
      const calCount = calendars.data.items?.length || 0;
      const result = `✅ Google Calendar API: Access granted, ${calCount} calendars found`;
      testResults.push(result);
      console.log(result);
    } catch (error) {
      const result = `❌ Google Calendar API: ${error.message}`;
      testResults.push(result);
      console.log(result);
      allWorking = false;
    }

    console.log('');

    if (allWorking) {
      console.log('🎉 COMPLETE SUCCESS!');
      console.log('✅ Gmail API: WORKING');
      console.log('✅ Google Drive API: WORKING (scope issues FIXED!)');
      console.log('✅ Google Calendar API: WORKING (scope issues FIXED!)');
      console.log('');
      console.log('🚀 Your Liberty Radio Promo Agent is now FULLY FUNCTIONAL!');
    } else {
      console.log('⚠️  Some APIs had issues, but new tokens saved');
    }

    console.log('');
    console.log('🎯 Next steps:');
    console.log('   Run: node test-api-fixes.js    (verify all fixes work)');
    console.log('   Run: node test-liberty-agent.js (full integration test)');
    console.log('   Run: node radio-promo-agent.js  (production agent)');
    console.log('');

    // Save test results for debugging
    const resultsSummary = {
      timestamp: new Date().toISOString(),
      success: allWorking,
      results: testResults,
      tokensSavedTo: tokenPaths,
      scopes: SCOPES
    };

    fs.writeFileSync(
      path.join(__dirname, 'oauth-fix-results.json'),
      JSON.stringify(resultsSummary, null, 2)
    );

    console.log('📊 Results saved to: oauth-fix-results.json');

  } catch (error) {
    console.error('❌ OAuth fix failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Export for testing
module.exports = { desktopOAuthFix };

// Run if called directly
if (require.main === module) {
  desktopOAuthFix().then(() => {
    console.log('\n✨ OAuth fix complete!');
    process.exit(0);
  }).catch(error => {
    console.error('\n💥 OAuth fix failed:', error.message);
    process.exit(1);
  });
}