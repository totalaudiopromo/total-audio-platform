import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { campaignIds } = await request.json();

    if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid campaign IDs' },
        { status: 400 }
      );
    }

    // Delete campaigns (only user's own campaigns)
    const { error: deleteError } = await supabase
      .from('campaigns')
      .delete()
      .in('id', campaignIds)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Bulk delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete campaigns' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedCount: campaignIds.length,
    });
  } catch (error) {
    console.error('Bulk delete route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
