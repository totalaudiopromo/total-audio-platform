import { NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's workspaces
    const { data: memberships, error: memberError } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id);

    if (memberError) {
      console.error('Error fetching workspace memberships:', memberError);
      return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
    }

    const workspaceIds = memberships?.map(m => m.workspace_id) || [];

    if (workspaceIds.length === 0) {
      // No workspaces yet - fallback to email-based query for backward compatibility
      const userId = user.email || user.id;
      let query = supabase
        .from('pitches')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: pitches, error, count } = await query;

      if (error) {
        console.error('Error fetching pitches:', error);
        return NextResponse.json({ error: 'Failed to fetch pitches' }, { status: 500 });
      }

      return NextResponse.json({
        pitches: pitches || [],
        total: count || 0,
        limit,
        offset,
      });
    }

    // Workspace-based query
    let query = supabase
      .from('pitches')
      .select('*', { count: 'exact' })
      .in('workspace_id', workspaceIds)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: pitches, error, count } = await query;

    if (error) {
      console.error('Error fetching pitches:', error);
      return NextResponse.json({ error: 'Failed to fetch pitches' }, { status: 500 });
    }

    return NextResponse.json({
      pitches: pitches || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Pitches API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pitches' },
      { status: 500 }
    );
  }
}
