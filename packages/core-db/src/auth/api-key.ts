import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * API key row from database
 * Note: This will be auto-typed once api_keys table is added to database types
 */
interface ApiKeyRow {
  id: string;
  user_id: string;
  workspace_id: string | null;
  scopes: string[] | null;
  rate_limit_rpm: number | null;
  expires_at: string | null;
  revoked_at: string | null;
}

/**
 * Context returned when an API key is successfully validated
 */
export interface ApiKeyContext {
  /** The user ID associated with the API key */
  userId: string;
  /** The workspace ID (if the key is scoped to a workspace) */
  workspaceId: string | null;
  /** Permission scopes granted to this key */
  scopes: string[];
  /** Rate limit in requests per minute */
  rateLimitRpm: number;
  /** The API key ID (for logging/tracking) */
  apiKeyId: string;
}

/**
 * Error returned when API key validation fails
 */
export interface ApiKeyError {
  code: 'INVALID_KEY' | 'EXPIRED_KEY' | 'REVOKED_KEY' | 'RATE_LIMITED';
  message: string;
  retryAfter?: number;
}

/**
 * Result of API key validation
 */
export type ApiKeyValidationResult =
  | { success: true; context: ApiKeyContext }
  | { success: false; error: ApiKeyError };

/**
 * Generate a new API key
 * Returns both the plain key (show once) and the hash (store in DB)
 */
export function generateApiKey(prefix: 'tap_live' | 'tap_test' = 'tap_live'): {
  key: string;
  keyPrefix: string;
  keyHash: string;
} {
  // Generate 32 random bytes for the key body
  const keyBody = crypto.randomBytes(32).toString('base64url');
  const key = `${prefix}_${keyBody}`;
  const keyPrefix = key.slice(0, 12); // e.g., "tap_live_abc"
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  return { key, keyPrefix, keyHash };
}

/**
 * Hash an API key for comparison
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Validate an API key from the Authorization header
 *
 * @param authHeader - The Authorization header value (e.g., "Bearer tap_live_xxx")
 * @returns Validation result with context or error
 *
 * @example
 * ```typescript
 * const result = await validateApiKey(request.headers.get('Authorization'));
 * if (!result.success) {
 *   return errorResponse(result.error.code, result.error.message, 401);
 * }
 * const { userId, scopes } = result.context;
 * ```
 */
export async function validateApiKey(
  authHeader: string | null
): Promise<ApiKeyValidationResult> {
  // Check for valid Bearer token format
  if (!authHeader?.startsWith('Bearer tap_')) {
    return {
      success: false,
      error: {
        code: 'INVALID_KEY',
        message: 'Invalid or missing API key. Expected format: Bearer tap_xxx',
      },
    };
  }

  const key = authHeader.slice(7); // Remove "Bearer "
  const keyHash = hashApiKey(key);

  // Get Supabase admin client for service-level access
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[API Key Auth] Missing Supabase environment variables');
    return {
      success: false,
      error: {
        code: 'INVALID_KEY',
        message: 'API key validation unavailable',
      },
    };
  }

  // Use untyped client since api_keys table may not be in generated types yet
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Look up the API key
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, user_id, workspace_id, scopes, rate_limit_rpm, expires_at, revoked_at')
    .eq('key_hash', keyHash)
    .single<ApiKeyRow>();

  if (error || !data) {
    return {
      success: false,
      error: {
        code: 'INVALID_KEY',
        message: 'Invalid API key',
      },
    };
  }

  // Check if revoked
  if (data.revoked_at) {
    return {
      success: false,
      error: {
        code: 'REVOKED_KEY',
        message: 'This API key has been revoked',
      },
    };
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return {
      success: false,
      error: {
        code: 'EXPIRED_KEY',
        message: 'This API key has expired',
      },
    };
  }

  // Update last_used_at (fire and forget)
  supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id)
    .then();

  return {
    success: true,
    context: {
      userId: data.user_id,
      workspaceId: data.workspace_id,
      scopes: data.scopes || [],
      rateLimitRpm: data.rate_limit_rpm || 60,
      apiKeyId: data.id,
    },
  };
}

/**
 * Check if an API key has a specific scope
 */
export function hasScope(scopes: string[], requiredScope: string): boolean {
  // Check exact match
  if (scopes.includes(requiredScope)) return true;

  // Check wildcard (e.g., "intel:*" matches "intel:read")
  const [resource] = requiredScope.split(':');
  if (scopes.includes(`${resource}:*`)) return true;

  // Check admin scope
  if (scopes.includes('*')) return true;

  return false;
}

/**
 * Available permission scopes
 */
export const API_SCOPES = {
  // Intel
  INTEL_READ: 'intel:read',
  INTEL_WRITE: 'intel:write',
  // Pitch
  PITCH_READ: 'pitch:read',
  PITCH_WRITE: 'pitch:write',
  // Tracker
  TRACKER_READ: 'tracker:read',
  TRACKER_WRITE: 'tracker:write',
  // Admin (all permissions)
  ADMIN: '*',
} as const;

export type ApiScope = (typeof API_SCOPES)[keyof typeof API_SCOPES];
