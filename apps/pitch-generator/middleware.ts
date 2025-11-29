import { updateSession } from '@total-audio/core-db/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for API key authentication on API routes
  // If a valid Bearer token is present, bypass session auth
  const authHeader = request.headers.get('authorization');
  const isApiRoute = pathname.startsWith('/api/');
  const hasApiKey = authHeader?.startsWith('Bearer tap_');

  // If it's an API route with an API key, let the route handler validate it
  // Don't redirect to login - let the request through
  if (isApiRoute && hasApiKey) {
    const response = NextResponse.next();
    // Add CORS headers for API key authenticated requests
    const origin = request.headers.get('origin');
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    return response;
  }

  const { supabaseResponse, user } = await updateSession(request);

  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/pricing',
    '/privacy',
    '/terms',
    '/api/health',
  ];
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/api/auth');

  const authRoutes = ['/auth/signin', '/auth/signup'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicRoute && !user) {
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
