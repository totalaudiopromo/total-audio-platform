import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { enrichCampaignWithIntelligence, type Campaign } from '@/lib/intelligence';
import { appendFile } from 'node:fs/promises';

type CampaignInsertPayload = Record<string, unknown>;

async function logDebug(event: string, payload: unknown) {
  try {
    await appendFile(
      '/tmp/tracker-campaign-debug.log',
      `${new Date().toISOString()} ${event} ${JSON.stringify(payload)}\n`
    );
  } catch (error) {
    console.error('Failed to write debug log', error);
  }
}

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

  await logDebug('campaign:create:start', { user_id: user.id, body });

  const payload: CampaignInsertPayload = {
    user_id: user.id,
    name: body.name,
    status: 'active',
  };

  if (body.platform) payload.platform = body.platform;
  if (body.genre) payload.genre = body.genre;
  if (body.start_date) payload.start_date = body.start_date;
  if (body.end_date) payload.end_date = body.end_date;

  if (body.budget !== undefined && body.budget !== '') {
    const budget = Number(body.budget);
    if (!Number.isNaN(budget)) payload.budget = budget;
  }

  if (body.target_reach !== undefined && body.target_reach !== '') {
    const targetReach = Number.parseInt(body.target_reach, 10);
    if (!Number.isNaN(targetReach)) payload.target_reach = targetReach;
  }

  if (body.actual_reach !== undefined && body.actual_reach !== '') {
    const actualReach = Number.parseInt(body.actual_reach, 10);
    if (!Number.isNaN(actualReach)) payload.actual_reach = actualReach;
  }

  const removedColumns = new Set<string>();
  const requiredColumns = new Set(['user_id', 'name']);

  while (true) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([payload])
      .select()
      .single();

    if (!error) {
      await logDebug('campaign:create:success', { data, removedColumns: Array.from(removedColumns) });
      console.log('Campaign created successfully:', data);
      return NextResponse.json(data);
    }

    const missingColumnMatch = error.message?.match(/'([^']+)' column/);
    const missingColumn = missingColumnMatch?.[1];

    if (
      missingColumn &&
      missingColumn in payload &&
      !removedColumns.has(missingColumn) &&
      !requiredColumns.has(missingColumn)
    ) {
      removedColumns.add(missingColumn);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete payload[missingColumn];
      await logDebug('campaign:create:retry', { missingColumn, payload });
      continue;
    }

    await logDebug('campaign:create:error', { error, removedColumns: Array.from(removedColumns) });
    console.error('Campaign creation error:', error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
}
