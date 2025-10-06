import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic';
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const payload: Record<string, unknown> = {
    name: body.name,
    artist_name: body.artist_name || body.artist || body.name || 'Unknown Artist',
  };

  if (body.platform) payload.platform = body.platform;
  if (body.genre) payload.genre = body.genre;
  if (body.start_date) payload.start_date = body.start_date;
  payload.end_date = body.end_date || null;
  payload.status = body.status || 'active';

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
  const requiredColumns = new Set(['name', 'artist_name']);

  while (true) {
    const { data, error } = await supabase
      .from('campaigns')
      .update(payload)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error) {
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
      continue;
    }

    return NextResponse.json({ error: error.message, details: error, removedColumns: Array.from(removedColumns) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
