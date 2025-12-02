/**
 * Phase 9D-2B: Newsjacker Automation API
 * RSS feed parsing → Claude 3.5 Sonnet summarization → ConvertKit draft creation
 */

import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import Anthropic from '@anthropic-ai/sdk';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

interface NewsjackerResponse {
  success: boolean;
  articles: NewsItem[];
  summary?: string;
  draft?: {
    subject: string;
    content: string;
  };
  error?: string;
}

/**
 * Fetch and parse RSS feeds for music industry news
 */
async function fetchMusicNews(): Promise<NewsItem[]> {
  const feeds = [
    'https://www.musicbusinessworldwide.com/feed/',
    'https://www.completemusicupdate.com/feed/',
    'https://www.musicweek.com/feed',
  ];

  const articles: NewsItem[] = [];

  for (const feedUrl of feeds) {
    try {
      const response = await fetch(feedUrl);
      const xml = await response.text();

      // Simple RSS parsing (production would use a proper XML parser)
      const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/g;
      const linkRegex = /<link>(.*?)<\/link>/g;
      const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/g;
      const descriptionRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>/g;

      const titles = [...xml.matchAll(titleRegex)].map(m => m[1]);
      const links = [...xml.matchAll(linkRegex)].map(m => m[1]);
      const pubDates = [...xml.matchAll(pubDateRegex)].map(m => m[1]);
      const descriptions = [...xml.matchAll(descriptionRegex)].map(m => m[1]);

      const source = new URL(feedUrl).hostname.replace('www.', '');

      for (let i = 0; i < Math.min(titles.length, 5); i++) {
        if (titles[i] && links[i]) {
          articles.push({
            title: titles[i],
            link: links[i],
            pubDate: pubDates[i] || new Date().toISOString(),
            description: descriptions[i] || '',
            source,
          });
        }
      }
    } catch (error) {
      console.error(`Failed to fetch feed ${feedUrl}:`, error);
    }
  }

  return articles.slice(0, 10); // Top 10 most recent
}

/**
 * Use Claude 3.5 Sonnet to summarize and create newsletter draft
 */
async function generateNewsletterDraft(articles: NewsItem[]): Promise<{
  subject: string;
  content: string;
}> {
  const anthropic = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });

  const articlesText = articles
    .map((article, i) => {
      return `${i + 1}. ${article.title}
Source: ${article.source}
Link: ${article.link}
Summary: ${article.description.substring(0, 200)}...
`;
    })
    .join('\n\n');

  const prompt = `You are a music industry newsletter writer for "The Unsigned Advantage", a newsletter for independent UK artists and radio promoters.

Here are the top music industry news articles from the past week:

${articlesText}

Create a newsletter draft with:
1. A compelling subject line (max 60 characters)
2. Newsletter content in markdown format that:
   - Opens with a British casual-professional greeting
   - Summarizes the top 3-4 most relevant stories for indie artists
   - Focuses on actionable insights and industry trends
   - Includes relevant links
   - Ends with a call-to-action related to Audio Intel (contact enrichment tool)

Format your response as JSON:
{
  "subject": "...",
  "content": "..."
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : JSON.stringify(message.content);

  // Extract JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Claude response');
  }

  const draft = JSON.parse(jsonMatch[0]);
  return {
    subject: draft.subject,
    content: draft.content,
  };
}

/**
 * GET: Fetch recent music industry news
 */
export async function GET() {
  try {
    if (!env.FEATURE_AUTOMATION) {
      return NextResponse.json(
        {
          success: false,
          error: 'Automation features not enabled',
        },
        { status: 403 }
      );
    }

    const articles = await fetchMusicNews();

    return NextResponse.json({
      success: true,
      articles,
    });
  } catch (error: any) {
    console.error('Newsjacker GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch news',
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Generate newsletter draft from recent news
 */
export async function POST() {
  try {
    if (!env.FEATURE_AUTOMATION) {
      return NextResponse.json(
        {
          success: false,
          error: 'Automation features not enabled',
        },
        { status: 403 }
      );
    }

    if (!env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Anthropic API key not configured',
        },
        { status: 400 }
      );
    }

    // Step 1: Fetch recent articles
    const articles = await fetchMusicNews();

    if (articles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No articles found',
        },
        { status: 404 }
      );
    }

    // Step 2: Generate newsletter draft with Claude 3.5 Sonnet
    const draft = await generateNewsletterDraft(articles);

    return NextResponse.json({
      success: true,
      articles,
      summary: `Generated newsletter draft from ${articles.length} articles`,
      draft,
    });
  } catch (error: any) {
    console.error('Newsjacker POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate newsletter',
      },
      { status: 500 }
    );
  }
}
