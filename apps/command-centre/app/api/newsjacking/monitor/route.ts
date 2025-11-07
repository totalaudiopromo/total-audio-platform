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

// Your specific music industry sources and business/marketing podcasts
const MUSIC_INDUSTRY_SOURCES: NewsSource[] = [
  // Music Industry Core Sources
  {
    name: 'Music Business Worldwide',
    url: 'https://www.musicbusinessworldwide.com/feed/',
    category: 'music-business',
    priority: 1,
    keywords: [
      'independent',
      'streaming',
      'royalties',
      'distribution',
      'playlist',
      'AI',
      'technology',
      'contacts',
      'database',
    ],
  },
  {
    name: 'Digital Music News',
    url: 'https://www.digitalmusicnews.com/feed/',
    category: 'music-tech',
    priority: 1,
    keywords: [
      'startup',
      'funding',
      'platform',
      'streaming',
      'technology',
      'innovation',
      'AI',
      'promotion',
      'contact',
    ],
  },
  {
    name: 'Music Tectonics Podcast',
    url: 'https://feeds.captivate.fm/music-tectonics/',
    category: 'podcast',
    priority: 1,
    keywords: [
      'music technology',
      'innovation',
      'streaming',
      'AI',
      'startup',
      'platform',
      'contact intelligence',
      'data',
    ],
  },

  // Business & Marketing Strategy Sources
  {
    name: 'My First Million Podcast',
    url: 'https://feeds.megaphone.fm/my-first-million',
    category: 'podcast',
    priority: 1,
    keywords: [
      'startup',
      'business model',
      'marketing',
      'growth',
      'SaaS',
      'database',
      'tools',
      'platform',
    ],
  },
  {
    name: 'Marketing Against the Grain',
    url: 'https://feeds.transistor.fm/marketing-against-the-grain',
    category: 'podcast',
    priority: 1,
    keywords: [
      'marketing',
      'growth',
      'content',
      'social media',
      'strategy',
      'audience',
      'engagement',
      'database',
    ],
  },
  {
    name: 'Greg Isenberg - Late Checkout',
    url: 'https://anchor.fm/s/1e5b9f90/podcast/rss',
    category: 'podcast',
    priority: 1,
    keywords: ['community', 'business', 'startup', 'creator economy', 'platform', 'tools', 'SaaS'],
  },
  {
    name: 'The Startup Ideas Podcast',
    url: 'https://feeds.transistor.fm/startup-ideas-podcast',
    category: 'podcast',
    priority: 1,
    keywords: [
      'startup',
      'idea',
      'business model',
      'SaaS',
      'tools',
      'platform',
      'market opportunity',
    ],
  },

  // Music Industry Specific
  {
    name: 'Ari Herstand Blog',
    url: 'https://aristake.com/feed/',
    category: 'music-business',
    priority: 1,
    keywords: [
      'independent',
      'DIY',
      'promotion',
      'marketing',
      'streaming',
      'royalties',
      'contact',
      'submission',
    ],
  },
  {
    name: 'Complete Music Update',
    url: 'https://completemusicupdate.com/feed/',
    category: 'music-business',
    priority: 2,
    keywords: ['legal', 'licensing', 'royalties', 'independent', 'industry', 'contact', 'database'],
  },
  {
    name: 'Music Ally',
    url: 'https://musically.com/feed/',
    category: 'music-tech',
    priority: 2,
    keywords: [
      'social media',
      'TikTok',
      'streaming',
      'technology',
      'platforms',
      'AI',
      'contact',
      'curator',
    ],
  },

  // Additional Quality Sources
  {
    name: 'Music Tech',
    url: 'https://www.music-tech.com/feed/',
    category: 'music-tech',
    priority: 2,
    keywords: ['AI', 'software', 'DAW', 'VST', 'production', 'technology', 'tools', 'platform'],
  },
  {
    name: 'Tape Notes Podcast',
    url: 'https://feeds.acast.com/public/shows/tape-notes',
    category: 'podcast',
    priority: 2,
    keywords: [
      'music production',
      'artist',
      'recording',
      'songwriting',
      'creative process',
      'industry',
    ],
  },
];

