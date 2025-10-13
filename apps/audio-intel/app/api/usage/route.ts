import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's usage data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('enrichments_used, enrichments_limit, subscription_tier, beta_access')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return NextResponse.json({ error: 'Failed to fetch usage data' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      usage: {
        used: userData.enrichments_used,
        limit: userData.enrichments_limit,
        remaining: userData.enrichments_limit - userData.enrichments_used,
        percentage: (userData.enrichments_used / userData.enrichments_limit) * 100,
        tier: userData.subscription_tier,
        betaAccess: userData.beta_access,
      },
    })
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contactsCount, status = 'success', errorMessage, apiTokensUsed, apiCostCents } = body

    if (!contactsCount || contactsCount < 1) {
      return NextResponse.json({ error: 'Invalid contacts count' }, { status: 400 })
    }

    // Get current usage
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('enrichments_used, enrichments_limit')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching user data:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    // Check if user has exceeded limit
    if (userData.enrichments_used >= userData.enrichments_limit) {
      return NextResponse.json({
        error: 'Enrichment limit reached',
        limitReached: true,
        used: userData.enrichments_used,
        limit: userData.enrichments_limit,
      }, { status: 429 })
    }

    // Increment usage count
    const { error: updateError } = await supabase
      .from('users')
      .update({
        enrichments_used: userData.enrichments_used + contactsCount,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating usage:', updateError)
      return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 })
    }

    // Log the enrichment
    const { error: logError } = await supabase
      .from('enrichment_logs')
      .insert({
        user_id: user.id,
        contacts_count: contactsCount,
        status,
        error_message: errorMessage,
        api_tokens_used: apiTokensUsed,
        api_cost_cents: apiCostCents,
      })

    if (logError) {
      console.error('Error logging enrichment:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      usage: {
        used: userData.enrichments_used + contactsCount,
        limit: userData.enrichments_limit,
        remaining: userData.enrichments_limit - (userData.enrichments_used + contactsCount),
      },
    })
  } catch (error) {
    console.error('Usage tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
