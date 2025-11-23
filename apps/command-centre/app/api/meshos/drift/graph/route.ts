/**
 * GET /api/meshos/drift/graph
 * Returns the current contradiction graph snapshot
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getContradictionGraphSnapshot,
  type GetContradictionGraphResponse,
} from '@total-audio/meshos';

export async function GET(request: NextRequest) {
  try {
    console.log('[MeshOS API] Fetching contradiction graph...');

    // Get the contradiction graph
    const graph = await getContradictionGraphSnapshot();

    return NextResponse.json(
      {
        success: true,
        graph,
      } as GetContradictionGraphResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('[MeshOS API] Error fetching contradiction graph:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as GetContradictionGraphResponse,
      { status: 500 }
    );
  }
}
