/**
 * Simple LinkedIn OAuth Authentication Script
 * Handles the complete OAuth flow automatically with your actual credentials
 * Opens browser, handles callback, exchanges tokens, saves to .env
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Your actual LinkedIn credentials
const LINKEDIN_CLIENT_ID = '781ioptlbwi0ok';
const LINKEDIN_CLIENT_SECRET = 'WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==';
const REDIRECT_URI = 'http://localhost:3000/auth/linkedin/callback';
const PORT = 3000;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const log = {
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: msg => console.log(`${colors.bold}${colors.cyan}\n🔗 ${msg}${colors.reset}`),
  step: (num, msg) => console.log(`${colors.magenta}${num}. ${msg}${colors.reset}`),
};

class SimpleLinkedInAuth {
  constructor() {
    this.state = crypto.randomBytes(16).toString('hex');
    this.server = null;
    this.tokens = null;
    this.profile = null;
  }

  async authenticate() {
    log.header('LinkedIn Authentication for Content Domination System');
    console.log(`
🎯 This script will:
1. Open LinkedIn OAuth page in your browser
2. Handle the callback automatically
3. Exchange authorization code for access token
4. Get your profile and person URN
5. Save everything to your .env file

📋 Your LinkedIn App Details:
   Client ID: ${LINKEDIN_CLIENT_ID}
   Redirect URI: ${REDIRECT_URI}
   Permissions: Share on LinkedIn, OpenID Connect
`);

    try {
      // Step 1: Start local server
      log.step(1, 'Starting local callback server...');
      await this.startServer();

      // Step 2: Open OAuth URL
      log.step(2, 'Opening LinkedIn authorization page...');
      await this.openAuthUrl();

      // Step 3: Wait for callback
      log.step(3, 'Waiting for you to authorize the app...');
      console.log(`${colors.yellow}👆 Please authorize the app in your browser${colors.reset}`);

      // The server will handle the rest
    } catch (error) {
      log.error(`Authentication failed: ${error.message}`);
      this.cleanup();
      process.exit(1);
    }
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true);

        if (parsedUrl.pathname === '/auth/linkedin/callback') {
          try {
            await this.handleCallback(req, res, parsedUrl.query);
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      });

      this.server.listen(PORT, 'localhost', err => {
        if (err) {
          reject(err);
        } else {
          log.success(`Callback server running on http://localhost:${PORT}`);
          resolve();
        }
      });

      this.server.on('error', err => {
        if (err.code === 'EADDRINUSE') {
          reject(
            new Error(
              `Port ${PORT} is already in use. Please close any other applications using this port.`
            )
          );
        } else {
          reject(err);
        }
      });
    });
  }

  async openAuthUrl() {
    const authUrl = this.generateAuthUrl();

    log.info('Authorization URL generated:');
    console.log(`${colors.blue}${authUrl}${colors.reset}\n`);

    // Open browser automatically
    try {
      const open = await import('open');
      await open.default(authUrl);
      log.success('Browser opened automatically');
    } catch (error) {
      log.warning('Could not open browser automatically');
      log.info('Please manually visit the URL above');
    }
  }

  generateAuthUrl() {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINKEDIN_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state: this.state,
      scope: 'openid profile email w_member_social', // FREE tier permissions only
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  async handleCallback(req, res, query) {
    try {
      // Send success page to browser
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head>
            <title>LinkedIn Authentication Success</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
              .success { background: #e8f5e8; border: 2px solid #4caf50; border-radius: 10px; padding: 30px; margin: 20px auto; max-width: 600px; }
              .title { color: #2e7d32; font-size: 24px; margin-bottom: 20px; }
              .message { color: #388e3c; font-size: 16px; line-height: 1.5; }
              .next-steps { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; text-align: left; }
            </style>
          </head>
          <body>
            <div class="success">
              <div class="title">✅ LinkedIn Authentication Successful!</div>
              <div class="message">
                Your LinkedIn account has been successfully connected to the Content Domination System.
                <br><br>
                You can close this browser window and return to your terminal.
              </div>
              <div class="next-steps">
                <strong>Next Steps:</strong><br>
                1. Check your terminal for completion status<br>
                2. Your credentials will be saved to .env file<br>
                3. You can start using LinkedIn integration immediately
              </div>
            </div>
          </body>
        </html>
      `);

      log.step(4, 'Processing authorization callback...');

      // Validate state
      if (query.state !== this.state) {
        throw new Error('Invalid state parameter - possible security issue');
      }

      if (query.error) {
        throw new Error(`LinkedIn OAuth error: ${query.error_description || query.error}`);
      }

      if (!query.code) {
        throw new Error('No authorization code received from LinkedIn');
      }

      log.success('Authorization code received successfully');

      // Step 5: Exchange code for tokens
      log.step(5, 'Exchanging authorization code for access token...');
      await this.exchangeCodeForTokens(query.code);

      // Step 6: Get profile
      log.step(6, 'Fetching your LinkedIn profile...');
      await this.fetchProfile();

      // Step 7: Save to .env
      log.step(7, 'Saving credentials to .env file...');
      await this.saveToEnv();

      // Success!
      this.showSuccess();

      // Cleanup and exit
      setTimeout(() => {
        this.cleanup();
        process.exit(0);
      }, 3000);
    } catch (error) {
      log.error(`Callback handling failed: ${error.message}`);

      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>LinkedIn Authentication Error</title></head>
          <body>
            <h1>❌ Authentication Failed</h1>
            <p>Error: ${error.message}</p>
            <p>Please check your terminal for details and try again.</p>
          </body>
        </html>
      `);

      this.cleanup();
      process.exit(1);
    }
  }

  async exchangeCodeForTokens(code) {
    try {
      const tokenData = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      };

      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams(tokenData).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 30000,
        }
      );

      this.tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };

      log.success('Access token obtained successfully');
      log.info(`Token expires in: ${Math.floor(this.tokens.expiresIn / 3600)} hours`);
    } catch (error) {
      if (error.response) {
        throw new Error(
          `LinkedIn token exchange failed: ${error.response.data.error_description || error.response.data.error || 'Unknown error'}`
        );
      } else {
        throw new Error(`Network error during token exchange: ${error.message}`);
      }
    }
  }

  async fetchProfile() {
    try {
      const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${this.tokens.accessToken}`,
          'LinkedIn-Version': '202408',
        },
        timeout: 30000,
      });

      this.profile = {
        id: response.data.sub,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        email: response.data.email,
        picture: response.data.picture,
        personUrn: `urn:li:person:${response.data.sub}`,
      };

      log.success(`Profile retrieved: ${this.profile.firstName} ${this.profile.lastName}`);
      log.info(`Email: ${this.profile.email}`);
      log.info(`Person URN: ${this.profile.personUrn}`);
    } catch (error) {
      if (error.response) {
        throw new Error(
          `LinkedIn profile fetch failed: ${error.response.data.error_description || error.response.data.error || 'Unknown error'}`
        );
      } else {
        throw new Error(`Network error during profile fetch: ${error.message}`);
      }
    }
  }

  async saveToEnv() {
    try {
      const envPath = path.join(process.cwd(), '.env');
      let envContent = '';

      // Read existing .env if it exists
      try {
        envContent = fs.readFileSync(envPath, 'utf8');
      } catch (error) {
        // File doesn't exist, start fresh
        log.info('.env file not found, creating new one...');
        envContent = '';
      }

      // Remove existing LinkedIn entries
      envContent = envContent
        .split('\n')
        .filter(line => !line.startsWith('LINKEDIN_'))
        .join('\n');

      // Add LinkedIn credentials
      const linkedinConfig = `

# ================================================
# LINKEDIN API - AUTHENTICATED SUCCESSFULLY
# ================================================
LINKEDIN_CLIENT_ID=${LINKEDIN_CLIENT_ID}
LINKEDIN_CLIENT_SECRET=${LINKEDIN_CLIENT_SECRET}
LINKEDIN_ACCESS_TOKEN=${this.tokens.accessToken}
LINKEDIN_REFRESH_TOKEN=${this.tokens.refreshToken || ''}
LINKEDIN_PERSON_URN=${this.profile.personUrn}

# Authentication details
LINKEDIN_TOKEN_EXPIRES_IN=${this.tokens.expiresIn}
LINKEDIN_TOKEN_TYPE=${this.tokens.tokenType}
LINKEDIN_AUTHENTICATED_USER=${this.profile.firstName} ${this.profile.lastName}
LINKEDIN_AUTHENTICATED_EMAIL=${this.profile.email}
LINKEDIN_AUTHENTICATION_DATE=${new Date().toISOString()}

# Free tier configuration
LINKEDIN_FREE_TIER_ONLY=true
LINKEDIN_POSTS_PER_DAY=3
LINKEDIN_REQUESTS_PER_HOUR=25
LINKEDIN_MIN_REQUEST_INTERVAL=3000
`;

      // Write updated .env file
      fs.writeFileSync(envPath, envContent + linkedinConfig);

      log.success('.env file updated with LinkedIn credentials');
      log.info(`Saved to: ${envPath}`);
    } catch (error) {
      throw new Error(`Failed to save credentials to .env: ${error.message}`);
    }
  }

  showSuccess() {
    console.log(
      `\n${colors.green}${colors.bold}🎉 LINKEDIN AUTHENTICATION COMPLETE!${colors.reset}\n`
    );

    console.log(`${colors.cyan}✅ Successfully authenticated:${colors.reset}`);
    console.log(`   👤 User: ${this.profile.firstName} ${this.profile.lastName}`);
    console.log(`   📧 Email: ${this.profile.email}`);
    console.log(`   🆔 Person URN: ${this.profile.personUrn}`);
    console.log(`   🔑 Access Token: ${this.tokens.accessToken.substring(0, 20)}...`);
    console.log(`   ⏰ Expires: ${Math.floor(this.tokens.expiresIn / 3600)} hours`);

    console.log(`\n${colors.cyan}✅ Credentials saved to .env file${colors.reset}`);

    console.log(`\n${colors.yellow}🚀 Next Steps:${colors.reset}`);
    console.log(`1. ${colors.blue}npm run verify-setup${colors.reset} - Test all connections`);
    console.log(`2. ${colors.blue}npm run test:linkedin${colors.reset} - Test LinkedIn posting`);
    console.log(
      `3. ${colors.blue}npm run start:economy${colors.reset} - Start zero-cost monitoring`
    );

    console.log(
      `\n${colors.green}✅ LinkedIn integration is now ready for the Content Domination System!${colors.reset}\n`
    );
  }

  cleanup() {
    if (this.server) {
      this.server.close();
      log.info('Server stopped');
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Authentication cancelled by user');
  process.exit(0);
});

process.on('uncaughtException', error => {
  log.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// Start authentication
const auth = new SimpleLinkedInAuth();
auth.authenticate().catch(error => {
  log.error(`Authentication failed: ${error.message}`);
  process.exit(1);
});

console.log(`\n${colors.yellow}💡 Troubleshooting Tips:${colors.reset}`);
console.log(`• Make sure port ${PORT} is not in use`);
console.log(`• Check your internet connection`);
console.log(`• Ensure LinkedIn app redirect URI is: ${REDIRECT_URI}`);
console.log(`• Make sure both LinkedIn permissions are approved`);
console.log(`• Press Ctrl+C to cancel at any time\n`);
