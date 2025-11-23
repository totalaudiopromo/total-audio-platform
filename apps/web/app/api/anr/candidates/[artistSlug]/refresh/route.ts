/**
 * POST /api/anr/candidates/[artistSlug]/refresh
 *
 * Refresh candidate scores by triggering event ingestion and score computation
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCandidateBySlug,
  ingestAllEventsForArtist,
  computeScoresForArtist,
} from '@total-audio/anr-radar';

export async function POST(
  request: NextRequest,
  { params }: { params: { artistSlug: string } }
) {
  try {
    const { artistSlug } = params;

    // Verify candidate exists
    const candidate = await getCandidateBySlug(artistSlug);
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Ingest events
    const eventsIngested = await ingestAllEventsForArtist(artistSlug);

    // Compute new scores
    const newScore = await computeScoresForArtist(artistSlug);

    return NextResponse.json({
      success: true,
      events_ingested: eventsIngested,
      new_score: newScore,
    });
  } catch (error) {
    console.error('Failed to refresh candidate:', error);
    return NextResponse.json(
      { error: 'Failed to refresh candidate' },
      { status: 500 }
    );
  }
}
