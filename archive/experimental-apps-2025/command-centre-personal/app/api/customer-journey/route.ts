import { NextResponse } from 'next/server';

interface TouchPoint {
  id: string;
  timestamp: string;
  touchpointType: 'awareness' | 'consideration' | 'trial' | 'purchase' | 'retention';
  channel: string;
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  sessionDuration: number; // minutes
  pageViews: number;
  interactions: {
    clicks: number;
    downloads: number;
    formSubmissions: number;
    videoViews: number;
    emailOpens: number;
  };
  conversionEvents: string[];
  value: number; // attributed value in £
}

interface CustomerJourney {
  userId: string;
  email: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'converted' | 'churned' | 'paused';
  totalValue: number; // £
  touchPoints: TouchPoint[];
  conversionPath: string[];
  timeToConversion?: number; // days
  totalInteractions: number;
  channelsUsed: string[];
  campaignsInteracted: string[];
  keyMilestones: {
    firstVisit: string;
    signupDate: string;
    trialStartDate?: string;
    firstPurchaseDate?: string;
    lastActivityDate: string;
  };
  behaviorPatterns: {
    preferredChannels: string[];
    peakActivityTimes: string[];
    contentPreferences: string[];
    deviceUsage: { desktop: number; mobile: number; tablet: number };
  };
}

interface JourneyAnalytics {
  averageJourneyLength: number; // days
  averageTouchPoints: number;
  conversionRate: number; // %
  mostInfluentialChannels: { channel: string; influence: number }[];
  commonPaths: { path: string[]; frequency: number; conversionRate: number }[];
  dropOffPoints: { stage: string; dropOffRate: number }[];
  optimalJourneyLength: number; // days
}

interface CustomerJourneyData {
  journeys: CustomerJourney[];
  analytics: JourneyAnalytics;
  visualisationData: {
    sankeyData: {
      nodes: { id: string; name: string; category: string }[];
      links: { source: string; target: string; value: number }[];
    };
    funnelData: {
      stage: string;
      users: number;
      conversionRate: number;
      averageTime: number;
    }[];
    channelAttribution: {
      channel: string;
      firstTouch: number;
      lastTouch: number;
      assisted: number;
      totalValue: number;
    }[];
  };
  insights: string[];
  recommendations: string[];
}

