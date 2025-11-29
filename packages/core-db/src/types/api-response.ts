/**
 * Standardised API response types for TAP services
 *
 * All API endpoints should use these types for consistent
 * response formatting across Intel, Pitch, and Tracker.
 */

/**
 * Standard error format
 */
export interface ApiError {
  /** Machine-readable error code (e.g., 'VALIDATION_ERROR') */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Total number of items */
  total: number;
  /** Maximum items per page */
  limit: number;
  /** Current offset */
  offset: number;
  /** Whether there are more items */
  hasMore: boolean;
}

/**
 * Response metadata
 */
export interface ApiMeta {
  /** Unique request ID for tracing */
  requestId?: string;
  /** Request processing time in milliseconds */
  timing?: number;
  /** Pagination information */
  pagination?: PaginationMeta;
  /** Rate limit information */
  rateLimit?: {
    /** Maximum requests per window */
    limit: number;
    /** Remaining requests in current window */
    remaining: number;
    /** When the window resets (Unix timestamp) */
    reset: number;
  };
}

/**
 * Standard API response wrapper
 *
 * @example Success response:
 * ```json
 * {
 *   "success": true,
 *   "data": { "contacts": [...] },
 *   "meta": { "timing": 123, "pagination": {...} }
 * }
 * ```
 *
 * @example Error response:
 * ```json
 * {
 *   "success": false,
 *   "error": {
 *     "code": "VALIDATION_ERROR",
 *     "message": "Email is required",
 *     "details": { "field": "email" }
 *   }
 * }
 * ```
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request was successful */
  success: boolean;
  /** Response payload (only present on success) */
  data?: T;
  /** Error details (only present on failure) */
  error?: ApiError;
  /** Response metadata */
  meta?: ApiMeta;
}

/**
 * Success response type helper
 */
export type SuccessResponse<T> = ApiResponse<T> & {
  success: true;
  data: T;
  error?: never;
};

/**
 * Error response type helper
 */
export type ErrorResponse = ApiResponse<never> & {
  success: false;
  data?: never;
  error: ApiError;
};

/**
 * Standard error codes for programmatic handling
 *
 * Use these codes consistently across all API endpoints.
 */
export const ErrorCodes = {
  // Authentication & Authorisation
  /** Missing or invalid authentication */
  UNAUTHORIZED: 'UNAUTHORIZED',
  /** Authenticated but not permitted */
  FORBIDDEN: 'FORBIDDEN',
  /** API key missing required scope */
  INVALID_SCOPE: 'INVALID_SCOPE',

  // Resource errors
  /** Requested resource not found */
  NOT_FOUND: 'NOT_FOUND',
  /** Resource already exists */
  CONFLICT: 'CONFLICT',

  // Validation errors
  /** Request validation failed */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** Invalid request format */
  BAD_REQUEST: 'BAD_REQUEST',

  // Rate limiting
  /** Too many requests */
  RATE_LIMITED: 'RATE_LIMITED',

  // Subscription/quota errors
  /** Subscription required for this action */
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  /** Usage quota exceeded */
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Server errors
  /** Internal server error */
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  /** External service unavailable */
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  /** Request timeout */
  TIMEOUT: 'TIMEOUT',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * HTTP status codes mapped to error codes
 */
export const ErrorStatusCodes: Record<ErrorCode, number> = {
  [ErrorCodes.UNAUTHORIZED]: 401,
  [ErrorCodes.FORBIDDEN]: 403,
  [ErrorCodes.INVALID_SCOPE]: 403,
  [ErrorCodes.NOT_FOUND]: 404,
  [ErrorCodes.CONFLICT]: 409,
  [ErrorCodes.VALIDATION_ERROR]: 400,
  [ErrorCodes.BAD_REQUEST]: 400,
  [ErrorCodes.RATE_LIMITED]: 429,
  [ErrorCodes.SUBSCRIPTION_REQUIRED]: 402,
  [ErrorCodes.QUOTA_EXCEEDED]: 429,
  [ErrorCodes.INTERNAL_ERROR]: 500,
  [ErrorCodes.SERVICE_UNAVAILABLE]: 503,
  [ErrorCodes.TIMEOUT]: 504,
};
