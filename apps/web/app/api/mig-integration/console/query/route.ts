/**
 * MIG Integration API: AI Console Query
 * POST /api/mig-integration/console/query
 * Body: { query: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeConsoleQuery } from '../../../../../../packages/mig-ai-console/src/index';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: { message: 'Query string required', code: 'MISSING_QUERY' } },
        { status: 400 }
      );
    }

    const result = await executeConsoleQuery(query);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in /api/mig-integration/console/query:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
