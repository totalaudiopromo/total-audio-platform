#!/usr/bin/env node

/**
 * Newsjacking Agent for Total Audio Promo
 * 
 * Monitors trending music industry topics and automatically generates newsletter sections
 * that connect current events to independent artist opportunities using "The Unsigned Advantage" positioning.
 * 
 * Core Capabilities:
 * - Real-time music industry news monitoring
 * - Trend relevance scoring for indie artists
 * - "Unsigned advantage" content generation
 * - Integration with "The Unsigned Advantage" newsletter
 * - Authentic Chris Schofield voice patterns
 */

const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const cheerio = require('cheerio');
const RSSParser = require('rss-parser');

// Simple logger
const logger = {
  info: (msg, ...args) => console.log(`[NEWSJACKING] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[NEWSJACKING] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[NEWSJACKING] ${msg}`, ...args)
};

class NewsjackingAgent {
  constructor() {
    this.name = 'NewsjackingAgent';
    this.specialty = 'Trending Topic Content Generation';
    this.prisma = new PrismaClient();
    this.rssParser = new RSSParser();
    
    this.metrics = {
      storiesMonitored: 0,
      contentPiecesGenerated: 0,
      newsletterSectionsCreated: 0,
      trendsDetected: 0,
      unsignedAnglesCreated: 0
    };

    // News sources for monitoring
    this.newsSources = {
      musicIndustry: [
        {
          name: 'Music Business Worldwide',
          rss: 'https://www.musicbusinessworldwide.com/feed/',
          relevanceWeight: 0.9,
          category: 'business'
        },
        {
          name: 'NME',
          rss: 'https://www.nme.com/feed',
          relevanceWeight: 0.7,
          category: 'culture'
        },
        {
          name: 'Billboard',
          rss: 'https://www.billboard.com/feed/',
          relevanceWeight: 0.8,
          category: 'charts'
        },
        {
          name: 'Ari\'s Take (Ari Herstand)',
          rss: 'https://aristake.com/feed/',
          relevanceWeight: 0.95,
          category: 'indie_artist'
        },
        {
          name: 'Complete Music Update (UK)',
          rss: 'https://completemusicupdate.com/feed/',
          relevanceWeight: 0.9,
          category: 'uk_industry'
        },
        {
          name: 'DIY Magazine (UK)',
          rss: 'https://diymag.com/feed',
          relevanceWeight: 0.85,
          category: 'uk_indie'
        },
        {
          name: 'Attack Magazine',
          rss: 'https://www.attackmagazine.com/feed/',
          relevanceWeight: 0.9,
          category: 'electronic_production'
        }
      ],
      techTrends: [
        {
          name: 'TechCrunch',
          rss: 'https://techcrunch.com/feed/',
          relevanceWeight: 0.6,
          category: 'tech',
          keywords: ['music', 'streaming', 'creator', 'artist', 'audio', 'playlist']
        }
      ],
      ukCulture: [
        {
          name: 'BBC Music',
          rss: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
          relevanceWeight: 0.8,
          category: 'culture'
        },
        {
          name: 'The Line of Best Fit (UK)',
          rss: 'https://www.thelineofbestfit.com/feed',
          relevanceWeight: 0.75,
          category: 'uk_indie_culture'
        }
      ]
    };

    // Relevance scoring keywords for independent artists
    this.relevanceKeywords = {
      highRelevance: [
        'independent artist', 'indie artist', 'unsigned', 'self-released',
        'playlist pitching', 'radio promotion', 'streaming', 'spotify',
        'contact research', 'music promotion', 'DIY music', 'bedroom producer'
      ],
      mediumRelevance: [
        'major label', 'record label', 'A&R', 'music industry',
        'marketing', 'promotion', 'social media', 'tiktok', 'instagram',
        'music discovery', 'algorithm', 'playlists'
      ],
      lowRelevance: [
        'tour', 'concert', 'festival', 'live music', 'venue',
        'merchandise', 'vinyl', 'cd sales'
      ]
    };

    // Chris Schofield voice patterns and characteristics
    this.voicePatterns = {
      openingHooks: [
        "Right, so whilst {major_entity} is {doing_something}, here's why that's actually brilliant news for independent artists...",
        "This week {industry_development} happened, and here's the unsigned advantage...",
        "So {news_event} just dropped, and honestly? Perfect timing for indies who know what they're doing...",
        "While everyone's talking about {trending_topic}, here's what independent artists should actually be focusing on..."
      ],
      transitionPhrases: [
        "Here's the thing though...",
        "But here's where it gets interesting for indies...",
        "Now, here's your move:",
        "The reality is:",
        "What this actually means for you:",
        "Here's how to turn this into opportunity:"
      ],
      conclusionStyles: [
        "Your move: {actionable_advice}",
        "Bottom line: {key_takeaway}",
        "Next steps: {practical_action}",
        "The opportunity: {specific_benefit}"
      ],
      chrisisms: [
        "Right, so", "Here's the thing", "The reality is", "What this actually means",
        "Here's your move", "Bottom line", "Perfect timing", "Here's where it gets interesting",
        "Honestly?", "The opportunity", "What everyone's missing", "Here's how to turn this"
      ],
      industryCredibility: [
        "After 5+ years in radio promotion",
        "From my experience working with BBC Radio 1",
        "Having pitched thousands of tracks",
        "As someone who's automated contact research",
        "Building Audio Intel taught me",
        "Working with indie artists daily"
      ]
    };

    // Newsletter section templates
    this.newsletterSections = {
      industryIntel: {
        title: "This Week's Industry Intel",
        purpose: "Connect trending news to indie opportunities",
        structure: ['hook', 'context', 'opportunity', 'action']
      },
      trendAlert: {
        title: "Trend Alert: What Indies Should Know",
        purpose: "Spot emerging opportunities before competition",
        structure: ['trend_identification', 'indie_advantage', 'timing', 'execution']
      },
      majorLabelDrama: {
        title: "Major Label Drama = Indie Opportunity",
        purpose: "Turn industry problems into positioning advantages",
        structure: ['drama_summary', 'why_indies_win', 'competitive_advantage', 'capitalize']
      }
    };
  }

