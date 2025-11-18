/**
 * Zod validation schemas for Talent Radar API
 */

import { z } from 'zod';

/**
 * Path parameter schemas
 */
export const ArtistSlugSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

/**
 * Query parameter schemas
 */
export const GlobalPulseQuerySchema = z.object({
  skipCache: z.coerce.boolean().default(false),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const ArtistProfileQuerySchema = z.object({
  skipCache: z.coerce.boolean().default(false),
});

export const TopArtistsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.enum(['rising', 'breakout', 'risk']).optional(),
});

export const WorkspaceRecommendationsQuerySchema = z.object({
  workspaceId: z.string().uuid('Invalid workspace ID'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Type exports
 */
export type ArtistSlugParams = z.infer<typeof ArtistSlugSchema>;
export type GlobalPulseQuery = z.infer<typeof GlobalPulseQuerySchema>;
export type ArtistProfileQuery = z.infer<typeof ArtistProfileQuerySchema>;
export type TopArtistsQuery = z.infer<typeof TopArtistsQuerySchema>;
export type WorkspaceRecommendationsQuery = z.infer<typeof WorkspaceRecommendationsQuerySchema>;
