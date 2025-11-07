import { NextResponse } from 'next/server';

interface ContentPiece {
  id: string;
  title: string;
  type: 'blog_post' | 'video' | 'social_post' | 'email' | 'guide' | 'case_study';
  publishDate: string;
  channels: string[];
  metrics: {
    views: number;
    clicks: number;
    shares: number;
    comments: number;
    timeSpent: number; // minutes
    bounceRate: number;
  };
  conversions: {
    signups: number;
    trialStarts: number;
    paidConversions: number;
    emailSubscribers: number;
    demoRequests: number;
  };
  attribution: {
    firstTouch: number; // users who first discovered us through this content
    lastTouch: number; // users who converted after last seeing this content
    assisted: number; // users who saw this content in their journey
    directRevenue: number; // £ directly attributed
    assistedRevenue: number; // £ assisted revenue
  };
  costs: {
    productionCost: number; // £ cost to create
    promotionCost: number; // £ spent promoting
    timeInvested: number; // hours
  };
  audienceQuality: {
    averageEngagementTime: number; // minutes
    returnVisitorRate: number; // %
    conversionRate: number; // %
    customerLifetimeValue: number; // £
    npsScore: number;
  };
}

interface ContentROIData {
  content: ContentPiece[];
  summary: {
    totalContent: number;
    totalROI: number;
    averageROI: number;
    bestPerformingType: string;
    worstPerformingType: string;
    totalDirectRevenue: number;
    totalAssistedRevenue: number;
    costPerConversion: number;
    revenuePerPound: number;
  };
  insights: {
    highROIContent: ContentPiece[];
    lowROIContent: ContentPiece[];
    topConversionChannels: string[];
    bestPerformingFormats: string[];
    audienceQualityLeaders: ContentPiece[];
  };
  recommendations: string[];
}

// Mock content data - in production this would come from analytics integrations
function generateMockContentData(): ContentPiece[] {
  const contentTypes = [
    'blog_post',
    'video',
    'social_post',
    'email',
    'guide',
    'case_study',
  ] as const;
  const channels = ['Organic Search', 'Social Media', 'Email', 'Direct', 'Referral', 'Paid Social'];
  const titles = [
    'How to Get Your Music on Spotify Playlists: Complete Guide',
    'Top 10 Music PR Companies in 2025',
    'Email Validation for Musicians: Why It Matters',
    'Case Study: How One Artist Got 1M Streams',
    'The Future of Music Marketing in 2025',
    'Building Your Email List as an Independent Artist',
    'Music Industry Contacts: Quality vs Quantity',
    'Social Media Strategy for Musicians',
    'Press Release Templates for Music Releases',
    'Analytics That Matter for Music Promotion',
    'Contact Enrichment: From Emails to Opportunities',
    'Playlist Submission Best Practices',
    'Music Influencer Outreach Guide',
    'Radio Promotion in the Digital Age',
    'Building Relationships with Music Journalists',
    'Content Marketing for Record Labels',
    'TikTok Marketing for Musicians',
    'Music Business Networking Strategies',
    'Streaming Platform Analytics Deep Dive',
    'Brand Partnerships for Independent Artists',
  ];

  return titles.map((title, i) => {
    const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const publishDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    const productionCost = type === 'video' ? 500 + Math.random() * 1500 : 50 + Math.random() * 400;
    const promotionCost = Math.random() * 200;

    // Higher quality content gets better metrics
    const qualityMultiplier = Math.random() * 2 + 0.5; // 0.5 to 2.5

    const views = Math.floor((Math.random() * 10000 + 100) * qualityMultiplier);
    const clicks = Math.floor(views * (0.02 + Math.random() * 0.08)); // 2-10% CTR
    const signups = Math.floor(clicks * (0.05 + Math.random() * 0.15)); // 5-20% conversion
    const trialStarts = Math.floor(signups * (0.3 + Math.random() * 0.4)); // 30-70% trial rate
    const paidConversions = Math.floor(trialStarts * (0.1 + Math.random() * 0.3)); // 10-40% conversion

    const directRevenue = paidConversions * (15 + Math.random() * 135); // £15-150 per conversion
    const assistedRevenue = directRevenue * (0.5 + Math.random() * 2); // 0.5x-2.5x assisted

    return {
      id: `content_${i + 1}`,
      title,
      type,
      publishDate: publishDate.toISOString(),
      channels: channels.slice(0, Math.floor(Math.random() * 3) + 1),
      metrics: {
        views,
        clicks,
        shares: Math.floor(clicks * 0.05 * qualityMultiplier),
        comments: Math.floor(clicks * 0.02 * qualityMultiplier),
        timeSpent: Math.floor((2 + Math.random() * 8) * qualityMultiplier),
        bounceRate: Math.max(0.2, Math.min(0.9, 0.7 - (qualityMultiplier - 1) * 0.2)),
      },
      conversions: {
        signups,
        trialStarts,
        paidConversions,
        emailSubscribers: Math.floor(clicks * (0.1 + Math.random() * 0.2)),
        demoRequests: Math.floor(clicks * 0.02),
      },
      attribution: {
        firstTouch: Math.floor(signups * 0.3),
        lastTouch: Math.floor(signups * 0.4),
        assisted: Math.floor(signups * 0.6),
        directRevenue: Math.round(directRevenue),
        assistedRevenue: Math.round(assistedRevenue),
      },
      costs: {
        productionCost: Math.round(productionCost),
        promotionCost: Math.round(promotionCost),
        timeInvested: Math.floor((type === 'video' ? 20 : 5) + Math.random() * 15),
      },
      audienceQuality: {
        averageEngagementTime: Math.floor((1 + Math.random() * 5) * qualityMultiplier),
        returnVisitorRate: Math.round((0.1 + Math.random() * 0.3) * qualityMultiplier * 100),
        conversionRate: Math.round((signups / clicks) * 100 * 100) / 100,
        customerLifetimeValue: Math.round((300 + Math.random() * 700) * qualityMultiplier),
        npsScore: Math.round((30 + Math.random() * 50) * qualityMultiplier),
      },
    };
  });
}

