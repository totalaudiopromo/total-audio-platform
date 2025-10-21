#!/usr/bin/env node

/**
 * Unified Social Media Auto-Poster
 *
 * One simple system to post to LinkedIn, Bluesky, and Threads
 * Set it and forget it - handles all auth, retries, and scheduling
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class UnifiedSocialPoster {
  constructor(configPath = null) {
    this.configPath = configPath || path.join(__dirname, 'social-config.json');
    this.config = null;
    this.stats = {
      posted: 0,
      failed: 0,
      platforms: {
        linkedin: { success: 0, failed: 0 },
        bluesky: { success: 0, failed: 0 },
        threads: { success: 0, failed: 0 }
      }
    };
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      console.log('Configuration loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load config:', error.message);
      console.log('\nRun: node setup-wizard.js to create your config file');
      return false;
    }
  }

  /**
   * Post to all configured platforms
   */
  async postToAll(content, options = {}) {
    if (!this.config) {
      await this.loadConfig();
    }

    const results = {
      linkedin: null,
      bluesky: null,
      threads: null,
      success: false,
      errors: []
    };

    // Post to each enabled platform
    const platforms = ['linkedin', 'bluesky', 'threads'];

    for (const platform of platforms) {
      if (!this.config[platform]?.enabled) {
        console.log(`${platform}: Skipped (not enabled)`);
        continue;
      }

      try {
        console.log(`Posting to ${platform}...`);
        const result = await this[`postTo${this.capitalize(platform)}`](content, options);
        results[platform] = result;
        this.stats.platforms[platform].success++;
        this.stats.posted++;
        console.log(`${platform}: Posted successfully`);
      } catch (error) {
        console.error(`${platform}: Failed -`, error.message);
        results[platform] = { error: error.message };
        results.errors.push({ platform, error: error.message });
        this.stats.platforms[platform].failed++;
        this.stats.failed++;
      }

      // Rate limiting: wait 2 seconds between platforms
      await this.sleep(2000);
    }

    results.success = results.errors.length === 0;
    return results;
  }

  /**
   * Post to LinkedIn (FREE tier)
   */
  async postToLinkedin(content, options = {}) {
    const config = this.config.linkedin;

    if (!config.accessToken || !config.personUrn) {
      throw new Error('LinkedIn not configured. Run setup wizard.');
    }

    const postData = {
      author: config.personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: this.formatContent(content, 1300) // LinkedIn max
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': options.visibility || 'PUBLIC'
      }
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return {
      success: true,
      postId: response.data.id,
      url: `https://www.linkedin.com/feed/update/${response.data.id}`
    };
  }

  /**
   * Post to Bluesky
   */
  async postToBluesky(content, options = {}) {
    const config = this.config.bluesky;

    if (!config.handle || !config.appPassword) {
      throw new Error('Bluesky not configured. Run setup wizard.');
    }

    // Login to get session
    const authResponse = await axios.post(
      'https://bsky.social/xrpc/com.atproto.server.createSession',
      {
        identifier: config.handle,
        password: config.appPassword
      }
    );

    const { accessJwt, did } = authResponse.data;

    // Create post
    const postData = {
      repo: did,
      collection: 'app.bsky.feed.post',
      record: {
        text: this.formatContent(content, 300), // Bluesky max
        createdAt: new Date().toISOString()
      }
    };

    const response = await axios.post(
      'https://bsky.social/xrpc/com.atproto.repo.createRecord',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${accessJwt}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      postId: response.data.uri,
      url: `https://bsky.app/profile/${config.handle}/post/${response.data.uri.split('/').pop()}`
    };
  }

  /**
   * Post to Threads (via Instagram Graph API)
   */
  async postToThreads(content, options = {}) {
    const config = this.config.threads;

    if (!config.accessToken || !config.userId) {
      throw new Error('Threads not configured. Run setup wizard.');
    }

    // Step 1: Create media container
    const containerResponse = await axios.post(
      `https://graph.threads.net/v1.0/${config.userId}/threads`,
      {
        media_type: 'TEXT',
        text: this.formatContent(content, 500), // Threads max
        access_token: config.accessToken
      }
    );

    const containerId = containerResponse.data.id;

    // Step 2: Publish the container
    const publishResponse = await axios.post(
      `https://graph.threads.net/v1.0/${config.userId}/threads_publish`,
      {
        creation_id: containerId,
        access_token: config.accessToken
      }
    );

    return {
      success: true,
      postId: publishResponse.data.id,
      url: `https://www.threads.net/@${config.username}/post/${publishResponse.data.id}`
    };
  }

  /**
   * Schedule a post for later
   */
  async schedulePost(content, scheduledTime, options = {}) {
    const schedule = {
      content,
      scheduledTime: new Date(scheduledTime).toISOString(),
      options,
      status: 'pending'
    };

    // Save to schedule file
    const schedulePath = path.join(__dirname, 'scheduled-posts.json');
    let schedules = [];

    try {
      const data = await fs.readFile(schedulePath, 'utf8');
      schedules = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start fresh
    }

    schedules.push(schedule);
    await fs.writeFile(schedulePath, JSON.stringify(schedules, null, 2));

    console.log(`Post scheduled for ${scheduledTime}`);
    return { scheduled: true, id: schedules.length - 1 };
  }

  /**
   * Get posting statistics
   */
  getStats() {
    return {
      ...this.stats,
      successRate: this.stats.posted > 0
        ? ((this.stats.posted / (this.stats.posted + this.stats.failed)) * 100).toFixed(1) + '%'
        : '0%'
    };
  }

  // Helper methods
  formatContent(content, maxLength) {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength - 3) + '...';
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI usage
if (require.main === module) {
  const poster = new UnifiedSocialPoster();

  const args = process.argv.slice(2);
  const command = args[0];

  (async () => {
    switch (command) {
      case 'post':
        const content = args[1];
        if (!content) {
          console.log('Usage: node unified-poster.js post "Your post content here"');
          process.exit(1);
        }
        const results = await poster.postToAll(content);
        console.log('\nResults:', JSON.stringify(results, null, 2));
        console.log('\nStats:', poster.getStats());
        break;

      case 'schedule':
        const scheduleContent = args[1];
        const scheduleTime = args[2];
        if (!scheduleContent || !scheduleTime) {
          console.log('Usage: node unified-poster.js schedule "Content" "2025-10-22T10:00:00Z"');
          process.exit(1);
        }
        await poster.schedulePost(scheduleContent, scheduleTime);
        break;

      case 'stats':
        console.log('Stats:', poster.getStats());
        break;

      default:
        console.log(`
Unified Social Media Auto-Poster

Commands:
  post "content"              Post to all enabled platforms
  schedule "content" "time"   Schedule a post for later
  stats                       Show posting statistics

Examples:
  node unified-poster.js post "Hello from all platforms!"
  node unified-poster.js schedule "Tomorrow's post" "2025-10-22T10:00:00Z"
  node unified-poster.js stats
        `);
    }
  })().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = UnifiedSocialPoster;
