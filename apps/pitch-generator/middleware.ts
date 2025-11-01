import { updateSession } from '@total-audio/core-db/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/pricing', '/privacy', '/terms'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith('/auth/callback') ||
    request.nextUrl.pathname.startsWith('/api/auth');

  const authRoutes = ['/auth/signin', '/auth/signup'];
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicRoute && !user) {
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
