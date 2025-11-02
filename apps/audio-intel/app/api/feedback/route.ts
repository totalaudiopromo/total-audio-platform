import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface FeedbackRequest {
  app: string;
  agentId?: string;
  rating: number;
  comment?: string;
}

/**
 * POST /api/feedback
 *
 * Submits user feedback to the feedback_events table.
 * Requires authenticated user session.
 *
 * Request body:
 * {
 *   "app": "audio-intel",
 *   "agentId": "contact-enrichment" (optional),
 *   "rating": 5,
 *   "comment": "Great feature!" (optional)
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "feedbackId": "123"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from session
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    // Extract JWT token from Authorization header
    const token = authHeader.replace('Bearer ', '');

    // Verify user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: FeedbackRequest = await request.json();

    // Validate required fields
    if (!body.app || typeof body.rating !== 'number') {
      return NextResponse.json({ error: 'Missing required fields: app, rating' }, { status: 400 });
    }

    // Validate rating is between 1-5
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Insert feedback into database
    const { data: feedback, error: insertError } = await supabase
      .from('feedback_events')
      .insert({
        user_id: user.id,
        app: body.app,
        agent_id: body.agentId || null,
        rating: body.rating,
        comment: body.comment || null,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Failed to insert feedback:', insertError);
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
    });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/feedback
 *
 * Retrieves user's own feedback history (last 30 days).
 * Requires authenticated user session.
 *
 * Response:
 * {
 *   "feedback": [
 *     {
 *       "id": "123",
 *       "app": "audio-intel",
 *       "agentId": "contact-enrichment",
 *       "rating": 5,
 *       "comment": "Great!",
 *       "createdAt": "2025-11-09T10:00:00Z"
 *     }
 *   ]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from session
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    // Extract JWT token from Authorization header
    const token = authHeader.replace('Bearer ', '');

    // Verify user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's feedback from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const { data: feedback, error: fetchError } = await supabase
      .from('feedback_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Failed to fetch feedback:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }

    // Transform to camelCase for response
    const transformedFeedback = (feedback || []).map(item => ({
      id: item.id,
      app: item.app,
      agentId: item.agent_id,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at,
    }));

    return NextResponse.json({
      feedback: transformedFeedback,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
