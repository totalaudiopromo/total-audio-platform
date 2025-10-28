/**
 * Agent API Routes
 * Generic agent invocation endpoint
 * POST /api/agents?name=<agent_name>
 */

import { NextRequest, NextResponse } from 'next/server'
import { AgentRegistry } from '@/agents/core/AgentRegistry'

export async function GET() {
  try {
    // List all available agents
    const agents = AgentRegistry.list()
    const manifests = AgentRegistry.getAllManifests()
    const stats = AgentRegistry.getStats()

    const agentInfo = agents.map(name => ({
      name,
      manifest: manifests.get(name),
      stats: stats[name],
    }))

    return NextResponse.json({
      agents: agentInfo,
      total: agents.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to list agents',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const agentName = searchParams.get('name')

    if (!agentName) {
      return NextResponse.json(
        { error: 'Agent name required. Use ?name=<agent_name>' },
        { status: 400 }
      )
    }

    // Get agent from registry
    const agent = AgentRegistry.get(agentName)
    if (!agent) {
      return NextResponse.json(
        {
          error: `Agent '${agentName}' not found`,
          available: AgentRegistry.list(),
        },
        { status: 404 }
      )
    }

    // Parse request payload
    const payload = await request.json()

    // Execute agent
    const result = await agent.execute(payload)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Agent execution failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
