/**
 * Direct Social Media Posting API
 *
 * POST /api/social/post
 *
 * Posts content directly to multiple social platforms
 * Supports: Bluesky, Twitter/X, LinkedIn, Threads
 */

import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

interface PostRequest {
  content: string;
  platforms: ('bluesky' | 'twitter' | 'linkedin' | 'threads')[];
}

interface PlatformResult {
  platform: string;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

/**
 * POST to Bluesky
 */
async function postToBluesky(text: string): Promise<PlatformResult> {
  if (!env.BLUESKY_IDENTIFIER || !env.BLUESKY_APP_PASSWORD) {
    return { platform: 'bluesky', success: false, error: 'Not configured' };
  }

  try {
    // Authenticate
    const authResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: env.BLUESKY_IDENTIFIER,
        password: env.BLUESKY_APP_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      return { platform: 'bluesky', success: false, error: 'Authentication failed' };
    }

    const { accessJwt, did } = await authResponse.json();

    // Post
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
          text: text.slice(0, 300), // Bluesky 300 char limit
          createdAt: new Date().toISOString(),
          $type: 'app.bsky.feed.post',
        },
      }),
    });

    if (!postResponse.ok) {
      const error = await postResponse.text();
      return { platform: 'bluesky', success: false, error };
    }

    const result = await postResponse.json();
    const postId = result.uri.split('/').pop();

    return {
      platform: 'bluesky',
      success: true,
      postId: result.uri,
      url: `https://bsky.app/profile/${env.BLUESKY_IDENTIFIER}/post/${postId}`,
    };
  } catch (error) {
    return {
      platform: 'bluesky',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * POST to Twitter/X
 */
async function postToTwitter(text: string): Promise<PlatformResult> {
  const apiKey = env.TWITTER_CLIENT_ID;
  const apiSecret = env.TWITTER_CLIENT_SECRET;
  const accessToken = env.TWITTER_ACCESS_TOKEN;
  const accessSecret = env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { platform: 'twitter', success: false, error: 'Not configured' };
  }

  try {
    // Twitter API v2 requires OAuth 1.0a
    // For now, return not implemented - would need oauth-1.0a package
    return {
      platform: 'twitter',
      success: false,
      error: 'Twitter posting requires OAuth 1.0a setup - use Puppeteer automation instead',
    };
  } catch (error) {
    return {
      platform: 'twitter',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * POST to LinkedIn
 */
async function postToLinkedIn(text: string): Promise<PlatformResult> {
  const accessToken = env.LINKEDIN_ACCESS_TOKEN;

  if (!accessToken) {
    return { platform: 'linkedin', success: false, error: 'Not configured' };
  }

  try {
    // Get user profile first
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileResponse.ok) {
      return { platform: 'linkedin', success: false, error: 'Failed to get profile' };
    }

    const profile = await profileResponse.json();
    const authorUrn = `urn:li:person:${profile.sub}`;

    // Create post
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    if (!postResponse.ok) {
      const error = await postResponse.text();
      return { platform: 'linkedin', success: false, error };
    }

    const result = await postResponse.json();

    return {
      platform: 'linkedin',
      success: true,
      postId: result.id,
      url: `https://www.linkedin.com/feed/update/${result.id}`,
    };
  } catch (error) {
    return {
      platform: 'linkedin',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * POST to Threads
 */
async function postToThreads(text: string): Promise<PlatformResult> {
  const userId = env.THREADS_USER_ID;
  const accessToken = env.THREADS_ACCESS_TOKEN;

  if (!userId || !accessToken) {
    return { platform: 'threads', success: false, error: 'Not configured' };
  }

  try {
    // Create media container
    const createUrl = new URL(`https://graph.threads.net/v1.0/${userId}/threads`);
    createUrl.searchParams.append('media_type', 'TEXT');
    createUrl.searchParams.append('text', text.slice(0, 500)); // Threads 500 char limit
    createUrl.searchParams.append('access_token', accessToken);

    const createResponse = await fetch(createUrl.toString(), { method: 'POST' });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      return { platform: 'threads', success: false, error };
    }

    const { id: containerId } = await createResponse.json();

    // Publish
    const publishUrl = new URL(`https://graph.threads.net/v1.0/${userId}/threads_publish`);
    publishUrl.searchParams.append('creation_id', containerId);
    publishUrl.searchParams.append('access_token', accessToken);

    const publishResponse = await fetch(publishUrl.toString(), { method: 'POST' });

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      return { platform: 'threads', success: false, error };
    }

    const { id: postId } = await publishResponse.json();

    return {
      platform: 'threads',
      success: true,
      postId,
      url: `https://www.threads.net/@totalaudiopromo/post/${postId}`,
    };
  } catch (error) {
    return {
      platform: 'threads',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * POST /api/social/post
 *
 * Direct posting to multiple platforms
 */
export async function POST(request: NextRequest) {
  try {
    const body: PostRequest = await request.json();
    const { content, platforms } = body;

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content and at least one platform required' },
        { status: 400 }
      );
    }

    console.log(`[DIRECT POST] Posting to ${platforms.join(', ')}`);

    // Post to all selected platforms in parallel
    const results: PlatformResult[] = await Promise.all(
      platforms.map(async platform => {
        switch (platform) {
          case 'bluesky':
            return postToBluesky(content);
          case 'twitter':
            return postToTwitter(content);
          case 'linkedin':
            return postToLinkedIn(content);
          case 'threads':
            return postToThreads(content);
          default:
            return { platform, success: false, error: 'Unknown platform' };
        }
      })
    );

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`[DIRECT POST] Results: ${successful.length} succeeded, ${failed.length} failed`);

    return NextResponse.json({
      success: successful.length > 0,
      results,
      summary: {
        total: platforms.length,
        succeeded: successful.length,
        failed: failed.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[DIRECT POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/social/post
 *
 * Get platform configuration status
 */
export async function GET() {
  const platforms = {
    bluesky: {
      configured: !!(env.BLUESKY_IDENTIFIER && env.BLUESKY_APP_PASSWORD),
      name: 'Bluesky',
      charLimit: 300,
    },
    twitter: {
      configured: !!(
        env.TWITTER_CLIENT_ID &&
        env.TWITTER_CLIENT_SECRET &&
        env.TWITTER_ACCESS_TOKEN &&
        env.TWITTER_ACCESS_TOKEN_SECRET
      ),
      name: 'Twitter/X',
      charLimit: 280,
      note: 'Requires OAuth 1.0a - use Puppeteer automation',
    },
    linkedin: {
      configured: !!env.LINKEDIN_ACCESS_TOKEN,
      name: 'LinkedIn',
      charLimit: 3000,
    },
    threads: {
      configured: !!(env.THREADS_USER_ID && env.THREADS_ACCESS_TOKEN),
      name: 'Threads',
      charLimit: 500,
    },
  };

  const configuredCount = Object.values(platforms).filter(p => p.configured).length;

  return NextResponse.json({
    success: true,
    platforms,
    summary: {
      total: 4,
      configured: configuredCount,
    },
  });
}
