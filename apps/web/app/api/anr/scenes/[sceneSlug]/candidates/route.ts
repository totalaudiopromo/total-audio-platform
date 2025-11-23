/**
 * GET /api/anr/scenes/[sceneSlug]/candidates
 *
 * Get candidates in a specific scene with their scores
 */

import { NextRequest, NextResponse } from 'next/server';
import { listCandidates, getLatestScore } from '@total-audio/anr-radar';

export async function GET(
  request: NextRequest,
  { params }: { params: { sceneSlug: string } }
) {
  try {
    const { sceneSlug } = params;
    const { searchParams } = new URL(request.url);

    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : 50;

    // Get candidates in scene
    const response = await listCandidates({
      scenes: [sceneSlug],
      limit,
    });

    // Enrich with scores
    const candidatesWithScores = await Promise.all(
      response.data.map(async (candidate) => {
        const latestScore = await getLatestScore(candidate.id);
        return {
          ...candidate,
          latest_score: latestScore,
        };
      })
    );

    // Sort by composite score
    candidatesWithScores.sort((a, b) => {
      const scoreA = a.latest_score?.composite_score || 0;
      const scoreB = b.latest_score?.composite_score || 0;
      return scoreB - scoreA;
    });

    return NextResponse.json({
      scene_slug: sceneSlug,
      candidates: candidatesWithScores,
      total: response.total,
    });
  } catch (error) {
    console.error('Failed to get scene candidates:', error);
    return NextResponse.json(
      { error: 'Failed to get scene candidates' },
      { status: 500 }
    );
  }
}
