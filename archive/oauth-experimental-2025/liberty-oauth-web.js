#!/usr/bin/env node

/**
 * Liberty Music PR OAuth Setup - Web Application Flow
 * 
 * Proper OAuth flow for web application client type
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

async function setupLibertyOAuthWeb() {
  console.log('🎵 Liberty Music PR OAuth Setup (Web Application)');
  console.log('================================================\n');
  
  try {
    // Check if we have credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      console.log('❌ No credentials file found. Please download from Google Cloud Console:');
      console.log('1. Go to https://console.cloud.google.com/');
      console.log('2. Select your project');
      console.log('3. Go to APIs & Services > Credentials');
      console.log('4. Create OAuth 2.0 Client ID (Web application)');
      console.log('5. Add http://localhost:8080 to Authorized redirect URIs');
      console.log('6. Download as JSON and save as gmail-credentials.json');
      return;
    }
    
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    const { client_id, client_secret } = credentials.installed || credentials.web;
    
    if (!client_id || !client_secret) {
      console.log('❌ Invalid credentials file. Please check your Google Cloud Console setup.');
      return;
    }
    
    // Create OAuth2 client with web application redirect URI
    const oAuth2Client = new google.auth.OAuth2(
      client_id, 
      client_secret, 
      'http://localhost:8080'
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
    console.log('4. You will be redirected to a localhost page');
    console.log('5. Copy the "code" parameter from the URL');
    console.log('');
    
    // Start local server to handle redirect
    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const code = parsedUrl.query.code;
      
      if (code) {
        try {
          console.log('🔄 Exchanging code for tokens...');
          const { tokens } = await oAuth2Client.getToken(code);
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
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ OAuth Setup Complete!</h1>
                <p>You can close this window and return to the terminal.</p>
                <p>Your tokens have been saved successfully.</p>
              </body>
            </html>
          `);
          
          server.close();
        } catch (error) {
          console.error('❌ Token exchange failed:', error.message);
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: red;">❌ OAuth Setup Failed</h1>
                <p>Error: ${error.message}</p>
                <p>Please try again.</p>
              </body>
            </html>
          `);
          server.close();
        }
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: red;">❌ No Authorization Code</h1>
              <p>Please complete the OAuth flow first.</p>
            </body>
          </html>
        `);
      }
    });
    
    server.listen(8080, () => {
      console.log('🌐 Local server started on http://localhost:8080');
      console.log('   Waiting for OAuth redirect...');
    });
    
  } catch (error) {
    console.error('❌ OAuth setup failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you\'re using the correct Google account');
    console.log('2. Check that the OAuth consent screen is configured');
    console.log('3. Verify the redirect URI in Google Cloud Console');
    console.log('4. Make sure http://localhost:8080 is added to Authorized redirect URIs');
  }
}

// Run the setup
setupLibertyOAuthWeb();

