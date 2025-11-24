/**
 * GET /api/studio/projects/recent - Get recent projects for current user
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

    // Get search params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Fetch recent projects
    const { data: projects, error } = await supabase
      .from('cis_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Unexpected error in GET /api/studio/projects/recent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
