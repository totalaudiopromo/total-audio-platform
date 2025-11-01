/**
 * Relevance Scoring Engine
 * Advanced scoring system to identify high-value automation angles in music industry news
 */

import { NewsItem, AutomationOpportunity } from './trend-detection';
import nlp from 'compromise';
import Sentiment from 'sentiment';

export interface ScoringCriteria {
  automationKeywords: AutomationKeywordSet;
  industryKeywords: IndustryKeywordSet;
  urgencyIndicators: UrgencyIndicator[];
  competitiveAdvantageSignals: CompetitiveSignal[];
  audienceRelevance: AudienceRelevanceSet;
}

export interface AutomationKeywordSet {
  core: { keyword: string; weight: number; context?: string[] }[];
  secondary: { keyword: string; weight: number; context?: string[] }[];
  negative: string[]; // Keywords that reduce relevance
}

export interface IndustryKeywordSet {
  platforms: { keyword: string; weight: number; platforms: string[] }[];
  businessTypes: { keyword: string; weight: number; audience: string[] }[];
  techTrends: { keyword: string; weight: number; category: string }[];
  marketingConcepts: { keyword: string; weight: number; application: string[] }[];
}

export interface UrgencyIndicator {
  pattern: string;
  urgencyLevel: 'immediate' | 'same-day' | 'weekly' | 'evergreen';
  timeWindow: number; // minutes
  multiplier: number;
}

export interface CompetitiveSignal {
  pattern: string;
  advantageType: 'first-mover' | 'expertise' | 'positioning' | 'tools';
  weight: number;
  description: string;
}

export interface AudienceRelevanceSet {
  primaryAudience: string[]; // Independent artists, agencies, etc.
  secondaryAudience: string[];
  painPoints: string[];
  interests: string[];
}

export interface ScoringResult {
  totalScore: number;
  breakdown: {
    automationRelevance: number;
    industryImpact: number;
    urgencyBoost: number;
    competitiveAdvantage: number;
    audienceAlignment: number;
    trendingPotential: number;
  };
  strengths: string[];
  opportunities: string[];
  contentAngles: string[];
  platformRecommendations: string[];
  audioIntelAngle: string | null;
}

class RelevanceScoringEngine {
  private sentiment: Sentiment;
  private scoringCriteria: ScoringCriteria;

  constructor() {
    this.sentiment = new Sentiment();
    this.initializeScoringCriteria();
  }