const parser = new Parser({
  customFields: {
    item: ['description', 'content:encoded'],
  },
});

// Calculate relevance score based on keywords and Total Audio business relevance
function calculateRelevanceScore(item: any, source: NewsSource): number {
  const title = item.title?.toLowerCase() || '';
  const description = item.description?.toLowerCase() || '';
  const content = `${title} ${description}`;

  let score = 0;

  // Base score from source priority
  score += (5 - source.priority) * 0.1; // Higher priority sources get higher base score

  // Source keyword matching
  const keywordMatches = source.keywords.filter(keyword =>
    content.includes(keyword.toLowerCase())
  ).length;
  score += keywordMatches * 0.1;

  // DIRECT Audio Intel business keywords (highest priority)
  const directBusinessKeywords = [
    'contact database',
    'playlist curator',
    'music submission',
    'email list',
    'contact enrichment',
    'industry contacts',
    'music contacts',
    'curator contact',
    'label contact',
    'radio contact',
  ];
  const directMatches = directBusinessKeywords.filter(keyword =>
    content.includes(keyword.toLowerCase())
  ).length;
  score += directMatches * 0.4; // Very high weight for direct business relevance

  // Core Audio Intel keywords
  const audioIntelKeywords = [
    'contact',
    'database',
    'list',
    'email',
    'promotion',
    'submit',
    'submission',
    'playlist',
    'curator',
    'gatekeepers',
    'industry professionals',
    'music business',
    'networking',
  ];
  const audioIntelMatches = audioIntelKeywords.filter(keyword =>
    content.includes(keyword.toLowerCase())
  ).length;
  score += audioIntelMatches * 0.15;

  // Music industry disruption keywords (opportunity keywords)
  const disruptionKeywords = [
    'platform launch',
    'new service',
    'industry change',
    'disruption',
    'streaming platform',
    'radio changes',
    'playlist changes',
    'algorithm update',
    'new gatekeepers',
    'industry shift',
  ];
  const disruptionMatches = disruptionKeywords.filter(keyword =>
    content.includes(keyword.toLowerCase())
  ).length;
  score += disruptionMatches * 0.2;

  // SaaS/Business opportunity keywords
  const saasKeywords = [
    'SaaS',
    'database business',
    'B2B tool',
    'industry tool',
    'music tech startup',
    'contact management',
    'CRM',
    'lead generation',
    'business intelligence',
  ];
  const saasMatches = saasKeywords.filter(keyword =>
    content.includes(keyword.toLowerCase())
  ).length;
  score += saasMatches * 0.15;

  // Independent artist focus (our target market)
  const indieKeywords = [
    'independent artist',
    'indie music',
    'unsigned',
    'self-released',
    'DIY music',
    'bedroom producer',
  ];
  const indieMatches = indieKeywords.filter(keyword =>
    content.includes(keyword.toLowerCase())
  ).length;
  score += indieMatches * 0.1;

  // Recency bonus (newer = higher score)
  const publishedAt = new Date(item.pubDate || item.isoDate);
  const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (hoursOld < 1)
    score += 0.25; // Very recent
  else if (hoursOld < 6)
    score += 0.15; // Recent
  else if (hoursOld < 24) score += 0.1; // Today

  // Trending/viral indicators
  if (
    content.includes('breaking') ||
    content.includes('announced') ||
    content.includes('launches')
  ) {
    score += 0.05;
  }

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

// Generate targeted Audio Intel business angle
function generateAudioIntelAngle(title: string, description: string): string {
  const content = `${title} ${description}`.toLowerCase();

  // Direct contact/database opportunities
  if (content.includes('contact database') || content.includes('music contacts')) {
    return 'This validates the Audio Intel approach - contact intelligence is everything';
  }
  if (content.includes('playlist') && content.includes('curator')) {
    return 'New curators emerging = fresh contacts to add to your Audio Intel database';
  }
  if (content.includes('radio') && (content.includes('change') || content.includes('new'))) {
    return 'Radio industry shifting = new gatekeepers need identifying and contacting';
  }

  // Platform/service disruptions
  if (content.includes('streaming platform') || content.includes('new platform')) {
    return 'Platform launch alert: Audio Intel users spot new submission opportunities first';
  }
  if (content.includes('algorithm') && content.includes('update')) {
    return 'Algorithm changes = new contact strategies needed. Audio Intel adapts fastest';
  }
  if (content.includes('submission') && content.includes('process')) {
    return 'Submission processes changing - Audio Intel data keeps you ahead of the curve';
  }

  // Business model/SaaS opportunities
  if (content.includes('saas') || content.includes('b2b tool') || content.includes('startup')) {
    return 'Market validation: Contact intelligence tools are the future of music promotion';
  }
  if (content.includes('crm') || content.includes('database business')) {
    return 'More proof that contact management is critical for music business success';
  }

  // Independent artist focus
  if (content.includes('independent') && content.includes('advantage')) {
    return 'The unsigned advantage strikes again - nimble indies with Audio Intel win';
  }
  if (content.includes('diy') || content.includes('bedroom producer')) {
    return 'DIY musicians finally have professional-grade contact intelligence';
  }

  // Industry disruption angles
  if (content.includes('disruption') || content.includes('industry change')) {
    return 'Industry disruption = new opportunities for Audio Intel-powered indies';
  }
  if (content.includes('gatekeepers') || content.includes('industry professionals')) {
    return 'Traditional gatekeepers being disrupted - Audio Intel finds the new ones';
  }
  if (content.includes('networking') || content.includes('connections')) {
    return 'Networking is evolving - Audio Intel gives you the unfair advantage';
  }

  // Marketing/growth angles
  if (content.includes('marketing') && content.includes('growth')) {
    return 'Growth hack confirmed: Contact intelligence beats mass marketing every time';
  }
  if (content.includes('audience') && content.includes('engagement')) {
    return 'Engaged audiences start with the right industry contacts - Audio Intel delivers both';
  }

  // Default angles based on content type
  if (content.includes('funding') || content.includes('investment')) {
    return 'Investment flowing into music tech - Audio Intel positioned perfectly';
  }
  if (content.includes('ai') || content.includes('artificial intelligence')) {
    return 'AI changing music industry - Audio Intel uses AI to find human connections';
  }

  return 'Industry evolution creating new contact opportunities for Audio Intel users';
}

export async function GET() {
  try {
    console.log('Starting newsjacking opportunity scan...');

    const opportunities: NewsOpportunity[] = [];

    // Monitor each RSS source
    for (const source of MUSIC_INDUSTRY_SOURCES) {
      try {
        console.log(`Scanning ${source.name}...`);

        const feed = await parser.parseURL(source.url);

        for (const item of feed.items.slice(0, 10)) {
          // Latest 10 items per source
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
            audioIntelAngle: generateAudioIntelAngle(
              item.title || '',
              item.contentSnippet || item.description || ''
            ),
          };

          opportunities.push(opportunity);
        }

        console.log(`${source.name}: Found ${opportunities.length} opportunities`);
      } catch (error) {
        console.error(`Error scanning ${source.name}:`, error);
      }
    }

    // Sort by relevance score (highest first)
    opportunities.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Take top 20 opportunities
    const topOpportunities = opportunities.slice(0, 20);

    console.log(`Found ${topOpportunities.length} total opportunities`);
    console.log(
      `Immediate: ${topOpportunities.filter(o => o.urgencyLevel === 'immediate').length}`
    );
    console.log(`High: ${topOpportunities.filter(o => o.urgencyLevel === 'high').length}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      opportunities: topOpportunities,
      summary: {
        total: topOpportunities.length,
        immediate: topOpportunities.filter(o => o.urgencyLevel === 'immediate').length,
        high: topOpportunities.filter(o => o.urgencyLevel === 'high').length,
        medium: topOpportunities.filter(o => o.urgencyLevel === 'medium').length,
        sources: MUSIC_INDUSTRY_SOURCES.map(s => s.name),
      },
    });
  } catch (error) {
    console.error('Newsjacking monitor error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scan news sources',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
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
        opportunityId,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unknown action',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Newsjacking action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process action',
      },
      { status: 500 }
    );
  }
}
