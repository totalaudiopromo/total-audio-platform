/**
 * Twitter API Integration for Automated Thread Posting
 * Handles Twitter API v2 authentication, rate limiting, and thread publishing
 * Optimized for UK business hours and music industry professionals
 */

import axios from 'axios';

export interface TwitterCredentials {
  apiKey: string;
  apiKeySecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

export interface TwitterThread {
  id: string;
  tweets: TwitterTweet[];
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'posting' | 'published' | 'failed';
  metadata: ThreadMetadata;
}

export interface TwitterTweet {
  id?: string;
  content: string;
  mediaUrls?: string[];
  replyToTweetId?: string;
  hashtags: string[];
  mentions: string[];
  threadPosition: number;
  characterCount: number;
  estimatedEngagement: number;
}

export interface ThreadMetadata {
  originalSource: 'newsletter' | 'manual';
  newsletterId?: string;
  topic: string;
  targetAudience: string[];
  performanceGoals: string[];
  musicIndustryFocus: boolean;
  audioIntelMention: boolean;
}

export interface TwitterSchedulingConfig {
  ukBusinessHours: {
    weekdays: { start: number; end: number; optimalTimes: number[] };
    weekends: { start: number; end: number; optimalTimes: number[] };
  };
  musicIndustryOptimization: {
    peakEngagementTimes: string[];
    avoidTimes: string[];
    dayOfWeekPreferences: Record<string, number>;
  };
  rateLimiting: {
    maxTweetsPerHour: number;
    maxTweetsPerDay: number;
    threadPostingInterval: number; // seconds between tweets in thread
  };
}

export interface TwitterAnalytics {
  tweetId: string;
  metrics: {
    impressions: number;
    engagements: number;
    likes: number;
    retweets: number;
    replies: number;
    clicks: number;
    profileClicks: number;
    follows: number;
  };
  timestamp: Date;
  audienceInsights: {
    topLocations: string[];
    topInterests: string[];
    ageGroups: Record<string, number>;
  };
}

class TwitterAutomation {
  private credentials: TwitterCredentials;
  private schedulingConfig: TwitterSchedulingConfig;
  private baseUrl = 'https://api.twitter.com/2';
  private scheduledThreads: Map<string, TwitterThread> = new Map();
  private rateLimitTracker: Map<string, { count: number; resetTime: Date }> = new Map();

  constructor(credentials: TwitterCredentials) {
    this.credentials = credentials;
    this.schedulingConfig = this.getDefaultSchedulingConfig();
    this.initializeRateLimitTracking();
  }

  /**
   * Schedule a Twitter thread for optimal posting time
   */
  async scheduleThread(
    tweets: Omit<TwitterTweet, 'id' | 'threadPosition'>[],
    metadata: ThreadMetadata,
    preferredTime?: Date
  ): Promise<TwitterThread> {
    try {
      // Validate and optimize tweets for Twitter
      const optimizedTweets = await this.optimizeTweetsForTwitter(tweets);
      
      // Calculate optimal posting time
      const scheduledTime = preferredTime || await this.calculateOptimalPostingTime();
      
      // Create thread object
      const thread: TwitterThread = {
        id: this.generateThreadId(),
        tweets: optimizedTweets.map((tweet, index) => ({
          ...tweet,
          threadPosition: index + 1
        })),
        scheduledTime,
        status: 'scheduled',
        metadata
      };
      
      // Store scheduled thread
      this.scheduledThreads.set(thread.id, thread);
      
      // Set up posting timer
      await this.scheduleThreadPosting(thread);
      
      return thread;
      
    } catch (error) {
      console.error('Failed to schedule Twitter thread:', error);
      throw new Error('Thread scheduling failed');
    }
  }

  /**
   * Post a Twitter thread immediately
   */
  async postThreadNow(
    tweets: Omit<TwitterTweet, 'id' | 'threadPosition'>[],
    metadata: ThreadMetadata
  ): Promise<TwitterThread> {
    try {
      // Check rate limits
      if (!await this.checkRateLimits()) {
        throw new Error('Rate limit exceeded. Please wait before posting.');
      }
      
      // Optimize tweets
      const optimizedTweets = await this.optimizeTweetsForTwitter(tweets);
      
      // Create thread
      const thread: TwitterThread = {
        id: this.generateThreadId(),
        tweets: optimizedTweets.map((tweet, index) => ({
          ...tweet,
          threadPosition: index + 1
        })),
        scheduledTime: new Date(),
        status: 'posting',
        metadata
      };
      
      // Post thread
      const postedThread = await this.executeThreadPosting(thread);
      
      return postedThread;
      
    } catch (error) {
      console.error('Failed to post Twitter thread:', error);
      throw error;
    }
  }

