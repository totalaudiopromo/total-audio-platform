/**
 * MIG API Route: Get Microgenre Graph
 * GET /api/mig/microgenre/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGraphForMicrogenre, computeMicrogenreCluster } from '@total-audio/music-industry-graph';

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

    const [graph, cluster] = await Promise.all([
      getGraphForMicrogenre(slug),
      computeMicrogenreCluster(slug),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        graph,
        cluster,
      },
    });
  } catch (error) {
    console.error('Error in /api/mig/microgenre/[slug]:', error);
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
