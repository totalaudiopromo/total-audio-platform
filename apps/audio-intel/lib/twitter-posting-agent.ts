/**
 * Twitter/X Autonomous Posting Agent
 *
 * Handles automated posting to Twitter/X using the Twitter API v2
 * Reads from content calendar and posts according to schedule
 * Supports single tweets and thread posting (5-7 tweets)
 */

import { TwitterApi } from 'twitter-api-v2';

export interface TwitterPost {
  id: string;
  platform: string;
  title: string;
  scheduledTime: string;
  weekTheme: string;
  category: string;
  status: string;
  content?: string;
}

export interface TwitterCredentials {
  apiKey: string; // Twitter API Key
  apiSecret: string; // Twitter API Secret
  accessToken: string; // Twitter Access Token
  accessSecret: string; // Twitter Access Token Secret
}

export class TwitterPostingAgent {
  private client: TwitterApi;
  private credentials: TwitterCredentials;

  constructor(credentials: TwitterCredentials) {
    this.credentials = credentials;
    this.client = new TwitterApi({
      appKey: credentials.apiKey,
      appSecret: credentials.apiSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessSecret,
    });
  }

  /**
   * Authenticate with Twitter (verify credentials)
   */
  async authenticate(): Promise<boolean> {
    try {
      const user = await this.client.v2.me();
      console.log('[TWITTER] ✅ Authenticated successfully as @' + user.data.username);
      return true;
    } catch (error) {
      console.error('[TWITTER] ❌ Authentication failed:', error);
      return false;
    }
  }

  /**
   * Split text into thread tweets (respecting 280 character limit)
   */
  private splitIntoThreadTweets(text: string): string[] {
    const MAX_TWEET_LENGTH = 280;
    const tweets: string[] = [];

    // Split by double newlines to get natural sections
    const sections = text.split(/\n\n+/).filter(s => s.trim().length > 0);

    for (const section of sections) {
      const trimmedSection = section.trim();

      if (trimmedSection.length <= MAX_TWEET_LENGTH) {
        tweets.push(trimmedSection);
      } else {
        // If section is too long, split by sentences
        const sentences = trimmedSection.split(/(?<=[.!?])\s+/);
        let currentTweet = '';

        for (const sentence of sentences) {
          if ((currentTweet + sentence).length <= MAX_TWEET_LENGTH) {
            currentTweet += (currentTweet ? ' ' : '') + sentence;
          } else {
            if (currentTweet) {
              tweets.push(currentTweet);
            }
            currentTweet = sentence;
          }
        }

        if (currentTweet) {
          tweets.push(currentTweet);
        }
      }
    }

    return tweets;
  }

  /**
   * Post a single tweet to Twitter
   */
  async post(text: string): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Check if text exceeds 280 characters
      if (text.length > 280) {
        return {
          success: false,
          error: `Tweet exceeds 280 characters (${text.length} chars). Use postThread() for longer content.`,
        };
      }

      const tweet = await this.client.v2.tweet(text);

      console.log('[TWITTER] ✅ Posted successfully:', tweet.data.id);

