// ============================================================================
// CAMPAIGN AUTOPSY API - AI-Powered Campaign Analysis
// Uses Anthropic Claude to generate brutally honest campaign feedback
// ============================================================================

import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Helper function to extract markdown sections
function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`## ${sectionName}\\n([\\s\\S]*?)(?=##|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

// ============================================================================
// GET /api/campaigns/[id]/autopsy - Fetch existing autopsy
// ============================================================================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch existing autopsy
  const { data: intelligence, error } = await supabase
    .from('campaign_intelligence')
    .select('*')
    .eq('campaign_id', resolvedParams.id)
    .eq('user_id', user.id)
    .single();

  if (error || !intelligence) {
    return NextResponse.json({ autopsy: null });
  }

  return NextResponse.json({
    autopsy: {
      autopsy: intelligence.autopsy_text,
      nextMove: intelligence.next_move,
      brutalHonesty: intelligence.brutal_honesty,
      quickWins: intelligence.quick_wins,
    },
    generated_at: intelligence.generated_at,
  });
}

// ============================================================================
// POST /api/campaigns/[id]/autopsy - Generate AI autopsy
// ============================================================================
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch campaign data
  const { data: campaign, error: campaignError } = await (supabase
    .from('campaigns')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('user_id', user.id)
    .single() as any);

  if (campaignError || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  // Fetch relevant industry benchmark
  let benchmark: any = null;
  const campaignData = campaign as any;
  if (campaignData.platform && campaignData.genre) {
    const { data } = await (supabase
      .from('benchmarks')
      .select('*')
      .eq('platform', campaignData.platform)
      .eq('genre', campaignData.genre)
      .single() as any);
    benchmark = data;
  }

  // Build AI prompt
  const hasResults =
    (campaignData.actual_reach || 0) > 0 &&
    (campaignData.target_reach || 0) > 0;

  const prompt = `You are analyzing a UK music promotion campaign. Be brutally honest, specific, and actionable. Use UK spelling and music industry terminology.

CAMPAIGN DATA:
- Name: ${campaignData.name || 'Not specified'}
- Artist: ${campaignData.artist_name || 'Not specified'}
- Platform: ${campaignData.platform || 'Not specified'}
- Genre: ${campaignData.genre || 'Not specified'}
- Budget: £${campaignData.budget || 0}
- Target Reach: ${campaignData.target_reach || 'Not set'}
- Actual Reach: ${campaignData.actual_reach || 'Not yet measured'}
- Success Rate: ${
    campaignData.success_rate
      ? Math.round(campaignData.success_rate) + '%'
      : 'Not calculated'
  }
- Cost Per Result: ${
    campaignData.cost_per_result
      ? '£' + Math.round(campaignData.cost_per_result)
      : 'TBD'
  }
- Status: ${campaignData.status || 'Not specified'}
- Dates: ${campaignData.start_date || 'Not set'} to ${
    campaignData.end_date || 'ongoing'
  }

${
  benchmark
    ? `INDUSTRY BENCHMARKS FOR ${campaignData.platform} - ${campaignData.genre}:
- Average Success Rate: ${benchmark.avg_success_rate}%
- Average Cost Per Result: £${Math.round(benchmark.avg_cost_per_result)}
- Optimal Budget Range: £${benchmark.optimal_budget_min}-£${
        benchmark.optimal_budget_max
      }
- Best Submission Day: ${benchmark.best_day}
- Best Month: ${benchmark.best_month}
- Sample Size: ${benchmark.sample_size} campaigns`
    : 'INDUSTRY BENCHMARKS: Not available for this platform/genre combination'
}

CAMPAIGN NOTES:
${campaignData.notes || 'No additional notes provided'}

${
  hasResults
    ? `This campaign has RESULTS to analyze. Compare actual performance vs targets and benchmarks.`
    : `This campaign is PLANNING/IN PROGRESS - provide predictive guidance based on the setup.`
}

Provide analysis in this EXACT format:

## CAMPAIGN AUTOPSY
[2-3 sentences: What specifically worked, what didn't, and why. Reference actual numbers and benchmarks if available. For in-progress campaigns, assess the setup. Be direct and honest.]

## YOUR NEXT MOVE
[One specific action to take this week. If the campaign involves radio/press/playlists and could benefit from a pitch, include a short draft template. Be actionable and specific.]

## BRUTAL HONESTY
[2-3 sentences: Reality check with no sugar coating. For completed campaigns, what should have been done differently. For active campaigns, what's likely to happen. Include realistic timelines.]

## QUICK WINS
• [First specific actionable task for this week]
• [Second specific actionable task for this week]
• [Third specific actionable task for this week]

Use UK spelling, music industry terminology (BBC Radio 1, 6Music, playlisting, daytime rotation, etc.), and be conversational but professional. No corporate bullshit. Be genuinely helpful.`;

  try {
    console.log('Calling Claude API for campaign:', resolvedParams.id);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const autopsyText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    console.log('Claude response received, length:', autopsyText.length);

    // Parse response sections
    const sections = {
      autopsy: extractSection(autopsyText, 'CAMPAIGN AUTOPSY'),
      nextMove: extractSection(autopsyText, 'YOUR NEXT MOVE'),
      brutalHonesty: extractSection(autopsyText, 'BRUTAL HONESTY'),
      quickWins: extractSection(autopsyText, 'QUICK WINS'),
    };

    // Store in database (upsert - update if exists, insert if not)
    const { error: saveError } = await supabase
      .from('campaign_intelligence')
      .upsert(
        {
          campaign_id: resolvedParams.id,
          user_id: user.id,
          autopsy_text: sections.autopsy,
          next_move: sections.nextMove,
          brutal_honesty: sections.brutalHonesty,
          quick_wins: sections.quickWins,
          full_response: autopsyText,
          generated_at: new Date().toISOString(),
          model_used: 'claude-sonnet-4-20250514',
        },
        {
          onConflict: 'campaign_id',
        }
      );

    if (saveError) {
      console.error('Failed to save autopsy:', saveError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      autopsy: sections,
      raw: autopsyText,
      generated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate autopsy',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
