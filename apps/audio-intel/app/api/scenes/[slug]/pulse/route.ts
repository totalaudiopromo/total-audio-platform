/**
 * GET /api/scenes/[slug]/pulse
 * Get real-time pulse snapshot for a scene
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
  ScenesStore,
  TrendsEngine,
  RelationshipEngine,
  MembershipEngine,
  ScenePulse,
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

    // Initialize dependencies
    const scenesStore = new ScenesStore({ supabase });
    const migAdapter = new MIGAdapter({ supabase });
    const fusionAdapter = new FusionAdapter({ supabase });
    const cmgAdapter = new CMGAdapter({ supabase });

    const trendsEngine = new TrendsEngine({
      supabase,
      scenesStore,
      fusionAdapter,
    });

    const membershipEngine = new MembershipEngine({
      supabase,
      scenesStore,
      migAdapter,
      cmgAdapter,
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

    // Get pulse
    const pulse = await scenePulse.getScenePulse(slug);

    return NextResponse.json({
      success: true,
      data: pulse,
    });
  } catch (error) {
    console.error('Error fetching scene pulse:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scene pulse',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
