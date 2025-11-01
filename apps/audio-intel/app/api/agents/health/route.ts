/**
 * Agent Health Check Endpoint
 * GET /api/agents/health
 */

import { NextResponse } from 'next/server';
import { AgentRegistry } from '@/agents/core/AgentRegistry';

export async function GET() {
  try {
    const health = await AgentRegistry.healthCheck();

    return NextResponse.json(health, {
      status: health.healthy ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        healthy: false,
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 500 }
    );
  }
}
