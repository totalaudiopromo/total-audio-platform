#!/usr/bin/env node

/**
 * Simple OAuth with localhost callback only
 */

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

async function setupSimpleOAuth() {
  console.log('🔑 Simple OAuth Setup (localhost only)...\n');
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    const { client_id, client_secret } = credentials.installed;
    
    // Use localhost callback only
    const redirectUri = 'http://localhost:8080/callback';
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
    
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
    
    console.log('📧 Simple OAuth Setup');
    console.log('====================');
    console.log('');
    console.log('1. Make sure your OAuth client has ONLY this redirect URI:');
    console.log('   http://localhost:8080/callback');
    console.log('');
    console.log('2. Open this URL in your browser:');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('3. Sign in and click "Allow"');
    console.log('');
    console.log('4. The callback server will handle the response automatically');
    console.log('');
    
    // Create a simple HTTP server to handle the callback
    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);
      
      if (parsedUrl.pathname === '/callback' && parsedUrl.query.code) {
        try {
          console.log('🔄 Received authorization code, exchanging for tokens...');
          
          // Exchange code for tokens
          const { tokens } = await oAuth2Client.getToken(parsedUrl.query.code);
          oAuth2Client.setCredentials(tokens);
          
          // Save tokens
          const tokenPath = path.join(__dirname, 'gmail-token.json');
          fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
          
          console.log('✅ Tokens saved successfully!');
          console.log(`   File: ${tokenPath}`);
          
          // Test the connection
          console.log('\n🧪 Testing connection...');
          
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
          
          console.log('\n🎉 OAuth setup complete!');
          console.log('');
          console.log('📋 Test your agent:');
          console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
          console.log('');
          
          // Send success response
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ OAuth Setup Complete!</h1>
                <p>You can now close this window and return to your terminal.</p>
                <p>Your Google APIs are ready to use!</p>
              </body>
            </html>
          `);
          
          // Close server after successful setup
          setTimeout(() => {
            server.close();
            process.exit(0);
          }, 2000);
          
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
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });
    
    // Start the server
    server.listen(8080, () => {
      console.log('🚀 Callback server started on http://localhost:8080');
      console.log('   Waiting for OAuth callback...');
      console.log('');
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error('❌ Port 8080 is already in use. Please close any other applications using this port.');
      } else {
        console.error('❌ Server error:', error.message);
      }
    });
    
  } catch (error) {
    console.error('❌ OAuth setup failed:', error.message);
  }
}

// Run the setup
setupSimpleOAuth();


