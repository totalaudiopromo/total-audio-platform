import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Check if Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If Supabase is not configured, allow public access to all routes
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || !supabaseUrl.startsWith('http')) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/demo'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith('/blog');

  // Auth routes
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

  // Redirect authenticated users from auth pages to homepage
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Require auth for all non-public routes
  if (!isPublicRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
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
    '/((?!_next/static|_next/image|_next/data|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
