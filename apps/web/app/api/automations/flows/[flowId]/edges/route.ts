/**
 * API Route: /api/automations/flows/[flowId]/edges
 * Manage edges (connections) within a flow
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getEdgesForFlow,
  saveEdge,
  type CreateEdgeData,
} from '@total-audio/automations-engine';

interface RouteContext {
  params: {
    flowId: string;
  };
}

/**
 * GET /api/automations/flows/[flowId]/edges
 * Get all edges for a flow
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    const edges = await getEdgesForFlow(flowId);

    return NextResponse.json({
      success: true,
      data: edges,
    });
  } catch (error) {
    console.error('Failed to get edges:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get edges',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automations/flows/[flowId]/edges
 * Create a new edge in the flow
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { flowId } = params;
    const body = await request.json();

    const { sourceNodeId, targetNodeId, conditionLabel } = body;

    if (!sourceNodeId || !targetNodeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'sourceNodeId and targetNodeId are required',
        },
        { status: 400 }
      );
    }

    const edgeData: CreateEdgeData = {
      flowId,
      sourceNodeId,
      targetNodeId,
      conditionLabel,
    };

    const edge = await saveEdge(edgeData);

    return NextResponse.json(
      {
        success: true,
        data: edge,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create edge:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create edge',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
