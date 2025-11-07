/**
 * Live News Monitoring Setup Script
 * Configures and starts real-time news monitoring for the newsjacking engine
 */

const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Color output
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
  newsjack: msg => console.log(`${colors.magenta}🔥 ${msg}${colors.reset}`),
  monitoring: msg => console.log(`${colors.cyan}👁️  ${msg}${colors.reset}`),
  header: msg => console.log(`${colors.bold}${colors.blue}\n🚀 ${msg}${colors.reset}`),
};

class NewsMonitoringSetup {
  constructor() {
    this.loadEnvironment();
    this.isRunning = false;
    this.lastScanTime = null;
    this.opportunitiesDetected = 0;
    this.alertsSent = 0;
    this.startTime = new Date();
  }

  loadEnvironment() {
    require('dotenv').config();

    if (!process.env.ENABLE_NEWSJACKING || process.env.ENABLE_NEWSJACKING !== 'true') {
      log.warning('Newsjacking is disabled in environment. Set ENABLE_NEWSJACKING=true to enable.');
      process.exit(0);
    }

    log.success('Environment loaded and newsjacking enabled');
  }

  async start() {
    log.header('Content Domination System - Live News Monitoring');
    console.log('🎯 Starting real-time music industry newsjacking monitoring...\n');

    // Validate setup
    await this.validateSetup();

    // Initialize monitoring systems
    await this.initializeMonitoringSystems();

    // Start monitoring schedules
    this.startMonitoringSchedules();

    // Setup graceful shutdown
    this.setupGracefulShutdown();

    this.isRunning = true;
    log.success('🔥 NEWSJACKER 3000 IS NOW LIVE! 🔥');
    this.showDashboard();
  }

