import { NextRequest, NextResponse } from 'next/server';

// In-memory analytics store (in production, this would be a database)
interface AnalyticsData {
  totalContacts: number;
  totalEnrichments: number;
  successRate: number;
  averageConfidence: number;
  platformBreakdown: Record<string, number>;
  dailyEnrichments: Array<{ date: string; count: number }>;
  recentActivity: Array<{ timestamp: string; action: string; details: string }>;
  topPlatforms: Array<{ platform: string; count: number; percentage: number }>;
  performanceMetrics: {
    averageProcessingTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
}

let analyticsData: AnalyticsData = {
  totalContacts: 0,
  totalEnrichments: 0,
  successRate: 0,
  averageConfidence: 0,
  platformBreakdown: {},
  dailyEnrichments: [],
  recentActivity: [],
  topPlatforms: [],
  performanceMetrics: {
    averageProcessingTime: 0,
    cacheHitRate: 0,
    errorRate: 0,
  },
};

// Update analytics when enrichment occurs
function updateEnrichmentAnalytics(enrichedContacts: any[], processingTime: number) {
  const now = new Date().toISOString();
  const today = now.split('T')[0];

  // Update basic metrics
  analyticsData.totalContacts += enrichedContacts.length;
  analyticsData.totalEnrichments += enrichedContacts.length;

  // Calculate success rate
  const successfulEnrichments = enrichedContacts.filter(
    contact => contact.researchConfidence !== 'Low' && !contact.errors
  ).length;
  analyticsData.successRate = (successfulEnrichments / enrichedContacts.length) * 100;

  // Calculate average confidence
  const confidenceScores = enrichedContacts.map(contact => {
    switch (contact.researchConfidence) {
      case 'High':
        return 100;
      case 'Medium':
        return 60;
      case 'Low':
        return 20;
      default:
        return 0;
    }
  });
  const totalConfidence = confidenceScores.reduce((sum: number, score: number) => sum + score, 0);
  analyticsData.averageConfidence =
    confidenceScores.length > 0 ? totalConfidence / confidenceScores.length : 0;

  // Update platform breakdown
  enrichedContacts.forEach(contact => {
    const platformMatch = contact.contactIntelligence?.match(/🎵\s*([^|]+)/);
    const platform = platformMatch ? platformMatch[1].trim() : 'Unknown';
    analyticsData.platformBreakdown[platform] =
      (analyticsData.platformBreakdown[platform] || 0) + 1;
  });

  // Update daily enrichments
  const existingDayIndex = analyticsData.dailyEnrichments.findIndex(day => day.date === today);
  if (existingDayIndex >= 0) {
    analyticsData.dailyEnrichments[existingDayIndex].count += enrichedContacts.length;
  } else {
    analyticsData.dailyEnrichments.push({ date: today, count: enrichedContacts.length });
  }

  // Keep only last 30 days
  analyticsData.dailyEnrichments = analyticsData.dailyEnrichments.slice(-30);

  // Update recent activity
  analyticsData.recentActivity.unshift({
    timestamp: now,
    action: 'Contact Enrichment',
    details: `Enriched ${enrichedContacts.length} contacts in ${processingTime.toFixed(1)}s`,
  });

  // Keep only last 50 activities
  analyticsData.recentActivity = analyticsData.recentActivity.slice(0, 50);

  // Update top platforms
  analyticsData.topPlatforms = Object.entries(analyticsData.platformBreakdown)
    .map(([platform, count]) => ({
      platform,
      count,
      percentage: (count / analyticsData.totalEnrichments) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Update performance metrics
  analyticsData.performanceMetrics.averageProcessingTime = processingTime;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // Log the analytics event
    console.log('Analytics Event:', {
      event,
      data,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    });

    // Handle different analytics events
    switch (event) {
      case 'contact_enrichment':
        if (data.enrichedContacts && data.processingTime) {
          updateEnrichmentAnalytics(data.enrichedContacts, data.processingTime);
        }
        break;

      case 'export_download':
        analyticsData.recentActivity.unshift({
          timestamp: new Date().toISOString(),
          action: 'Export Download',
          details: `Downloaded ${data.contactsCount || 0} contacts as ${data.format || 'CSV'}`,
        });
        break;

      case 'export_email':
        analyticsData.recentActivity.unshift({
          timestamp: new Date().toISOString(),
          action: 'Export Email',
          details: `Sent ${data.contactsCount || 0} contacts via email`,
        });
        break;

      case 'platform_search':
        analyticsData.recentActivity.unshift({
          timestamp: new Date().toISOString(),
          action: 'Platform Search',
          details: `Searched ${data.platforms?.join(', ') || 'all platforms'} for "${data.query}"`,
        });
        break;

      case 'cross_promotion_click':
        analyticsData.recentActivity.unshift({
          timestamp: new Date().toISOString(),
          action: 'Cross Promotion',
          details: `Clicked on ${data.tool || 'unknown tool'} promotion`,
        });
        break;
    }

    // Keep only last 50 activities
    analyticsData.recentActivity = analyticsData.recentActivity.slice(0, 50);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Calculate additional metrics
    const totalDays = analyticsData.dailyEnrichments.length;
    const averageDailyEnrichments =
      totalDays > 0
        ? analyticsData.dailyEnrichments.reduce((sum, day) => sum + day.count, 0) / totalDays
        : 0;

    const weeklyGrowth =
      totalDays >= 7
        ? (analyticsData.dailyEnrichments.slice(-7).reduce((sum, day) => sum + day.count, 0) /
            7 /
            (analyticsData.dailyEnrichments
              .slice(-14, -7)
              .reduce((sum, day) => sum + day.count, 0) /
              7)) *
            100 -
          100
        : 0;

    const monthlyGrowth =
      totalDays >= 30
        ? (analyticsData.dailyEnrichments.slice(-30).reduce((sum, day) => sum + day.count, 0) /
            30 /
            (analyticsData.dailyEnrichments
              .slice(-60, -30)
              .reduce((sum, day) => sum + day.count, 0) /
              30)) *
            100 -
          100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...analyticsData,
        metrics: {
          totalContacts: analyticsData.totalContacts,
          totalEnrichments: analyticsData.totalEnrichments,
          successRate: Math.round(analyticsData.successRate * 100) / 100,
          averageConfidence: Math.round(analyticsData.averageConfidence * 100) / 100,
          averageDailyEnrichments: Math.round(averageDailyEnrichments * 100) / 100,
          weeklyGrowth: Math.round(weeklyGrowth * 100) / 100,
          monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
        },
        charts: {
          dailyEnrichments: analyticsData.dailyEnrichments,
          platformBreakdown: analyticsData.topPlatforms,
          recentActivity: analyticsData.recentActivity.slice(0, 20),
        },
        performance: analyticsData.performanceMetrics,
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve analytics data',
      },
      { status: 500 }
    );
  }
}
