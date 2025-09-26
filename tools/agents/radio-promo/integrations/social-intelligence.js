#!/usr/bin/env node

/**
 * Social Media Intelligence System
 * 
 * Monitors station social media for opportunities
 * Tracks hashtags, DJs, and playlist curators
 * Finds submission opportunities and engagement patterns
 */

const fs = require('fs');
const path = require('path');

class SocialIntelligence {
  constructor() {
    this.monitoringTargets = new Map();
    this.opportunities = new Map();
    this.engagementData = new Map();
    
    // Data persistence
    this.dataFile = path.join(__dirname, '..', 'data', 'social-intelligence.json');
    this.loadData();
    
    // Initialize monitoring targets
    this.initializeMonitoringTargets();
    
    // Start monitoring
    this.startMonitoring();
  }

  /**
   * Initialize monitoring targets
   */
  initializeMonitoringTargets() {
    // Radio station hashtags
    this.monitoringTargets.set('hashtags', [
      '#NewMusicFriday',
      '#SubmitMusic',
      '#NewMusic',
      '#FreshTracks',
      '#MusicSubmission',
      '#RadioPlay',
      '#IndieMusic',
      '#NewArtist',
      '#MusicDiscovery',
      '#PlaylistAdd'
    ]);
    
    // DJ and curator accounts
    this.monitoringTargets.set('djs', [
      'BBCRadio1',
      'BBCRadio2',
      'CapitalFM',
      'KissFM',
      'RadioX',
      'AbsoluteRadio'
    ]);
    
    // Playlist curators
    this.monitoringTargets.set('curators', [
      'SpotifyUK',
      'AppleMusicUK',
      'DeezerUK',
      'TidalUK'
    ]);
    
    // Music industry accounts
    this.monitoringTargets.set('industry', [
      'MusicWeek',
      'NME',
      'ClashMusic',
      'TheLineOfBestFit',
      'DIYMagazine'
    ]);
  }

  /**
   * Start monitoring social media
   */
  startMonitoring() {
    console.log('📱 Starting social media intelligence monitoring...');
    
    // Monitor hashtags every 5 minutes
    setInterval(() => {
      this.monitorHashtags();
    }, 5 * 60 * 1000);
    
    // Monitor DJs every 10 minutes
    setInterval(() => {
      this.monitorDJs();
    }, 10 * 60 * 1000);
    
    // Monitor curators every 15 minutes
    setInterval(() => {
      this.monitorCurators();
    }, 15 * 60 * 1000);
    
    console.log('✅ Social media monitoring started');
  }

  /**
   * Monitor hashtags for opportunities
   */
  async monitorHashtags() {
    const hashtags = this.monitoringTargets.get('hashtags');
    
    for (const hashtag of hashtags) {
      try {
        const opportunities = await this.searchHashtag(hashtag);
        this.processOpportunities(hashtag, opportunities);
      } catch (error) {
        console.error(`❌ Failed to monitor hashtag ${hashtag}:`, error.message);
      }
    }
  }

  /**
   * Monitor DJ accounts
   */
  async monitorDJs() {
    const djs = this.monitoringTargets.get('djs');
    
    for (const dj of djs) {
      try {
        const posts = await this.getAccountPosts(dj);
        this.analyzeDJPosts(dj, posts);
      } catch (error) {
        console.error(`❌ Failed to monitor DJ ${dj}:`, error.message);
      }
    }
  }

  /**
   * Monitor curator accounts
   */
  async monitorCurators() {
    const curators = this.monitoringTargets.get('curators');
    
    for (const curator of curators) {
      try {
        const posts = await this.getAccountPosts(curator);
        this.analyzeCuratorPosts(curator, posts);
      } catch (error) {
        console.error(`❌ Failed to monitor curator ${curator}:`, error.message);
      }
    }
  }

  /**
   * Search hashtag for opportunities
   */
  async searchHashtag(hashtag) {
    // This would integrate with Twitter API, Instagram API, etc.
    // For now, simulate the search
    const mockOpportunities = [
      {
        id: `hashtag-${hashtag}-${Date.now()}`,
        platform: 'Twitter',
        hashtag: hashtag,
        content: `Looking for new music submissions for our Friday show! Use ${hashtag} to submit`,
        author: '@RadioStation',
        timestamp: Date.now(),
        engagement: {
          likes: Math.floor(Math.random() * 100),
          retweets: Math.floor(Math.random() * 50),
          replies: Math.floor(Math.random() * 20)
        },
        opportunityType: 'submission_call'
      }
    ];
    
    return mockOpportunities;
  }

  /**
   * Get account posts
   */
  async getAccountPosts(account) {
    // This would integrate with social media APIs
    // For now, simulate getting posts
    const mockPosts = [
      {
        id: `post-${account}-${Date.now()}`,
        platform: 'Twitter',
        account: account,
        content: `New music Friday! What's everyone listening to? Drop your recommendations below!`,
        timestamp: Date.now(),
        engagement: {
          likes: Math.floor(Math.random() * 200),
          retweets: Math.floor(Math.random() * 100),
          replies: Math.floor(Math.random() * 50)
        }
      }
    ];
    
    return mockPosts;
  }

