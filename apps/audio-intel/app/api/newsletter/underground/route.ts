// Underground Music Newsjacker API Endpoint
// Fetches content from curated underground music sources

import { NextRequest, NextResponse } from 'next/server';
import { undergroundNewsjacker } from '../../../../utils/undergroundNewsjacker';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test') === 'true';
    const debug = searchParams.get('debug') === 'true';

    console.log('🎵 Underground Music Newsjacker API called');

    // Generate content using underground sources
    const result = await undergroundNewsjacker.generateNewsletterContent();

    if (debug) {
      console.log('Underground Newsjacker Result:', {
        success: result.success,
        articlesFound: result.articles.length,
        sources: result.sources,
        totalFound: result.totalFound,
      });
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to generate content',
          articles: [],
          content: null,
        },
        { status: 500 }
      );
    }

    if (result.articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No underground music content found today',
        articles: [],
        content: null,
        sources: result.sources,
        totalFound: result.totalFound,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Found ${result.articles.length} underground music articles from ${result.sources.length} sources`,
      articles: result.articles,
      content: result.content,
      sources: result.sources,
      totalFound: result.totalFound,
    });
  } catch (error) {
    console.error('Underground Newsjacker API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        articles: [],
        content: null,
      },
      { status: 500 }
    );
  }
}
