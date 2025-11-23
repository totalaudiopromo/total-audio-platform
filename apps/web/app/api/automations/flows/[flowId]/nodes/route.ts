/**
 * API Route: /api/automations/flows/[flowId]/nodes
 * Manage nodes within a flow
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getNodesForFlow,
  saveNode,
  type CreateNodeData,
} from '@total-audio/automations-engine';

interface RouteContext {
  params: {
    flowId: string;
  };
}

/**
 * GET /api/automations/flows/[flowId]/nodes
 * Get all nodes for a flow
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    const nodes = await getNodesForFlow(flowId);

    return NextResponse.json({
      success: true,
      data: nodes,
    });
  } catch (error) {
    console.error('Failed to get nodes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get nodes',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automations/flows/[flowId]/nodes
 * Create a new node in the flow
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    const body = await request.json();

    const { type, subtype, config, position } = body;

    if (!type || !subtype) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'type and subtype are required',
        },
        { status: 400 }
      );
    }

    if (!['trigger', 'condition', 'action'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid node type',
          message: 'type must be one of: trigger, condition, action',
        },
        { status: 400 }
      );
    }

    const nodeData: CreateNodeData = {
      flowId,
      type,
      subtype,
      config: config || {},
      position,
    };

    const node = await saveNode(nodeData);

    return NextResponse.json(
      {
        success: true,
        data: node,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create node:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create node',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