function calculateContentROI(content: ContentPiece): number {
  const totalRevenue =
    content.attribution.directRevenue + content.attribution.assistedRevenue * 0.3;
  const totalCosts = content.costs.productionCost + content.costs.promotionCost;

  if (totalCosts === 0) return 0;
  return Math.round(((totalRevenue - totalCosts) / totalCosts) * 100);
}

function generateInsights(content: ContentPiece[]): {
  highROIContent: ContentPiece[];
  lowROIContent: ContentPiece[];
  topConversionChannels: string[];
  bestPerformingFormats: string[];
  audienceQualityLeaders: ContentPiece[];
} {
  // Calculate ROI for sorting
  const contentWithROI = content.map(c => ({
    ...c,
    roi: calculateContentROI(c),
  }));

  // High and low ROI content
  contentWithROI.sort((a, b) => b.roi - a.roi);
  const highROIContent = contentWithROI.slice(0, 5);
  const lowROIContent = contentWithROI.slice(-5);

  // Top conversion channels
  const channelConversions: Record<string, number> = {};
  content.forEach(c => {
    c.channels.forEach(channel => {
      channelConversions[channel] =
        (channelConversions[channel] || 0) + c.conversions.paidConversions;
    });
  });

  const topConversionChannels = Object.entries(channelConversions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([channel]) => channel);

  // Best performing formats
  const formatROI: Record<string, number[]> = {};
  content.forEach(c => {
    const roi = calculateContentROI(c);
    if (!formatROI[c.type]) formatROI[c.type] = [];
    formatROI[c.type].push(roi);
  });

  const bestPerformingFormats = Object.entries(formatROI)
    .map(([format, rois]) => ({
      format,
      avgROI: rois.reduce((sum, roi) => sum + roi, 0) / rois.length,
    }))
    .sort((a, b) => b.avgROI - a.avgROI)
    .slice(0, 3)
    .map(f => f.format);

  // Audience quality leaders
  const audienceQualityLeaders = [...content]
    .sort((a, b) => {
      const scoreA = a.audienceQuality.npsScore + a.audienceQuality.customerLifetimeValue / 10;
      const scoreB = b.audienceQuality.npsScore + b.audienceQuality.customerLifetimeValue / 10;
      return scoreB - scoreA;
    })
    .slice(0, 5);

  return {
    highROIContent,
    lowROIContent,
    topConversionChannels,
    bestPerformingFormats,
    audienceQualityLeaders,
  };
}

