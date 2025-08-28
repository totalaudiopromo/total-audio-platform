/**
 * Music Industry Trend Detection Engine
 * Monitors key industry sources and identifies automation/marketing opportunities
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import RSSParser from 'rss-parser';
import cron from 'node-cron';
import { addMinutes, isAfter, parseISO } from 'date-fns';

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl?: string;
  type: 'rss' | 'scrape' | 'api';
  selectors?: {
    title: string;
    content: string;
    publishDate: string;
    url: string;
  };
  updateFrequency: number; // minutes
  category: 'industry' | 'streaming' | 'technology' | 'regulatory' | 'business';
  priority: 'high' | 'medium' | 'low';
}

export interface NewsItem {
  id: string;
  sourceId: string;
  title: string;
  content: string;
  publishedAt: Date;
  url: string;
  category: string;
  relevanceScore: number;
  automationOpportunity: AutomationOpportunity;
  trending: {
    isViral: boolean;
    engagementScore: number;
    velocity: number;
    timeToRespond: number; // minutes until opportunity expires
  };
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface AutomationOpportunity {
  angle: string;
  urgency: 'immediate' | 'same-day' | 'weekly' | 'evergreen';
  contentTypes: string[];
  audioIntelOpportunity: boolean;
  competitorAdvantage: boolean;
  industryImpact: 'high' | 'medium' | 'low';
  automationAngle: string;
  platforms: string[];
  estimatedReach: number;
}

export interface TrendAlert {
  id: string;
  newsItem: NewsItem;
  alertLevel: 'critical' | 'high' | 'medium' | 'low';
  responseWindow: number; // minutes
  suggestedActions: string[];
  contentBriefs: string[];
  timing: {
    immediate: boolean;
    peakWindow: Date;
    expiryTime: Date;
  };
}

class TrendDetectionEngine {
  private rssParser: RSSParser;
  private newsSources: Map<string, NewsSource> = new Map();
  private detectedTrends: Map<string, NewsItem> = new Map();
  private trendAlerts: Map<string, TrendAlert> = new Map();
  private monitoringActive: boolean = false;
  private lastCheck: Map<string, Date> = new Map();

  // Music industry automation keywords for relevance scoring
  private automationKeywords = [
    'automation', 'AI', 'algorithm', 'playlist', 'curator', 'marketing',
    'promotion', 'streaming', 'data', 'analytics', 'discovery', 'reach',
    'engagement', 'contact', 'outreach', 'campaign', 'targeting',
    'independent artist', 'indie', 'self-release', 'DIY', 'music tech'
  ];

  // Industry impact keywords
  private impactKeywords = [
    'spotify', 'apple music', 'youtube music', 'tiktok', 'instagram',
    'acquisition', 'partnership', 'policy change', 'new feature',
    'algorithm update', 'artist tools', 'label', 'distribution'
  ];

  constructor() {
    this.rssParser = new RSSParser({
      customFields: {
        item: ['media:content', 'content:encoded']
      }
    });
    this.initializeNewsSources();
  }

  /**
   * Initialize core music industry news sources
   */
  private initializeNewsSources(): void {
    const sources: NewsSource[] = [
      {
        id: 'music-business-worldwide',
        name: 'Music Business Worldwide',
        url: 'https://www.musicbusinessworldwide.com',
        rssUrl: 'https://www.musicbusinessworldwide.com/feed/',
        type: 'rss',
        updateFrequency: 15,
        category: 'business',
        priority: 'high'
      },
      {
        id: 'billboard-pro',
        name: 'Billboard Pro',
        url: 'https://www.billboard.com/pro',
        rssUrl: 'https://www.billboard.com/c/music/music-news/feed/',
        type: 'rss',
        updateFrequency: 20,
        category: 'industry',
        priority: 'high'
      },
      {
        id: 'music-week',
        name: 'Music Week',
        url: 'https://www.musicweek.com',
        rssUrl: 'https://www.musicweek.com/rss',
        type: 'rss',
        updateFrequency: 30,
        category: 'industry',
        priority: 'high'
      },
      {
        id: 'music-ally',
        name: 'Music Ally',
        url: 'https://musically.com',
        rssUrl: 'https://musically.com/feed/',
        type: 'rss',
        updateFrequency: 45,
        category: 'technology',
        priority: 'medium'
      },
      {
        id: 'hypebot',
        name: 'Hypebot',
        url: 'https://www.hypebot.com',
        rssUrl: 'https://www.hypebot.com/feed',
        type: 'rss',
        updateFrequency: 60,
        category: 'technology',
        priority: 'medium'
      },
      {
        id: 'digital-music-news',
        name: 'Digital Music News',
        url: 'https://www.digitalmusicnews.com',
        rssUrl: 'https://www.digitalmusicnews.com/feed/',
        type: 'rss',
        updateFrequency: 30,
        category: 'streaming',
        priority: 'medium'
      }
    ];

    sources.forEach(source => {
      this.newsSources.set(source.id, source);
    });

    console.log(`📡 Initialized ${sources.length} music industry news sources`);
  }

  /**
   * Start continuous trend monitoring
   */
  async startMonitoring(): Promise<void> {
    if (this.monitoringActive) {
      console.log('⚠️ Trend monitoring already active');
      return;
    }

    this.monitoringActive = true;
    console.log('🚀 Starting music industry trend monitoring...');

    // High-priority sources every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      await this.checkHighPrioritySources();
    });

    // Medium-priority sources every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      await this.checkMediumPrioritySources();
    });

    // Trend analysis every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.analyzeTrends();
    });

    // Initial check
    await this.performFullScan();

    console.log('✅ Trend monitoring started successfully');
  }

  /**
   * Stop trend monitoring
   */
  stopMonitoring(): void {
    this.monitoringActive = false;
    console.log('⏹️ Trend monitoring stopped');
  }

  /**
   * Perform full scan of all sources
   */
  async performFullScan(): Promise<NewsItem[]> {
    console.log('🔍 Performing full news scan...');
    
    const allNews: NewsItem[] = [];
    
    for (const [sourceId, source] of this.newsSources) {
      try {
        const news = await this.scanNewsSource(source);
        allNews.push(...news);
        console.log(`📰 Found ${news.length} items from ${source.name}`);
      } catch (error) {
        console.error(`❌ Failed to scan ${source.name}:`, error.message);
      }
    }

    // Process and score all news
    const relevantNews = allNews.filter(item => item.relevanceScore > 0.3);
    
    console.log(`🎯 Found ${relevantNews.length} relevant news items out of ${allNews.length} total`);
    
    return relevantNews;
  }

  /**
   * Scan individual news source
   */
  private async scanNewsSource(source: NewsSource): Promise<NewsItem[]> {
    const newsItems: NewsItem[] = [];
    
    try {
      if (source.type === 'rss' && source.rssUrl) {
        const feed = await this.rssParser.parseURL(source.rssUrl);
        
        for (const item of feed.items) {
          if (!item.title || !item.link) continue;
          
          const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
          
          // Only process items from last 24 hours for initial scan
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          if (isAfter(dayAgo, publishedAt)) continue;
          
          const newsItem: NewsItem = {
            id: this.generateNewsId(source.id, item.link),
            sourceId: source.id,
            title: item.title,
            content: item.content || item.summary || '',
            publishedAt,
            url: item.link,
            category: source.category,
            relevanceScore: 0,
            automationOpportunity: null,
            trending: {
              isViral: false,
              engagementScore: 0,
              velocity: 0,
              timeToRespond: 240 // 4 hours default
            },
            keywords: [],
            sentiment: 'neutral'
          };
          
          // Score relevance and identify automation opportunities
          await this.scoreRelevance(newsItem);
          
          if (newsItem.relevanceScore > 0.3) {
            newsItems.push(newsItem);
            this.detectedTrends.set(newsItem.id, newsItem);
          }
        }
      }
      
    } catch (error) {
      console.error(`Failed to scan ${source.name}:`, error);
    }
    
    return newsItems;
  }

  /**
   * Score news relevance for music marketing automation
   */
  private async scoreRelevance(newsItem: NewsItem): Promise<void> {
    const fullText = `${newsItem.title} ${newsItem.content}`.toLowerCase();
    
    let score = 0;
    let automationAngle = '';
    let audioIntelOpportunity = false;
    let competitorAdvantage = false;
    
    // Check for automation keywords
    const automationMatches = this.automationKeywords.filter(keyword => 
      fullText.includes(keyword)
    );
    score += automationMatches.length * 0.15;
    
    // Check for high-impact industry keywords
    const impactMatches = this.impactKeywords.filter(keyword => 
      fullText.includes(keyword)
    );
    score += impactMatches.length * 0.2;
    
    // Specific automation angles
    if (fullText.includes('playlist') && (fullText.includes('curator') || fullText.includes('pitch'))) {
      score += 0.3;
      automationAngle = 'Playlist pitching automation opportunity';
      audioIntelOpportunity = true;
    }
    
    if (fullText.includes('streaming') && fullText.includes('data')) {
      score += 0.25;
      automationAngle = 'Streaming data automation angle';
    }
    
    if (fullText.includes('independent') && fullText.includes('artist')) {
      score += 0.2;
      automationAngle = 'Independent artist empowerment angle';
      audioIntelOpportunity = true;
    }
    
    if (fullText.includes('contact') || fullText.includes('outreach') || fullText.includes('promotion')) {
      score += 0.25;
      automationAngle = 'Contact automation and outreach opportunity';
      audioIntelOpportunity = true;
    }
    
    // Platform-specific opportunities
    const platforms = [];
    if (fullText.includes('spotify') || fullText.includes('apple music')) {
      score += 0.15;
      platforms.push('streaming-focused');
    }
    
    if (fullText.includes('tiktok') || fullText.includes('instagram')) {
      score += 0.15;
      platforms.push('social-focused');
    }
    
    // Competitive advantage indicators
    if (fullText.includes('new feature') || fullText.includes('beta') || fullText.includes('launch')) {
      competitorAdvantage = true;
      score += 0.1;
    }
    
    // Urgency indicators
    let urgency: 'immediate' | 'same-day' | 'weekly' | 'evergreen' = 'weekly';
    if (fullText.includes('breaking') || fullText.includes('announced today')) {
      urgency = 'immediate';
      score += 0.1;
    } else if (fullText.includes('this week') || fullText.includes('new')) {
      urgency = 'same-day';
    }
    
    // Cap score at 1.0
    score = Math.min(score, 1.0);
    
    newsItem.relevanceScore = score;
    newsItem.keywords = [...automationMatches, ...impactMatches];
    
    if (score > 0.3) {
      newsItem.automationOpportunity = {
        angle: automationAngle || 'General automation opportunity',
        urgency,
        contentTypes: this.suggestContentTypes(newsItem, urgency),
        audioIntelOpportunity,
        competitorAdvantage,
        industryImpact: score > 0.7 ? 'high' : score > 0.5 ? 'medium' : 'low',
        automationAngle,
        platforms: platforms.length > 0 ? platforms : ['twitter', 'linkedin'],
        estimatedReach: this.estimateReach(score, urgency)
      };
    }
  }

  /**
   * Suggest content types based on news and urgency
   */
  private suggestContentTypes(newsItem: NewsItem, urgency: string): string[] {
    const types = [];
    
    if (urgency === 'immediate') {
      types.push('twitter-thread', 'linkedin-quick-take');
    } else if (urgency === 'same-day') {
      types.push('twitter-thread', 'linkedin-article', 'newsletter-section');
    } else {
      types.push('blog-post', 'newsletter-feature', 'email-sequence');
    }
    
    // Add platform-specific suggestions
    if (newsItem.content.toLowerCase().includes('visual') || newsItem.category === 'streaming') {
      types.push('instagram-carousel');
    }
    
    if (newsItem.automationOpportunity?.audioIntelOpportunity) {
      types.push('case-study', 'tutorial');
    }
    
    return types;
  }

  /**
   * Estimate potential reach based on relevance and urgency
   */
  private estimateReach(relevanceScore: number, urgency: string): number {
    let baseReach = 2000;
    
    // Adjust for relevance
    baseReach *= (1 + relevanceScore);
    
    // Adjust for urgency
    const urgencyMultipliers = {
      'immediate': 2.5,
      'same-day': 1.8,
      'weekly': 1.2,
      'evergreen': 1.0
    };
    
    baseReach *= urgencyMultipliers[urgency] || 1.0;
    
    return Math.round(baseReach);
  }

  /**
   * Check high-priority sources
   */
  private async checkHighPrioritySources(): Promise<void> {
    const highPrioritySources = Array.from(this.newsSources.values())
      .filter(source => source.priority === 'high');
    
    for (const source of highPrioritySources) {
      try {
        const news = await this.scanNewsSource(source);
        if (news.length > 0) {
          console.log(`🔥 Found ${news.length} new items from ${source.name}`);
          await this.processNewTrends(news);
        }
      } catch (error) {
        console.error(`Failed to check ${source.name}:`, error.message);
      }
    }
  }

  /**
   * Check medium-priority sources
   */
  private async checkMediumPrioritySources(): Promise<void> {
    const mediumPrioritySources = Array.from(this.newsSources.values())
      .filter(source => source.priority === 'medium');
    
    for (const source of mediumPrioritySources) {
      try {
        const news = await this.scanNewsSource(source);
        if (news.length > 0) {
          console.log(`📰 Found ${news.length} new items from ${source.name}`);
        }
      } catch (error) {
        console.error(`Failed to check ${source.name}:`, error.message);
      }
    }
  }

  /**
   * Process newly detected trends and generate alerts
   */
  private async processNewTrends(newsItems: NewsItem[]): Promise<void> {
    for (const newsItem of newsItems) {
      if (newsItem.relevanceScore > 0.6) {
        const alert = await this.generateTrendAlert(newsItem);
        this.trendAlerts.set(alert.id, alert);
        
        console.log(`🚨 HIGH PRIORITY ALERT: ${newsItem.title}`);
        console.log(`🎯 Automation Angle: ${newsItem.automationOpportunity.angle}`);
        console.log(`⏰ Response Window: ${alert.responseWindow} minutes`);
      }
    }
  }

  /**
   * Generate trend alert with response strategy
   */
  private async generateTrendAlert(newsItem: NewsItem): Promise<TrendAlert> {
    const responseWindow = this.calculateResponseWindow(newsItem);
    const alertLevel = this.determineAlertLevel(newsItem.relevanceScore, responseWindow);
    
    return {
      id: `alert_${newsItem.id}_${Date.now()}`,
      newsItem,
      alertLevel,
      responseWindow,
      suggestedActions: this.suggestActions(newsItem),
      contentBriefs: this.generateContentBriefs(newsItem),
      timing: {
        immediate: newsItem.automationOpportunity.urgency === 'immediate',
        peakWindow: addMinutes(newsItem.publishedAt, responseWindow / 2),
        expiryTime: addMinutes(newsItem.publishedAt, responseWindow)
      }
    };
  }

  /**
   * Calculate optimal response window
   */
  private calculateResponseWindow(newsItem: NewsItem): number {
    // Base response windows by urgency
    const baseWindows = {
      'immediate': 120,  // 2 hours
      'same-day': 480,   // 8 hours  
      'weekly': 2880,    // 48 hours
      'evergreen': 10080 // 1 week
    };
    
    let window = baseWindows[newsItem.automationOpportunity.urgency] || 480;
    
    // Adjust for relevance score
    if (newsItem.relevanceScore > 0.8) {
      window *= 0.75; // Faster response for highly relevant
    }
    
    // Adjust for competitive advantage
    if (newsItem.automationOpportunity.competitorAdvantage) {
      window *= 0.5; // Much faster for competitive opportunities
    }
    
    return Math.round(window);
  }

  /**
   * Determine alert level
   */
  private determineAlertLevel(relevanceScore: number, responseWindow: number): 'critical' | 'high' | 'medium' | 'low' {
    if (relevanceScore > 0.8 && responseWindow < 180) return 'critical';
    if (relevanceScore > 0.7 && responseWindow < 480) return 'high';
    if (relevanceScore > 0.5) return 'medium';
    return 'low';
  }

  /**
   * Suggest actions based on news item
   */
  private suggestActions(newsItem: NewsItem): string[] {
    const actions = [];
    
    if (newsItem.automationOpportunity.urgency === 'immediate') {
      actions.push('Create Twitter thread within 30 minutes');
      actions.push('Post LinkedIn quick take');
    }
    
    if (newsItem.automationOpportunity.audioIntelOpportunity) {
      actions.push('Include Audio Intel positioning');
      actions.push('Create case study angle');
    }
    
    if (newsItem.automationOpportunity.competitorAdvantage) {
      actions.push('Emphasize first-mover advantage');
      actions.push('Position as industry thought leader');
    }
    
    actions.push('Monitor engagement and double down if viral');
    actions.push('Prepare follow-up content for newsletter');
    
    return actions;
  }

  /**
   * Generate content briefs for different platforms
   */
  private generateContentBriefs(newsItem: NewsItem): string[] {
    const briefs = [];
    
    // Twitter thread brief
    briefs.push(`TWITTER THREAD: "${newsItem.title}" + Chris's automation expertise angle. Hook: "While everyone's talking about ${newsItem.title.split(' ').slice(0,3).join(' ')}, here's what this really means for indie artists..." Include personal experience and Audio Intel soft mention.`);
    
    // LinkedIn article brief
    briefs.push(`LINKEDIN ARTICLE: Professional take on ${newsItem.category} development. Title: "How ${newsItem.title} Changes Everything for Music Marketing Automation" - Authority-building piece with industry analysis and actionable insights.`);
    
    // Newsletter section brief
    if (newsItem.automationOpportunity.audioIntelOpportunity) {
      briefs.push(`NEWSLETTER SECTION: "This Week's Industry WTF" - Chris's reaction to the news with practical automation implications. Include reader question format and Audio Intel connection.`);
    }
    
    return briefs;
  }

  /**
   * Analyze current trends for patterns
   */
  private async analyzeTrends(): Promise<void> {
    const recentTrends = Array.from(this.detectedTrends.values())
      .filter(trend => {
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return isAfter(trend.publishedAt, hourAgo);
      });
    
    if (recentTrends.length === 0) return;
    
    // Look for trending patterns
    const keywordFrequency = new Map<string, number>();
    recentTrends.forEach(trend => {
      trend.keywords.forEach(keyword => {
        keywordFrequency.set(keyword, (keywordFrequency.get(keyword) || 0) + 1);
      });
    });
    
    // Identify hot topics (keywords appearing 3+ times)
    const hotTopics = Array.from(keywordFrequency.entries())
      .filter(([keyword, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1]);
    
    if (hotTopics.length > 0) {
      console.log('🔥 Hot topics detected:', hotTopics.slice(0, 5));
    }
  }

  /**
   * Utility methods
   */
  private generateNewsId(sourceId: string, url: string): string {
    return `${sourceId}_${url.split('/').pop()}_${Date.now()}`;
  }

  /**
   * Public API methods
   */
  public async getActiveTrends(): Promise<NewsItem[]> {
    return Array.from(this.detectedTrends.values())
      .filter(trend => trend.relevanceScore > 0.4)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  public async getActiveAlerts(): Promise<TrendAlert[]> {
    return Array.from(this.trendAlerts.values())
      .filter(alert => isAfter(alert.timing.expiryTime, new Date()))
      .sort((a, b) => b.newsItem.relevanceScore - a.newsItem.relevanceScore);
  }

  public async getTrendsByCategory(category: string): Promise<NewsItem[]> {
    return Array.from(this.detectedTrends.values())
      .filter(trend => trend.category === category)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  public async searchTrends(query: string): Promise<NewsItem[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.detectedTrends.values())
      .filter(trend => 
        trend.title.toLowerCase().includes(lowercaseQuery) ||
        trend.content.toLowerCase().includes(lowercaseQuery) ||
        trend.keywords.some(keyword => keyword.includes(lowercaseQuery))
      );
  }
}

export default TrendDetectionEngine;
export type {
  NewsSource,
  NewsItem, 
  AutomationOpportunity,
  TrendAlert
};