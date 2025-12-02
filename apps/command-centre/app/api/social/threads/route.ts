/**
 * Phase 9D-2A: Threads Integration (Read-Only Stub)
 * Placeholder for Threads API integration
 */

import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

interface ThreadsPost {
  id: string;
  text: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
}

/**
 * Get recent Threads posts (read-only)
 */
export async function GET() {
  try {
    if (!env.THREADS_USER_ID || !env.THREADS_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: 'Threads credentials not configured',
          configured: false,
          status: 'not_implemented',
        },
        { status: 400 }
      );
    }

    // Threads Graph API implementation would go here
    // For now, return stub response indicating beta status

    return NextResponse.json({
      success: true,
      configured: true,
      connected: false,
      status: 'beta',
      message:
        'Threads integration is in beta. Full API access requires Meta approval and Threads Graph API access.',
      posts: [],
      lastSync: null,
    });
  } catch (error: any) {
    console.error('Threads API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Threads integration failed',
        configured: !!env.THREADS_USER_ID,
        status: 'beta',
      },
      { status: 500 }
    );
  }
}

/**
 * Post to Threads (not yet implemented)
 */
export async function POST(request: Request) {
  return NextResponse.json(
    {
      success: false,
      error: 'Threads posting not yet implemented. Awaiting Meta API approval.',
      status: 'beta',
    },
    { status: 501 }
  );
}
