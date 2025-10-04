import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const genre = searchParams.get('genre');

  const supabase = await createClient();

  try {
    let query = supabase.from('benchmarks').select('*');

    if (platform) {
      query = query.eq('platform', platform);
    }

    if (genre) {
      query = query.eq('genre', genre);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching benchmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch benchmarks' },
      { status: 500 }
    );
  }
}
