/**
 * API Route: /api/anr/rosters/[rosterId]
 *
 * Roster details with analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getRosterById,
  getRosterProfile,
  computeRosterGaps,
} from '@total-audio/anr-radar';

/**
 * GET /api/anr/rosters/[rosterId]
 * Get roster details with profile and gaps
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { rosterId: string } }
) {
  try {
    const { rosterId } = params;

    const roster = await getRosterById(rosterId);

    if (!roster) {
      return NextResponse.json(
        { error: 'Roster not found' },
        { status: 404 }
      );
    }

    // Get profile and gaps
    const profile = await getRosterProfile(rosterId);
    const gaps = await computeRosterGaps(rosterId);

    return NextResponse.json({
      roster,
      profile,
      gaps,
    });
  } catch (error) {
    console.error('Failed to get roster:', error);
    return NextResponse.json(
      { error: 'Failed to get roster' },
      { status: 500 }
    );
  }
}
