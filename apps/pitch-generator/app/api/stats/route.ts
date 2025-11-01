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

    // Get total pitches
    const { count: totalPitches } = await (supabase)
      .from('pitches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get sent pitches
    const { count: sentPitches } = await (supabase)
      .from('pitches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'sent');

    // Get draft pitches
    const { count: draftPitches } = await (supabase)
      .from('pitches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'draft');

    // Calculate response rate (mock for now - would need actual response tracking)
    const responseRate = sentPitches && sentPitches > 0 
      ? Math.round((sentPitches * 0.15) * 10) / 10  // 15% mock response rate
      : 0;

    return NextResponse.json({
      stats: {
        totalPitches: totalPitches || 0,
        sentPitches: sentPitches || 0,
        draftPitches: draftPitches || 0,
        responseRate,
      },
    });
  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

