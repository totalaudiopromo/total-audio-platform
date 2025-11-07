// Underground Music Newsjacker
// Fetches content from curated underground music sources and generates newsletter content

import {
  UndergroundContentFetcher,
  UndergroundArticle,
  ContentFetchResult,
} from './undergroundContentFetcher';
import { UNDERGROUND_MUSIC_SOURCES, getHighQualitySources } from './undergroundMusicSources';

export interface UndergroundNewsjackerResult {
  success: boolean;
  articles: UndergroundArticle[];
  content: {
    industryInsight: string;
    quickTip: string;
    communityQuestion: string;
    featuredArticles: UndergroundArticle[];
  } | null;
  sources: string[];
  totalFound: number;
  error?: string;
}

export class UndergroundNewsjacker {
  private contentFetcher: UndergroundContentFetcher;
  private anthropicApiKey: string;

  constructor(anthropicApiKey: string) {
    this.anthropicApiKey = anthropicApiKey;
    this.contentFetcher = new UndergroundContentFetcher(getHighQualitySources());
  }

  // Main method to fetch content and generate newsletter content
  async generateNewsletterContent(): Promise<UndergroundNewsjackerResult> {
    try {
      console.log('🎵 Starting Underground Music Newsjacker...');

      // Fetch content from underground sources
      const fetchResult = await this.contentFetcher.fetchAllContent();

      if (fetchResult.articles.length === 0) {
        return {
          success: true,
          articles: [],
          content: null,
          sources: [],
          totalFound: 0,
          error: 'No underground music content found today',
        };
      }

      console.log(
        `Found ${fetchResult.articles.length} articles from ${fetchResult.sources.length} sources`
      );

      // Generate AI content based on the articles
      const aiContent = await this.generateAIContent(fetchResult.articles);

      return {
        success: true,
        articles: fetchResult.articles.slice(0, 10), // Top 10 articles
        content: aiContent,
        sources: fetchResult.sources,
        totalFound: fetchResult.totalFound,
      };
    } catch (error) {
      console.error('Error in Underground Newsjacker:', error);
      return {
        success: false,
        articles: [],
        content: null,
        sources: [],
        totalFound: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Generate AI content using Anthropic Claude
  private async generateAIContent(articles: UndergroundArticle[]): Promise<{
    industryInsight: string;
    quickTip: string;
    communityQuestion: string;
    featuredArticles: UndergroundArticle[];
  }> {
    try {
      const prompt = this.createUndergroundAnalysisPrompt(articles);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const content = JSON.parse(data.content[0].text);

      return {
        industryInsight: content.industryInsight || this.getFallbackInsight(),
        quickTip: content.quickTip || this.getFallbackTip(),
        communityQuestion: content.communityQuestion || this.getFallbackQuestion(),
        featuredArticles: articles.slice(0, 3), // Top 3 articles
      };
    } catch (error) {
      console.error('Error generating AI content:', error);
      return {
        industryInsight: this.getFallbackInsight(),
        quickTip: this.getFallbackTip(),
        communityQuestion: this.getFallbackQuestion(),
        featuredArticles: articles.slice(0, 3),
      };
    }
  }

  // Create analysis prompt for underground music content
  private createUndergroundAnalysisPrompt(articles: UndergroundArticle[]): string {
    const articleSummaries = articles
      .slice(0, 8)
      .map(
        (article, index) =>
          `${index + 1}. **${article.title}** (${article.source})\n   ${
            article.excerpt
          }\n   Tags: ${article.tags.join(', ')}`
      )
      .join('\n\n');

    return `You are Chris Schofield, founder of Total Audio Promo and producer behind sadact. You're a UK music industry insider who specializes in helping independent artists with practical, no-BS advice.

**MY NICHE:**
Music industry automation, independent artist promotion, UK music scene, AI-powered music tools, radio promotion, contact intelligence

**MY UNIQUE POSITIONING:**
- UK music industry insider (critical of expensive US tools, bullish on affordable alternatives)
- Independent producer building tools for fellow artists
- AI pragmatist (hates hype, loves practical applications that actually help indie artists)
- Radio promotion expert (5+ years experience)
- Direct, no-BS communication style
- Focus on £50 budgets, not £50,000 campaigns
- AI advocate who shows how technology empowers independent artists, not replaces them

---

**UNDERGROUND MUSIC CONTENT:**
${articleSummaries}

## 🎯 ANALYSIS TASK

Based on these underground music articles, provide insights that would be valuable for independent artists and producers. Focus on:

1. **Industry Insight** (2-3 sentences): What do these articles reveal about the current state of independent music? What opportunities or challenges do they highlight? If there's AI content, focus on how it empowers indie artists rather than replacing them.

2. **Quick Tip** (1-2 sentences): Practical advice artists can implement immediately based on the trends or techniques mentioned in these articles. If AI is mentioned, show how it makes marketing easier, not more complex.

3. **Community Question** (1 sentence): An engaging question that encourages newsletter readers to respond and share their experiences.

**IMPORTANT:**
- Keep it conversational and authentic to your voice
- Focus on practical, actionable insights
- Reference specific trends or techniques from the articles
- Make it relevant to independent artists with limited budgets
- Use UK spelling and terminology
- When discussing AI, emphasize empowerment and practical benefits, not hype
- Show how technology levels the playing field for indie artists
- Avoid overwhelming technical jargon - keep it accessible

Format as JSON:
{
  "industryInsight": "Your insight here",
  "quickTip": "Your tip here", 
  "communityQuestion": "Your question here"
}`;
  }

  // Fallback content if AI generation fails
  private getFallbackInsight(): string {
    const insights = [
      'The underground music scene is constantly evolving, and independent artists who stay connected to these communities have a massive advantage. The best opportunities often come from unexpected places.',
      "What I'm seeing across the underground music sources is a real shift towards DIY culture and self-sufficiency. Artists are taking control of their own promotion and building direct relationships with fans.",
      'The underground music community is buzzing with innovation right now. Independent artists are experimenting with new techniques and approaches that major labels are too slow to adopt.',
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private getFallbackTip(): string {
    const tips = [
      'Spend 30 minutes each week exploring underground music blogs and forums. The best production techniques and promotion strategies often come from these communities first.',
      "Follow the artists and producers you admire on social media, but also dig deeper into their influences and the communities they're part of.",
      "Don't just consume content - engage with it. Comment on articles, share your own experiences, and build relationships with other artists in these communities.",
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  private getFallbackQuestion(): string {
    const questions = [
      'What underground music source has given you the most valuable insight for your music career?',
      'Which production technique or promotion strategy have you discovered from the underground music community?',
      "What's the best piece of advice you've received from another independent artist or producer?",
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  // Get sources by category
  getSourcesByCategory(category: string) {
    return this.contentFetcher.getSourcesByCategory(category);
  }

  // Get high-quality sources
  getHighQualitySources() {
    return this.contentFetcher.getHighQualitySources();
  }
}

// Lazy singleton instance to avoid build-time errors
let _instance: UndergroundNewsjacker | null = null;
export function getUndergroundNewsjacker() {
  if (!_instance) {
    _instance = new UndergroundNewsjacker(process.env.ANTHROPIC_API_KEY || '');
  }
  return _instance;
}
