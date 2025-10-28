import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const authCookie = request.cookies.get('command-centre-auth');

  // If accessing login page, allow through
  if (request.nextUrl.pathname === '/auth/login') {
    return NextResponse.next();
  }

  // If not authenticated, redirect to login
  if (!authCookie || authCookie.value !== process.env.COMMAND_CENTRE_AUTH_TOKEN) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
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
