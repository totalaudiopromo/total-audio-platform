/**
 * POST /api/studio/trailer/export - Export trailer render spec
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createVideoExporter } from '@total-audio/cis-video';
import type { CISTrailerTimeline } from '@total-audio/cis-video';

export async function POST(request: Request) {
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

    // Parse request body
    const body = await request.json();
    const { projectId, timeline, renderOptions } = body;

    // Validate required fields
    if (!projectId || !timeline) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['projectId', 'timeline'],
        },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('cis_projects')
      .select('id, name')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Generate render spec
    const exporter = createVideoExporter();
    const spec = exporter.generateRenderSpec(timeline as CISTrailerTimeline, {
      width: renderOptions?.width || 1920,
      height: renderOptions?.height || 1080,
      fps: renderOptions?.fps || 30,
      format: renderOptions?.format || 'mp4',
      quality: renderOptions?.quality || 'high',
    });

    // Export to JSON
    const json = await exporter.exportToJSON(spec);

    // Store export metadata
    const { error: artifactError } = await supabase
      .from('cis_artifacts')
      .insert({
        project_id: projectId,
        user_id: user.id,
        type: 'trailer',
        name: `${project.name} - Trailer`,
        metadata: {
          duration: timeline.duration,
          clipCount: timeline.clips.length,
          format: renderOptions?.format || 'mp4',
          resolution: `${renderOptions?.width || 1920}x${renderOptions?.height || 1080}`,
          fps: renderOptions?.fps || 30,
        },
      });

    if (artifactError) {
      console.error('Error storing artifact metadata:', artifactError);
      // Continue anyway - export succeeded
    }

    return NextResponse.json({
      success: true,
      projectId,
      projectName: project.name,
      spec: JSON.parse(json),
      renderOptions: {
        width: renderOptions?.width || 1920,
        height: renderOptions?.height || 1080,
        fps: renderOptions?.fps || 30,
        format: renderOptions?.format || 'mp4',
        quality: renderOptions?.quality || 'high',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/studio/trailer/export:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
