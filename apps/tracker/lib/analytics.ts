import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import type { Campaign, CampaignActivity } from '@/lib/types';

export type OverviewStats = {
  totalCampaigns: number;
  activeCampaigns: number;
  responseRate: number; // 0..1
  budgetAllocated: number;
  budgetSpent: number;
};

export async function getOverviewStats(): Promise<OverviewStats> {
  const supabase = await createServerClient(cookies());

  const { data: campaigns, error: cErr } = await supabase
    .from('campaigns')
    .select('*');
  if (cErr) throw cErr;

  const { data: activities, error: aErr } = await supabase
    .from('campaign_activities')
    .select('id, status');
  if (aErr) throw aErr;

  const totalCampaigns = campaigns?.length ?? 0;
  const activeCampaigns =
    (campaigns as Campaign[] | null)?.filter(c => c.status === 'active')
      .length ?? 0;
  const budgetAllocated =
    (campaigns as Campaign[] | null)?.reduce(
      (sum, c) => sum + (Number(c.budget) || 0),
      0
    ) ?? 0;
  const budgetSpent =
    (campaigns as Campaign[] | null)?.reduce(
      (sum, c) => sum + (Number(c.spent) || 0),
      0
    ) ?? 0;

  const totalSubmissions =
    (activities as Pick<CampaignActivity, 'id' | 'status'>[] | null)?.length ??
    0;
  const responses =
    (activities as Pick<CampaignActivity, 'id' | 'status'>[] | null)?.filter(
      a => ['responded', 'accepted', 'declined'].includes(a.status)
    ).length ?? 0;
  const responseRate = totalSubmissions > 0 ? responses / totalSubmissions : 0;

  return {
    totalCampaigns,
    activeCampaigns,
    responseRate,
    budgetAllocated,
    budgetSpent,
  };
}

export type TimeSeriesPoint = {
  date: string;
  submissions: number;
  responses: number;
};

export async function getSubmissionResponseSeries(
  startISO?: string,
  endISO?: string
): Promise<TimeSeriesPoint[]> {
  const supabase = await createServerClient(cookies());
  let query = supabase
    .from('campaign_activities')
    .select('submitted_at, response_at, status')
    .order('submitted_at', { ascending: true, nullsFirst: false });

  if (startISO) query = query.gte('submitted_at', startISO);
  if (endISO) query = query.lte('submitted_at', endISO);

  const { data, error } = await query;
  if (error) throw error;

  const map = new Map<string, { submissions: number; responses: number }>();
  for (const row of (data ?? []) as any[]) {
    const subDate = row.submitted_at
      ? new Date(row.submitted_at).toISOString().slice(0, 10)
      : null;
    if (subDate) {
      const e = map.get(subDate) ?? { submissions: 0, responses: 0 };
      e.submissions += 1;
      map.set(subDate, e);
    }
    const isResponse = ['responded', 'accepted', 'declined'].includes(
      row.status
    );
    const resDate = row.response_at
      ? new Date(row.response_at).toISOString().slice(0, 10)
      : subDate;
    if (isResponse && resDate) {
      const e = map.get(resDate) ?? { submissions: 0, responses: 0 };
      e.responses += 1;
      map.set(resDate, e);
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({
      date,
      submissions: v.submissions,
      responses: v.responses,
    }));
}

export type PlatformBreakdownItem = {
  platform: string;
  submissions: number;
  responses: number;
  acceptanceRate: number;
};

export async function getPlatformBreakdown(
  startISO?: string,
  endISO?: string
): Promise<PlatformBreakdownItem[]> {
  const supabase = await createServerClient(cookies());
  let query = supabase
    .from('campaign_activities')
    .select('platform, status, submitted_at');
  if (startISO) query = query.gte('submitted_at', startISO);
  if (endISO) query = query.lte('submitted_at', endISO);
  const { data, error } = await query;
  if (error) throw error;

  const byPlatform = new Map<
    string,
    { submissions: number; responses: number; accepted: number }
  >();
  for (const row of (data ?? []) as any[]) {
    const key = row.platform || 'Unknown';
    const agg = byPlatform.get(key) ?? {
      submissions: 0,
      responses: 0,
      accepted: 0,
    };
    agg.submissions += 1;
    if (['responded', 'accepted', 'declined'].includes(row.status))
      agg.responses += 1;
    if (row.status === 'accepted') agg.accepted += 1;
    byPlatform.set(key, agg);
  }
  return Array.from(byPlatform.entries()).map(([platform, v]) => ({
    platform,
    submissions: v.submissions,
    responses: v.responses,
    acceptanceRate: v.submissions ? v.accepted / v.submissions : 0,
  }));
}
