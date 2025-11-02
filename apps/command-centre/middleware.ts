import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Phase 9D: Security Headers + Authentication Middleware
 * Implements CSP, HSTS, X-Frame-Options, and auth checks
 */

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const authCookie = request.cookies.get('command-centre-auth');

  // If accessing login page, allow through with security headers
  if (request.nextUrl.pathname === '/auth/login') {
    return addSecurityHeaders(NextResponse.next());
  }

  // If not authenticated, redirect to login
  if (!authCookie || authCookie.value !== process.env.COMMAND_CENTRE_AUTH_TOKEN) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Authenticated - apply security headers and continue
  return addSecurityHeaders(NextResponse.next());
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' plausible.io",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' *.supabase.co plausible.io",
    "frame-ancestors 'none'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspDirectives);

  // HTTP Strict Transport Security (HSTS) - Force HTTPS for 1 year
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // X-Frame-Options: Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options: Prevent MIME-sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy: Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: Restrict browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
