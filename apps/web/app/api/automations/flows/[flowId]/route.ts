/**
 * API Route: /api/automations/flows/[flowId]
 * Individual flow operations
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getFlow,
  updateFlow,
  deleteFlow,
  type UpdateFlowData,
} from '@total-audio/automations-engine';

interface RouteContext {
  params: {
    flowId: string;
  };
}

/**
 * GET /api/automations/flows/[flowId]
 * Get a specific flow
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    const flow = await getFlow(flowId);

    if (!flow) {
      return NextResponse.json(
        {
          success: false,
          error: 'Flow not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: flow,
    });
  } catch (error) {
    console.error('Failed to get flow:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get flow',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/automations/flows/[flowId]
 * Update a flow
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    const body = await request.json();

    const updates: UpdateFlowData = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.isActive !== undefined) updates.isActive = body.isActive;

    const flow = await updateFlow(flowId, updates);

    return NextResponse.json({
      success: true,
      data: flow,
    });
  } catch (error) {
    console.error('Failed to update flow:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update flow',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/automations/flows/[flowId]
 * Delete a flow
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    await deleteFlow(flowId);

    return NextResponse.json({
      success: true,
      message: 'Flow deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete flow:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete flow',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
