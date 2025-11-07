import { NextRequest, NextResponse } from 'next/server';
import { getApprovalQueue, setApprovalQueue } from '@/lib/approval-queue';

interface ApprovalAction {
  contentId: string;
  platform: 'twitter' | 'linkedin' | 'instagram' | 'newsletter';
  action: 'approve' | 'reject' | 'edit' | 'schedule';
  scheduledTime?: string;
  editedContent?: any;
  rejectionReason?: string;
  approver: string;
}

// In-memory storage for approvals (would be database in production)
let approvals: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'approved', 'rejected', 'scheduled'
    const platform = searchParams.get('platform');

    const approvalQueue = getApprovalQueue();
    let filteredQueue = [...approvalQueue];

    if (status) {
      filteredQueue = filteredQueue.filter(item => item.status === status);
    }

    if (platform) {
      filteredQueue = filteredQueue.filter(item => item.platform === platform);
    }

    // Sort by priority (urgent first) and then by created time
    filteredQueue.sort((a, b) => {
      if (a.urgency !== b.urgency) {
        const urgencyOrder: Record<string, number> = { immediate: 3, high: 2, medium: 1, low: 0 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const stats = {
      total: approvalQueue.length,
      pending: approvalQueue.filter(item => item.status === 'pending').length,
      approved: approvalQueue.filter(item => item.status === 'approved').length,
      rejected: approvalQueue.filter(item => item.status === 'rejected').length,
      scheduled: approvalQueue.filter(item => item.status === 'scheduled').length,
      urgent: approvalQueue.filter(item => item.urgency === 'immediate').length,
    };

    return NextResponse.json({
      success: true,
      queue: filteredQueue,
      stats,
    });
  } catch (error) {
    console.error('Error fetching approval queue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch approval queue' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, contentId, platform, approver, scheduledTime, editedContent, rejectionReason } =
      body;

    if (!action || !contentId || !platform || !approver) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const approvalQueue = getApprovalQueue();

    // Find the content in the queue
    const queueIndex = approvalQueue.findIndex(
      item => item.contentId === contentId && item.platform === platform
    );

    if (queueIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Content not found in approval queue' },
        { status: 404 }
      );
    }

    const queueItem = approvalQueue[queueIndex];

    // Process the approval action
    const approval: ApprovalAction = {
      contentId,
      platform,
      action,
      approver,
      scheduledTime,
      editedContent,
      rejectionReason,
    };

    // Update queue item status
    queueItem.status = action === 'schedule' ? 'scheduled' : action + 'd';
    queueItem.lastAction = action;
    queueItem.approver = approver;
    queueItem.processedAt = new Date().toISOString();

    if (action === 'approve') {
      queueItem.approvedAt = new Date().toISOString();
      queueItem.readyToPost = true;
    } else if (action === 'reject') {
      queueItem.rejectedAt = new Date().toISOString();
      queueItem.rejectionReason = rejectionReason;
      queueItem.readyToPost = false;
    } else if (action === 'schedule') {
      queueItem.scheduledFor = scheduledTime;
      queueItem.readyToPost = true;
    } else if (action === 'edit') {
      queueItem.editedContent = editedContent;
      queueItem.status = 'pending'; // Send back to pending after edit
      queueItem.lastEditedAt = new Date().toISOString();
    }

    // Log the approval action
    approvals.push({
      id: `approval_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ...approval,
      timestamp: new Date().toISOString(),
      originalContent: queueItem.generatedContent,
    });

    // If approved or scheduled, prepare for social posting system integration
    if (action === 'approve' || action === 'schedule') {
      await integrateWithSocialPosting(queueItem, approval);
    }

    return NextResponse.json({
      success: true,
      message: `Content ${action}${
        action === 'approve' ? 'ed' : action === 'reject' ? 'ed' : 'd'
      } successfully`,
      item: queueItem,
    });
  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}

// Integration with social posting system
async function integrateWithSocialPosting(queueItem: any, approval: ApprovalAction) {
  try {
    const socialPostData = {
      source: 'newsjacking',
      originalNewsId: queueItem.contentId,
      platform: approval.platform,
      content: approval.editedContent || queueItem.generatedContent,
      scheduledFor: approval.scheduledTime || new Date(Date.now() + 60000).toISOString(), // 1 minute from now if not scheduled
      urgency: queueItem.urgency,
      approvedBy: approval.approver,
      tags: ['newsjacking', 'industry-intel', queueItem.urgency],
      metadata: {
        originalTitle: queueItem.originalStory?.title,
        relevanceScore: queueItem.relevanceScore,
        audioIntelAngle: queueItem.audioIntelAngle,
      },
    };

    // Call social posting system
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/api/social-media/schedule`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialPostData),
      }
    );

    if (response.ok) {
      console.log(`✅ Content queued for ${approval.platform} posting`);
    } else {
      console.log(`⚠️ Failed to queue content for social posting:`, await response.text());
    }
  } catch (error) {
    console.error('Error integrating with social posting:', error);
  }
}
