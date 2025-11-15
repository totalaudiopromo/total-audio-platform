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
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
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
        .from('contacts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`name.ilike.%${search}%,outlet.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data: contacts, error, count } = await query;

      if (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
      }

      return NextResponse.json({
        contacts: contacts || [],
        total: count || 0,
        limit,
        offset,
      });
    }

    // Workspace-based query
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .in('workspace_id', workspaceIds)
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,outlet.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: contacts, error, count } = await query;

    if (error) {
      console.error('Error fetching contacts:', error);
      return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }

    return NextResponse.json({
      contacts: contacts || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Contacts API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