  /**
   * Initialize comprehensive scoring criteria for music industry automation
   */
  private initializeScoringCriteria(): void {
    this.scoringCriteria = {
      automationKeywords: {
        core: [
          { keyword: 'automation', weight: 0.25, context: ['marketing', 'workflow', 'process'] },
          {
            keyword: 'playlist pitching',
            weight: 0.3,
            context: ['curator', 'submission', 'spotify'],
          },
          { keyword: 'contact research', weight: 0.25, context: ['outreach', 'database', 'CRM'] },
          {
            keyword: 'data analytics',
            weight: 0.2,
            context: ['streaming', 'performance', 'insights'],
          },
          { keyword: 'AI', weight: 0.2, context: ['music', 'recommendation', 'curation'] },
          { keyword: 'algorithm', weight: 0.2, context: ['spotify', 'discovery', 'playlist'] },
          {
            keyword: 'campaign management',
            weight: 0.2,
            context: ['promotion', 'tracking', 'ROI'],
          },
        ],
        secondary: [
          { keyword: 'workflow', weight: 0.15, context: ['efficiency', 'process', 'system'] },
          { keyword: 'database', weight: 0.15, context: ['contact', 'curator', 'venue'] },
          { keyword: 'CRM', weight: 0.15, context: ['artist', 'label', 'management'] },
          { keyword: 'API', weight: 0.1, context: ['integration', 'platform', 'data'] },
          { keyword: 'dashboard', weight: 0.1, context: ['analytics', 'reporting', 'metrics'] },
          { keyword: 'integration', weight: 0.1, context: ['platform', 'tool', 'workflow'] },
        ],
        negative: ['manual', 'traditional', 'old-fashioned', 'slow', 'outdated'],
      },

      industryKeywords: {
        platforms: [
          { keyword: 'spotify', weight: 0.25, platforms: ['streaming', 'playlist'] },
          { keyword: 'apple music', weight: 0.2, platforms: ['streaming', 'discovery'] },
          { keyword: 'youtube music', weight: 0.15, platforms: ['streaming', 'video'] },
          { keyword: 'tiktok', weight: 0.2, platforms: ['social', 'viral'] },
          { keyword: 'instagram', weight: 0.15, platforms: ['social', 'visual'] },
          { keyword: 'soundcloud', weight: 0.1, platforms: ['streaming', 'independent'] },
          { keyword: 'bandcamp', weight: 0.1, platforms: ['direct-sales', 'independent'] },
        ],
        businessTypes: [
          { keyword: 'independent artist', weight: 0.3, audience: ['artists', 'diy'] },
          { keyword: 'indie artist', weight: 0.3, audience: ['artists', 'diy'] },
          { keyword: 'self-release', weight: 0.25, audience: ['artists', 'independent'] },
          { keyword: 'music marketing', weight: 0.2, audience: ['artists', 'agencies', 'labels'] },
          { keyword: 'playlist curator', weight: 0.25, audience: ['curators', 'gatekeepers'] },
          { keyword: 'PR agency', weight: 0.2, audience: ['agencies', 'b2b'] },
          { keyword: 'record label', weight: 0.15, audience: ['labels', 'b2b'] },
        ],
        techTrends: [
          { keyword: 'machine learning', weight: 0.15, category: 'technology' },
          { keyword: 'artificial intelligence', weight: 0.15, category: 'technology' },
          { keyword: 'blockchain', weight: 0.1, category: 'technology' },
          { keyword: 'NFT', weight: 0.1, category: 'technology' },
          { keyword: 'streaming analytics', weight: 0.2, category: 'data' },
          { keyword: 'recommendation engine', weight: 0.15, category: 'algorithms' },
        ],
        marketingConcepts: [
          {
            keyword: 'discovery',
            weight: 0.2,
            application: ['playlist', 'algorithm', 'recommendation'],
          },
          { keyword: 'engagement', weight: 0.15, application: ['social', 'fan', 'community'] },
          { keyword: 'reach', weight: 0.15, application: ['audience', 'growth', 'promotion'] },
          { keyword: 'conversion', weight: 0.15, application: ['sales', 'streaming', 'fanbase'] },
          {
            keyword: 'targeting',
            weight: 0.15,
            application: ['audience', 'advertising', 'campaigns'],
          },
          { keyword: 'attribution', weight: 0.1, application: ['analytics', 'tracking', 'ROI'] },
        ],
      },

      urgencyIndicators: [
        {
          pattern: '(breaking|announced today|just launched)',
          urgencyLevel: 'immediate',
          timeWindow: 120,
          multiplier: 1.5,
        },
        {
          pattern: '(new feature|beta|rolling out)',
          urgencyLevel: 'same-day',
          timeWindow: 480,
          multiplier: 1.3,
        },
        {
          pattern: '(coming soon|planned|will launch)',
          urgencyLevel: 'weekly',
          timeWindow: 2880,
          multiplier: 1.1,
        },
        {
          pattern: '(partnership|acquisition|merger)',
          urgencyLevel: 'same-day',
          timeWindow: 720,
          multiplier: 1.4,
        },
        {
          pattern: '(policy change|update|algorithm)',
          urgencyLevel: 'immediate',
          timeWindow: 180,
          multiplier: 1.6,
        },
        {
          pattern: '(study shows|research reveals|data suggests)',
          urgencyLevel: 'weekly',
          timeWindow: 1440,
          multiplier: 1.2,
        },
      ],

      competitiveAdvantageSignals: [
        {
          pattern: '(first|pioneer|early|exclusive)',
          advantageType: 'first-mover',
          weight: 0.2,
          description: 'First-mover advantage opportunity',
        },
        {
          pattern: '(complex|technical|advanced|sophisticated)',
          advantageType: 'expertise',
          weight: 0.15,
          description: 'Technical expertise positioning',
        },
        {
          pattern: '(challenge|problem|pain point|struggle)',
          advantageType: 'positioning',
          weight: 0.2,
          description: 'Problem-solution positioning',
        },
        {
          pattern: '(tool|platform|software|service)',
          advantageType: 'tools',
          weight: 0.25,
          description: 'Tool/service positioning opportunity',
        },
      ],

      audienceRelevance: {
        primaryAudience: [
          'independent artists',
          'indie musicians',
          'self-releasing artists',
          'DIY artists',
        ],
        secondaryAudience: [
          'music marketers',
          'PR agencies',
          'playlist curators',
          'music tech companies',
        ],
        painPoints: [
          'playlist pitching',
          'contact research',
          'campaign tracking',
          'data analysis',
          'time management',
          'scaling promotion',
        ],
        interests: [
          'automation',
          'efficiency',
          'growth',
          'discovery',
          'streaming success',
          'fan engagement',
        ],
      },
    };
  }

