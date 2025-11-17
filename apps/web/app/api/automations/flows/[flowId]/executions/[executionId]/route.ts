/**
 * API Route: /api/automations/flows/[flowId]/executions/[executionId]
 * Get details of a specific execution
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getExecution,
  getStepsForExecution,
} from '@total-audio/automations-engine';

interface RouteContext {
  params: {
    flowId: string;
    executionId: string;
  };
}

/**
 * GET /api/automations/flows/[flowId]/executions/[executionId]
 * Get execution details including steps
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { executionId } = params;

    const execution = await getExecution(executionId);

    if (!execution) {
      return NextResponse.json(
        {
          success: false,
          error: 'Execution not found',
        },
        { status: 404 }
      );
    }

    const steps = await getStepsForExecution(executionId);

    return NextResponse.json({
      success: true,
      data: {
        execution,
        steps,
      },
    });
  } catch (error) {
    console.error('Failed to get execution details:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get execution details',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
