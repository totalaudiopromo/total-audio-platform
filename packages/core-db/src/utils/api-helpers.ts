import { NextResponse } from 'next/server';
import type { ApiResponse, ApiError, ApiMeta, ErrorCode } from '../types/api-response';
import { ErrorCodes, ErrorStatusCodes } from '../types/api-response';

/**
 * Create a success response
 *
 * @param data - Response payload
 * @param meta - Optional metadata
 * @param status - HTTP status code (default 200)
 * @param corsHeaders - Optional CORS headers to include
 *
 * @example
 * ```typescript
 * return successResponse({ contacts: enrichedContacts }, { timing: 123 });
 * // { success: true, data: { contacts: [...] }, meta: { timing: 123 } }
 * ```
 */
export function successResponse<T>(
  data: T,
  meta?: ApiMeta,
  status = 200,
  corsHeaders?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = { success: true, data };
  if (meta) response.meta = meta;
  const nextResponse = NextResponse.json(response, { status });

  // Apply CORS headers if provided
  if (corsHeaders) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      nextResponse.headers.set(key, value);
    });
  }

  return nextResponse;
}

/**
 * Create an error response
 *
 * @param code - Error code from ErrorCodes
 * @param message - Human-readable error message
 * @param status - HTTP status code (auto-mapped from code if not provided)
 * @param details - Additional error details
 * @param corsHeaders - Optional CORS headers to include
 *
 * @example
 * ```typescript
 * return errorResponse('VALIDATION_ERROR', 'Email is required', 400, { field: 'email' });
 * // { success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: {...} } }
 * ```
 */
export function errorResponse(
  code: ErrorCode | string,
  message: string,
  status?: number,
  details?: Record<string, unknown>,
  corsHeaders?: Record<string, string>
): NextResponse<ApiResponse<never>> {
  const httpStatus = status ?? ErrorStatusCodes[code as ErrorCode] ?? 400;
  const error: ApiError = { code, message };
  if (details) error.details = details;

  const nextResponse = NextResponse.json({ success: false, error }, { status: httpStatus });

  // Apply CORS headers if provided
  if (corsHeaders) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      nextResponse.headers.set(key, value);
    });
  }

  return nextResponse;
}

// ============================================================================
// Convenience Error Helpers (all accept optional corsHeaders as last param)
// ============================================================================

/**
 * 401 Unauthorized response
 */
export const unauthorized = (
  message = 'Authentication required',
  corsHeaders?: Record<string, string>
) => errorResponse(ErrorCodes.UNAUTHORIZED, message, 401, undefined, corsHeaders);

/**
 * 403 Forbidden response
 */
export const forbidden = (message = 'Access denied', corsHeaders?: Record<string, string>) =>
  errorResponse(ErrorCodes.FORBIDDEN, message, 403, undefined, corsHeaders);

/**
 * Alias for forbidden - 403 Forbidden response
 */
export const forbiddenError = forbidden;

/**
 * 404 Not Found response
 */
export const notFound = (resource = 'Resource', corsHeaders?: Record<string, string>) =>
  errorResponse(ErrorCodes.NOT_FOUND, `${resource} not found`, 404, undefined, corsHeaders);

/**
 * 400 Validation Error response
 */
export const validationError = (
  message: string,
  details?: Record<string, unknown>,
  corsHeaders?: Record<string, string>
) => errorResponse(ErrorCodes.VALIDATION_ERROR, message, 400, details, corsHeaders);

/**
 * 400 Bad Request response
 */
export const badRequest = (
  message: string,
  details?: Record<string, unknown>,
  corsHeaders?: Record<string, string>
) => errorResponse(ErrorCodes.BAD_REQUEST, message, 400, details, corsHeaders);

/**
 * 409 Conflict response
 */
export const conflict = (message: string, corsHeaders?: Record<string, string>) =>
  errorResponse(ErrorCodes.CONFLICT, message, 409, undefined, corsHeaders);

/**
 * 429 Rate Limited response
 */
export const rateLimited = (retryAfter?: number, corsHeaders?: Record<string, string>) =>
  errorResponse(
    ErrorCodes.RATE_LIMITED,
    'Too many requests. Please try again later.',
    429,
    retryAfter ? { retryAfter } : undefined,
    corsHeaders
  );

/**
 * 402 Subscription Required response
 */
export const subscriptionRequired = (
  message = 'This feature requires a subscription',
  corsHeaders?: Record<string, string>
) => errorResponse(ErrorCodes.SUBSCRIPTION_REQUIRED, message, 402, undefined, corsHeaders);

/**
 * 429 Quota Exceeded response
 */
export const quotaExceeded = (
  message = 'Usage quota exceeded',
  details?: Record<string, unknown>,
  corsHeaders?: Record<string, string>
) => errorResponse(ErrorCodes.QUOTA_EXCEEDED, message, 429, details, corsHeaders);

/**
 * 500 Internal Server Error response
 */
export const internalError = (
  message = 'An unexpected error occurred',
  corsHeaders?: Record<string, string>
) => errorResponse(ErrorCodes.INTERNAL_ERROR, message, 500, undefined, corsHeaders);

/**
 * 503 Service Unavailable response
 */
export const serviceUnavailable = (
  message = 'Service temporarily unavailable',
  corsHeaders?: Record<string, string>
) => errorResponse(ErrorCodes.SERVICE_UNAVAILABLE, message, 503, undefined, corsHeaders);

/**
 * 504 Gateway Timeout response
 */
export const timeout = (message = 'Request timed out', corsHeaders?: Record<string, string>) =>
  errorResponse(ErrorCodes.TIMEOUT, message, 504, undefined, corsHeaders);

// ============================================================================
// Utility Helpers
// ============================================================================

/**
 * Create pagination metadata
 */
export function paginationMeta(total: number, limit: number, offset: number): ApiMeta {
  return {
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}

/**
 * Generate a request ID for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Wrap an async handler with error handling
 *
 * @example
 * ```typescript
 * export const POST = withErrorHandling(async (request) => {
 *   const data = await request.json();
 *   // ... handle request
 *   return successResponse(result);
 * });
 * ```
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('[API Error]', error);

      if (error instanceof Error) {
        // Don't expose internal error details in production
        const message =
          process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred';
        return internalError(message);
      }

      return internalError();
    }
  };
}
