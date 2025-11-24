/**
 * MIG Integration API: Get Contact Fit Score
 * POST /api/mig-integration/contact-fit
 * Body: { contact_id, artist_slug }
 */

import { NextRequest, NextResponse } from 'next/server';
import MIGFusionAdapter from '../../../../../packages/mig-dashboard-integration/src/loader';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact_id, artist_slug } = body;
    const workspaceId = request.headers.get('x-workspace-id');

    if (!workspaceId || !contact_id || !artist_slug) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Workspace ID, contact_id, and artist_slug required', code: 'MISSING_PARAMS' },
        },
        { status: 400 }
      );
    }

    const fit = await MIGFusionAdapter.getContactFit(contact_id, artist_slug, workspaceId);

    return NextResponse.json({
      success: true,
      data: fit,
    });
  } catch (error) {
    console.error('Error in /api/mig-integration/contact-fit:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
