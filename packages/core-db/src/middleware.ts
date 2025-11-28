import { createServerClient } from '@supabase/ssr';
import type { Database } from './types/database';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Create a Supabase client for middleware usage
 *
 * This client is for use in Next.js middleware to handle authentication
 * and session management for protected routes.
 *
 * @param request - Next.js request object
 *
 * @example
 * ```typescript
 * import { updateSession } from "@total-audio/core-db/middleware";
 * import { NextResponse } from "next/server";
 * import type { NextRequest } from "next/server";
 *
 * export async function middleware(request: NextRequest) {
 *   const { supabaseResponse } = await updateSession(request);
 *   return supabaseResponse;
 * }
 *
 * export const config = {
 *   matcher: [
 *     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
 *   ],
 * };
 * ```
 */
export async function updateSession(request: NextRequest) {
  // Access environment variables at runtime (not import time)
  // This avoids RSC serialisation issues during static generation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        supabaseResponse.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        supabaseResponse.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
