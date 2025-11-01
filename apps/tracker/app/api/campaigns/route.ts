// ============================================================================
// CAMPAIGN API ROUTES - With PRD Intelligence
// GET: List campaigns with intelligence metrics
// POST: Create new campaign
// ============================================================================

import { createServerClient } from '@total-audio/core-db/server'
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  generateCampaignInsights,
  analyzePatterns,
} from '@/lib/intelligence';
import { canCreateCampaign, getSubscriptionLimits } from '@/lib/subscription';
import type { Campaign, Benchmark, CreateCampaignPayload } from '@/lib/types/tracker';

// ============================================================================
// GET /api/campaigns - List all campaigns with intelligence
// ============================================================================
export const dynamic = 'force-dynamic';
export async function GET() {
  const supabase = await createServerClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch campaigns
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (campaignsError) {
    return NextResponse.json(
      { error: campaignsError.message },
      { status: 500 }
    );
  }

  // Fetch benchmarks for intelligence
  const { data: benchmarks } = await supabase
    .from('benchmarks')
    .select('*');

  const benchmarkMap = new Map<string, Benchmark>();
  benchmarks?.forEach((b) => {
    benchmarkMap.set(`${b.platform}-${b.genre}`, b as Benchmark);
  });

  // Enrich campaigns with insights
  const enrichedCampaigns = (campaigns || []).map((campaign) => {
    const typedCampaign = campaign as Campaign;

    if (typedCampaign.platform && typedCampaign.genre) {
      const key = `${typedCampaign.platform}-${typedCampaign.genre}`;
      const benchmark = benchmarkMap.get(key);

      const insights = generateCampaignInsights(typedCampaign, benchmark || null);

      return {
        ...typedCampaign,
        insights,
      };
    }

    return typedCampaign;
  });

  // Generate patterns across all campaigns
  const patterns = analyzePatterns(enrichedCampaigns as Campaign[]);

  // Calculate dashboard metrics
  const totalCampaigns = enrichedCampaigns.length;
  const activeCampaigns = enrichedCampaigns.filter(
    (c) => c.status === 'active'
  ).length;
  const completedCampaigns = enrichedCampaigns.filter(
    (c) => c.status === 'completed'
  ).length;
  const totalSpend = enrichedCampaigns.reduce(
    (sum, c) => sum + (c.budget || 0),
    0
  );

  const campaignsWithResults = enrichedCampaigns.filter(
    (c) => c.actual_reach > 0 && c.target_reach > 0
  );

  const avgSuccessRate = campaignsWithResults.length > 0
    ? campaignsWithResults.reduce((sum, c) => sum + c.success_rate, 0) /
      campaignsWithResults.length
    : 0;

  const metrics = {
    total_campaigns: totalCampaigns,
    active_campaigns: activeCampaigns,
    completed_campaigns: completedCampaigns,
    total_spend: totalSpend,
    avg_success_rate: Math.round(avgSuccessRate * 10) / 10,
  };

  return NextResponse.json({
    campaigns: enrichedCampaigns,
    patterns,
    metrics,
  });
}

// ============================================================================
// POST /api/campaigns - Create new campaign
// ============================================================================
export async function POST(request: Request) {
  const supabase = await createServerClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check subscription limits before creating campaign
  const canCreate = await canCreateCampaign(user.id);
  if (!canCreate) {
    const limits = await getSubscriptionLimits(user.id);
    return NextResponse.json(
      {
        error: 'Campaign limit reached',
        message: `You've reached your campaign limit of ${limits?.campaignsLimit}. Upgrade your plan to create more campaigns.`,
        requiresUpgrade: true,
        limits,
      },
      { status: 403 }
    );
  }

  const body = await request.json();

  // Validate required fields
  if (!body.name) {
    return NextResponse.json(
      { error: 'Campaign name is required' },
      { status: 400 }
    );
  }

  // Build campaign payload
  const payload: Record<string, unknown> = {
    user_id: user.id,
    name: body.name,
    status: body.status || 'planning',
  };

  // Optional fields
  if (body.artist_name) payload.artist_name = body.artist_name;
  if (body.platform) payload.platform = body.platform;
  if (body.genre) payload.genre = body.genre;
  if (body.target_type) payload.target_type = body.target_type;
  if (body.notes) payload.notes = body.notes;

  // Dates
  if (body.start_date) payload.start_date = body.start_date;
  if (body.end_date) payload.end_date = body.end_date;

  // Numbers
  if (body.budget !== undefined && body.budget !== '') {
    const budget = Number(body.budget);
    if (!isNaN(budget)) payload.budget = budget;
  }

  if (body.target_reach !== undefined && body.target_reach !== '') {
    const targetReach = Number(body.target_reach);
    if (!isNaN(targetReach)) payload.target_reach = targetReach;
  }

  if (body.actual_reach !== undefined && body.actual_reach !== '') {
    const actualReach = Number(body.actual_reach);
    if (!isNaN(actualReach)) payload.actual_reach = actualReach;
  }

  // Optional metric fields
  if (body.streams) payload.streams = Number(body.streams);
  if (body.saves) payload.saves = Number(body.saves);
  if (body.social_engagement) payload.social_engagement = Number(body.social_engagement);

  // Insert campaign
  const { data, error } = await supabase
    .from('campaigns')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }

  // Enrich with intelligence
  if (data.platform && data.genre) {
    const { data: benchmark } = await supabase
      .from('benchmarks')
      .select('*')
      .eq('platform', data.platform)
      .eq('genre', data.genre)
      .single();

    const insights = generateCampaignInsights(data as Campaign, benchmark);

    return NextResponse.json({
      ...data,
      insights,
    });
  }

  return NextResponse.json(data);
}
