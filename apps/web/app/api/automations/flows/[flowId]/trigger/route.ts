/**
 * API Route: /api/automations/flows/[flowId]/trigger
 * Manually trigger a flow execution
 */

import { NextRequest, NextResponse } from 'next/server';
import { manualTriggerFlow } from '@total-audio/automations-engine';

interface RouteContext {
  params: {
    flowId: string;
  };
}

/**
 * POST /api/automations/flows/[flowId]/trigger
 * Manually trigger a flow
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    const body = await request.json();

    const context = body.context || {};

    await manualTriggerFlow(flowId, context);

    return NextResponse.json({
      success: true,
      message: 'Flow triggered successfully',
    });
  } catch (error) {
    console.error('Failed to trigger flow:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger flow',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
