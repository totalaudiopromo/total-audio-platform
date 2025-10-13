/**
 * Shared authentication middleware for Total Audio apps
 * Handles session refresh and authentication checks
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types/database'

/**
 * Middleware configuration options
 */
export interface MiddlewareConfig {
  /**
   * Routes that require authentication
   */
  protectedRoutes?: string[]

  /**
   * Routes that should redirect to dashboard if already authenticated
   */
  authRoutes?: string[]

  /**
   * Redirect path for unauthenticated users
   */
  signInPath?: string

  /**
   * Redirect path after successful authentication
   */
  defaultRedirect?: string
}

const DEFAULT_CONFIG: Required<MiddlewareConfig> = {
  protectedRoutes: ['/dashboard', '/settings', '/profile'],
  authRoutes: ['/signin', '/signup', '/auth'],
  signInPath: '/signin',
  defaultRedirect: '/dashboard',
}

/**
 * Create authentication middleware
 */
export function createMiddleware(config: MiddlewareConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  return async function middleware(request: NextRequest) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session if expired
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Check if current route is protected
    const isProtectedRoute = finalConfig.protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )

    // Check if current route is an auth route
    const isAuthRoute = finalConfig.authRoutes.some((route) =>
      pathname.startsWith(route)
    )

    // Redirect unauthenticated users away from protected routes
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL(finalConfig.signInPath, request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect authenticated users away from auth routes
    if (isAuthRoute && user) {
      const redirectTo =
        request.nextUrl.searchParams.get('redirectTo') ||
        finalConfig.defaultRedirect
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    return response
  }
}

/**
 * Default middleware with common configuration
 */
export const authMiddleware = createMiddleware()