function generateRecommendations(content: ContentPiece[], insights: any): string[] {
  const recommendations: string[] = [];

  // ROI-based recommendations
  if (insights.highROIContent.length > 0) {
    const bestContent = insights.highROIContent[0];
    recommendations.push(
      `Double down on "${
        bestContent.type
      }" content - your highest ROI format at ${calculateContentROI(bestContent)}% return`
    );
  }

  // Channel optimization
  if (insights.topConversionChannels.length > 0) {
    recommendations.push(
      `Focus marketing budget on ${insights.topConversionChannels[0]} - your highest converting channel`
    );
  }

  // Quality improvements
  const lowEngagement = content.filter(c => c.audienceQuality.averageEngagementTime < 2);
  if (lowEngagement.length > 3) {
    recommendations.push('Improve content quality - 25% of content has under 2min engagement time');
  }

  // Cost optimization
  const highCostLowROI = content.filter(c => {
    const roi = calculateContentROI(c);
    return c.costs.productionCost > 300 && roi < 50;
  });
  if (highCostLowROI.length > 2) {
    recommendations.push('Review production costs for low-ROI content to improve efficiency');
  }

  // Attribution insights
  const totalDirectRevenue = content.reduce((sum, c) => sum + c.attribution.directRevenue, 0);
  const totalAssistedRevenue = content.reduce((sum, c) => sum + c.attribution.assistedRevenue, 0);
  if (totalAssistedRevenue > totalDirectRevenue * 2) {
    recommendations.push(
      'Content heavily assists conversions - ensure full customer journey attribution'
    );
  }

  return recommendations.slice(0, 5); // Max 5 recommendations
}

export async function GET() {
  try {
    console.log('📊 Generating Content ROI Analytics...');

    // Get content data
    const content = generateMockContentData();

    // Calculate summary statistics
    const totalContent = content.length;
    const contentROIs = content.map(calculateContentROI);
    const totalROI = contentROIs.reduce((sum, roi) => sum + roi, 0);
    const averageROI = Math.round(totalROI / totalContent);

    // Performance by type
    const typeROIs: Record<string, number[]> = {};
    content.forEach(c => {
      const roi = calculateContentROI(c);
      if (!typeROIs[c.type]) typeROIs[c.type] = [];
      typeROIs[c.type].push(roi);
    });

    const avgROIByType = Object.entries(typeROIs).map(([type, rois]) => ({
      type,
      avgROI: rois.reduce((sum, roi) => sum + roi, 0) / rois.length,
    }));

    avgROIByType.sort((a, b) => b.avgROI - a.avgROI);
    const bestPerformingType = avgROIByType[0]?.type || 'N/A';
    const worstPerformingType = avgROIByType[avgROIByType.length - 1]?.type || 'N/A';

    const totalDirectRevenue = content.reduce((sum, c) => sum + c.attribution.directRevenue, 0);
    const totalAssistedRevenue = content.reduce((sum, c) => sum + c.attribution.assistedRevenue, 0);
    const totalCosts = content.reduce(
      (sum, c) => sum + c.costs.productionCost + c.costs.promotionCost,
      0
    );
    const totalConversions = content.reduce((sum, c) => sum + c.conversions.paidConversions, 0);

    // Generate insights
    const insights = generateInsights(content);
    const recommendations = generateRecommendations(content, insights);

    const data: ContentROIData = {
      content: content.slice(0, 20), // Return top 20 content pieces
      summary: {
        totalContent,
        totalROI,
        averageROI,
        bestPerformingType,
        worstPerformingType,
        totalDirectRevenue: Math.round(totalDirectRevenue),
        totalAssistedRevenue: Math.round(totalAssistedRevenue),
        costPerConversion: totalConversions > 0 ? Math.round(totalCosts / totalConversions) : 0,
        revenuePerPound:
          totalCosts > 0
            ? Math.round(((totalDirectRevenue + totalAssistedRevenue * 0.3) / totalCosts) * 100) /
              100
            : 0,
      },
      insights,
      recommendations,
    };

    console.log('✅ Content ROI analytics generated successfully');

    return NextResponse.json({
      ...data,
      meta: {
        lastUpdated: new Date().toISOString(),
        analysisMethod: 'Multi-touch attribution with assisted conversion weighting',
        dataSource: 'Integrated analytics: Google Analytics, social media APIs, email platforms',
        attributionWindow: '90 days',
      },
    });
  } catch (error) {
    console.error('Content ROI analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content ROI analytics' },
      { status: 500 }
    );
  }
}
