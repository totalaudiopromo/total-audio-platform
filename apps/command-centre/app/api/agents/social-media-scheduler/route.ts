import { NextRequest, NextResponse } from 'next/server';

// Social Media Scheduler Agent
// Integrates with Notion workspace and command center
// Manages social media content scheduling for X, LinkedIn, Blue Sky

interface SocialMediaPost {
  id: string;
  content: string;
  platform: 'x' | 'linkedin' | 'bluesky';
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  hashtags: string[];
  engagement?: {
    likes: number;
    retweets: number;
    comments: number;
  };
  notionPageId?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for demo (in production, use database)
let posts: SocialMediaPost[] = [];

export async function POST(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get('authorization');
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('📱 Starting Social Media Scheduler...');

    const results = {
      timestamp: new Date().toISOString(),
      posts_checked: 0,
      posts_scheduled: 0,
      posts_posted: 0,
      posts_failed: 0,
      notion_sync_completed: false,
      next_posts: [] as string[],
      performance_metrics: {
        engagement_rate: 0,
        posting_consistency: 0,
        platform_distribution: { x: 0, linkedin: 0, bluesky: 0 },
      },
    };

    // Check for posts due to be published
    const now = new Date();
    const duePosts = posts.filter(
      post => post.status === 'scheduled' && new Date(post.scheduledTime) <= now
    );

    results.posts_checked = posts.length;
    results.posts_scheduled = duePosts.length;

    // Process due posts
    for (const post of duePosts) {
      try {
        // In Phase 1: Just log the post (no actual API posting)
        console.log(`📱 Publishing to ${post.platform.toUpperCase()}:`, post.content);

        // Simulate posting success/failure
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
          post.status = 'posted';
          post.updatedAt = new Date().toISOString();
          results.posts_posted++;

          // Simulate engagement data
          post.engagement = {
            likes: Math.floor(Math.random() * 50) + 5,
            retweets: Math.floor(Math.random() * 20) + 1,
            comments: Math.floor(Math.random() * 10),
          };
        } else {
          post.status = 'failed';
          post.updatedAt = new Date().toISOString();
          results.posts_failed++;
        }
      } catch (error) {
        console.error(`Failed to post ${post.id}:`, error);
        post.status = 'failed';
        post.updatedAt = new Date().toISOString();
        results.posts_failed++;
      }
    }

    // Get next 5 scheduled posts
    const nextPosts = posts
      .filter(post => post.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
      .slice(0, 5)
      .map(post => `${post.platform.toUpperCase()}: ${post.content.substring(0, 50)}...`);

    results.next_posts = nextPosts;

    // Calculate performance metrics
    const postedPosts = posts.filter(post => post.status === 'posted');
    if (postedPosts.length > 0) {
      const totalEngagement = postedPosts.reduce(
        (sum, post) =>
          sum +
          (post.engagement?.likes || 0) +
          (post.engagement?.retweets || 0) +
          (post.engagement?.comments || 0),
        0
      );
      results.performance_metrics.engagement_rate = totalEngagement / postedPosts.length;
    }

    // Platform distribution
    const platformCounts = posts.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    results.performance_metrics.platform_distribution = {
      x: platformCounts.x || 0,
      linkedin: platformCounts.linkedin || 0,
      bluesky: platformCounts.bluesky || 0,
    };

    // Simulate Notion sync
    results.notion_sync_completed = true;

    console.log('✅ Social Media Scheduler complete:', results);

    return NextResponse.json({
      success: true,
      agent: 'Social Media Scheduler',
      action: 'Social media scheduling completed',
      results,
      next_run: 'Every 15 minutes',
    });
  } catch (error) {
    console.error('❌ Social Media Scheduler failed:', error);
    return NextResponse.json(
      {
        error: 'Social media scheduling failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for command center integration
export async function GET() {
  try {
    const now = new Date();
    const upcomingPosts = posts
      .filter(post => post.status === 'scheduled' && new Date(post.scheduledTime) > now)
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
      .slice(0, 10);

    const recentPosts = posts
      .filter(post => post.status === 'posted')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      agent: 'Social Media Scheduler',
      status: 'active',
      performance: 95,
      currentTask: `Managing ${posts.length} posts across 3 platforms`,
      upcomingPosts,
      recentPosts,
      stats: {
        totalPosts: posts.length,
        scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
        postedToday: posts.filter(
          p => p.status === 'posted' && new Date(p.updatedAt).toDateString() === now.toDateString()
        ).length,
        engagementRate:
          posts.filter(p => p.status === 'posted').length > 0
            ? posts
                .filter(p => p.status === 'posted')
                .reduce(
                  (sum, p) =>
                    sum +
                    (p.engagement?.likes || 0) +
                    (p.engagement?.retweets || 0) +
                    (p.engagement?.comments || 0),
                  0
                ) / posts.filter(p => p.status === 'posted').length
            : 0,
      },
    });
  } catch (error) {
    console.error('❌ Failed to get social media status:', error);
    return NextResponse.json(
      {
        error: 'Failed to get social media status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST endpoint for adding new posts
export async function PUT(request: NextRequest) {
  try {
    const { action, post } = await request.json();

    if (action === 'add') {
      const newPost: SocialMediaPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: post.content,
        platform: post.platform,
        scheduledTime: post.scheduledTime,
        status: 'scheduled',
        hashtags: post.hashtags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      posts.push(newPost);

      return NextResponse.json({
        success: true,
        message: 'Post scheduled successfully',
        post: newPost,
      });
    }

    if (action === 'update') {
      const postIndex = posts.findIndex(p => p.id === post.id);
      if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      posts[postIndex] = { ...posts[postIndex], ...post, updatedAt: new Date().toISOString() };

      return NextResponse.json({
        success: true,
        message: 'Post updated successfully',
        post: posts[postIndex],
      });
    }

    if (action === 'delete') {
      const postIndex = posts.findIndex(p => p.id === post.id);
      if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      posts.splice(postIndex, 1);

      return NextResponse.json({
        success: true,
        message: 'Post deleted successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('❌ Failed to manage post:', error);
    return NextResponse.json(
      {
        error: 'Failed to manage post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
