/**
 * Reddit Monitoring Agent for Total Audio Promo
 * Identifies and engages with potential beta users
 */

// Using Kit.com + localStorage for free storage

interface RedditTarget {
  subreddit: string;
  keywords: string[];
  painPoints: string[];
  engagementThreshold: number;
}

const REDDIT_TARGETS: RedditTarget[] = [
  {
    subreddit: 'WeAreTheMusicMakers',
    keywords: ['playlist', 'promotion', 'PR', 'getting heard', 'spotify streams'],
    painPoints: ['rejection', 'no audience', 'expensive PR', 'DIY overwhelm'],
    engagementThreshold: 10, // minimum upvotes to engage
  },
  {
    subreddit: 'MusicMarketing',
    keywords: ['muck rack', 'cision', 'PR tools', 'journalist contacts', 'press coverage'],
    painPoints: ['pricing', 'US-only', 'complex setup', 'no free tier'],
    engagementThreshold: 5,
  },
  {
    subreddit: 'IndieHeads',
    keywords: ['promotion', 'marketing', 'getting discovered', 'playlist submission'],
    painPoints: ['DIY fatigue', 'agency costs', 'no results', 'time consuming'],
    engagementThreshold: 15,
  },
  {
    subreddit: 'UKMusic',
    keywords: ['UK PR', 'British press', 'BBC Introducing', 'UK promoters'],
    painPoints: ['local contacts', 'UK-specific tools', 'Brexit issues'],
    engagementThreshold: 7,
  },
  {
    subreddit: 'MusicProduction',
    keywords: ['release strategy', 'promotion plan', 'getting listeners', 'marketing music'],
    painPoints: ['finished track but no audience', 'release planning', 'promotion budget'],
    engagementThreshold: 20,
  },
];

export class RedditMonitorAgent {
  private lastChecked: Date = new Date();

  constructor() {
    // No external database needed - using file system + Kit.com
  }

  /**
   * Main monitoring loop - runs every 4 hours
   */
  async monitor(): Promise<void> {
    console.log('🔍 Reddit Monitor Agent: Starting scan...');

    for (const target of REDDIT_TARGETS) {
      await this.scanSubreddit(target);
      await this.sleep(2000); // Rate limiting
    }

    await this.generateEngagementReport();
  }

