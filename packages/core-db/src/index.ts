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
 * // API Authentication (API keys + session)
 * import { getUserFromRequest, successResponse, errorResponse } from "@total-audio/core-db/auth";
 * const auth = await getUserFromRequest(request);
 * if (!auth.success) return errorResponse(auth.error.code, auth.error.message, auth.error.status);
 *
 * // CORS utilities
 * import { withCors, corsOptionsResponse } from "@total-audio/core-db/utils";
 *
 * // Types
 * import type { Database, Json, ApiResponse } from "@total-audio/core-db/types";
 *
 * // Utilities
 * import { isAdmin, ownsResource } from "@total-audio/core-db";
 * ```
 */

// Re-export utility functions
export {
  isAdmin,
  ownsResource,
  getSubscriptionTier,
  ErrorLogger,
  createErrorLogger,
  errorLogger,
  // API helpers
  successResponse,
  errorResponse,
  unauthorized,
  forbidden,
  notFound,
  validationError,
  badRequest,
  rateLimited,
  internalError,
  withErrorHandling,
  paginationMeta,
  generateRequestId,
  // CORS utilities
  withCors,
  corsOptionsResponse,
  corsResponse,
  withCorsHandler,
  getCorsHeaders,
  isAllowedOrigin,
  getAllowedOrigins,
} from './utils';
export type { ErrorCategory, ErrorLogEntry } from './utils';

// Re-export auth module
export {
  getUserFromRequest,
  checkScope,
  validateApiKey,
  generateApiKey,
  hashApiKey,
  hasScope,
  API_SCOPES,
} from './auth';
export type {
  AuthContext,
  AuthError,
  AuthMethod,
  AuthResult,
  GetUserOptions,
  ApiKeyContext,
  ApiKeyError,
  ApiKeyValidationResult,
  ApiScope,
} from './auth';

// Re-export workspace queries
export { WorkspaceQueries, createWorkspaceQueries } from './workspace/queries';

// Re-export integration sync system
export { BaseIntegrationSync, GmailSyncService, AirtableSyncService } from './integrations';
export type {
  IntegrationConfig,
  IntegrationName,
  SyncResult,
  WorkspaceContact,
  OAuthTokenResponse,
  SendPitchParams,
  SendPitchResult,
} from './integrations';

// Re-export types for convenience
export type { Database, Json } from './types';
