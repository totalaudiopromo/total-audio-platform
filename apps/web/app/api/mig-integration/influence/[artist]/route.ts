/**
 * MIG Integration API: Get Influence Scores
 * GET /api/mig-integration/influence/[artist]
 */

import { NextRequest, NextResponse } from 'next/server';
import MIGFusionAdapter from '../../../../../../packages/mig-dashboard-integration/src/loader';

export async function GET(
  request: NextRequest,
  { params }: { params: { artist: string } }
) {
  try {
    const { artist } = params;
    const workspaceId = request.headers.get('x-workspace-id');

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: { message: 'Workspace ID required', code: 'MISSING_WORKSPACE' } },
        { status: 400 }
      );
    }

    const scores = await MIGFusionAdapter.getInfluenceScores(artist, workspaceId);

    return NextResponse.json({
      success: true,
      data: scores,
    });
  } catch (error) {
    console.error('Error in /api/mig-integration/influence:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
