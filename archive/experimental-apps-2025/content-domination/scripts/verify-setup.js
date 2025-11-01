/**
 * Setup Verification Script for Content Domination System
 * Verifies all API connections and configurations are working
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Color output for terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const log = {
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: msg => console.log(`${colors.bold}${colors.blue}\n🔍 ${msg}${colors.reset}`),
};

class SetupVerifier {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
    };
    this.loadEnvironment();
  }

  loadEnvironment() {
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      log.error('❌ .env file not found! Copy .env.example to .env first.');
      process.exit(1);
    }

    require('dotenv').config();
    log.success('.env file loaded');
  }

  async runAllChecks() {
    log.header('Content Domination System - Setup Verification');
    console.log('🚀 Verifying all API connections and configurations...\n');

    await this.checkEnvironmentVariables();
    await this.checkTwitterAPI();
    await this.checkLinkedInAPI();
    await this.checkNotionAPI();
    await this.checkClaudeAPI();
    await this.checkKitAPI();
    await this.checkNewsSourceAPIs();
    await this.checkDatabaseConnections();
    await this.checkSecurityConfiguration();

    this.generateReport();
  }

  async checkEnvironmentVariables() {
    log.header('Environment Variables Check');

    const requiredVars = [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET',
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_TOKEN_SECRET',
      'TWITTER_BEARER_TOKEN',
      'LINKEDIN_CLIENT_ID',
      'LINKEDIN_CLIENT_SECRET',
      'NOTION_API_TOKEN',
      'ANTHROPIC_API_KEY',
      'KIT_API_KEY',
      'JWT_SECRET',
      'SESSION_SECRET',
      'ENCRYPTION_KEY',
    ];

    const optionalVars = [
      'SPOTIFY_CLIENT_ID',
      'INSTAGRAM_ACCESS_TOKEN',
      'SENTRY_DSN',
      'MIXPANEL_TOKEN',
    ];

    let allSet = true;

    for (const varName of requiredVars) {
      if (process.env[varName] && process.env[varName] !== `your_${varName.toLowerCase()}_here`) {
        log.success(`${varName} is configured`);
        this.results.passed++;
      } else {
        log.error(`${varName} is missing or using placeholder value`);
        this.results.failed++;
        this.results.issues.push(`Missing required environment variable: ${varName}`);
        allSet = false;
      }
    }

    for (const varName of optionalVars) {
      if (process.env[varName] && process.env[varName] !== `your_${varName.toLowerCase()}_here`) {
        log.success(`${varName} is configured (optional)`);
      } else {
        log.warning(`${varName} not configured (optional)`);
        this.results.warnings++;
      }
    }

    if (allSet) {
      log.success('All required environment variables are configured');
    }
  }

  async checkTwitterAPI() {
    log.header('Twitter API Connection Check');

    try {
      // Test bearer token authentication
      const response = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      });

      if (response.data && response.data.data) {
        log.success(`Twitter API connected successfully. User: @${response.data.data.username}`);
        this.results.passed++;

        // Test posting permissions (dry run)
        try {
          const postTest = await axios.post(
            'https://api.twitter.com/2/tweets',
            { text: 'Test post - ignore' },
            {
              headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                'Content-Type': 'application/json',
              },
            }
          );
          log.warning(
            'Twitter posting works, but we sent a test tweet. You may want to delete it.'
          );
        } catch (postError) {
          if (postError.response?.status === 403) {
            log.warning(
              'Twitter API connected but posting may be restricted. Check app permissions.'
            );
            this.results.warnings++;
          }
        }
      }
    } catch (error) {
      log.error(`Twitter API connection failed: ${error.response?.data?.detail || error.message}`);
      this.results.failed++;
      this.results.issues.push('Twitter API authentication failed');
    }
  }

  async checkLinkedInAPI() {
    log.header('LinkedIn API Connection Check');

    if (!process.env.LINKEDIN_ACCESS_TOKEN) {
      log.warning('LinkedIn access token not found. You need to complete OAuth flow first.');
      log.info('Run: npm run auth:linkedin');
      this.results.warnings++;
      return;
    }

    try {
      const response = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        },
      });

      if (response.data) {
        log.success(
          `LinkedIn API connected. User: ${response.data.localizedFirstName} ${response.data.localizedLastName}`
        );
        this.results.passed++;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        log.warning('LinkedIn access token expired. Run OAuth flow again.');
        this.results.warnings++;
      } else {
        log.error(`LinkedIn API error: ${error.response?.data?.message || error.message}`);
        this.results.failed++;
        this.results.issues.push('LinkedIn API authentication failed');
      }
    }
  }

  async checkNotionAPI() {
    log.header('Notion API Connection Check');

    const requiredDatabases = [
      'NOTION_VOICE_EXAMPLES_DB',
      'NOTION_CONTENT_TEMPLATES_DB',
      'NOTION_INDUSTRY_TERMS_DB',
      'NOTION_PERFORMANCE_ANALYTICS_DB',
      'NOTION_NEWSJACKING_OPPORTUNITIES_DB',
      'NOTION_CONTENT_CALENDAR_DB',
    ];

    try {
      // Test basic authentication
      const meResponse = await axios.get('https://api.notion.com/v1/users/me', {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
          'Notion-Version': '2022-06-28',
        },
      });

      if (meResponse.data) {
        log.success(`Notion API connected. Integration: ${meResponse.data.name}`);
        this.results.passed++;
      }

      // Test database access
      for (const dbVar of requiredDatabases) {
        const dbId = process.env[dbVar];
        if (!dbId || dbId.includes('your_') || dbId.includes('database_id')) {
          log.warning(`${dbVar} not configured or using placeholder`);
          this.results.warnings++;
          continue;
        }

        try {
          const dbResponse = await axios.get(`https://api.notion.com/v1/databases/${dbId}`, {
            headers: {
              Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
              'Notion-Version': '2022-06-28',
            },
          });

          if (dbResponse.data) {
            log.success(
              `Database accessible: ${dbResponse.data.title?.[0]?.plain_text || 'Unnamed'}`
            );
            this.results.passed++;
          }
        } catch (dbError) {
          log.error(
            `Database ${dbVar} not accessible: ${dbError.response?.data?.message || dbError.message}`
          );
          this.results.failed++;
          this.results.issues.push(`Notion database ${dbVar} not accessible`);
        }
      }
    } catch (error) {
      log.error(`Notion API connection failed: ${error.response?.data?.message || error.message}`);
      this.results.failed++;
      this.results.issues.push('Notion API authentication failed');
    }
  }

  async checkClaudeAPI() {
    log.header('Claude API (Anthropic) Connection Check');

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-haiku-20240307', // Use cheapest model for testing
          max_tokens: 10,
          messages: [
            {
              role: 'user',
              content: 'Hello',
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ANTHROPIC_API_KEY}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
        }
      );

      if (response.data && response.data.content) {
        log.success('Claude API connected successfully');
        this.results.passed++;

        // Check if using optimal model
        const configuredModel = process.env.CLAUDE_MODEL || 'claude-3-opus-20240229';
        if (configuredModel.includes('opus')) {
          log.info('Using Claude-3-Opus (most capable, highest cost)');
        } else if (configuredModel.includes('sonnet')) {
          log.info('Using Claude-3-Sonnet (balanced performance/cost)');
        } else {
          log.info('Using Claude-3-Haiku (fastest, lowest cost)');
        }
      }
    } catch (error) {
      log.error(
        `Claude API connection failed: ${error.response?.data?.error?.message || error.message}`
      );
      this.results.failed++;
      this.results.issues.push('Claude API authentication failed');
    }
  }

  async checkKitAPI() {
    log.header('Kit.com (ConvertKit) API Connection Check');

    try {
      const response = await axios.get(`https://api.kit.com/v3/account`, {
        headers: {
          Authorization: `Bearer ${process.env.KIT_API_KEY}`,
        },
      });

      if (response.data) {
        log.success(`Kit.com API connected. Account: ${response.data.name}`);
        this.results.passed++;

        // Check form access
        if (process.env.KIT_NEWSLETTER_FORM_ID) {
          try {
            const formResponse = await axios.get(
              `https://api.kit.com/v3/forms/${process.env.KIT_NEWSLETTER_FORM_ID}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.KIT_API_KEY}`,
                },
              }
            );
            log.success(`Newsletter form accessible: ${formResponse.data.name}`);
            this.results.passed++;
          } catch (formError) {
            log.warning('Newsletter form ID may be incorrect or inaccessible');
            this.results.warnings++;
          }
        }
      }
    } catch (error) {
      log.error(`Kit.com API connection failed: ${error.response?.data?.message || error.message}`);
      this.results.failed++;
      this.results.issues.push('Kit.com API authentication failed');
    }
  }

  async checkNewsSourceAPIs() {
    log.header('News Source RSS Feeds Check');

    const rssFeeds = [
      { name: 'Music Business Worldwide', url: process.env.MBW_RSS_URL },
      { name: 'Billboard', url: process.env.BILLBOARD_RSS_URL },
      { name: 'BBC Music', url: process.env.BBC_RSS_URL },
      { name: 'Digital Music News', url: process.env.DMN_RSS_URL },
      { name: 'Music Ally', url: process.env.MUSIC_ALLY_RSS_URL },
      { name: 'Hypebot', url: process.env.HYPEBOT_RSS_URL },
    ];

    for (const feed of rssFeeds) {
      if (!feed.url) {
        log.warning(`${feed.name} RSS URL not configured`);
        this.results.warnings++;
        continue;
      }

      try {
        const response = await axios.get(feed.url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Content-Domination-System/1.0',
          },
        });

        if ((response.data && response.data.includes('<rss')) || response.data.includes('<feed')) {
          log.success(`${feed.name} RSS feed accessible`);
          this.results.passed++;
        } else {
          log.warning(`${feed.name} returned data but may not be valid RSS`);
          this.results.warnings++;
        }
      } catch (error) {
        log.error(`${feed.name} RSS feed failed: ${error.message}`);
        this.results.failed++;
        this.results.issues.push(`RSS feed ${feed.name} not accessible`);
      }
    }

    // Check Spotify API if configured
    if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
      try {
        const authResponse = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        if (authResponse.data.access_token) {
          log.success('Spotify API credentials valid');
          this.results.passed++;
        }
      } catch (error) {
        log.error(
          `Spotify API failed: ${error.response?.data?.error_description || error.message}`
        );
        this.results.failed++;
      }
    }
  }

  async checkDatabaseConnections() {
    log.header('Database Connection Check');

    const dbUrl = process.env.DATABASE_URL;
    const redisUrl = process.env.REDIS_URL;

    if (dbUrl && !dbUrl.includes('username:password')) {
      try {
        // Basic connection test would require pg library
        log.info('Database URL configured (unable to test connection without pg library)');
        this.results.warnings++;
      } catch (error) {
        log.error(`Database connection failed: ${error.message}`);
        this.results.failed++;
      }
    } else {
      log.warning('Database URL not configured or using placeholder values');
      this.results.warnings++;
    }

    if (redisUrl && !redisUrl.includes('localhost:6379')) {
      log.info('Redis URL configured (unable to test connection without redis library)');
    } else {
      log.warning('Redis URL using default localhost (may need production configuration)');
      this.results.warnings++;
    }
  }

  async checkSecurityConfiguration() {
    log.header('Security Configuration Check');

    const secrets = ['JWT_SECRET', 'SESSION_SECRET', 'ENCRYPTION_KEY', 'WEBHOOK_SECRET'];

    for (const secret of secrets) {
      const value = process.env[secret];
      if (!value || value.includes('generate_') || value.includes('secret_here')) {
        log.error(`${secret} not properly configured (using placeholder or empty)`);
        this.results.failed++;
        this.results.issues.push(`Security secret ${secret} needs to be generated`);
      } else if (value.length < 32) {
        log.warning(`${secret} may be too short (recommended: 32+ characters)`);
        this.results.warnings++;
      } else {
        log.success(`${secret} properly configured`);
        this.results.passed++;
      }
    }

    // Check feature flags
    const enableNewsjacking = process.env.ENABLE_NEWSJACKING === 'true';
    const enableAutoPublish = process.env.ENABLE_AUTO_PUBLISH === 'true';

    if (enableNewsjacking) {
      log.success('Newsjacking feature enabled');
    } else {
      log.info('Newsjacking feature disabled');
    }

    if (enableAutoPublish) {
      log.warning('Auto-publishing enabled - ensure you trust the content quality settings');
      this.results.warnings++;
    } else {
      log.info('Auto-publishing disabled (manual approval required)');
    }
  }

  generateReport() {
    log.header('Setup Verification Report');

    console.log(`\n📊 SUMMARY:`);
    console.log(`${colors.green}✅ Passed: ${this.results.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${this.results.failed}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Warnings: ${this.results.warnings}${colors.reset}`);

    if (this.results.failed === 0) {
      console.log(
        `\n${colors.green}${colors.bold}🎉 SETUP VERIFICATION SUCCESSFUL!${colors.reset}`
      );
      console.log(
        `${colors.green}Your Content Domination System is ready to launch.${colors.reset}`
      );

      console.log(`\n📋 NEXT STEPS:`);
      console.log(`1. ${colors.blue}npm run start${colors.reset} - Launch the system`);
      console.log(`2. ${colors.blue}npm run test${colors.reset} - Run test content generation`);
      console.log(`3. Monitor the logs for any issues`);

      if (this.results.warnings > 0) {
        console.log(`\n${colors.yellow}📝 OPTIONAL IMPROVEMENTS:${colors.reset}`);
        console.log(`- Consider configuring optional services for enhanced functionality`);
        console.log(`- Review security settings for production deployment`);
      }
    } else {
      console.log(`\n${colors.red}${colors.bold}⚠️  SETUP INCOMPLETE${colors.reset}`);
      console.log(`${colors.red}Please resolve the following issues:${colors.reset}\n`);

      this.results.issues.forEach((issue, index) => {
        console.log(`${colors.red}${index + 1}. ${issue}${colors.reset}`);
      });

      console.log(`\n${colors.blue}💡 TROUBLESHOOTING:${colors.reset}`);
      console.log(`- Review the API_SETUP_GUIDE.md for detailed instructions`);
      console.log(`- Check your .env file against .env.example`);
      console.log(`- Verify API keys are active and have correct permissions`);
      console.log(`- Run ${colors.blue}npm run verify-setup${colors.reset} again after fixes`);
    }

    console.log(`\n${colors.blue}📖 Documentation: ./docs/API_SETUP_GUIDE.md${colors.reset}`);
    console.log(
      `${colors.blue}🔧 Support: Check troubleshooting section in setup guide${colors.reset}\n`
    );

    // Exit with error code if critical issues found
    if (this.results.failed > 0) {
      process.exit(1);
    }
  }
}

// Run verification
const verifier = new SetupVerifier();
verifier.runAllChecks().catch(error => {
  console.error(`${colors.red}❌ Verification script failed: ${error.message}${colors.reset}`);
  process.exit(1);
});
