/**
 * POST /api/anr/insights/refresh
 *
 * Regenerate insights for user
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAnrInsightsForUser } from '@total-audio/anr-radar';

// TODO: Replace with actual auth
function getUserId(request: NextRequest): string | null {
  return 'user-id-placeholder';
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const insights = await generateAnrInsightsForUser(userId);

    return NextResponse.json({
      success: true,
      insights,
      count: insights.length,
    });
  } catch (error) {
    console.error('Failed to refresh insights:', error);
    return NextResponse.json(
      { error: 'Failed to refresh insights' },
      { status: 500 }
    );
  }
}
