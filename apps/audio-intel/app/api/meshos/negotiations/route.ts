/**
 * MeshOS Negotiations API
 * GET /api/meshos/negotiations - Retrieve recent negotiations
 */

import { NextResponse } from 'next/server';
import { MeshNegotiationStore } from '@total-audio/meshos';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.id)
      .single();

    if (!profile?.workspace_id) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'pending' | 'completed' | 'failed' | null;

    // Initialize store
    const negotiationStore = new MeshNegotiationStore(supabase);

    // Get negotiations
    const negotiations = await negotiationStore.getNegotiations({
      workspace_id: profile.workspace_id,
      status: status || undefined,
      limit,
    });

    return NextResponse.json({
      success: true,
      negotiations,
      count: negotiations.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MeshOS Negotiations API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve negotiations',
      },
      { status: 500 }
    );
  }
}
