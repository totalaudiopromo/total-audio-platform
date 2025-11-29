import { createServerClient } from '@supabase/ssr';
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

  let supabaseResponse = NextResponse.next({
    request,
  });

  // Check if Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, allow public access to all routes
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes('placeholder') ||
    !supabaseUrl.startsWith('http')
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/demo',
    '/pricing',
    '/privacy',
    '/terms',
    '/billing',
    '/upgrade',
    '/verify-email',
    '/api/health',
  ];
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/auth/callback');

  // Auth routes
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);

  // Redirect authenticated users from auth pages to homepage
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Require auth for all non-public routes (unless API key was provided)
  if (!isPublicRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (server-side data fetches)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|_next/data|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
