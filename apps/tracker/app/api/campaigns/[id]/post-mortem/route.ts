import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@total-audio/core-db/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

// Validation schema
const GeneratePostMortemSchema = z.object({
  campaignName: z.string().min(1),
  artistName: z.string().optional(),
  dateRangeStart: z.string().optional(),
  dateRangeEnd: z.string().optional(),
  campaignData: z.object({
    totalContactsReached: z.number().optional(),
    responseRate: z.number().optional(),
    successRate: z.number().optional(),
    avgResponseTimeHours: z.number().optional(),
    performanceByChannel: z.record(z.any()).optional(),
    performanceByGenre: z.record(z.any()).optional(),
    topPerformingPitches: z.array(z.any()).optional(),
    underperformingAreas: z.array(z.any()).optional(),
  }),
});

type GeneratePostMortemInput = z.infer<typeof GeneratePostMortemSchema>;

/**
 * POST /api/campaigns/[id]/post-mortem
 * Generate AI-powered campaign post-mortem analysis
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();

  try {
    const supabase = await createClient(cookies());

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: campaignId } = await params;
    const body = await req.json();
    const input = GeneratePostMortemSchema.parse(body);

    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Build AI prompt for post-mortem analysis
    const prompt = buildPostMortemPrompt(input);

    // Call Claude for analysis
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse AI response
    const analysis = parsePostMortemResponse(content.text);

    // Save to database
    const { data: postMortem, error: dbError } = await supabase
      .from('campaign_postmortems')
      .insert({
        user_id: user.id,
        campaign_id: campaignId,
        campaign_name: input.campaignName,
        artist_name: input.artistName || null,
        date_range_start: input.dateRangeStart || null,
        date_range_end: input.dateRangeEnd || null,
        executive_summary: analysis.executiveSummary,
        key_wins: analysis.keyWins,
        key_learnings: analysis.keyLearnings,
        improvement_recommendations: analysis.improvementRecommendations,
        total_contacts_reached: input.campaignData.totalContactsReached || null,
        response_rate: input.campaignData.responseRate || null,
        success_rate: input.campaignData.successRate || null,
        avg_response_time_hours:
          input.campaignData.avgResponseTimeHours || null,
        performance_by_channel: input.campaignData.performanceByChannel || null,
        performance_by_genre: input.campaignData.performanceByGenre || null,
        top_performing_pitches: input.campaignData.topPerformingPitches || null,
        underperforming_areas: input.campaignData.underperformingAreas || null,
        generated_by: 'ai',
        generation_model: 'claude-3-5-sonnet-20241022',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving post-mortem:', dbError);
      return NextResponse.json(
        { error: 'Failed to save post-mortem' },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      postMortem,
      metadata: {
        duration,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        model: 'claude-3-5-sonnet-20241022',
      },
    });
  } catch (error: any) {
    console.error('Campaign post-mortem API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/campaigns/[id]/post-mortem
 * Retrieve campaign post-mortem
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient(cookies());

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: campaignId } = await params;

    const { data, error } = await supabase
      .from('campaign_postmortems')
      .select('*')
      .eq('user_id', user.id)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          postMortem: null,
        });
      }

      console.error('Error fetching post-mortem:', error);
      return NextResponse.json(
        { error: 'Failed to fetch post-mortem' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      postMortem: data,
    });
  } catch (error: any) {
    console.error('Campaign post-mortem GET error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Build AI prompt for post-mortem analysis
 */
function buildPostMortemPrompt(input: GeneratePostMortemInput): string {
  const { campaignName, artistName, campaignData } = input;

  let prompt = `You are an expert music PR analyst creating a comprehensive campaign post-mortem for "${campaignName}"${artistName ? ` by ${artistName}` : ''}.

**Campaign Metrics:**
- Total Contacts Reached: ${campaignData.totalContactsReached || 'N/A'}
- Response Rate: ${campaignData.responseRate ? `${campaignData.responseRate}%` : 'N/A'}
- Success Rate: ${campaignData.successRate ? `${campaignData.successRate}%` : 'N/A'}
- Average Response Time: ${campaignData.avgResponseTimeHours ? `${campaignData.avgResponseTimeHours} hours` : 'N/A'}

`;

  if (campaignData.performanceByChannel) {
    prompt += `**Performance by Channel:**\n${JSON.stringify(campaignData.performanceByChannel, null, 2)}\n\n`;
  }

  if (campaignData.topPerformingPitches) {
    prompt += `**Top Performing Pitches:**\n${JSON.stringify(campaignData.topPerformingPitches, null, 2)}\n\n`;
  }

  if (campaignData.underperformingAreas) {
    prompt += `**Underperforming Areas:**\n${JSON.stringify(campaignData.underperformingAreas, null, 2)}\n\n`;
  }

  prompt += `**Your Task:**
Generate a professional, actionable campaign post-mortem with the following structure:

EXECUTIVE SUMMARY:
[2-3 sentences summarizing overall campaign performance and key takeaways]

KEY WINS:
- [Win 1]
- [Win 2]
- [Win 3]
(List 3-5 specific wins, successes, or highlights)

KEY LEARNINGS:
- [Learning 1]
- [Learning 2]
- [Learning 3]
(List 3-5 key learnings or insights from the campaign)

IMPROVEMENT RECOMMENDATIONS:
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]
(List 3-5 specific, actionable recommendations for future campaigns)

**Style Guide:**
- Professional but conversational UK English
- Focus on actionable insights, not just description
- Be honest about what worked and what didn't
- Reference specific metrics when available
- Provide practical recommendations

Generate the post-mortem analysis now:`;

  return prompt;
}

/**
 * Parse AI response into structured post-mortem data
 */
function parsePostMortemResponse(text: string): {
  executiveSummary: string;
  keyWins: string[];
  keyLearnings: string[];
  improvementRecommendations: string[];
} {
  const lines = text.split('\n');

  let section: 'summary' | 'wins' | 'learnings' | 'recommendations' | null =
    null;
  let executiveSummary = '';
  const keyWins: string[] = [];
  const keyLearnings: string[] = [];
  const improvementRecommendations: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('EXECUTIVE SUMMARY:')) {
      section = 'summary';
      continue;
    } else if (trimmed.startsWith('KEY WINS:')) {
      section = 'wins';
      continue;
    } else if (trimmed.startsWith('KEY LEARNINGS:')) {
      section = 'learnings';
      continue;
    } else if (trimmed.startsWith('IMPROVEMENT RECOMMENDATIONS:')) {
      section = 'recommendations';
      continue;
    }

    if (!trimmed || trimmed === '') continue;

    switch (section) {
      case 'summary':
        executiveSummary += trimmed + ' ';
        break;
      case 'wins':
        if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
          keyWins.push(
            trimmed.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')
          );
        }
        break;
      case 'learnings':
        if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
          keyLearnings.push(
            trimmed.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')
          );
        }
        break;
      case 'recommendations':
        if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
          improvementRecommendations.push(
            trimmed.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')
          );
        }
        break;
    }
  }

  return {
    executiveSummary: executiveSummary.trim(),
    keyWins,
    keyLearnings,
    improvementRecommendations,
  };
}
