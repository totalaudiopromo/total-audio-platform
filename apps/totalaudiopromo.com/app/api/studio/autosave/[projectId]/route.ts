/**
 * POST /api/studio/autosave/[projectId] - Save autosave snapshot
 * GET /api/studio/autosave/[projectId] - Get latest snapshot
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json();
    const { snapshot, sessionId } = body;

    if (!snapshot) {
      return NextResponse.json(
        { error: 'Snapshot required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get user from auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const snapshotStr = JSON.stringify(snapshot);
    const sizeBytes = new Blob([snapshotStr]).size;

    const { data, error } = await supabase
      .from('cis_autosave_snapshots')
      .insert({
        project_id: params.projectId,
        session_id: sessionId,
        user_id: user.id,
        snapshot,
        size_bytes: sizeBytes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, snapshot: data });
  } catch (error) {
    console.error('Error saving autosave:', error);
    return NextResponse.json(
      { error: 'Failed to save autosave' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('cis_autosave_snapshots')
      .select('*')
      .eq('project_id', params.projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ snapshot: null });
      }
      throw error;
    }

    return NextResponse.json({ snapshot: data });
  } catch (error) {
    console.error('Error fetching autosave:', error);
    return NextResponse.json(
      { error: 'Failed to fetch autosave' },
      { status: 500 }
    );
  }
}
