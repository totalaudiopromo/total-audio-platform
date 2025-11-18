/**
 * API response utilities and error handling
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Error codes for Scenes Engine API
 */
export enum ScenesErrorCode {
  SCENE_NOT_FOUND = 'SCENES_NOT_FOUND',
  MICROGENRE_NOT_FOUND = 'MICROGENRE_NOT_FOUND',
  INVALID_PARAMS = 'SCENES_INVALID_PARAMS',
  RATE_LIMITED = 'SCENES_RATE_LIMITED',
  INTERNAL_ERROR = 'SCENES_INTERNAL_ERROR',
  TIMEOUT = 'SCENES_TIMEOUT',
  VALIDATION_ERROR = 'SCENES_VALIDATION_ERROR',
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
  code: ScenesErrorCode,
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
    ScenesErrorCode.VALIDATION_ERROR,
    'Invalid request parameters',
    400,
    error.errors
  );
}

/**
 * Handle not found errors
 */
export function notFoundResponse(resource: string, identifier: string): NextResponse<ApiResponse> {
  return errorResponse(
    ScenesErrorCode.SCENE_NOT_FOUND,
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
    ScenesErrorCode.INTERNAL_ERROR,
    message,
    500
  );
}

/**
 * Handle timeout errors
 */
export function timeoutResponse(): NextResponse<ApiResponse> {
  return errorResponse(
    ScenesErrorCode.TIMEOUT,
    'Request timed out',
    504
  );
}

/**
 * Handle rate limit errors
 */
export function rateLimitResponse(): NextResponse<ApiResponse> {
  return errorResponse(
    ScenesErrorCode.RATE_LIMITED,
    'Too many requests, please try again later',
    429
  );
}
