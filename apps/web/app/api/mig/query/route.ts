/**
 * MIG API Route: Natural Language Query
 * POST /api/mig/query
 * Body: { query: "show me all London alt-R&B artists" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeNLQuery } from '@total-audio/music-industry-graph';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Query string is required', code: 'MISSING_QUERY' },
        },
        { status: 400 }
      );
    }

    const result = await executeNLQuery(query);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in /api/mig/query:', error);
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
