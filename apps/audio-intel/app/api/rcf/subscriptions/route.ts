/**
 * RCF Subscriptions API Route
 *
 * GET /api/rcf/subscriptions - Get user subscription
 * POST /api/rcf/subscriptions - Update user subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserSubscription, updateUserSubscription } from '@total-audio/rcf';
import type { RCFSubscriptionInput } from '@total-audio/rcf/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/rcf/subscriptions
 * Get current user subscription
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user from session
    // For now, use mock user ID
    const userId = request.headers.get('x-user-id') || 'demo-user';

    // Get subscription
    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('[RCF Subscriptions API] GET Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get subscription',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rcf/subscriptions
 * Update user subscription
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Get authenticated user from session
    // For now, use mock user ID
    const userId = request.headers.get('x-user-id') || 'demo-user';

    // Parse request body
    const body = await request.json();
    const updates: RCFSubscriptionInput = {
      subscribed_types: body.subscribed_types,
      subscribed_artists: body.subscribed_artists,
      subscribed_scenes: body.subscribed_scenes,
    };

    // Update subscription
    const subscription = await updateUserSubscription(userId, updates);

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update subscription',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('[RCF Subscriptions API] POST Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update subscription',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
