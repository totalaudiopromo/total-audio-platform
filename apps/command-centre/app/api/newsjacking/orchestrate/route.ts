/**
 * Content Domination Orchestration API
 *
 * POST /api/newsjacking/orchestrate
 *
 * Orchestrates the full newsjacking → content → social posting flow.
 * Simplified version of the Content Domination system optimised for
 * Command Centre mobile workflows.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface OrchestrationRequest {
  action:
    | 'scan' // Scan for opportunities
    | 'research' // Deep research on topic
    | 'generate' // Generate content from opportunity
    | 'schedule' // Schedule content for posting
    | 'post' // Post immediately
    | 'full_pipeline'; // Run full scan → generate → schedule
  opportunityId?: string;
  topic?: string;
  platforms?: ('bluesky' | 'twitter' | 'linkedin' | 'threads')[];
  scheduledTime?: string; // ISO string
}

interface OrchestrationResult {
  action: string;
  success: boolean;
  data: any;
  nextSteps: string[];
  timestamp: string;
}

// Get the base URL for internal API calls
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';
}

/**
 * Scan for newsjacking opportunities
 */
async function scanOpportunities(): Promise<any> {
  const response = await fetch(`${getBaseUrl()}/api/newsjacking/monitor`);
  if (!response.ok) throw new Error('Failed to scan opportunities');
  return response.json();
}

/**
 * Conduct research on a topic
 */
async function conductResearch(topic: string, depth: string = 'standard'): Promise<any> {
  const response = await fetch(`${getBaseUrl()}/api/newsjacking/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, depth }),
  });
  if (!response.ok) throw new Error('Failed to conduct research');
  return response.json();
}

/**
 * Generate content from an opportunity
 */
async function generateContent(opportunityId: string): Promise<any> {
  // Get the opportunity details from the content endpoint
  const contentResponse = await fetch(`${getBaseUrl()}/api/newsjacking/content`);
  if (!contentResponse.ok) throw new Error('Failed to get content');

  const contentData = await contentResponse.json();
  const opportunity = contentData.data?.find((item: any) => item.id === opportunityId);

  if (!opportunity) {
    throw new Error(`Opportunity ${opportunityId} not found`);
  }

  return {
    success: true,
    content: {
      id: opportunity.id,
      twitter: opportunity.multiPlatformContent?.twitter?.content || [],
      linkedin: opportunity.multiPlatformContent?.linkedin?.content || null,
      instagram: opportunity.multiPlatformContent?.instagram?.content || null,
      newsletter: opportunity.newsletterSections || [],
      angle: opportunity.unsignedAngle?.angle || '',
      originalStory: opportunity.originalStory,
    },
  };
}

/**
 * Schedule content for posting
 */
async function scheduleContent(opportunityId: string, scheduledTime: string): Promise<any> {
  const response = await fetch(`${getBaseUrl()}/api/newsjacking/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'schedule',
      contentId: opportunityId,
      scheduledTime,
    }),
  });
  if (!response.ok) throw new Error('Failed to schedule content');
  return response.json();
}

/**
 * Post content immediately to social platforms
 */
