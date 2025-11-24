/**
 * GET /api/studio/brandkit/[artistSlug] - Get brand kit for artist
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { genreToPalette } from '@total-audio/cis-brandkit';

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

    // Get artist's projects to find brand elements
    const { data: projects, error: projectsError } = await supabase
      .from('cis_projects')
      .select('id, metadata')
      .eq('user_id', user.id)
      .eq('artist_slug', artistSlug)
      .order('updated_at', { ascending: false });

    if (projectsError) {
      console.error('Error fetching artist projects:', projectsError);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    // Get artifacts (cover art, brand kits) from projects
    const projectIds = projects?.map((p) => p.id) || [];
    const { data: artifacts, error: artifactsError } = await supabase
      .from('cis_artifacts')
      .select('*')
      .in('project_id', projectIds)
      .in('type', ['cover-art', 'moodboard', 'brand-kit'])
      .order('created_at', { ascending: false });

    if (artifactsError) {
      console.error('Error fetching artifacts:', artifactsError);
      return NextResponse.json(
        { error: 'Failed to fetch brand artifacts' },
        { status: 500 }
      );
    }

    // Aggregate brand kit data
    const palettes: any[] = [];
    const logos: any[] = [];
    const typography: any[] = [];

    artifacts?.forEach((artifact) => {
      if (artifact.metadata?.palette) {
        palettes.push(artifact.metadata.palette);
      }
      if (artifact.metadata?.logo) {
        logos.push(artifact.metadata.logo);
      }
      if (artifact.metadata?.typography) {
        typography.push(artifact.metadata.typography);
      }
    });

    // If no brand data found, generate default from genre
    let defaultPalette = null;
    if (palettes.length === 0) {
      const firstProject = projects?.[0];
      const genre = firstProject?.metadata?.genre as string | undefined;
      if (genre) {
        defaultPalette = genreToPalette(genre);
      }
    }

    return NextResponse.json({
      artistSlug,
      brandKit: {
        palettes: palettes.length > 0 ? palettes : defaultPalette ? [defaultPalette] : [],
        logos,
        typography,
      },
      projectCount: projects?.length || 0,
      artifactCount: artifacts?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/studio/brandkit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
