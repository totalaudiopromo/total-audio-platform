/**
 * GET /api/studio/context/[projectId]
 * Returns complete CISContext for a project
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ContextBuilder, createFusionContextBridge, createCMGBridge, createIdentityKernelBridge, createMIGScenesBridge } from '@total-audio/cis-integrations';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get project details
    const { data: project, error } = await supabase
      .from('cis_projects')
      .select('*')
      .eq('id', params.projectId)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Build context
    const contextBuilder = new ContextBuilder({
      fusionBridge: createFusionContextBridge(),
      cmgBridge: createCMGBridge(),
      identityBridge: createIdentityKernelBridge(undefined, supabase),
      migBridge: createMIGScenesBridge(),
    });

    const context = await contextBuilder.buildContext(
      params.projectId,
      project.user_id,
      {
        artistSlug: project.artist_slug,
        campaignId: project.campaign_id,
        releaseId: project.release_id,
      }
    );

    return NextResponse.json({ context });
  } catch (error) {
    console.error('Error fetching context:', error);
    return NextResponse.json(
      { error: 'Failed to fetch context' },
      { status: 500 }
    );
  }
}
