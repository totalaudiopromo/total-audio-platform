/**
 * Cross-Mission Learning API
 * GET /api/autopilot/learning/cross-mission
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateCrossMissionReport } from '@total-audio/pr-autopilot/learning/crossMissionLearning';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await generateCrossMissionReport(supabase, user.id);

    return NextResponse.json(report);
  } catch (error) {
    console.error('Cross-mission learning error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
