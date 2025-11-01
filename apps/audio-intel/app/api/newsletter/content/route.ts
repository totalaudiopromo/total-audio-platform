import { NextRequest, NextResponse } from 'next/server';
import { newsletterResearch } from '@/utils/newsletterContentStrategy';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const week = parseInt(searchParams.get('week') || '1');

    // Generate content for the specified week
    const content = await newsletterResearch.generateWeeklyContent(week);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error generating newsletter content:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
