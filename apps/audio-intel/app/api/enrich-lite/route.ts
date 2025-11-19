import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

// Validation schema
const EnrichLiteSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  sessionId: z.string(),
});

type EnrichLiteInput = z.infer<typeof EnrichLiteSchema>;

/**
 * POST /api/enrich-lite
 * Lightweight enrichment endpoint for Quick Intel Widget
 * Limited to 3 enrichments per session
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const supabase = await createClient();
    const body = await req.json();
    const input = EnrichLiteSchema.parse(body);

    // Check widget usage limits
    const { data: widgetUsage, error: usageError } = await supabase
      .from('widget_usage')
      .select('*')
      .eq('widget_session_id', input.sessionId)
      .single();

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('Error checking widget usage:', usageError);
      // Continue - create new usage record
    }

    let currentUsage = widgetUsage;

    if (!currentUsage) {
      // Create new widget usage record
      const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
      const userAgent = req.headers.get('user-agent');
      const referrer = req.headers.get('referer');

      const { data: newUsage, error: createError } = await supabase
        .from('widget_usage')
        .insert({
          widget_session_id: input.sessionId,
          ip_address: ipAddress,
          user_agent: userAgent,
          referrer_url: referrer,
          enrichments_used: 0,
          enrichments_limit: 3,
          widget_version: '1.0.0',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating widget usage:', createError);
        return NextResponse.json({ error: 'Failed to track widget usage' }, { status: 500 });
      }

      currentUsage = newUsage;
    }

    // Check if limit exceeded
    if (currentUsage.enrichments_used >= currentUsage.enrichments_limit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Free enrichment limit reached',
          limitReached: true,
          upgradeUrl: '/pricing',
        },
        { status: 429 }
      );
    }

    // Perform lightweight enrichment
    const enriched = await performLiteEnrichment(input.email, input.name);

    // Update widget usage
    await supabase
      .from('widget_usage')
      .update({
        enrichments_used: currentUsage.enrichments_used + 1,
        last_enrichment_at: new Date().toISOString(),
      })
      .eq('widget_session_id', input.sessionId);

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      enriched,
      enrichmentsRemaining: currentUsage.enrichments_limit - currentUsage.enrichments_used - 1,
      metadata: {
        duration,
      },
    });
  } catch (error: any) {
    console.error('Enrich-lite API error:', error);

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
 * Perform lightweight contact enrichment using Claude
 */
async function performLiteEnrichment(email: string, name?: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Fallback to basic enrichment
    return {
      email,
      name: name || email.split('@')[0],
      contactIntelligence: `Contact: ${name || email}\nEmail: ${email}\n\nBasic contact information. Upgrade to Audio Intel PRO for full enrichment with detailed intelligence.`,
      researchConfidence: 'Low',
      lastResearched: new Date().toISOString(),
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const prompt = `Research this music industry contact: ${name || email} (${email}).

Provide a brief summary (max 150 words) including:
1. Platform/Station name (if identifiable)
2. Role/Focus area
3. Location/Coverage area
4. Best contact method

Format as:
🎵 [Platform/Station] | [Role/Focus]
📍 [Location/Coverage]
📧 [Contact method]
💡 [One key tip for pitching]

Keep it concise and professional. UK English.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022', // Faster, cheaper model for widget
      max_tokens: 300,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    const intelligence = content.type === 'text' ? content.text : '';

    return {
      email,
      name: name || email.split('@')[0],
      contactIntelligence: intelligence || 'Unable to enrich contact',
      researchConfidence: intelligence ? 'Medium' : 'Low',
      lastResearched: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Claude enrichment error:', error);

    // Fallback
    return {
      email,
      name: name || email.split('@')[0],
      contactIntelligence: `Contact: ${name || email}\nEmail: ${email}\n\nEnrichment temporarily unavailable. Please try again.`,
      researchConfidence: 'Low',
      lastResearched: new Date().toISOString(),
    };
  }
}
