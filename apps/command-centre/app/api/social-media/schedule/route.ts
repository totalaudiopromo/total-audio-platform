import { NextRequest, NextResponse } from 'next/server';

interface SchedulePostRequest {
  platforms: string[];
  content: string;
  media?: string[];
  scheduledTime?: string;
  hashtags?: string[];
  postType: 'announcement' | 'beta-update' | 'feature' | 'custom';
  template?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SchedulePostRequest = await request.json();
    const { platforms, content, media, scheduledTime, hashtags, postType, template } = body;

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform must be selected' },
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    }

    // Validate scheduled time if provided
    let postDate = new Date();
    if (scheduledTime) {
      const scheduleDate = new Date(scheduledTime);
      if (isNaN(scheduleDate.getTime())) {
        return NextResponse.json({ error: 'Invalid scheduled time format' }, { status: 400 });
      }
      if (scheduleDate <= new Date()) {
        return NextResponse.json(
          { error: 'Scheduled time must be in the future' },
          { status: 400 }
        );
      }
      postDate = scheduleDate;
    }

    // Generate platform-specific content
    const platformPosts = await Promise.all(
      platforms.map(async platform => {
        const optimizedContent = await optimizeContentForPlatform(content, platform, hashtags);
        return {
          platform,
          content: optimizedContent,
          media: media || [],
          scheduledTime: postDate,
          status: scheduledTime ? 'scheduled' : 'posted',
        };
      })
    );

    // For now, we'll simulate scheduling - in production this would integrate with actual APIs
    const scheduleId = `schedule_${Date.now()}`;

    // Store in database (simulated)
    const scheduledPost = {
      id: scheduleId,
      postType,
      template,
      originalContent: content,
      platforms: platformPosts,
      createdAt: new Date(),
      status: 'scheduled',
    };

    // Log the scheduled post
    console.log('Social media post scheduled:', scheduledPost);

    return NextResponse.json({
      success: true,
      scheduleId,
      platforms: platformPosts.map(p => ({
        platform: p.platform,
        content: p.content,
        scheduledTime: p.scheduledTime,
      })),
      message: scheduledTime
        ? `Post scheduled for ${platforms.length} platform(s) at ${postDate.toLocaleString()}`
        : `Post published immediately to ${platforms.length} platform(s)`,
    });
  } catch (error) {
    console.error('Social media scheduling error:', error);
    return NextResponse.json({ error: 'Failed to schedule social media post' }, { status: 500 });
  }
}

async function optimizeContentForPlatform(
  content: string,
  platform: string,
  hashtags?: string[]
): Promise<string> {
  const platformLimits: Record<string, { maxLength: number; hashtagLimit: number }> = {
    twitter: { maxLength: 280, hashtagLimit: 3 },
    linkedin: { maxLength: 1300, hashtagLimit: 5 },
    bluesky: { maxLength: 300, hashtagLimit: 5 },
    instagram: { maxLength: 2200, hashtagLimit: 30 },
    facebook: { maxLength: 63206, hashtagLimit: 5 },
    tiktok: { maxLength: 150, hashtagLimit: 5 },
  };

  const limits = platformLimits[platform] || { maxLength: 280, hashtagLimit: 3 };

  let optimizedContent = content;

  // Add hashtags if provided
  if (hashtags && hashtags.length > 0) {
    const limitedHashtags = hashtags.slice(0, limits.hashtagLimit);
    const hashtagString = limitedHashtags
      .map(tag => (tag.startsWith('#') ? tag : `#${tag}`))
      .join(' ');
    optimizedContent = `${content}\n\n${hashtagString}`;
  }

  // Truncate if too long
  if (optimizedContent.length > limits.maxLength) {
    optimizedContent = optimizedContent.substring(0, limits.maxLength - 3) + '...';
  }

  // Platform-specific optimizations
  switch (platform) {
    case 'twitter':
      // Twitter thread handling could go here
      break;
    case 'linkedin':
      // LinkedIn professional tone adjustments
      break;
    case 'bluesky':
      // Blue Sky specific formatting
      break;
  }

  return optimizedContent;
}

export async function GET(request: NextRequest) {
  try {
    // Return scheduled posts (simulated)
    const scheduledPosts = [
      {
        id: 'schedule_1',
        postType: 'announcement',
        platforms: ['twitter', 'linkedin', 'bluesky'],
        content:
          'Audio Intel is now live! 🎵 Transform your music promotion with AI-powered contact enrichment.',
        scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
        status: 'scheduled',
      },
    ];

    return NextResponse.json({
      success: true,
      posts: scheduledPosts,
      count: scheduledPosts.length,
    });
  } catch (error) {
    console.error('Failed to fetch scheduled posts:', error);
    return NextResponse.json({ error: 'Failed to fetch scheduled posts' }, { status: 500 });
  }
}
