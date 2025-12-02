/**
 * Perplexity-Powered News Research API
 *
 * POST /api/newsjacking/research
 *
 * Uses Perplexity MCP to do deep research on music industry topics
 * for newsjacking opportunities and content generation.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ResearchRequest {
  topic: string;
  depth?: 'quick' | 'standard' | 'deep';
  focusAreas?: string[];
}

interface ResearchResult {
  topic: string;
  summary: string;
  keyInsights: string[];
  audioIntelAngles: string[];
  contentIdeas: {
    twitter: string[];
    linkedin: string;
    newsletter: string;
  };
  sources: string[];
  timestamp: string;
}

// Music industry research prompts tailored for Audio Intel
const RESEARCH_PROMPTS = {
  quick: (topic: string) => `
    Summarise the latest news about "${topic}" in the music industry.
    Focus on:
    - What's happening right now
    - Why it matters for independent artists
    - Any contact/networking opportunities
    Keep it concise - 2-3 key points.
  `,
  standard: (topic: string, focusAreas?: string[]) => `
    Research "${topic}" in the context of the UK music industry.

    Focus areas: ${focusAreas?.join(', ') || 'radio promotion, playlist pitching, contact discovery'}

    Provide:
    1. Current state of affairs (what's happening)
    2. Key players and gatekeepers involved
    3. Opportunities for independent artists
    4. Actionable advice for artists using contact intelligence tools
    5. Any upcoming changes or trends to watch

    Be specific about UK radio stations, labels, and industry contacts where relevant.
  `,
  deep: (topic: string, focusAreas?: string[]) => `
    Conduct in-depth research on "${topic}" for the UK music industry.

    Focus areas: ${focusAreas?.join(', ') || 'radio promotion, playlist curation, industry contacts, independent artist strategy'}

    I need:
    1. Comprehensive overview of the current landscape
    2. Key industry players, gatekeepers, and decision-makers
    3. Recent changes or announcements (last 30 days)
    4. Emerging opportunities for independent artists
    5. Contact discovery angles - who should artists be reaching out to?
    6. Competitive analysis - how are major labels approaching this?
    7. Actionable strategy for artists with contact enrichment tools
    8. UK-specific considerations (BBC Radio 6 Music, Radio 1, regional stations)

    This is for "The Unsigned Advantage" newsletter - focus on how nimble independents can leverage this better than major labels.
  `,
};

// Generate Audio Intel business angles from research
function generateAudioIntelAngles(summary: string, topic: string): string[] {
  const angles: string[] = [];
  const lowerSummary = summary.toLowerCase();
  const lowerTopic = topic.toLowerCase();

  // Contact discovery angles
  if (
    lowerSummary.includes('contact') ||
    lowerSummary.includes('reach out') ||
    lowerSummary.includes('networking')
  ) {
    angles.push(
      'Contact intelligence is key - Audio Intel users can identify decision-makers faster'
    );
  }

  // Radio/playlist angles
  if (
    lowerSummary.includes('radio') ||
    lowerSummary.includes('playlist') ||
    lowerTopic.includes('radio') ||
    lowerTopic.includes('playlist')
  ) {
    angles.push(
      'New gatekeepers emerging - Audio Intel keeps your contact database current with industry shifts'
    );
  }

  // Industry disruption angles
  if (
    lowerSummary.includes('change') ||
    lowerSummary.includes('new') ||
    lowerSummary.includes('launch') ||
    lowerSummary.includes('disrupt')
  ) {
    angles.push(
      'Industry disruption creates opportunities - indies with good contacts move faster than labels'
    );
  }

  // AI/tech angles
  if (
    lowerSummary.includes('ai') ||
    lowerSummary.includes('artificial intelligence') ||
    lowerSummary.includes('automation')
  ) {
    angles.push(
      'AI is changing the game - but human connections still matter. Audio Intel bridges both worlds'
    );
  }

  // Independent artist angles
  if (
    lowerSummary.includes('independent') ||
    lowerSummary.includes('indie') ||
    lowerSummary.includes('unsigned')
  ) {
    angles.push(
      'The unsigned advantage is real - nimble indies with good intel outpace major labels'
    );
  }

  // Default angle
  if (angles.length === 0) {
    angles.push(
      'Industry knowledge is power - Audio Intel turns research into actionable contacts'
    );
  }

  return angles;
}

// Generate content ideas from research
function generateContentIdeas(summary: string, topic: string): ResearchResult['contentIdeas'] {
  const truncatedTopic = topic.length > 50 ? topic.substring(0, 50) + '...' : topic;

  return {
    twitter: [
      `🧵 New intel on ${truncatedTopic} - here's what indies need to know:`,
      `While major labels are still in meetings about this, smart independents are already moving...`,
      `The unsigned advantage: when you can pivot faster than a label's legal team can read an email.`,
    ],
    linkedin: `Industry Intel: ${topic}\n\nThe music industry is shifting, and independent artists who understand the landscape have a genuine advantage.\n\n[Key insights from research here]\n\nFor artists using contact intelligence tools like Audio Intel, this creates new opportunities to connect with decision-makers who matter.\n\nWhat's your take on these changes?`,
    newsletter: `## This Week's Industry Intel: ${topic}\n\nRight, so whilst the industry press is covering this surface-level, here's what actually matters for independent artists...\n\n[Research summary here]\n\n**Your move:** [Actionable advice]\n\nThis is exactly why contact intelligence matters - the artists who know who to reach become the artists who get heard.`,
  };
}

/**
 * POST /api/newsjacking/research
 *
 * Conduct Perplexity-powered research on a topic
 */
