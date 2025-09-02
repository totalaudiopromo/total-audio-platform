import { NextRequest, NextResponse } from 'next/server';

interface ContentBatch {
  id: string;
  name: string;
  source: string;
  totalPieces: number;
  platforms: string[];
  status: 'queued' | 'processing' | 'executing' | 'completed' | 'paused';
  scheduledPieces: ScheduledPiece[];
  distributionPlan: DistributionPlan;
  progress: {
    completed: number;
    failed: number;
    pending: number;
  };
  performance: {
    totalReach: number;
    totalEngagement: number;
    avgEngagementRate: number;
  };
  created: string;
  expectedCompletion: string;
  ukOptimized: boolean;
}

interface ScheduledPiece {
  id: string;
  platform: string;
  contentType: string;
  content: string;
  scheduledTime: string;
  status: 'queued' | 'posting' | 'published' | 'failed';
  priority: 'high' | 'medium' | 'low';
  estimatedReach: number;
  actualReach?: number;
  engagementRate?: number;
}

interface DistributionPlan {
  phase1: { name: string; duration: string; platforms: string[] };
  phase2: { name: string; duration: string; platforms: string[] };
  phase3: { name: string; duration: string; platforms: string[] };
  phase4: { name: string; duration: string; platforms: string[] };
  totalDuration: number; // hours
}