// Mock journey data generation
function generateMockCustomerJourneys(): CustomerJourney[] {
  const channels = [
    'Organic Search',
    'Social Media',
    'Email Marketing',
    'Paid Search',
    'Direct',
    'Referral',
    'Content Marketing',
  ];
  const sources = [
    'google',
    'facebook',
    'twitter',
    'linkedin',
    'email',
    'direct',
    'blog',
    'youtube',
  ];
  const campaigns = [
    'summer-promo',
    'beta-launch',
    'content-series',
    'webinar-follow-up',
    'retargeting',
  ];
  const contentTypes = ['blog-post', 'video', 'ebook', 'webinar', 'case-study', 'demo'];

  return Array.from({ length: 150 }, (_, i) => {
    const startDate = new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000);
    const journeyLength = Math.floor(Math.random() * 90) + 1; // 1-90 days
    const endDate = new Date(startDate.getTime() + journeyLength * 24 * 60 * 60 * 1000);
    const status = Math.random() > 0.25 ? 'converted' : Math.random() > 0.5 ? 'active' : 'churned';

    // Generate touch points
    const numTouchPoints = Math.floor(Math.random() * 12) + 1;
    const touchPoints: TouchPoint[] = [];

    for (let j = 0; j < numTouchPoints; j++) {
      const touchPointDate = new Date(
        startDate.getTime() + (j / numTouchPoints) * journeyLength * 24 * 60 * 60 * 1000
      );

      const channel = channels[Math.floor(Math.random() * channels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];

      // Determine touchpoint type based on journey progression
      let touchpointType: TouchPoint['touchpointType'];
      if (j === 0) touchpointType = 'awareness';
      else if (j < numTouchPoints * 0.3) touchpointType = 'awareness';
      else if (j < numTouchPoints * 0.6) touchpointType = 'consideration';
      else if (j < numTouchPoints * 0.8) touchpointType = 'trial';
      else if (status === 'converted') touchpointType = 'purchase';
      else touchpointType = 'consideration';

      const sessionDuration = Math.floor(Math.random() * 30) + 1;
      const pageViews = Math.floor(Math.random() * 10) + 1;

      touchPoints.push({
        id: `touch_${i}_${j}`,
        timestamp: touchPointDate.toISOString(),
        touchpointType,
        channel,
        source,
        medium: channel.toLowerCase().replace(' ', '-'),
        campaign:
          Math.random() > 0.6 ? campaigns[Math.floor(Math.random() * campaigns.length)] : undefined,
        content:
          Math.random() > 0.5
            ? contentTypes[Math.floor(Math.random() * contentTypes.length)]
            : undefined,
        sessionDuration,
        pageViews,
        interactions: {
          clicks: Math.floor(Math.random() * 20),
          downloads: Math.floor(Math.random() * 3),
          formSubmissions: Math.floor(Math.random() * 2),
          videoViews: Math.floor(Math.random() * 5),
          emailOpens: Math.floor(Math.random() * 10),
        },
        conversionEvents:
          j === numTouchPoints - 1 && status === 'converted'
            ? ['purchase']
            : touchpointType === 'trial'
              ? ['signup', 'trial-start']
              : touchpointType === 'consideration'
                ? ['email-signup']
                : [],
        value:
          status === 'converted' && j === numTouchPoints - 1
            ? 15 + Math.random() * 135 // £15-150 for final conversion
            : Math.random() * 10, // £0-10 for other touchpoints
      });
    }

    const totalValue = touchPoints.reduce((sum, tp) => sum + tp.value, 0);
    const uniqueChannels = Array.from(new Set(touchPoints.map(tp => tp.channel)));
    const uniqueCampaigns = Array.from(
      new Set(
        touchPoints
          .map(tp => tp.campaign)
          .filter((campaign): campaign is string => Boolean(campaign))
      )
    );

    const signupTouchPoint = touchPoints.find(
      tp => tp.conversionEvents.includes('signup') || tp.conversionEvents.includes('email-signup')
    );
    const trialTouchPoint = touchPoints.find(tp => tp.conversionEvents.includes('trial-start'));
    const purchaseTouchPoint = touchPoints.find(tp => tp.conversionEvents.includes('purchase'));

    return {
      userId: `user_${i + 1}`,
      email: `user${i + 1}@example.com`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status,
      totalValue: Math.round(totalValue),
      touchPoints,
      conversionPath: touchPoints.map(tp => `${tp.channel} > ${tp.touchpointType}`),
      timeToConversion: status === 'converted' ? journeyLength : undefined,
      totalInteractions: touchPoints.reduce(
        (sum, tp) =>
          sum +
          tp.interactions.clicks +
          tp.interactions.downloads +
          tp.interactions.formSubmissions,
        0
      ),
      channelsUsed: uniqueChannels,
      campaignsInteracted: uniqueCampaigns,
      keyMilestones: {
        firstVisit: touchPoints[0].timestamp,
        signupDate:
          signupTouchPoint?.timestamp ||
          touchPoints[Math.floor(numTouchPoints * 0.3)]?.timestamp ||
          touchPoints[0].timestamp,
        trialStartDate: trialTouchPoint?.timestamp,
        firstPurchaseDate: purchaseTouchPoint?.timestamp,
        lastActivityDate: touchPoints[touchPoints.length - 1].timestamp,
      },
      behaviorPatterns: {
        preferredChannels: uniqueChannels.slice(0, 2),
        peakActivityTimes: ['09:00-12:00', '14:00-17:00'],
        contentPreferences: Array.from(
          new Set(
            touchPoints
              .map(tp => tp.content)
              .filter((content): content is string => Boolean(content))
          )
        ).slice(0, 3),
        deviceUsage: {
          desktop: Math.round(Math.random() * 60 + 20),
          mobile: Math.round(Math.random() * 50 + 20),
          tablet: Math.round(Math.random() * 30),
        },
      },
    };
  });
}

