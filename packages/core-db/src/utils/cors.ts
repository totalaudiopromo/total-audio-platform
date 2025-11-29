import { NextResponse } from 'next/server';

/**
 * Allowed origins for CORS
 * In production, these are the only origins allowed to make cross-origin requests
 */
const ALLOWED_ORIGINS_PROD = [
  // TotalAud.io (experimental interface)
  'https://totalaud.io',
  'https://www.totalaud.io',
  // Total Audio Promo apps
  'https://intel.totalaudiopromo.com',
  'https://pitch.totalaudiopromo.com',
  'https://tracker.totalaudiopromo.com',
  'https://command.totalaudiopromo.com',
  // Main marketing site
  'https://totalaudiopromo.com',
  'https://www.totalaudiopromo.com',
];

/**
 * Additional allowed origins in development
 */
const ALLOWED_ORIGINS_DEV = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:4000', // totalaud.io dev
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

/**
 * Get the list of allowed origins based on environment
 */
export function getAllowedOrigins(): string[] {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? [...ALLOWED_ORIGINS_PROD, ...ALLOWED_ORIGINS_DEV] : ALLOWED_ORIGINS_PROD;
}

/**
 * Check if an origin is allowed
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return getAllowedOrigins().includes(origin);
}

/**
 * CORS headers type
 */
type CorsHeaders = Record<string, string>;

/**
 * Get CORS headers for a response
 *
 * @param origin - The request origin
 * @returns Headers object with CORS configuration
 */
export function getCorsHeaders(origin: string | null): CorsHeaders {
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]; // Default to first allowed origin

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Add CORS headers to an existing response
 *
 * @param response - The response to add headers to
 * @param origin - The request origin
 * @returns The response with CORS headers added
 *
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   const result = await processRequest();
 *   const response = NextResponse.json(result);
 *   return withCors(response, request.headers.get('origin'));
 * }
 * ```
 */
export function withCors<T extends Response>(response: T, origin: string | null): T {
  const headers = getCorsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Create a preflight OPTIONS response
 *
 * Use this for handling OPTIONS requests in API routes
 *
 * @param origin - The request origin
 * @returns A 204 No Content response with CORS headers
 *
 * @example
 * ```typescript
 * export async function OPTIONS(request: Request) {
 *   return corsOptionsResponse(request.headers.get('origin'));
 * }
 * ```
 */
export function corsOptionsResponse(origin: string | null): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * Create a CORS-enabled NextResponse
 *
 * @param body - Response body
 * @param origin - Request origin
 * @param init - Additional response options
 *
 * @example
 * ```typescript
 * return corsResponse(
 *   { success: true, data: result },
 *   request.headers.get('origin'),
 *   { status: 200 }
 * );
 * ```
 */
export function corsResponse<T>(
  body: T,
  origin: string | null,
  init?: ResponseInit
): NextResponse<T> {
  const response = NextResponse.json(body, init);
  return withCors(response, origin);
}

/**
 * Higher-order function to wrap an API handler with CORS support
 *
 * Automatically handles OPTIONS requests and adds CORS headers to responses
 *
 * @example
 * ```typescript
 * const handler = withCorsHandler(async (request) => {
 *   // Your logic here
 *   return successResponse(data);
 * });
 *
 * export const GET = handler;
 * export const POST = handler;
 * export const OPTIONS = handler;
 * ```
 */
export function withCorsHandler(
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin');

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return corsOptionsResponse(origin);
    }

    // Execute handler and add CORS headers
    const response = await handler(request);
    return withCors(response, origin);
  };
}

/**
 * Validate that a request origin is allowed
 *
 * Returns an error response if the origin is not allowed
 *
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   const originError = validateOrigin(request);
 *   if (originError) return originError;
 *   // Continue with request handling
 * }
 * ```
 */
export function validateOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin');

  // Allow requests without origin (same-origin, curl, etc.)
  if (!origin) return null;

  // Check if origin is allowed
  if (!isAllowedOrigin(origin)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Origin not allowed',
        },
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return null;
}
