/**
 * GET /api/scenes/[slug]
 * Get scene detail with comprehensive information
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
  ScenesStore,
  MembershipEngine,
  RelationshipEngine,
  ScenePulse,
  TrendsEngine,
  MIGAdapter,
  FusionAdapter,
  CMGAdapter,
} from '@total-audio/scenes-engine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Initialize stores and engines
    const scenesStore = new ScenesStore({ supabase });
    const migAdapter = new MIGAdapter({ supabase });
    const fusionAdapter = new FusionAdapter({ supabase });
    const cmgAdapter = new CMGAdapter({ supabase });

    const membershipEngine = new MembershipEngine({
      supabase,
      scenesStore,
      migAdapter,
      cmgAdapter,
      fusionAdapter,
    });

    const trendsEngine = new TrendsEngine({
      supabase,
      scenesStore,
      fusionAdapter,
    });

    const relationshipEngine = new RelationshipEngine({
      supabase,
      scenesStore,
      migAdapter,
      fusionAdapter,
    });

    const scenePulse = new ScenePulse({
      supabase,
      scenesStore,
      trendsEngine,
      relationshipEngine,
      membershipEngine,
    });

    // Get scene basic info
    const scene = await scenesStore.getSceneBySlug(slug);
    if (!scene) {
      return NextResponse.json(
        {
          success: false,
          error: 'Scene not found',
        },
        { status: 404 }
      );
    }

    // Get additional data
    const [
      pulse,
      members,
      relationships,
      microgenres,
    ] = await Promise.all([
      scenePulse.getScenePulse(slug),
      membershipEngine.getTopEntitiesForScene(slug, undefined, 20),
      relationshipEngine.getSceneRelationships(slug),
      Promise.all(
        scene.microgenres.map(mg => scenesStore.getMicrogenreBySlug(mg))
      ),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        scene,
        pulse,
        topMembers: members,
        relationships: relationships.map(r => ({
          sceneSlug: r.source_scene_slug === slug ? r.target_scene_slug : r.source_scene_slug,
          relationType: r.relation_type,
          weight: r.weight,
        })),
        microgenres: microgenres.filter(m => m !== null),
      },
    });
  } catch (error) {
    console.error('Error fetching scene detail:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scene detail',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
