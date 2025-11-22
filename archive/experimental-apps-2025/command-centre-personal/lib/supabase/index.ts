/**
 * @total-audio/core-db
 *
 * Centralized Supabase client package for Total Audio Platform.
 * Provides typed clients, utilities, and type definitions for all apps.
 *
 * @example
 * ```typescript
 * // Browser client (React components, client-side code)
 * import { createClient } from "@total-audio/core-db/client";
 * const supabase = createClient();
 *
 * // Server client (Server Components, Server Actions, Route Handlers)
 * import { createServerClient } from "@total-audio/core-db/server";
 * import { cookies } from "next/headers";
 * const supabase = createServerClient(cookies());
 *
 * // Admin client (bypasses RLS - use with caution)
 * import { createAdminClient } from "@total-audio/core-db/server";
 * import { cookies } from "next/headers";
 * const supabase = createAdminClient(cookies());
 *
 * // Middleware
 * import { updateSession } from "@total-audio/core-db/middleware";
 * export async function middleware(request) {
 *   return await updateSession(request);
 * }
 *
 * // Types
 * import type { Database, Json } from "@total-audio/core-db/types";
 *
 * // Utilities
 * import { isAdmin, ownsResource } from "@total-audio/core-db";
 * ```
 */

// Re-export utility functions
export { isAdmin, ownsResource, getSubscriptionTier } from './utils';

// Re-export types for convenience
export type { Database, Json } from './types';
