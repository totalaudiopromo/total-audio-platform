#!/bin/bash

echo "🚀 30-SECOND OAUTH FIX - Total Audio Platform"
echo "============================================="
echo ""
echo "PROBLEM: OAuth tokens missing Google Drive & Calendar scopes"
echo "SOLUTION: Quick re-authorization with correct scopes"
echo ""

# Set environment variables
export GOOGLE_CLIENT_SECRET="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"

echo "🔧 Step 1: Starting OAuth server on port 8080 (avoiding conflicts)..."

# Create a simple OAuth server using Node.js
cat > quick-oauth-setup.js << 'EOF'
const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = '479728379742-pbl2oq3bnqm8bgkh6d7n6u4ifrh1kql4.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';
const REDIRECT_URI = 'http://localhost:8080/callback';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const app = express();

console.log('🔐 GOOGLE OAUTH AUTHORIZATION REQUIRED');
console.log('=====================================');
console.log('');
console.log('📋 COPY THIS URL AND OPEN IN BROWSER:');
console.log('');

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log(authUrl);
console.log('');

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>🔐 OAuth Setup - Total Audio Platform</h1>
    <p><strong>Status:</strong> Waiting for authorization...</p>
    <p><a href="${authUrl}">Click here to authorize Google APIs</a></p>
  `);
});

// Callback route
app.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('❌ OAuth error:', error);
    res.status(400).send(`OAuth Error: ${error}`);
    return;
  }

  if (!code) {
    res.status(400).send('No authorization code received');
    return;
  }

  try {
    console.log('🔄 Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);

    // Save tokens
    const tokenPath = path.join(__dirname, 'google-token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

    console.log('✅ SUCCESS! OAuth tokens saved with all scopes');
    console.log(`💾 Tokens saved to: ${tokenPath}`);

    res.send(`
      <h1>✅ SUCCESS!</h1>
      <h2>OAuth Authorization Complete</h2>
      <p><strong>✅ Google Drive API:</strong> Full access granted</p>
      <p><strong>✅ Google Calendar API:</strong> Events access granted</p>
      <p><strong>✅ Gmail API:</strong> Full access granted</p>
      <br>
      <p><strong>🎉 Your Liberty Radio Promo Agent is now fully functional!</strong></p>
      <p>You can close this tab and return to your terminal.</p>
    `);

    // Close server after a moment
    setTimeout(() => {
      console.log('');
      console.log('🎉 OAUTH AUTHORIZATION COMPLETE!');
      console.log('✅ Google Drive & Calendar scopes: FIXED');
      console.log('✅ Your Liberty agent is now fully functional');
      console.log('');
      console.log('🚀 NEXT STEPS:');
      console.log('   Run: node test-liberty-agent.js');
      console.log('   Or:  node radio-promo-agent.js');
      console.log('');
      process.exit(0);
    }, 3000);

  } catch (error) {
    console.error('❌ Token exchange failed:', error.message);
    res.status(500).send(`Token Exchange Error: ${error.message}`);
  }
});

const server = app.listen(8080, () => {
  console.log('🌐 OAuth server running at: http://localhost:8080');
  console.log('⏳ Waiting for authorization...');
  console.log('');
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 OAuth setup cancelled');
  server.close();
  process.exit(0);
});
EOF

# Make executable
chmod +x quick-oauth-setup.js

echo "📋 Step 2: COPY THE URL THAT APPEARS AND OPEN IN BROWSER"
echo ""
echo "🚀 Starting OAuth server now..."
echo ""

# Run the OAuth server
node quick-oauth-setup.js