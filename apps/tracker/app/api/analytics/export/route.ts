import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toCSV } from '@/lib/csv';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query campaigns for current user
    let query = supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (start) query = query.gte('start_date', start);
    if (end) query = query.lte('start_date', end);

    const { data, error } = await query;
    if (error) {
      console.error('Export query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const csv = toCSV((data ?? []).map((campaign) => ({
      name: campaign.name,
      artist_name: campaign.artist_name,
      platform: campaign.platform,
      genre: campaign.genre,
      status: campaign.status,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      budget: campaign.budget,
      target_reach: campaign.target_reach,
      actual_reach: campaign.actual_reach,
      success_rate: campaign.success_rate,
      cost_per_result: campaign.cost_per_result,
      performance_score: campaign.performance_score,
      percentile_rank: campaign.percentile_rank,
      created_at: campaign.created_at,
    })));

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="campaigns.csv"',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}











