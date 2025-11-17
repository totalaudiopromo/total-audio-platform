/**
 * GET /api/awareness/recommendations
 * POST /api/awareness/recommendations/[id]/resolve
 * Get pending recommendations and mark them resolved
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPendingRecommendations,
  getRecommendationsByTarget,
  markRecommendationResolved,
} from '@total-audio/core-awareness';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');
    const userId = searchParams.get('userId');
    const targetSystem = searchParams.get('targetSystem');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let recommendations;

    if (targetSystem) {
      recommendations = await getRecommendationsByTarget(
        targetSystem,
        workspaceId,
        userId,
        limit
      );
    } else {
      recommendations = await getPendingRecommendations(workspaceId, userId, limit);
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch recommendations',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recommendationId } = body;

    if (!recommendationId) {
      return NextResponse.json(
        { success: false, error: 'recommendationId is required' },
        { status: 400 }
      );
    }

    const updated = await markRecommendationResolved(recommendationId);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error resolving recommendation:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to resolve recommendation',
      },
      { status: 500 }
    );
  }
}
