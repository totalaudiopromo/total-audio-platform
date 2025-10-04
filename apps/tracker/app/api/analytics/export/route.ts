import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toCSV } from '@/lib/csv';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  const supabase = await createClient();
  let query = supabase.from('campaign_activities').select('*').order('submitted_at', { ascending: true });
  if (start) query = query.gte('submitted_at', new Date(start).toISOString());
  if (end) query = query.lte('submitted_at', new Date(end).toISOString());
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const csv = toCSV((data ?? []).map((r) => ({
    id: r.id,
    campaign_id: r.campaign_id,
    type: r.type,
    platform: r.platform,
    contact_name: r.contact_name,
    contact_email: r.contact_email,
    status: r.status,
    notes: r.notes,
    submitted_at: r.submitted_at,
    response_at: r.response_at,
    created_at: r.created_at,
    updated_at: r.updated_at,
  })));

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="activities.csv"',
    },
  });
}