export async function POST(request: NextRequest) {
  try {
    const body: ResearchRequest = await request.json();
    const { topic, depth = 'standard', focusAreas } = body;

    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 });
    }

    console.log(`[RESEARCH] Starting ${depth} research on: ${topic}`);

    // Build the research prompt
    let prompt: string;
    switch (depth) {
      case 'quick':
        prompt = RESEARCH_PROMPTS.quick(topic);
        break;
      case 'deep':
        prompt = RESEARCH_PROMPTS.deep(topic, focusAreas);
        break;
      default:
        prompt = RESEARCH_PROMPTS.standard(topic, focusAreas);
    }

    // For now, we'll simulate the Perplexity response since MCP tools
    // are invoked differently. In production, this would call the
    // Perplexity API directly or use server-side MCP invocation.
    //
    // The Command Centre UI can also call Perplexity MCP directly
    // from Claude Code sessions.

    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

    let summary: string;
    let sources: string[] = [];

    if (PERPLEXITY_API_KEY) {
      // Call Perplexity API directly
      console.log('[RESEARCH] Calling Perplexity API...');

      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: depth === 'deep' ? 'sonar-pro' : 'sonar',
          messages: [
            {
              role: 'system',
              content:
                'You are a music industry research assistant focused on the UK market. Provide actionable insights for independent artists and music promoters. Use British English spelling.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: depth === 'deep' ? 4000 : 2000,
        }),
      });

      if (perplexityResponse.ok) {
        const data = await perplexityResponse.json();
        summary = data.choices?.[0]?.message?.content || 'No response from Perplexity';

        // Extract citations if available
        if (data.citations) {
          sources = data.citations;
        }

        console.log('[RESEARCH] Perplexity response received');
      } else {
        const errorText = await perplexityResponse.text();
        console.error('[RESEARCH] Perplexity API error:', errorText);
        summary = `Research request submitted for: ${topic}. Perplexity API returned an error. Please try again or use Claude Code with Perplexity MCP for interactive research.`;
      }
    } else {
      // No API key - provide guidance
      console.log('[RESEARCH] No Perplexity API key - returning guidance');
      summary = `Research topic: ${topic}

To conduct deep research on this topic, you can:

1. Use Claude Code with Perplexity MCP:
   - mcp__perplexity__search for quick searches
   - mcp__perplexity__reason for complex analysis
   - mcp__perplexity__deep_research for comprehensive reports

2. Add PERPLEXITY_API_KEY to environment variables for direct API access

3. Check the RSS-based newsjacking monitor at /api/newsjacking/monitor for recent news

Focus areas for "${topic}":
${focusAreas?.map(area => `- ${area}`).join('\n') || '- Radio promotion\n- Playlist pitching\n- Industry contacts'}`;

      sources = [
        'https://intel.totalaudiopromo.com',
        'https://musicbusinessworldwide.com',
        'https://digitalmusicnews.com',
      ];
    }

    // Extract key insights from summary
    const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyInsights = sentences.slice(0, 5).map(s => s.trim());

    // Generate Audio Intel angles
    const audioIntelAngles = generateAudioIntelAngles(summary, topic);

    // Generate content ideas
    const contentIdeas = generateContentIdeas(summary, topic);

    const result: ResearchResult = {
      topic,
      summary,
      keyInsights,
      audioIntelAngles,
      contentIdeas,
      sources,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `[RESEARCH] Complete: ${keyInsights.length} insights, ${audioIntelAngles.length} angles`
    );

    return NextResponse.json({
      success: true,
      research: result,
      depth,
      hasPerplexityKey: !!PERPLEXITY_API_KEY,
    });
  } catch (error) {
    console.error('[RESEARCH] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Research failed',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/newsjacking/research
 *
 * Get suggested research topics based on current trends
 */
export async function GET() {
  const suggestedTopics = [
    {
      topic: 'UK radio playlist changes 2025',
      description: 'Latest changes to BBC Radio 1, Radio 2, and 6 Music playlist policies',
      depth: 'standard' as const,
      focusAreas: ['BBC Radio', 'playlist submission', 'independent artists'],
    },
    {
      topic: 'Spotify algorithmic playlist updates',
      description: 'How Spotify editorial and algorithmic playlists are evolving',
      depth: 'standard' as const,
      focusAreas: ['playlist pitching', 'algorithm changes', 'independent distribution'],
    },
    {
      topic: 'AI in music promotion',
      description: 'How AI tools are changing music marketing and promotion',
      depth: 'deep' as const,
      focusAreas: ['AI tools', 'automation', 'contact discovery', 'personalisation'],
    },
    {
      topic: 'Independent artist success stories UK',
      description: 'Recent UK indie artists breaking through without major label support',
      depth: 'quick' as const,
      focusAreas: ['case studies', 'strategy', 'networking'],
    },
    {
      topic: 'Music industry gatekeepers 2025',
      description: 'Who are the key decision-makers in UK music right now',
      depth: 'deep' as const,
      focusAreas: ['A&R', 'playlist curators', 'radio programmers', 'sync supervisors'],
    },
    {
      topic: 'TikTok music marketing trends',
      description: 'Latest TikTok strategies for music promotion',
      depth: 'quick' as const,
      focusAreas: ['viral strategies', 'algorithm', 'content creation'],
    },
  ];

  return NextResponse.json({
    success: true,
    suggestedTopics,
    note: 'POST to this endpoint with { topic, depth?, focusAreas? } to conduct research',
    depths: {
      quick: 'Fast summary, 2-3 key points',
      standard: 'Balanced research with actionable insights',
      deep: 'Comprehensive analysis with full strategy recommendations',
    },
  });
}