  /**
   * Optimize tweets for Twitter platform requirements
   */
  private async optimizeTweetsForTwitter(
    tweets: Omit<TwitterTweet, 'id' | 'threadPosition'>[]
  ): Promise<TwitterTweet[]> {
    const optimizedTweets: TwitterTweet[] = [];
    
    for (let i = 0; i < tweets.length; i++) {
      const tweet = tweets[i];
      let content = tweet.content;
      
      // Ensure character limit (280 chars)
      if (content.length > 280) {
        content = await this.shortenTweetContent(content);
      }
      
      // Optimize hashtags for music industry
      const optimizedHashtags = await this.optimizeHashtags(tweet.hashtags, i === 0);
      
      // Add thread numbering for first tweet if it's a thread
      if (tweets.length > 1 && i === 0) {
        content = this.addThreadIndicator(content, tweets.length);
      }
      
      // Calculate estimated engagement based on content analysis
      const estimatedEngagement = await this.calculateEstimatedEngagement(content, optimizedHashtags);
      
      optimizedTweets.push({
        content,
        hashtags: optimizedHashtags,
        mentions: tweet.mentions || [],
        mediaUrls: tweet.mediaUrls,
        threadPosition: i + 1,
        characterCount: content.length,
        estimatedEngagement
      });
    }
    
    return optimizedTweets;
  }

  /**
   * Calculate optimal posting time based on UK business hours and music industry patterns
   */
  private async calculateOptimalPostingTime(): Promise<Date> {
    const now = new Date();
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
    
    const optimalTimes = isWeekday 
      ? this.schedulingConfig.ukBusinessHours.weekdays.optimalTimes
      : this.schedulingConfig.ukBusinessHours.weekends.optimalTimes;
    
    // Find next optimal time
    const currentHour = now.getHours();
    let nextOptimalHour = optimalTimes.find(hour => hour > currentHour);
    
    let scheduledDate = new Date(now);
    
    if (!nextOptimalHour) {
      // Schedule for tomorrow's first optimal time
      scheduledDate.setDate(scheduledDate.getDate() + 1);
      nextOptimalHour = optimalTimes[0];
    }
    
    scheduledDate.setHours(nextOptimalHour, 0, 0, 0);
    
    // Adjust for music industry peak times
    if (this.isMusicIndustryPeakTime(scheduledDate)) {
      // Add slight delay to avoid overcrowded feed
      scheduledDate.setMinutes(15);
    }
    
    return scheduledDate;
  }

  /**
   * Execute the actual posting of a Twitter thread
   */
  private async executeThreadPosting(thread: TwitterThread): Promise<TwitterThread> {
    thread.status = 'posting';
    let previousTweetId: string | undefined;
    
    try {
      for (let i = 0; i < thread.tweets.length; i++) {
        const tweet = thread.tweets[i];
        
        // Add delay between tweets (Twitter best practice)
        if (i > 0) {
          await this.delay(this.schedulingConfig.rateLimiting.threadPostingInterval * 1000);
        }
        
        // Post tweet
        const postedTweet = await this.postSingleTweet(tweet, previousTweetId);
        
        // Update tweet with returned ID
        thread.tweets[i].id = postedTweet.id;
        thread.tweets[i].replyToTweetId = previousTweetId;
        previousTweetId = postedTweet.id;
        
        // Update rate limit tracking
        this.updateRateLimitCounter();
        
        console.log(`Posted tweet ${i + 1}/${thread.tweets.length}: ${postedTweet.id}`);
      }
      
      thread.status = 'published';
      
      // Start analytics tracking
      await this.startAnalyticsTracking(thread);
      
      return thread;
      
    } catch (error) {
      thread.status = 'failed';
      console.error('Thread posting failed:', error);
      throw error;
    }
  }

  /**
   * Post a single tweet using Twitter API v2
   */
  private async postSingleTweet(
    tweet: TwitterTweet,
    replyToTweetId?: string
  ): Promise<{ id: string; text: string }> {
    try {
      const payload: any = {
        text: tweet.content
      };
      
      // Add reply-to for threading
      if (replyToTweetId) {
        payload.reply = {
          in_reply_to_tweet_id: replyToTweetId
        };
      }
      
      // Add media if present
      if (tweet.mediaUrls && tweet.mediaUrls.length > 0) {
        const mediaIds = await this.uploadMedia(tweet.mediaUrls);
        payload.media = {
          media_ids: mediaIds
        };
      }
      
      const response = await this.makeAuthenticatedRequest('POST', '/tweets', payload);
      
      return response.data;
      
    } catch (error) {
      console.error('Single tweet posting failed:', error);
      throw error;
    }
  }

