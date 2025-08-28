/**
 * LinkedIn OAuth Setup Helper
 * Guides through the OAuth flow to get LinkedIn access tokens
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');
const axios = require('axios');

require('dotenv').config();

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bold}${colors.blue}\n🔗 ${msg}${colors.reset}`)
};

class LinkedInOAuthHelper {
  constructor() {
    this.clientId = process.env.LINKEDIN_CLIENT_ID;
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    this.redirectUri = 'http://localhost:3000/auth/linkedin/callback';
    this.port = 3000;
    this.state = crypto.randomBytes(16).toString('hex');
    this.server = null;
  }

  async start() {
    log.header('LinkedIn OAuth Setup');
    
    // Validate environment
    if (!this.clientId || !this.clientSecret) {
      log.error('LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in .env file');
      process.exit(1);
    }

    if (this.clientId.includes('your_') || this.clientSecret.includes('your_')) {
      log.error('Please replace placeholder values in .env with actual LinkedIn credentials');
      process.exit(1);
    }

    console.log(`
📋 LINKEDIN OAUTH SETUP

This script will help you obtain LinkedIn access and refresh tokens.

Prerequisites:
✅ LinkedIn app created at https://www.linkedin.com/developers/apps
✅ "Share on LinkedIn" product enabled
✅ Redirect URI configured: ${this.redirectUri}
✅ Client ID and Secret in .env file

Starting OAuth flow...
`);

    await this.startOAuthFlow();
  }

  async startOAuthFlow() {
    // Start local server to handle callback
    await this.startCallbackServer();

    // Generate authorization URL
    const authUrl = this.generateAuthorizationUrl();
    
    log.info('Opening LinkedIn authorization page...');
    console.log(`\nIf browser doesn't open automatically, visit:\n${colors.blue}${authUrl}${colors.reset}\n`);
    
    // Open browser
    const open = await import('open');
    await open.default(authUrl);
    
    log.info('Waiting for authorization callback...');
  }

  generateAuthorizationUrl() {
    // Use only FREE tier scopes that you've requested access to
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: this.state,
      scope: 'openid profile email w_member_social' // FREE tier only
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  async startCallbackServer() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        
        if (parsedUrl.pathname === '/auth/linkedin/callback') {
          await this.handleCallback(req, res, parsedUrl.query);
          resolve();
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      });

      this.server.listen(this.port, (err) => {
        if (err) {
          reject(err);
        } else {
          log.success(`Callback server started on port ${this.port}`);
          resolve();
        }
      });
    });
  }

  async handleCallback(req, res, query) {
    try {
      // Send response to browser
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>LinkedIn OAuth</title></head>
          <body>
            <h1>✅ Authorization Successful!</h1>
            <p>You can close this window. Check your terminal for next steps.</p>
          </body>
        </html>
      `);

      // Validate state
      if (query.state !== this.state) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }

      if (query.error) {
        throw new Error(`LinkedIn OAuth error: ${query.error_description || query.error}`);
      }

      if (!query.code) {
        throw new Error('No authorization code received');
      }

      log.success('Authorization code received');
      
      // Exchange code for tokens
      await this.exchangeCodeForTokens(query.code);
      
    } catch (error) {
      log.error(`Callback handling failed: ${error.message}`);
      
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>LinkedIn OAuth Error</title></head>
          <body>
            <h1>❌ Authorization Failed</h1>
            <p>Error: ${error.message}</p>
            <p>Check your terminal for details.</p>
          </body>
        </html>
      `);
    } finally {
      // Close server
      setTimeout(() => {
        this.server.close();
        process.exit(0);
      }, 2000);
    }
  }

  async exchangeCodeForTokens(code) {
    log.info('Exchanging authorization code for access tokens...');
    
    try {
      const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      
      if (!access_token) {
        throw new Error('No access token received from LinkedIn');
      }

      log.success('Access token obtained successfully!');

      // Get user profile using FREE tier userinfo endpoint
      const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      const personUrn = `urn:li:person:${profileResponse.data.sub}`;
      
      log.success(`Profile retrieved: ${profileResponse.data.given_name} ${profileResponse.data.family_name}`);

      // Display credentials to add to .env
      this.displayCredentials(access_token, refresh_token, expires_in, personUrn);
      
    } catch (error) {
      log.error(`Token exchange failed: ${error.response?.data?.error_description || error.message}`);
      throw error;
    }
  }

  displayCredentials(accessToken, refreshToken, expiresIn, personUrn) {
    const expiresAt = new Date(Date.now() + (expiresIn * 1000));
    
    console.log(`\n${colors.green}${colors.bold}🎉 LINKEDIN OAUTH SETUP COMPLETE!${colors.reset}\n`);
    
    console.log(`${colors.yellow}Add these credentials to your .env file:${colors.reset}\n`);
    
    console.log(`${colors.blue}# LinkedIn OAuth Credentials${colors.reset}`);
    console.log(`LINKEDIN_ACCESS_TOKEN=${accessToken}`);
    
    if (refreshToken) {
      console.log(`LINKEDIN_REFRESH_TOKEN=${refreshToken}`);
    } else {
      console.log(`# LINKEDIN_REFRESH_TOKEN=not_provided`);
    }
    
    console.log(`LINKEDIN_PERSON_URN=${personUrn}`);
    
    console.log(`\n${colors.yellow}Token Information:${colors.reset}`);
    console.log(`Access Token Expires: ${expiresAt.toLocaleString()}`);
    console.log(`Expires In: ${Math.floor(expiresIn / 3600)} hours`);
    
    if (!refreshToken) {
      console.log(`\n${colors.yellow}⚠️  Note: No refresh token provided. You may need to re-authenticate when the access token expires.${colors.reset}`);
    }
    
    console.log(`\n${colors.green}✅ LinkedIn integration is now ready!${colors.reset}`);
    console.log(`Run ${colors.blue}npm run verify-setup${colors.reset} to test the connection.\n`);
  }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  log.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

// Start OAuth flow
const oauthHelper = new LinkedInOAuthHelper();
oauthHelper.start().catch(error => {
  log.error(`OAuth setup failed: ${error.message}`);
  process.exit(1);
});