  /**
   * Scan a specific subreddit for opportunities
   */
  private async scanSubreddit(target: RedditTarget): Promise<void> {
    try {
      // Using Reddit's JSON API (no auth required for public data)
      const response = await fetch(
        `https://www.reddit.com/r/${target.subreddit}/new.json?limit=25`,
        { headers: { 'User-Agent': 'AudioIntel-Beta-Bot/1.0' } }
      );

      const data = await response.json();
      const posts = data.data.children;

      for (const post of posts) {
        const postData = post.data;

        // Check if post matches our criteria
        if (this.isRelevantPost(postData, target)) {
          await this.logOpportunity({
            subreddit: target.subreddit,
            postId: postData.id,
            title: postData.title,
            author: postData.author,
            url: `https://reddit.com${postData.permalink}`,
            score: postData.score,
            numComments: postData.num_comments,
            relevanceScore: this.calculateRelevance(postData, target),
            suggestedResponse: this.generateResponse(postData, target),
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning r/${target.subreddit}:`, error);
    }
  }

  /**
   * Check if post is relevant to our offering
   */
  private isRelevantPost(post: any, target: RedditTarget): boolean {
    const text = `${post.title} ${post.selftext}`.toLowerCase();

    // Check for keywords
    const hasKeyword = target.keywords.some(keyword => text.includes(keyword.toLowerCase()));

    // Check for pain points
    const hasPainPoint = target.painPoints.some(pain => text.includes(pain.toLowerCase()));

    // Check engagement threshold
    const hasEngagement = post.score >= target.engagementThreshold;

    // Post must be less than 24 hours old
    const isRecent = Date.now() / 1000 - post.created_utc < 86400;

    return (hasKeyword || hasPainPoint) && hasEngagement && isRecent;
  }

  /**
   * Calculate relevance score (0-100)
   */
  private calculateRelevance(post: any, target: RedditTarget): number {
    let score = 0;
    const text = `${post.title} ${post.selftext}`.toLowerCase();

    // Keyword matches (40 points max)
    const keywordMatches = target.keywords.filter(k => text.includes(k.toLowerCase())).length;
    score += Math.min(keywordMatches * 10, 40);

    // Pain point matches (40 points max)
    const painMatches = target.painPoints.filter(p => text.includes(p.toLowerCase())).length;
    score += Math.min(painMatches * 20, 40);

    // Engagement score (20 points max)
    const engagementRatio = Math.min(post.score / 50, 1);
    score += engagementRatio * 20;

    return Math.round(score);
  }

  /**
   * Generate contextual response suggestion
   */
  private generateResponse(post: any, target: RedditTarget): string {
    const text = `${post.title} ${post.selftext}`.toLowerCase();

    // Detect specific pain points and suggest responses
    if (text.includes('expensive') || text.includes('pricing')) {
      return `Hey! UK artist here. I was in the same boat - quotes for £2k/month for basic PR. 
      
I've been beta testing a new tool that's £45/month (with a free tier for contact enrichment). 
It's specifically built for UK artists and actually works with UK journalists/blogs. 
Happy to share what's been working if you're interested.`;
    }

    if (text.includes('playlist') && text.includes('reject')) {
      return `Playlist rejections are brutal. What's been working for me lately is enriching my contact 
list first (finding the actual curator emails, not just submission forms). 

There's a free tool at intel.totalaudiopromo.com that can enrich 50 contacts - might help you 
find some direct curator contacts instead of going through the black box submission forms.`;
    }

    if (text.includes('diy') || text.includes('overwhelm')) {
      return `DIY promotion is exhausting. I spent 20+ hours a week on it before finding tools that 
actually automate the boring parts. 

Currently beta testing something that cut my promotion time by 80% - handles the contact 
research, email tracking, and campaign analytics automatically. UK-based too so no weird 
US timezone issues.`;
    }

    // Default response
    return `This resonates. Been there with the [specific pain point]. 
    
Found something that's been helping - [specific value prop related to their issue]. 
Happy to share what's been working if you want to DM.`;
  }

  /**
   * Log opportunity to Kit.com (free storage)
   */
  private async logOpportunity(opportunity: any): Promise<void> {
    try {
      // Store in Kit.com as custom field for tracking
      const KIT_API_KEY = process.env.KIT_API_KEY || process.env.CONVERTKIT_API_KEY;

      await fetch(`https://api.convertkit.com/v3/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: KIT_API_KEY,
          tag: {
            name: `reddit_opp_${opportunity.relevanceScore}`,
            email: 'agent@totalaudiopromo.com', // Agent tracking email
          },
        }),
      });

      console.log(
        `✅ Logged opportunity: ${opportunity.title} (Score: ${opportunity.relevanceScore})`
      );

      // Send high-value opportunities to console/email
      if (opportunity.relevanceScore > 70) {
        await this.notifyHighValueOpportunity(opportunity);
      }
    } catch (error) {
      console.error('Error logging opportunity:', error);
    }
  }

  /**
   * Send notification for high-value opportunities
   */
  private async notifyHighValueOpportunity(opportunity: any): Promise<void> {
    // Send to your preferred notification channel
    console.log(`🔥 HIGH VALUE OPPORTUNITY DETECTED:`);
    console.log(`Subreddit: r/${opportunity.subreddit}`);
    console.log(`Relevance: ${opportunity.relevanceScore}/100`);
    console.log(`URL: ${opportunity.url}`);
    console.log(`Suggested Response: ${opportunity.suggestedResponse}`);
  }

  /**
   * Generate daily engagement report
   */
  private async generateEngagementReport(): Promise<void> {
    // Simple console-based reporting (can be enhanced later)
    console.log(`\n📊 REDDIT MONITORING REPORT - ${new Date().toLocaleDateString()}`);
    console.log(`✅ Scan completed across 5 target subreddits`);
    console.log(`🎯 Monitoring for: pricing complaints, alternative requests, DIY frustration`);
    console.log(`📧 Opportunities logged to Kit.com tags for tracking`);
    console.log(`🔄 Next scan in 4 hours`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const redditMonitor = new RedditMonitorAgent();
