import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

const PERPLEXITY_API_KEY = getEnv('PERPLEXITY_API_KEY');

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  relevance: 'High' | 'Medium' | 'Low';
  angle: string;
  personalSpin: string;
  newsletterContent: string;
  publishedAt: string;
}

async function searchMusicIndustryNews(): Promise<NewsItem[]> {
  if (!PERPLEXITY_API_KEY) {
    console.log('Perplexity API not configured - using fallback');
    const podcastInsights = await getPodcastInsights();
    return [...getFallbackNews(), ...podcastInsights];
  }

  // Get podcast insights if available
  const podcastInsights = await getPodcastInsights();

  const prompt = `Find the latest music industry news from the past 7 days that would be relevant to independent artists, small labels, and music PR professionals.

Focus on these topics:
- New music industry tools and platforms
- Changes in streaming platforms (Spotify, Apple Music, etc.)
- Radio and playlist promotion updates
- Music marketing and PR trends
- Independent artist success stories
- Industry policy changes affecting indie artists
- New music discovery platforms
- Social media algorithm changes affecting music promotion

For each news item, provide:
1. Title and source
2. Brief summary (2-3 sentences)
3. Why it matters to indie artists
4. A personal angle/opinion that adds value
5. Newsletter-ready content with actionable insights

Format as JSON array with these fields:
- title: string
- summary: string  
- source: string
- url: string
- relevance: 'High' | 'Medium' | 'Low'
- angle: string (why this matters to indie artists)
- personalSpin: string (your take on the news)
- newsletterContent: string (ready-to-use newsletter section)
- publishedAt: string (date)

Return 3-5 high-relevance news items that would make compelling newsletter content.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a music industry expert who creates compelling newsletter content for independent artists and music professionals. Focus on actionable insights and insider perspectives.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from Perplexity');
    }

    // Try to parse JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    let newsItems: NewsItem[] = [];
    
    if (jsonMatch) {
      newsItems = JSON.parse(jsonMatch[0]);
    } else {
      // Fallback to parsing text format
      newsItems = parseTextFormatNews(content);
    }

    // Combine with podcast insights
    const allNewsItems = [...newsItems, ...podcastInsights];
    
    // Remove duplicates based on title similarity
    const uniqueNewsItems = allNewsItems.filter((item, index, self) => 
      index === self.findIndex(other => 
        other.title.substring(0, 50) === item.title.substring(0, 50)
      )
    );

    return uniqueNewsItems;
  } catch (error) {
    console.error('Newsjacker API error:', error);
    return [...getFallbackNews(), ...podcastInsights];
  }
}

function parseTextFormatNews(content: string): NewsItem[] {
  // Parse text format if JSON parsing fails
  const newsItems: NewsItem[] = [];
  const sections = content.split(/\d+\.\s+/).filter(section => section.trim());
  
  sections.forEach((section, index) => {
    if (index === 0) return; // Skip first empty section
    
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length < 3) return;
    
    const title = lines[0].replace(/^\*\*|\*\*$/g, '').trim();
    const summary = lines.find(line => line.includes('Summary:') || line.includes('summary:'))?.replace(/Summary:|summary:/, '').trim() || '';
    const source = lines.find(line => line.includes('Source:') || line.includes('source:'))?.replace(/Source:|source:/, '').trim() || 'Music Industry News';
    
    newsItems.push({
      title,
      summary,
      source,
      url: '#',
      relevance: 'Medium',
      angle: 'Industry update relevant to indie artists',
      personalSpin: 'This development could impact how independent artists approach music promotion.',
      newsletterContent: `**${title}**\n\n${summary}\n\n*Why this matters:* This development could impact how independent artists approach music promotion.`,
      publishedAt: new Date().toISOString()
    });
  });
  
  return newsItems.slice(0, 3);
}

function getFallbackNews(): NewsItem[] {
  return [
    {
      title: "Spotify's New Discovery Features for Independent Artists",
      summary: "Spotify announced new playlist discovery tools that give independent artists better visibility in algorithmic playlists, with a focus on emerging genres and local scenes.",
      source: "Spotify Newsroom",
      url: "https://newsroom.spotify.com",
      relevance: "High",
      angle: "Direct impact on indie artist visibility and playlist placement opportunities",
      personalSpin: "This is huge for indie artists who've been struggling with playlist visibility. The algorithm changes could level the playing field against major label dominance.",
      newsletterContent: `**🎵 Spotify's New Discovery Features for Independent Artists**

Spotify announced new playlist discovery tools that give independent artists better visibility in algorithmic playlists, with a focus on emerging genres and local scenes.

*Why this matters:* This is huge for indie artists who've been struggling with playlist visibility. The algorithm changes could level the playing field against major label dominance.

**Action Item:** Update your Spotify for Artists profile with detailed genre tags and location information to take advantage of these new discovery features.`,
      publishedAt: new Date().toISOString()
    },
    {
      title: "TikTok's Music Promotion Algorithm Update",
      summary: "TikTok rolled out changes to their music promotion algorithm, making it easier for independent artists to get their tracks featured in viral content.",
      source: "TikTok Business",
      url: "https://business.tiktok.com",
      relevance: "High",
      angle: "New opportunities for viral music promotion on TikTok",
      personalSpin: "Finally, TikTok is giving indie artists a fair shot at viral promotion. The new algorithm prioritizes music quality over follower count.",
      newsletterContent: `**📱 TikTok's Music Promotion Algorithm Update**

TikTok rolled out changes to their music promotion algorithm, making it easier for independent artists to get their tracks featured in viral content.

*Why this matters:* Finally, TikTok is giving indie artists a fair shot at viral promotion. The new algorithm prioritizes music quality over follower count.

**Action Item:** Focus on creating high-quality, short-form content that showcases your music's best 15-30 seconds. Quality over quantity is now the key to TikTok success.`,
      publishedAt: new Date().toISOString()
    },
    {
      title: "BBC Introducing Expands Local Artist Support",
      summary: "BBC Introducing announced expanded support for local artists across all regions, with new submission guidelines and increased airplay opportunities for emerging talent.",
      source: "BBC Introducing",
      url: "https://www.bbc.co.uk/introducing",
      relevance: "High",
      angle: "Increased radio promotion opportunities for indie artists",
      personalSpin: "This is exactly what the UK indie scene needed - more support for local talent and clearer pathways to radio airplay.",
      newsletterContent: `**📻 BBC Introducing Expands Local Artist Support**

BBC Introducing announced expanded support for local artists across all regions, with new submission guidelines and increased airplay opportunities for emerging talent.

*Why this matters:* This is exactly what the UK indie scene needed - more support for local talent and clearer pathways to radio airplay.

**Action Item:** Check the new BBC Introducing submission guidelines and prepare your best tracks for regional submission. The expanded support means more opportunities for airplay.`,
      publishedAt: new Date().toISOString()
    }
  ];
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting newsjacker search for newsletter content...');
    
    const newsItems = await searchMusicIndustryNews();
    
    // Filter for high-relevance items
    const highRelevanceNews = newsItems.filter(item => item.relevance === 'High');
    
    console.log(`📰 Found ${newsItems.length} news items, ${highRelevanceNews.length} high-relevance`);
    
    return NextResponse.json({
      success: true,
      message: 'Newsjacker search completed',
      newsItems,
      highRelevanceNews,
      totalFound: newsItems.length,
      highRelevanceCount: highRelevanceNews.length,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Newsjacker error:', error);
    return NextResponse.json({
      error: 'Failed to fetch news',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, maxItems = 5 } = await request.json();
    
    console.log(`🔍 Custom newsjacker search for: "${query}"`);
    
    const newsItems = await searchMusicIndustryNews();
    
    // Filter by query if provided
    const filteredNews = query 
      ? newsItems.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.summary.toLowerCase().includes(query.toLowerCase()) ||
          item.angle.toLowerCase().includes(query.toLowerCase())
        )
      : newsItems;
    
    const limitedNews = filteredNews.slice(0, maxItems);
    
    return NextResponse.json({
      success: true,
      query,
      newsItems: limitedNews,
      totalFound: filteredNews.length,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Custom newsjacker error:', error);
    return NextResponse.json({
      error: 'Failed to search news',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get podcast insights from auto-updating feeds
async function getPodcastInsights(): Promise<NewsItem[]> {
  try {
    console.log('🎙️ Auto-updating podcast insights...');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/podcast-auto`);

    if (!response.ok) {
      console.log('Auto-updating podcast feeds not available, trying curated feeds...');
      // Fallback to curated feeds
      const fallbackResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/podcast-feeds`);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.success && fallbackData.episodes?.highRelevance) {
          return convertEpisodesToNewsItems(fallbackData.episodes.highRelevance);
        }
      }
      return [];
    }

    const data = await response.json();
    
    if (!data.success || !data.episodes?.highRelevance) {
      return [];
    }

    // Convert podcast episodes to news items
    const podcastNews = convertEpisodesToNewsItems(data.episodes.highRelevance);

    console.log(`📻 Found ${podcastNews.length} auto-updated podcast insights`);
    return podcastNews;
  } catch (error) {
    console.error('Error getting podcast insights:', error);
    return [];
  }
}

function convertEpisodesToNewsItems(episodes: any[]): NewsItem[] {
  return episodes.map((episode: any) => ({
    title: `🎙️ ${episode.title}`,
    summary: episode.description.substring(0, 200) + '...',
    source: 'Podcast Intel (Auto-Updated)',
    url: episode.url || '#',
    relevance: 'High' as const,
    angle: 'Cutting-edge AI and tech insights from industry podcasters',
    personalSpin: 'Podcasters are often the first to discover and test new AI features. These insights could give you a competitive edge in music promotion.',
    newsletterContent: episode.newsletterContent || `**🎙️ ${episode.title}**\n\n${episode.description.substring(0, 200)}...\n\n*Why this matters:* This episode covers AI tools and technology that could impact your music promotion strategy.\n\n**Action Item:** Listen to the full episode for detailed insights and practical advice.`,
    publishedAt: episode.publishedAt
  }));
}