async function postContent(content: string, platforms: string[]): Promise<any> {
  const response = await fetch(`${getBaseUrl()}/api/social/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, platforms }),
  });
  if (!response.ok) throw new Error('Failed to post content');
  return response.json();
}

/**
 * Run full pipeline: scan → pick best → generate → schedule
 */
async function runFullPipeline(platforms: string[]): Promise<any> {
  const results: any = {
    scan: null,
    research: null,
    content: null,
    scheduled: null,
    errors: [],
  };

  try {
    // Step 1: Scan for opportunities
    console.log('[ORCHESTRATE] Step 1: Scanning opportunities...');
    const scanResult = await scanOpportunities();
    results.scan = {
      success: scanResult.success,
      opportunityCount: scanResult.opportunities?.length || 0,
    };

    if (!scanResult.opportunities || scanResult.opportunities.length === 0) {
      return {
        success: false,
        data: results,
        message: 'No opportunities found',
        nextSteps: ['Try conducting manual research on a specific topic'],
      };
    }

    // Step 2: Pick the best opportunity (highest relevance + urgency)
    const opportunities = scanResult.opportunities;
    const bestOpportunity = opportunities.sort((a: any, b: any) => {
      // Priority: immediate > high > medium > low
      const urgencyScore: Record<string, number> = { immediate: 4, high: 3, medium: 2, low: 1 };
      const urgencyDiff = (urgencyScore[b.urgencyLevel] || 0) - (urgencyScore[a.urgencyLevel] || 0);
      if (urgencyDiff !== 0) return urgencyDiff;
      return b.relevanceScore - a.relevanceScore;
    })[0];

    console.log(`[ORCHESTRATE] Best opportunity: ${bestOpportunity.title.substring(0, 50)}...`);

    // Step 3: Conduct research on the topic
    console.log('[ORCHESTRATE] Step 2: Conducting research...');
    try {
      const researchResult = await conductResearch(bestOpportunity.title, 'quick');
      results.research = {
        success: researchResult.success,
        topic: bestOpportunity.title,
        hasPerplexityKey: researchResult.hasPerplexityKey,
      };
    } catch (e) {
      results.errors.push(`Research failed: ${e}`);
      // Continue without research
    }

    // Step 4: Get/generate content
    console.log('[ORCHESTRATE] Step 3: Generating content...');
    const contentResult = await generateContent(bestOpportunity.id);
    results.content = {
      success: contentResult.success,
      id: contentResult.content?.id,
      platforms: {
        twitter: contentResult.content?.twitter?.length || 0,
        linkedin: contentResult.content?.linkedin ? 1 : 0,
      },
    };

    // Step 5: Schedule for optimal time (next business hour)
    console.log('[ORCHESTRATE] Step 4: Scheduling content...');
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);

    // Adjust for UK business hours (9-18)
    const ukHour = parseInt(
      nextHour.toLocaleString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        hour12: false,
      })
    );
    if (ukHour < 9 || ukHour >= 18) {
      // Schedule for 9 AM tomorrow
      nextHour.setDate(nextHour.getDate() + (ukHour >= 18 ? 1 : 0));
      nextHour.setHours(9, 0, 0, 0);
    }

    try {
      const scheduleResult = await scheduleContent(bestOpportunity.id, nextHour.toISOString());
      results.scheduled = {
        success: scheduleResult.success,
        scheduledFor: nextHour.toISOString(),
      };
    } catch (e) {
      results.errors.push(`Scheduling failed: ${e}`);
    }

    return {
      success: true,
      data: results,
      opportunity: {
        id: bestOpportunity.id,
        title: bestOpportunity.title,
        urgency: bestOpportunity.urgencyLevel,
        relevance: bestOpportunity.relevanceScore,
        angle: bestOpportunity.audioIntelAngle,
      },
      content: contentResult.content,
      nextSteps: [
        'Review generated content',
        'Approve or edit before scheduled time',
        'Monitor engagement after posting',
      ],
    };
  } catch (error) {
    console.error('[ORCHESTRATE] Pipeline error:', error);
    return {
      success: false,
      data: results,
      error: error instanceof Error ? error.message : 'Pipeline failed',
      nextSteps: ['Check individual endpoints for issues', 'Try running steps manually'],
    };
  }
}

/**
 * POST /api/newsjacking/orchestrate
 *
 * Main orchestration endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body: OrchestrationRequest = await request.json();
    const { action, opportunityId, topic, platforms = ['bluesky'], scheduledTime } = body;

    console.log(`[ORCHESTRATE] Action: ${action}`);

    let result: OrchestrationResult;

    switch (action) {
      case 'scan': {
        const scanData = await scanOpportunities();
        result = {
          action: 'scan',
          success: scanData.success,
          data: {
            opportunities: scanData.opportunities?.slice(0, 10), // Top 10
            summary: scanData.summary,
          },
          nextSteps:
            scanData.opportunities?.length > 0
              ? ['Select an opportunity', 'Generate content', 'Review and post']
              : ['Try different sources', 'Conduct manual research'],
          timestamp: new Date().toISOString(),
        };
        break;
      }

      case 'research': {
        if (!topic) {
          return NextResponse.json(
            { success: false, error: 'Topic required for research' },
            { status: 400 }
          );
        }
        const researchData = await conductResearch(topic);
        result = {
          action: 'research',
          success: researchData.success,
          data: researchData.research,
          nextSteps: [
            'Use insights to craft content',
            'Identify Audio Intel angles',
            'Create social posts',
          ],
          timestamp: new Date().toISOString(),
        };
        break;
      }

      case 'generate': {
        if (!opportunityId) {
          return NextResponse.json(
            { success: false, error: 'Opportunity ID required' },
            { status: 400 }
          );
        }
        const contentData = await generateContent(opportunityId);
        result = {
          action: 'generate',
          success: contentData.success,
          data: contentData.content,
          nextSteps: ['Review content', 'Edit if needed', 'Schedule or post immediately'],
          timestamp: new Date().toISOString(),
        };
        break;
      }

      case 'schedule': {
        if (!opportunityId || !scheduledTime) {
          return NextResponse.json(
            { success: false, error: 'Opportunity ID and scheduled time required' },
            { status: 400 }
          );
        }
        const scheduleData = await scheduleContent(opportunityId, scheduledTime);
        result = {
          action: 'schedule',
          success: scheduleData.success,
          data: scheduleData.data,
          nextSteps: ['Monitor scheduled post', 'Prepare engagement responses'],
          timestamp: new Date().toISOString(),
        };
        break;
      }

      case 'post': {
        if (!opportunityId) {
          return NextResponse.json(
            { success: false, error: 'Opportunity ID required' },
            { status: 400 }
          );
        }
        // Get content and post
        const contentForPost = await generateContent(opportunityId);
        const twitterContent = contentForPost.content?.twitter?.[0] || '';

        if (!twitterContent) {
          return NextResponse.json(
            { success: false, error: 'No content available to post' },
            { status: 400 }
          );
        }

        const postData = await postContent(twitterContent, platforms);
        result = {
          action: 'post',
          success: postData.success,
          data: postData,
          nextSteps: ['Monitor engagement', 'Respond to comments', 'Track performance'],
          timestamp: new Date().toISOString(),
        };
        break;
      }

      case 'full_pipeline': {
        const pipelineResult = await runFullPipeline(platforms);
        result = {
          action: 'full_pipeline',
          success: pipelineResult.success,
          data: pipelineResult,
          nextSteps: pipelineResult.nextSteps || [],
          timestamp: new Date().toISOString(),
        };
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[ORCHESTRATE] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Orchestration failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/newsjacking/orchestrate
 *
 * Get orchestration status and available actions
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'ready',
    availableActions: [
      {
        action: 'scan',
        description: 'Scan RSS sources for newsjacking opportunities',
        requires: null,
      },
      {
        action: 'research',
        description: 'Conduct deep research on a topic using Perplexity',
        requires: 'topic',
      },
      {
        action: 'generate',
        description: 'Generate multi-platform content from an opportunity',
        requires: 'opportunityId',
      },
      {
        action: 'schedule',
        description: 'Schedule content for future posting',
        requires: 'opportunityId, scheduledTime',
      },
      {
        action: 'post',
        description: 'Post content immediately to selected platforms',
        requires: 'opportunityId, platforms',
      },
      {
        action: 'full_pipeline',
        description: 'Run complete scan → generate → schedule pipeline',
        requires: 'platforms (optional)',
      },
    ],
    platforms: ['bluesky', 'twitter', 'linkedin', 'threads'],
    note: 'POST to this endpoint with { action, ...params }',
  });
}
