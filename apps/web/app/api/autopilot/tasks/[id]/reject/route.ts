/**
 * API Route: /api/autopilot/tasks/[id]/reject
 *
 * POST - Reject a waiting task
 */

import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@total-audio/core-db/server';
// import { CoordinatorAgent } from '@total-audio/pr-autopilot/agents';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const body = await request.json();

    // TODO: Get auth user
    // const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Reject task
    // const coordinator = new CoordinatorAgent(supabase);
    // await coordinator.rejectTask(taskId, user.id, body.reason);

    return NextResponse.json({
      success: true,
      task_id: taskId,
      status: 'rejected',
    });
  } catch (error) {
    console.error('Error rejecting task:', error);
    return NextResponse.json(
      { error: 'Failed to reject task' },
      { status: 500 }
    );
  }
}
