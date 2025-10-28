/**
 * Agent Statistics Endpoint
 * GET /api/agents/stats?name=<agent_name> (optional)
 */

import { NextRequest, NextResponse } from 'next/server'
import { AgentRegistry } from '@/agents/core/AgentRegistry'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const agentName = searchParams.get('name')

    const stats = AgentRegistry.getStats(agentName || undefined)

    if (agentName && !stats) {
      return NextResponse.json(
        {
          error: `Agent '${agentName}' not found`,
          available: AgentRegistry.list(),
        },
        { status: 404 }
      )
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch agent stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
