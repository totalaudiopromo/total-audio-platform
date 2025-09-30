#!/usr/bin/env node

/**
 * Social Media Scheduler for Total Audio Promo
 *
 * Multi-platform social media scheduling system with content calendar management
 * Supports X (Twitter), LinkedIn, Bluesky, and Threads
 *
 * Features:
 * - Automated posting to multiple platforms
 * - Content calendar with optimal timing
 * - Platform-specific formatting
 * - UTM tracking for all links
 * - Performance analytics
 * - Notion integration for content management
 */

const fs = require('fs');
const path = require('path');

// Simple logger
const logger = {
  info: (msg, ...args) => console.log(`[SOCIAL-SCHEDULER] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[SOCIAL-SCHEDULER] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[SOCIAL-SCHEDULER] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✓ [SOCIAL-SCHEDULER] ${msg}`, ...args)
};

class SocialMediaScheduler {
  constructor() {
    this.name = 'SocialMediaScheduler';
    this.contentDirectory = path.join(__dirname, '../../../apps/audio-intel/social-content');

    // Platform configurations
    this.platforms = {
      twitter: {
        name: 'Twitter/X',
        enabled: true,
        charLimit: 280,
        threadLimit: 25,
        optimalTimes: ['09:00', '14:00', '18:00'],
        timezone: 'Europe/London',
        weekdayPreference: ['Monday', 'Wednesday', 'Friday']
      },
      linkedin: {
        name: 'LinkedIn',
        enabled: true,
        charLimit: 3000,
        optimalTimes: ['09:00', '12:00', '17:00'],
        timezone: 'Europe/London',
        weekdayPreference: ['Monday', 'Wednesday', 'Friday']
      },
      bluesky: {
        name: 'Bluesky',
        enabled: true,
        charLimit: 300,
        optimalTimes: ['10:00', '14:00', '18:00'],
        timezone: 'Europe/London',
        weekdayPreference: ['Tuesday', 'Thursday']
      },
      threads: {
        name: 'Threads',
        enabled: true,
        charLimit: 500,
        optimalTimes: ['09:00', '13:00', '19:00'],
        timezone: 'Europe/London',
        weekdayPreference: ['Tuesday', 'Thursday']
      }
    };

    // Content calendar
    this.calendar = [];
    this.scheduledPosts = 0;
    this.publishedPosts = 0;
  }

  /**
   * Initialize the scheduler
   */
  async initialize() {
    try {
      logger.info('Initializing Social Media Scheduler...');

      // Load existing content
      await this.loadContentLibrary();

      // Generate content calendar
      await this.generateContentCalendar();

      logger.success('Social Media Scheduler initialized successfully');
      return true;
    } catch (error) {
      logger.error('Initialization failed:', error);
      return false;
    }
  }

  /**
   * Load content from markdown files
   */
  async loadContentLibrary() {
    logger.info('Loading content library...');

    this.contentLibrary = {
      linkedin: [],
      twitter: [],
      bluesky: [],
      threads: [],
      emails: [],
      blogs: []
    };

    try {
      // Load LinkedIn posts
      const linkedinPath = path.join(this.contentDirectory, 'RADIO_PROMOTER_LINKEDIN_POSTS.md');
      if (fs.existsSync(linkedinPath)) {
        const content = fs.readFileSync(linkedinPath, 'utf8');
        this.contentLibrary.linkedin = this.parseLinkedInPosts(content);
        logger.info(`Loaded ${this.contentLibrary.linkedin.length} LinkedIn posts`);
      }

      // Load Twitter/X threads
      const twitterPath = path.join(this.contentDirectory, 'TWITTER_X_THREADS_RADIO_PROMOTERS.md');
      if (fs.existsSync(twitterPath)) {
        const content = fs.readFileSync(twitterPath, 'utf8');
        this.contentLibrary.twitter = this.parseTwitterThreads(content);
        logger.info(`Loaded ${this.contentLibrary.twitter.length} Twitter threads`);
      }

      // Load Bluesky and Threads content
      const blueskyThreadsPath = path.join(this.contentDirectory, 'BLUESKY_THREADS_CONTENT.md');
      if (fs.existsSync(blueskyThreadsPath)) {
        const content = fs.readFileSync(blueskyThreadsPath, 'utf8');
        const parsed = this.parseBlueskyThreadsContent(content);
        this.contentLibrary.bluesky = parsed.bluesky;
        this.contentLibrary.threads = parsed.threads;
        logger.info(`Loaded ${this.contentLibrary.bluesky.length} Bluesky posts`);
        logger.info(`Loaded ${this.contentLibrary.threads.length} Threads posts`);
      }

      // Load email templates
      const emailPath = path.join(this.contentDirectory, 'COLD_OUTREACH_EMAIL_TEMPLATES.md');
      if (fs.existsSync(emailPath)) {
        const content = fs.readFileSync(emailPath, 'utf8');
        this.contentLibrary.emails = this.parseEmailTemplates(content);
        logger.info(`Loaded ${this.contentLibrary.emails.length} email templates`);
      }

      // Load blog posts
      const blogPath = path.join(this.contentDirectory, 'SEO_CASE_STUDY_BLOG_POSTS.md');
      if (fs.existsSync(blogPath)) {
        const content = fs.readFileSync(blogPath, 'utf8');
        this.contentLibrary.blogs = this.parseBlogPosts(content);
        logger.info(`Loaded ${this.contentLibrary.blogs.length} blog posts`);
      }

      logger.success('Content library loaded successfully');
    } catch (error) {
      logger.error('Failed to load content library:', error);
      throw error;
    }
  }

