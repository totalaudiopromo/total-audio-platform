import { NextRequest, NextResponse } from 'next/server';
import { newsletterResearch, NEWSLETTER_THEMES } from '@/utils/newsletterContentStrategy';
import { weeklyNewsletter } from '@/utils/newsletterTemplates';
import { getEnv } from '@/lib/env';

interface WeeklyAgentPostBody {
  weekNumber?: number;
  createDraft?: boolean;
  sendDraft?: boolean;
  campaignId?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekNumber = parseInt(searchParams.get('week') || '1');
    const isTest = searchParams.get('test') === 'true';

    // Generate weekly content/intelligence
    let intelligence: any;
    if (isTest) {
      // Safe fallback that avoids external fetches
      const theme = NEWSLETTER_THEMES[weekNumber - 1] || NEWSLETTER_THEMES[0];
      intelligence = {
        issueNumber: weekNumber,
        industryInsight: `Quick take: ${theme.focus}. Practical, UK-focused advice for independent artists.`,
        quickTip: 'Block 30 minutes weekly to curate UK-focused industry sources you genuinely use.',
        communityQuestion: 'What’s your biggest time-waster in promotion right now?',
        newsArticles: []
      };
    } else {
      intelligence = await newsletterResearch.generateWeeklyContent(weekNumber);
    }

    return NextResponse.json({
      success: true,
      intelligence: {
        weekNumber: intelligence.issueNumber,
        weeklyInsight: intelligence.industryInsight,
        quickTip: intelligence.quickTip,
        communityQuestion: intelligence.communityQuestion,
        topStories: intelligence.newsArticles || [],
        sources: (intelligence.newsArticles || []).map(a => a.source).filter(Boolean),
        totalArticles: intelligence.newsArticles?.length || 0
      }
    });
  } catch (error) {
    console.error('Weekly agent GET error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Read body ONCE to avoid the "Body has already been read" error
    const raw = await request.text();
    let body: WeeklyAgentPostBody = {};
    if (raw && raw.trim().length > 0) {
      try {
        body = JSON.parse(raw) as WeeklyAgentPostBody;
      } catch {
        const params = new URLSearchParams(raw);
        body = {
          weekNumber: params.get('weekNumber') ? parseInt(params.get('weekNumber') as string) : undefined,
          createDraft: params.get('createDraft') === 'true',
          sendDraft: params.get('sendDraft') === 'true',
          campaignId: params.get('campaignId') || undefined
        };
      }
    }
    const weekNumber = body.weekNumber || 1;
    const createDraft = body.createDraft === true;
    const sendDraft = body.sendDraft === true;

    // Generate content
    const content = await newsletterResearch.generateWeeklyContent(weekNumber);
    const subject = `The Unsigned Advantage — Week ${content.issueNumber}: ${content.theme}`;
    const html = weeklyNewsletter({
      issueNumber: content.issueNumber,
      publishDate: content.publishDate,
      industryInsight: content.industryInsight,
      featuredTool: content.featuredTool,
      successStory: content.successStory,
      newsArticles: content.newsArticles
    });

    // Optional: create a ConvertKit draft (preview email instead, if CK not configured)
    if (createDraft) {
      const CK_SECRET = getEnv('CONVERTKIT_API_SECRET', { requiredInProd: false });
      const PREVIEW_EMAIL = getEnv('NEWSLETTER_PREVIEW_EMAIL', { requiredInProd: false }) || getEnv('EMAIL_FROM', { requiredInProd: false });

      if (!CK_SECRET && PREVIEW_EMAIL) {
        // Fallback: email preview via Resend if configured
        const previewSent = await sendPreviewEmail(PREVIEW_EMAIL, subject, html);
        if (!previewSent.success) {
          return NextResponse.json({ success: false, error: previewSent.error || 'Preview email failed' }, { status: 500 });
        }
        return NextResponse.json({ success: true, campaignId: `preview-${Date.now()}`, sentPreviewTo: PREVIEW_EMAIL });
      }

      // If ConvertKit secret exists, attempt to create a draft broadcast (best-effort)
      if (CK_SECRET) {
        try {
          const draftResult = await createConvertKitBroadcastDraft({ subject, html, apiSecret: CK_SECRET });
          return NextResponse.json({ success: true, campaignId: draftResult.campaignId });
        } catch (e) {
          console.warn('ConvertKit draft creation failed, falling back to preview only:', e);
          if (PREVIEW_EMAIL) {
            const previewSent = await sendPreviewEmail(PREVIEW_EMAIL, subject, html);
            if (!previewSent.success) {
              return NextResponse.json({ success: false, error: previewSent.error || 'Preview email failed' }, { status: 500 });
            }
            return NextResponse.json({ success: true, campaignId: `preview-${Date.now()}`, sentPreviewTo: PREVIEW_EMAIL });
          }
          return NextResponse.json({ success: false, error: 'Draft creation failed and no preview email configured' }, { status: 500 });
        }
      }
    }

    if (sendDraft) {
      // For now we do not auto-send to all subscribers from the app; this should be done in ConvertKit.
      return NextResponse.json({ success: false, error: 'Direct send disabled. Please send from ConvertKit.' }, { status: 400 });
    }

    // Default: just return the content payload for UI usage
    return NextResponse.json({ success: true, subject, html });
  } catch (error) {
    console.error('Weekly agent POST error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

async function createConvertKitBroadcastDraft(params: { subject: string; html: string; apiSecret: string }): Promise<{ campaignId: string }> {
  // Best-effort draft creation; if ConvertKit API schema changes, we gracefully fail in caller
  const response = await fetch('https://api.convertkit.com/v3/broadcasts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_secret: params.apiSecret,
      subject: params.subject,
      content: params.html,
      published: false
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ConvertKit broadcast create failed: ${response.status} ${text}`);
  }
  const data = await response.json();
  const campaignId: string = data.broadcast?.id?.toString?.() || `ck-${Date.now()}`;
  return { campaignId };
}

async function sendPreviewEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { Resend } = await import('resend');
    const key = getEnv('RESEND_API_KEY', { requiredInProd: false });
    if (!key) return { success: false, error: 'RESEND_API_KEY not set' };
    const resend = new Resend(key);
    const from = getEnv('EMAIL_FROM', { requiredInProd: false }) || 'noreply@totalaudiopromo.com';
    await resend.emails.send({ from, to, subject, html });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Preview email failed' };
  }
}