  /**
   * Process opportunities
   */
  processOpportunities(hashtag, opportunities) {
    opportunities.forEach(opportunity => {
      const opportunityId = opportunity.id;
      
      // Check if we've already processed this opportunity
      if (this.opportunities.has(opportunityId)) {
        return;
      }
      
      // Analyze opportunity
      const analysis = this.analyzeOpportunity(opportunity);
      
      // Store opportunity
      this.opportunities.set(opportunityId, {
        ...opportunity,
        analysis,
        processed: false,
        timestamp: Date.now()
      });
      
      // Alert if high priority
      if (analysis.priority === 'high') {
        this.alertOpportunity(opportunity, analysis);
      }
      
      console.log(`🎯 New opportunity found: ${hashtag} - ${analysis.type}`);
    });
  }

  /**
   * Analyze opportunity
   */
  analyzeOpportunity(opportunity) {
    const content = opportunity.content.toLowerCase();
    let type = 'unknown';
    let priority = 'low';
    let confidence = 0.5;
    
    // Determine opportunity type
    if (content.includes('submit') || content.includes('send')) {
      type = 'submission_call';
      priority = 'high';
      confidence = 0.8;
    } else if (content.includes('playlist') || content.includes('add')) {
      type = 'playlist_opportunity';
      priority = 'medium';
      confidence = 0.7;
    } else if (content.includes('new music') || content.includes('fresh')) {
      type = 'new_music_focus';
      priority = 'medium';
      confidence = 0.6;
    } else if (content.includes('friday') || content.includes('show')) {
      type = 'show_opportunity';
      priority = 'high';
      confidence = 0.7;
    }
    
    // Adjust priority based on engagement
    const engagement = opportunity.engagement;
    const totalEngagement = engagement.likes + engagement.retweets + engagement.replies;
    
    if (totalEngagement > 100) {
      priority = 'high';
    } else if (totalEngagement > 50) {
      priority = 'medium';
    }
    
    return {
      type,
      priority,
      confidence,
      engagement: totalEngagement,
      keywords: this.extractKeywords(opportunity.content)
    };
  }

  /**
   * Analyze DJ posts
   */
  analyzeDJPosts(dj, posts) {
    posts.forEach(post => {
      const analysis = this.analyzeDJPost(dj, post);
      
      if (analysis.hasOpportunity) {
        this.processOpportunities(`@${dj}`, [{
          ...post,
          opportunityType: analysis.opportunityType,
          author: `@${dj}`
        }]);
      }
      
      // Track engagement patterns
      this.trackEngagement(dj, post);
    });
  }

  /**
   * Analyze DJ post
   */
  analyzeDJPost(dj, post) {
    const content = post.content.toLowerCase();
    let hasOpportunity = false;
    let opportunityType = 'unknown';
    
    // Look for submission opportunities
    if (content.includes('submit') || content.includes('send') || content.includes('music')) {
      hasOpportunity = true;
      opportunityType = 'submission_call';
    }
    
    // Look for playlist opportunities
    if (content.includes('playlist') || content.includes('add')) {
      hasOpportunity = true;
      opportunityType = 'playlist_opportunity';
    }
    
    // Look for show opportunities
    if (content.includes('show') || content.includes('friday') || content.includes('new music')) {
      hasOpportunity = true;
      opportunityType = 'show_opportunity';
    }
    
    return {
      hasOpportunity,
      opportunityType,
      confidence: hasOpportunity ? 0.8 : 0.2
    };
  }

  /**
   * Analyze curator posts
   */
  analyzeCuratorPosts(curator, posts) {
    posts.forEach(post => {
      const analysis = this.analyzeCuratorPost(curator, post);
      
      if (analysis.hasOpportunity) {
        this.processOpportunities(`@${curator}`, [{
          ...post,
          opportunityType: analysis.opportunityType,
          author: `@${curator}`
        }]);
      }
      
      // Track engagement patterns
      this.trackEngagement(curator, post);
    });
  }

  /**
   * Analyze curator post
   */
  analyzeCuratorPost(curator, post) {
    const content = post.content.toLowerCase();
    let hasOpportunity = false;
    let opportunityType = 'unknown';
    
    // Look for playlist opportunities
    if (content.includes('playlist') || content.includes('add') || content.includes('submit')) {
      hasOpportunity = true;
      opportunityType = 'playlist_opportunity';
    }
    
    // Look for new music focus
    if (content.includes('new music') || content.includes('fresh') || content.includes('discover')) {
      hasOpportunity = true;
      opportunityType = 'new_music_focus';
    }
    
    return {
      hasOpportunity,
      opportunityType,
      confidence: hasOpportunity ? 0.7 : 0.2
    };
  }

