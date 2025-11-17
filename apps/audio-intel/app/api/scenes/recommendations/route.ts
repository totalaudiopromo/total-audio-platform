/**
 * GET /api/scenes/recommendations
 * Get personalized scene and microgenre recommendations for current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
  ScenesStore,
  RecommendationEngine,
  MembershipEngine,
  ScenePulse,
  TrendsEngine,
  RelationshipEngine,
  MIGAdapter,
  FusionAdapter,
  CMGAdapter,
} from '@total-audio/scenes-engine';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const artistSlug = searchParams.get('artist');

    // Initialize dependencies
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

    const recommendationEngine = new RecommendationEngine({
      supabase,
      scenesStore,
      cmgAdapter,
      fusionAdapter,
      membershipEngine,
      scenePulse,
    });

    // Get recommendations
    let recommendations;
    if (artistSlug) {
      recommendations = await recommendationEngine.recommendScenesForArtist(artistSlug);
    } else {
      recommendations = await recommendationEngine.recommendScenesForUser(user.id);
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate recommendations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
