/**
 * Threads (Instagram) Autonomous Posting Agent
 *
 * Handles automated posting to Threads using the Instagram Graph API
 * Reads from content calendar and posts according to schedule
 */

import axios from 'axios';

export interface ThreadsPost {
  id: string;
  platform: string;
  title: string;
  scheduledTime: string;
  weekTheme: string;
  category: string;
  status: string;
  content?: string;
}

export interface ThreadsCredentials {
  userId: string;        // Instagram User ID
  accessToken: string;   // Long-lived access token
}

export interface ThreadsApiResponse {
  id: string;
}

export class ThreadsPostingAgent {
  private credentials: ThreadsCredentials;
  private baseUrl = 'https://graph.threads.net/v1.0';

  constructor(credentials: ThreadsCredentials) {
    this.credentials = credentials;
  }

  /**
   * Create a Threads media container (unpublished post)
   */
  async createMediaContainer(text: string): Promise<{ success: boolean; containerId?: string; error?: string }> {
    try {
      // Ensure text is within 500 character limit
      const sanitizedText = text.length > 500 ? text.substring(0, 497) + '...' : text;

      const response = await axios.post<ThreadsApiResponse>(
        `${this.baseUrl}/${this.credentials.userId}/threads`,
        null,
        {
          params: {
            media_type: 'TEXT',
            text: sanitizedText,
            access_token: this.credentials.accessToken
          }
        }
      );

      console.log('[THREADS] ✅ Media container created:', response.data.id);

      return {
        success: true,
        containerId: response.data.id
      };
    } catch (error) {
      console.error('[THREADS] ❌ Media container creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Publish a Threads media container
   */
  async publishMediaContainer(containerId: string): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const response = await axios.post<ThreadsApiResponse>(
        `${this.baseUrl}/${this.credentials.userId}/threads_publish`,
        null,
        {
          params: {
            creation_id: containerId,
            access_token: this.credentials.accessToken
          }
        }
      );

      console.log('[THREADS] ✅ Post published successfully:', response.data.id);

      return {
        success: true,
        postId: response.data.id
      };
    } catch (error) {
      console.error('[THREADS] ❌ Post publication failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Post to Threads (create container + publish)
   */
  async post(text: string): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      // Step 1: Create media container
      const createResult = await this.createMediaContainer(text);

      if (!createResult.success || !createResult.containerId) {
        return {
          success: false,
          error: createResult.error || 'Failed to create media container'
        };
      }

      // Step 2: Publish the container
      const publishResult = await this.publishMediaContainer(createResult.containerId);

      if (!publishResult.success) {
        return {
          success: false,
          error: publishResult.error || 'Failed to publish post'
        };
      }

      console.log('[THREADS] ✅ Complete posting workflow successful');

      return {
        success: true,
        postId: publishResult.postId
      };
    } catch (error) {
      console.error('[THREADS] ❌ Post workflow failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get Threads content by title from markdown file
   */
  getContentByTitle(title: string): string | null {
    // Content mapping from BLUESKY_THREADS_CONTENT.md (Threads section)
    const contentMap: Record<string, string> = {
      'The Real Problem': `After 5 years promoting music for indie artists, I was still spending 15+ hours every week researching radio contacts.

Most of that time was wasted on outdated information.

I built Audio Intel to solve this properly.

What actually works:
✓ Real-time data (not static databases)
✓ AI-powered enrichment (2 minutes vs 15 hours)
✓ Submission guidelines and preferences
✓ Genre focus and coverage data

The music industry needs better tools.

Comment "BETA" for free access.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_real_problem`,

      'BBC Radio 1 Success': `I just tested Audio Intel on 5 real BBC Radio 1 contacts.

Results:
✓ Current show info and schedules
✓ Submission guidelines (100% accurate)
✓ Genre preferences per presenter
✓ Preferred submission formats
✓ Strategic pitching tips

Processing time: Under 2 minutes
Manual research saved: 12+ hours

This is what contact research should be.

Not spending weekends on Google searches and outdated databases.

The tool works because it uses real-time data, not static contact lists from 2019.

Comment "BETA" to try it.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_bbc_success`,

      'Regional Radio Strategy': `Regional radio represents 35+ million potential listeners across 300+ UK stations.

Better response rates than national (35% vs 8%)
Stronger community relationships
More accessible for emerging artists

But research complexity prevents most promoters from executing regional campaigns properly.

Audio Intel solution:
✓ 45 stations enriched in 3 minutes
✓ Coverage areas and demographics
✓ Submission preferences per station
✓ Genre compatibility scoring
✓ Strategic timing recommendations

I executed a 45-station campaign last month:
• 35% response rate
• 24 successful placements
• 8.5M listener reach
• 87% time savings

Regional radio is no longer inaccessible.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_regional_strategy`,

      'The Pricing Problem': `Let's talk about what radio promotion tools actually cost.

US Alternatives:
• Muck Rack: £400-600/month
• Cision: £500-800/month
• MediaHQ: £300-500/month

All built for enterprise PR agencies with massive budgets. Not for independent radio promoters.

Audio Intel:
• Professional: £19/month
• Agency: £79/month

Same intelligence:
✓ Real-time contact enrichment
✓ Submission guidelines
✓ Genre preferences
✓ Coverage data
✓ Strategic tips

Built by someone who actually does radio promotion daily, not by an enterprise software company optimising for corporate contracts.

You shouldn't have to pay £6,000+ annually for basic contact research automation.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_pricing_problem`,

      'Response Rate Data': `I tested personalised vs generic radio pitches.

Generic Pitch:
• 100 contacts
• 3 responses (3%)
• 0 placements

Personalised Pitch (Audio Intel):
• 100 contacts
• 28 responses (28%)
• 12 placements

Difference: 300% better response rate, 400% better placement rate

Why? Radio presenters receive 200+ generic pitches weekly. Personalisation stands out.

Audio Intel intelligence:
✓ Recent playlist additions
✓ Show format and preferences
✓ Coverage and demographics
✓ Submission guidelines
✓ Strategic timing

All in 2 minutes instead of 15+ hours of manual research.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_response_data`,

      'The Brighton Producer Story': `Right, so I've been building Audio Intel at 2am whilst the girlfriend and kids sleep.

This is what bootstrapped looks like.

I'm a music producer (sadact) and I've been doing radio promotion for 5+ years. Pitched to BBC Radio 6 Music, Amazing Radio, and regional stations. Got placements. Built relationships.

But the research was killing me.

Breaking point: 18 hours researching contacts for a 5-minute BBC Radio 1 pitch.

The pitch worked. Track generated 250,000+ streams.

But those 18 hours should have been spent on strategy, not data entry.

So I built Audio Intel.

Research time: 18 hours → 2 minutes
Contact accuracy: 60% → 94%
Response rates: 8% → 28%

Now I use it daily. The difference is massive.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_brighton_story`,

      'Submission Window Problem': `Radio submission windows close faster than you think.

Real example from last month:

Monday 9am: BBC announces opportunity
Wednesday 5pm: Deadline
Songs needed: Full EPK + press photo + reference tracks

Traditional research: 16+ hours (missed deadline)
Audio Intel: 2 minutes (submitted Monday morning)

Result: Track selected

This happens constantly:
• Festival lineup deadlines
• Seasonal programming changes
• Guest presenter opportunities
• Special themed shows

By the time you've manually researched everything, the window is closed.

Audio Intel timeline:
✓ 30 seconds: Upload contact
✓ 2 minutes: Review enriched data
✓ Same day: Pitch sent

Speed advantage wins opportunities.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_submission_windows`,

      'The Spreadsheet Chaos': `Managing radio contacts like this:

❌ 5+ different Excel spreadsheets
❌ Contacts in email threads
❌ Notes in iPhone reminders
❌ Post-its on desk
❌ "I'll remember this" (you won't)

Result: Can't find contacts, duplicate outreach, missed deadlines, wasted hours searching.

I lived this chaos for 5+ years. Absolutely maddening.

Audio Intel solution:

✓ Unified database (all contacts one place)
✓ Automatic enrichment
✓ Searchable by genre/location/reach
✓ Relationship history tracked
✓ Submission deadlines monitored

Before: "I know I have that BBC producer's email somewhere..."
After: Search "BBC electronic music" → instant results

Stop wasting time searching for contacts you already have.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_spreadsheet_chaos`,

      'Real ROI Calculation': `Let's calculate actual ROI for radio promoters.

Your Current Cost (Manual):
• 15 hours weekly @ £50/hour = £750
• 52 weeks = £39,000 annually

Audio Intel Cost:
• Professional: £19/month = £228 annually
• Agency: £79/month = £948 annually

Time Saved:
• 15 hours per campaign
• 4 campaigns monthly = 60 hours
• Annual: 720+ hours

ROI:
• Cost: £228-948/year
• Time saved: 720 hours @ £50 = £36,000
• ROI: 3,700% - 15,700%

Plus improved results:
✓ 300% better response rates
✓ 94% contact accuracy
✓ Faster opportunity turnarounds

One successful placement pays for years of Audio Intel.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_roi_calculation`,

      'Industry Truth': `Most indie artists waste 15+ hours weekly on contact research.

That's 780 hours annually. 32+ days of work.

Time you could spend:
• Creating music
• Building fan relationships
• Growing your brand
• Strategic partnerships
• Live performances

Instead: Wrestling with spreadsheets and outdated databases.

Audio Intel automates this in 2 minutes:
✓ Upload contact list
✓ AI enriches with intelligence
✓ Review and pitch

Focus on what actually moves your career forward.

Stop wasting weekends on research that can be automated.

The music industry needs tools that give you time back for what matters.

https://intel.totalaudiopromo.com?utm_source=threads&utm_medium=social&utm_campaign=radio_industry_truth`
    };

    return contentMap[title] || null;
  }

  /**
   * Process scheduled posts for current time
   */
  async processScheduledPosts(calendar: ThreadsPost[]): Promise<{
    posted: number;
    skipped: number;
    failed: number;
    details: Array<{ title: string; status: string; postId?: string; error?: string }>;
  }> {
    const now = new Date();
    const results = {
      posted: 0,
      skipped: 0,
      failed: 0,
      details: [] as Array<{ title: string; status: string; postId?: string; error?: string }>
    };

    // Filter Threads posts that should be posted now
    const threadsPosts = calendar.filter(post =>
      post.platform === 'Threads' &&
      post.status === 'scheduled'
    );

    console.log(`[THREADS] Found ${threadsPosts.length} Threads posts in calendar`);

    for (const post of threadsPosts) {
      const scheduledTime = new Date(post.scheduledTime);

      // Check if post should be published now (within 1 hour window)
      const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 1) {
        console.log(`[THREADS] ⏭️  Skipping "${post.title}" - not scheduled for now`);
        results.skipped++;
        continue;
      }

      // Get content for this post
      const content = this.getContentByTitle(post.title);

      if (!content) {
        console.error(`[THREADS] ❌ No content found for: ${post.title}`);
        results.failed++;
        results.details.push({
          title: post.title,
          status: 'failed',
          error: 'Content not found'
        });
        continue;
      }

      // Post to Threads
      console.log(`[THREADS] 📤 Posting: ${post.title}`);
      const result = await this.post(content);

      if (result.success) {
        results.posted++;
        results.details.push({
          title: post.title,
          status: 'posted',
          postId: result.postId
        });
      } else {
        results.failed++;
        results.details.push({
          title: post.title,
          status: 'failed',
          error: result.error
        });
      }

      // Rate limiting: wait 2 seconds between posts (Threads API guidelines)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      // Test API access by making a simple GET request
      const response = await axios.get(
        `${this.baseUrl}/${this.credentials.userId}/threads`,
        {
          params: {
            fields: 'id',
            limit: 1,
            access_token: this.credentials.accessToken
          }
        }
      );

      console.log('[THREADS] ✅ Health check passed');
      return {
        healthy: response.status === 200
      };
    } catch (error) {
      console.error('[THREADS] ❌ Health check failed:', error);
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get account insights (views, likes, followers)
   */
  async getAccountInsights(): Promise<{
    success: boolean;
    insights?: {
      views?: number;
      likes?: number;
      replies?: number;
      followers?: number;
    };
    error?: string;
  }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.credentials.userId}/insights`,
        {
          params: {
            metric: 'views,likes,replies,followers_count',
            access_token: this.credentials.accessToken
          }
        }
      );

      console.log('[THREADS] ✅ Account insights retrieved');

      return {
        success: true,
        insights: response.data
      };
    } catch (error) {
      console.error('[THREADS] ❌ Failed to retrieve insights:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Create Threads posting agent instance
 */
export function createThreadsAgent(): ThreadsPostingAgent {
  const credentials: ThreadsCredentials = {
    userId: process.env.THREADS_USER_ID || '',
    accessToken: process.env.THREADS_ACCESS_TOKEN || ''
  };

  if (!credentials.userId || !credentials.accessToken) {
    throw new Error('Threads credentials not configured. Set THREADS_USER_ID and THREADS_ACCESS_TOKEN environment variables.');
  }

  return new ThreadsPostingAgent(credentials);
}
