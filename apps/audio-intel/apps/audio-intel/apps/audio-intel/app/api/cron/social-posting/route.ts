/**
 * Vercel Cron - Autonomous Social Media Posting
 *
 * Runs twice daily (9am and 5pm UK time)
 * Posts to Bluesky according to content calendar
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBlueskyAgent } from '@/lib/bluesky-posting-agent';
import contentCalendar from '@/social-content/CONTENT_CALENDAR.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[CRON] 🤖 Autonomous social posting triggered');
    console.log('[CRON] ⏰ Time:', new Date().toISOString());

    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('[CRON] ❌ Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blueskyAgent = createBlueskyAgent();
    const healthCheck = await blueskyAgent.healthCheck();
    
    if (!healthCheck.healthy) {
      console.error('[CRON] ❌ Bluesky health check failed:', healthCheck.error);
      return NextResponse.json(
        { success: false, error: 'Bluesky health check failed', details: healthCheck.error },
        { status: 500 }
      );
    }

    console.log('[CRON] ✅ Bluesky health check passed');

    const results = await blueskyAgent.processScheduledPosts(contentCalendar.schedule);

    console.log('[CRON] 📊 Posting results:');
    console.log(`       Posted: ${results.posted}`);
    console.log(`       Skipped: ${results.skipped}`);
    console.log(`       Failed: ${results.failed}`);

    results.details.forEach(detail => {
      if (detail.status === 'posted') {
        console.log(`[CRON] ✅ ${detail.title} - ${detail.uri}`);
      } else if (detail.status === 'failed') {
        console.error(`[CRON] ❌ ${detail.title} - ${detail.error}`);
      }
    });

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

export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) {
    return NextResponse.json(
      { error: 'Manual trigger only available in development' },
      { status: 403 }
    );
  }
  console.log('[CRON] 🧪 Manual test trigger (development mode)');
  return POST(request);
}
