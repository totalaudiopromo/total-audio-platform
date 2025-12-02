import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { generateNavigatorAnswer } from '@total-audio/intelligence-navigator';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Build fusion context with user's data
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Generate answer using Claude with full context
    const answer = await generateNavigatorAnswer({
      question,
      context: fusionContext,
      userId: user.id,
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Navigator error:', error);
    return NextResponse.json(
      {
        answer: 'Sorry, I encountered an error processing your question. Please try again.',
        evidence: [],
        deepLinks: [],
        recommendedActions: [],
        confidence: 0,
      },
      { status: 500 }
    );
  }
}
