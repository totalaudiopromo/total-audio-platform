import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@total-audio/core-db/server';
import { z } from 'zod';
import { run as runPitchVariationSkill } from '@total-audio/agent-layer/skills/pitch-variation/run';

// Validation schema
const GeneratePitchVariationSchema = z.object({
  artistName: z.string().min(1),
  trackTitle: z.string().min(1),
  genre: z.string().optional(),
  targetContactType: z.enum(['radio', 'playlist', 'press', 'blog']).default('radio'),
  variationType: z.enum(['formal', 'casual', 'concise', 'detailed', 'follow-up']).default('formal'),
  contextInfo: z.string().optional(),
  streamingLinks: z
    .object({
      spotify: z.string().url().optional(),
      apple: z.string().url().optional(),
      bandcamp: z.string().url().optional(),
      soundcloud: z.string().url().optional(),
    })
    .optional(),
  previousCoverage: z.array(z.string()).optional(),
  saveToDB: z.boolean().default(true),
});

const GetPitchVariationsSchema = z.object({
  artistName: z.string().optional(),
  variationType: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

type GeneratePitchVariationInput = z.infer<typeof GeneratePitchVariationSchema>;

/**
 * POST /api/pitch/variations
 * Generate pitch variation using AI agent skill
 */
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const input = GeneratePitchVariationSchema.parse(body);

    // Invoke pitch variation skill
    const skillResult = await runPitchVariationSkill(
      {
        artistName: input.artistName,
        trackTitle: input.trackTitle,
        genre: input.genre,
        targetContactType: input.targetContactType,
        variationType: input.variationType,
        contextInfo: input.contextInfo,
        streamingLinks: input.streamingLinks,
        previousCoverage: input.previousCoverage,
      },
      {
        userId: user.id,
      }
    );

    if (!skillResult.success || !skillResult.data) {
      return NextResponse.json(
        {
          error: skillResult.error || 'Failed to generate pitch variation',
        },
        { status: 500 }
      );
    }

    const { subjectLine, body: pitchBody, variationType, generatedBy } = skillResult.data;

    // Optionally save to database
    let savedVariation = null;
    if (input.saveToDB) {
      const { data: variation, error: dbError } = await supabase
        .from('pitch_variations')
        .insert({
          user_id: user.id,
          variation_type: variationType,
          subject_line: subjectLine,
          body: pitchBody,
          generated_by: 'ai',
          generation_model: generatedBy,
          artist_name: input.artistName,
          track_title: input.trackTitle,
          genre: input.genre || null,
          target_contact_type: input.targetContactType,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error saving pitch variation:', dbError);
        // Non-fatal - continue with response
      } else {
        savedVariation = variation;
      }
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      variation: {
        subjectLine,
        body: pitchBody,
        variationType,
        generatedBy,
        id: savedVariation?.id || null,
      },
      metadata: {
        duration,
        tokensUsed: skillResult.metadata?.tokensUsed,
        model: skillResult.metadata?.model,
        saved: input.saveToDB && savedVariation !== null,
      },
    });
  } catch (error: any) {
    console.error('Pitch variation API error:', error);

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
 * GET /api/pitch/variations
 * Retrieve saved pitch variations
 */
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const artistName = searchParams.get('artistName');
    const variationType = searchParams.get('variationType');
    const limit = parseInt(searchParams.get('limit') || '20');

    const input = GetPitchVariationsSchema.parse({
      artistName: artistName || undefined,
      variationType: variationType || undefined,
      limit,
    });

    // Build query
    let query = supabase
      .from('pitch_variations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (input.artistName) {
      query = query.eq('artist_name', input.artistName);
    }

    if (input.variationType) {
      query = query.eq('variation_type', input.variationType);
    }

    query = query.limit(input.limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pitch variations:', error);
      return NextResponse.json({ error: 'Failed to fetch pitch variations' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      variations: data || [],
      total: data?.length || 0,
    });
  } catch (error: any) {
    console.error('Pitch variation GET error:', error);

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
 * PATCH /api/pitch/variations/:id
 * Update pitch variation (track usage, rating, etc.)
 */
export async function PATCH(req: NextRequest) {
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

    const body = await req.json();
    const { id, timesUsed, timesOpened, timesReplied, userRating } = body;

    if (!id) {
      return NextResponse.json({ error: 'Variation ID is required' }, { status: 400 });
    }

    // Build update object
    const updates: any = {};
    if (timesUsed !== undefined) updates.times_used = timesUsed;
    if (timesOpened !== undefined) updates.times_opened = timesOpened;
    if (timesReplied !== undefined) updates.times_replied = timesReplied;
    if (userRating !== undefined) updates.user_rating = userRating;

    // Calculate effectiveness score if we have usage data
    if (timesUsed !== undefined && (timesOpened !== undefined || timesReplied !== undefined)) {
      const openRate = timesOpened ? (timesOpened / Math.max(timesUsed, 1)) * 100 : 0;
      const replyRate = timesReplied ? (timesReplied / Math.max(timesUsed, 1)) * 100 : 0;
      updates.effectiveness_score = parseFloat(
        ((openRate * 0.4 + replyRate * 0.6) / 100).toFixed(2)
      );
    }

    const { data, error } = await supabase
      .from('pitch_variations')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pitch variation:', error);
      return NextResponse.json({ error: 'Failed to update pitch variation' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      variation: data,
    });
  } catch (error: any) {
    console.error('Pitch variation PATCH error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
