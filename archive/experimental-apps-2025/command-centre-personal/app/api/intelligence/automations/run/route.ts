import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { executeAutomation, type AutomationAction } from '@total-audio/automations-drawer';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { action, payload } = await request.json();

    if (!action || typeof action !== 'string') {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Get workspace ID
    const { data: workspaceMember } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single();

    if (!workspaceMember) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    // Build fusion context
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Execute automation
    const result = await executeAutomation(
      {
        action: action as AutomationAction,
        payload: payload || {},
        context: fusionContext,
        userId: user.id,
        workspaceId: workspaceMember.workspace_id,
      },
      supabase
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Automations API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
