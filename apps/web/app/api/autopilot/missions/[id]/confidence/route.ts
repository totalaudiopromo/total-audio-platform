/**
 * Confidence Scoring API
 * POST /api/autopilot/missions/[id]/confidence
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { calculateConfidence } from '@total-audio/pr-autopilot/confidence/confidenceEngine';

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
    const { taskId, agentRole } = body;

    // Get task and mission
    const { data: task } = await supabase
      .from('autopilot_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    const { data: mission } = await supabase
      .from('autopilot_missions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!task || !mission) {
      return NextResponse.json({ error: 'Task or mission not found' }, { status: 404 });
    }

    // Calculate confidence
    const confidence = calculateConfidence({
      agentRole,
      task: task as any,
      mission: mission as any,
      availableData: task.input as any,
    });

    return NextResponse.json({ confidence });
  } catch (error) {
    console.error('Confidence calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