// Mock data for content batches
const getMockBatches = (): ContentBatch[] => [
  {
    id: 'batch_001',
    name: 'Audio Intel Product Launch Campaign',
    source: 'Product Marketing Team',
    totalPieces: 12,
    platforms: ['twitter', 'linkedin', 'instagram', 'newsletter'],
    status: 'executing',
    scheduledPieces: [
      {
        id: 'piece_001',
        platform: 'twitter',
        contentType: 'thread',
        content: 'Just launched Audio Intel! Transform your messy contact spreadsheets into organised databases in minutes. Thread 1/5 🧵',
        scheduledTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins from now
        status: 'queued',
        priority: 'high',
        estimatedReach: 5000
      },
      {
        id: 'piece_002',
        platform: 'linkedin',
        contentType: 'article',
        content: 'Why Independent Artists Are Drowning in Contact Chaos (And How Audio Intel Fixes It)',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        status: 'queued',
        priority: 'high',
        estimatedReach: 8000
      },
      {
        id: 'piece_003',
        platform: 'instagram',
        contentType: 'post',
        content: 'Before/After: 10 chaotic Excel files → One organized contact database ✨ #AudioIntel',
        scheduledTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
        status: 'queued',
        priority: 'medium',
        estimatedReach: 3500
      }
    ],
    distributionPlan: {
      phase1: { name: 'Immediate Engagement', duration: '0-2 hours', platforms: ['twitter'] },
      phase2: { name: 'Authority Building', duration: '2-8 hours', platforms: ['linkedin'] },
      phase3: { name: 'Visual Engagement', duration: '8-24 hours', platforms: ['instagram'] },
      phase4: { name: 'Nurture & Follow-up', duration: '24-72 hours', platforms: ['newsletter'] },
      totalDuration: 72
    },
    progress: {
      completed: 4,
      failed: 1,
      pending: 7
    },
    performance: {
      totalReach: 18500,
      totalEngagement: 2400,
      avgEngagementRate: 12.8
    },
    created: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    expectedCompletion: new Date(Date.now() + 66 * 60 * 60 * 1000).toISOString(), // 66 hours from now
    ukOptimized: true
  },
  {
    id: 'batch_002',
    name: 'Weekly Newsletter Content Distribution',
    source: 'Content Team Newsletter #47',
    totalPieces: 8,
    platforms: ['twitter', 'linkedin', 'bluesky'],
    status: 'queued',
    scheduledPieces: [
      {
        id: 'piece_004',
        platform: 'twitter',
        contentType: 'single',
        content: 'This week in music marketing: Playlist submission strategies that actually work 🎵',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
        status: 'queued',
        priority: 'medium',
        estimatedReach: 2800
      }
    ],
    distributionPlan: {
      phase1: { name: 'Twitter Engagement', duration: '0-1 hours', platforms: ['twitter'] },
      phase2: { name: 'Professional Networks', duration: '1-4 hours', platforms: ['linkedin'] },
      phase3: { name: 'Alternative Platforms', duration: '4-12 hours', platforms: ['bluesky'] },
      phase4: { name: 'Follow-up', duration: '12-24 hours', platforms: [] },
      totalDuration: 24
    },
    progress: {
      completed: 0,
      failed: 0,
      pending: 8
    },
    performance: {
      totalReach: 0,
      totalEngagement: 0,
      avgEngagementRate: 0
    },
    created: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    expectedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    ukOptimized: true
  },
  {
    id: 'batch_003',
    name: 'Industry Trend Response Campaign',
    source: 'Newsjacking Engine',
    totalPieces: 6,
    platforms: ['twitter', 'linkedin'],
    status: 'completed',
    scheduledPieces: [
      {
        id: 'piece_005',
        platform: 'twitter',
        contentType: 'thread',
        content: 'THREAD: Why the new Spotify algorithm changes everything for independent artists...',
        scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'published',
        priority: 'high',
        estimatedReach: 4500,
        actualReach: 5200,
        engagementRate: 8.4
      }
    ],
    distributionPlan: {
      phase1: { name: 'Rapid Response', duration: '0-30 mins', platforms: ['twitter'] },
      phase2: { name: 'Authority Follow-up', duration: '30 mins-2 hours', platforms: ['linkedin'] },
      phase3: { name: 'Extended Reach', duration: '2-6 hours', platforms: [] },
      phase4: { name: 'Analysis', duration: '6-24 hours', platforms: [] },
      totalDuration: 6
    },
    progress: {
      completed: 6,
      failed: 0,
      pending: 0
    },
    performance: {
      totalReach: 12400,
      totalEngagement: 1890,
      avgEngagementRate: 15.2
    },
    created: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    expectedCompletion: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // completed 30 mins ago
    ukOptimized: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const platform = url.searchParams.get('platform');
    
    let batches = getMockBatches();
    
    // Filter by status if provided
    if (status) {
      batches = batches.filter(batch => batch.status === status);
    }
    
    // Filter by platform if provided
    if (platform) {
      batches = batches.filter(batch => batch.platforms.includes(platform));
    }
    
    // Sort by creation date (newest first)
    batches.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    // Calculate aggregate stats
    const stats = {
      totalBatches: batches.length,
      totalPieces: batches.reduce((sum, batch) => sum + batch.totalPieces, 0),
      totalReach: batches.reduce((sum, batch) => sum + batch.performance.totalReach, 0),
      totalEngagement: batches.reduce((sum, batch) => sum + batch.performance.totalEngagement, 0),
      avgEngagementRate: batches.length > 0 
        ? batches.reduce((sum, batch) => sum + batch.performance.avgEngagementRate, 0) / batches.length
        : 0,
      statusBreakdown: {
        queued: batches.filter(b => b.status === 'queued').length,
        processing: batches.filter(b => b.status === 'processing').length,
        executing: batches.filter(b => b.status === 'executing').length,
        completed: batches.filter(b => b.status === 'completed').length,
        paused: batches.filter(b => b.status === 'paused').length
      },
      ukOptimized: batches.filter(b => b.ukOptimized).length
    };

    return NextResponse.json({
      success: true,
      batches,
      stats,
      count: batches.length
    });

  } catch (error) {
    console.error('Content scheduling API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content batches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, batchId, contentPieces, batchName, source, platforms } = body;

    if (action === 'create_batch') {
      // Create new content batch
      const newBatch: ContentBatch = {
        id: `batch_${Date.now()}`,
        name: batchName || 'New Content Batch',
        source: source || 'Manual Creation',
        totalPieces: contentPieces?.length || 0,
        platforms: platforms || ['twitter', 'linkedin'],
        status: 'queued',
        scheduledPieces: [], // Would be populated by the scheduling orchestrator
        distributionPlan: {
          phase1: { name: 'Immediate Engagement', duration: '0-2 hours', platforms: ['twitter'] },
          phase2: { name: 'Authority Building', duration: '2-8 hours', platforms: ['linkedin'] },
          phase3: { name: 'Visual Engagement', duration: '8-24 hours', platforms: ['instagram'] },
          phase4: { name: 'Follow-up', duration: '24-72 hours', platforms: ['newsletter'] },
          totalDuration: 72
        },
        progress: {
          completed: 0,
          failed: 0,
          pending: contentPieces?.length || 0
        },
        performance: {
          totalReach: 0,
          totalEngagement: 0,
          avgEngagementRate: 0
        },
        created: new Date().toISOString(),
        expectedCompletion: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        ukOptimized: true
      };

      console.log('Created new content batch:', newBatch.id);
      
      return NextResponse.json({
        success: true,
        batch: newBatch,
        message: 'Content batch created and queued for execution'
      });
    }

    if (action === 'pause_batch') {
      console.log(`Pausing content batch: ${batchId}`);
      
      return NextResponse.json({
        success: true,
        message: `Content batch ${batchId} paused`,
        pausedPieces: 3 // Mock number of pieces paused
      });
    }

    if (action === 'resume_batch') {
      console.log(`Resuming content batch: ${batchId}`);
      
      return NextResponse.json({
        success: true,
        message: `Content batch ${batchId} resumed`,
        resumedPieces: 3
      });
    }

    if (action === 'cancel_batch') {
      console.log(`Cancelling content batch: ${batchId}`);
      
      return NextResponse.json({
        success: true,
        message: `Content batch ${batchId} cancelled`,
        cancelledPieces: 5
      });
    }

    if (action === 'reschedule_piece') {
      const { pieceId, newTime } = body;
      console.log(`Rescheduling piece ${pieceId} to ${newTime}`);
      
      return NextResponse.json({
        success: true,
        message: `Content piece rescheduled successfully`,
        newScheduledTime: newTime
      });
    }

    if (action === 'get_optimal_times') {
      // Return UK-optimized posting times
      const now = new Date();
      const ukTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
      
      const optimalTimes = {
        twitter: [
          new Date(ukTime.getTime() + 30 * 60 * 1000).toISOString(), // 30 mins
          new Date(ukTime.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
          new Date(ukTime.getTime() + 8 * 60 * 60 * 1000).toISOString()  // 8 hours
        ],
        linkedin: [
          new Date(ukTime.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
          new Date(ukTime.getTime() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
          new Date(ukTime.getTime() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        ],
        instagram: [
          new Date(ukTime.getTime() + 8 * 60 * 60 * 1000).toISOString(),  // 8 hours
          new Date(ukTime.getTime() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
          new Date(ukTime.getTime() + 36 * 60 * 60 * 1000).toISOString()  // 36 hours
        ]
      };
      
      return NextResponse.json({
        success: true,
        optimalTimes,
        timezone: 'Europe/London',
        currentUKTime: ukTime.toISOString(),
        businessHours: {
          weekdays: { start: 9, end: 18, optimal: [9, 13, 17] },
          weekends: { start: 10, end: 16, optimal: [11, 15] }
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action specified' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Content scheduling action error:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduling action' },
      { status: 500 }
    );
  }
}