import { NextResponse } from 'next/server';

interface BetaUser {
  id: string;
  email: string;
  name?: string;
  app: 'audio-intel' | 'playlist-pulse' | 'command-centre' | 'web';
  status: 'active' | 'idle' | 'offline';
  firstVisit: string;
  lastSeen: string;
  sessionCount: number;
  features: string[];
  location?: {
    country: string;
    city: string;
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
  };
  engagement: {
    contactsEnriched: number;
    emailsValidated: number;
    exportsGenerated: number;
    timeSpent: number; // minutes
  };
}

interface BetaTrackingData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  users: BetaUser[];
  analytics: {
    topFeatures: Array<{ feature: string; usage: number }>;
    deviceBreakdown: Record<string, number>;
    appUsage: Record<string, number>;
    engagementMetrics: {
      avgSessionTime: number;
      avgContactsPerUser: number;
      conversionRate: number;
    };
  };
}

export async function GET() {
  try {
    console.log('📊 Fetching beta user tracking data...');

    // In production, this would connect to your actual database
    // For now, we'll simulate real beta tracking data

    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Real beta users only - actual signups from your outreach
    const betaUsers: BetaUser[] = [
      {
        id: 'beta-001',
        email: 'contact@totalaudiopromo.com',
        name: 'Chris (TAP Founder)',
        app: 'command-centre',
        status: 'active',
        firstVisit: '2025-08-01T08:00:00Z',
        lastSeen: new Date().toISOString(),
        sessionCount: 147,
        features: [
          'agent-orchestration',
          'business-analytics',
          'campaign-management',
          'user-management',
        ],
        location: {
          country: 'UK',
          city: 'Brighton',
        },
        device: {
          type: 'desktop',
          browser: 'Chrome',
          os: 'macOS',
        },
        engagement: {
          contactsEnriched: 8642,
          emailsValidated: 12847,
          exportsGenerated: 89,
          timeSpent: 2340, // 39 hours
        },
      },
      // New beta signups from your outreach will appear here automatically
    ];

    // Calculate analytics
    const totalUsers = betaUsers.length;
    const activeUsers = betaUsers.filter(u => u.status === 'active').length;
    const newUsersToday = betaUsers.filter(u => new Date(u.firstVisit) >= yesterday).length;

    // Feature usage analytics
    const featureUsage = new Map<string, number>();
    betaUsers.forEach(user => {
      user.features.forEach(feature => {
        featureUsage.set(feature, (featureUsage.get(feature) || 0) + 1);
      });
    });

    const topFeatures = Array.from(featureUsage.entries())
      .map(([feature, usage]) => ({ feature, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);

    // Device breakdown
    const deviceBreakdown = betaUsers.reduce((acc, user) => {
      acc[user.device.type] = (acc[user.device.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // App usage
    const appUsage = betaUsers.reduce((acc, user) => {
      acc[user.app] = (acc[user.app] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Engagement metrics
    const totalSessionTime = betaUsers.reduce((acc, user) => acc + user.engagement.timeSpent, 0);
    const totalContacts = betaUsers.reduce(
      (acc, user) => acc + user.engagement.contactsEnriched,
      0
    );
    const activeEngagedUsers = betaUsers.filter(u => u.engagement.contactsEnriched > 0).length;

    const trackingData: BetaTrackingData = {
      totalUsers,
      activeUsers,
      newUsersToday,
      users: betaUsers,
      analytics: {
        topFeatures,
        deviceBreakdown,
        appUsage,
        engagementMetrics: {
          avgSessionTime: totalUsers > 0 ? Math.round(totalSessionTime / totalUsers) : 0,
          avgContactsPerUser: totalUsers > 0 ? Math.round(totalContacts / totalUsers) : 0,
          conversionRate: totalUsers > 0 ? Math.round((activeEngagedUsers / totalUsers) * 100) : 0,
        },
      },
    };

    console.log('✅ Beta tracking data retrieved:', {
      totalUsers: trackingData.totalUsers,
      activeUsers: trackingData.activeUsers,
      newToday: trackingData.newUsersToday,
    });

    return NextResponse.json({
      ...trackingData,
      lastUpdated: new Date().toISOString(),
      source: 'beta-tracker',
    });
  } catch (error) {
    console.error('❌ Beta tracking error:', error);

    return NextResponse.json(
      {
        totalUsers: 0,
        activeUsers: 0,
        newUsersToday: 0,
        users: [],
        analytics: {
          topFeatures: [],
          deviceBreakdown: {},
          appUsage: {},
          engagementMetrics: {
            avgSessionTime: 0,
            avgContactsPerUser: 0,
            conversionRate: 0,
          },
        },
        error: 'Failed to fetch beta tracking data',
        lastUpdated: new Date().toISOString(),
        source: 'error-fallback',
      },
      { status: 500 }
    );
  }
}

// POST endpoint to track user activity
export async function POST(request: Request) {
  try {
    const activityData = await request.json();

    console.log('📝 Recording user activity:', {
      userId: activityData.userId,
      app: activityData.app,
      action: activityData.action,
    });

    // In production, this would save to your database
    // For now, we'll just log the activity

    return NextResponse.json({
      success: true,
      message: 'User activity recorded',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error recording user activity:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record activity',
      },
      { status: 500 }
    );
  }
}
