/**
 * MIG API Route: Get Scene Graph
 * GET /api/mig/scene/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGraphForScene } from '@total-audio/music-industry-graph';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Slug parameter is required', code: 'MISSING_SLUG' },
        },
        { status: 400 }
      );
    }

    const graph = await getGraphForScene(slug);

    return NextResponse.json({
      success: true,
      data: graph,
    });
  } catch (error) {
    console.error('Error in /api/mig/scene/[slug]:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
