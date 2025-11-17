/**
 * MIG API Route: Get Recommendations
 * POST /api/mig/recommend
 * Body: { node_id: "uuid", type: "similar_artists" | "pitch_targets" | "scenes" | "collaborators", options: {} }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  recommendSimilarArtists,
  recommendSimilarOutlets,
  recommendPitchTargets,
  recommendScenes,
  recommendCollaborators,
} from '@total-audio/music-industry-graph';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { node_id, type, options } = body;

    if (!node_id || !type) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'node_id and type are required', code: 'MISSING_PARAMS' },
        },
        { status: 400 }
      );
    }

    let recommendations;

    switch (type) {
      case 'similar_artists':
        recommendations = await recommendSimilarArtists(node_id, options);
        break;

      case 'similar_outlets':
        recommendations = await recommendSimilarOutlets(node_id, options);
        break;

      case 'pitch_targets':
        recommendations = await recommendPitchTargets(node_id, options);
        break;

      case 'scenes':
        recommendations = await recommendScenes(node_id, options);
        break;

      case 'collaborators':
        recommendations = await recommendCollaborators(node_id, options);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: { message: 'Invalid recommendation type', code: 'INVALID_TYPE' },
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error in /api/mig/recommend:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
