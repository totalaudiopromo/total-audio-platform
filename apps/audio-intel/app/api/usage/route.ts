import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerClient(cookies());

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's usage data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('enrichments_used, enrichments_limit, subscription_tier, beta_access')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ error: 'Failed to fetch usage data' }, { status: 500 });
    }

    const limit = userData.enrichments_limit || 10; // Default to free tier limit
    const used = userData.enrichments_used || 0;

    return NextResponse.json({
      success: true,
      usage: {
        used,
        limit,
        remaining: limit - used,
        percentage: (used / limit) * 100,
        tier: userData.subscription_tier,
        betaAccess: userData.beta_access,
      },
    });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient(cookies());

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contactsCount, status = 'success', errorMessage, apiTokensUsed, apiCostCents } = body;

    if (!contactsCount || contactsCount < 1) {
      return NextResponse.json({ error: 'Invalid contacts count' }, { status: 400 });
    }

    // Get current usage
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('enrichments_used, enrichments_limit')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const currentUsed = userData.enrichments_used || 0;
    const currentLimit = userData.enrichments_limit || 10;

    // Check if user has exceeded limit
    if (currentUsed >= currentLimit) {
      return NextResponse.json(
        {
          error: 'Enrichment limit reached',
          limitReached: true,
          used: currentUsed,
          limit: currentLimit,
        },
        { status: 429 }
      );
    }

    // Increment usage count
    const updateResult: any = await supabase
      .from('users')
      .update({
        enrichments_used: currentUsed + contactsCount,
      })
      .eq('id', user.id);
    const { error: updateError } = updateResult;

    if (updateError) {
      console.error('Error updating usage:', updateError);
      return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 });
    }

    // Log the enrichment
    const insertResult: any = await supabase.from('enrichment_logs').insert({
      user_id: user.id,
      contacts_count: contactsCount,
      status,
      error_message: errorMessage,
      api_tokens_used: apiTokensUsed,
      api_cost_cents: apiCostCents,
    });
    const { error: logError } = insertResult;

    if (logError) {
      console.error('Error logging enrichment:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      usage: {
        used: currentUsed + contactsCount,
        limit: currentLimit,
        remaining: currentLimit - (currentUsed + contactsCount),
      },
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
