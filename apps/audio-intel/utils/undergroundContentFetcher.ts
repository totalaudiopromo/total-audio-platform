// Underground Music Content Fetcher
// Fetches content from curated underground music sources

import { UNDERGROUND_MUSIC_SOURCES, MusicSource, CONTENT_CATEGORIES } from './undergroundMusicSources';

export interface UndergroundArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  relevanceScore: number;
  excerpt: string;
  tags: string[];
}

export interface ContentFetchResult {
  articles: UndergroundArticle[];
  sources: string[];
  totalFound: number;
  categories: string[];
}

export class UndergroundContentFetcher {
  private sources: MusicSource[];

  constructor(sources: MusicSource[] = UNDERGROUND_MUSIC_SOURCES) {
    this.sources = sources;
  }

  // Fetch content from all sources
  async fetchAllContent(): Promise<ContentFetchResult> {
    const allArticles: UndergroundArticle[] = [];
    const usedSources: string[] = [];
    const categories = new Set<string>();

    console.log(`Fetching content from ${this.sources.length} underground music sources...`);

    for (const source of this.sources) {
      try {
        console.log(`Fetching from ${source.name}...`);
        const articles = await this.fetchFromSource(source);
        
        if (articles.length > 0) {
          allArticles.push(...articles);
          usedSources.push(source.name);
          articles.forEach(article => {
            article.tags.forEach(tag => categories.add(tag));
          });
          console.log(`Found ${articles.length} articles from ${source.name}`);
        }
      } catch (error) {
        console.log(`Error fetching from ${source.name}:`, error);
      }
    }

    // Sort by relevance score and recency
    const sortedArticles = allArticles
      .sort((a, b) => {
        // First by relevance score, then by recency
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, 20); // Top 20 articles

    return {
      articles: sortedArticles,
      sources: usedSources,
      totalFound: allArticles.length,
      categories: Array.from(categories)
    };
  }

  // Fetch content from a specific source
  private async fetchFromSource(source: MusicSource): Promise<UndergroundArticle[]> {
    if (!source.rssUrl) {
      console.log(`No RSS feed available for ${source.name}`);
      return [];
    }

    try {
      // Fetch RSS feed
      const response = await fetch(source.rssUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const articles = this.parseRSSFeed(xmlText, source);
      
      return articles;
    } catch (error) {
      console.log(`Error fetching RSS from ${source.name}:`, error);
      return [];
    }
  }

  // Parse RSS feed XML
  private parseRSSFeed(xmlText: string, source: MusicSource): UndergroundArticle[] {
    const articles: UndergroundArticle[] = [];
    
    try {
      // Simple RSS parsing (in production, use a proper XML parser)
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemXml = match[1];
        
        const title = this.extractFromXml(itemXml, 'title');
        const description = this.extractFromXml(itemXml, 'description');
        const link = this.extractFromXml(itemXml, 'link');
        const pubDate = this.extractFromXml(itemXml, 'pubDate');

        if (title && link) {
          const article: UndergroundArticle = {
            title: this.cleanText(title),
            description: this.cleanText(description) || '',
            url: link,
            publishedAt: pubDate || new Date().toISOString(),
            source: source.name,
            category: this.categorizeContent(title, description, source.focus),
            relevanceScore: this.calculateRelevanceScore(title, description, source),
            excerpt: this.generateExcerpt(description || title),
            tags: this.extractTags(title, description, source.focus)
          };

          articles.push(article);
        }
      }
    } catch (error) {
      console.log(`Error parsing RSS from ${source.name}:`, error);
    }

    return articles;
  }

  // Extract text from XML tags
  private extractFromXml(xml: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : null;
  }

  // Clean HTML/text
  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Categorize content based on title, description, and source focus
  private categorizeContent(title: string, description: string, sourceFocus: string[]): string {
    const text = (title + ' ' + description).toLowerCase();
    
    // Check each category
    for (const [category, keywords] of Object.entries(CONTENT_CATEGORIES)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category.toLowerCase();
      }
    }

    // Default based on source focus
    if (sourceFocus.includes('production')) return 'production';
    if (sourceFocus.includes('business')) return 'business';
    if (sourceFocus.includes('culture')) return 'culture';
    if (sourceFocus.includes('technology')) return 'technology';
    
    return 'general';
  }

