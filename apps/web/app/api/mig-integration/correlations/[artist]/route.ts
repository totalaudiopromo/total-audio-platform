/**
 * MIG Integration API: Get Correlations
 * GET /api/mig-integration/correlations/[artist]
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

    const correlations = await MIGFusionAdapter.getCorrelationLinks(artist, workspaceId);

    return NextResponse.json({
      success: true,
      data: correlations,
    });
  } catch (error) {
    console.error('Error in /api/mig-integration/correlations:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
