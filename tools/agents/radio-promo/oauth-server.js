#!/usr/bin/env node

/**
 * Standalone OAuth Server - No Google Cloud Console changes needed
 * Creates a local server that handles OAuth callbacks automatically
 */

const http = require('http');
const { URL } = require('url');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const open = require('open');

class OAuthServer {
  constructor() {
    this.port = 3000;
    this.server = null;
    this.oAuth2Client = null;
    this.credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    this.tokenPath = path.join(__dirname, 'gmail-token.json');
  }

  async start() {
    console.log('🚀 Starting OAuth Server - Liberty Radio Promo Agent\n');

    try {
      // Load credentials
      if (!fs.existsSync(this.credentialsPath)) {
        throw new Error('gmail-credentials.json not found');
      }

      const credentials = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
      const { client_id, client_secret } = credentials.installed;

      // Find available port
      this.port = await this.findAvailablePort(3000);
      const redirectUri = `http://localhost:${this.port}/callback`;

      // Create OAuth2 client
      this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

      // Define scopes
      const SCOPES = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/calendar.readonly'
      ];

      // Start HTTP server
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });

      await new Promise((resolve, reject) => {
        this.server.listen(this.port, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log(`📡 OAuth server running on http://localhost:${this.port}`);

      // Generate auth URL
      const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
      });

      console.log('\n🔗 Opening OAuth authorization in your browser...');
      console.log('If it doesn\'t open automatically, copy this URL:');
      console.log(`   ${authUrl}\n`);

      // Open browser
      try {
        await open(authUrl);
      } catch (error) {
        console.log('⚠️  Could not auto-open browser, please open the URL manually');
      }

      console.log('⏳ Waiting for OAuth authorization...');
      console.log('   (Browser should redirect back to this server)\n');

    } catch (error) {
      console.error('❌ Failed to start OAuth server:', error.message);
      process.exit(1);
    }
  }

  async handleRequest(req, res) {
    const url = new URL(req.url, `http://localhost:${this.port}`);

    if (url.pathname === '/callback') {
      await this.handleOAuthCallback(url, res);
    } else {
      // Default response
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>OAuth Server Running</h1><p>Waiting for Google OAuth callback...</p>');
    }
  }

  async handleOAuthCallback(url, res) {
    try {
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      console.log('✅ Authorization code received, exchanging for tokens...');

      // Exchange code for tokens
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);

      // Save tokens
      fs.writeFileSync(this.tokenPath, JSON.stringify(tokens, null, 2));
      console.log(`💾 Tokens saved to: ${this.tokenPath}`);

      // Test connections
      console.log('\n🧪 Testing connections...');
      const results = await this.testConnections();

      // Send success response
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>OAuth Success</title></head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto;">
            <h1 style="color: green;">✅ OAuth Setup Complete!</h1>
            <h2>Connection Test Results:</h2>
            <ul>
              ${results.map(r => `<li style="color: ${r.success ? 'green' : 'red'}">${r.message}</li>`).join('')}
            </ul>
            <p><strong>You can now close this browser tab and return to your terminal.</strong></p>
            <p>Test your agent with: <code>node radio-promo-agent.js find-liberty-campaigns-gmail</code></p>
          </body>
        </html>
      `);

      // Shutdown server
      setTimeout(() => {
        console.log('\n🎉 OAuth setup complete! Server shutting down...');
        this.server.close();
        process.exit(0);
      }, 2000);

    } catch (error) {
      console.error('❌ OAuth callback failed:', error.message);

      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>OAuth Error</title></head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto;">
            <h1 style="color: red;">❌ OAuth Setup Failed</h1>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Check your terminal for more details.</p>
            <p>You may need to configure Google Cloud Console settings.</p>
          </body>
        </html>
      `);

      setTimeout(() => {
        this.server.close();
        process.exit(1);
      }, 5000);
    }
  }

  async testConnections() {
    const results = [];

    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      results.push({ success: true, message: `Gmail: Connected as ${profile.data.emailAddress}` });
      console.log(`   ✅ Gmail: Connected as ${profile.data.emailAddress}`);
    } catch (error) {
      results.push({ success: false, message: `Gmail: ${error.message}` });
      console.log(`   ❌ Gmail: ${error.message}`);
    }

    try {
      const drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
      const about = await drive.about.get({ fields: 'user' });
      results.push({ success: true, message: `Drive: Connected as ${about.data.user.displayName}` });
      console.log(`   ✅ Drive: Connected as ${about.data.user.displayName}`);
    } catch (error) {
      results.push({ success: false, message: `Drive: ${error.message}` });
      console.log(`   ❌ Drive: ${error.message}`);
    }

    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
      const calendarList = await calendar.calendarList.list();
      results.push({ success: true, message: `Calendar: Connected with ${calendarList.data.items.length} calendars` });
      console.log(`   ✅ Calendar: Connected with ${calendarList.data.items.length} calendars`);
    } catch (error) {
      results.push({ success: false, message: `Calendar: ${error.message}` });
      console.log(`   ❌ Calendar: ${error.message}`);
    }

    return results;
  }

  async findAvailablePort(startPort) {
    return new Promise((resolve) => {
      const server = http.createServer();
      server.listen(startPort, () => {
        const port = server.address().port;
        server.close(() => resolve(port));
      });
      server.on('error', () => {
        resolve(this.findAvailablePort(startPort + 1));
      });
    });
  }
}

// Run if called directly
if (require.main === module) {
  const oauthServer = new OAuthServer();
  oauthServer.start();
}

module.exports = OAuthServer;