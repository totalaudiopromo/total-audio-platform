import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

export async function GET() {
  try {
    const CONVERTKIT_API_KEY = getEnv('CONVERTKIT_API_KEY', { requiredInProd: false });
    const CONVERTKIT_API_SECRET = getEnv('CONVERTKIT_API_SECRET', { requiredInProd: false });

    if (!CONVERTKIT_API_KEY || !CONVERTKIT_API_SECRET) {
      return NextResponse.json({
        totalSubscribers: 0,
        weeklyOpenRate: 0,
        weeklyClickRate: 0,
        recentIssues: 0,
      });
    }

    // Get newsletter subscribers count
    const subscribersResponse = await fetch(
      `https://api.convertkit.com/v3/tags/10182443/subscribers?api_secret=${CONVERTKIT_API_SECRET}`
    );
    let totalSubscribers = 0;

    if (subscribersResponse.ok) {
      const subscribersData = await subscribersResponse.json();
      totalSubscribers = subscribersData.subscribers?.length || 0;
    }

    // Get recent broadcasts (newsletters sent)
    const broadcastsResponse = await fetch(
      `https://api.convertkit.com/v3/broadcasts?api_secret=${CONVERTKIT_API_SECRET}`
    );
    let recentIssues = 0;
    let weeklyOpenRate = 0;
    let weeklyClickRate = 0;

    if (broadcastsResponse.ok) {
      const broadcastsData = await broadcastsResponse.json();
      recentIssues = broadcastsData.broadcasts?.length || 0;

      // Calculate average open and click rates from recent broadcasts
      if (broadcastsData.broadcasts && broadcastsData.broadcasts.length > 0) {
        const recentBroadcasts = broadcastsData.broadcasts.slice(0, 5); // Last 5 newsletters
        const totalOpens = recentBroadcasts.reduce(
          (sum: number, broadcast: any) => sum + (broadcast.stats?.opens || 0),
          0
        );
        const totalClicks = recentBroadcasts.reduce(
          (sum: number, broadcast: any) => sum + (broadcast.stats?.clicks || 0),
          0
        );
        const totalSent = recentBroadcasts.reduce(
          (sum: number, broadcast: any) => sum + (broadcast.stats?.recipients || 0),
          0
        );

        if (totalSent > 0) {
          weeklyOpenRate = Math.round((totalOpens / totalSent) * 100);
          weeklyClickRate = Math.round((totalClicks / totalSent) * 100);
        }
      }
    }

    return NextResponse.json({
      totalSubscribers,
      weeklyOpenRate,
      weeklyClickRate,
      recentIssues,
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return NextResponse.json({
      totalSubscribers: 0,
      weeklyOpenRate: 0,
      weeklyClickRate: 0,
      recentIssues: 0,
    });
  }
}
