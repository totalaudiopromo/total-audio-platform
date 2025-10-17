/**
 * Vercel Cron - Autonomous Social Media Posting
 *
 * Runs twice daily (9am and 6pm UK time)
 * Posts to Bluesky according to content calendar
 *
 * Vercel cron configuration in vercel.json
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBlueskyAgent } from '@/lib/bluesky-posting-agent';
import contentCalendar from '@/social-content/CONTENT_CALENDAR.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/cron/social-posting
 *
 * Triggered by Vercel cron twice daily
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[CRON] 🤖 Autonomous social posting triggered');
    console.log('[CRON] ⏰ Time:', new Date().toISOString());

    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('[CRON] ❌ Unauthorized request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Bluesky agent
    const blueskyAgent = createBlueskyAgent();

    // Health check
    const healthCheck = await blueskyAgent.healthCheck();
    if (!healthCheck.healthy) {
      console.error('[CRON] ❌ Bluesky health check failed:', healthCheck.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Bluesky health check failed',
          details: healthCheck.error
        },
        { status: 500 }
      );
    }

    console.log('[CRON] ✅ Bluesky health check passed');

    // Process scheduled posts
    const results = await blueskyAgent.processScheduledPosts(contentCalendar.schedule);

    console.log('[CRON] 📊 Posting results:');
    console.log(`       Posted: ${results.posted}`);
    console.log(`       Skipped: ${results.skipped}`);
    console.log(`       Failed: ${results.failed}`);

    // Log details
    results.details.forEach(detail => {
      if (detail.status === 'posted') {
        console.log(`[CRON] ✅ ${detail.title} - ${detail.uri}`);
      } else if (detail.status === 'failed') {
        console.error(`[CRON] ❌ ${detail.title} - ${detail.error}`);
      }
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        platform: 'bluesky',
        results: {
          posted: results.posted,
          skipped: results.skipped,
          failed: results.failed,
          details: results.details
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[CRON] ❌ Error during autonomous posting:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/social-posting
 *
 * Manual trigger for testing (not used by cron)
 */
export async function GET(request: NextRequest) {
  // Check if this is a manual test trigger
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    return NextResponse.json(
      {
        error: 'Manual trigger only available in development',
        hint: 'Use POST with proper authorization in production'
      },
      { status: 403 }
    );
  }

  // In development, allow manual trigger via GET
  console.log('[CRON] 🧪 Manual test trigger (development mode)');

  // Forward to POST handler
  return POST(request);
}