  /**
   * Make authenticated request to Twitter API
   */
  private async makeAuthenticatedRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<any> {
    try {
      const config = {
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.credentials.bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: data ? JSON.stringify(data) : undefined
      };
      
      const response = await axios(config);
      
      // Handle rate limiting
      if (response.status === 429) {
        const resetTime = new Date(response.headers['x-rate-limit-reset'] * 1000);
        throw new Error(`Rate limited until ${resetTime.toISOString()}`);
      }
      
      return response.data;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Twitter API error:', error.response?.status, error.response?.data);
        throw new Error(`Twitter API error: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Shorten tweet content while maintaining meaning and voice
   */
  private async shortenTweetContent(content: string): Promise<string> {
    // Intelligent content shortening strategies
    let shortened = content;
    
    // Remove unnecessary words while preserving voice
    const fillerWords = [' really', ' actually', ' basically', ' literally'];
    fillerWords.forEach(word => {
      shortened = shortened.replace(new RegExp(word, 'gi'), '');
    });
    
    // Shorten common phrases
    const shortenings = {
      'because': 'bc',
      'you are': 'you\'re', 
      'cannot': 'can\'t',
      'will not': 'won\'t',
      'that is': 'that\'s',
      'it is': 'it\'s'
    };
    
    Object.entries(shortenings).forEach(([long, short]) => {
      shortened = shortened.replace(new RegExp(`\\b${long}\\b`, 'gi'), short);
    });
    
    // If still too long, intelligently truncate
    if (shortened.length > 280) {
      shortened = shortened.substring(0, 275) + '...';
    }
    
    return shortened;
  }

  /**
   * Optimize hashtags for music industry and engagement
   */
  private async optimizeHashtags(hashtags: string[], isFirstTweet: boolean): Promise<string[]> {
    const musicIndustryHashtags = [
      '#MusicMarketing', '#IndieArtist', '#MusicPromotion', '#RadioPromotion',
      '#PlaylistPitching', '#MusicBusiness', '#IndieMusic', '#MusicPR',
      '#AudioIntel', '#MusicIndustry', '#UKMusic', '#MusicPromo'
    ];
    
    let optimizedHashtags = [...hashtags];
    
    // For first tweet, include core industry hashtags
    if (isFirstTweet) {
      if (!optimizedHashtags.some(tag => tag.toLowerCase().includes('music'))) {
        optimizedHashtags.push('#MusicMarketing');
      }
      if (!optimizedHashtags.includes('#AudioIntel')) {
        optimizedHashtags.push('#AudioIntel');
      }
    }
    
    // Limit to 3-4 hashtags for optimal engagement
    optimizedHashtags = optimizedHashtags.slice(0, isFirstTweet ? 4 : 2);
    
    return optimizedHashtags;
  }

  /**
   * Add thread indicator to first tweet
   */
  private addThreadIndicator(content: string, threadLength: number): string {
    // Add thread indicator at the end
    const threadIndicator = ` 🧵 (${threadLength} tweets)`;
    
    // Ensure we don't exceed character limit
    if (content.length + threadIndicator.length > 280) {
      const availableSpace = 280 - threadIndicator.length;
      content = content.substring(0, availableSpace - 3) + '...';
    }
    
    return content + threadIndicator;
  }

  /**
   * Calculate estimated engagement based on content analysis
   */
  private async calculateEstimatedEngagement(content: string, hashtags: string[]): Promise<number> {
    let score = 5.0; // Base score
    
    // Content quality indicators
    if (content.includes('?')) score += 0.5; // Questions drive engagement
    if (content.match(/\d+%|\d+k|\d+ (?:streams|followers|plays)/)) score += 1.0; // Metrics
    if (content.toLowerCase().includes('thread')) score += 0.3; // Thread announcement
    
    // Music industry relevance
    const industryTerms = ['playlist', 'radio', 'promotion', 'marketing', 'indie', 'artist'];
    const industryTermsFound = industryTerms.filter(term => 
      content.toLowerCase().includes(term)
    ).length;
    score += industryTermsFound * 0.2;
    
    // Hashtag optimization
    score += Math.min(hashtags.length * 0.1, 0.4);
    
    // British casual tone indicators
    const britishPhrases = ['right, so', 'tbh', 'brilliant', 'proper'];
    if (britishPhrases.some(phrase => content.toLowerCase().includes(phrase))) {
      score += 0.3;
    }
    
    return Math.min(score, 10.0);
  }

  /**
   * Check rate limits before posting
   */
  private async checkRateLimits(): Promise<boolean> {
    const now = new Date();
    const hourlyKey = `hourly_${now.getHours()}`;
    const dailyKey = `daily_${now.toDateString()}`;
    
    const hourlyLimit = this.rateLimitTracker.get(hourlyKey);
    const dailyLimit = this.rateLimitTracker.get(dailyKey);
    
    if (hourlyLimit && hourlyLimit.count >= this.schedulingConfig.rateLimiting.maxTweetsPerHour) {
      return false;
    }
    
    if (dailyLimit && dailyLimit.count >= this.schedulingConfig.rateLimiting.maxTweetsPerDay) {
      return false;
    }
    
    return true;
  }

  /**
   * Update rate limit counter after posting
   */
  private updateRateLimitCounter(): void {
    const now = new Date();
    const hourlyKey = `hourly_${now.getHours()}`;
    const dailyKey = `daily_${now.toDateString()}`;
    
    // Update hourly counter
    const hourlyCount = this.rateLimitTracker.get(hourlyKey) || { count: 0, resetTime: new Date(now.getTime() + 60 * 60 * 1000) };
    hourlyCount.count++;
    this.rateLimitTracker.set(hourlyKey, hourlyCount);
    
    // Update daily counter
    const dailyCount = this.rateLimitTracker.get(dailyKey) || { count: 0, resetTime: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
    dailyCount.count++;
    this.rateLimitTracker.set(dailyKey, dailyCount);
  }

  /**
   * Start analytics tracking for posted thread
   */
  private async startAnalyticsTracking(thread: TwitterThread): Promise<void> {
    // Schedule analytics collection for 1 hour, 24 hours, and 7 days
    const analyticsTimes = [
      { delay: 60 * 60 * 1000, label: '1_hour' },      // 1 hour
      { delay: 24 * 60 * 60 * 1000, label: '24_hours' }, // 24 hours
      { delay: 7 * 24 * 60 * 60 * 1000, label: '7_days' }  // 7 days
    ];
    
    analyticsTimes.forEach(({ delay, label }) => {
      setTimeout(async () => {
        try {
          await this.collectThreadAnalytics(thread, label);
        } catch (error) {
          console.error(`Failed to collect ${label} analytics:`, error);
        }
      }, delay);
    });
  }

  /**
   * Collect analytics for a thread
   */
  private async collectThreadAnalytics(thread: TwitterThread, timepoint: string): Promise<TwitterAnalytics[]> {
    const analytics: TwitterAnalytics[] = [];
    
    for (const tweet of thread.tweets) {
      if (!tweet.id) continue;
      
      try {
        const tweetAnalytics = await this.getTweetAnalytics(tweet.id);
        analytics.push(tweetAnalytics);
        
        // Store analytics for learning
        await this.storeAnalyticsData(thread, tweetAnalytics, timepoint);
        
      } catch (error) {
        console.error(`Failed to get analytics for tweet ${tweet.id}:`, error);
      }
    }
    
    return analytics;
  }

  /**
   * Get analytics for individual tweet
   */
  private async getTweetAnalytics(tweetId: string): Promise<TwitterAnalytics> {
    try {
      const response = await this.makeAuthenticatedRequest(
        'GET',
        `/tweets/${tweetId}?tweet.fields=public_metrics,created_at`
      );
      
      const tweet = response.data;
      const metrics = tweet.public_metrics;
      
      return {
        tweetId,
        metrics: {
          impressions: metrics.impression_count || 0,
          engagements: metrics.like_count + metrics.retweet_count + metrics.reply_count + metrics.quote_count,
          likes: metrics.like_count || 0,
          retweets: metrics.retweet_count || 0,
          replies: metrics.reply_count || 0,
          clicks: 0, // Not available in public metrics
          profileClicks: 0, // Not available in public metrics
          follows: 0 // Not available in public metrics
        },
        timestamp: new Date(),
        audienceInsights: {
          topLocations: [], // Would require additional API calls
          topInterests: [],
          ageGroups: {}
        }
      };
      
    } catch (error) {
      console.error('Failed to get tweet analytics:', error);
      throw error;
    }
  }

  /**
   * Store analytics data for machine learning and optimization
   */
  private async storeAnalyticsData(
    thread: TwitterThread,
    analytics: TwitterAnalytics,
    timepoint: string
  ): Promise<void> {
    // This would typically store to a database or analytics service
    // For now, we'll log the data
    console.log(`Analytics ${timepoint} for thread ${thread.id}:`, {
      threadId: thread.id,
      tweetId: analytics.tweetId,
      timepoint,
      engagementRate: analytics.metrics.engagements / Math.max(analytics.metrics.impressions, 1),
      topPerformingMetric: this.getTopPerformingMetric(analytics.metrics),
      contentLength: thread.tweets.find(t => t.id === analytics.tweetId)?.characterCount,
      hashtagCount: thread.tweets.find(t => t.id === analytics.tweetId)?.hashtags.length
    });
  }

  /**
   * Utility methods
   */
  private generateThreadId(): string {
    return `thread_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isMusicIndustryPeakTime(date: Date): boolean {
    const hour = date.getHours();
    const day = date.getDay();
    
    // Music industry professionals typically active 9-18 GMT, weekdays
    return day >= 1 && day <= 5 && hour >= 9 && hour <= 18;
  }

  private getTopPerformingMetric(metrics: TwitterAnalytics['metrics']): string {
    const metricValues = {
      likes: metrics.likes,
      retweets: metrics.retweets,
      replies: metrics.replies,
      engagements: metrics.engagements
    };
    
    return Object.entries(metricValues).sort(([,a], [,b]) => b - a)[0][0];
  }

  private initializeRateLimitTracking(): void {
    // Clean up expired rate limit entries every hour
    setInterval(() => {
      const now = new Date();
      for (const [key, limit] of this.rateLimitTracker.entries()) {
        if (limit.resetTime < now) {
          this.rateLimitTracker.delete(key);
        }
      }
    }, 60 * 60 * 1000); // Every hour
  }

  private scheduleThreadPosting(thread: TwitterThread): Promise<void> {
    return new Promise((resolve) => {
      const delay = thread.scheduledTime.getTime() - Date.now();
      
      if (delay <= 0) {
        // Post immediately if scheduled time has passed
        this.executeThreadPosting(thread).then(() => resolve());
      } else {
        // Schedule for future posting
        setTimeout(async () => {
          try {
            await this.executeThreadPosting(thread);
            resolve();
          } catch (error) {
            console.error('Scheduled thread posting failed:', error);
          }
        }, delay);
      }
    });
  }

  private async uploadMedia(mediaUrls: string[]): Promise<string[]> {
    // Implementation for media upload would go here
    // This is a simplified placeholder
    return [];
  }

  private getDefaultSchedulingConfig(): TwitterSchedulingConfig {
    return {
      ukBusinessHours: {
        weekdays: {
          start: 9,
          end: 18,
          optimalTimes: [9, 13, 17] // 9 AM, 1 PM, 5 PM GMT
        },
        weekends: {
          start: 10,
          end: 16,
          optimalTimes: [11, 15] // 11 AM, 3 PM GMT
        }
      },
      musicIndustryOptimization: {
        peakEngagementTimes: ['09:00', '13:00', '17:00'],
        avoidTimes: ['06:00-08:00', '19:00-21:00'], // Early morning, dinner time
        dayOfWeekPreferences: {
          'Monday': 0.8,
          'Tuesday': 1.0,
          'Wednesday': 1.0,
          'Thursday': 0.9,
          'Friday': 0.7,
          'Saturday': 0.5,
          'Sunday': 0.4
        }
      },
      rateLimiting: {
        maxTweetsPerHour: 50,
        maxTweetsPerDay: 300,
        threadPostingInterval: 30 // 30 seconds between tweets in thread
      }
    };
  }

  /**
   * Public method to get scheduled threads
   */
  getScheduledThreads(): TwitterThread[] {
    return Array.from(this.scheduledThreads.values());
  }

  /**
   * Public method to cancel scheduled thread
   */
  cancelScheduledThread(threadId: string): boolean {
    return this.scheduledThreads.delete(threadId);
  }

  /**
   * Public method to get rate limit status
   */
  getRateLimitStatus(): any {
    const now = new Date();
    const hourlyKey = `hourly_${now.getHours()}`;
    const dailyKey = `daily_${now.toDateString()}`;
    
    return {
      hourly: this.rateLimitTracker.get(hourlyKey) || { count: 0, resetTime: new Date(now.getTime() + 60 * 60 * 1000) },
      daily: this.rateLimitTracker.get(dailyKey) || { count: 0, resetTime: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
      limits: {
        maxPerHour: this.schedulingConfig.rateLimiting.maxTweetsPerHour,
        maxPerDay: this.schedulingConfig.rateLimiting.maxTweetsPerDay
      }
    };
  }
}

export default TwitterAutomation;
export type {
  TwitterCredentials,
  TwitterThread,
  TwitterTweet,
  ThreadMetadata,
  TwitterSchedulingConfig,
  TwitterAnalytics
};