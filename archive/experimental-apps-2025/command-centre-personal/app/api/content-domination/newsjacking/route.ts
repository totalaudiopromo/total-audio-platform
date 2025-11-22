import { NextRequest, NextResponse } from 'next/server';

interface NewsjackingOpportunity {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  relevanceScore: number;
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  audioIntelAngle: boolean;
  generatedContent: {
    platform: string;
    content: string;
    hashtags: string[];
    estimatedReach: number;
  }[];
  status: 'detected' | 'processing' | 'ready' | 'approved' | 'executing' | 'completed' | 'expired';
  responseWindow: number; // minutes
  expires: string;
}

// Mock data for newsjacking opportunities
const getMockOpportunities = (): NewsjackingOpportunity[] => [
  {
    id: 'nj_001',
    title: 'Major streaming platform announces algorithm change for independent artists',
    summary:
      'Spotify updates its playlist algorithm to give more weight to artist engagement metrics rather than just play counts.',
    source: 'Music Business Worldwide',
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    relevanceScore: 0.95,
    urgencyLevel: 'critical',
    audioIntelAngle: true,
    generatedContent: [
      {
        platform: 'twitter',
        content:
          'BREAKING: Spotify just changed the game for independent artists! 🎵\n\nThe new algorithm prioritizes engagement over play count. This means your CONTACT STRATEGY matters more than ever.\n\nAudio Intel processes your chaotic spreadsheets into organized databases so you can focus on building those crucial relationships.\n\n#SpotifyAlgorithm #MusicMarketing',
        hashtags: ['SpotifyAlgorithm', 'MusicMarketing', 'IndependentArtist', 'AudioIntel'],
        estimatedReach: 5000,
      },
      {
        platform: 'linkedin',
        content:
          "Industry Alert: Spotify's Algorithm Shift Changes Everything for Music Promotion\n\nThe streaming giant's new focus on engagement metrics over raw play counts represents a fundamental shift in how independent artists should approach playlist pitching.\n\nKey implications:\n• Contact quality > quantity\n• Relationship building is paramount\n• Data organization becomes critical\n\nThis is exactly why we built Audio Intel. When you can transform 10+ chaotic Excel files into organized contact databases in minutes, you can spend your time where it matters: building authentic relationships with curators and industry professionals.\n\nThe artists who adapt to this engagement-focused approach will dominate 2025 and beyond.",
        hashtags: ['MusicIndustry', 'SpotifyPlaylist', 'AudioIntel', 'MusicPromotion'],
        estimatedReach: 8000,
      },
    ],
    status: 'ready',
    responseWindow: 120, // 2 hours
    expires: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
  },
  {
    id: 'nj_002',
    title: 'TikTok introduces new music discovery features for emerging artists',
    summary:
      'TikTok launches "Sound On" program connecting record labels with viral creators for music placement.',
    source: 'Rolling Stone',
    publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 1.5 hours ago
    relevanceScore: 0.78,
    urgencyLevel: 'high',
    audioIntelAngle: false,
    generatedContent: [
      {
        platform: 'twitter',
        content:
          'TikTok\'s new "Sound On" program is a GAME CHANGER for emerging artists! 🚀\n\nDirect connection between labels and viral creators = new opportunities for music placement.\n\nTime to update those TikTok creator contact lists! 📊\n\n#TikTokMusic #SoundOn #MusicDiscovery',
        hashtags: ['TikTokMusic', 'SoundOn', 'MusicDiscovery', 'EmergingArtists'],
        estimatedReach: 3500,
      },
    ],
    status: 'ready',
    responseWindow: 240, // 4 hours
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
  },
  {
    id: 'nj_003',
    title: 'Music industry veteran launches new independent playlist curation service',
    summary:
      'Former Universal Music executive Sarah Mitchell announces "Curated Sounds" focusing on genre-specific playlists.',
    source: 'Variety',
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    relevanceScore: 0.65,
    urgencyLevel: 'medium',
    audioIntelAngle: true,
    generatedContent: [
      {
        platform: 'linkedin',
        content:
          'Exciting news in the playlist curation space! Sarah Mitchell\'s "Curated Sounds" represents the growing trend of specialized, boutique playlist services.\n\nFor independent artists, this means:\n✅ More personalized curation\n✅ Genre-specific expertise\n✅ Direct relationships with decision makers\n\nThe key? Having organized contact data to track these emerging opportunities. Tools like Audio Intel help artists manage the growing complexity of the modern music promotion landscape.',
        hashtags: ['PlaylistCuration', 'MusicIndustry', 'IndependentArtist'],
        estimatedReach: 2800,
      },
    ],
    status: 'ready',
    responseWindow: 480, // 8 hours
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  },
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const urgencyLevel = url.searchParams.get('urgencyLevel');

    let opportunities = getMockOpportunities();

    // Filter by status if provided
    if (status) {
      opportunities = opportunities.filter(opp => opp.status === status);
    }

    // Filter by urgency level if provided
    if (urgencyLevel) {
      opportunities = opportunities.filter(opp => opp.urgencyLevel === urgencyLevel);
    }

    // Sort by relevance score (highest first) and then by recency
    opportunities.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    return NextResponse.json({
      success: true,
      opportunities,
      count: opportunities.length,
      stats: {
        critical: opportunities.filter(opp => opp.urgencyLevel === 'critical').length,
        high: opportunities.filter(opp => opp.urgencyLevel === 'high').length,
        medium: opportunities.filter(opp => opp.urgencyLevel === 'medium').length,
        low: opportunities.filter(opp => opp.urgencyLevel === 'low').length,
        audioIntelAngles: opportunities.filter(opp => opp.audioIntelAngle).length,
        ready: opportunities.filter(opp => opp.status === 'ready').length,
      },
    });
  } catch (error) {
    console.error('Newsjacking API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsjacking opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, opportunityId } = body;

    if (action === 'approve') {
      // In a real implementation, this would trigger the content scheduling orchestrator
      console.log(`Approving newsjacking opportunity: ${opportunityId}`);

      // Mock response for approval
      return NextResponse.json({
        success: true,
        message: 'Opportunity approved and scheduled for immediate execution',
        executionPlan: {
          platforms: ['twitter', 'linkedin'],
          scheduledTimes: {
            twitter: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 mins from now
            linkedin: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins from now
          },
          estimatedReach: 13000,
        },
      });
    }

    if (action === 'reject') {
      console.log(`Rejecting newsjacking opportunity: ${opportunityId}`);

      return NextResponse.json({
        success: true,
        message: 'Opportunity rejected and removed from queue',
      });
    }

    if (action === 'generate_more_content') {
      // Mock additional content generation
      return NextResponse.json({
        success: true,
        generatedContent: {
          platform: 'instagram',
          content:
            'Visual post concept: Infographic showing the shift from play count to engagement metrics with Audio Intel branding',
          hashtags: ['MusicMarketing', 'AudioIntel', 'SpotifyUpdate'],
          estimatedReach: 4200,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error) {
    console.error('Newsjacking action error:', error);
    return NextResponse.json({ error: 'Failed to process newsjacking action' }, { status: 500 });
  }
}
