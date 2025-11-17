/**
 * API Route: /api/automations/flows/[flowId]/executions
 * View execution history for a flow
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  listExecutionsForFlow,
  getStepsForExecution,
} from '@total-audio/automations-engine';

interface RouteContext {
  params: {
    flowId: string;
  };
}

/**
 * GET /api/automations/flows/[flowId]/executions
 * Get execution history for a flow
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const executions = await listExecutionsForFlow(flowId, limit);

    return NextResponse.json({
      success: true,
      data: executions,
    });
  } catch (error) {
    console.error('Failed to get executions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get executions',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
