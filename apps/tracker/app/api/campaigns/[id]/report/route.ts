/**
 * Campaign Report Generation API
 * POST /api/campaigns/[id]/report
 * Generates PDF report with AI executive summary
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import {
  generateCampaignReportPDF,
  type ReportData,
} from '@/components/reports/pdf-generator';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60; // 60 seconds for AI generation

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[Report Generation] Starting report generation');
    const { id: campaignId } = await params;
    console.log('[Report Generation] Campaign ID:', campaignId);

    const supabase = await createServerClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.log('[Report Generation] No user authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[Report Generation] User:', user.id);

    const body = await request.json();
    const { reportType = 'custom', startDate, endDate, templateId } = body;
    console.log('[Report Generation] Request body:', {
      reportType,
      startDate,
      endDate,
      templateId,
    });

    // Fetch campaign data
    console.log('[Report Generation] Fetching campaign data...');
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      console.log('[Report Generation] Campaign not found:', campaignError);
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    console.log('[Report Generation] Campaign found:', campaign.name);

    // Fetch campaign activities
    const { data: activities } = await supabase
      .from('campaign_activities')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Fetch report template (or use default)
    let template = {
      logo_url: undefined as string | undefined,
      brand_color: '#6366f1',
      company_name: undefined as string | undefined,
      contact_email: undefined as string | undefined,
      contact_phone: undefined as string | undefined,
    };

    if (templateId) {
      const { data: templateData } = await supabase
        .from('report_templates')
        .select('*')
        .eq('id', templateId)
        .eq('user_id', user.id)
        .single();

      if (templateData) {
        template = templateData;
      }
    } else {
      // Try to get default template
      const { data: defaultTemplate } = await supabase
        .from('report_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();

      if (defaultTemplate) {
        template = defaultTemplate;
      }
    }

    // Calculate metrics
    const metrics = {
      response_rate:
        campaign.actual_reach && campaign.target_reach
          ? campaign.actual_reach / campaign.target_reach
          : 0,
      cost_per_result:
        campaign.budget && campaign.actual_reach
          ? campaign.budget / campaign.actual_reach
          : 0,
      days_active: campaign.end_date
        ? Math.ceil(
            (new Date(campaign.end_date).getTime() -
              new Date(campaign.start_date).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : Math.ceil(
            (Date.now() - new Date(campaign.start_date).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
    };

    // Generate AI Executive Summary
    console.log('[Report Generation] Generating AI executive summary...');
    let executiveSummary = '';
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        console.log('[Report Generation] Anthropic API key found');
        const anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: `Generate a professional 3-paragraph executive summary for this music promotion campaign report:

Campaign: ${campaign.name}
Artist: ${campaign.artist_name}
Platform: ${campaign.platform}
Target Reach: ${campaign.target_reach}
Actual Reach: ${campaign.actual_reach}
Budget: £${campaign.budget}
Success Rate: ${(metrics.response_rate * 100).toFixed(0)}%
Cost Per Result: £${metrics.cost_per_result.toFixed(2)}
Duration: ${metrics.days_active} days
Status: ${campaign.status}

Write it in UK English, professional but not corporate. Focus on results, insights, and recommendations. Keep it under 250 words.`,
            },
          ],
        });

        const content = message.content[0];
        if (content.type === 'text') {
          executiveSummary = content.text;
          console.log('[Report Generation] AI summary generated successfully');
        }
      } catch (aiError: any) {
        console.error(
          '[Report Generation] AI summary generation failed:',
          aiError?.message || aiError
        );
        // Fallback to basic summary
        executiveSummary = `This ${campaign.platform} campaign for ${campaign.artist_name} achieved ${campaign.actual_reach || 0} of ${campaign.target_reach || 0} targeted contacts (${(metrics.response_rate * 100).toFixed(0)}% success rate). The campaign ran for ${metrics.days_active} days with a total budget of £${campaign.budget || 0}, resulting in a cost per result of £${metrics.cost_per_result.toFixed(2)}.`;
        console.log('[Report Generation] Using fallback summary');
      }
    } else {
      console.log(
        '[Report Generation] No Anthropic API key, skipping AI summary'
      );
    }

    // Prepare report data
    console.log('[Report Generation] Preparing report data...');
    const reportData: ReportData = {
      campaign,
      template,
      executiveSummary,
      activities:
        activities?.map(a => ({
          type: a.type,
          description: a.description,
          created_at: a.created_at,
        })) || [],
      metrics,
    };

    // Generate PDF
    console.log('[Report Generation] Generating PDF...');
    const pdfBlob = await generateCampaignReportPDF(reportData);
    console.log('[Report Generation] PDF generated, converting to buffer...');
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
    const pdfBase64 = pdfBuffer.toString('base64');
    console.log(
      '[Report Generation] PDF buffer created, size:',
      pdfBuffer.length
    );

    // Generate filename
    const filename = `campaign-report-${campaign.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    console.log('[Report Generation] Filename:', filename);

    // Save report record to database
    console.log('[Report Generation] Saving report record to database...');
    const { data: reportRecord, error: reportError } = await supabase
      .from('campaign_reports')
      .insert({
        campaign_id: campaignId,
        user_id: user.id,
        template_id: templateId || null,
        report_type: reportType,
        start_date: startDate || campaign.start_date,
        end_date:
          endDate ||
          campaign.end_date ||
          new Date().toISOString().split('T')[0],
        pdf_filename: filename,
        executive_summary: executiveSummary,
        metadata: {
          metrics,
          generated_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (reportError) {
      console.error('[Report Generation] Error saving report:', reportError);
    } else {
      console.log('[Report Generation] Report record saved:', reportRecord?.id);
    }

    // Return PDF as downloadable file
    console.log('[Report Generation] Returning PDF response...');
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Report-ID': reportRecord?.id || 'unknown',
      },
    });
  } catch (error: any) {
    console.error('[Report Generation] FATAL ERROR:', error);
    console.error('[Report Generation] Error stack:', error?.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
