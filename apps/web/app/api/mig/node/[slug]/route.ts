/**
 * MIG API Route: Get Node by Slug
 * GET /api/mig/node/[slug]?include_neighbors=true&neighbor_depth=1
 *
 * Hardened with:
 * - Zod validation
 * - Unified error responses
 * - Query parameter validation
 * - Graceful fallbacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getNodeBySlug,
  getNeighbors,
  createSuccessResponse,
  createErrorResponse,
  MIGErrorCodes,
} from '@total-audio/music-industry-graph';

// Query params schema
const QueryParamsSchema = z.object({
  include_neighbors: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  neighbor_depth: z
    .string()
    .optional()
    .transform((val) => parseInt(val || '1', 10))
    .refine((val) => val >= 1 && val <= 3, {
      message: 'neighbor_depth must be between 1 and 3',
    }),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const startTime = Date.now();

  try {
    const { slug } = params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse(
          MIGErrorCodes.INVALID_SLUG,
          'Slug parameter is required and must be a non-empty string',
          { slug },
          'Provide a valid slug in the URL path'
        ),
        { status: 400 }
      );
    }

    // Validate query parameters
    const queryParams = QueryParamsSchema.safeParse({
      include_neighbors: request.nextUrl.searchParams.get('include_neighbors'),
      neighbor_depth: request.nextUrl.searchParams.get('neighbor_depth'),
    });

    if (!queryParams.success) {
      return NextResponse.json(
        createErrorResponse(
          MIGErrorCodes.INVALID_INPUT,
          'Invalid query parameters',
          { errors: queryParams.error.errors },
          'Check query parameter format'
        ),
        { status: 400 }
      );
    }

    const { include_neighbors, neighbor_depth } = queryParams.data;

    // Fetch node
    const node = await getNodeBySlug(slug.trim());

    if (!node) {
      return NextResponse.json(
        createErrorResponse(
          MIGErrorCodes.NODE_NOT_FOUND,
          `Node with slug "${slug}" not found`,
          { slug },
          'Check if the node exists in the graph database'
        ),
        { status: 404 }
      );
    }

    // Optionally get neighbors
    let neighbors = [];
    if (include_neighbors) {
      try {
        neighbors = await getNeighbors(node.id, {
          depth_limit: neighbor_depth || 1,
        });
      } catch (neighborError) {
        // Log error but don't fail the request
        console.error('Error fetching neighbors:', neighborError);
        neighbors = []; // Graceful degradation
      }
    }

    const queryTime = Date.now() - startTime;

    return NextResponse.json(
      createSuccessResponse({
        node,
        neighbors: include_neighbors ? neighbors : undefined,
        metadata: {
          query_time_ms: queryTime,
          neighbor_count: neighbors.length,
        },
      })
    );
  } catch (error) {
    console.error('Error in /api/mig/node/[slug]:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      createErrorResponse(
        MIGErrorCodes.INTERNAL_ERROR,
        'Internal server error while fetching node',
        { error: errorMessage },
        'Please try again or contact support if the issue persists'
      ),
      { status: 500 }
    );
  }
}
