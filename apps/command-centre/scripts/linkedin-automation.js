#!/usr/bin/env node

/**
 * LinkedIn Automation for Audio Intel
 * Posts authentic Audio Intel content to LinkedIn
 */

require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Audio Intel content optimized for LinkedIn's professional audience
const LINKEDIN_AUDIO_INTEL_POSTS = [
  {
    id: 'bbc_radio1_linkedin',
    name: 'BBC Radio 1 Professional Case Study',
    content: `Professional case study: BBC Radio 1 contact enrichment

Recently completed contact research for BBC Radio 1 in 15 minutes. What previously required a full weekend of manual research.

The transformation from chaotic spreadsheets to organised contact intelligence has been incredible for radio promotion campaigns.

This experience is why I built Audio Intel.

intel.totalaudiopromo.com`,
  },
  {
    id: 'spotify_linkedin_professional',
    name: 'Spotify Success - Professional Context',
    content: `Industry results: Spotify playlist curator contact enrichment with 100% success rate

After years of spending 15+ hours per campaign researching radio contacts manually, I developed Audio Intel to automate this process.

The shift from manual Excel chaos to professional contact intelligence has transformed campaign efficiency.

Built by music industry professionals, for music industry professionals.

intel.totalaudiopromo.com`,
  },
  {
    id: 'time_value_professional',
    name: 'Professional Time Value Analysis',
    content: `Industry analysis: The hidden cost of manual contact research in music promotion

Research shows 15+ hours per campaign spent on contact research. For independent artists, this represents £300+ in time value.

Audio Intel reduces this to a 15-minute process, allowing professionals to focus on relationship building rather than data management.

Time optimisation equals more strategic music promotion.

intel.totalaudiopromo.com`,
  },
];

const POSTING_LOG_FILE = path.join(process.cwd(), 'data', 'linkedin-posting-log.json');

class LinkedInAutomation {
  constructor() {
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    this.personId = process.env.LINKEDIN_PERSON_ID;
    this.postingHistory = new Map();
    this.loadPostingHistory();
  }

  async loadPostingHistory() {
    try {
      await fs.mkdir(path.dirname(POSTING_LOG_FILE), { recursive: true });
      const data = await fs.readFile(POSTING_LOG_FILE, 'utf8');
      const history = JSON.parse(data);
      this.postingHistory = new Map(Object.entries(history));
    } catch (error) {
      this.postingHistory = new Map();
    }
  }

  async savePostingHistory() {
    const historyObject = Object.fromEntries(this.postingHistory);
    await fs.writeFile(POSTING_LOG_FILE, JSON.stringify(historyObject, null, 2));
  }

  async log(message) {
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    console.log(`[${timestamp}] ${message}`);
  }

  async authenticateLinkedIn() {
    if (!this.accessToken || !this.personId) {
      throw new Error('LinkedIn not authenticated. Run setup-linkedin-auth.js first');
    }

    // Test the token by fetching profile
    const response = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LinkedIn authentication failed: ${error}`);
    }

    const profile = await response.json();
    await this.log(
      `✅ LinkedIn authenticated: ${profile.firstName.localized.en_US} ${profile.lastName.localized.en_US}`
    );
    return true;
  }

  getNextLinkedInPost() {
    const today = new Date().toDateString();
    const usedToday = Array.from(this.postingHistory.entries())
      .filter(([key, data]) => new Date(data.timestamp).toDateString() === today)
      .map(([key, data]) => data.postId);

    const availablePosts = LINKEDIN_AUDIO_INTEL_POSTS.filter(post => !usedToday.includes(post.id));

    if (availablePosts.length === 0) {
      console.log('All LinkedIn posts used today. Cycle complete.');
      return null;
    }

    return availablePosts[0];
  }

  async postToLinkedIn(post) {
    if (!this.accessToken || !this.personId) {
      throw new Error('LinkedIn not authenticated');
    }

    await this.log(`📝 Posting to LinkedIn: "${post.name}"`);

    const postData = {
      author: `urn:li:person:${this.personId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: post.content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LinkedIn post failed: ${error}`);
    }

    const result = await response.json();

    // Track successful post
    const contentHash = crypto.createHash('md5').update(post.content).digest('hex');
    this.postingHistory.set(`${Date.now()}`, {
      postId: post.id,
      postName: post.name,
      timestamp: new Date().toISOString(),
      platform: 'linkedin',
      linkedInPostId: result.id,
      contentHash,
    });

    await this.savePostingHistory();
    await this.log(`✅ Posted to LinkedIn successfully: ${result.id}`);

    return result;
  }

  async runLinkedInPosting() {
    try {
      await this.log('🚀 Starting LinkedIn Audio Intel posting');

      // Authenticate
      await this.authenticateLinkedIn();

      // Get next post
      const nextPost = this.getNextLinkedInPost();

      if (!nextPost) {
        await this.log('📊 All LinkedIn content posted today');
        return;
      }

      // Post to LinkedIn
      await this.postToLinkedIn(nextPost);
    } catch (error) {
      await this.log(`❌ LinkedIn posting error: ${error.message}`);
      throw error;
    }
  }

  async showLinkedInStatus() {
    const today = new Date().toDateString();
    const todaysPosts = Array.from(this.postingHistory.entries()).filter(
      ([key, data]) => new Date(data.timestamp).toDateString() === today
    );

    console.log('\n💼 LinkedIn Automation Status');
    console.log('==============================');
    console.log(`Date: ${today}`);
    console.log(`Posts today: ${todaysPosts.length}/3`);

    if (todaysPosts.length > 0) {
      console.log("\nToday's LinkedIn posts:");
      todaysPosts.forEach(([key, data]) => {
        const time = new Date(data.timestamp).toLocaleTimeString('en-GB', {
          timeZone: 'Europe/London',
        });
        console.log(`  ${time} - ${data.postName}`);
        console.log(`    LinkedIn Post ID: ${data.linkedInPostId}`);
      });
    }

    const nextPost = this.getNextLinkedInPost();
    if (nextPost) {
      console.log(`\nNext LinkedIn post: ${nextPost.name}`);
    } else {
      console.log('\n✅ All LinkedIn content posted today');
    }

    console.log('\nLinkedIn Professional Posts:');
    LINKEDIN_AUDIO_INTEL_POSTS.forEach((post, index) => {
      console.log(`${index + 1}. ${post.name}`);
    });
  }
}

async function main() {
  const automation = new LinkedInAutomation();
  const command = process.argv[2];

  switch (command) {
    case 'post':
      await automation.runLinkedInPosting();
      break;

    case 'status':
      await automation.showLinkedInStatus();
      break;

    case 'test':
      console.log('🧪 Testing LinkedIn authentication...');
      try {
        await automation.authenticateLinkedIn();
        console.log('✅ LinkedIn authentication successful');
      } catch (error) {
        console.error('❌ LinkedIn authentication failed:', error.message);
        console.log('\n💡 Run this to set up authentication:');
        console.log('node scripts/setup-linkedin-auth.js');
      }
      break;

    default:
      console.log(`
LinkedIn Audio Intel Automation

Commands:
  post      Post next Audio Intel content to LinkedIn
  status    Show LinkedIn posting status
  test      Test LinkedIn authentication

Professional Content:
1. BBC Radio 1 Professional Case Study
2. Spotify Success - Professional Context
3. Professional Time Value Analysis

Examples:
  node scripts/linkedin-automation.js post
  node scripts/linkedin-automation.js status
  node scripts/linkedin-automation.js test
      `);
  }
}

main().catch(console.error);
