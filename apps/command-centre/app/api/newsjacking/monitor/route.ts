import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { format, isAfter, subMinutes } from 'date-fns';

interface NewsSource {
  name: string;
  url: string;
  category: 'music-business' | 'music-tech' | 'podcast' | 'industry-news';
  priority: number;
  keywords: string[];
}

interface NewsOpportunity {
  id: string;
  source: NewsSource;
  title: string;
  description: string;
  link: string;
  publishedAt: Date;
  relevanceScore: number;
  urgencyLevel: 'immediate' | 'high' | 'medium' | 'low';
  keyPoints: string[];
  audioIntelAngle?: string;
  suggestedContent?: {
    newsletter: string;
    twitter: string[];
    linkedin: string;
  };
}

// Your specific music industry sources
const MUSIC_INDUSTRY_SOURCES: NewsSource[] = [
  {
    name: 'Music Business Worldwide',
    url: 'https://www.musicbusinessworldwide.com/feed/',
    category: 'music-business',
    priority: 1,
    keywords: ['independent', 'streaming', 'royalties', 'distribution', 'playlist', 'AI', 'technology']
  },
  {
    name: 'Digital Music News',
    url: 'https://www.digitalmusicnews.com/feed/',
    category: 'music-tech',
    priority: 1,
    keywords: ['startup', 'funding', 'platform', 'streaming', 'technology', 'innovation', 'AI']
  },
  {
    name: 'Music Tech',
    url: 'https://www.music-tech.com/feed/',
    category: 'music-tech',
    priority: 2,
    keywords: ['AI', 'software', 'DAW', 'VST', 'production', 'technology', 'tools']
  },
  {
    name: 'Music Week',
    url: 'https://www.musicweek.com/rss',
    category: 'industry-news', 
    priority: 2,
    keywords: ['charts', 'radio', 'promotion', 'marketing', 'digital']
  },
  {
    name: 'Hypebot',
    url: 'https://www.hypebot.com/hypebot/index.rdf',
    category: 'music-business',
    priority: 2,
    keywords: ['DIY', 'independent', 'marketing', 'social media', 'promotion']
  },
  {
    name: 'Music Industry Blog',
    url: 'https://www.musicindustryblog.com/feed',
    category: 'music-business',
    priority: 2,
    keywords: ['streaming', 'royalties', 'independent', 'major labels', 'technology']
  },
  {
    name: 'Music Ally',
    url: 'https://musically.com/feed/',
    category: 'music-tech',
    priority: 2,
    keywords: ['social media', 'TikTok', 'streaming', 'technology', 'platforms', 'AI']
  },
  {
    name: 'TechCrunch Music',
    url: 'https://techcrunch.com/category/music/feed/',
    category: 'music-tech',
    priority: 2,
    keywords: ['startup', 'funding', 'AI', 'music tech', 'platform', 'innovation']
  },
  {
    name: 'The Verge Music',
    url: 'https://www.theverge.com/music/rss/index.xml',
    category: 'music-tech',
    priority: 3,
    keywords: ['AI', 'streaming', 'technology', 'platforms', 'innovation']
  },
  {
    name: 'Complete Music Update',
    url: 'https://completemusicupdate.com/feed/',
    category: 'music-business',
    priority: 3,
    keywords: ['legal', 'licensing', 'royalties', 'independent', 'industry']
  }
];

const parser = new Parser({
  customFields: {
    item: ['description', 'content:encoded']
  }
});

// Calculate relevance score based on keywords and recency
function calculateRelevanceScore(item: any, source: NewsSource): number {
  const title = item.title?.toLowerCase() || '';
  const description = item.description?.toLowerCase() || '';
  const content = `${title} ${description}`;
  
  let score = 0;
  
  // Base score from source priority
  score += (5 - source.priority) * 0.1; // Higher priority sources get higher base score
  
  // Keyword matching
  const keywordMatches = source.keywords.filter(keyword => 
    content.includes(keyword.toLowerCase())
  ).length;
  score += keywordMatches * 0.15;
  
  // Audio Intel specific keywords
  const audioIntelKeywords = ['contact', 'database', 'list', 'email', 'promotion', 'submit', 'playlist', 'curator'];
  const audioIntelMatches = audioIntelKeywords.filter(keyword =>
    content.includes(keyword.toLowerCase())
  ).length;
  score += audioIntelMatches * 0.2;
  
  // Recency bonus (newer = higher score)
  const publishedAt = new Date(item.pubDate || item.isoDate);
  const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (hoursOld < 1) score += 0.3; // Very recent
  else if (hoursOld < 6) score += 0.2; // Recent
  else if (hoursOld < 24) score += 0.1; // Today
  
  // Cap at 1.0
  return Math.min(score, 1.0);
}

