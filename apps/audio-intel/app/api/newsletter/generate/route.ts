import { NextRequest, NextResponse } from 'next/server';
import { newsletterResearch } from '@/utils/newsletterContentStrategy';

export async function POST(req: NextRequest) {
  try {
    const { week } = await req.json();
    const weekNumber = week || 1;

    // Generate fresh content for the specified week
    const content = await newsletterResearch.generateWeeklyContent(weekNumber);

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
