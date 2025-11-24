/**
 * GET /api/studio/projects/by-artist/[artistSlug] - Get projects for specific artist
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { artistSlug: string } }
) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { artistSlug } = params;

    // Fetch projects for this artist
    const { data: projects, error } = await supabase
      .from('cis_projects')
      .select('*')
      .eq('user_id', user.id)
      .eq('artist_slug', artistSlug)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects by artist:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    return NextResponse.json({ projects, artistSlug });
  } catch (error) {
    console.error('Unexpected error in GET /api/studio/projects/by-artist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
