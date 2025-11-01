import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@total-audio/core-db/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''

  // Update Supabase session
  const { supabaseResponse, user } = await updateSession(request)

  // Protected routes that require authentication
  const protectedPaths = [
    '/demo',
    '/dashboard',
  ]

  // Protected API routes
  const protectedAPIPaths = [
    '/api/enrich',
    '/api/enrich-claude',
    '/api/usage',
    '/api/checkout',
  ]

  // Check if current path needs authentication
  const needsAuth = protectedPaths.some(path => pathname.startsWith(path)) ||
                    protectedAPIPaths.some(path => pathname.startsWith(path))

  // Redirect to signin if not authenticated
  if (needsAuth && !user) {
    const redirectUrl = new URL('/signin', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
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
    '/progress-dashboard',
    '/user-acquisition-dashboard',
    '/newsletter-dashboard',
    '/podcast-monitor',
    '/email-preview',
    '/seo-analysis'
  ]

  // Redirect test pages in production
  if (process.env.NODE_ENV === 'production' && testPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url))
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
    'facebot'
  ]

  // Check if the request is from a social media crawler
  const isSocialCrawler = socialCrawlers.some(crawler =>
    userAgent.includes(crawler)
  )

  // If it's a social crawler, bypass authentication by setting a bypass header
  if (isSocialCrawler) {
    const response = NextResponse.next()
    // Add headers that might help bypass Vercel's protection for crawlers
    response.headers.set('x-robots-tag', 'index, follow')
    return response
  }

  return supabaseResponse
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
}