  /**
   * Score news item for automation relevance and opportunity
   */
  async scoreNewsItem(newsItem: NewsItem): Promise<ScoringResult> {
    const fullText = `${newsItem.title} ${newsItem.content}`.toLowerCase();
    const analysis = nlp(fullText);
    const sentimentScore = this.sentiment.analyze(fullText);

    // Calculate individual scores
    const automationRelevance = this.scoreAutomationRelevance(fullText, analysis);
    const industryImpact = this.scoreIndustryImpact(fullText, analysis);
    const urgencyBoost = this.scoreUrgency(fullText, newsItem.publishedAt);
    const competitiveAdvantage = this.scoreCompetitiveAdvantage(fullText);
    const audienceAlignment = this.scoreAudienceAlignment(fullText);
    const trendingPotential = this.scoreTrendingPotential(fullText, sentimentScore);

    // Calculate weighted total score
    const totalScore = Math.min(
      automationRelevance * 0.3 +
        industryImpact * 0.25 +
        urgencyBoost * 0.15 +
        competitiveAdvantage * 0.15 +
        audienceAlignment * 0.1 +
        trendingPotential * 0.05,
      1.0
    );

    // Generate insights and recommendations
    const strengths = this.identifyStrengths(fullText);
    const opportunities = this.identifyOpportunities(fullText);
    const contentAngles = this.generateContentAngles(newsItem, fullText);
    const platformRecommendations = this.recommendPlatforms(fullText);
    const audioIntelAngle = this.identifyAudioIntelAngle(fullText);

    return {
      totalScore,
      breakdown: {
        automationRelevance,
        industryImpact,
        urgencyBoost,
        competitiveAdvantage,
        audienceAlignment,
        trendingPotential,
      },
      strengths,
      opportunities,
      contentAngles,
      platformRecommendations,
      audioIntelAngle,
    };
  }

