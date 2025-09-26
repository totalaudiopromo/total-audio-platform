import { NextRequest, NextResponse } from 'next/server';

interface ContentPerformance {
  contentId: string;
  platform: 'twitter' | 'linkedin' | 'instagram' | 'newsletter';
  originalStory: {
    title: string;
    source: string;
    publishedAt: string;
    relevanceScore: number;
  };
  postMetrics: {
    impressions: number;
    engagement: number;
    clicks: number;
    shares: number;
    comments: number;
    saves?: number; // Instagram
    reactions?: number; // LinkedIn
  };
  businessMetrics: {
    websiteTraffic: number;
    signups: number;
    demoRequests: number;
    conversions: number;
  };
  timing: {
    newsPublishedAt: string;
    contentGeneratedAt: string;
    approvedAt: string;
    postedAt: string;
    timeToPost: number; // minutes from news to post
  };
  performance: {
    engagementRate: number;
    clickThroughRate: number;
    conversionRate: number;
    reachMultiplier: number;
    viralityScore: number;
  };
  audioIntelAngle: string;
  urgencyLevel: 'immediate' | 'high' | 'medium' | 'low';
  tags: string[];
}

// Mock performance data (in production this would come from real social media APIs)
let performanceData: ContentPerformance[] = [];

// Initialize with some realistic performance data
const initializeMockData = () => {
  if (performanceData.length === 0) {
    const mockData: ContentPerformance[] = [
      {
        contentId: 'content_spotify_playlist_ai',
        platform: 'twitter',
        originalStory: {
          title: 'Spotify Announces AI-Powered Playlist Creation Tool for Independent Artists',
          source: 'Music Business Worldwide',
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          relevanceScore: 0.95
        },
        postMetrics: {
          impressions: 15420,
          engagement: 847,
          clicks: 156,
          shares: 23,
          comments: 34
        },
        businessMetrics: {
          websiteTraffic: 89,
          signups: 7,
          demoRequests: 3,
          conversions: 2
        },
        timing: {
          newsPublishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          contentGeneratedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 min later
          approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 67 * 60 * 1000).toISOString(), // 67 min later
          postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 90 min later
          timeToPost: 90
        },
        performance: {
          engagementRate: 5.5, // (847/15420)*100
          clickThroughRate: 1.01, // (156/15420)*100  
          conversionRate: 1.28, // (2/156)*100
          reachMultiplier: 2.3, // Impressions vs normal posts
          viralityScore: 0.8 // Based on shares and engagement velocity
        },
        audioIntelAngle: 'Major platforms finally giving indies the tools they need',
        urgencyLevel: 'immediate',
        tags: ['playlist', 'ai', 'spotify', 'independent-artist']
      },
      {
        contentId: 'content_uk_radio_automation',
        platform: 'linkedin',
        originalStory: {
          title: 'Major UK Radio Stations Eliminate Manual Submission Processes',
          source: 'Music Week',
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          relevanceScore: 0.88
        },
        postMetrics: {
          impressions: 8940,
          engagement: 312,
          clicks: 67,
          shares: 12,
          comments: 18,
          reactions: 89
        },
        businessMetrics: {
          websiteTraffic: 45,
          signups: 4,
          demoRequests: 2,
          conversions: 1
        },
        timing: {
          newsPublishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          contentGeneratedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
          approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
          postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 5 hours later
          timeToPost: 300 // 5 hours
        },
        performance: {
          engagementRate: 3.49, // LinkedIn typically lower engagement rates
          clickThroughRate: 0.75,
          conversionRate: 1.49,
          reachMultiplier: 1.8,
          viralityScore: 0.6
        },
        audioIntelAngle: 'Manual barriers removed - indies can now compete on equal footing',
        urgencyLevel: 'high',
        tags: ['radio', 'uk', 'automation', 'submission']
      },
      {
        contentId: 'content_streaming_algorithm',
        platform: 'instagram',
        originalStory: {
          title: 'TikTok Updates Music Discovery Algorithm to Favor Independent Artists',
          source: 'Digital Music News',
          publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          relevanceScore: 0.92
        },
        postMetrics: {
          impressions: 12300,
          engagement: 690,
          clicks: 89,
          shares: 45,
          comments: 67,
          saves: 34
        },
        businessMetrics: {
          websiteTraffic: 67,
          signups: 5,
          demoRequests: 1,
          conversions: 1
        },
        timing: {
          newsPublishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          contentGeneratedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 min later
          approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 min later
          postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour later
          timeToPost: 60
        },
        performance: {
          engagementRate: 5.61,
          clickThroughRate: 0.72,
          conversionRate: 1.12,
          reachMultiplier: 2.1,
          viralityScore: 0.85
        },
        audioIntelAngle: 'Algorithm change = new contact strategies needed. Audio Intel adapts fastest',
        urgencyLevel: 'immediate',
        tags: ['tiktok', 'algorithm', 'independent-artist', 'discovery']
      }
    ];
    
    performanceData.push(...mockData);
  }
};

