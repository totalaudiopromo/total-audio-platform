/**
 * CoachOS Sessions API
 * GET /api/coach/sessions - Get user's coaching sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { getUserSessions, getCurrentWeekSession } from '@total-audio/coach-os';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const current = searchParams.get('current') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (current) {
      // Get current week's session
      const session = await getCurrentWeekSession(user.id);
      return NextResponse.json({ session });
    }

    // Get all sessions
    const sessions = await getUserSessions(user.id, limit);
    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('Failed to get sessions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get sessions' },
      { status: 500 }
    );
  }
}
