/**
 * GET /api/scenes/[slug]
 * Get scene detail with comprehensive information
 */

import { NextRequest } from 'next/server';
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
import { SceneSlugSchema } from '@total-audio/scenes-engine/src/api/validation';
import {
  successResponse,
  notFoundResponse,
  internalErrorResponse,
  handleValidationError,
} from '@total-audio/scenes-engine/src/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Validate path parameters
    const { slug } = await params;
    const paramResult = SceneSlugSchema.safeParse({ slug });

    if (!paramResult.success) {
      return handleValidationError(paramResult.error);
    }

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
      return notFoundResponse('Scene', slug);
    }

    // Get additional data in parallel
    const [
      pulse,
      members,
      relationships,
      microgenres,
    ] = await Promise.all([
      scenePulse.getScenePulse(slug).catch(() => null),
      membershipEngine.getTopEntitiesForScene(slug, undefined, 20).catch(() => []),
      relationshipEngine.getSceneRelationships(slug).catch(() => []),
      Promise.all(
        scene.microgenres.map(mg =>
          scenesStore.getMicrogenreBySlug(mg).catch(() => null)
        )
      ),
    ]);

    return successResponse({
      scene,
      pulse,
      topMembers: members,
      relationships: relationships.map(r => ({
        sceneSlug: r.source_scene_slug === slug ? r.target_scene_slug : r.source_scene_slug,
        relationType: r.relation_type,
        weight: r.weight,
      })),
      microgenres: microgenres.filter(m => m !== null),
    });
  } catch (error) {
    console.error('Error fetching scene detail:', error);
    return internalErrorResponse(error);
  }
}