  /**
   * Score automation relevance
   */
  private scoreAutomationRelevance(text: string, analysis: any): number {
    let score = 0;

    // Core automation keywords
    this.scoringCriteria.automationKeywords.core.forEach(item => {
      if (text.includes(item.keyword)) {
        score += item.weight;

        // Context bonus
        if (item.context && item.context.some(context => text.includes(context))) {
          score += item.weight * 0.5;
        }
      }
    });

    // Secondary automation keywords
    this.scoringCriteria.automationKeywords.secondary.forEach(item => {
      if (text.includes(item.keyword)) {
        score += item.weight;
      }
    });

    // Negative keywords penalty
    this.scoringCriteria.automationKeywords.negative.forEach(negative => {
      if (text.includes(negative)) {
        score -= 0.1;
      }
    });

    // Music-specific automation patterns
    if (text.includes('playlist') && text.includes('submission')) score += 0.15;
    if (text.includes('contact') && text.includes('database')) score += 0.15;
    if (text.includes('campaign') && text.includes('tracking')) score += 0.1;
    if (text.includes('streaming') && text.includes('analytics')) score += 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Score industry impact
   */
  private scoreIndustryImpact(text: string, analysis: any): number {
    let score = 0;

    // Platform keywords
    this.scoringCriteria.industryKeywords.platforms.forEach(item => {
      if (text.includes(item.keyword)) {
        score += item.weight;
      }
    });

    // Business type keywords
    this.scoringCriteria.industryKeywords.businessTypes.forEach(item => {
      if (text.includes(item.keyword)) {
        score += item.weight;
      }
    });

    // Tech trend keywords
    this.scoringCriteria.industryKeywords.techTrends.forEach(item => {
      if (text.includes(item.keyword)) {
        score += item.weight;
      }
    });

    // Marketing concept keywords
    this.scoringCriteria.industryKeywords.marketingConcepts.forEach(item => {
      if (text.includes(item.keyword)) {
        score += item.weight;
      }
    });

    return Math.min(score, 1.0);
  }

  /**
   * Score urgency and timing opportunity
   */
  private scoreUrgency(text: string, publishedAt: Date): number {
    let score = 0;
    let maxMultiplier = 1.0;

    this.scoringCriteria.urgencyIndicators.forEach(indicator => {
      const regex = new RegExp(indicator.pattern, 'i');
      if (regex.test(text)) {
        score += 0.2;
        maxMultiplier = Math.max(maxMultiplier, indicator.multiplier);
      }
    });

    // Time decay factor
    const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
    const timeFactor = Math.max(0.1, 1 - hoursOld / 24); // Decay over 24 hours

    return Math.min(score * maxMultiplier * timeFactor, 1.0);
  }

  /**
   * Score competitive advantage opportunities
   */
  private scoreCompetitiveAdvantage(text: string): number {
    let score = 0;

    this.scoringCriteria.competitiveAdvantageSignals.forEach(signal => {
      const regex = new RegExp(signal.pattern, 'i');
      if (regex.test(text)) {
        score += signal.weight;
      }
    });

    // Additional competitive advantage patterns
    if (text.includes('gap in the market')) score += 0.15;
    if (text.includes('underserved') || text.includes('overlooked')) score += 0.1;
    if (text.includes('inefficient') || text.includes('slow process')) score += 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Score audience alignment
   */
  private scoreAudienceAlignment(text: string): number {
    let score = 0;

    // Primary audience matches
    this.scoringCriteria.audienceRelevance.primaryAudience.forEach(audience => {
      if (text.includes(audience)) {
        score += 0.2;
      }
    });

    // Secondary audience matches
    this.scoringCriteria.audienceRelevance.secondaryAudience.forEach(audience => {
      if (text.includes(audience)) {
        score += 0.1;
      }
    });

    // Pain point alignment
    this.scoringCriteria.audienceRelevance.painPoints.forEach(painPoint => {
      if (text.includes(painPoint)) {
        score += 0.15;
      }
    });

    // Interest alignment
    this.scoringCriteria.audienceRelevance.interests.forEach(interest => {
      if (text.includes(interest)) {
        score += 0.1;
      }
    });

    return Math.min(score, 1.0);
  }

  /**
   * Score trending potential
   */
  private scoreTrendingPotential(text: string, sentimentScore: any): number {
    let score = 0;

    // Emotional triggers
    if (sentimentScore.score > 2) score += 0.3; // Very positive
    if (sentimentScore.score < -2) score += 0.2; // Very negative (controversial)

    // Viral indicators
    if (text.includes('shocking') || text.includes('surprising')) score += 0.2;
    if (text.includes('game-changing') || text.includes('revolutionary')) score += 0.15;
    if (text.includes('controversy') || text.includes('debate')) score += 0.1;

    // Industry shakeup indicators
    if (text.includes('disruption') || text.includes('changes everything')) score += 0.15;

    return Math.min(score, 1.0);
  }

  /**
   * Identify content strengths
   */
  private identifyStrengths(text: string): string[] {
    const strengths = [];

    if (text.includes('data') || text.includes('analytics')) {
      strengths.push('Data-driven angle available');
    }

    if (text.includes('automation') || text.includes('AI')) {
      strengths.push('Direct automation relevance');
    }

    if (text.includes('independent') || text.includes('indie')) {
      strengths.push('Perfect target audience alignment');
    }

    if (text.includes('playlist') || text.includes('curator')) {
      strengths.push('Core Audio Intel use case');
    }

    if (text.includes('efficiency') || text.includes('time-saving')) {
      strengths.push('Clear value proposition');
    }

    return strengths;
  }

  /**
   * Identify content opportunities
   */
  private identifyOpportunities(text: string): string[] {
    const opportunities = [];

    if (text.includes('challenge') || text.includes('problem')) {
      opportunities.push('Problem/solution positioning');
    }

    if (text.includes('new') || text.includes('launch')) {
      opportunities.push('First-mover advantage');
    }

    if (text.includes('complicated') || text.includes('complex')) {
      opportunities.push('Simplification angle');
    }

    if (text.includes('expensive') || text.includes('costly')) {
      opportunities.push('Cost-effectiveness positioning');
    }

    if (text.includes('manual') || text.includes('time-consuming')) {
      opportunities.push('Automation efficiency angle');
    }

    return opportunities;
  }

  /**
   * Generate content angles
   */
  private generateContentAngles(newsItem: NewsItem, text: string): string[] {
    const angles = [];
    const title = newsItem.title;

    // React to news
    angles.push(`"${title}" - Here's what this really means for indie artists`);

    // Authority positioning
    angles.push(
      `Why ${title.split(' ').slice(0, 4).join(' ')} changes everything for music marketing`
    );

    // Automation angle
    if (text.includes('automation') || text.includes('AI')) {
      angles.push(`How to automate your response to ${title.split(' ').slice(0, 3).join(' ')}`);
    }

    // Practical guide
    angles.push(`The smart artist's guide to ${title.split(' ').slice(0, 4).join(' ')}`);

    // Prediction/trend
    angles.push(`${title} is just the beginning - here's what's coming next`);

    return angles;
  }

  /**
   * Recommend platforms
   */
  private recommendPlatforms(text: string): string[] {
    const platforms = [];

    // Always include Twitter for immediate response
    platforms.push('twitter');

    // LinkedIn for professional/business angle
    if (text.includes('business') || text.includes('industry') || text.includes('professional')) {
      platforms.push('linkedin');
    }

    // Instagram for visual/lifestyle content
    if (text.includes('artist') || text.includes('creative') || text.includes('visual')) {
      platforms.push('instagram');
    }

    // Newsletter for detailed analysis
    if (text.includes('complex') || text.includes('data') || text.includes('analysis')) {
      platforms.push('newsletter');
    }

    return platforms;
  }

  /**
   * Identify Audio Intel positioning angle
   */
  private identifyAudioIntelAngle(text: string): string | null {
    if (text.includes('playlist') && text.includes('curator')) {
      return 'Audio Intel helps artists find and connect with these curators automatically';
    }

    if (text.includes('contact') && (text.includes('research') || text.includes('database'))) {
      return 'This is exactly the type of contact research Audio Intel automates';
    }

    if (text.includes('campaign') && text.includes('tracking')) {
      return 'Audio Intel provides automated campaign tracking for this exact scenario';
    }

    if (text.includes('data') && text.includes('analytics')) {
      return 'Audio Intel turns this data into actionable contact intelligence';
    }

    if (text.includes('automation') || text.includes('efficiency')) {
      return 'Audio Intel embodies this automation approach for music marketing';
    }

    return null;
  }

  /**
   * Public API methods
   */
  public async batchScoreNews(
    newsItems: NewsItem[]
  ): Promise<Array<NewsItem & { scoringResult: ScoringResult }>> {
    const results = [];

    for (const newsItem of newsItems) {
      const scoringResult = await this.scoreNewsItem(newsItem);
      results.push({
        ...newsItem,
        scoringResult,
      });
    }

    return results.sort((a, b) => b.scoringResult.totalScore - a.scoringResult.totalScore);
  }

  public updateScoringCriteria(newCriteria: Partial<ScoringCriteria>): void {
    this.scoringCriteria = {
      ...this.scoringCriteria,
      ...newCriteria,
    };
  }

  public getScoringCriteria(): ScoringCriteria {
    return { ...this.scoringCriteria };
  }
}

export default RelevanceScoringEngine;
export type {
  ScoringCriteria,
  ScoringResult,
  AutomationKeywordSet,
  IndustryKeywordSet,
  UrgencyIndicator,
  CompetitiveSignal,
  AudienceRelevanceSet,
};
