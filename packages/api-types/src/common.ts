/**
 * Common API types shared across all Total Audio services
 */

// ============================================================================
// Base API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  requestId?: string;
  timing?: number;
  version?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// Error Codes
// ============================================================================

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_SCOPE: 'INVALID_SCOPE',
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ============================================================================
// Contact Types
// ============================================================================

export interface Contact {
  id: string;
  name: string;
  email: string;
  outlet?: string | null;
  role?: string | null;
  genre_tags?: string[] | null;
  notes?: string | null;
  preferred_tone?: 'casual' | 'professional' | 'enthusiastic' | null;
  last_contact?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Auth Types
// ============================================================================

export type AuthMethod = 'session' | 'api_key';

export interface UserContext {
  userId: string;
  email?: string;
  workspaceId?: string | null;
  authMethod: AuthMethod;
  scopes?: string[];
}

export type ApiScope =
  | 'intel:read'
  | 'intel:write'
  | 'pitch:read'
  | 'pitch:write'
  | 'tracker:read'
  | 'tracker:write'
  | 'contacts:read'
  | 'contacts:write'
  | 'admin';