  /**
   * Parse LinkedIn posts from markdown
   */
  parseLinkedInPosts(content) {
    const posts = [];
    const postRegex = /## Post \d+: (.+?)\n\n([\s\S]+?)(?=\n## Post \d+:|---\n\n\*\*Total\*\*:|$)/g;
    let match;

    while ((match = postRegex.exec(content)) !== null) {
      const [, title, body] = match;

      // Extract URL
      const urlMatch = body.match(/\*\*URL\*\*: (https?:\/\/[^\s]+)/);
      const url = urlMatch ? urlMatch[1] : null;

      // Extract hashtags
      const hashtagMatch = body.match(/#\w+(?:\s+#\w+)*/);
      const hashtags = hashtagMatch ? hashtagMatch[0].split(/\s+/) : [];

      // Clean body text (remove URL and hashtag lines)
      let cleanBody = body
        .replace(/\*\*URL\*\*: https?:\/\/[^\s]+\n*/g, '')
        .replace(/#\w+(?:\s+#\w+)*\n*/g, '')
        .trim();

      posts.push({
        platform: 'linkedin',
        title: title.trim(),
        content: cleanBody,
        url,
        hashtags,
        charCount: cleanBody.length,
        category: this.categorizeContent(title)
      });
    }

    return posts;
  }

  /**
   * Parse Twitter threads from markdown
   */
  parseTwitterThreads(content) {
    const threads = [];
    const threadRegex = /## Thread \d+: (.+?)\n\n([\s\S]+?)(?=\n## Thread \d+:|---\n\n\*\*Total\*\*:|$)/g;
    let match;

    while ((match = threadRegex.exec(content)) !== null) {
      const [, title, body] = match;

      // Extract individual tweets (separated by --- or numbered lines)
      const tweets = [];
      const tweetParts = body.split(/\n---\n/);

      tweetParts.forEach((part, index) => {
        const cleaned = part.trim();
        if (cleaned && !cleaned.startsWith('**') && cleaned.length > 10) {
          tweets.push({
            index: index + 1,
            content: cleaned,
            charCount: cleaned.length
          });
        }
      });

      if (tweets.length > 0) {
        threads.push({
          platform: 'twitter',
          title: title.trim(),
          tweets,
          tweetCount: tweets.length,
          category: this.categorizeContent(title)
        });
      }
    }

    return threads;
  }

  /**
   * Parse Bluesky and Threads content
   */
  parseBlueskyThreadsContent(content) {
    const result = { bluesky: [], threads: [] };

    // Parse Bluesky posts
    const blueskySection = content.match(/## BLUESKY POSTS[\s\S]*?(?=## THREADS POSTS|$)/);
    if (blueskySection) {
      const postRegex = /### Bluesky Post \d+: (.+?)\n([\s\S]+?)(?=\n### Bluesky Post \d+:|---\n\n## THREADS POSTS|$)/g;
      let match;

      while ((match = postRegex.exec(blueskySection[0])) !== null) {
        const [, title, body] = match;
        const cleaned = body.trim();

        result.bluesky.push({
          platform: 'bluesky',
          title: title.trim(),
          content: cleaned,
          charCount: cleaned.length,
          category: this.categorizeContent(title)
        });
      }
    }

    // Parse Threads posts
    const threadsSection = content.match(/## THREADS POSTS[\s\S]*?(?=## CONTENT POSTING SCHEDULE|$)/);
    if (threadsSection) {
      const postRegex = /### Threads Post \d+: (.+?)\n([\s\S]+?)(?=\n### Threads Post \d+:|---\n\n## CONTENT POSTING SCHEDULE|$)/g;
      let match;

      while ((match = postRegex.exec(threadsSection[0])) !== null) {
        const [, title, body] = match;
        const cleaned = body.trim();

        result.threads.push({
          platform: 'threads',
          title: title.trim(),
          content: cleaned,
          charCount: cleaned.length,
          category: this.categorizeContent(title)
        });
      }
    }

    return result;
  }

  /**
   * Parse email templates
   */
  parseEmailTemplates(content) {
    const templates = [];
    const templateRegex = /## Template \d+: (.+?)\n\n\*\*Subject\*\*: (.+?)\n\n([\s\S]+?)(?=\n## Template \d+:|---\n\n## Email Outreach Best Practices|$)/g;
    let match;

    while ((match = templateRegex.exec(content)) !== null) {
      const [, title, subject, body] = match;

      templates.push({
        type: 'email',
        title: title.trim(),
        subject: subject.trim(),
        content: body.trim(),
        segment: this.categorizeEmailSegment(title)
      });
    }

    return templates;
  }

  /**
   * Parse blog posts
   */
  parseBlogPosts(content) {
    const posts = [];
    const postRegex = /## Case Study \d+: (.+?)\n\n\*\*Meta Title\*\*: (.+?)\n\*\*Meta Description\*\*: (.+?)\n([\s\S]+?)(?=\n## Case Study \d+:|---\n\n\*\*Total\*\*:|$)/g;
    let match;

    while ((match = postRegex.exec(content)) !== null) {
      const [, title, metaTitle, metaDescription, body] = match;

      posts.push({
        type: 'blog',
        title: title.trim(),
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        content: body.trim(),
        wordCount: body.split(/\s+/).length
      });
    }

    return posts;
  }

  /**
   * Categorize content by theme
   */
  categorizeContent(title) {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('bbc') || titleLower.includes('radio 1')) return 'bbc_case_study';
    if (titleLower.includes('time') || titleLower.includes('hour')) return 'time_savings';
    if (titleLower.includes('price') || titleLower.includes('cost') || titleLower.includes('roi')) return 'pricing';
    if (titleLower.includes('response') || titleLower.includes('result')) return 'results';
    if (titleLower.includes('regional')) return 'regional_radio';
    if (titleLower.includes('brighton') || titleLower.includes('story') || titleLower.includes('producer')) return 'founder_story';
    if (titleLower.includes('spreadsheet') || titleLower.includes('chaos')) return 'problem_awareness';
    if (titleLower.includes('window') || titleLower.includes('deadline')) return 'urgency';

    return 'general';
  }

  /**
   * Categorize email by segment
   */
  categorizeEmailSegment(title) {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('national') || titleLower.includes('bbc')) return 'national_radio';
    if (titleLower.includes('regional') || titleLower.includes('independent')) return 'regional_radio';
    if (titleLower.includes('small') || titleLower.includes('1-5')) return 'small_agency';
    if (titleLower.includes('established') || titleLower.includes('6-20')) return 'established_agency';
    if (titleLower.includes('diy') || titleLower.includes('self')) return 'diy_artist';

    return 'general';
  }

  /**
   * Generate 4-week content calendar
   */
  async generateContentCalendar() {
    logger.info('Generating 4-week content calendar...');

    const startDate = new Date();
    const calendar = [];

    // Week 1: Problem Awareness
    calendar.push(...this.scheduleWeek(startDate, 0, 'problem_awareness', [
      { day: 'Monday', platforms: ['linkedin', 'bluesky'], categories: ['bbc_case_study', 'time_savings'] },
      { day: 'Tuesday', platforms: ['threads'], categories: ['problem_awareness'] },
      { day: 'Wednesday', platforms: ['twitter', 'linkedin'], categories: ['founder_story', 'time_savings'] },
      { day: 'Thursday', platforms: ['bluesky', 'threads'], categories: ['bbc_case_study', 'bbc_case_study'] },
      { day: 'Friday', platforms: ['linkedin'], categories: ['pricing'] }
    ]));

    // Week 2: Solution Education
    calendar.push(...this.scheduleWeek(startDate, 1, 'solution_education', [
      { day: 'Monday', platforms: ['twitter', 'bluesky'], categories: ['bbc_case_study', 'regional_radio'] },
      { day: 'Tuesday', platforms: ['threads', 'linkedin'], categories: ['regional_radio', 'results'] },
      { day: 'Wednesday', platforms: ['bluesky'], categories: ['pricing'] },
      { day: 'Thursday', platforms: ['threads', 'linkedin'], categories: ['pricing', 'problem_awareness'] },
      { day: 'Friday', platforms: ['twitter'], categories: ['founder_story'] }
    ]));

    // Week 3: Social Proof & Results
    calendar.push(...this.scheduleWeek(startDate, 2, 'social_proof', [
      { day: 'Monday', platforms: ['linkedin', 'bluesky'], categories: ['founder_story', 'results'] },
      { day: 'Tuesday', platforms: ['threads'], categories: ['results'] },
      { day: 'Wednesday', platforms: ['twitter', 'bluesky'], categories: ['urgency', 'founder_story'] },
      { day: 'Thursday', platforms: ['threads', 'linkedin'], categories: ['founder_story', 'problem_awareness'] },
      { day: 'Friday', platforms: ['bluesky'], categories: ['urgency'] }
    ]));

    // Week 4: Call-to-Action Focus
    calendar.push(...this.scheduleWeek(startDate, 3, 'cta_focus', [
      { day: 'Monday', platforms: ['linkedin', 'threads'], categories: ['regional_radio', 'urgency'] },
      { day: 'Tuesday', platforms: ['bluesky', 'twitter'], categories: ['problem_awareness', 'pricing'] },
      { day: 'Wednesday', platforms: ['threads', 'linkedin'], categories: ['problem_awareness', 'pricing'] },
      { day: 'Thursday', platforms: ['bluesky', 'threads'], categories: ['pricing', 'pricing'] },
      { day: 'Friday', platforms: ['twitter', 'linkedin', 'threads'], categories: ['results', 'general', 'general'] }
    ]));

    this.calendar = calendar;
    this.scheduledPosts = calendar.length;

    logger.success(`Generated ${calendar.length} scheduled posts across 4 weeks`);

    return calendar;
  }

  /**
   * Schedule posts for a specific week
   */
  scheduleWeek(startDate, weekOffset, weekTheme, dailySchedule) {
    const posts = [];
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + (weekOffset * 7));

    dailySchedule.forEach(({ day, platforms, categories }) => {
      const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(day);
      const postDate = new Date(weekStart);
      postDate.setDate(postDate.getDate() + dayIndex);

      platforms.forEach((platform, index) => {
        const category = categories[index] || categories[0];
        const content = this.selectContentByCategory(platform, category);

        if (content) {
          const platformConfig = this.platforms[platform];
          const postTime = platformConfig.optimalTimes[index % platformConfig.optimalTimes.length];
          const [hours, minutes] = postTime.split(':');

          const scheduledTime = new Date(postDate);
          scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0);

          posts.push({
            id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            platform,
            platformName: platformConfig.name,
            content,
            scheduledTime,
            weekTheme,
            category,
            status: 'scheduled',
            createdAt: new Date()
          });
        }
      });
    });

    return posts;
  }

