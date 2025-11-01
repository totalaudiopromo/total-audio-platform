import { NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient(cookies());
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.email || user.id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = (supabase)
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
      return NextResponse.json(
        { error: 'Failed to fetch pitches' },
        { status: 500 }
      );
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

