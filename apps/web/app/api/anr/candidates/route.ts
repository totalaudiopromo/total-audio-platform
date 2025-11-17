/**
 * GET /api/anr/candidates
 *
 * List candidates with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { listCandidates, getLatestScore } from '@total-audio/anr-radar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const scenes = searchParams.get('scenes')?.split(',').filter(Boolean);
    const countries = searchParams.get('countries')?.split(',').filter(Boolean);
    const microgenres = searchParams.get('microgenres')?.split(',').filter(Boolean);
    const minScore = searchParams.get('min_score')
      ? parseFloat(searchParams.get('min_score')!)
      : undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : 50;
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset')!)
      : 0;

    // Fetch candidates
    const response = await listCandidates({
      scenes,
      countries,
      microgenres,
      limit,
      offset,
    });

    // Enrich with latest scores
    const candidatesWithScores = await Promise.all(
      response.data.map(async (candidate) => {
        const latestScore = await getLatestScore(candidate.id);
        return {
          ...candidate,
          latest_score: latestScore,
        };
      })
    );

    // Filter by min score if provided
    const filteredCandidates = minScore
      ? candidatesWithScores.filter(
          (c) => c.latest_score && c.latest_score.composite_score >= minScore
        )
      : candidatesWithScores;

    return NextResponse.json({
      data: filteredCandidates,
      total: response.total,
      limit: response.limit,
      offset: response.offset,
      has_more: response.has_more,
    });
  } catch (error) {
    console.error('Failed to list candidates:', error);
    return NextResponse.json(
      { error: 'Failed to list candidates' },
      { status: 500 }
    );
  }
}
