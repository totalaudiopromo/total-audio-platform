import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Try to import updateSession, but handle gracefully if not available
let updateSession:
  | ((request: NextRequest) => Promise<{ supabaseResponse: NextResponse; user: any }>)
  | null = null;

try {
  const coreDb = require('@total-audio/core-db/middleware');
  updateSession = coreDb.updateSession;
} catch (error) {
  console.warn('Could not load @total-audio/core-db/middleware, using fallback');
  // Fallback: create a simple updateSession function
  updateSession = async (request: NextRequest) => {
    return {
      supabaseResponse: NextResponse.next(),
      user: null,
    };
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

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

  // Update Supabase session (with fallback)
  let supabaseResponse = NextResponse.next();
  let user = null;

  if (updateSession) {
    try {
      const result = await updateSession(request);
      supabaseResponse = result.supabaseResponse;
      user = result.user;
    } catch (error) {
      console.warn('Session update failed, continuing without auth:', error);
    }
  }

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard'];

  // Protected API routes (only apply session auth if no API key)
  const protectedAPIPaths = ['/api/enrich', '/api/enrich-claude', '/api/usage', '/api/checkout'];

  // Check if current path needs authentication
  const needsAuth =
    protectedPaths.some(path => pathname.startsWith(path)) ||
    protectedAPIPaths.some(path => pathname.startsWith(path));

  // Redirect to signin if not authenticated (and no API key)
  if (needsAuth && !user) {
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Protect test/debug pages in production
  const testPaths = [
    '/test',
    '/test-tailwind',
    '/simple-test',
    '/debug-content',
    '/notion-test',
    '/notion-social',
    '/pdf-test',
    '/pdf-samples',
    '/social-media-demo',
    '/social-media-simple',
    '/uk-social-mobile',
    '/export-demo',
    '/brutalist-pdf-test',
    '/progress-dashboard',
    '/user-acquisition-dashboard',
    '/newsletter-dashboard',
    '/podcast-monitor',
    '/email-preview',
    '/seo-analysis',
  ];

  // Redirect test pages in production
  if (process.env.NODE_ENV === 'production' && testPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // List of social media crawler user agents
  const socialCrawlers = [
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'slackbot',
    'discordbot',
    'telegrambot',
    'whatsapp',
    'googlebot',
    'bingbot',
    'applebot',
    'meta-externalagent',
    'meta-externalhit',
    'facebot',
  ];

  // Check if the request is from a social media crawler
  const isSocialCrawler = socialCrawlers.some(crawler => userAgent.includes(crawler));

  // If it's a social crawler, bypass authentication by setting a bypass header
  if (isSocialCrawler) {
    const response = NextResponse.next();
    // Add headers that might help bypass Vercel's protection for crawlers
    response.headers.set('x-robots-tag', 'index, follow');
    return response;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images folder
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
