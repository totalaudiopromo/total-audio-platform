import { createServerClient } from '../server';
import { validateApiKey, hasScope } from './api-key';
import type { ApiKeyContext } from './api-key';
import { cookies } from 'next/headers';

/**
 * Authentication method used
 */
export type AuthMethod = 'session' | 'api_key';

/**
 * Unified authentication context returned from getUserFromRequest
 */
export interface AuthContext {
  /** The authenticated user's ID */
  userId: string;
  /** The workspace ID (if available) */
  workspaceId: string | null;
  /** How the user authenticated */
  authMethod: AuthMethod;
  /** Permission scopes (only for API key auth) */
  scopes?: string[];
  /** Rate limit (only for API key auth) */
  rateLimitRpm?: number;
  /** API key ID for logging (only for API key auth) */
  apiKeyId?: string;
  /** User email (only for session auth) */
  email?: string;
}

/**
 * Error returned when authentication fails
 */
export interface AuthError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INVALID_SCOPE';
  message: string;
  status: number;
}

/**
 * Result of authentication attempt
 */
export type AuthResult =
  | { success: true; context: AuthContext }
  | { success: false; error: AuthError };

/**
 * Options for getUserFromRequest
 */
export interface GetUserOptions {
  /** Required scope for API key auth (e.g., 'intel:read') */
  requiredScope?: string;
  /** Allow unauthenticated access */
  allowAnonymous?: boolean;
}

/**
 * Get the authenticated user from a request
 *
 * Supports both:
 * 1. API key authentication (Authorization: Bearer tap_xxx)
 * 2. Supabase session authentication (via cookies)
 *
 * @param request - The incoming request
 * @param options - Authentication options
 * @returns AuthResult with context or error
 *
 * @example
 * ```typescript
 * // Basic auth check
 * const auth = await getUserFromRequest(request);
 * if (!auth.success) {
 *   return errorResponse(auth.error.code, auth.error.message, auth.error.status);
 * }
 * const { userId } = auth.context;
 *
 * // With required scope
 * const auth = await getUserFromRequest(request, { requiredScope: 'intel:read' });
 * ```
 */
export async function getUserFromRequest(
  request: Request,
  options: GetUserOptions = {}
): Promise<AuthResult> {
  const { requiredScope, allowAnonymous = false } = options;

  // Try API key first
  const authHeader = request.headers.get('Authorization');

  if (authHeader?.startsWith('Bearer tap_')) {
    const apiKeyResult = await validateApiKey(authHeader);

    if (!apiKeyResult.success) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: apiKeyResult.error.message,
          status: 401,
        },
      };
    }

    // Check scope if required
    if (requiredScope && !hasScope(apiKeyResult.context.scopes, requiredScope)) {
      return {
        success: false,
        error: {
          code: 'INVALID_SCOPE',
          message: `This API key does not have the required scope: ${requiredScope}`,
          status: 403,
        },
      };
    }

    return {
      success: true,
      context: {
        userId: apiKeyResult.context.userId,
        workspaceId: apiKeyResult.context.workspaceId,
        authMethod: 'api_key',
        scopes: apiKeyResult.context.scopes,
        rateLimitRpm: apiKeyResult.context.rateLimitRpm,
        apiKeyId: apiKeyResult.context.apiKeyId,
      },
    };
  }

  // Fall back to Supabase session
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      if (allowAnonymous) {
        return {
          success: true,
          context: {
            userId: 'anonymous',
            workspaceId: null,
            authMethod: 'session',
          },
        };
      }

      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          status: 401,
        },
      };
    }

    // Get workspace ID from user metadata if available
    const workspaceId =
      (user.user_metadata?.workspace_id as string) ||
      (user.app_metadata?.workspace_id as string) ||
      null;

    return {
      success: true,
      context: {
        userId: user.id,
        workspaceId,
        authMethod: 'session',
        email: user.email,
      },
    };
  } catch (error) {
    // Cookie access might fail in certain contexts
    console.error('[Auth] Session auth failed:', error);

    if (allowAnonymous) {
      return {
        success: true,
        context: {
          userId: 'anonymous',
          workspaceId: null,
          authMethod: 'session',
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        status: 401,
      },
    };
  }
}

/**
 * Check if the user has a required scope (for API key auth)
 * Session-authenticated users implicitly have all scopes
 */
export function checkScope(auth: AuthContext, requiredScope: string): boolean {
  // Session auth has full access
  if (auth.authMethod === 'session') return true;

  // API key must have the scope
  return auth.scopes ? hasScope(auth.scopes, requiredScope) : false;
}
