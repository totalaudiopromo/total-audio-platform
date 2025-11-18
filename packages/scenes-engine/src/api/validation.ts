/**
 * Zod validation schemas for Scenes API
 */

import { z } from 'zod';

/**
 * Path parameter schemas
 */
export const SceneSlugSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

export const MicrogenreSlugSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

/**
 * Query parameter schemas
 */
export const ListScenesQuerySchema = z.object({
  region: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const ScenePulseQuerySchema = z.object({
  skipCache: z.coerce.boolean().default(false),
});

export const RegionalPulseQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const SceneTrendsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export const RecommendationsQuerySchema = z.object({
  artistSlug: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

/**
 * Type exports
 */
export type SceneSlugParams = z.infer<typeof SceneSlugSchema>;
export type MicrogenreSlugParams = z.infer<typeof MicrogenreSlugSchema>;
export type ListScenesQuery = z.infer<typeof ListScenesQuerySchema>;
export type ScenePulseQuery = z.infer<typeof ScenePulseQuerySchema>;
export type RegionalPulseQuery = z.infer<typeof RegionalPulseQuerySchema>;
export type SceneTrendsQuery = z.infer<typeof SceneTrendsQuerySchema>;
export type RecommendationsQuery = z.infer<typeof RecommendationsQuerySchema>;
