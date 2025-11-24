/**
 * GET /api/anr/insights - Get user insights
 * POST /api/anr/insights/refresh - Regenerate insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { listInsights, generateAnrInsightsForUser } from '@total-audio/anr-radar';

// TODO: Replace with actual auth
function getUserId(request: NextRequest): string | null {
  return 'user-id-placeholder';
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : 20;

    const insights = await listInsights(userId, limit);

    return NextResponse.json({
      data: insights,
    });
  } catch (error) {
    console.error('Failed to get insights:', error);
    return NextResponse.json(
      { error: 'Failed to get insights' },
      { status: 500 }
    );
  }
}
