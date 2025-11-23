/**
 * RCF Stream API Route
 *
 * GET /api/rcf/stream
 *
 * Server-Sent Events (SSE) stream for real-time RCF events
 */

import { NextRequest } from 'next/server';
import { createSSEStream, getUserSubscription } from '@total-audio/rcf';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user from session
    // For now, use mock user ID
    const userId = request.headers.get('x-user-id') || 'demo-user';

    // Get user subscription
    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Subscription not found',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Create SSE stream
    const stream = createSSEStream(subscription, () => {
      console.log(`[RCF Stream] User ${userId} disconnected`);
    });

    // Return SSE response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });
  } catch (error) {
    console.error('[RCF Stream API] Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to create stream',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