export async function GET(request: NextRequest) {
  try {
    initializeMockData();
    
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const timeframe = searchParams.get('timeframe') || '7d'; // 7d, 30d, 90d
    const contentId = searchParams.get('contentId');
    
    let filteredData = [...performanceData];
    
    // Filter by platform if specified
    if (platform) {
      filteredData = filteredData.filter(item => item.platform === platform);
    }
    
    // Filter by specific content if specified
    if (contentId) {
      filteredData = filteredData.filter(item => item.contentId === contentId);
    }
    
    // Filter by timeframe
    const now = new Date();
    const timeframeDays = timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 7;
    const cutoffDate = new Date(now.getTime() - timeframeDays * 24 * 60 * 60 * 1000);
    
    filteredData = filteredData.filter(item => 
      new Date(item.timing.postedAt) >= cutoffDate
    );
    
    // Calculate aggregate metrics
    const totalImpressions = filteredData.reduce((sum, item) => sum + item.postMetrics.impressions, 0);
    const totalEngagement = filteredData.reduce((sum, item) => sum + item.postMetrics.engagement, 0);
    const totalClicks = filteredData.reduce((sum, item) => sum + item.postMetrics.clicks, 0);
    const totalConversions = filteredData.reduce((sum, item) => sum + item.businessMetrics.conversions, 0);
    const totalTraffic = filteredData.reduce((sum, item) => sum + item.businessMetrics.websiteTraffic, 0);
    const totalSignups = filteredData.reduce((sum, item) => sum + item.businessMetrics.signups, 0);
    
    const avgTimeToPost = filteredData.reduce((sum, item) => sum + item.timing.timeToPost, 0) / filteredData.length || 0;
    const avgEngagementRate = filteredData.reduce((sum, item) => sum + item.performance.engagementRate, 0) / filteredData.length || 0;
    const avgViralityScore = filteredData.reduce((sum, item) => sum + item.performance.viralityScore, 0) / filteredData.length || 0;
    
    // Performance insights
    const topPerformers = [...filteredData]
      .sort((a, b) => b.performance.viralityScore - a.performance.viralityScore)
      .slice(0, 3);
    
    const bestPerformingAngles = getTopPerformingAngles(filteredData);
    const bestPerformingPlatforms = getPlatformPerformance(filteredData);
    const urgencyPerformance = getUrgencyPerformance(filteredData);
    
    const analytics = {
      overview: {
        totalPosts: filteredData.length,
        totalImpressions,
        totalEngagement,
        totalClicks,
        totalConversions,
        totalTraffic,
        totalSignups,
        avgTimeToPost: Math.round(avgTimeToPost),
        avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
        avgViralityScore: Number(avgViralityScore.toFixed(2)),
        overallROI: totalSignups > 0 ? Number((totalConversions / totalSignups * 100).toFixed(1)) : 0
      },
      insights: {
        topPerformers,
        bestPerformingAngles,
        bestPerformingPlatforms,
        urgencyPerformance
      },
      data: filteredData,
      timeframe: {
        period: timeframe,
        startDate: cutoffDate.toISOString(),
        endDate: now.toISOString()
      }
    };
    
    return NextResponse.json({
      success: true,
      analytics
    });
    
  } catch (error) {
    console.error('Error fetching newsjacking analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Helper functions for analytics insights
function getTopPerformingAngles(data: ContentPerformance[]): Array<{angle: string, avgViralityScore: number, count: number}> {
  const angleMap = new Map();
  
  data.forEach(item => {
    const angle = item.audioIntelAngle;
    if (!angleMap.has(angle)) {
      angleMap.set(angle, { scores: [], count: 0 });
    }
    angleMap.get(angle).scores.push(item.performance.viralityScore);
    angleMap.get(angle).count++;
  });
  
  return Array.from(angleMap.entries())
    .map(([angle, data]) => ({
      angle,
      avgViralityScore: Number((data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length).toFixed(2)),
      count: data.count
    }))
    .sort((a, b) => b.avgViralityScore - a.avgViralityScore)
    .slice(0, 5);
}

function getPlatformPerformance(data: ContentPerformance[]): Array<{platform: string, metrics: any}> {
  const platformMap = new Map();
  
  data.forEach(item => {
    const platform = item.platform;
    if (!platformMap.has(platform)) {
      platformMap.set(platform, { 
        posts: 0, 
        totalEngagement: 0, 
        totalImpressions: 0, 
        totalConversions: 0,
        avgViralityScore: 0
      });
    }
    
    const platformData = platformMap.get(platform);
    platformData.posts++;
    platformData.totalEngagement += item.postMetrics.engagement;
    platformData.totalImpressions += item.postMetrics.impressions;
    platformData.totalConversions += item.businessMetrics.conversions;
    platformData.avgViralityScore += item.performance.viralityScore;
  });
  
  return Array.from(platformMap.entries())
    .map(([platform, data]) => ({
      platform,
      metrics: {
        posts: data.posts,
        avgEngagementRate: Number(((data.totalEngagement / data.totalImpressions) * 100).toFixed(2)),
        conversionsPerPost: Number((data.totalConversions / data.posts).toFixed(2)),
        avgViralityScore: Number((data.avgViralityScore / data.posts).toFixed(2))
      }
    }))
    .sort((a, b) => b.metrics.avgViralityScore - a.metrics.avgViralityScore);
}

function getUrgencyPerformance(data: ContentPerformance[]): Array<{urgency: string, metrics: any}> {
  const urgencyMap = new Map();
  
  data.forEach(item => {
    const urgency = item.urgencyLevel;
    if (!urgencyMap.has(urgency)) {
      urgencyMap.set(urgency, { 
        posts: 0, 
        totalTimeToPost: 0,
        totalViralityScore: 0,
        totalConversions: 0
      });
    }
    
    const urgencyData = urgencyMap.get(urgency);
    urgencyData.posts++;
    urgencyData.totalTimeToPost += item.timing.timeToPost;
    urgencyData.totalViralityScore += item.performance.viralityScore;
    urgencyData.totalConversions += item.businessMetrics.conversions;
  });
  
  return Array.from(urgencyMap.entries())
    .map(([urgency, data]) => ({
      urgency,
      metrics: {
        posts: data.posts,
        avgTimeToPost: Math.round(data.totalTimeToPost / data.posts),
        avgViralityScore: Number((data.totalViralityScore / data.posts).toFixed(2)),
        conversionsPerPost: Number((data.totalConversions / data.posts).toFixed(2))
      }
    }));
}

export async function POST(request: NextRequest) {
  try {
    const performanceUpdate = await request.json();
    
    // Update performance data (in production this would update database)
    const existingIndex = performanceData.findIndex(item => 
      item.contentId === performanceUpdate.contentId && 
      item.platform === performanceUpdate.platform
    );
    
    if (existingIndex >= 0) {
      performanceData[existingIndex] = { ...performanceData[existingIndex], ...performanceUpdate };
    } else {
      performanceData.push(performanceUpdate);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Performance data updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating performance data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update performance data' },
      { status: 500 }
    );
  }
}