// ============================================================================
// BENCHMARKS API ROUTE
// GET: Fetch industry benchmark data
// ============================================================================

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const genre = searchParams.get('genre');

  let query = supabase.from('benchmarks').select('*');

  if (platform) {
    query = query.eq('platform', platform);
  }

  if (genre) {
    query = query.eq('genre', genre);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If requesting specific platform + genre, return single benchmark
  if (platform && genre && data && data.length > 0) {
    return NextResponse.json(data[0]);
  }

  return NextResponse.json(data || []);
}