  /**
   * Track engagement patterns
   */
  trackEngagement(account, post) {
    if (!this.engagementData.has(account)) {
      this.engagementData.set(account, []);
    }
    
    const engagement = this.engagementData.get(account);
    engagement.push({
      postId: post.id,
      timestamp: post.timestamp,
      engagement: post.engagement,
      content: post.content
    });
    
    // Keep only last 100 posts
    if (engagement.length > 100) {
      engagement.splice(0, engagement.length - 100);
    }
  }

  /**
   * Alert on high-priority opportunity
   */
  alertOpportunity(opportunity, analysis) {
    console.log(`🚨 HIGH PRIORITY OPPORTUNITY ALERT!`);
    console.log(`   Platform: ${opportunity.platform}`);
    console.log(`   Account: ${opportunity.author}`);
    console.log(`   Type: ${analysis.type}`);
    console.log(`   Content: ${opportunity.content.substring(0, 100)}...`);
    console.log(`   Engagement: ${analysis.engagement} interactions`);
    console.log(`   Confidence: ${Math.round(analysis.confidence * 100)}%`);
  }

  /**
   * Extract keywords from content
   */
  extractKeywords(content) {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Get opportunities by type
   */
  getOpportunitiesByType(type) {
    const opportunities = Array.from(this.opportunities.values());
    return opportunities.filter(opp => opp.analysis.type === type);
  }

  /**
   * Get high-priority opportunities
   */
  getHighPriorityOpportunities() {
    const opportunities = Array.from(this.opportunities.values());
    return opportunities.filter(opp => opp.analysis.priority === 'high');
  }

  /**
   * Get engagement analytics
   */
  getEngagementAnalytics() {
    const analytics = {};
    
    for (const [account, posts] of this.engagementData) {
      const totalPosts = posts.length;
      const totalEngagement = posts.reduce((sum, post) => {
        return sum + post.engagement.likes + post.engagement.retweets + post.engagement.replies;
      }, 0);
      
      analytics[account] = {
        totalPosts,
        totalEngagement,
        averageEngagement: totalPosts > 0 ? totalEngagement / totalPosts : 0,
        lastPost: posts.length > 0 ? Math.max(...posts.map(p => p.timestamp)) : 0
      };
    }
    
    return analytics;
  }

  /**
   * Get opportunity analytics
   */
  getOpportunityAnalytics() {
    const opportunities = Array.from(this.opportunities.values());
    const totalOpportunities = opportunities.length;
    
    if (totalOpportunities === 0) {
      return {
        totalOpportunities: 0,
        opportunityTypes: {},
        priorityBreakdown: {},
        averageConfidence: 0
      };
    }
    
    const opportunityTypes = {};
    const priorityBreakdown = {};
    
    opportunities.forEach(opp => {
      const type = opp.analysis.type;
      const priority = opp.analysis.priority;
      
      opportunityTypes[type] = (opportunityTypes[type] || 0) + 1;
      priorityBreakdown[priority] = (priorityBreakdown[priority] || 0) + 1;
    });
    
    const averageConfidence = opportunities.reduce((sum, opp) => sum + opp.analysis.confidence, 0) / totalOpportunities;
    
    return {
      totalOpportunities,
      opportunityTypes,
      priorityBreakdown,
      averageConfidence,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Add monitoring target
   */
  addMonitoringTarget(type, target) {
    if (!this.monitoringTargets.has(type)) {
      this.monitoringTargets.set(type, []);
    }
    
    const targets = this.monitoringTargets.get(type);
    if (!targets.includes(target)) {
      targets.push(target);
      console.log(`📱 Added monitoring target: ${type} - ${target}`);
    }
  }

  /**
   * Remove monitoring target
   */
  removeMonitoringTarget(type, target) {
    if (this.monitoringTargets.has(type)) {
      const targets = this.monitoringTargets.get(type);
      const index = targets.indexOf(target);
      if (index > -1) {
        targets.splice(index, 1);
        console.log(`📱 Removed monitoring target: ${type} - ${target}`);
      }
    }
  }

  /**
   * Data persistence
   */
  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.opportunities = new Map(data.opportunities || []);
        this.engagementData = new Map(data.engagementData || []);
        console.log(`📚 Loaded social intelligence data: ${this.opportunities.size} opportunities`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load social intelligence data:', error.message);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const data = {
        opportunities: Array.from(this.opportunities.entries()),
        engagementData: Array.from(this.engagementData.entries()),
        lastSaved: Date.now()
      };
      
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save social intelligence data:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const opportunityAnalytics = this.getOpportunityAnalytics();
    const engagementAnalytics = this.getEngagementAnalytics();
    
    return {
      status: 'healthy',
      opportunities: opportunityAnalytics,
      engagement: engagementAnalytics,
      monitoringTargets: {
        hashtags: this.monitoringTargets.get('hashtags').length,
        djs: this.monitoringTargets.get('djs').length,
        curators: this.monitoringTargets.get('curators').length
      },
      lastChecked: new Date().toISOString()
    };
  }
}

module.exports = SocialIntelligence;
