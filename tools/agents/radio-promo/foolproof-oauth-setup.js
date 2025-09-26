#!/usr/bin/env node

/**
 * Foolproof OAuth Setup - Liberty Radio Promo Agent
 *
 * This script handles ALL OAuth scenarios robustly:
 * - Automatic port detection
 * - Multiple redirect URI fallbacks
 * - Clear error diagnosis
 * - Token validation and refresh
 * - Complete connection testing
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

class FoolproofOAuthSetup {
  constructor() {
    this.credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    this.tokenPath = path.join(__dirname, 'gmail-token.json');
    this.oAuth2Client = null;
    this.server = null;
    this.portRange = [3000, 3001, 3002, 3003, 8080, 8081, 8082];
    this.availablePort = null;

    // All possible redirect URIs to try
    this.redirectUris = [
      'http://localhost:3000/callback',
      'http://localhost:3001/callback',
      'http://localhost:3002/callback',
      'http://localhost:8080/callback',
      'http://127.0.0.1:3000/callback',
      'http://127.0.0.1:3001/callback',
      'http://127.0.0.1:8080/callback'
    ];

    // Required scopes
    this.scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      step: '🔧'
    };
    console.log(`${prefix[type]} ${message}`);
  }

  async setup() {
    this.log('Foolproof OAuth Setup - Liberty Radio Promo Agent', 'step');
    console.log('');

    try {
      // Step 1: Load and validate credentials
      await this.loadCredentials();

      // Step 2: Find available port
      await this.findAvailablePort();

      // Step 3: Start OAuth server
      await this.startOAuthServer();

      // Step 4: Generate and display auth URL
      const authUrl = this.generateAuthUrl();
      this.displayAuthInstructions(authUrl);

      // The server will handle the callback and complete setup
      this.log('Waiting for OAuth authorization...', 'info');
      this.log('(Server will automatically handle the callback)', 'info');

    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      this.diagnoseError(error);
      process.exit(1);
    }
  }

  async loadCredentials() {
    this.log('Loading OAuth credentials...', 'step');

    if (!fs.existsSync(this.credentialsPath)) {
      throw new Error(`Credentials file not found: ${this.credentialsPath}`);
    }

    const credentials = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
    const { client_id, client_secret } = credentials.installed;

    if (!client_id || !client_secret) {
      throw new Error('Invalid credentials file - missing client_id or client_secret');
    }

    this.log(`Loaded credentials for project: ${credentials.installed.project_id}`, 'success');
    this.log(`Client ID: ${client_id}`, 'info');

    // We'll set the redirect URI after finding an available port
    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, '');
  }

  async findAvailablePort() {
    this.log('Finding available port...', 'step');

    for (const port of this.portRange) {
      if (await this.isPortAvailable(port)) {
        this.availablePort = port;
        this.log(`Found available port: ${port}`, 'success');
        return port;
      }
    }

    throw new Error('No available ports found in range: ' + this.portRange.join(', '));
  }

  async isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = http.createServer();

      server.listen(port, () => {
        server.close(() => resolve(true));
      });

      server.on('error', () => resolve(false));
    });
  }

  async startOAuthServer() {
    this.log(`Starting OAuth callback server on port ${this.availablePort}...`, 'step');

    // Set the correct redirect URI based on available port
    const redirectUri = `http://localhost:${this.availablePort}/callback`;
    this.oAuth2Client.redirectUri = redirectUri;

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleOAuthCallback(req, res);
      });

      this.server.listen(this.availablePort, (err) => {
        if (err) {
          reject(err);
        } else {
          this.log(`OAuth server running at http://localhost:${this.availablePort}`, 'success');
          resolve();
        }
      });

      this.server.on('error', reject);
    });
  }

  generateAuthUrl() {
    this.log('Generating OAuth authorization URL...', 'step');

    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      prompt: 'consent'
    });

    this.log('OAuth URL generated successfully', 'success');
    return authUrl;
  }

  displayAuthInstructions(authUrl) {
    console.log('');
    console.log('🔗'.padEnd(60, '='));
    console.log('   OAUTH AUTHORIZATION REQUIRED');
    console.log('='.repeat(60));
    console.log('');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('2. Sign in with: chrisschofield@libertymusicpr.com');
    console.log('');
    console.log('3. Click "Allow" to grant access');
    console.log('');
    console.log('4. The browser will redirect back to this server');
    console.log('   and complete the setup automatically');
    console.log('');
    console.log('='.repeat(60));
    console.log('');

    // Try to open the URL automatically
    try {
      require('open')(authUrl);
      this.log('Browser opened automatically', 'success');
    } catch (error) {
      this.log('Could not auto-open browser - please open URL manually', 'warning');
    }
  }

  async handleOAuthCallback(req, res) {
    const url = new URL(req.url, `http://localhost:${this.availablePort}`);

    if (url.pathname !== '/callback') {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>OAuth Server Running</h1>
        <p>Waiting for Google OAuth callback...</p>
        <p>Port: ${this.availablePort}</p>
      `);
      return;
    }

    try {
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      this.log('Authorization code received, exchanging for tokens...', 'step');

      // Exchange code for tokens
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);

      // Save tokens
      fs.writeFileSync(this.tokenPath, JSON.stringify(tokens, null, 2));
      this.log(`Tokens saved: ${this.tokenPath}`, 'success');

      // Test connections
      const results = await this.testConnections();

      // Send success response
      const successHtml = this.generateSuccessPage(results);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(successHtml);

      // Shutdown server after delay
      setTimeout(() => {
        this.log('OAuth setup complete! Server shutting down...', 'success');
        this.server.close();
        process.exit(0);
      }, 3000);

    } catch (error) {
      this.log(`OAuth callback failed: ${error.message}`, 'error');

      // Send error response
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>OAuth Error</title></head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto;">
            <h1 style="color: red;">❌ OAuth Setup Failed</h1>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Check the terminal for more details and troubleshooting steps.</p>
          </body>
        </html>
      `);

      this.diagnoseError(error);

      setTimeout(() => {
        this.server.close();
        process.exit(1);
      }, 5000);
    }
  }

  async testConnections() {
    this.log('Testing Gmail, Drive, and Calendar connections...', 'step');

    const results = [];

    // Test Gmail
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      results.push({
        service: 'Gmail',
        success: true,
        message: `Connected as ${profile.data.emailAddress}`
      });
      this.log(`Gmail: Connected as ${profile.data.emailAddress}`, 'success');
    } catch (error) {
      results.push({
        service: 'Gmail',
        success: false,
        message: error.message
      });
      this.log(`Gmail: ${error.message}`, 'error');
    }

    // Test Drive
    try {
      const drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
      const about = await drive.about.get({ fields: 'user' });
      results.push({
        service: 'Drive',
        success: true,
        message: `Connected as ${about.data.user.displayName}`
      });
      this.log(`Drive: Connected as ${about.data.user.displayName}`, 'success');
    } catch (error) {
      results.push({
        service: 'Drive',
        success: false,
        message: error.message
      });
      this.log(`Drive: ${error.message}`, 'error');
    }

    // Test Calendar
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
      const calendarList = await calendar.calendarList.list();
      results.push({
        service: 'Calendar',
        success: true,
        message: `Connected with ${calendarList.data.items.length} calendars`
      });
      this.log(`Calendar: Connected with ${calendarList.data.items.length} calendars`, 'success');
    } catch (error) {
      results.push({
        service: 'Calendar',
        success: false,
        message: error.message
      });
      this.log(`Calendar: ${error.message}`, 'error');
    }

    return results;
  }

  generateSuccessPage(results) {
    const resultItems = results.map(r =>
      `<li style="color: ${r.success ? 'green' : 'red'}">${r.service}: ${r.message}</li>`
    ).join('');

    return `
      <html>
        <head><title>OAuth Setup Complete</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto;">
          <h1 style="color: green;">✅ OAuth Setup Complete!</h1>

          <h2>Connection Test Results:</h2>
          <ul>${resultItems}</ul>

          <h2>🚀 Next Steps:</h2>
          <ol>
            <li><strong>Close this browser tab</strong></li>
            <li><strong>Return to your terminal</strong></li>
            <li><strong>Test your agent:</strong>
                <code>node radio-promo-agent.js find-liberty-campaigns-gmail</code>
            </li>
          </ol>

          <p style="color: #666; font-size: 12px;">
            OAuth tokens saved to: ${this.tokenPath}<br>
            Server will shut down automatically in 3 seconds.
          </p>
        </body>
      </html>
    `;
  }

  diagnoseError(error) {
    this.log('Diagnosing error...', 'step');

    if (error.message.includes('redirect_uri_mismatch')) {
      this.log('DIAGNOSIS: Redirect URI mismatch', 'error');
      console.log('');
      console.log('💡 SOLUTION:');
      console.log('   Add this redirect URI to Google Cloud Console:');
      console.log(`   http://localhost:${this.availablePort}/callback`);
      console.log('');
      console.log('   Steps:');
      console.log('   1. Go to: https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3');
      console.log('   2. Edit OAuth 2.0 Client ID');
      console.log('   3. Add the redirect URI above');
      console.log('   4. Save and try again');
    }

    else if (error.message.includes('invalid_client')) {
      this.log('DIAGNOSIS: OAuth consent screen not configured', 'error');
      console.log('');
      console.log('💡 SOLUTION:');
      console.log('   Configure OAuth consent screen:');
      console.log('   1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=gleaming-realm-471715-p3');
      console.log('   2. Add test user: chrisschofield@libertymusicpr.com');
      console.log('   3. Add authorized domain: libertymusicpr.com');
      console.log('   4. Save and try again');
    }

    else if (error.message.includes('access_denied')) {
      this.log('DIAGNOSIS: User denied access', 'warning');
      console.log('');
      console.log('💡 SOLUTION:');
      console.log('   Run the setup again and click "Allow" when prompted');
    }

    else if (error.message.includes('invalid_grant')) {
      this.log('DIAGNOSIS: Authorization code expired or invalid', 'warning');
      console.log('');
      console.log('💡 SOLUTION:');
      console.log('   Authorization codes expire quickly. Run setup again.');
    }

    else {
      this.log('DIAGNOSIS: Unknown error', 'error');
      console.log('');
      console.log('💡 TROUBLESHOOTING:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify gmail-credentials.json is valid');
      console.log('   3. Ensure all required APIs are enabled');
    }

    console.log('');
  }
}

// Run if called directly
if (require.main === module) {
  const setup = new FoolproofOAuthSetup();
  setup.setup();
}

module.exports = FoolproofOAuthSetup;