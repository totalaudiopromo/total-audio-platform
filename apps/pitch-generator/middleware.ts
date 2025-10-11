import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/unauthorized';
    redirectUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/settings/:path*'],
};