      return {
        success: true,
        id: tweet.data.id,
      };
    } catch (error) {
      console.error('[TWITTER] ❌ Post failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Post a thread to Twitter (5-7 tweets)
   */
  async postThread(text: string): Promise<{
    success: boolean;
    ids?: string[];
    count?: number;
    error?: string;
  }> {
    try {
      const tweets = this.splitIntoThreadTweets(text);

      if (tweets.length === 0) {
        return {
          success: false,
          error: 'No valid tweets generated from content',
        };
      }

      console.log(`[TWITTER] 🧵 Posting thread with ${tweets.length} tweets...`);

      const tweetIds: string[] = [];
      let previousTweetId: string | undefined;

      for (let i = 0; i < tweets.length; i++) {
        const tweetText = tweets[i];

        try {
          const options = previousTweetId
            ? { reply: { in_reply_to_tweet_id: previousTweetId } }
            : {};

          const tweet = await this.client.v2.tweet(tweetText, options);
          tweetIds.push(tweet.data.id);
          previousTweetId = tweet.data.id;

          console.log(`[TWITTER] ✅ Posted tweet ${i + 1}/${tweets.length}: ${tweet.data.id}`);

          // Rate limiting: wait 1 second between tweets
          if (i < tweets.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`[TWITTER] ❌ Failed to post tweet ${i + 1}/${tweets.length}:`, error);
          return {
            success: false,
            error: `Failed at tweet ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ids: tweetIds,
            count: tweetIds.length,
          };
        }
      }

      console.log(`[TWITTER] 🎉 Thread posted successfully: ${tweetIds.length} tweets`);

      return {
        success: true,
        ids: tweetIds,
        count: tweetIds.length,
      };
    } catch (error) {
      console.error('[TWITTER] ❌ Thread failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get Twitter content by title from markdown file
   * Maps content titles to thread content from TWITTER_X_THREADS_RADIO_PROMOTERS.md
   */
  getContentByTitle(title: string): string | null {
    const contentMap: Record<string, string> = {
      'The 2AM Reality': `After 5 years promoting music for indie artists, I was still spending 15+ hours every week researching radio contacts.

Most of that time was wasted on outdated information.

I built Audio Intel to solve this properly.

Here's what actually works:

---

1/ Stop using generic databases

They're full of outdated contacts and wrong information. You're better off starting fresh.

Last month I tested 100 contacts from a "premium" database. 37% bounced. 28% were wrong contacts. Only 35% actually worked.

That's £300/month for 35% accuracy.

---

2/ Focus on current, active contacts

Look for recent activity, not just contact details.

If they haven't posted in 6 months, they're probably not accepting submissions.

I learned this the hard way after pitching to 3 BBC producers who'd moved roles 4 months earlier. Embarrassing.

---

3/ Get the details that matter

Station coverage area, submission preferences, genre focus. Generic outreach gets ignored.

Radio presenters receive 200+ pitches weekly. Yours needs to show you've actually researched their show.

The difference in response rates is massive: 8% vs 28%.

---

4/ Use AI to do the heavy lifting

I built Audio Intel to automate this research. Takes 2 minutes instead of 15 hours.

Real-time contact enrichment, submission guidelines, genre preferences, coverage data.

All the intelligence you need for personalised pitching.

---

5/ Focus on relationship building

Once you have good contact intelligence, spend your time on personalized outreach, not data entry.

That's where actual placements happen. Not in spreadsheets.

I've wasted thousands of hours on research that could have been automated.

---

The music industry needs better tools.

Audio Intel is what I wish existed when I started.

Comment "BETA" if you want to try it.

https://intel.totalaudiopromo.com?utm_source=twitter&utm_medium=social&utm_campaign=radio_2am_reality`,

      'The Contact Intelligence Reality': `I tested Audio Intel on radio contacts for my latest campaign.

The difference from manual research was massive.

Here's what the tool provides:

---

**For every contact, Audio Intel finds:**

✅ Current presenter/DJ information
✅ Show format and programming style
✅ Genre focus and artist preferences
✅ Submission guidelines and timing
✅ Response patterns and follow-up protocol
✅ Coverage area and demographics
✅ Recent playlist patterns

**Processing time**: Under 30 seconds per contact

---

**Compare to manual research:**

Manual: 2-3 hours per contact
Audio Intel: Under 30 seconds
**Time saved**: 90%+ faster

Manual accuracy: ~60% (outdated contacts common)
Audio Intel accuracy: 94%+ (verified, current)
**Quality improvement**: 3x better

---

**The response rate difference:**

Generic pitching (manual research): 8-12% response
Personalised pitching (Audio Intel data): 30-35% response

**Why?** Radio presenters can tell when you've actually researched their show.

---

This level of contact intelligence used to take 12+ hours per campaign.

Now it takes 2 minutes.

---

This is what contact research should be.

Not spending your weekends on Google searches and outdated databases.

The tool works because it uses real-time data, not static contact lists.

If you're tired of wasting time on manual research, this is for you.

---

Comment "BETA" for free access.

Built by someone who actually pitches to these contacts weekly.

https://intel.totalaudiopromo.com?utm_source=twitter&utm_medium=social&utm_campaign=radio_real_campaign`,

      'The Brighton Producer Story': `Right, so I've been coding Audio Intel at 2am whilst the girlfriend and kids sleep.

This is what bootstrapped looks like.

Here's the real story:

---

I'm a music producer (sadact - electronic music project) and I've been doing radio promotion for 5+ years.

Pitched to BBC Radio 6 Music, Amazing Radio, and dozens of regional/online stations. Secured real plays and built lasting relationships.

But the research was killing me.

---

Typical campaign research:
- 15+ hours finding contact details
- 12+ hours verifying information
- 8+ hours understanding submission preferences
- 5+ hours tracking show schedules

Total: 40+ hours per campaign

I was spending more time on research than making music.

---

The breaking point was a recent radio campaign.

Spent 18 hours researching contact details, submission preferences, and show formats.

The campaign worked - decent response rate, solid relationships built.

But those 18 hours should have been spent on strategy and relationship building, not data entry.

---

So I built Audio Intel.

**What changed:**
- Research time: 18 hours → 2 minutes
- Contact accuracy: 60% → 94%
- Response rates: 8% → 28%
- Time for music: 2 hours/week → 20+ hours/week

---

Now I use the tool daily for my own promotion work and client campaigns.

The difference is massive. I'm building relationships instead of wrestling with spreadsheets.

I'm making music instead of researching contacts at midnight.

---

This is what the music industry needs:

Tools built by people who actually use them daily.

Not enterprise software that costs £500/month and doesn't understand UK radio.

Solutions that solve real problems for real independent artists.

---

Audio Intel: £19/month

Built at 2am in Brighton by someone who hated wasting weekends on research.

Comment "BETA" to try it.

https://intel.totalaudiopromo.com?utm_source=twitter&utm_medium=social&utm_campaign=radio_brighton_story`,

      'The Submission Window Problem': `Radio submission windows close faster than you think.

I learned this the hard way last month.

Here's what happened:

---

Monday 9am: Amazing Radio announces new show guest slot opportunity

Submission deadline: Wednesday 5pm

Songs needed: Full EPK + press photo + 3 reference tracks

My situation: Perfect client track for this opportunity

---

**Traditional Research Timeline:**

Monday 9am-1pm: Finding current submission contact (4 hours)
Monday 2pm-6pm: Understanding submission requirements (4 hours)
Tuesday 9am-5pm: Verifying contact still current (8 hours)
Wednesday: Too late, deadline passed

**Result**: Opportunity missed

---

This happens constantly in radio promotion:
- Festival lineup submission deadlines
- Seasonal programming changes
- Guest presenter opportunities
- Special themed shows

By the time you've manually researched everything, the window is closed.

---

**Audio Intel Timeline:**

Monday 9:02am: Upload contact (30 seconds)
Monday 9:04am: Review enriched data (2 minutes)
Monday 9:30am: Pitch sent with proper format

**Result**: Successful submission, track selected

---

The difference isn't just speed.

It's the difference between catching opportunities and constantly being too late.

Radio moves fast. Your tools need to keep pace.

---

After missing too many opportunities to slow research, I built Audio Intel.

Now I can respond to submission windows within hours instead of days.

The speed advantage alone is worth the £19/month.

---

Comment "BETA" if you're tired of missing opportunities because research takes too long.

https://intel.totalaudiopromo.com?utm_source=twitter&utm_medium=social&utm_campaign=radio_submission_windows`,

      'The Cost Reality': `Let's talk about what radio promotion tools actually cost.

And why I built a UK alternative.

Thread:

---

**Muck Rack**: £400-600/month
**Cision**: £500-800/month
**MediaHQ**: £300-500/month

All built for enterprise PR agencies. Not for independent radio promoters or small PR firms.

Average annual cost: £5,400-7,200

---

These tools are designed for:
- Fortune 500 companies
- Major PR agencies
- Corporate communications teams
- Multi-million pound budgets

Not for:
- Independent radio promoters
- Small PR firms
- DIY artists
- Bootstrapped operations

---

I spent years paying £300+/month for tools that:
- Didn't understand UK music industry
- Used outdated radio terminology
- Focused on corporate PR, not music
- Had features I'd never use
- Cost more than my rent

It was absolutely maddening.

---

So I built Audio Intel.

**Professional**: £19/month
**Agency**: £79/month

Same intelligence:
- Real-time contact enrichment
- Submission guidelines
- Genre preferences
- Coverage data
- Strategic tips

Different price: 95% cheaper

---

The difference is simple:

Audio Intel is built by someone who actually does radio promotion daily.

Not by an enterprise software company optimising for corporate contracts.

I know exactly what intelligence radio promoters need. Because I use it myself.

---

You shouldn't have to pay £6,000+ annually for basic contact research automation.

The music industry needs affordable tools that actually work for independent professionals.

So I built one.

---

Comment "BETA" to try it.

Built in Brighton by someone who was tired of overpriced US tools.

https://intel.totalaudiopromo.com?utm_source=twitter&utm_medium=social&utm_campaign=radio_cost_reality`,

      'The Response Rate Breakthrough': `I tested personalised vs generic radio pitches.

The results changed how I do promotion.

Here's what I found:

---

**Generic Pitch Test (Old Approach)**

Campaign: Electronic music release
Contacts: 100 UK radio stations
Approach: Generic pitch template

Results:
- 3 responses received
- 3% response rate
- 0 successful placements
- Time wasted: Massive

---

**Personalised Pitch Test (Audio Intel Approach)**

Campaign: Same electronic music release
Contacts: Same 100 UK radio stations
Approach: Personalised pitches using contact intelligence

Results:
- 28 responses received
- 28% response rate
- 12 successful placements
- Actually works

---

**Why the massive difference?**

Radio presenters receive 200+ generic pitches weekly.

They ignore anything that doesn't demonstrate you've actually researched their show.

Generic = Delete
Personalised = Read

---

**What "personalised" actually means:**

- Reference their recent playlist additions
- Understand their genre focus
- Follow their submission guidelines
- Respect their preferred timing
- Show you've listened to their show

This level of research used to take 15+ hours per campaign.

---

**Audio Intel gives you the intelligence automatically:**

- Current show format and recent guests
- Genre preferences and playlist patterns
- Coverage area and listener demographics
- Preferred submission formats
- Strategic pitching tips

All in 2 minutes instead of 15+ hours.

---

The difference in results is massive:

Old way: 3% response, 0 placements
New way: 28% response, 12 placements

The research time is 99% faster.
The results are 300% better.

This is why I built Audio Intel.

---

Comment "BETA" for free access.

Stop sending generic pitches that get ignored.

https://intel.totalaudiopromo.com?utm_source=twitter&utm_medium=social&utm_campaign=radio_response_rates`,
    };

    return contentMap[title] || null;
  }

  /**
   * Process scheduled posts for current time
   */
  async processScheduledPosts(calendar: TwitterPost[]): Promise<{
    posted: number;
    skipped: number;
    failed: number;
    details: Array<{
      title: string;
      status: string;
      ids?: string[];
      count?: number;
      error?: string;
    }>;
  }> {
    const now = new Date();
    const results = {
      posted: 0,
      skipped: 0,
      failed: 0,
      details: [] as Array<{
        title: string;
        status: string;
        ids?: string[];
        count?: number;
        error?: string;
      }>,
    };

    // Authenticate first
    const authenticated = await this.authenticate();
    if (!authenticated) {
      throw new Error('Failed to authenticate with Twitter');
    }

    // Filter Twitter/X posts that should be posted now
    const twitterPosts = calendar.filter(
      post => post.platform === 'Twitter/X' && post.status === 'scheduled'
    );

    console.log(`[TWITTER] Found ${twitterPosts.length} Twitter/X posts in calendar`);

    for (const post of twitterPosts) {
      const scheduledTime = new Date(post.scheduledTime);

      // Check if post should be published now (within 1 hour window)
      const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 1) {
        console.log(`[TWITTER] ⏭️  Skipping "${post.title}" - not scheduled for now`);
        results.skipped++;
        continue;
      }

      // Get content for this post
      const content = this.getContentByTitle(post.title);

      if (!content) {
        console.error(`[TWITTER] ❌ No content found for: ${post.title}`);
        results.failed++;
        results.details.push({
          title: post.title,
          status: 'failed',
          error: 'Content not found',
        });
        continue;
      }

      // Post thread to Twitter (all content is thread-style)
      console.log(`[TWITTER] 🧵 Posting thread: ${post.title}`);
      const result = await this.postThread(content);

      if (result.success) {
        results.posted++;
        results.details.push({
          title: post.title,
          status: 'posted',
          ids: result.ids,
          count: result.count,
        });
      } else {
        results.failed++;
        results.details.push({
          title: post.title,
          status: 'failed',
          error: result.error,
        });
      }

      // Rate limiting: wait 2 seconds between threads
      await new Promise(resolve => setTimeout(resolve, 2000));
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
        healthy: authenticated,
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Create Twitter posting agent instance
 */
export function createTwitterAgent(): TwitterPostingAgent {
  const credentials: TwitterCredentials = {
    apiKey: process.env.TWITTER_API_KEY || '',
    apiSecret: process.env.TWITTER_API_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
  };

  if (
    !credentials.apiKey ||
    !credentials.apiSecret ||
    !credentials.accessToken ||
    !credentials.accessSecret
  ) {
    throw new Error(
      'Twitter credentials not configured. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, and TWITTER_ACCESS_SECRET environment variables.'
    );
  }

  return new TwitterPostingAgent(credentials);
}
