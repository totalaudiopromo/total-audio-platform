/**
 * MIG API Route: Search Nodes
 * GET /api/mig/search?type=artist&query=london&limit=50
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchNodesByType, listNodesByType } from '@total-audio/music-industry-graph';
import type { MIGNodeType } from '@total-audio/music-industry-graph';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as MIGNodeType | null;
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Type parameter is required', code: 'MISSING_TYPE' },
        },
        { status: 400 }
      );
    }

    const nodes = query
      ? await searchNodesByType(type, query, limit)
      : await listNodesByType(type, limit);

    return NextResponse.json({
      success: true,
      data: nodes,
      meta: {
        total_results: nodes.length,
        query,
        type,
      },
    });
  } catch (error) {
    console.error('Error in /api/mig/search:', error);
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
