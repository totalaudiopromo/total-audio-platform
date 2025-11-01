import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createClient } from '@total-audio/core-db/server';

// Usage limits by tier
const USAGE_LIMITS = {
  free: 5,
  professional: Infinity,
  bundle: Infinity,
  agency: Infinity,
} as const;

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();

    // Get user's subscription tier from profiles or subscriptions table
    // For now, assume free tier unless otherwise specified
    // TODO: Replace with actual subscription check
    const userTier: 'free' | 'professional' | 'bundle' | 'agency' = 'free';

    // Get current month's pitch count
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: pitches, error } = await supabase
      .from('pitches')
      .select('id')
      .eq('user_id', token.sub)
      .gte('created_at', startOfMonth.toISOString());

    if (error) {
      console.error('Error fetching pitches:', error);
      return NextResponse.json(
        { error: 'Failed to fetch usage data' },
        { status: 500 }
      );
    }

    const currentUsage = pitches?.length || 0;
    const limit = USAGE_LIMITS[userTier];
    const percentageUsed = limit === Infinity ? 0 : (currentUsage / limit) * 100;

    return NextResponse.json({
      currentUsage,
      limit,
      tier: userTier,
      percentageUsed: Math.round(percentageUsed),
      resetDate: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1).toISOString(),
    });
  } catch (error) {
    console.error('Error in usage API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
