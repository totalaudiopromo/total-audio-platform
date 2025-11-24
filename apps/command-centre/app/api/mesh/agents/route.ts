/**
 * Mesh Agents API
 * GET /api/mesh/agents - List all agents
 */

import { NextResponse } from 'next/server';
import { listAgents, initializeBuiltInAgents } from '@total-audio/agent-mesh-os';

export async function GET() {
  try {
    // Ensure built-in agents are registered
    await initializeBuiltInAgents().catch(() => {
      // Ignore if already initialized
    });

    const agents = await listAgents();
    return NextResponse.json({ agents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
