import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).email || 'demo-user';
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('pitches')
      .select('*, intel_contacts(*)', { count: 'exact' })
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
  } catch (error: any) {
    console.error('Pitches API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pitches' },
      { status: 500 }
    );
  }
}
