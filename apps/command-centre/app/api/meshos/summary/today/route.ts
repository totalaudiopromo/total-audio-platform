/**
 * GET /api/meshos/summary/today
 * Returns today's insight summary
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateDailySummary,
  saveDailySummary,
  type GetSummaryResponse,
} from '@total-audio/meshos';

// Mock save function (in production, this would use Supabase)
async function saveMeshState(key: string, value: any): Promise<void> {
  console.log(`[MeshOS API] Saving to mesh_state: ${key}`);
  // In production: await supabase.from('mesh_state').upsert({ key, value, updated_at: new Date() })
}

export async function GET(request: NextRequest) {
  try {
    console.log('[MeshOS API] Generating today\'s summary...');

    // Generate summary for today
    const summary = await generateDailySummary(new Date());

    // Save to mesh_state
    await saveDailySummary(summary, saveMeshState);

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
