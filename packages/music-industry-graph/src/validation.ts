/**
 * Music Industry Graph (MIG) - Validation Schemas
 *
 * Zod schemas for validating API inputs and ensuring type safety.
 */

import { z } from 'zod';

// ============================================================================
// NODE TYPE ENUMS
// ============================================================================

export const MIGNodeTypeSchema = z.enum([
  'artist',
  'journalist',
  'radio_host',
  'playlist',
  'blog',
  'dj',
  'label',
  'scene',
  'microgenre',
  'event',
  'venue',
  'festival',
  'radio_show',
  'podcast',
]);

export const MIGRelationshipTypeSchema = z.enum([
  'influences',
  'supports',
  'covers',
  'follows',
  'writes_for',
  'programmes',
  'collaborates',
  'same_scene',
  'same_microgenre',
  'similar_audience',
  'scene_crossover',
  'trend_link',
  'plays_at',
  'books',
  'manages',
  'releases_on',
  'curates',
  'interviews',
  'reviews',
  'similar_to',
  'influenced_by',
  'remixes',
  'features',
  'part_of',
]);

// ============================================================================
// API REQUEST SCHEMAS
// ============================================================================

/**
 * Node search request
 */
export const NodeSearchRequestSchema = z.object({
  type: MIGNodeTypeSchema.optional(),
  query: z.string().min(1).max(200),
  limit: z.number().int().min(1).max(100).optional().default(50),
  offset: z.number().int().min(0).optional().default(0),
});

export type NodeSearchRequest = z.infer<typeof NodeSearchRequestSchema>;

/**
 * Node by slug request
 */
export const NodeBySlugRequestSchema = z.object({
  slug: z.string().min(1).max(200),
  include_neighbors: z.boolean().optional().default(false),
  neighbor_depth: z.number().int().min(1).max(3).optional().default(1),
});

export type NodeBySlugRequest = z.infer<typeof NodeBySlugRequestSchema>;

/**
 * Recommendation request
 */
export const RecommendationRequestSchema = z.object({
  node_id: z.string().uuid(),
  node_type: MIGNodeTypeSchema,
  limit: z.number().int().min(1).max(50).optional().default(10),
  min_score: z.number().min(0).max(1).optional().default(0.3),
  filters: z
    .object({
      country: z.string().optional(),
      min_followers: z.number().optional(),
    })
    .optional(),
});

export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;

/**
 * Pathfinding request
 */
export const PathfindingRequestSchema = z.object({
  source_id: z.string().uuid(),
  target_id: z.string().uuid(),
  max_depth: z.number().int().min(1).max(6).optional().default(6),
  avoid_node_types: z.array(MIGNodeTypeSchema).optional(),
  timeout_ms: z.number().int().min(1000).max(30000).optional().default(10000),
});

export type PathfindingRequest = z.infer<typeof PathfindingRequestSchema>;

/**
 * Scene pulse request
 */
export const ScenePulseRequestSchema = z.object({
  scene_slug: z.string().min(1).max(200).optional(),
  country: z.string().min(2).max(3).optional(),
  limit: z.number().int().min(1).max(100).optional().default(10),
});

export type ScenePulseRequest = z.infer<typeof ScenePulseRequestSchema>;

/**
 * Contact fit request (for MIG integration)
 */
export const ContactFitRequestSchema = z.object({
  contact_id: z.string().uuid(),
  artist_slug: z.string().min(1).max(200),
  workspace_id: z.string().uuid(),
});

export type ContactFitRequest = z.infer<typeof ContactFitRequestSchema>;

/**
 * Influence score request
 */
export const InfluenceScoreRequestSchema = z.object({
  artist_slug: z.string().min(1).max(200),
  workspace_id: z.string().uuid(),
});

export type InfluenceScoreRequest = z.infer<typeof InfluenceScoreRequestSchema>;

/**
 * Natural language query request
 */
export const NLQueryRequestSchema = z.object({
  query: z.string().min(3).max(500),
  context: z
    .object({
      workspace_id: z.string().uuid().optional(),
      user_location: z.string().optional(),
    })
    .optional(),
});

export type NLQueryRequest = z.infer<typeof NLQueryRequestSchema>;

// ============================================================================
// API RESPONSE SCHEMAS
// ============================================================================

/**
 * Standard error response
 */
export const APIErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
  suggestion: z.string().optional(),
});

export type APIError = z.infer<typeof APIErrorSchema>;

/**
 * Standard success response wrapper
 */
export function createSuccessResponse<T>(data: T) {
  return {
    success: true as const,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Standard error response wrapper
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: Record<string, any>,
  suggestion?: string
) {
  return {
    success: false as const,
    error: {
      code,
      message,
      details,
      suggestion,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generic API response type
 */
export type APIResponse<T> =
  | {
      success: true;
      data: T;
      timestamp: string;
    }
  | {
      success: false;
      error: APIError;
      timestamp: string;
    };

// ============================================================================
// ERROR CODES
// ============================================================================

export const MIGErrorCodes = {
  // Client errors (4xx)
  INVALID_INPUT: 'INVALID_INPUT',
  NODE_NOT_FOUND: 'NODE_NOT_FOUND',
  SCENE_NOT_FOUND: 'SCENE_NOT_FOUND',
  INVALID_SLUG: 'INVALID_SLUG',
  MISSING_WORKSPACE: 'MISSING_WORKSPACE',
  UNAUTHORIZED: 'UNAUTHORIZED',

  // Server errors (5xx)
  DATABASE_ERROR: 'DATABASE_ERROR',
  TIMEOUT: 'TIMEOUT',
  OPERATION_LIMIT_EXCEEDED: 'OPERATION_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type MIGErrorCode = (typeof MIGErrorCodes)[keyof typeof MIGErrorCodes];

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate request body with Zod schema
 * Returns typed data or throws validation error
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.reduce(
        (acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );

      throw createErrorResponse(
        MIGErrorCodes.INVALID_INPUT,
        'Request validation failed',
        details,
        'Check the request body against the API schema'
      );
    }
    throw error;
  }
}

/**
 * Safe validation that returns result object instead of throwing
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: APIError } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.reduce(
        (acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );

      return {
        success: false,
        error: {
          code: MIGErrorCodes.INVALID_INPUT,
          message: 'Request validation failed',
          details,
          suggestion: 'Check the request body against the API schema',
        },
      };
    }

    return {
      success: false,
      error: {
        code: MIGErrorCodes.INTERNAL_ERROR,
        message: 'Unexpected validation error',
      },
    };
  }
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export * from './types';
