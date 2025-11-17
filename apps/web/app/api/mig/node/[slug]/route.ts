/**
 * MIG API Route: Get Node by Slug
 * GET /api/mig/node/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getNodeBySlug, getNeighbors } from '@total-audio/music-industry-graph';

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

    const node = await getNodeBySlug(slug);

    if (!node) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Node not found', code: 'NODE_NOT_FOUND' },
        },
        { status: 404 }
      );
    }

    // Get neighbors for context
    const neighbors = await getNeighbors(node.id, { depth_limit: 1 });

    return NextResponse.json({
      success: true,
      data: {
        node,
        neighbors,
      },
    });
  } catch (error) {
    console.error('Error in /api/mig/node/[slug]:', error);
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
