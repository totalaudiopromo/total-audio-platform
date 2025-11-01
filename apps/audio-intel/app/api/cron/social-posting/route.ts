/**
 * Vercel Cron - Autonomous Social Media Posting
 *
 * Runs twice daily (9am and 5pm UK time)
 * Posts to Bluesky, Twitter/X, LinkedIn, and Threads according to content calendar
 *
 * Vercel cron configuration in vercel.json
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBlueskyAgent } from '@/lib/bluesky-posting-agent';
import { createTwitterAgent } from '@/lib/twitter-posting-agent';
import { createLinkedInAgent } from '@/lib/linkedin-posting-agent';
import { createThreadsAgent } from '@/lib/threads-posting-agent';
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
    console.log('[CRON] 🤖 Autonomous multi-platform social posting triggered');
    console.log('[CRON] ⏰ Time:', new Date().toISOString());

    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('[CRON] ❌ Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const platformResults: Record<string, any> = {};
    const errors: string[] = [];

    // 1. BLUESKY POSTING
    try {
      if (process.env.BLUESKY_IDENTIFIER && process.env.BLUESKY_APP_PASSWORD) {
        console.log('[CRON] 📘 Processing Bluesky...');
        const blueskyAgent = createBlueskyAgent();

        const healthCheck = await blueskyAgent.healthCheck();
        if (healthCheck.healthy) {
          const results = await blueskyAgent.processScheduledPosts(contentCalendar.schedule);
          platformResults.bluesky = results;
          console.log(`[CRON] ✅ Bluesky: ${results.posted} posted, ${results.failed} failed`);
        } else {
          errors.push(`Bluesky health check failed: ${healthCheck.error}`);
          console.error('[CRON] ❌ Bluesky health check failed');
        }
      } else {
        console.log('[CRON] ⏭️  Bluesky credentials not configured - skipping');
      }
    } catch (error) {
      errors.push(`Bluesky error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('[CRON] ❌ Bluesky error:', error);
    }

    // 2. TWITTER/X POSTING
    try {
      if (process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN) {
        console.log('[CRON] 🐦 Processing Twitter/X...');
        const twitterAgent = createTwitterAgent();

        const healthCheck = await twitterAgent.healthCheck();
        if (healthCheck.healthy) {
          const results = await twitterAgent.processScheduledPosts(contentCalendar.schedule);
          platformResults.twitter = results;
          console.log(`[CRON] ✅ Twitter: ${results.posted} posted, ${results.failed} failed`);
        } else {
          errors.push(`Twitter health check failed: ${healthCheck.error}`);
          console.error('[CRON] ❌ Twitter health check failed');
        }
      } else {
        console.log('[CRON] ⏭️  Twitter credentials not configured - skipping');
      }
    } catch (error) {
      errors.push(`Twitter error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('[CRON] ❌ Twitter error:', error);
    }

    // 3. LINKEDIN POSTING
    try {
      if (process.env.LINKEDIN_ACCESS_TOKEN) {
        console.log('[CRON] 💼 Processing LinkedIn...');
        const linkedInAgent = createLinkedInAgent();

        const healthCheck = await linkedInAgent.healthCheck();
        if (healthCheck.healthy) {
          const results = await linkedInAgent.processScheduledPosts(contentCalendar.schedule);
          platformResults.linkedin = results;
          console.log(`[CRON] ✅ LinkedIn: ${results.posted} posted, ${results.failed} failed`);
        } else {
          errors.push(`LinkedIn health check failed: ${healthCheck.error}`);
          console.error('[CRON] ❌ LinkedIn health check failed');
        }
      } else {
        console.log('[CRON] ⏭️  LinkedIn credentials not configured - skipping');
      }
    } catch (error) {
      errors.push(`LinkedIn error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('[CRON] ❌ LinkedIn error:', error);
    }

    // 4. THREADS POSTING
    try {
      if (process.env.THREADS_USER_ID && process.env.THREADS_ACCESS_TOKEN) {
        console.log('[CRON] 🧵 Processing Threads...');
        const threadsAgent = createThreadsAgent();

        const healthCheck = await threadsAgent.healthCheck();
        if (healthCheck.healthy) {
          const results = await threadsAgent.processScheduledPosts(contentCalendar.schedule);
          platformResults.threads = results;
          console.log(`[CRON] ✅ Threads: ${results.posted} posted, ${results.failed} failed`);
        } else {
          errors.push(`Threads health check failed: ${healthCheck.error}`);
          console.error('[CRON] ❌ Threads health check failed');
        }
      } else {
        console.log('[CRON] ⏭️  Threads credentials not configured - skipping');
      }
    } catch (error) {
      errors.push(`Threads error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('[CRON] ❌ Threads error:', error);
    }

    // Calculate totals
    const totals = {
      posted: Object.values(platformResults).reduce(
        (sum: number, r: any) => sum + (r.posted || 0),
        0
      ),
      skipped: Object.values(platformResults).reduce(
        (sum: number, r: any) => sum + (r.skipped || 0),
        0
      ),
      failed: Object.values(platformResults).reduce(
        (sum: number, r: any) => sum + (r.failed || 0),
        0
      ),
    };

    console.log('[CRON] 📊 Total results:');
    console.log(`       Posted: ${totals.posted}`);
    console.log(`       Skipped: ${totals.skipped}`);
    console.log(`       Failed: ${totals.failed}`);

    // Return unified response
    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        platforms: Object.keys(platformResults),
        totals,
        platformResults,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CRON] ❌ Error during autonomous posting:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
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
        hint: 'Use POST with proper authorization in production',
      },
      { status: 403 }
    );
  }

  // In development, allow manual trigger via GET
  console.log('[CRON] 🧪 Manual test trigger (development mode)');

  // Forward to POST handler
  return POST(request);
}