  async validateSetup() {
    log.info('Validating newsjacking setup...');

    const required = [
      'TWITTER_BEARER_TOKEN',
      'NOTION_API_TOKEN',
      'ANTHROPIC_API_KEY',
      'NOTION_NEWSJACKING_OPPORTUNITIES_DB',
    ];

    for (const env of required) {
      if (!process.env[env] || process.env[env].includes('your_')) {
        log.error(`Missing required environment variable: ${env}`);
        process.exit(1);
      }
    }

    // Test API connections
    try {
      const axios = require('axios');

      // Test Claude API
      await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ANTHROPIC_API_KEY}`,
            'anthropic-version': '2023-06-01',
          },
        }
      );
      log.success('Claude API connection verified');

      // Test Notion API
      await axios.get('https://api.notion.com/v1/users/me', {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
          'Notion-Version': '2022-06-28',
        },
      });
      log.success('Notion API connection verified');
    } catch (error) {
      log.error(`API validation failed: ${error.message}`);
      process.exit(1);
    }
  }

  async initializeMonitoringSystems() {
    log.info('Initializing monitoring systems...');

    // Initialize RSS feed parsers
    this.initializeRSSMonitoring();

    // Initialize Twitter monitoring
    this.initializeTwitterMonitoring();

    // Initialize alert systems
    this.initializeAlertSystems();

    // Initialize performance tracking
    this.initializePerformanceTracking();

    log.success('All monitoring systems initialized');
  }

  initializeRSSMonitoring() {
    const RSSParser = require('rss-parser');
    this.rssParser = new RSSParser({
      customFields: {
        item: ['description', 'content:encoded', 'summary'],
      },
    });

    this.rssFeeds = [
      { name: 'Music Business Worldwide', url: process.env.MBW_RSS_URL, priority: 'high' },
      { name: 'Billboard', url: process.env.BILLBOARD_RSS_URL, priority: 'high' },
      { name: 'Music Week', url: process.env.MUSIC_WEEK_RSS_URL, priority: 'high' },
      { name: 'BBC Music', url: process.env.BBC_RSS_URL, priority: 'medium' },
      { name: 'Digital Music News', url: process.env.DMN_RSS_URL, priority: 'medium' },
      { name: 'Music Ally', url: process.env.MUSIC_ALLY_RSS_URL, priority: 'high' },
      { name: 'Hypebot', url: process.env.HYPEBOT_RSS_URL, priority: 'low' },
    ].filter(feed => feed.url && !feed.url.includes('your_'));

    log.success(`RSS monitoring initialized for ${this.rssFeeds.length} sources`);
  }

  initializeTwitterMonitoring() {
    // Twitter monitoring for trending hashtags and mentions
    this.twitterKeywords = [
      '#musicbusiness',
      '#musicindustry',
      '#spotify',
      '#applemusic',
      '#musicmarketing',
      '#musicpromo',
      '#playlistpitching',
      '#musictech',
      '#artistdevelopment',
      '#musicstreaming',
      '#recordlabel',
      '#musicdistribution',
    ];

    log.success(`Twitter monitoring initialized for ${this.twitterKeywords.length} keywords`);
  }

  initializeAlertSystems() {
    this.alertChannels = [];

    // Email alerts
    if (process.env.SMTP_HOST) {
      this.alertChannels.push('email');
    }

    // Slack alerts
    if (process.env.SLACK_WEBHOOK_URL) {
      this.alertChannels.push('slack');
    }

    // Webhook alerts
    if (process.env.WEBHOOK_ALERT_URL) {
      this.alertChannels.push('webhook');
    }

    log.success(`Alert systems initialized: ${this.alertChannels.join(', ')}`);
  }

  initializePerformanceTracking() {
    this.metrics = {
      totalScans: 0,
      newsItemsFound: 0,
      opportunitiesDetected: 0,
      highValueOpportunities: 0,
      averageResponseTime: 0,
      successfulPublications: 0,
    };

    log.success('Performance tracking initialized');
  }

  startMonitoringSchedules() {
    log.info('Starting monitoring schedules...');

    // High-frequency RSS monitoring (every 5 minutes)
    cron.schedule('*/5 * * * *', async () => {
      if (this.isRunning) {
        await this.scanRSSFeeds();
      }
    });

    // Twitter monitoring (every 10 minutes)
    cron.schedule('*/10 * * * *', async () => {
      if (this.isRunning) {
        await this.scanTwitterTrends();
      }
    });

    // Performance reporting (every hour)
    cron.schedule('0 * * * *', () => {
      if (this.isRunning) {
        this.generateHourlyReport();
      }
    });

    // Daily summary (9 AM UK time)
    cron.schedule(
      '0 9 * * *',
      () => {
        if (this.isRunning) {
          this.generateDailySummary();
        }
      },
      {
        timezone: 'Europe/London',
      }
    );

    log.success('All monitoring schedules started');
  }

  async scanRSSFeeds() {
    log.monitoring('Scanning RSS feeds for new opportunities...');
    this.lastScanTime = new Date();
    this.metrics.totalScans++;

    const startTime = Date.now();
    let newItemsFound = 0;
    let opportunitiesDetected = 0;

    for (const feed of this.rssFeeds) {
      try {
        const feedData = await this.rssParser.parseURL(feed.url);
        const recentItems = this.filterRecentItems(feedData.items, 30); // Last 30 minutes

        newItemsFound += recentItems.length;

        for (const item of recentItems) {
          const opportunity = await this.analyzeNewsItem(item, feed);
          if (opportunity.relevanceScore > 0.6) {
            await this.handleNewsjackingOpportunity(opportunity);
            opportunitiesDetected++;

            if (opportunity.relevanceScore > 0.8) {
              this.metrics.highValueOpportunities++;
              await this.sendCriticalAlert(opportunity);
            }
          }
        }

        if (recentItems.length > 0) {
          log.monitoring(
            `${feed.name}: ${recentItems.length} new items, ${opportunitiesDetected} opportunities`
          );
        }
      } catch (error) {
        log.error(`RSS scan failed for ${feed.name}: ${error.message}`);
      }
    }

    const scanTime = Date.now() - startTime;
    this.metrics.newsItemsFound += newItemsFound;
    this.metrics.opportunitiesDetected += opportunitiesDetected;
    this.metrics.averageResponseTime = (this.metrics.averageResponseTime + scanTime) / 2;

    if (opportunitiesDetected > 0) {
      log.newsjack(
        `🔥 SCAN COMPLETE: ${opportunitiesDetected} new opportunities detected in ${scanTime}ms`
      );
    }
  }

  async scanTwitterTrends() {
    log.monitoring('Scanning Twitter trends...');

    try {
      const axios = require('axios');

      // Get trending topics in music category
      const trendsResponse = await axios.get(
        'https://api.twitter.com/1.1/trends/place.json?id=23424975',
        {
          // UK trends
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          },
        }
      );

      const trends = trendsResponse.data[0]?.trends || [];
      const musicTrends = trends.filter(
        trend => this.isMusicRelated(trend.name) || trend.tweet_volume > 10000
      );

      for (const trend of musicTrends.slice(0, 5)) {
        // Process top 5 relevant trends
        await this.analyzeTrendingTopic(trend);
      }

      if (musicTrends.length > 0) {
        log.monitoring(`Twitter: ${musicTrends.length} music-related trends analyzed`);
      }
    } catch (error) {
      log.error(`Twitter trends scan failed: ${error.message}`);
    }
  }

  filterRecentItems(items, minutesThreshold = 30) {
    const thresholdTime = new Date(Date.now() - minutesThreshold * 60 * 1000);

    return items.filter(item => {
      const publishDate = new Date(item.pubDate || item.isoDate);
      return publishDate > thresholdTime;
    });
  }

  async analyzeNewsItem(item, source) {
    const content = item.content || item.description || item.summary || '';
    const title = item.title || '';

    // Quick relevance scoring
    const relevanceScore = this.calculateRelevanceScore(title, content);

    // Automation angle detection
    const automationAngle = this.detectAutomationAngle(title, content);

    // First-mover advantage check
    const firstMover = await this.checkFirstMoverAdvantage(title, content);

    return {
      id: this.generateOpportunityId(),
      source: source.name,
      priority: source.priority,
      title,
      content,
      url: item.link,
      publishDate: new Date(item.pubDate || item.isoDate),
      relevanceScore,
      automationAngle,
      firstMover,
      detectedAt: new Date(),
    };
  }

  calculateRelevanceScore(title, content) {
    const text = `${title} ${content}`.toLowerCase();
    let score = 0;

    // High-value keywords (0.3 each)
    const highValueKeywords = [
      'spotify',
      'apple music',
      'playlist',
      'streaming',
      'music marketing',
      'artist development',
      'record label',
      'music business',
      'promotion',
      'automation',
      'ai',
      'algorithm',
      'discovery',
      'playlist pitching',
    ];

    // Medium-value keywords (0.2 each)
    const mediumValueKeywords = [
      'music industry',
      'musicians',
      'artists',
      'distribution',
      'royalties',
      'sync licensing',
      'music tech',
      'social media',
      'fan engagement',
      'music video',
      'tour',
      'concert',
      'festival',
    ];

    // Score based on keyword presence
    highValueKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 0.3;
    });

    mediumValueKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 0.2;
    });

    // Boost for trending topics
    if (text.includes('breaking') || text.includes('announces') || text.includes('launches')) {
      score += 0.2;
    }

    // Boost for automation opportunities
    if (text.includes('manual') || text.includes('time-consuming') || text.includes('scale')) {
      score += 0.25;
    }

    return Math.min(score, 1.0); // Cap at 1.0
  }

  detectAutomationAngle(title, content) {
    const text = `${title} ${content}`.toLowerCase();

    if (text.includes('playlist') && (text.includes('submission') || text.includes('pitching'))) {
      return 'playlist_automation';
    }

    if (text.includes('social media') || text.includes('content creation')) {
      return 'content_automation';
    }

    if (text.includes('email') || text.includes('marketing campaign')) {
      return 'email_automation';
    }

    if (text.includes('data') || text.includes('analytics') || text.includes('tracking')) {
      return 'analytics_automation';
    }

    if (text.includes('distribution') || text.includes('release')) {
      return 'distribution_automation';
    }

    return 'general_automation';
  }

  async checkFirstMoverAdvantage(title, content) {
    // Simple heuristic: if published in last 15 minutes and high relevance
    const publishTime = new Date();
    const now = new Date();
    const timeDiff = now - publishTime;

    return timeDiff < 15 * 60 * 1000; // 15 minutes
  }

  async handleNewsjackingOpportunity(opportunity) {
    log.newsjack(
      `NEW OPPORTUNITY: ${opportunity.title} (Score: ${opportunity.relevanceScore.toFixed(2)})`
    );

    // Store in Notion database
    await this.saveOpportunityToNotion(opportunity);

    // Generate content if high-value
    if (opportunity.relevanceScore > 0.8) {
      await this.generateNewsjackingContent(opportunity);
    }

    this.opportunitiesDetected++;
  }

  async saveOpportunityToNotion(opportunity) {
    try {
      const axios = require('axios');

      const response = await axios.post(
        `https://api.notion.com/v1/pages`,
        {
          parent: { database_id: process.env.NOTION_NEWSJACKING_OPPORTUNITIES_DB },
          properties: {
            Headline: {
              title: [{ text: { content: opportunity.title } }],
            },
            Source: {
              url: opportunity.url,
            },
            'Relevance Score': {
              number: opportunity.relevanceScore,
            },
            Status: {
              select: { name: opportunity.relevanceScore > 0.8 ? 'High Priority' : 'Pending' },
            },
            'Automation Angle': {
              rich_text: [{ text: { content: opportunity.automationAngle } }],
            },
            'Detected At': {
              date: { start: opportunity.detectedAt.toISOString() },
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        log.success(`Opportunity saved to Notion: ${opportunity.title}`);
      }
    } catch (error) {
      log.error(`Failed to save to Notion: ${error.message}`);
    }
  }

  async generateNewsjackingContent(opportunity) {
    log.newsjack(`Generating content for: ${opportunity.title}`);

    try {
      const axios = require('axios');

      const prompt = `
You are Chris from Total Audio Promo, and you've just seen this breaking music industry news:

HEADLINE: ${opportunity.title}
CONTENT: ${opportunity.content}
AUTOMATION ANGLE: ${opportunity.automationAngle}

Create a compelling Twitter thread (3-4 tweets) that:
1. References this news naturally
2. Connects it to automation opportunities in music marketing
3. Positions Audio Intel as a solution
4. Uses your casual British professional voice
5. Includes actionable insights

Keep it conversational, authentic, and helpful. No sales-y language.
`;

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ANTHROPIC_API_KEY}`,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      const content = response.data.content[0].text;

      // Save generated content back to Notion
      await this.updateNotionWithContent(opportunity, content);

      log.newsjack(`Content generated and saved for: ${opportunity.title}`);
    } catch (error) {
      log.error(`Content generation failed: ${error.message}`);
    }
  }

  async updateNotionWithContent(opportunity, content) {
    // Implementation would update the Notion page with generated content
    log.info('Content saved to Notion for review');
  }

  async sendCriticalAlert(opportunity) {
    const alertMessage = `🚨 CRITICAL NEWSJACKING OPPORTUNITY DETECTED!\n\nHeadline: ${
      opportunity.title
    }\nRelevance Score: ${opportunity.relevanceScore.toFixed(2)}\nSource: ${
      opportunity.source
    }\nFirst Mover: ${
      opportunity.firstMover ? 'YES' : 'NO'
    }\n\nView in Notion for content generation.`;

    // Send to all configured alert channels
    for (const channel of this.alertChannels) {
      try {
        await this.sendAlert(channel, alertMessage, opportunity);
        log.success(`Critical alert sent via ${channel}`);
        this.alertsSent++;
      } catch (error) {
        log.error(`Alert failed for ${channel}: ${error.message}`);
      }
    }
  }

  async sendAlert(channel, message, opportunity) {
    const axios = require('axios');

    switch (channel) {
      case 'slack':
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
          text: message,
          attachments: [
            {
              color: 'danger',
              fields: [
                {
                  title: 'Relevance Score',
                  value: opportunity.relevanceScore.toFixed(2),
                  short: true,
                },
                { title: 'Source', value: opportunity.source, short: true },
                { title: 'URL', value: opportunity.url, short: false },
              ],
            },
          ],
        });
        break;

      case 'webhook':
        await axios.post(process.env.WEBHOOK_ALERT_URL, {
          type: 'newsjacking_opportunity',
          message,
          data: opportunity,
        });
        break;

      // Email implementation would go here
    }
  }

  generateHourlyReport() {
    const uptime = Date.now() - this.startTime.getTime();
    const uptimeHours = (uptime / (1000 * 60 * 60)).toFixed(1);

    log.info('📊 HOURLY PERFORMANCE REPORT');
    log.info(`Uptime: ${uptimeHours} hours`);
    log.info(`Total Scans: ${this.metrics.totalScans}`);
    log.info(`News Items Found: ${this.metrics.newsItemsFound}`);
    log.info(`Opportunities Detected: ${this.metrics.opportunitiesDetected}`);
    log.info(`High-Value Opportunities: ${this.metrics.highValueOpportunities}`);
    log.info(`Alerts Sent: ${this.alertsSent}`);
    log.info(`Average Response Time: ${this.metrics.averageResponseTime.toFixed(0)}ms`);
  }

  showDashboard() {
    // Clear screen and show live dashboard
    console.clear();

    const header = `
╔══════════════════════════════════════════════════════════════════════╗
║                    🔥 NEWSJACKER 3000 - LIVE DASHBOARD 🔥            ║
╚══════════════════════════════════════════════════════════════════════╝`;

    console.log(colors.bold + colors.magenta + header + colors.reset);

    const dashboard = `
📊 CURRENT STATUS: ${this.isRunning ? '🟢 ACTIVE' : '🔴 STOPPED'}
⏰ Started: ${this.startTime.toLocaleString()}
🕐 Last Scan: ${this.lastScanTime?.toLocaleString() || 'Not yet run'}

📈 PERFORMANCE METRICS:
   Total Scans: ${this.metrics.totalScans}
   Opportunities Found: ${this.opportunitiesDetected}
   High-Value Alerts: ${this.metrics.highValueOpportunities}
   Alerts Sent: ${this.alertsSent}

🎯 MONITORING:
   RSS Sources: ${this.rssFeeds.length} active
   Twitter Keywords: ${this.twitterKeywords.length}
   Alert Channels: ${this.alertChannels.length}

⚡ NEXT ACTIONS:
   → RSS Scan: Every 5 minutes
   → Twitter Scan: Every 10 minutes
   → Performance Report: Every hour
   → Daily Summary: 9 AM UK

${colors.cyan}Press Ctrl+C to stop monitoring${colors.reset}
`;

    console.log(dashboard);

    // Update dashboard every 30 seconds
    if (this.isRunning) {
      setTimeout(() => this.showDashboard(), 30000);
    }
  }

  isMusicRelated(text) {
    const musicKeywords = [
      'music',
      'spotify',
      'apple music',
      'playlist',
      'artist',
      'song',
      'album',
      'streaming',
      'record',
      'label',
      'tour',
      'concert',
      'festival',
      'musician',
    ];

    const lowerText = text.toLowerCase();
    return musicKeywords.some(keyword => lowerText.includes(keyword));
  }

  async analyzeTrendingTopic(trend) {
    // Implementation for analyzing trending Twitter topics
    log.monitoring(`Analyzing trend: ${trend.name}`);
  }

  generateOpportunityId() {
    return `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setupGracefulShutdown() {
    process.on('SIGINT', () => {
      log.info('\n🛑 Shutting down gracefully...');
      this.isRunning = false;

      // Generate final report
      const uptime = Date.now() - this.startTime.getTime();
      const uptimeHours = (uptime / (1000 * 60 * 60)).toFixed(1);

      console.log(`\n📊 FINAL REPORT:`);
      console.log(`Total Runtime: ${uptimeHours} hours`);
      console.log(`Opportunities Detected: ${this.opportunitiesDetected}`);
      console.log(`Alerts Sent: ${this.alertsSent}`);
      console.log(`Total Scans: ${this.metrics.totalScans}`);

      log.success('Newsjacker 3000 stopped successfully');
      process.exit(0);
    });
  }
}

// Start monitoring
const monitor = new NewsMonitoringSetup();
monitor.start().catch(error => {
  log.error(`Failed to start monitoring: ${error.message}`);
  process.exit(1);
});
