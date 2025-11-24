/**
 * CoachOS Session API (Single Session)
 * PATCH /api/coach/sessions/[id] - Update session (reflections, completion)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { updateSessionReflections, completeSession } from '@total-audio/coach-os';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const sessionId = params.id;

    // Handle completion
    if (body.complete === true) {
      const session = await completeSession(sessionId);
      return NextResponse.json({ session });
    }

    // Update reflections
    if (body.reflections) {
      const session = await updateSessionReflections(sessionId, body.reflections);
      return NextResponse.json({ session });
    }

    return NextResponse.json(
      { error: 'No valid update provided' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Failed to update session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update session' },
      { status: 500 }
    );
  }
}