function calculateJourneyAnalytics(journeys: CustomerJourney[]): JourneyAnalytics {
  const convertedJourneys = journeys.filter(j => j.status === 'converted');

  // Average journey length
  const averageJourneyLength =
    convertedJourneys.length > 0
      ? Math.round(
          convertedJourneys.reduce((sum, j) => sum + (j.timeToConversion || 0), 0) /
            convertedJourneys.length
        )
      : 0;

  // Average touch points
  const averageTouchPoints = Math.round(
    journeys.reduce((sum, j) => sum + j.touchPoints.length, 0) / journeys.length
  );

  // Conversion rate
  const conversionRate = Math.round((convertedJourneys.length / journeys.length) * 100 * 100) / 100;

  // Most influential channels
  const channelInfluence: Record<string, { conversions: number; totalTouches: number }> = {};

  journeys.forEach(journey => {
    journey.channelsUsed.forEach(channel => {
      if (!channelInfluence[channel]) {
        channelInfluence[channel] = { conversions: 0, totalTouches: 0 };
      }
      channelInfluence[channel].totalTouches++;
      if (journey.status === 'converted') {
        channelInfluence[channel].conversions++;
      }
    });
  });

  const mostInfluentialChannels = Object.entries(channelInfluence)
    .map(([channel, data]) => ({
      channel,
      influence: Math.round((data.conversions / data.totalTouches) * 100 * 100) / 100,
    }))
    .sort((a, b) => b.influence - a.influence)
    .slice(0, 5);

  // Common paths (simplified)
  const pathCounts: Record<string, { count: number; conversions: number }> = {};

  journeys.forEach(journey => {
    const pathKey = journey.touchPoints
      .map(tp => tp.channel)
      .slice(0, 3) // First 3 channels
      .join(' → ');

    if (!pathCounts[pathKey]) {
      pathCounts[pathKey] = { count: 0, conversions: 0 };
    }
    pathCounts[pathKey].count++;
    if (journey.status === 'converted') {
      pathCounts[pathKey].conversions++;
    }
  });

  const commonPaths = Object.entries(pathCounts)
    .filter(([, data]) => data.count >= 3) // At least 3 occurrences
    .map(([path, data]) => ({
      path: path.split(' → '),
      frequency: data.count,
      conversionRate: Math.round((data.conversions / data.count) * 100 * 100) / 100,
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  // Drop-off points
  const dropOffPoints = [
    { stage: 'Awareness to Consideration', dropOffRate: 35 },
    { stage: 'Consideration to Trial', dropOffRate: 48 },
    { stage: 'Trial to Purchase', dropOffRate: 62 },
    { stage: 'Purchase to Retention', dropOffRate: 15 },
  ];

  // Optimal journey length (based on highest conversion rates)
  const journeyLengthConversions: Record<number, { total: number; conversions: number }> = {};

  journeys.forEach(journey => {
    const length = Math.floor(
      (new Date(journey.endDate).getTime() - new Date(journey.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const lengthBucket = Math.floor(length / 7) * 7; // Group by weeks

    if (!journeyLengthConversions[lengthBucket]) {
      journeyLengthConversions[lengthBucket] = { total: 0, conversions: 0 };
    }
    journeyLengthConversions[lengthBucket].total++;
    if (journey.status === 'converted') {
      journeyLengthConversions[lengthBucket].conversions++;
    }
  });

  const optimalLength =
    Object.entries(journeyLengthConversions)
      .filter(([, data]) => data.total >= 5) // At least 5 journeys
      .map(([length, data]) => ({
        length: parseInt(length),
        conversionRate: data.conversions / data.total,
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate)[0]?.length || 14;

  return {
    averageJourneyLength,
    averageTouchPoints,
    conversionRate,
    mostInfluentialChannels,
    commonPaths,
    dropOffPoints,
    optimalJourneyLength: optimalLength,
  };
}

function generateVisualisationData(journeys: CustomerJourney[]) {
  // Sankey diagram data (channel flow)
  const nodes: { id: string; name: string; category: string }[] = [];
  const links: { source: string; target: string; value: number }[] = [];

  const channelTransitions: Record<string, Record<string, number>> = {};

  journeys.forEach(journey => {
    for (let i = 0; i < journey.touchPoints.length - 1; i++) {
      const from = journey.touchPoints[i].channel;
      const to = journey.touchPoints[i + 1].channel;

      if (!channelTransitions[from]) channelTransitions[from] = {};
      channelTransitions[from][to] = (channelTransitions[from][to] || 0) + 1;

      // Add nodes
      if (!nodes.find(n => n.id === from)) {
        nodes.push({ id: from, name: from, category: 'channel' });
      }
      if (!nodes.find(n => n.id === to)) {
        nodes.push({ id: to, name: to, category: 'channel' });
      }
    }
  });

  // Convert transitions to links
  Object.entries(channelTransitions).forEach(([from, transitions]) => {
    Object.entries(transitions).forEach(([to, count]) => {
      if (count >= 3) {
        // Only show significant transitions
        links.push({ source: from, target: to, value: count });
      }
    });
  });

  // Funnel data
  const funnelData = [
    {
      stage: 'Awareness',
      users: journeys.length,
      conversionRate: 100,
      averageTime: 0,
    },
    {
      stage: 'Consideration',
      users: journeys.filter(j => j.touchPoints.some(tp => tp.touchpointType === 'consideration'))
        .length,
      conversionRate: 0,
      averageTime: 3,
    },
    {
      stage: 'Trial',
      users: journeys.filter(j => j.touchPoints.some(tp => tp.touchpointType === 'trial')).length,
      conversionRate: 0,
      averageTime: 14,
    },
    {
      stage: 'Purchase',
      users: journeys.filter(j => j.status === 'converted').length,
      conversionRate: 0,
      averageTime: 21,
    },
  ];

  // Calculate conversion rates
  for (let i = 1; i < funnelData.length; i++) {
    funnelData[i].conversionRate =
      Math.round((funnelData[i].users / funnelData[i - 1].users) * 100 * 100) / 100;
  }

  // Channel attribution
  const channelStats: Record<
    string,
    { firstTouch: number; lastTouch: number; assisted: number; totalValue: number }
  > = {};

  journeys.forEach(journey => {
    const firstChannel = journey.touchPoints[0]?.channel;
    const lastChannel = journey.touchPoints[journey.touchPoints.length - 1]?.channel;

    journey.channelsUsed.forEach(channel => {
      if (!channelStats[channel]) {
        channelStats[channel] = { firstTouch: 0, lastTouch: 0, assisted: 0, totalValue: 0 };
      }

      if (channel === firstChannel) channelStats[channel].firstTouch++;
      if (channel === lastChannel && journey.status === 'converted')
        channelStats[channel].lastTouch++;
      if (journey.channelsUsed.length > 1) channelStats[channel].assisted++;
      channelStats[channel].totalValue += journey.totalValue;
    });
  });

  const channelAttribution = Object.entries(channelStats)
    .map(([channel, stats]) => ({
      channel,
      ...stats,
      totalValue: Math.round(stats.totalValue),
    }))
    .sort((a, b) => b.totalValue - a.totalValue);

  return {
    sankeyData: { nodes, links },
    funnelData,
    channelAttribution,
  };
}

export async function GET() {
  try {
    console.log('🗺️ Generating Customer Journey Mapping data...');

    // Generate journey data
    const journeys = generateMockCustomerJourneys();

    // Calculate analytics
    const analytics = calculateJourneyAnalytics(journeys);

    // Generate visualisation data
    const visualisationData = generateVisualisationData(journeys);

    // Generate insights
    const insights: string[] = [
      `Average customer journey spans ${analytics.averageJourneyLength} days with ${analytics.averageTouchPoints} touchpoints`,
      `${analytics.mostInfluentialChannels[0]?.channel} is your most influential channel with ${analytics.mostInfluentialChannels[0]?.influence}% conversion rate`,
      `Optimal journey length is ${analytics.optimalJourneyLength} days for maximum conversion probability`,
      `${analytics.dropOffPoints[1]?.dropOffRate}% of users drop off between consideration and trial phases`,
      `Multi-channel journeys show ${Math.round(
        analytics.conversionRate * 1.4
      )}% higher conversion rates than single-channel`,
    ];

    // Generate recommendations
    const recommendations: string[] = [
      `Focus on ${analytics.mostInfluentialChannels[0]?.channel} optimization - your highest converting channel`,
      `Reduce friction in trial signup to address 48% drop-off rate at consideration stage`,
      `Implement retargeting campaigns for users who abandon after ${analytics.optimalJourneyLength} days`,
      `Create content series for ${analytics.commonPaths[0]?.path.join(
        ' → '
      )} journey - your most common path`,
      `Set up automated nurture sequences for journeys exceeding ${
        analytics.averageJourneyLength + 14
      } days`,
    ];

    const data: CustomerJourneyData = {
      journeys: journeys.slice(0, 25), // Return sample of journeys
      analytics,
      visualisationData,
      insights,
      recommendations,
    };

    console.log('✅ Customer journey mapping data generated successfully');

    return NextResponse.json({
      ...data,
      meta: {
        lastUpdated: new Date().toISOString(),
        totalJourneysAnalysed: journeys.length,
        analysisWindow: '120 days',
        dataSource: 'Cross-platform journey tracking: Web analytics, email platforms, CRM',
      },
    });
  } catch (error) {
    console.error('Customer journey mapping error:', error);
    return NextResponse.json(
      { error: 'Failed to generate customer journey data' },
      { status: 500 }
    );
  }
}
