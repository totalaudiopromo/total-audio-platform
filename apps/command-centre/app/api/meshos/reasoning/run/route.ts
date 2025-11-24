/**
 * POST /api/meshos/reasoning/run
 * Triggers a scheduled reasoning cycle (hourly, daily, weekly)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  runScheduledCycle,
  saveScheduledReasoningResult,
  type RunReasoningRequest,
  type RunReasoningResponse,
} from '@total-audio/meshos';

// Mock save function (in production, this would use Supabase)
async function saveMeshState(key: string, value: any): Promise<void> {
  console.log(`[MeshOS API] Saving to mesh_state: ${key}`, JSON.stringify(value, null, 2));
  // In production: await supabase.from('mesh_state').upsert({ key, value, updated_at: new Date() })
}

export async function POST(request: NextRequest) {
  try {
    const body: RunReasoningRequest = await request.json();

    // Validate mode
    if (!body.mode || !['hourly', 'daily', 'weekly'].includes(body.mode)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid mode. Must be one of: hourly, daily, weekly',
        } as RunReasoningResponse,
        { status: 400 }
      );
    }

    console.log(`[MeshOS API] Running ${body.mode} reasoning cycle...`);

    // Run the reasoning cycle
    const result = await runScheduledCycle(body.mode);

    // Save to mesh_state
    await saveScheduledReasoningResult(result, saveMeshState);

    return NextResponse.json(
      {
        success: true,
        result,
      } as RunReasoningResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('[MeshOS API] Error running reasoning cycle:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as RunReasoningResponse,
      { status: 500 }
    );
  }
}
