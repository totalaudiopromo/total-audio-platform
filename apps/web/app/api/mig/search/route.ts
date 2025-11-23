/**
 * MIG API Route: Search Nodes
 * GET /api/mig/search?type=artist&query=london&limit=50&offset=0
 *
 * Hardened with:
 * - Zod validation for all query parameters
 * - Unified error responses
 * - Pagination support
 * - Input sanitization
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  searchNodesByType,
  listNodesByType,
  MIGNodeTypeSchema,
  NodeSearchRequestSchema,
  createSuccessResponse,
  createErrorResponse,
  MIGErrorCodes,
} from '@total-audio/music-industry-graph';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;

    // Build and validate request object
    const requestData = {
      type: searchParams.get('type'),
      query: searchParams.get('query') || '',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0,
    };

    // Validate with Zod
    const validation = NodeSearchRequestSchema.safeParse(requestData);

    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          MIGErrorCodes.INVALID_INPUT,
          'Invalid search parameters',
          {
            errors: validation.error.errors.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
          'Check query parameter format and values'
        ),
        { status: 400 }
      );
    }

    const { type, query, limit, offset } = validation.data;

    // Validate node type specifically
    const typeValidation = MIGNodeTypeSchema.safeParse(type);
    if (!typeValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          MIGErrorCodes.INVALID_INPUT,
          `Invalid node type: ${type}`,
          { provided_type: type },
          'Type must be one of: artist, journalist, radio_host, playlist, blog, dj, label, scene, microgenre, event, venue, festival, radio_show, podcast'
        ),
        { status: 400 }
      );
    }

    // Perform search
    let nodes;
    if (query && query.length > 0) {
      // Search with query string
      nodes = await searchNodesByType(typeValidation.data, query, limit);
    } else {
      // List all of type with pagination
      nodes = await listNodesByType(typeValidation.data, limit, offset);
    }

    const queryTime = Date.now() - startTime;

    return NextResponse.json(
      createSuccessResponse({
        results: nodes,
        pagination: {
          limit,
          offset,
          returned: nodes.length,
          has_more: nodes.length === limit, // Simple heuristic
        },
        metadata: {
          query_time_ms: queryTime,
          query: query || null,
          type: typeValidation.data,
        },
      })
    );
  } catch (error) {
    console.error('Error in /api/mig/search:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      createErrorResponse(
        MIGErrorCodes.INTERNAL_ERROR,
        'Internal server error during search',
        { error: errorMessage },
        'Please try again or contact support if the issue persists'
      ),
      { status: 500 }
    );
  }
}
