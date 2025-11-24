/**
 * API Route: /api/anr/rosters/[rosterId]/fit/[artistSlug]
 *
 * Assess candidate fit for roster
 */

import { NextRequest, NextResponse } from 'next/server';
import { assessCandidateRosterFit } from '@total-audio/anr-radar';

/**
 * GET /api/anr/rosters/[rosterId]/fit/[artistSlug]
 * Assess how well a candidate fits the roster
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { rosterId: string; artistSlug: string } }
) {
  try {
    const { rosterId, artistSlug } = params;

    const fit = await assessCandidateRosterFit(rosterId, artistSlug);

    if (!fit) {
      return NextResponse.json(
        { error: 'Failed to assess roster fit' },
        { status: 500 }
      );
    }

    return NextResponse.json({ fit });
  } catch (error) {
    console.error('Failed to assess roster fit:', error);
    return NextResponse.json(
      { error: 'Failed to assess roster fit' },
      { status: 500 }
    );
  }
}
