import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

const PERPLEXITY_API_KEY = getEnv('PERPLEXITY_API_KEY');

interface PodcastEpisode {
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  url: string;
  aiInsights: string[];
  techFeatures: string[];
  musicIndustryRelevance: 'High' | 'Medium' | 'Low';
  actionableTips: string[];
  newsletterContent: string;
}

interface PodcastFeed {
  title: string;
  description: string;
  episodes: PodcastEpisode[];
  lastChecked: string;
}

async function fetchApplePodcastsFeed(feedUrl: string): Promise<PodcastFeed | null> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Audio Intel Podcast Monitor/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch podcast feed: ${response.status}`);
    }

    const xmlText = await response.text();
    return parseRSSFeed(xmlText);
  } catch (error) {
    console.error('Error fetching Apple Podcasts feed:', error);
    return null;
  }
}

function parseRSSFeed(xmlText: string): PodcastFeed {
  // Simple RSS parsing - in production, you'd want to use a proper XML parser
  const titleMatch = xmlText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
  const descriptionMatch = xmlText.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);

  const episodes: PodcastEpisode[] = [];
  const episodeMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

  episodeMatches.forEach((episodeXml, index) => {
    const epTitleMatch = episodeXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const epDescMatch = episodeXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
    const pubDateMatch = episodeXml.match(/<pubDate>(.*?)<\/pubDate>/);
    const durationMatch = episodeXml.match(/<itunes:duration>(.*?)<\/itunes:duration>/);
    const linkMatch = episodeXml.match(/<link>(.*?)<\/link>/);

    if (epTitleMatch && epDescMatch) {
      episodes.push({
        title: epTitleMatch[1],
        description: epDescMatch[1],
        publishedAt: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
        duration: durationMatch ? durationMatch[1] : 'Unknown',
        url: linkMatch ? linkMatch[1] : '',
        aiInsights: [],
        techFeatures: [],
        musicIndustryRelevance: 'Low',
        actionableTips: [],
        newsletterContent: '',
      });
    }
  });

  return {
    title: titleMatch ? titleMatch[1] : 'Unknown Podcast',
    description: descriptionMatch ? descriptionMatch[1] : '',
    episodes: episodes.slice(0, 10), // Get latest 10 episodes
    lastChecked: new Date().toISOString(),
  };
}

async function analyzePodcastEpisode(episode: PodcastEpisode): Promise<PodcastEpisode> {
  if (!PERPLEXITY_API_KEY) {
    console.log('Perplexity API not configured - using fallback analysis');
    return analyzeEpisodeFallback(episode);
  }

  const prompt = `Analyze this podcast episode for AI and technology insights relevant to the music industry:

**Episode Title:** ${episode.title}
**Description:** ${episode.description}

Focus on extracting:
1. **AI Tools & Features**: New AI tools, platforms, or features mentioned
2. **Technology Insights**: Cutting-edge tech that could impact music promotion
3. **Music Industry Relevance**: How these tools/features could help indie artists
4. **Actionable Tips**: Specific advice for music professionals
5. **Newsletter Content**: Ready-to-use content for a music industry newsletter

Look for mentions of:
- AI music tools (Suno, Udio, etc.)
- Social media AI features
- Automation tools
- Content creation AI
- Music promotion technology
- Industry trends and predictions

Format the response as JSON:
{
  "aiInsights": ["insight1", "insight2", "insight3"],
  "techFeatures": ["feature1", "feature2", "feature3"],
  "musicIndustryRelevance": "High|Medium|Low",
  "actionableTips": ["tip1", "tip2", "tip3"],
  "newsletterContent": "Formatted newsletter section with title, content, and actionable advice"
}

