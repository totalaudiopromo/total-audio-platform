/**
 * MeshOS Insight Routes API
 * GET /api/meshos/routes - Get insight routing rules
 */

import { NextResponse } from 'next/server';
import { MeshInsightRouteStore } from '@total-audio/meshos';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
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

    // Initialize store
    const routeStore = new MeshInsightRouteStore(supabase);

    // Get routes
    const routes = await routeStore.getRoutes(profile.workspace_id);

    return NextResponse.json({
      success: true,
      routes,
      count: routes.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MeshOS Routes API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve routes',
      },
      { status: 500 }
    );
  }
}
