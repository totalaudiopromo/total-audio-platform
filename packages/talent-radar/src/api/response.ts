/**
 * API response utilities and error handling for Talent Radar
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Error codes for Talent Radar API
 */
export enum TalentErrorCode {
  ARTIST_NOT_FOUND = 'TALENT_ARTIST_NOT_FOUND',
  SCENE_NOT_FOUND = 'TALENT_SCENE_NOT_FOUND',
  INVALID_PARAMS = 'TALENT_INVALID_PARAMS',
  RATE_LIMITED = 'TALENT_RATE_LIMITED',
  INTERNAL_ERROR = 'TALENT_INTERNAL_ERROR',
  TIMEOUT = 'TALENT_TIMEOUT',
  VALIDATION_ERROR = 'TALENT_VALIDATION_ERROR',
  INSUFFICIENT_DATA = 'TALENT_INSUFFICIENT_DATA',
}

/**
 * Standard API response envelope
 */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

/**
 * Create success response
 */
export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    ok: true,
    data,
    error: null,
  });
}

/**
 * Create error response
 */
export function errorResponse(
  code: TalentErrorCode,
  message: string,
  status: number = 500,
  details?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError): NextResponse<ApiResponse> {
  return errorResponse(
    TalentErrorCode.VALIDATION_ERROR,
    'Invalid request parameters',
    400,
    error.errors
  );
}

/**
 * Handle not found errors
 */
export function notFoundResponse(resource: string, identifier: string): NextResponse<ApiResponse> {
  const code = resource === 'Artist'
    ? TalentErrorCode.ARTIST_NOT_FOUND
    : TalentErrorCode.SCENE_NOT_FOUND;

  return errorResponse(
    code,
    `${resource} not found: ${identifier}`,
    404
  );
}

/**
 * Handle internal server errors
 */
export function internalErrorResponse(error: unknown): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return errorResponse(
    TalentErrorCode.INTERNAL_ERROR,
    message,
    500
  );
}

/**
 * Handle timeout errors
 */
export function timeoutResponse(): NextResponse<ApiResponse> {
  return errorResponse(
    TalentErrorCode.TIMEOUT,
    'Request timed out',
    504
  );
}

/**
 * Handle rate limit errors
 */
export function rateLimitResponse(): NextResponse<ApiResponse> {
  return errorResponse(
    TalentErrorCode.RATE_LIMITED,
    'Too many requests, please try again later',
    429
  );
}

/**
 * Handle insufficient data errors
 */
export function insufficientDataResponse(message: string): NextResponse<ApiResponse> {
  return errorResponse(
    TalentErrorCode.INSUFFICIENT_DATA,
    message,
    422
  );
}
