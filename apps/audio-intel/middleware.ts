import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}