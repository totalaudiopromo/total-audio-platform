/**
 * MeshOS 7-Day Plan API
 * GET /api/meshos/plan/7d - Generate 7-day plan
 */

import { NextResponse } from 'next/server';
import { MeshOrchestrator } from '@total-audio/meshos';
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

    // Initialize orchestrator
    const orchestrator = new MeshOrchestrator({
      workspace_id: profile.workspace_id,
      enable_auto_planning: true,
      enable_auto_drift_detection: false,
      enable_auto_negotiation: false,
    });

    // Generate 7-day plan
    const plan = await orchestrator.triggerPlanning('7d');

    return NextResponse.json({
      success: true,
      plan,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MeshOS 7-Day Plan API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate 7-day plan',
      },
      { status: 500 }
    );
  }
}