// Determine urgency level
function calculateUrgency(score: number, publishedAt: Date): NewsOpportunity['urgencyLevel'] {
  const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  
  if (score > 0.8 && hoursOld < 2) return 'immediate';
  if (score > 0.6 && hoursOld < 6) return 'high';
  if (score > 0.4) return 'medium';
  return 'low';
}

// Generate Audio Intel angle
function generateAudioIntelAngle(title: string, description: string): string {
  const content = `${title} ${description}`.toLowerCase();
  
  if (content.includes('playlist') || content.includes('curator')) {
    return "Perfect timing for contact enrichment - artists need curator contacts NOW";
  }
  if (content.includes('streaming') || content.includes('platform')) {
    return "New platform = new submission opportunities. Audio Intel users get there first";
  }
  if (content.includes('radio') || content.includes('station')) {
    return "Radio gatekeepers changing - who are the new contacts to reach?";
  }
  if (content.includes('independent') || content.includes('diy')) {
    return "Indies winning again - but only those with the right contact intelligence";
  }
  if (content.includes('ai') || content.includes('technology')) {
    return "Tech disruption creates new gatekeepers - Audio Intel finds them";
  }
  
  return "Industry shift = new contacts and opportunities for smart indies";
}

export async function GET() {
  try {
    console.log('🔍 Starting newsjacking opportunity scan...');
    
    const opportunities: NewsOpportunity[] = [];
    
    // Monitor each RSS source
    for (const source of MUSIC_INDUSTRY_SOURCES) {
      try {
        console.log(`📡 Scanning ${source.name}...`);
        
        const feed = await parser.parseURL(source.url);
        
        for (const item of feed.items.slice(0, 10)) { // Latest 10 items per source
          const publishedAt = new Date(item.pubDate || item.isoDate || Date.now());
          const relevanceScore = calculateRelevanceScore(item, source);
          
          // Only process items with minimum relevance
          if (relevanceScore < 0.3) continue;
          
          // Skip items older than 24 hours unless very relevant
          if (relevanceScore < 0.7 && isAfter(publishedAt, subMinutes(new Date(), 24 * 60))) {
            continue;
          }
          
          const opportunity: NewsOpportunity = {
            id: `news_${source.name}_${publishedAt.getTime()}`,
            source,
            title: item.title || '',
            description: item.contentSnippet || item.description || '',
            link: item.link || '',
            publishedAt,
            relevanceScore,
            urgencyLevel: calculateUrgency(relevanceScore, publishedAt),
            keyPoints: extractKeyPoints(item.title, item.contentSnippet || item.description),
            audioIntelAngle: generateAudioIntelAngle(item.title || '', item.contentSnippet || item.description || '')
          };
          
          opportunities.push(opportunity);
        }
        
        console.log(`✅ ${source.name}: Found ${opportunities.length} opportunities`);
        
      } catch (error) {
        console.error(`❌ Error scanning ${source.name}:`, error);
      }
    }
    
    // Sort by relevance score (highest first)
    opportunities.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Take top 20 opportunities
    const topOpportunities = opportunities.slice(0, 20);
    
    console.log(`🎯 Found ${topOpportunities.length} total opportunities`);
    console.log(`🚨 Immediate: ${topOpportunities.filter(o => o.urgencyLevel === 'immediate').length}`);
    console.log(`🔥 High: ${topOpportunities.filter(o => o.urgencyLevel === 'high').length}`);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      opportunities: topOpportunities,
      summary: {
        total: topOpportunities.length,
        immediate: topOpportunities.filter(o => o.urgencyLevel === 'immediate').length,
        high: topOpportunities.filter(o => o.urgencyLevel === 'high').length,
        medium: topOpportunities.filter(o => o.urgencyLevel === 'medium').length,
        sources: MUSIC_INDUSTRY_SOURCES.map(s => s.name)
      }
    });
    
  } catch (error) {
    console.error('❌ Newsjacking monitor error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to scan news sources',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Extract key points from news content
function extractKeyPoints(title?: string, description?: string): string[] {
  const content = `${title || ''} ${description || ''}`;
  const points: string[] = [];
  
  // Look for key patterns
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Take first 3 sentences as key points
  sentences.slice(0, 3).forEach(sentence => {
    const cleaned = sentence.trim().replace(/^\W+/, '');
    if (cleaned.length > 10) {
      points.push(cleaned);
    }
  });
  
  return points;
}

export async function POST(request: NextRequest) {
  try {
    const { action, opportunityId } = await request.json();
    
    if (action === 'generate_content') {
      // This would connect to your content generation system
      // For now, return a placeholder
      return NextResponse.json({
        success: true,
        message: 'Content generation requested',
        opportunityId
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Newsjacking action error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process action'
    }, { status: 500 });
  }
}