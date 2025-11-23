/**
 * Reject Override Request API
 * POST /api/autopilot/override/[id]/reject
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { resolveOverrideRequest } from '@total-audio/pr-autopilot/override/overrideHooks';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reason } = body;

    const result = await resolveOverrideRequest(supabase, params.id, {
      action: 'reject',
      userId: user.id,
      notes: reason,
    });

    return NextResponse.json({ success: true, request: result });
  } catch (error) {
    console.error('Override rejection error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
