/**
 * MeshOS Policy API
 * GET /api/meshos/policy - Get policy status
 */

import { NextResponse } from 'next/server';
import { PolicyEngine } from '@total-audio/meshos';
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

    // Initialize policy engine
    const policyEngine = new PolicyEngine(profile.workspace_id, {
      quiet_hours: { start: '22:00', end: '08:00', timezone: 'Europe/London' },
      contact_fatigue: {
        max_contacts_per_day: 50,
        max_contacts_per_week: 200,
        min_days_between_contacts: 2,
      },
    });

    // Get current policy status
    const policyStatus = {
      workspace_id: profile.workspace_id,
      quiet_hours: { start: '22:00', end: '08:00', timezone: 'Europe/London' },
      contact_fatigue: {
        max_contacts_per_day: 50,
        max_contacts_per_week: 200,
        min_days_between_contacts: 2,
      },
      // Add more policy fields as needed
    };

    return NextResponse.json({
      success: true,
      policy: policyStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MeshOS Policy API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve policy',
      },
      { status: 500 }
    );
  }
}