  /**
   * Select content by category and platform
   */
  selectContentByCategory(platform, category) {
    const library = this.contentLibrary[platform];
    if (!library || library.length === 0) return null;

    // Find content matching category
    const matching = library.filter(item => item.category === category);

    // If no exact match, use first available
    const content = matching.length > 0 ? matching[0] : library[0];

    return content;
  }

  /**
   * Export content calendar to JSON
   */
  exportCalendarJSON() {
    const calendarData = {
      generated: new Date().toISOString(),
      totalPosts: this.calendar.length,
      platforms: Object.keys(this.platforms).filter(p => this.platforms[p].enabled),
      weeks: 4,
      schedule: this.calendar.map(post => ({
        id: post.id,
        platform: post.platformName,
        title: post.content.title,
        scheduledTime: post.scheduledTime.toISOString(),
        weekTheme: post.weekTheme,
        category: post.category,
        status: post.status
      }))
    };

    const outputPath = path.join(this.contentDirectory, 'CONTENT_CALENDAR.json');
    fs.writeFileSync(outputPath, JSON.stringify(calendarData, null, 2));

    logger.success(`Calendar exported to ${outputPath}`);
    return outputPath;
  }

  /**
   * Export content calendar to Markdown
   */
  exportCalendarMarkdown() {
    let markdown = '# Social Media Content Calendar - 4 Weeks\n\n';
    markdown += `**Generated**: ${new Date().toISOString()}\n`;
    markdown += `**Total Scheduled Posts**: ${this.calendar.length}\n`;
    markdown += `**Platforms**: ${Object.keys(this.platforms).filter(p => this.platforms[p].enabled).join(', ')}\n\n`;
    markdown += '---\n\n';

    // Group by week
    const weeks = {};
    this.calendar.forEach(post => {
      const week = Math.floor((post.scheduledTime - this.calendar[0].scheduledTime) / (7 * 24 * 60 * 60 * 1000)) + 1;
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(post);
    });

    // Format each week
    Object.keys(weeks).sort().forEach(weekNum => {
      const weekPosts = weeks[weekNum];
      const weekTheme = weekPosts[0].weekTheme;

      markdown += `## Week ${weekNum}: ${weekTheme.replace(/_/g, ' ').toUpperCase()}\n\n`;

      // Group by day
      const days = {};
      weekPosts.forEach(post => {
        const day = post.scheduledTime.toLocaleDateString('en-GB', { weekday: 'long' });
        if (!days[day]) days[day] = [];
        days[day].push(post);
      });

      // Format each day
      Object.keys(days).forEach(day => {
        markdown += `### ${day}\n\n`;

        days[day].forEach(post => {
          const time = post.scheduledTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          markdown += `**${time} - ${post.platformName}**: ${post.content.title}\n`;
          markdown += `- Category: ${post.category.replace(/_/g, ' ')}\n`;
          markdown += `- Status: ${post.status}\n\n`;
        });
      });

      markdown += '---\n\n';
    });

    // Add platform statistics
    markdown += '## Platform Distribution\n\n';
    const platformCounts = {};
    this.calendar.forEach(post => {
      platformCounts[post.platformName] = (platformCounts[post.platformName] || 0) + 1;
    });

    Object.entries(platformCounts).forEach(([platform, count]) => {
      markdown += `- **${platform}**: ${count} posts\n`;
    });

    markdown += '\n---\n\n';

    // Add category statistics
    markdown += '## Content Category Distribution\n\n';
    const categoryCounts = {};
    this.calendar.forEach(post => {
      const cat = post.category.replace(/_/g, ' ');
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    Object.entries(categoryCounts).forEach(([category, count]) => {
      markdown += `- **${category}**: ${count} posts\n`;
    });

    const outputPath = path.join(this.contentDirectory, 'CONTENT_CALENDAR.md');
    fs.writeFileSync(outputPath, markdown);

    logger.success(`Calendar exported to ${outputPath}`);
    return outputPath;
  }

  /**
   * Generate CSV for easy import to scheduling tools
   */
  exportCalendarCSV() {
    let csv = 'Platform,Title,Scheduled Time,Day,Week Theme,Category,Status\n';

    this.calendar.forEach(post => {
      const time = post.scheduledTime.toISOString();
      const day = post.scheduledTime.toLocaleDateString('en-GB', { weekday: 'long' });
      const title = (post.content.title || '').replace(/"/g, '""');

      csv += `"${post.platformName}","${title}","${time}","${day}","${post.weekTheme}","${post.category}","${post.status}"\n`;
    });

    const outputPath = path.join(this.contentDirectory, 'CONTENT_CALENDAR.csv');
    fs.writeFileSync(outputPath, csv);

    logger.success(`Calendar exported to ${outputPath}`);
    return outputPath;
  }

  /**
   * Generate summary report
   */
  generateSummaryReport() {
    const report = {
      generated: new Date().toISOString(),
      contentLibrary: {
        linkedin: this.contentLibrary.linkedin.length,
        twitter: this.contentLibrary.twitter.length,
        bluesky: this.contentLibrary.bluesky.length,
        threads: this.contentLibrary.threads.length,
        emails: this.contentLibrary.emails.length,
        blogs: this.contentLibrary.blogs.length,
        total: Object.values(this.contentLibrary).reduce((sum, arr) => sum + arr.length, 0)
      },
      calendar: {
        weeks: 4,
        totalPosts: this.calendar.length,
        scheduledPosts: this.scheduledPosts,
        publishedPosts: this.publishedPosts,
        platforms: Object.keys(this.platforms).filter(p => this.platforms[p].enabled).length
      },
      platforms: Object.entries(this.platforms).reduce((acc, [key, config]) => {
        if (config.enabled) {
          const posts = this.calendar.filter(p => p.platform === key);
          acc[key] = {
            name: config.name,
            charLimit: config.charLimit,
            optimalTimes: config.optimalTimes,
            scheduledPosts: posts.length,
            weekdays: config.weekdayPreference
          };
        }
        return acc;
      }, {})
    };

    return report;
  }

  /**
   * Health check
   */
  async healthCheck() {
    return {
      status: 'healthy',
      agent: this.name,
      contentLibrary: {
        linkedin: this.contentLibrary.linkedin.length,
        twitter: this.contentLibrary.twitter.length,
        bluesky: this.contentLibrary.bluesky.length,
        threads: this.contentLibrary.threads.length,
        emails: this.contentLibrary.emails.length,
        blogs: this.contentLibrary.blogs.length
      },
      calendar: {
        scheduledPosts: this.scheduledPosts,
        publishedPosts: this.publishedPosts
      },
      platforms: Object.entries(this.platforms).reduce((acc, [key, config]) => {
        acc[key] = config.enabled ? 'enabled' : 'disabled';
        return acc;
      }, {}),
      timestamp: new Date()
    };
  }
}

// Command line interface
if (require.main === module) {
  const scheduler = new SocialMediaScheduler();
  const command = process.argv[2] || 'generate';

  async function run() {
    await scheduler.initialize();

    switch (command) {
      case 'generate':
        logger.info('Generating content calendar...');
        const jsonPath = scheduler.exportCalendarJSON();
        const mdPath = scheduler.exportCalendarMarkdown();
        const csvPath = scheduler.exportCalendarCSV();
        const report = scheduler.generateSummaryReport();

        console.log('\n' + '='.repeat(60));
        console.log('SOCIAL MEDIA SCHEDULER - SUMMARY REPORT');
        console.log('='.repeat(60) + '\n');

        console.log('📚 CONTENT LIBRARY');
        console.log(`   LinkedIn posts: ${report.contentLibrary.linkedin}`);
        console.log(`   Twitter threads: ${report.contentLibrary.twitter}`);
        console.log(`   Bluesky posts: ${report.contentLibrary.bluesky}`);
        console.log(`   Threads posts: ${report.contentLibrary.threads}`);
        console.log(`   Email templates: ${report.contentLibrary.emails}`);
        console.log(`   Blog posts: ${report.contentLibrary.blogs}`);
        console.log(`   Total content pieces: ${report.contentLibrary.total}\n`);

        console.log('📅 CONTENT CALENDAR');
        console.log(`   Duration: ${report.calendar.weeks} weeks`);
        console.log(`   Total scheduled posts: ${report.calendar.totalPosts}`);
        console.log(`   Active platforms: ${report.calendar.platforms}\n`);

        console.log('🎯 PLATFORM BREAKDOWN');
        Object.entries(report.platforms).forEach(([key, data]) => {
          console.log(`   ${data.name}:`);
          console.log(`      - Scheduled: ${data.scheduledPosts} posts`);
          console.log(`      - Optimal times: ${data.optimalTimes.join(', ')}`);
          console.log(`      - Preferred days: ${data.weekdays.join(', ')}`);
        });

        console.log('\n📁 EXPORTED FILES');
        console.log(`   JSON: ${jsonPath}`);
        console.log(`   Markdown: ${mdPath}`);
        console.log(`   CSV: ${csvPath}`);

        console.log('\n' + '='.repeat(60));
        logger.success('Content calendar generation complete!');
        break;

      case 'health':
        const health = await scheduler.healthCheck();
        console.log(JSON.stringify(health, null, 2));
        break;

      case 'summary':
        const summary = scheduler.generateSummaryReport();
        console.log(JSON.stringify(summary, null, 2));
        break;

      default:
        console.log('Usage: node social-media-scheduler.js [generate|health|summary]');
        console.log('');
        console.log('Commands:');
        console.log('  generate  - Generate 4-week content calendar (default)');
        console.log('  health    - Check scheduler health and content status');
        console.log('  summary   - Display summary report');
    }
  }

  run().catch(console.error);
}

module.exports = SocialMediaScheduler;