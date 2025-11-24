/**
 * API Route: /api/automations/flows
 * CRUD operations for automation flows
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  listFlowsForUser,
  createFlow,
  type CreateFlowData,
} from '@total-audio/automations-engine';

/**
 * GET /api/automations/flows
 * List all flows for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from auth session
    const userId = request.headers.get('x-user-id') || 'demo-user';

    const flows = await listFlowsForUser(userId);

    return NextResponse.json({
      success: true,
      data: flows,
    });
  } catch (error) {
    console.error('Failed to list flows:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list flows',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automations/flows
 * Create a new automation flow
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Get userId from auth session
    const userId = request.headers.get('x-user-id') || 'demo-user';

    const body = await request.json();
    const { name, description, triggerType } = body;

    if (!name || !triggerType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'name and triggerType are required',
        },
        { status: 400 }
      );
    }

    if (!['event', 'schedule', 'manual'].includes(triggerType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid trigger type',
          message: 'triggerType must be one of: event, schedule, manual',
        },
        { status: 400 }
      );
    }

    const flowData: CreateFlowData = {
      userId,
      workspaceId: body.workspaceId || null,
      name,
      description,
      triggerType,
    };

    const flow = await createFlow(flowData);

    return NextResponse.json(
      {
        success: true,
        data: flow,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create flow:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create flow',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
