import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch campaign activities with campaign info
    const { data: activities, error: activitiesError } = await supabase
      .from('campaign_activities')
      .select(
        `
        id,
        activity_type,
        description,
        timestamp,
        importance,
        contact_name,
        contact_org,
        platform,
        metric,
        value,
        campaign_id,
        campaigns!inner(id, title, user_id, status)
      `
      )
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }

    // Type for the joined campaign data (inner join returns single object)
    type CampaignJoin = { id: string; title: string; user_id: string; status: string };

    // Filter to user's campaigns only and transform
    const transformedActivities = activities
      ?.filter(a => {
        const campaign = a.campaigns as unknown as CampaignJoin | null;
        return campaign?.user_id === user.id;
      })
      .map(a => {
        const campaign = a.campaigns as unknown as CampaignJoin;
        return {
          id: a.id,
          type: a.activity_type,
          title: a.description,
          timestamp: a.timestamp,
          importance: a.importance,
          contactName: a.contact_name,
          contactOrg: a.contact_org,
          platform: a.platform,
          metric: a.metric,
          value: a.value,
          campaign: {
            id: a.campaign_id,
            title: campaign?.title,
            status: campaign?.status,
          },
        };
      });

    // Get total count for pagination
    const { count } = await supabase
      .from('campaign_activities')
      .select('id', { count: 'exact', head: true })
      .in(
        'campaign_id',
        (await supabase.from('campaigns').select('id').eq('user_id', user.id)).data?.map(
          c => c.id
        ) || []
      );

    return NextResponse.json({
      activities: transformedActivities || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error('Activities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