  /**
   * Initialize the newsjacking agent
   */
  async initialize() {
    try {
      await this.prisma.$connect();
      logger.info('Newsjacking Agent initialized successfully');
      return true;
    } catch (error) {
      logger.error('Initialization failed:', error);
      return false;
    }
  }

  /**
   * Monitor news sources for trending topics (main detection function)
   */
  async monitorTrendingTopics() {
    try {
      logger.info('Starting trending topic monitoring cycle...');
      
      const allStories = [];
      
      // Monitor music industry sources
      for (const source of this.newsSources.musicIndustry) {
        const stories = await this.fetchFromRSS(source);
        allStories.push(...stories);
      }
      
      // Monitor tech sources (filtered by music keywords)
      for (const source of this.newsSources.techTrends) {
        const stories = await this.fetchFromRSS(source);
        const musicRelevantStories = stories.filter(story => 
          this.containsMusicKeywords(story, source.keywords || [])
        );
        allStories.push(...musicRelevantStories);
      }
      
      // Monitor UK culture sources
      for (const source of this.newsSources.ukCulture) {
        const stories = await this.fetchFromRSS(source);
        allStories.push(...stories);
      }
      
      this.metrics.storiesMonitored += allStories.length;
      
      // Score stories for relevance to independent artists
      const scoredStories = allStories.map(story => ({
        ...story,
        relevanceScore: this.calculateRelevanceScore(story),
        detectedAt: new Date()
      }));
      
      // Filter for high-relevance stories (score > 0.6)
      const highRelevanceStories = scoredStories
        .filter(story => story.relevanceScore > 0.6)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10); // Top 10 most relevant
      
      logger.info(`Found ${highRelevanceStories.length} high-relevance stories`);
      
      return highRelevanceStories;
      
    } catch (error) {
      logger.error('Error monitoring trends:', error);
      return [];
    }
  }

  /**
   * Fetch stories from RSS feed
   */
  async fetchFromRSS(source) {
    try {
      const feed = await this.rssParser.parseURL(source.rss);
      
      return feed.items.map(item => ({
        id: this.generateStoryId(item.link || item.guid),
        title: item.title,
        content: item.content || item.summary || '',
        publishedAt: new Date(item.pubDate || item.isoDate),
        source: source.name,
        category: source.category,
        url: item.link,
        relevanceWeight: source.relevanceWeight
      }));
      
    } catch (error) {
      logger.warn(`Failed to fetch from ${source.name}:`, error.message);
      return [];
    }
  }

  /**
   * Check if story contains music-related keywords
   */
  containsMusicKeywords(story, keywords) {
    const text = `${story.title} ${story.content}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  /**
   * Calculate relevance score for independent artists (0-1)
   */
  calculateRelevanceScore(story) {
    const text = `${story.title} ${story.content}`.toLowerCase();
    let score = 0;
    
    // High relevance keywords
    for (const keyword of this.relevanceKeywords.highRelevance) {
      if (text.includes(keyword.toLowerCase())) {
        score += 0.3;
      }
    }
    
    // Medium relevance keywords
    for (const keyword of this.relevanceKeywords.mediumRelevance) {
      if (text.includes(keyword.toLowerCase())) {
        score += 0.2;
      }
    }
    
    // Low relevance keywords
    for (const keyword of this.relevanceKeywords.lowRelevance) {
      if (text.includes(keyword.toLowerCase())) {
        score += 0.1;
      }
    }
    
    // Apply source weight
    score *= story.relevanceWeight;
    
    // Recency boost (newer stories get higher scores)
    const hoursOld = (Date.now() - story.publishedAt.getTime()) / (1000 * 60 * 60);
    if (hoursOld < 6) score *= 1.2;
    else if (hoursOld < 24) score *= 1.1;
    else if (hoursOld < 72) score *= 1.0;
    else score *= 0.8;
    
    return Math.min(score, 1.0); // Cap at 1.0
  }

  /**
   * Generate "unsigned advantage" content from trending story
   */
  async generateUnsignedAdvantageContent(story) {
    try {
      logger.info(`Generating unsigned advantage content for: ${story.title}`);
      
      const angle = await this.identifyUnsignedAngle(story);
      const sections = await this.generateNewsletterSections(story, angle);
      
      this.metrics.contentPiecesGenerated++;
      this.metrics.newsletterSectionsCreated += sections.length;
      this.metrics.unsignedAnglesCreated++;
      
      return {
        storyId: story.id,
        originalStory: story,
        unsignedAngle: angle,
        newsletterSections: sections,
        generatedAt: new Date(),
        status: 'pending_review'
      };
      
    } catch (error) {
      logger.error('Error generating content:', error);
      return null;
    }
  }

  /**
   * Identify the "unsigned advantage" angle for a story
   */
  async identifyUnsignedAngle(story) {
    const text = `${story.title} ${story.content}`.toLowerCase();

    // Order matters - check most specific patterns first to avoid all stories hitting "ai/tool" pattern

    // Legal/lawsuit angles (indie artists benefit from clarity)
    if (text.includes('lawsuit') || text.includes('sued') || text.includes('legal')) {
      return {
        type: 'legal_clarity',
        angle: 'Legal battles create clarity on rules - indies who understand the outcome can move strategically',
        opportunity: 'Strategic positioning advantage',
        actionable: 'Position yourself on the right side of industry legal shifts'
      };
    }

    // Major label problems (business issues, cuts, struggles)
    if (text.includes('major label') && (text.includes('cuts') || text.includes('problems') || text.includes('struggle') || text.includes('layoff'))) {
      return {
        type: 'major_label_problems',
        angle: 'While major labels struggle with {problem}, independent artists can move faster and be more agile',
        opportunity: 'Speed and flexibility advantage',
        actionable: 'Position as alternative to struggling major label system'
      };
    }

    // Collaboration and networking opportunities
    if (text.includes('collab') || text.includes('collaboration') || text.includes('network') || text.includes('community')) {
      return {
        type: 'collaboration_opportunities',
        angle: 'The indie scene thrives on collaboration - opportunities major label artists can\'t access',
        opportunity: 'Community and partnership advantage',
        actionable: 'Build strategic collaborations while majors are stuck in contracts'
      };
    }

    // Mental health and wellness (indie artist self-care)
    if (text.includes('mental health') || text.includes('wellness') || text.includes('burnout')) {
      return {
        type: 'sustainable_careers',
        angle: 'Indies can build sustainable careers on their own terms without label pressure',
        opportunity: 'Creative control and wellbeing',
        actionable: 'Design your career around your life, not label deadlines'
      };
    }

    // Merch and direct-to-fan revenue
    if (text.includes('merch') || text.includes('merchandise') || text.includes('direct-to-fan') || text.includes('d2f')) {
      return {
        type: 'revenue_diversification',
        angle: 'Indies keep 100% of merch and D2F revenue - majors take huge cuts',
        opportunity: 'Revenue ownership advantage',
        actionable: 'Build direct fan relationships and keep what you earn'
      };
    }

    // Music education and access to knowledge
    if (text.includes('education') || text.includes('school') || text.includes('learn') || text.includes('course')) {
      return {
        type: 'knowledge_democratization',
        angle: 'Music industry knowledge is now accessible to everyone - no label needed',
        opportunity: 'Self-education advantage',
        actionable: 'Learn industry skills faster than label artists waiting for A&R guidance'
      };
    }

    // Streaming platform changes (algorithms, playlists, features)
    if (text.includes('streaming') && (text.includes('algorithm') || text.includes('spotify') || text.includes('playlist'))) {
      return {
        type: 'platform_changes',
        angle: 'New platform features favor artists who can adapt quickly over those stuck in old systems',
        opportunity: 'Early adoption advantage',
        actionable: 'Implement new features before major labels catch up'
      };
    }

    // Production tools and studio tech (more specific than general "ai/tool")
    if ((text.includes('production') || text.includes('studio') || text.includes('mixing') || text.includes('mastering')) &&
        (text.includes('tool') || text.includes('plugin') || text.includes('software'))) {
      return {
        type: 'production_democratization',
        angle: 'Professional production tools are now accessible to bedroom producers - the playing field is levelling',
        opportunity: 'Studio-quality production at home',
        actionable: 'Master production tools that major label artists pay thousands for'
      };
    }

    // AI and automation (general tech, check AFTER specific production tools)
    if (text.includes('automation') || text.includes('ai') || text.includes('artificial intelligence')) {
      return {
        type: 'technology_democratization',
        angle: 'AI tools level the playing field - indies can now automate what majors pay teams for',
        opportunity: 'Technology access equality',
        actionable: 'Adopt AI tools faster than established industry players'
      };
    }

    // Radio and promotion opportunities
    if (text.includes('radio') || text.includes('bbc') || text.includes('promotion') || text.includes('playlist pitching')) {
      return {
        type: 'promotion_opportunities',
        angle: 'Changes in promotion landscape create new pathways for independent artists',
        opportunity: 'Direct access to gatekeepers',
        actionable: 'Build relationships while majors are stuck in old processes'
      };
    }

    // Industry age and "making it later" narratives
    if (text.includes('after 30') || text.includes('late bloomer') || text.includes('older artist')) {
      return {
        type: 'age_advantage',
        angle: 'Success doesn\'t have an age limit - indie artists can build careers on their own timeline',
        opportunity: 'No label age discrimination',
        actionable: 'Focus on your craft and audience, not arbitrary age limits'
      };
    }

    // Default angle (only if no specific pattern matched)
    return {
      type: 'general_opportunity',
      angle: 'Industry changes create opportunities for artists willing to move fast',
      opportunity: 'First-mover advantage',
      actionable: 'Take action while others are still figuring it out'
    };
  }

  /**
   * Generate newsletter sections with Chris's authentic voice
   */
  async generateNewsletterSections(story, angle) {
    const sections = [];
    
    // Industry Intel section
    const industryIntel = await this.generateIndustryIntelSection(story, angle);
    sections.push(industryIntel);
    
    // If highly relevant, also generate Trend Alert or Major Label Drama
    if (story.relevanceScore > 0.8) {
      if (angle.type === 'major_label_problems') {
        const majorLabelDrama = await this.generateMajorLabelDramaSection(story, angle);
        sections.push(majorLabelDrama);
      } else {
        const trendAlert = await this.generateTrendAlertSection(story, angle);
        sections.push(trendAlert);
      }
    }
    
    return sections;
  }

  /**
   * Generate Industry Intel newsletter section
   */
  async generateIndustryIntelSection(story, angle) {
    const hook = this.selectRandomPattern(this.voicePatterns.openingHooks)
      .replace('{major_entity}', this.extractMajorEntity(story))
      .replace('{doing_something}', this.extractAction(story))
      .replace('{industry_development}', story.title)
      .replace('{news_event}', this.summarizeEvent(story))
      .replace('{trending_topic}', story.title);
    
    const transition = this.selectRandomPattern(this.voicePatterns.transitionPhrases);
    const conclusion = this.selectRandomPattern(this.voicePatterns.conclusionStyles)
      .replace('{actionable_advice}', this.generateActionableAdvice(story, angle))
      .replace('{key_takeaway}', angle.opportunity)
      .replace('{practical_action}', this.generatePracticalAction(story, angle))
      .replace('{specific_benefit}', angle.actionable);
    
    const credibility = this.selectRandomPattern(this.voicePatterns.industryCredibility);
    
    return {
      type: 'industry_intel',
      title: "This Week's Industry Intel",
      content: `${hook}

${transition} ${angle.angle.replace('{problem}', this.extractProblem(story))}.

${credibility}, this kind of shift happens every few years, and indies who spot it early always come out ahead.

The opportunity here is simple: ${angle.opportunity.toLowerCase()}.

${conclusion}`,
      
      keyTakeaways: [
        angle.opportunity,
        this.generateActionableAdvice(story, angle),
        'Move faster than established players'
      ],
      
      audioIntelConnection: this.findAudioIntelConnection(story, angle),
      urgency: this.calculateUrgency(story),
      estimatedReach: this.estimateReach(story.relevanceScore)
    };
  }

  /**
   * Generate Trend Alert newsletter section
   */
  async generateTrendAlertSection(story, angle) {
    const trendIdentification = `New trend spotted: ${story.title}`;
    const indieAdvantage = `Why indies win: ${angle.angle}`;
    const timing = this.generateTimingAdvice(story);
    const execution = this.generateExecutionSteps(story, angle);
    
    return {
      type: 'trend_alert',
      title: "Trend Alert: What Indies Should Know",
      content: `${trendIdentification}

${indieAdvantage}

**Timing**: ${timing}

**Execution**: ${execution}

This is exactly why I built Audio Intel - to spot these opportunities faster than anyone else and turn them into action.`,
      
      keyTakeaways: [
        'Early trend identification',
        'Independent artist advantages',
        'Specific execution steps'
      ],
      
      audioIntelConnection: this.findAudioIntelConnection(story, angle),
      urgency: 'immediate',
      estimatedReach: this.estimateReach(story.relevanceScore)
    };
  }

  /**
   * Generate Major Label Drama section
   */
  async generateMajorLabelDramaSection(story, angle) {
    const dramaSummary = this.summarizeDrama(story);
    const whyIndiesWin = angle.angle;
    const competitiveAdvantage = this.identifyCompetitiveAdvantage(story, angle);
    const capitalize = this.generateCapitalizationStrategy(story, angle);
    
    return {
      type: 'major_label_drama',
      title: "Major Label Drama = Indie Opportunity",
      content: `${dramaSummary}

Here's why indies win: ${whyIndiesWin}

**Your competitive advantage**: ${competitiveAdvantage}

**How to capitalize**: ${capitalize}

Right, so whilst they're dealing with internal drama, you're building direct relationships and getting results.`,
      
      keyTakeaways: [
        'Major label weaknesses',
        'Independent artist strengths',
        'Specific opportunity to exploit'
      ],
      
      audioIntelConnection: this.findAudioIntelConnection(story, angle),
      urgency: 'same_day',
      estimatedReach: this.estimateReach(story.relevanceScore)
    };
  }

  // Helper methods for content generation
  selectRandomPattern(patterns) {
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  extractMajorEntity(story) {
    const text = `${story.title} ${story.content}`.toLowerCase();
    if (text.includes('spotify')) return 'Spotify';
    if (text.includes('apple music')) return 'Apple Music';
    if (text.includes('major label')) return 'major labels';
    if (text.includes('universal')) return 'Universal Music';
    if (text.includes('sony')) return 'Sony Music';
    if (text.includes('warner')) return 'Warner Music';
    return 'the music industry';
  }

  extractAction(story) {
    const text = `${story.title} ${story.content}`.toLowerCase();
    if (text.includes('cut')) return 'cutting costs';
    if (text.includes('announce')) return 'making announcements';
    if (text.includes('change')) return 'changing strategies';
    if (text.includes('launch')) return 'launching new initiatives';
    return 'making moves';
  }

  summarizeEvent(story) {
    return story.title;
  }

  extractProblem(story) {
    const text = `${story.title} ${story.content}`.toLowerCase();
    if (text.includes('cut') && text.includes('job')) return 'job cuts';
    if (text.includes('revenue')) return 'revenue issues';
    if (text.includes('streaming')) return 'streaming challenges';
    return 'industry changes';
  }

  generateActionableAdvice(story, angle) {
    return `Take advantage of ${angle.opportunity.toLowerCase()} by implementing ${angle.actionable.toLowerCase()} this week`;
  }

  generatePracticalAction(story, angle) {
    return `Start ${angle.actionable.toLowerCase()} while competitors are still catching up`;
  }

  findAudioIntelConnection(story, angle) {
    const text = `${story.title} ${story.content}`.toLowerCase();
    
    if (text.includes('contact') || text.includes('research')) {
      return 'Perfect use case for Audio Intel contact automation';
    }
    if (text.includes('playlist') || text.includes('curator')) {
      return 'Audio Intel helps find these opportunities automatically';
    }
    if (text.includes('radio') || text.includes('promotion')) {
      return 'Audio Intel streamlines this exact process';
    }
    
    return 'Audio Intel helps indies move faster on opportunities like this';
  }

  calculateUrgency(story) {
    const hoursOld = (Date.now() - story.publishedAt.getTime()) / (1000 * 60 * 60);
    if (hoursOld < 6) return 'immediate';
    if (hoursOld < 24) return 'same_day';
    if (hoursOld < 72) return 'this_week';
    return 'low';
  }

  estimateReach(relevanceScore) {
    return Math.round(relevanceScore * 10000);
  }

  generateTimingAdvice(story) {
    return `Act now while this is still developing - first-mover advantage lasts about 2-3 weeks`;
  }

  generateExecutionSteps(story, angle) {
    return `1. Understand the opportunity
2. ${angle.actionable}
3. Monitor results and adjust
4. Scale what works`;
  }

  summarizeDrama(story) {
    return `Latest industry drama: ${story.title.replace(/['"]/g, '')}`;
  }

  identifyCompetitiveAdvantage(story, angle) {
    return `You can ${angle.actionable.toLowerCase()} while they're stuck dealing with internal issues`;
  }

  generateCapitalizationStrategy(story, angle) {
    return `Focus on ${angle.opportunity.toLowerCase()} and build relationships while they're distracted`;
  }

  generateStoryId(url) {
    return `story_${Buffer.from(url).toString('base64').slice(0, 10)}`;
  }

  /**
   * Process trending topics and generate newsletter content
   */
  async processNewsjackingCycle() {
    try {
      logger.info('Starting newsjacking cycle...');
      
      // Monitor trending topics
      const trendingStories = await this.monitorTrendingTopics();
      
      if (trendingStories.length === 0) {
        logger.info('No high-relevance stories found this cycle');
        return [];
      }
      
      // Generate content for top stories
      const contentPieces = [];
      for (const story of trendingStories.slice(0, 5)) { // Process top 5
        const content = await this.generateUnsignedAdvantageContent(story);
        if (content) {
          contentPieces.push(content);
        }
      }
      
      logger.info(`Generated ${contentPieces.length} content pieces from ${trendingStories.length} trending stories`);
      
      return contentPieces;
      
    } catch (error) {
      logger.error('Error in newsjacking cycle:', error);
      return [];
    }
  }

  /**
   * Get agent metrics and performance data
   */
  getMetrics() {
    return {
      ...this.metrics,
      uptime: process.uptime(),
      lastRun: new Date().toISOString()
    };
  }

  /**
   * Cleanup and disconnect
   */
  async shutdown() {
    try {
      await this.prisma.$disconnect();
      logger.info('Newsjacking Agent shutdown complete');
    } catch (error) {
      logger.error('Error during shutdown:', error);
    }
  }
}

// Export for use by other agents
module.exports = NewsjackingAgent;

// CLI execution
if (require.main === module) {
  const agent = new NewsjackingAgent();
  
  async function main() {
    await agent.initialize();
    
    if (process.argv.includes('--cycle')) {
      const results = await agent.processNewsjackingCycle();
      console.log(JSON.stringify(results, null, 2));
    } else if (process.argv.includes('--monitor')) {
      const trends = await agent.monitorTrendingTopics();
      console.log(JSON.stringify(trends, null, 2));
    } else if (process.argv.includes('--metrics')) {
      console.log(JSON.stringify(agent.getMetrics(), null, 2));
    } else {
      console.log(`
Newsjacking Agent Commands:
  --cycle    Run full newsjacking cycle (monitor + generate)
  --monitor  Monitor trending topics only
  --metrics  Show agent performance metrics
      `);
    }
    
    await agent.shutdown();
    process.exit(0);
  }
  
  main().catch(console.error);
}