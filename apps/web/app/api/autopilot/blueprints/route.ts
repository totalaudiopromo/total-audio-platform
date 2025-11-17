/**
 * Blueprints List API
 * GET /api/autopilot/blueprints
 */

import { NextResponse } from 'next/server';
import { listBlueprints } from '@total-audio/pr-autopilot/blueprints/blueprintEngine';

export async function GET() {
  try {
    const blueprints = listBlueprints();
    return NextResponse.json({ blueprints });
  } catch (error) {
    console.error('Blueprint list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
