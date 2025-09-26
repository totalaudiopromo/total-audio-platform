import { NextRequest, NextResponse } from 'next/server';
import { weeklyMusicAgent } from '@/utils/weeklyMusicAgent';

// This endpoint can be called by Vercel Cron Jobs, GitHub Actions, or any cron service
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekNumber = parseInt(searchParams.get('week') || '1');
    const createDraft = searchParams.get('createDraft') === 'true';
    const autoSend = searchParams.get('autoSend') === 'true';

    console.log(`🤖 Weekly Newsletter Cron: Running for week ${weekNumber}`);

    // Generate weekly intelligence
    const intelligence = await weeklyMusicAgent.generateWeeklyIntelligence(weekNumber);
    
    console.log(`📊 Generated intelligence for week ${weekNumber}:`);
    console.log(`- ${intelligence.totalArticles} articles from ${intelligence.sources.length} sources`);
    console.log(`- Top sources: ${intelligence.sources.slice(0, 3).join(', ')}`);

    let result: any = {
      success: true,
      message: `Weekly intelligence generated for week ${weekNumber}`,
      intelligence: {
        weekNumber: intelligence.weekNumber,
        totalArticles: intelligence.totalArticles,
        sources: intelligence.sources.length,
        topSources: intelligence.sources.slice(0, 3)
      }
    };

    // Create ConvertKit draft if requested
    if (createDraft) {
      console.log('📧 Creating ConvertKit draft...');
      const draftResult = await weeklyMusicAgent.createNewsletterDraft(intelligence);
      
      if (draftResult.success) {
        result.draftCreated = true;
        result.campaignId = draftResult.campaignId;
        result.message += ' and ConvertKit draft created';
        
        // Auto-send if requested
        if (autoSend && draftResult.campaignId) {
          console.log('📤 Auto-sending newsletter...');
          const sendResult = await weeklyMusicAgent.sendNewsletterDraft(draftResult.campaignId);
          
          if (sendResult.success) {
            result.newsletterSent = true;
            result.sentTo = sendResult.sent;
            result.message += ' and sent to subscribers';
          } else {
            result.sendError = sendResult.error;
            result.message += ' but failed to send';
          }
        }
      } else {
        result.draftError = draftResult.error;
        result.message += ' but failed to create draft';
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in weekly newsletter cron:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also support POST for webhook triggers
export async function POST(request: NextRequest) {
  return GET(request);
}


