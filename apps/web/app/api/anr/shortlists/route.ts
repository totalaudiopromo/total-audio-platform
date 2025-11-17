/**
 * GET /api/anr/shortlists - List user's shortlists
 * POST /api/anr/shortlists - Create new shortlist
 */

import { NextRequest, NextResponse } from 'next/server';
import { listShortlistsForUser, generateAgencyShortlist } from '@total-audio/anr-radar';

// TODO: Replace with actual auth
function getUserId(request: NextRequest): string | null {
  // Stub: Extract from session/token
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

    const shortlists = await listShortlistsForUser(userId);

    return NextResponse.json({
      data: shortlists,
    });
  } catch (error) {
    console.error('Failed to list shortlists:', error);
    return NextResponse.json(
      { error: 'Failed to list shortlists' },
      { status: 500 }
    );
  }
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

    const body = await request.json();
    const { criteria, name, description, workspace_id } = body;

    if (!criteria) {
      return NextResponse.json(
        { error: 'Criteria required' },
        { status: 400 }
      );
    }

    // Generate shortlist
    const shortlist = await generateAgencyShortlist(userId, criteria);

    if (!shortlist) {
      return NextResponse.json(
        { error: 'Failed to generate shortlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      shortlist,
    });
  } catch (error) {
    console.error('Failed to create shortlist:', error);
    return NextResponse.json(
      { error: 'Failed to create shortlist' },
      { status: 500 }
    );
  }
}