If no relevant AI/tech content is found, set musicIndustryRelevance to "Low" and provide minimal content.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content:
              'You are a music industry expert who analyzes podcast content for AI and technology insights relevant to independent artists and music professionals. Focus on actionable, practical advice.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
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
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return {
        ...episode,
        aiInsights: analysis.aiInsights || [],
        techFeatures: analysis.techFeatures || [],
        musicIndustryRelevance: analysis.musicIndustryRelevance || 'Low',
        actionableTips: analysis.actionableTips || [],
        newsletterContent: analysis.newsletterContent || '',
      };
    }

    // Fallback to text parsing
    return analyzeEpisodeFallback(episode);
  } catch (error) {
    console.error('Podcast analysis error:', error);
    return analyzeEpisodeFallback(episode);
  }
}

function analyzeEpisodeFallback(episode: PodcastEpisode): PodcastEpisode {
  const title = episode.title.toLowerCase();
  const description = episode.description.toLowerCase();

  const aiKeywords = [
    'ai',
    'artificial intelligence',
    'machine learning',
    'automation',
    'chatgpt',
    'claude',
    'perplexity',
    'suno',
    'udio',
  ];
  const techKeywords = [
    'tool',
    'platform',
    'software',
    'app',
    'feature',
    'update',
    'new',
    'beta',
    'launch',
  ];
  const musicKeywords = [
    'music',
    'artist',
    'promotion',
    'marketing',
    'social media',
    'spotify',
    'tiktok',
    'instagram',
  ];

  const hasAI = aiKeywords.some(
    keyword => title.includes(keyword) || description.includes(keyword)
  );
  const hasTech = techKeywords.some(
    keyword => title.includes(keyword) || description.includes(keyword)
  );
  const hasMusic = musicKeywords.some(
    keyword => title.includes(keyword) || description.includes(keyword)
  );

  let relevance: 'High' | 'Medium' | 'Low' = 'Low';
  if (hasAI && hasMusic) relevance = 'High';
  else if (hasAI || hasTech) relevance = 'Medium';

  const aiInsights = hasAI ? ['AI tools and features discussed in this episode'] : [];
  const techFeatures = hasTech ? ['New technology features mentioned'] : [];
  const actionableTips = hasMusic ? ['Music industry insights and tips shared'] : [];

  const newsletterContent =
    relevance !== 'Low'
      ? `**🎙️ Podcast Intel: ${episode.title}**\n\n${episode.description.substring(
          0,
          200
        )}...\n\n*Why this matters:* This episode covers ${
          hasAI ? 'AI tools' : 'technology'
        } that could impact your music promotion strategy.\n\n**Action Item:** Listen to the full episode for detailed insights and practical advice.`
      : '';

  return {
    ...episode,
    aiInsights,
    techFeatures,
    musicIndustryRelevance: relevance,
    actionableTips,
    newsletterContent,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feedUrl = searchParams.get('feedUrl');

    if (!feedUrl) {
      return NextResponse.json(
        {
          error: 'feedUrl parameter is required',
          example:
            '/api/podcast-monitor?feedUrl=https://feeds.apple.com/podcasts/your-podcast-feed',
        },
        { status: 400 }
      );
    }

    console.log(`🎙️ Monitoring Apple Podcasts feed: ${feedUrl}`);

    // Fetch podcast feed
    const podcastFeed = await fetchApplePodcastsFeed(feedUrl);

    if (!podcastFeed) {
      return NextResponse.json(
        {
          error: 'Failed to fetch podcast feed',
          details: 'Check the feed URL and try again',
        },
        { status: 400 }
      );
    }

    console.log(`📻 Found ${podcastFeed.episodes.length} episodes in feed`);

    // Analyze episodes for AI/tech insights
    const analyzedEpisodes = await Promise.all(
      podcastFeed.episodes.map(episode => analyzePodcastEpisode(episode))
    );

    // Filter for high-relevance episodes
    const highRelevanceEpisodes = analyzedEpisodes.filter(
      ep => ep.musicIndustryRelevance === 'High'
    );
    const mediumRelevanceEpisodes = analyzedEpisodes.filter(
      ep => ep.musicIndustryRelevance === 'Medium'
    );

    // Generate newsletter content
    const newsletterContent = generatePodcastNewsletterContent(
      highRelevanceEpisodes,
      mediumRelevanceEpisodes
    );

    console.log(
      `✅ Found ${highRelevanceEpisodes.length} high-relevance episodes, ${mediumRelevanceEpisodes.length} medium-relevance`
    );

    return NextResponse.json({
      success: true,
      message: 'Podcast monitoring completed',
      podcast: {
        title: podcastFeed.title,
        description: podcastFeed.description,
        totalEpisodes: podcastFeed.episodes.length,
        lastChecked: podcastFeed.lastChecked,
      },
      episodes: {
        all: analyzedEpisodes,
        highRelevance: highRelevanceEpisodes,
        mediumRelevance: mediumRelevanceEpisodes,
      },
      newsletterContent,
      stats: {
        totalEpisodes: analyzedEpisodes.length,
        highRelevance: highRelevanceEpisodes.length,
        mediumRelevance: mediumRelevanceEpisodes.length,
        lowRelevance:
          analyzedEpisodes.length - highRelevanceEpisodes.length - mediumRelevanceEpisodes.length,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Podcast monitoring error:', error);
    return NextResponse.json(
      {
        error: 'Failed to monitor podcast feed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { feedUrls, keywords = [] } = await request.json();

    if (!Array.isArray(feedUrls) || feedUrls.length === 0) {
      return NextResponse.json(
        {
          error: 'feedUrls array is required',
          example: {
            feedUrls: ['https://feeds.apple.com/podcast1', 'https://feeds.apple.com/podcast2'],
          },
        },
        { status: 400 }
      );
    }

    console.log(`🎙️ Monitoring ${feedUrls.length} podcast feeds`);

    const results = await Promise.all(
      feedUrls.map(async (feedUrl: string) => {
        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
            }/api/podcast-monitor?feedUrl=${encodeURIComponent(feedUrl)}`
          );
          return await response.json();
        } catch (error) {
          return {
            error: `Failed to monitor ${feedUrl}`,
            details: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    // Combine results
    const allEpisodes = results.flatMap(result => result.episodes?.all || []);
    const highRelevanceEpisodes = allEpisodes.filter(ep => ep.musicIndustryRelevance === 'High');
    const mediumRelevanceEpisodes = allEpisodes.filter(
      ep => ep.musicIndustryRelevance === 'Medium'
    );

    // Generate combined newsletter content
    const newsletterContent = generatePodcastNewsletterContent(
      highRelevanceEpisodes,
      mediumRelevanceEpisodes
    );

    return NextResponse.json({
      success: true,
      message: `Monitored ${feedUrls.length} podcast feeds`,
      results,
      combined: {
        totalEpisodes: allEpisodes.length,
        highRelevance: highRelevanceEpisodes.length,
        mediumRelevance: mediumRelevanceEpisodes.length,
        allEpisodes,
        highRelevanceEpisodes,
        mediumRelevanceEpisodes,
      },
      newsletterContent,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Multi-podcast monitoring error:', error);
    return NextResponse.json(
      {
        error: 'Failed to monitor podcast feeds',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generatePodcastNewsletterContent(
  highRelevance: PodcastEpisode[],
  mediumRelevance: PodcastEpisode[]
): string {
  if (highRelevance.length === 0 && mediumRelevance.length === 0) {
    return '';
  }

  let content = '**🎙️ Podcast Intel: Latest AI & Tech Insights**\n\n';

  if (highRelevance.length > 0) {
    content += '**🔥 High-Impact Episodes:**\n\n';
    highRelevance.forEach(episode => {
      content += episode.newsletterContent + '\n\n';
    });
  }

  if (mediumRelevance.length > 0) {
    content += '**📱 Medium-Impact Episodes:**\n\n';
    mediumRelevance.slice(0, 3).forEach(episode => {
      content += `**${episode.title}**\n${episode.description.substring(0, 150)}...\n\n`;
    });
  }

  content +=
    '*Why this matters:* Podcasters are often the first to discover and test new AI features. These insights could give you a competitive edge in music promotion.*\n\n';
  content +=
    '**Action Item:** Listen to the high-impact episodes for detailed insights and practical advice.';

  return content;
}
