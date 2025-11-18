/**
 * GET /api/meshos/summary/[date]
 * Returns insight summary for a specific date (YYYY-MM-DD)
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

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const dateStr = params.date;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid date format. Expected YYYY-MM-DD',
        } as GetSummaryResponse,
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid date',
        } as GetSummaryResponse,
        { status: 400 }
      );
    }

    console.log(`[MeshOS API] Generating summary for ${dateStr}...`);

    // Generate summary for specified date
    const summary = await generateDailySummary(date);

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
