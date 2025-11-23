/**
 * GET /api/meshos/summary
 * Returns current MeshOS intelligence summary (wrapper for today's summary)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDailySummary, type GetSummaryResponse } from '@total-audio/meshos';

async function saveMeshState(key: string, value: any): Promise<void> {
  console.log(`[MeshOS API] Saving to mesh_state: ${key}`);
  // In production: await supabase.from('mesh_state').upsert({ key, value, updated_at: new Date() })
}

export async function GET(request: NextRequest) {
  try {
    console.log('[MeshOS API] Generating current summary...');

    const summary = await generateDailySummary(new Date());

    return NextResponse.json(
      {
        success: true,
        summary,
      } as GetSummaryResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('[MeshOS API] Error generating summary:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as GetSummaryResponse,
      { status: 500 }
    );
  }
}
