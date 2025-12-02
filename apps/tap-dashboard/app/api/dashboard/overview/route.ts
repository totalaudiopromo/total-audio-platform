import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
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

    // Fetch campaign stats
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, title, status, created_at, performance_score, success_rate')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
    }

    // Fetch intel contacts count
    const { count: intelContactsCount, error: intelError } = await supabase
      .from('intel_contacts')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', user.id);

    if (intelError) {
      console.error('Error fetching intel contacts:', intelError);
    }

    // Fetch pitches stats
    const { data: pitches, error: pitchesError } = await supabase
      .from('pitches')
      .select('id, status, response_received, created_at')
      .eq('user_id', user.id);

    if (pitchesError) {
      console.error('Error fetching pitches:', pitchesError);
    }

    // Fetch recent campaign activities
    const { data: activities, error: activitiesError } = await supabase
      .from('campaign_activities')
      .select(
        `
        id,
        activity_type,
        description,
        timestamp,
        importance,
        campaign_id,
        campaigns!inner(title, user_id)
      `
      )
      .order('timestamp', { ascending: false })
      .limit(10);

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
    }

    // Calculate overview stats
    const totalCampaigns = campaigns?.length || 0;
    const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
    const avgPerformance =
      (campaigns?.reduce((acc, c) => acc + (c.performance_score || 0), 0) || 0) /
      (totalCampaigns || 1);

    const totalPitches = pitches?.length || 0;
    const pitchesWithResponse = pitches?.filter(p => p.response_received).length || 0;
    const responseRate = totalPitches > 0 ? (pitchesWithResponse / totalPitches) * 100 : 0;

    // Transform activities for the dashboard
    const recentSignals =
      activities?.map(a => ({
        id: a.id,
        date: new Date(a.timestamp || new Date()),
        type: a.activity_type,
        title: a.description,
        significance: a.importance === 'high' ? 90 : a.importance === 'medium' ? 60 : 30,
      })) || [];

    return NextResponse.json({
      overview: {
        totalCampaigns,
        activeCampaigns,
        avgPerformance: Math.round(avgPerformance),
        totalContacts: intelContactsCount || 0,
        totalPitches,
        responseRate: Math.round(responseRate),
      },
      recentCampaigns:
        campaigns?.slice(0, 5).map(c => ({
          id: c.id,
          title: c.title,
          status: c.status,
          performanceScore: c.performance_score,
          successRate: c.success_rate,
        })) || [],
      recentSignals,
      identity: {
        brandVoice: {
          tone: 'Authentic, industry-insider with casual professionalism',
          themes: ['Underground music', 'Radio promotion', 'Artist development'],
        },
        sceneIdentity: {
          primaryScene: 'UK Underground Electronic',
        },
        microgenreMap: {
          primary: 'Bass Music',
          secondary: ['Garage', 'Jungle', 'Breaks'],
        },
      },
      coverage: {
        totalEvents: totalCampaigns,
        countriesReached: 1, // UK-focused
        citiesReached: activeCampaigns,
        coverageScore: avgPerformance,
      },
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
