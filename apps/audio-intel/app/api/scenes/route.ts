/**
 * GET /api/scenes
 * List all scenes with optional filters
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ScenesStore } from '@total-audio/scenes-engine';
import { ListScenesQuerySchema } from '@total-audio/scenes-engine/src/api/validation';
import {
  successResponse,
  internalErrorResponse,
  handleValidationError,
} from '@total-audio/scenes-engine/src/api/response';

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryResult = ListScenesQuerySchema.safeParse({
      region: searchParams.get('region') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    });

    if (!queryResult.success) {
      return handleValidationError(queryResult.error);
    }

    const { region, limit, offset } = queryResult.data;

    // Get scenes with filters
    const supabase = await createClient();
    const scenesStore = new ScenesStore({ supabase });

    const scenes = await scenesStore.listScenes({ region });

    // Apply pagination
    const paginatedScenes = scenes.slice(offset, offset + limit);

    return successResponse({
      scenes: paginatedScenes,
      pagination: {
        limit,
        offset,
        total: scenes.length,
        hasMore: offset + limit < scenes.length,
      },
    });
  } catch (error) {
    console.error('Error fetching scenes:', error);
    return internalErrorResponse(error);
  }
}
