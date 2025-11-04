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
    const { data: campaign, error: campaignError } = await (supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single() as any);

    if (campaignError || !campaign) {
      console.log('[Report Generation] Campaign not found:', campaignError);
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    const campaignData = campaign as any;
    console.log('[Report Generation] Campaign found:', campaignData.name);

    // Fetch campaign activities
    const { data: activities } = await (supabase
      .from('campaign_activities')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(20) as any);

    // Fetch report template (or use default)
    let template: {
      logo_url: string | undefined;
      brand_color: string;
      company_name: string | undefined;
      contact_email: string | undefined;
      contact_phone: string | undefined;
    } = {
      logo_url: undefined,
      brand_color: '#6366f1',
      company_name: undefined,
      contact_email: undefined,
      contact_phone: undefined,
    };

    if (templateId) {
      const { data: templateData } = await (supabase
        .from('report_templates')
        .select('*')
        .eq('id', templateId)
        .eq('user_id', user.id)
        .single() as any);

      if (templateData) {
        template = {
          logo_url: templateData.logo_url || undefined,
          brand_color: templateData.brand_color || '#6366f1',
          company_name: templateData.company_name || undefined,
          contact_email: templateData.contact_email || undefined,
          contact_phone: templateData.contact_phone || undefined,
        };
      }
    } else {
      // Try to get default template
      const { data: defaultTemplate } = await (supabase
        .from('report_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single() as any);

      if (defaultTemplate) {
        template = {
          logo_url: defaultTemplate.logo_url || undefined,
          brand_color: defaultTemplate.brand_color || '#6366f1',
          company_name: defaultTemplate.company_name || undefined,
          contact_email: defaultTemplate.contact_email || undefined,
          contact_phone: defaultTemplate.contact_phone || undefined,
        };
      }
    }

    // Calculate metrics
    const metrics = {
      response_rate:
        campaignData.actual_reach && campaignData.target_reach
          ? campaignData.actual_reach / campaignData.target_reach
          : 0,
      cost_per_result:
        campaignData.budget && campaignData.actual_reach
          ? campaignData.budget / campaignData.actual_reach
          : 0,
      days_active: campaignData.end_date
        ? Math.ceil(
            (new Date(campaignData.end_date).getTime() -
              new Date(campaignData.start_date).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : Math.ceil(
            (Date.now() - new Date(campaignData.start_date).getTime()) /
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

Campaign: ${campaignData.name || 'Not specified'}
Artist: ${campaignData.artist_name || 'Not specified'}
Platform: ${campaignData.platform || 'Not specified'}
Target Reach: ${campaignData.target_reach || 'Not set'}
Actual Reach: ${campaignData.actual_reach || 'Not yet measured'}
Budget: £${campaignData.budget || 0}
Success Rate: ${(metrics.response_rate * 100).toFixed(0)}%
Cost Per Result: £${metrics.cost_per_result.toFixed(2)}
Duration: ${metrics.days_active} days
Status: ${campaignData.status || 'Not specified'}

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
        executiveSummary = `This ${campaignData.platform || 'music promotion'} campaign for ${campaignData.artist_name || 'artist'} achieved ${campaignData.actual_reach || 0} of ${campaignData.target_reach || 0} targeted contacts (${(metrics.response_rate * 100).toFixed(0)}% success rate). The campaign ran for ${metrics.days_active} days with a total budget of £${campaignData.budget || 0}, resulting in a cost per result of £${metrics.cost_per_result.toFixed(2)}.`;
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
      campaign: campaignData,
      template,
      executiveSummary,
      activities:
        (activities as any[])?.map((a: any) => ({
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
    const filename = `campaign-report-${(campaignData.name || 'campaign').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
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
        start_date: startDate || campaignData.start_date,
        end_date:
          endDate ||
          campaignData.end_date ||
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
