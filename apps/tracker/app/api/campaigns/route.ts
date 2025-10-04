import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { enrichCampaignWithIntelligence, type Campaign } from '@/lib/intelligence';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrich campaigns with intelligence
  const { data: benchmarks } = await supabase
    .from('benchmarks')
    .select('*');

  const enrichedCampaigns = campaigns?.map(campaign => {
    const benchmark = benchmarks?.find(
      b => b.platform === campaign.platform && b.genre === campaign.genre
    );

    if (benchmark && campaign.actual_reach > 0) {
      const intelligence = enrichCampaignWithIntelligence(campaign as Campaign, benchmark);
      return { ...campaign, intelligence };
    }

    return campaign;
  });

  return NextResponse.json(enrichedCampaigns);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  console.log('Creating campaign:', { user_id: user.id, body });

  const { data, error } = await supabase
    .from('campaigns')
    .insert([
      {
        user_id: user.id,
        name: body.name,
        platform: body.platform,
        genre: body.genre,
        start_date: body.start_date,
        end_date: body.end_date || null,
        budget: body.budget || 0,
        target_reach: body.target_reach || 0,
        actual_reach: body.actual_reach || 0,
        status: 'active',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }

  console.log('Campaign created successfully:', data);
  return NextResponse.json(data);
}