  // Calculate relevance score for independent artists
  private calculateRelevanceScore(title: string, description: string, sourceFocus: string[]): number {
    const text = (title + ' ' + description).toLowerCase();
    let score = 50; // Base score

    // Boost for independent artist keywords
    const indieKeywords = [
      'independent', 'indie', 'underground', 'producer', 'artist',
      'self-release', 'diy', 'bedroom', 'home studio', 'unsigned',
      'promotion', 'marketing', 'streaming', 'playlist', 'radio'
    ];

    indieKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 10;
      }
    });

    // Boost for production/technical content
    const productionKeywords = [
      'production', 'mixing', 'mastering', 'synthesis', 'sampling',
      'daw', 'plugin', 'tutorial', 'technique', 'workflow'
    ];

    productionKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 8;
      }
    });

    // Boost for business/marketing content
    const businessKeywords = [
      'marketing', 'promotion', 'streaming', 'royalties', 'distribution',
      'playlist', 'radio', 'pr', 'campaign', 'strategy'
    ];

    businessKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 7;
      }
    });

    // Boost for AI empowerment content (not hype)
    const aiEmpowermentKeywords = [
      'ai marketing', 'automation', 'independent artist', 'diy', 'affordable',
      'empower', 'level playing field', 'accessible', 'practical', 'budget'
    ];

    aiEmpowermentKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 12; // Higher boost for empowerment content
      }
    });

    // Boost for UK/European content (your audience)
    const ukKeywords = [
      'uk', 'british', 'london', 'manchester', 'birmingham', 'glasgow',
      'europe', 'european', 'bbc', 'radio 1', 'radio 6'
    ];

    ukKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 5;
      }
    });

    // Cap at 100
    return Math.min(100, score);
  }

  // Generate excerpt from description
  private generateExcerpt(description: string): string {
    if (!description) return '';
    
    const cleaned = this.cleanText(description);
    return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned;
  }

  // Extract relevant tags
  private extractTags(title: string, description: string, sourceFocus: string[]): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const tags = new Set<string>();

    // Add source focus tags
    sourceFocus.forEach(focus => tags.add(focus));

    // Add content-based tags
    const tagKeywords = {
      'electronic': ['electronic', 'edm', 'house', 'techno', 'dubstep', 'drum and bass'],
      'production': ['production', 'mixing', 'mastering', 'synthesis', 'sampling'],
      'business': ['business', 'marketing', 'promotion', 'streaming', 'royalties'],
      'culture': ['culture', 'underground', 'alternative', 'indie', 'scene'],
      'technology': ['technology', 'ai', 'digital', 'software', 'platform']
    };

    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.add(tag);
      }
    });

    return Array.from(tags);
  }

  // Get sources by category
  getSourcesByCategory(category: string): MusicSource[] {
    return this.sources.filter(source => 
      source.focus.includes(category.toLowerCase())
    );
  }

  // Get high-quality sources only
  getHighQualitySources(): MusicSource[] {
    return this.sources.filter(source => source.quality === 'high');
  }
}

// Export convenience function
export async function fetchUndergroundMusicNews(): Promise<NewsArticle[]> {
  const fetcher = new UndergroundContentFetcher();
  const result = await fetcher.fetchAllContent();
  
  // Convert to NewsArticle format
  return result.articles.map(article => ({
    title: article.title,
    description: article.description,
    url: article.url,
    publishedAt: article.publishedAt,
    source: article.source,
    category: article.category,
    relevanceScore: article.relevanceScore,
    excerpt: article.excerpt,
    tags: article.tags
  }));
}

// Export NewsArticle interface for compatibility
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  relevanceScore: number;
  excerpt: string;
  tags: string[];
}

// Export the fetcher instance
export const undergroundContentFetcher = new UndergroundContentFetcher();
