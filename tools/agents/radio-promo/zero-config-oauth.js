#!/usr/bin/env node

/**
 * Zero-Config OAuth Setup - Works with ANY existing OAuth configuration
 *
 * This approach works with the existing "postmessage" redirect URI
 * No Google Cloud Console changes required!
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class ZeroConfigOAuth {
  constructor() {
    this.credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    this.tokenPath = path.join(__dirname, 'gmail-token.json');
    this.oAuth2Client = null;

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
    this.log('Zero-Config OAuth Setup - Works with ANY configuration!', 'step');
    console.log('');

    try {
      // Load credentials
      await this.loadCredentials();

      // Generate auth URL (uses existing postmessage redirect)
      const authUrl = this.generateAuthUrl();

      // Display instructions
      this.displayAuthInstructions(authUrl);

      // Get authorization code from user
      const code = await this.getAuthCodeFromUser();

      // Exchange code for tokens
      await this.exchangeCodeForTokens(code);

      // Test connections
      await this.testConnections();

      // Success!
      this.log('OAuth setup complete! 🎉', 'success');
      console.log('');
      this.log('Test your agent: node radio-promo-agent.js find-liberty-campaigns-gmail', 'info');

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
      throw new Error('Invalid credentials file');
    }

    // Use the existing redirect URI from the credentials file
    const redirect_uri = credentials.installed.redirect_uris[0] || 'postmessage';

    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

    this.log(`Project: ${credentials.installed.project_id}`, 'success');
    this.log(`Using redirect URI: ${redirect_uri}`, 'info');
  }

  generateAuthUrl() {
    this.log('Generating OAuth URL...', 'step');

    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      prompt: 'consent'
    });

    return authUrl;
  }

  displayAuthInstructions(authUrl) {
    console.log('');
    console.log('🔗'.padEnd(70, '='));
    console.log('   ZERO-CONFIG OAUTH - NO CONSOLE CHANGES NEEDED');
    console.log('='.repeat(70));
    console.log('');
    console.log('1. 📱 Open this URL in your browser:');
    console.log('');
    console.log(`   ${authUrl}`);
    console.log('');
    console.log('2. 👤 Sign in with: chrisschofield@libertymusicpr.com');
    console.log('');
    console.log('3. ✅ Click "Allow" to grant permissions');
    console.log('');
    console.log('4. 📋 Copy the authorization code from the page');
    console.log('   (Google will show you a code to copy)');
    console.log('');
    console.log('='.repeat(70));
    console.log('');

    // Try to open automatically
    try {
      require('open')(authUrl);
      this.log('Browser opened automatically', 'success');
    } catch (error) {
      this.log('Please open the URL manually', 'warning');
    }
  }

  async getAuthCodeFromUser() {
    this.log('Waiting for authorization code...', 'step');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('📝 Enter the authorization code: ', (code) => {
        rl.close();
        resolve(code.trim());
      });
    });
  }

  async exchangeCodeForTokens(code) {
    this.log('Exchanging authorization code for tokens...', 'step');

    try {
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);

      // Save tokens
      fs.writeFileSync(this.tokenPath, JSON.stringify(tokens, null, 2));
      this.log(`Tokens saved: ${this.tokenPath}`, 'success');

    } catch (error) {
      if (error.message.includes('invalid_grant')) {
        throw new Error('Authorization code expired or invalid. Please try again with a fresh code.');
      }
      throw error;
    }
  }

  async testConnections() {
    this.log('Testing Gmail, Drive, and Calendar connections...', 'step');

    const results = [];

    // Test Gmail
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      this.log(`Gmail: Connected as ${profile.data.emailAddress}`, 'success');
      results.push({ service: 'Gmail', success: true });
    } catch (error) {
      this.log(`Gmail: ${error.message}`, 'error');
      results.push({ service: 'Gmail', success: false });
    }

    // Test Drive
    try {
      const drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
      const about = await drive.about.get({ fields: 'user' });
      this.log(`Drive: Connected as ${about.data.user.displayName}`, 'success');
      results.push({ service: 'Drive', success: true });
    } catch (error) {
      this.log(`Drive: ${error.message}`, 'error');
      results.push({ service: 'Drive', success: false });
    }

    // Test Calendar
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
      const calendarList = await calendar.calendarList.list();
      this.log(`Calendar: Connected with ${calendarList.data.items.length} calendars`, 'success');
      results.push({ service: 'Calendar', success: true });
    } catch (error) {
      this.log(`Calendar: ${error.message}`, 'error');
      results.push({ service: 'Calendar', success: false });
    }

    const successCount = results.filter(r => r.success).length;
    this.log(`${successCount}/3 services connected successfully`, successCount === 3 ? 'success' : 'warning');
  }

  diagnoseError(error) {
    console.log('');
    this.log('Troubleshooting...', 'step');

    if (error.message.includes('invalid_grant')) {
      console.log('💡 Authorization code expired - run setup again');
    } else if (error.message.includes('invalid_client')) {
      console.log('💡 OAuth consent screen needs test user added');
    } else if (error.message.includes('access_denied')) {
      console.log('💡 User clicked "Cancel" - run setup again and click "Allow"');
    } else {
      console.log('💡 Check internet connection and try again');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const setup = new ZeroConfigOAuth();
  setup.setup();
}

module.exports = ZeroConfigOAuth;