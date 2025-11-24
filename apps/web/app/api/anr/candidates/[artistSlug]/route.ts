/**
 * GET /api/anr/candidates/[artistSlug]
 *
 * Get full candidate details including scores, events, and recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCandidateBySlug,
  getLatestScore,
  getScoreHistory,
  listEvents,
  computeBreakoutProbability,
} from '@total-audio/anr-radar';

export async function GET(
  request: NextRequest,
  { params }: { params: { artistSlug: string } }
) {
  try {
    const { artistSlug } = params;

    // Get candidate
    const candidate = await getCandidateBySlug(artistSlug);
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Get scores and events
    const [latestScore, scoreHistory, events, breakoutProb] = await Promise.all([
      getLatestScore(candidate.id),
      getScoreHistory(candidate.id, 30),
      listEvents(candidate.id, 50),
      computeBreakoutProbability(candidate.id),
    ]);

    return NextResponse.json({
      candidate,
      latest_score: latestScore,
      score_history: scoreHistory,
      events,
      breakout_probability: breakoutProb,
    });
  } catch (error) {
    console.error('Failed to get candidate details:', error);
    return NextResponse.json(
      { error: 'Failed to get candidate details' },
      { status: 500 }
    );
  }
}
