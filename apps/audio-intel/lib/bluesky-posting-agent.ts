/**
 * Bluesky Autonomous Posting Agent
 *
 * Handles automated posting to Bluesky using the ATP (AT Protocol)
 * Reads from content calendar and posts according to schedule
 */

import { BskyAgent } from '@atproto/api';

export interface BlueskyPost {
  id: string;
  platform: string;
  title: string;
  scheduledTime: string;
  weekTheme: string;
  category: string;
  status: string;
  content?: string;
}

export interface BlueskyCredentials {
  identifier: string; // Your Bluesky handle (e.g., yourname.bsky.social)
  password: string;   // App password (not your main password)
}

export class BlueskyPostingAgent {
  private agent: BskyAgent;
  private credentials: BlueskyCredentials;

  constructor(credentials: BlueskyCredentials) {
    this.agent = new BskyAgent({
      service: 'https://bsky.social'
    });
    this.credentials = credentials;
  }

  /**
   * Authenticate with Bluesky
   */
  async authenticate(): Promise<boolean> {
    try {
      await this.agent.login({
        identifier: this.credentials.identifier,
        password: this.credentials.password
      });
      console.log('[BLUESKY] ✅ Authenticated successfully');
      return true;
    } catch (error) {
      console.error('[BLUESKY] ❌ Authentication failed:', error);
      return false;
    }
  }

  /**
   * Post to Bluesky
   */
  async post(text: string): Promise<{ success: boolean; uri?: string; error?: string }> {
    try {
      const response = await this.agent.post({
        text,
        createdAt: new Date().toISOString()
      });

      console.log('[BLUESKY] ✅ Posted successfully:', response.uri);

      return {
        success: true,
        uri: response.uri
      };
    } catch (error) {
      console.error('[BLUESKY] ❌ Post failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get Bluesky content by title from markdown file
   */
  getContentByTitle(title: string): string | null {
    // Content mapping from BLUESKY_THREADS_CONTENT.md
    const contentMap: Record<string, string> = {
      'The Time Problem': `After 5+ years promoting music to UK radio, I was spending 15+ hours weekly researching contacts.

Built Audio Intel to solve this properly. Now it takes 2 minutes instead of 15 hours.

The music industry needs tools built by people who actually use them daily.

intel.totalaudiopromo.com`,

      'BBC Radio 1 Test': `Tested Audio Intel on 5 BBC Radio 1 contacts yesterday.

Processing time: 2 minutes
Manual research saved: 12+ hours
Accuracy: 100%

This is what contact research should be. Not weekends spent on Google searches.

Comment "BETA" to try it.

intel.totalaudiopromo.com`,

      'Regional Radio Opportunity': `Most radio promoters ignore regional stations.

Massive mistake.

300+ stations
35M+ combined reach
35% response rates (vs 8% national)
Better relationships

Research was the barrier. Audio Intel removes it. 45 stations enriched in 3 minutes.

intel.totalaudiopromo.com`,

      'The Cost Reality': `Muck Rack: £400-600/month
Cision: £500-800/month

Built for enterprise, not indie artists.

Audio Intel: £19/month

Same intelligence, realistic pricing.

The music industry needs affordable tools that actually work for independent professionals.

intel.totalaudiopromo.com`,

      'Response Rate Breakthrough': `Generic radio outreach: 8% response
Personalised pitches (Audio Intel): 28% response

Difference: 300% better results

Radio presenters receive 200+ generic pitches weekly. Personalisation matters.

Audio Intel gives you the intelligence in 2 minutes.

intel.totalaudiopromo.com`,

      'The Brighton Reality': `Right, so I've been building Audio Intel at 2am whilst the girlfriend sleeps.

Why? After 5+ years promoting music (including BBC Radio 1), research was killing my weekends.

Built a tool that saves 15+ hours per campaign.

Now I use it daily.

intel.totalaudiopromo.com`,

      'Submission Windows': `Radio submission windows close faster than you think.

Monday 9am: BBC announces opportunity
Wednesday 5pm: Deadline

If you're still manually researching contacts on Tuesday, you've lost.

Audio Intel: 2 minutes to research, hours left for crafting perfect pitches.

intel.totalaudiopromo.com`,

      'The Spreadsheet Chaos': `Right, so I've worked with 50+ indie artists doing radio promotion.

Every single one arrives with the same problem: chaotic contact spreadsheets.

Audio Intel transforms chaos → organised intelligence in 2 minutes.

Contact research shouldn't kill weekends.

intel.totalaudiopromo.com`
    };

    return contentMap[title] || null;
  }

  /**
   * Process scheduled posts for current time
   */
  async processScheduledPosts(calendar: BlueskyPost[]): Promise<{
    posted: number;
    skipped: number;
    failed: number;
    details: Array<{ title: string; status: string; uri?: string; error?: string }>;
  }> {
    const now = new Date();
    const results = {
      posted: 0,
      skipped: 0,
      failed: 0,
      details: [] as Array<{ title: string; status: string; uri?: string; error?: string }>
    };

    // Authenticate first
    const authenticated = await this.authenticate();
    if (!authenticated) {
      throw new Error('Failed to authenticate with Bluesky');
    }

    // Filter Bluesky posts that should be posted now
    const blueskyPosts = calendar.filter(post =>
      post.platform === 'Bluesky' &&
      post.status === 'scheduled'
    );

    console.log(`[BLUESKY] Found ${blueskyPosts.length} Bluesky posts in calendar`);

    for (const post of blueskyPosts) {
      const scheduledTime = new Date(post.scheduledTime);

      // Check if post should be published now (within 1 hour window)
      const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 1) {
        console.log(`[BLUESKY] ⏭️  Skipping "${post.title}" - not scheduled for now`);
        results.skipped++;
        continue;
      }

      // Get content for this post
      const content = this.getContentByTitle(post.title);

      if (!content) {
        console.error(`[BLUESKY] ❌ No content found for: ${post.title}`);
        results.failed++;
        results.details.push({
          title: post.title,
          status: 'failed',
          error: 'Content not found'
        });
        continue;
      }

      // Post to Bluesky
      console.log(`[BLUESKY] 📤 Posting: ${post.title}`);
      const result = await this.post(content);

      if (result.success) {
        results.posted++;
        results.details.push({
          title: post.title,
          status: 'posted',
          uri: result.uri
        });
      } else {
        results.failed++;
        results.details.push({
          title: post.title,
          status: 'failed',
          error: result.error
        });
      }

      // Rate limiting: wait 1 second between posts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const authenticated = await this.authenticate();
      return {
        healthy: authenticated
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Create Bluesky posting agent instance
 */
export function createBlueskyAgent(): BlueskyPostingAgent {
  const credentials: BlueskyCredentials = {
    identifier: process.env.BLUESKY_IDENTIFIER || '',
    password: process.env.BLUESKY_APP_PASSWORD || ''
  };

  if (!credentials.identifier || !credentials.password) {
    throw new Error('Bluesky credentials not configured. Set BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD environment variables.');
  }

  return new BlueskyPostingAgent(credentials);
}
