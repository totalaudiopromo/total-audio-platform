/**
 * MIG Integration API: Get Graph Opportunities
 * GET /api/mig-integration/graph-opportunities/[artist]
 */

import { NextRequest, NextResponse } from 'next/server';
import MIGFusionAdapter from '../../../../../../../packages/mig-dashboard-integration/src/loader';

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

    const opportunities = await MIGFusionAdapter.getGraphOpportunities(artist, workspaceId);

    return NextResponse.json({
      success: true,
      data: opportunities,
    });
  } catch (error) {
    console.error('Error in /api/mig-integration/graph-opportunities:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
