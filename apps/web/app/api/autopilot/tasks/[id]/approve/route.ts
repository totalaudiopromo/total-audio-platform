/**
 * API Route: /api/autopilot/tasks/[id]/approve
 *
 * POST - Approve a waiting task
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

    // TODO: Get auth user
    // const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Approve task
    // const coordinator = new CoordinatorAgent(supabase);
    // await coordinator.approveTask(taskId, user.id);

    return NextResponse.json({
      success: true,
      task_id: taskId,
      status: 'approved',
    });
  } catch (error) {
    console.error('Error approving task:', error);
    return NextResponse.json(
      { error: 'Failed to approve task' },
      { status: 500 }
    );
  }
}
