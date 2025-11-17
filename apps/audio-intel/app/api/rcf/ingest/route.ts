/**
 * RCF Ingest API Route
 *
 * POST /api/rcf/ingest
 *
 * Manually trigger RCF pipeline (admin-only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { runPipeline, runSelectiveIngestors } from '@total-audio/rcf';

export const dynamic = 'force-dynamic';

/**
 * POST /api/rcf/ingest
 * Trigger RCF pipeline manually
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Verify admin authentication
    // For now, check for admin header
    const isAdmin = request.headers.get('x-admin-key') === process.env.RCF_ADMIN_KEY;

    if (!isAdmin && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - admin access required',
        },
        { status: 403 }
      );
    }

    // Parse request body (optional)
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // No body provided - run full pipeline
    }

    // Check for selective ingestion
    if (body.ingestors && Array.isArray(body.ingestors)) {
      console.log(`[RCF Ingest API] Running selective ingestors: ${body.ingestors.join(', ')}`);

      const results = await runSelectiveIngestors(body.ingestors);

      return NextResponse.json({
        success: true,
        data: results,
        meta: {
          mode: 'selective',
          ingestors: body.ingestors,
        },
      });
    }

    // Run full pipeline
    console.log('[RCF Ingest API] Running full pipeline...');

    const result = await runPipeline();

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        mode: 'full',
      },
    });
  } catch (error) {
    console.error('[RCF Ingest API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run pipeline',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
