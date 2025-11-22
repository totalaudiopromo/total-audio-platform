/**
 * Phase 9D-2A: BlueSky Integration
 * Read posts and authenticate with BlueSky API
 */

import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

interface BlueSkyPost {
  uri: string;
  text: string;
  createdAt: string;
  likeCount: number;
  repostCount: number;
}

/**
 * Get recent BlueSky posts
 */
export async function GET() {
  try {
    if (!env.BLUESKY_IDENTIFIER || !env.BLUESKY_APP_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: 'BlueSky credentials not configured',
          configured: false,
        },
        { status: 400 }
      );
    }

    // Step 1: Create session (authenticate)
    const authResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: env.BLUESKY_IDENTIFIER,
        password: env.BLUESKY_APP_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      const error = await authResponse.text();
      console.error('BlueSky auth failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'BlueSky authentication failed',
          configured: true,
        },
        { status: 401 }
      );
    }

    const session = await authResponse.json();
    const { accessJwt, did } = session;

    // Step 2: Get author feed (recent posts)
    const feedResponse = await fetch(
      `https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=${did}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessJwt}`,
        },
      }
    );

    if (!feedResponse.ok) {
      const error = await feedResponse.text();
      console.error('BlueSky feed fetch failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch BlueSky posts',
          configured: true,
        },
        { status: 500 }
      );
    }

    const feedData = await feedResponse.json();
    const posts: BlueSkyPost[] = feedData.feed.map((item: any) => ({
      uri: item.post.uri,
      text: item.post.record.text,
      createdAt: item.post.record.createdAt,
      likeCount: item.post.likeCount || 0,
      repostCount: item.post.repostCount || 0,
    }));

    return NextResponse.json({
      success: true,
      configured: true,
      connected: true,
      posts,
      lastSync: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('BlueSky API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'BlueSky integration failed',
        configured: !!env.BLUESKY_IDENTIFIER,
      },
      { status: 500 }
    );
  }
}

/**
 * Post to BlueSky (behind FEATURE_AUTOMATION flag)
 */
export async function POST(request: Request) {
  try {
    if (!env.FEATURE_AUTOMATION) {
      return NextResponse.json(
        {
          success: false,
          error: 'Automation features not enabled',
        },
        { status: 403 }
      );
    }

    if (!env.BLUESKY_IDENTIFIER || !env.BLUESKY_APP_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: 'BlueSky credentials not configured',
        },
        { status: 400 }
      );
    }

    const { text } = await request.json();

    if (!text || text.length > 300) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post text required (max 300 characters)',
        },
        { status: 400 }
      );
    }

    // Step 1: Authenticate
    const authResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: env.BLUESKY_IDENTIFIER,
        password: env.BLUESKY_APP_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      throw new Error('BlueSky authentication failed');
    }

    const session = await authResponse.json();
    const { accessJwt, did } = session;

    // Step 2: Create post
    const postResponse = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessJwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repo: did,
        collection: 'app.bsky.feed.post',
        record: {
          text,
          createdAt: new Date().toISOString(),
          $type: 'app.bsky.feed.post',
        },
      }),
    });

    if (!postResponse.ok) {
      const error = await postResponse.text();
      console.error('BlueSky post failed:', error);
      throw new Error('Failed to create BlueSky post');
    }

    const postData = await postResponse.json();

    return NextResponse.json({
      success: true,
      post: {
        uri: postData.uri,
        cid: postData.cid,
      },
    });
  } catch (error: any) {
    console.error('BlueSky POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to post to BlueSky',
      },
      { status: 500 }
    );
  }
}
