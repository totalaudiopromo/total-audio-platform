/**
 * Apply Blueprint API Route
 *
 * POST /api/autopilot/missions/[id]/apply-blueprint
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { applyBlueprintToMission } from '@total-audio/pr-autopilot/blueprints/blueprintEngine';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const missionId = params.id;
    const body = await request.json();
    const { blueprintName } = body;

    if (!blueprintName) {
      return NextResponse.json(
        { error: 'blueprintName is required' },
        { status: 400 }
      );
    }

    // Verify mission exists and belongs to user
    const { data: mission, error: missionError } = await supabase
      .from('autopilot_missions')
      .select('id, user_id')
      .eq('id', missionId)
      .single();

    if (missionError || !mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    if (mission.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Apply blueprint
    const result = await applyBlueprintToMission(supabase, missionId, blueprintName);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to apply blueprint' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tasksCreated: result.tasksCreated,
      message: `Blueprint "${blueprintName}" applied successfully`,
    });
  } catch (error) {
    console.error('Apply blueprint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
