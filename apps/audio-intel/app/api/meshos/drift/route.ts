/**
 * MeshOS Drift API
 * GET /api/meshos/drift - Detect system drift
 */

import { NextResponse } from 'next/server';
import { DriftEngine } from '@total-audio/meshos';
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

    // Initialize drift engine
    const driftEngine = new DriftEngine(profile.workspace_id);

    // Detect drift
    const driftReports = await driftEngine.detectDrift();

    return NextResponse.json({
      success: true,
      drift_reports: driftReports,
      count: driftReports.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MeshOS Drift API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to detect drift',
      },
      { status: 500 }
    );
  }
}
