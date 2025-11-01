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

    // Get total pitches
    const { count: totalPitches } = await supabaseAdmin
      .from('pitches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get sent pitches
    const { count: sentPitches } = await supabaseAdmin
      .from('pitches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'sent');

    // Get draft pitches
    const { count: draftPitches } = await supabaseAdmin
      .from('pitches')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'draft');

    // Calculate response rate (mock for now - would need actual response tracking)
    const responseRate =
      sentPitches && sentPitches > 0
        ? Math.round(sentPitches * 0.15 * 10) / 10 // 15% mock response rate
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
    return NextResponse.json({ error: error.message || 'Failed to fetch stats' }, { status: 500 });
  }
}
