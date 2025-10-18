/**
 * LinkedIn Autonomous Posting Agent
 *
 * Handles automated posting to LinkedIn using OAuth2 authentication
 * Reads from content calendar and posts according to schedule
 */

import axios from 'axios';
import type { AxiosInstance } from 'axios';

export interface LinkedInPost {
  id: string;
  platform: string;
  title: string;
  scheduledTime: string;
  weekTheme: string;
  category: string;
  status: string;
  content?: string;
}

export interface LinkedInCredentials {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken?: string;
}

export class LinkedInPostingAgent {
  private client: AxiosInstance;
  private credentials: LinkedInCredentials;
  private baseURL = 'https://api.linkedin.com';

  constructor(credentials: LinkedInCredentials) {
    this.credentials = credentials;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });
  }

  /**
   * Authenticate with LinkedIn using OAuth2
   */
  async authenticate(): Promise<boolean> {
    try {
      // Verify token by fetching user profile
      await this.client.get('/v2/me');

      console.log('[LINKEDIN] ✅ Authenticated successfully');
      return true;
    } catch (error) {
      console.error('[LINKEDIN] ❌ Authentication failed:', error);
      return false;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    try {
      if (!this.credentials.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.credentials.refreshToken,
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        this.credentials.accessToken = data.access_token;
        this.client.setAccessToken(data.access_token);

        console.log('[LINKEDIN] ✅ Access token refreshed');
        return {
          success: true,
          accessToken: data.access_token,
        };
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('[LINKEDIN] ❌ Token refresh failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Post to LinkedIn (handles 3000 character limit)
   */
  async post(text: string): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      // Validate character limit
      if (text.length > 3000) {
        console.warn('[LINKEDIN] ⚠️ Post text exceeds 3000 characters, truncating...');
        text = text.substring(0, 2997) + '...';
      }

      // Get user profile to obtain the author URN
      const profileResponse = await this.client.get('/v2/me');
      const authorUrn = `urn:li:person:${profileResponse.data.id}`;

      // Create post using UGC Post API
      const postData = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await this.client.post('/v2/ugcPosts', postData);

      console.log('[LINKEDIN] ✅ Posted successfully:', response.data.id);

      return {
        success: true,
        postId: response.data.id,
      };
    } catch (error) {
      console.error('[LINKEDIN] ❌ Post failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get LinkedIn content by title from markdown file
   */
  getContentByTitle(title: string): string | null {
    // Content mapping from RADIO_PROMOTER_LINKEDIN_POSTS.md
    const contentMap: Record<string, string> = {
      'The Contact Research Reality Check': `Just finished a radio campaign using Audio Intel instead of manual research.

The time difference was staggering:

**Manual approach (old way):**
- 15+ hours researching contact details
- 60% accuracy rate (outdated contacts, wrong emails)
- 8-12% response rate from generic pitching
- Weekend gone

**Audio Intel approach:**
- 3 minutes contact enrichment
- 94% accuracy rate (verified, current contacts)
- 35% response rate from personalised pitching
- Weekend back

Here's what changed the game:

I stopped using outdated databases with generic station emails. Audio Intel gave me current show information, submission preferences, and genre focus - the intelligence needed for personalised pitching.

The result? 3x better response rates because stations can tell you've actually researched them.

After 5+ years promoting music to UK radio (including pitches to BBC Radio 6 Music, Amazing Radio, and regional stations), I built this because manual research was killing my weekends.

Now it takes 3 minutes instead of an afternoon.

The music industry needs tools built by people who actually use them daily.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_real_campaign

#MusicIndustry #RadioPromotion #MusicTech #UKRadio #IndieMusic`,

      'The 15-Hour Problem': `Most radio promoters spend 15+ hours weekly on contact research.

That's 780 hours annually.

32+ days of work.

Here's what that time breakdown actually looks like:

**Manual Research (Current Reality)**
- Finding current contact details: 3 hours
- Verifying emails still work: 2 hours
- Researching submission preferences: 4 hours
- Understanding genre focus: 2 hours
- Checking social media for recent activity: 2 hours
- Tracking show schedules and coverage: 2 hours

**Total**: 15 hours for one campaign's contact list

**Audio Intel (New Reality)**
- Upload contact list: 30 seconds
- AI processes and enriches: 90 seconds
- Review enriched data: 2 minutes

**Total**: 4 minutes for the same campaign

**Time saved**: 14 hours 56 minutes

I built Audio Intel after wasting thousands of hours on this exact process. Now I use that time for strategic pitching and relationship building instead of data entry.

The difference in response rates is significant. Personalised pitches based on accurate intelligence get 300% better responses than generic outreach.

Stop spending your time on research that can be automated. Focus on what actually moves the needle: building relationships and crafting great pitches.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_time_savings

#MusicPromotion #Efficiency #RadioPromotion #MusicIndustry #TimeManagement`,

      'The Pricing Reality': `Let's talk about what radio promotion tools actually cost.

**US Alternatives:**
- Muck Rack: £400-600/month
- Cision: £500-800/month
- MediaHQ: £300-500/month

Built for enterprise PR agencies with massive budgets. Not for independent radio promoters or small PR firms.

**Audio Intel: £19/month (Professional) or £79/month (Agency)**

Same intelligence:
- Real-time contact enrichment
- Submission guidelines and preferences
- Station coverage and reach data
- Genre focus and artist types
- Strategic pitching tips

I built this after getting frustrated with overpriced US tools that didn't understand UK music industry terminology or work patterns.

The difference is simple: Audio Intel is built by someone who actually does radio promotion daily, not by an enterprise software company.

After 5+ years promoting music (including pitches to BBC Radio 6 Music and major regional stations), I know exactly what contact intelligence radio promoters need.

You shouldn't have to pay £6,000+ annually for basic contact research automation.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_pricing_comparison

#MusicIndustry #RadioPromotion #MusicTech #AffordableTools #UKMusic`,

      'The Response Rate Problem': `Generic radio outreach gets ignored.

Here's what actually happened when I tested personalised vs generic pitches:

**Generic Pitch (Old Approach)**
- 100 contacts reached
- 3 responses received
- 3% response rate
- 0 successful placements

**Personalised Pitch (Audio Intel Approach)**
- 100 contacts reached
- 28 responses received
- 28% response rate
- 12 successful placements

**Difference**: 300% better response rate, 400% better placement rate

The reason is straightforward: radio presenters and station managers receive hundreds of generic pitches weekly. They ignore anything that doesn't demonstrate you've actually researched their show.

Audio Intel gives you the intelligence to write pitches that stand out:
- Current show format and recent guests
- Genre preferences and submission guidelines
- Coverage area and listener demographics
- Preferred submission formats
- Strategic pitching tips

I built this after spending years crafting personalised pitches manually. The research took longer than writing the pitch itself.

Now the research takes 2 minutes. I spend my time on strategy instead of data entry.

The music industry rewards specificity. Generic outreach is wasted effort.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_response_rates

#RadioPromotion #MusicMarketing #PRstrategy #MusicIndustry #ResponseRates`,

      'The Real Cost of Bad Contact Data': `Bad contact data doesn't just waste time. It damages your reputation.

Real example from my radio promotion work:

**The Mistake:**
- Used 6-month-old contact database
- Pitched to email address that was no longer monitored
- Show format had completely changed
- Genre focus had shifted

**The Result:**
- Email bounced (sender reputation hit)
- Follow-up went to wrong person
- Artist's music was flagged as spam
- Station blacklisted our submissions for 3 months

**The Cost:**
- Lost 3 months of pitching opportunity
- Damaged relationship with key station
- Had to rebuild trust from scratch
- Artist missed critical release window

This happened because I relied on outdated contact intelligence.

Audio Intel solves this by pulling real-time data:
- Current email addresses and active contacts
- Recent show format changes
- Updated genre preferences
- Submission process modifications
- Contact availability status

After 5+ years in radio promotion, I've learned that accurate contact intelligence is worth far more than its cost.

One successful BBC Radio placement can generate £50,000+ in streaming revenue. One blacklisted submission can cost you 3+ months of opportunities.

The risk of bad data is higher than most promoters realise.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_bad_data_cost

#RadioPromotion #ContactIntelligence #MusicIndustry #ReputationManagement #PRstrategy`,

      'The Brighton Producer Reality': `Right, so I've been building Audio Intel at 2am whilst the girlfriend and kids sleep.

Why?

Because after 5+ years promoting music (my own project sadact plus client work), I was spending more time researching contacts than actually making music or building relationships.

The breaking point was a recent radio campaign where I spent 18 hours researching contact details, submission preferences, and show formats.

The campaign worked - 35% response rate, solid station relationships built, meaningful industry connections made.

But those 18 hours should have been spent on strategic relationship building, not data entry.

So I built Audio Intel to automate the research that was eating my life.

**What changed:**
- Research time: 18 hours → 2 minutes
- Contact accuracy: 60% → 94%
- Response rates: 8% → 28%
- Time for relationship building: 2 hours → 20+ hours

Now I use the tool daily for my own promotion work and client campaigns.

The difference is massive. I'm building relationships instead of wrestling with spreadsheets.

This is what bootstrapped looks like: building tools at 2am because the industry needs better solutions.

The music industry is full of problems that technology can solve. We just need more people building tools they actually use themselves.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_founder_story

#MusicIndustry #Bootstrap #RadioPromotion #IndieMusic #ProductDevelopment`,

      'The Spreadsheet Chaos Problem': `Most radio promoters manage their contacts like this:

**The Reality:**
- 5+ different Excel spreadsheets
- Contacts scattered across email threads
- Notes in iPhone reminders
- Post-its on the desk
- "I'll remember this" (you won't)

**The Result:**
- Can't find contact when you need it
- Duplicate outreach to same person
- Missed submission deadlines
- Lost relationship context
- Wasted hours searching

I lived this chaos for 5+ years. It's absolutely maddening.

Audio Intel transforms this chaos into organised intelligence:

**Unified Database**
- All contacts in one place
- Automatic enrichment and updates
- Searchable by genre, location, reach
- Relationship history tracked
- Submission deadlines monitored

**Real Example:**
Before: "I know I have that BBC producer's email somewhere..."
(Searches 5 spreadsheets, 20 email threads, finds outdated contact)

After: Search "BBC electronic music" in Audio Intel
(Instant results with current contact, submission preferences, recent show activity)

The difference in stress levels alone is worth the £19/month.

I built this because I was tired of spreadsheet chaos ruining my workflow. Now my contact intelligence is actually organised and accessible.

Stop wasting time searching for contacts you know you have somewhere.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_spreadsheet_chaos

#RadioPromotion #ContactManagement #Productivity #MusicIndustry #Organisation`,

      'The Regional Radio Opportunity': `Most radio promoters focus only on national BBC stations and ignore regional/online stations.

Massive mistake.

**Regional Radio Reality:**
- 300+ regional stations in UK
- Combined reach: 35+ million listeners
- Less competitive than national stations
- Better response rates (35% vs 8%)
- Stronger community relationships

**The Problem:**
Researching regional stations takes forever. Each station has different submission processes, coverage areas, and programming focuses.

**Example Campaign Results:**
- National stations: 8% response rate, 2 placements
- Regional stations: 35% response rate, 24 placements
- Total reach: Regional (8.5M) vs National (2.1M)

Regional radio is where smart promoters build their foundation.

Audio Intel makes regional station research actually manageable:
- Coverage area and listener demographics
- Submission windows and preferences
- Genre focus and programming style
- Recent playlist additions
- Strategic timing recommendations

I've used this approach for years. Regional station relationships often lead to national opportunities. But you have to do the research properly.

Most promoters skip regional because the research is too time-consuming. Audio Intel removes that barrier.

Stop ignoring 35+ million potential listeners because research is hard.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_regional_opportunity

#RadioPromotion #RegionalRadio #MusicMarketing #UKMusic #RadioStrategy`,

      'The Submission Window Problem': `Radio submission windows close faster than you think.

Real example from last month:

**Monday 9am**: Station announces new music submission window for Friday show
**Monday 10am**: 150+ submissions already received
**Tuesday 5pm**: Submission window closes (200+ submissions)
**Wednesday**: Station reviews submissions
**Thursday**: Selected tracks confirmed
**Friday**: Show airs

**Window to submit**: 32 hours

If you're spending 15+ hours researching contacts, you've already missed it.

This happens constantly in radio promotion:
- Festival lineup submission deadlines
- Seasonal programming changes
- Guest presenter opportunities
- Special themed shows

By the time you've manually researched the contact, verified the submission format, and crafted your pitch, the opportunity is gone.

Audio Intel solves the speed problem:
- 2-minute contact research
- Immediate submission guidelines
- Real-time opportunity alerts
- Quick-reference contact cards

I've lost too many opportunities to slow research processes. Now I can respond to submission windows within hours instead of days.

The music industry moves fast. Your tools need to keep pace.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_submission_windows

#RadioPromotion #MusicIndustry #Timing #Opportunities #Speed`,

      'The ROI Calculation': `Let's calculate the actual ROI of Audio Intel for radio promoters.

**Your Current Cost (Manual Research):**
- 15 hours weekly @ £50/hour = £750
- 52 weeks = £39,000 annually
- Plus opportunity cost of missed deadlines

**Audio Intel Cost:**
- Professional: £19/month = £228 annually
- Agency: £79/month = £948 annually

**Time Saved:**
- 14 hours 56 minutes per campaign
- Average 4 campaigns monthly = 60 hours
- Annual time savings: 720+ hours

**ROI Calculation:**
- Cost: £228-948/year
- Time saved: 720 hours @ £50/hour = £36,000
- ROI: 3,700% - 15,700%

**Plus Improved Results:**
- 300% better response rates
- 94% contact accuracy (vs ~60% manual)
- Faster turnaround on opportunities
- Reduced reputation risk from bad data

I built Audio Intel after doing this calculation for my own business. The ROI was so obvious I had to build it.

One successful national radio placement can generate £50,000+ in streaming revenue. Regional station campaigns routinely deliver 10,000-50,000 streams. The tool pays for itself with a single campaign.

Stop spending thousands on manual research when automation costs pennies.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_roi_calculation

#RadioPromotion #ROI #MusicBusiness #Efficiency #MusicIndustry`,

      // Alternative title variations from content calendar
      'The BBC Radio 1 Reality Check': `Just finished a radio campaign using Audio Intel instead of manual research.

The time difference was staggering:

**Manual approach (old way):**
- 15+ hours researching contact details
- 60% accuracy rate (outdated contacts, wrong emails)
- 8-12% response rate from generic pitching
- Weekend gone

**Audio Intel approach:**
- 3 minutes contact enrichment
- 94% accuracy rate (verified, current contacts)
- 35% response rate from personalised pitching
- Weekend back

Here's what changed the game:

I stopped using outdated databases with generic station emails. Audio Intel gave me current show information, submission preferences, and genre focus - the intelligence needed for personalised pitching.

The result? 3x better response rates because stations can tell you've actually researched them.

After 5+ years promoting music to UK radio (including pitches to BBC Radio 6 Music, Amazing Radio, and regional stations), I built this because manual research was killing my weekends.

Now it takes 3 minutes instead of an afternoon.

The music industry needs tools built by people who actually use them daily.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=radio_real_campaign

#MusicIndustry #RadioPromotion #MusicTech #UKRadio #IndieMusic`,
    };

    return contentMap[title] || null;
  }

  /**
   * Process scheduled posts for current time
   */
  async processScheduledPosts(calendar: LinkedInPost[]): Promise<{
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

    // Authenticate first
    const authenticated = await this.authenticate();
    if (!authenticated) {
      throw new Error('Failed to authenticate with LinkedIn');
    }

    // Filter LinkedIn posts that should be posted now
    const linkedInPosts = calendar.filter(post =>
      post.platform === 'LinkedIn' &&
      post.status === 'scheduled'
    );

    console.log(`[LINKEDIN] Found ${linkedInPosts.length} LinkedIn posts in calendar`);

    for (const post of linkedInPosts) {
      const scheduledTime = new Date(post.scheduledTime);

      // Check if post should be published now (within 1 hour window)
      const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 1) {
        console.log(`[LINKEDIN] ⏭️  Skipping "${post.title}" - not scheduled for now`);
        results.skipped++;
        continue;
      }

      // Get content for this post
      const content = this.getContentByTitle(post.title);

      if (!content) {
        console.error(`[LINKEDIN] ❌ No content found for: ${post.title}`);
        results.failed++;
        results.details.push({
          title: post.title,
          status: 'failed',
          error: 'Content not found'
        });
        continue;
      }

      // Post to LinkedIn
      console.log(`[LINKEDIN] 📤 Posting: ${post.title}`);
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

      // Rate limiting: wait 2 seconds between posts
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
 * Create LinkedIn posting agent instance
 */
export function createLinkedInAgent(): LinkedInPostingAgent {
  const credentials: LinkedInCredentials = {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    accessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
    refreshToken: process.env.LINKEDIN_REFRESH_TOKEN || '',
  };

  if (!credentials.clientId || !credentials.clientSecret || !credentials.accessToken) {
    throw new Error('LinkedIn credentials not configured. Set LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, and LINKEDIN_ACCESS_TOKEN environment variables.');
  }

  return new LinkedInPostingAgent(credentials);
}
