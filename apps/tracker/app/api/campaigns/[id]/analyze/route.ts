import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Initialize Anthropic client at runtime
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get campaign data
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get user's Spotify data if connected (we'll add this later)
    // For now, use campaign data only

    // Build comprehensive analysis prompt
    const analysisPrompt = `You are an expert music industry consultant analyzing a campaign for an independent artist. Provide a comprehensive, actionable analysis.

CAMPAIGN DETAILS:
- Campaign Name: ${campaign.name}
- Artist: ${campaign.artist_name}
- Platform/Target: ${campaign.platform || 'Not specified'}
- Genre: ${campaign.genre || 'Not specified'}
- Budget: £${campaign.budget}
- Target Reach: ${campaign.target_reach}
- Actual Reach: ${campaign.actual_reach}
- Success Rate: ${campaign.success_rate}%
- Cost Per Result: £${campaign.cost_per_result}
- Start Date: ${campaign.start_date}
- Status: ${campaign.status}

ANALYZE THIS CAMPAIGN AND PROVIDE:

1. **CAMPAIGN AUTOPSY** - What worked and what didn't
   - List 3-5 specific things that worked well
   - List 3-5 specific things that didn't work or could improve
   - Use real UK music industry knowledge (BBC Radio, Spotify UK playlists, etc.)

2. **YOUR NEXT MOVE** - Exactly what to do next
   - Recommend ONE specific next action (be specific - name the playlist/radio station/platform)
   - Explain why this makes sense based on their results
   - Give a confidence score (%) for success
   - Draft a pitch email/message template they can use
   - Suggest best timing (day/time to send)

3. **BRUTAL HONESTY** - Reality check
   - Is their next goal realistic? (be honest)
   - What are they missing to reach that goal?
   - Give a realistic timeline (weeks/months)
   - Provide milestone checklist

4. **QUICK WINS** - 3 things they can do THIS WEEK
   - Must be actionable, specific, and achievable in 7 days
   - Estimate time/cost for each

Format your response as a friendly, honest music industry insider. Use British spelling and UK context. Be encouraging but realistic. Focus on actionable advice over theory.

IMPORTANT:
- If budget is under £100, acknowledge they're on a tight budget and give low/no-cost suggestions
- If actual_reach is 0, address why and what to do differently
- If success_rate is high, celebrate it but push them to level up
- Reference real UK music industry targets (BBC Radio 1, Amazing Radio, Spotify UK playlists, etc.)`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
    });

    const analysis = message.content[0].type === 'text' ? message.content[0].text : '';

    // Store analysis in database for future reference
    await supabase
      .from('campaign_insights')
      .upsert({
        campaign_id: campaign.id,
        type: 'ai_analysis',
        content: analysis,
        generated_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      analysis,
      campaign: {
        name: campaign.name,
        artist: campaign.artist_name,
        platform: campaign.platform,
        budget: campaign.budget,
        success_rate: campaign.success_rate,
      },
    });
  } catch (error: any) {
    console.error('Campaign analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
