#!/usr/bin/env node

/**
 * Daily Audio Intel Automation - UK Premium Times
 *
 * Rotates through your 3 authentic Audio Intel posts:
 * 1. BBC Radio 1 case study
 * 2. Spotify playlist success
 * 3. Time savings value prop
 *
 * Posts at UK premium times: 8am, 1pm, 7pm
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

// Your 3 authentic Audio Intel posts ONLY
const AUTHENTIC_AUDIO_INTEL_POSTS = [
  {
    id: 'bbc_radio1_case',
    name: 'BBC Radio 1 Case Study',
    content: `Just enriched BBC Radio 1 contacts in 15 minutes. What used to take me a full weekend of research.

The time savings are incredible for radio promotion campaigns. From chaotic spreadsheets to organised contact intelligence.

This is why I built Audio Intel.

Try it: intel.totalaudiopromo.com`,
    hashtags: [],
  },
  {
    id: 'spotify_success',
    name: 'Spotify Playlist Success',
    content: `Real case study: Spotify playlist curator contacts enriched with 100% success rate.

Built Audio Intel because I was tired of spending 15+ hours per campaign researching radio contacts. Now it's automated.

From manual Excel chaos to professional contact intelligence in minutes.

intel.totalaudiopromo.com`,
    hashtags: [],
  },
  {
    id: 'time_savings_value',
    name: 'Time Savings Value Prop',
    content: `The hidden cost of manual contact research in music promotion: 15+ hours per campaign.

That's £300+ in time value for indie artists. Audio Intel turns this into a 15-minute process.

Time saved = more music created.

intel.totalaudiopromo.com`,
    hashtags: [],
  },
];

// UK premium posting times (highest engagement)
const UK_PREMIUM_TIMES = [
  { hour: 8, minute: 0, description: 'Morning commute peak' },
  { hour: 13, minute: 0, description: 'Lunch break peak' },
  { hour: 19, minute: 0, description: 'Evening prime time' },
];

const POSTING_LOG_FILE = path.join(process.cwd(), 'data', 'posting-log.json');

class AudioIntelAutomation {
  constructor() {
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
      // File doesn't exist yet
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

  async authenticateBlueSky() {
    const identifier = process.env.BLUESKY_IDENTIFIER;
    const password = process.env.BLUESKY_APP_PASSWORD;

    if (!identifier || !password) {
      throw new Error('BlueSky credentials not found in .env');
    }

    const response = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`BlueSky authentication failed: ${error}`);
    }

    return await response.json();
  }

  getNextPost() {
    // Find which posts haven't been used recently
    const today = new Date().toDateString();
    const usedToday = Array.from(this.postingHistory.entries())
      .filter(([key, data]) => new Date(data.timestamp).toDateString() === today)
      .map(([key, data]) => data.postId);

    const availablePosts = AUTHENTIC_AUDIO_INTEL_POSTS.filter(post => !usedToday.includes(post.id));

    if (availablePosts.length === 0) {
      // All posts used today, start fresh tomorrow
      console.log('All authentic posts used today. Cycle complete.');
      return null;
    }

    // Return next unused post
    return availablePosts[0];
  }

  async postToBlueSky(session, post) {
    const fullText = `${post.content}\n\n${post.hashtags.join(' ')}`;

    await this.log(`📝 Posting: "${post.name}"`);

    const postData = {
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record: {
        text: fullText,
        createdAt: new Date().toISOString(),
        $type: 'app.bsky.feed.post',
      },
    };

    const response = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessJwt}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Post failed: ${error}`);
    }

    const result = await response.json();
    const postId = result.uri.split('/').pop();
    const postUrl = `https://bsky.app/profile/${session.handle}/post/${postId}`;

    // Log successful post
    this.postingHistory.set(`${Date.now()}`, {
      postId: post.id,
      postName: post.name,
      timestamp: new Date().toISOString(),
      url: postUrl,
      platform: 'bluesky',
    });

    await this.savePostingHistory();
    await this.log(`✅ Posted successfully: ${postUrl}`);

    return { result, postUrl };
  }

  async runDailyPosting() {
    try {
      await this.log('🚀 Starting daily Audio Intel posting automation');

      // Authenticate
      const session = await this.authenticateBlueSky();
      await this.log('✅ BlueSky authenticated');

      // Get next authentic post
      const nextPost = this.getNextPost();

      if (!nextPost) {
        await this.log('📊 All authentic content posted today. Automation complete.');
        return;
      }

      // Determine optimal time
      const now = new Date();
      const currentHour = now.getHours();

      let nextTime = UK_PREMIUM_TIMES.find(time => time.hour > currentHour);
      if (!nextTime) {
        nextTime = UK_PREMIUM_TIMES[0]; // Tomorrow morning
      }

      await this.log(
        `⏰ Next optimal time: ${nextTime.hour}:${nextTime.minute.toString().padStart(2, '0')} (${nextTime.description})`
      );

      // For immediate posting (if run at optimal time)
      if (currentHour === nextTime.hour || process.argv.includes('--force')) {
        await this.postToBlueSky(session, nextPost);
      } else {
        await this.log(`⏸️ Waiting for optimal time. Use --force to post now.`);
      }
    } catch (error) {
      await this.log(`❌ Error: ${error.message}`);
      throw error;
    }
  }

  async showStatus() {
    const today = new Date().toDateString();
    const todaysPosts = Array.from(this.postingHistory.entries()).filter(
      ([key, data]) => new Date(data.timestamp).toDateString() === today
    );

    console.log('\n📊 Audio Intel Automation Status');
    console.log('=================================');
    console.log(`Date: ${today}`);
    console.log(`Posts today: ${todaysPosts.length}/3`);

    if (todaysPosts.length > 0) {
      console.log("\nToday's posts:");
      todaysPosts.forEach(([key, data]) => {
        const time = new Date(data.timestamp).toLocaleTimeString('en-GB', {
          timeZone: 'Europe/London',
        });
        console.log(`  ${time} - ${data.postName}`);
        console.log(`    ${data.url}`);
      });
    }

    const nextPost = this.getNextPost();
    if (nextPost) {
      console.log(`\nNext post: ${nextPost.name}`);
    } else {
      console.log('\n✅ All authentic content posted today');
    }

    console.log('\nUK Premium Times:');
    UK_PREMIUM_TIMES.forEach(time => {
      console.log(
        `  ${time.hour}:${time.minute.toString().padStart(2, '0')} - ${time.description}`
      );
    });
  }
}

async function main() {
  const automation = new AudioIntelAutomation();
  const command = process.argv[2];

  switch (command) {
    case 'post':
      await automation.runDailyPosting();
      break;

    case 'status':
      await automation.showStatus();
      break;

    case 'force':
      process.argv.push('--force');
      await automation.runDailyPosting();
      break;

    default:
      console.log(`
Audio Intel Daily Automation

Commands:
  post      Run daily posting (checks optimal time)
  force     Force posting now (ignore time check)
  status    Show today's posting status

Authentic Content Rotation:
1. BBC Radio 1 Case Study
2. Spotify Playlist Success
3. Time Savings Value Prop

UK Premium Times:
• 8:00 AM - Morning commute peak
• 1:00 PM - Lunch break peak
• 7:00 PM - Evening prime time

Examples:
  node scripts/daily-audio-intel-automation.js post
  node scripts/daily-audio-intel-automation.js status
  node scripts/daily-audio-intel-automation.js force
      `);
  }
}

main().catch(console.error);
