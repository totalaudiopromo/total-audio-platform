/**
 * API Route: /api/anr/showcases
 *
 * Showcase management endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createShowcase, listShowcasesForWorkspace } from '@total-audio/anr-radar';

/**
 * GET /api/anr/showcases
 * List showcases for workspace
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    const showcases = await listShowcasesForWorkspace(workspaceId);

    return NextResponse.json({ showcases });
  } catch (error) {
    console.error('Failed to list showcases:', error);
    return NextResponse.json(
      { error: 'Failed to list showcases' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/anr/showcases
 * Create new showcase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { workspace_id, name, description, context } = body;

    if (!workspace_id || !name) {
      return NextResponse.json(
        { error: 'workspace_id and name are required' },
        { status: 400 }
      );
    }

    const showcase = await createShowcase(workspace_id, name, description, context);

    if (!showcase) {
      return NextResponse.json(
        { error: 'Failed to create showcase' },
        { status: 500 }
      );
    }

    return NextResponse.json({ showcase }, { status: 201 });
  } catch (error) {
    console.error('Failed to create showcase:', error);
    return NextResponse.json(
      { error: 'Failed to create showcase' },
      { status: 500 }
    );
  }
}
