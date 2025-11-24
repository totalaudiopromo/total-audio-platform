/**
 * POST /api/studio/identity-signal - Send identity signal to Identity Kernel
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createIdentityKernelBridge } from '@total-audio/cis-integrations';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { projectId, artistSlug, signalType, payload } = body;

    // Validate required fields
    if (!projectId || !artistSlug || !signalType || !payload) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['projectId', 'artistSlug', 'signalType', 'payload'],
        },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('cis_projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Push signal to Identity Kernel
    const identityBridge = createIdentityKernelBridge(supabase);
    const success = await identityBridge.pushIdentitySignal(
      projectId,
      user.id,
      artistSlug,
      signalType,
      payload
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to push identity signal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      projectId,
      artistSlug,
      signalType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/studio/identity-signal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
