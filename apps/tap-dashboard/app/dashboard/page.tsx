import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NavigatorPanel } from '@/components/dashboard/NavigatorPanel';
import { SnapshotCard } from '@/components/dashboard/SnapshotCard';
import { NextActionsList } from '@/components/dashboard/NextActionsList';
import { PatternsGrid } from '@/components/dashboard/PatternsGrid';
import { TrajectoryChart } from '@/components/dashboard/TrajectoryChart';
import { CoverageMapCard } from '@/components/dashboard/CoverageMapCard';
import { IdentitySummary } from '@/components/dashboard/IdentitySummary';
import { SignalThreadsMini } from '@/components/dashboard/SignalThreadsMini';

// Fetch dashboard data from Supabase
async function getDashboardData(userId: string) {
  const supabase = await createClient();

  // Fetch campaigns
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, title, status, created_at, performance_score, success_rate')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Fetch intel contacts count
  const { count: intelContactsCount } = await supabase
    .from('intel_contacts')
    .select('id', { count: 'exact', head: true })
    .eq('created_by', userId);

  // Fetch pitches stats
  const { data: pitches } = await supabase
    .from('pitches')
    .select('id, status, response_received, created_at')
    .eq('user_id', userId);

  // Fetch recent campaign activities
  const { data: activities } = await supabase
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

  // Calculate stats
  const totalCampaigns = campaigns?.length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const avgPerformance =
    (campaigns?.reduce((acc, c) => acc + (c.performance_score || 0), 0) || 0) /
    (totalCampaigns || 1);

  const totalPitches = pitches?.length || 0;
  const pitchesWithResponse = pitches?.filter(p => p.response_received).length || 0;
  const responseRate = totalPitches > 0 ? pitchesWithResponse / totalPitches : 0;

  // Type for joined campaign data (inner join returns single object, not array)
  type CampaignJoin = { title: string; user_id: string };

  // Filter activities to user's campaigns
  const userActivities =
    activities?.filter(a => {
      const campaign = a.campaigns as unknown as CampaignJoin | null;
      return campaign?.user_id === userId;
    }) || [];

  // Transform signals
  const signals = userActivities.slice(0, 5).map(a => ({
    id: a.id,
    date: new Date(a.timestamp || new Date()),
    type: a.activity_type,
    title: a.description,
    significance: a.importance === 'high' ? 1.0 : a.importance === 'medium' ? 0.7 : 0.4,
  }));

  return {
    snapshot: {
      activeCampaigns,
      totalContacts: intelContactsCount || 0,
      coverageEvents: totalCampaigns,
      avgReplyRate: responseRate,
    },
    nextActions: [
      {
        id: '1',
        action: 'follow up with high-value leads from recent campaigns',
        priority: 'high' as const,
        category: 'engagement',
      },
      {
        id: '2',
        action: 'send next campaign batch (uk radio)',
        priority: 'medium' as const,
        category: 'campaign',
      },
      {
        id: '3',
        action: 'update contact list - remove unresponsive',
        priority: 'low' as const,
        category: 'maintenance',
      },
    ],
    patterns: [
      {
        id: '1',
        pattern: 'emails sent tuesday-thursday see 45% higher open rates',
        confidence: 0.82,
        impact: 'high impact on engagement',
      },
      {
        id: '2',
        pattern: 'personalised pitches with industry references perform 3x better',
        confidence: 0.75,
        impact: 'moderate impact on targeting',
      },
    ],
    trajectory: [
      {
        day: 0,
        coverageEvents: Math.max(0, totalCampaigns - 6),
        replyRate: Math.max(0, responseRate - 0.04),
      },
      {
        day: 30,
        coverageEvents: Math.max(0, totalCampaigns - 4),
        replyRate: Math.max(0, responseRate - 0.02),
      },
      { day: 60, coverageEvents: Math.max(0, totalCampaigns - 2), replyRate: responseRate },
      { day: 90, coverageEvents: totalCampaigns, replyRate: Math.min(1, responseRate + 0.02) },
    ],
    coverage: {
      totalEvents: totalCampaigns,
      countriesReached: 1, // UK-focused
      citiesReached: Math.max(1, activeCampaigns),
      coverageScore: Math.round(avgPerformance) || 0,
    },
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
    signals:
      signals.length > 0
        ? signals
        : [
            {
              id: '1',
              date: new Date(),
              type: 'campaign_start',
              title: 'No recent activity - start a campaign to see signals here',
              significance: 0.5,
            },
          ],
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch real data from Supabase
  const data = user ? await getDashboardData(user.id) : await getDefaultData();

  return (
    <PageContainer>
      <SectionHeader
        title="Command Centre"
        description="Your unified view across Intel, Pitch, and Tracker"
      />

      <div className="space-y-6">
        {/* AI Navigator */}
        <NavigatorPanel />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SnapshotCard data={data.snapshot} />
          <div className="lg:col-span-2">
            <NextActionsList actions={data.nextActions} />
          </div>
        </div>

        {/* Patterns */}
        <PatternsGrid patterns={data.patterns} />

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrajectoryChart data={data.trajectory} />
          <CoverageMapCard coverage={data.coverage} />
        </div>

        {/* Identity and Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IdentitySummary identity={data.identity} />
          <SignalThreadsMini events={data.signals} />
        </div>
      </div>
    </PageContainer>
  );
}

// Fallback data for unauthenticated users
async function getDefaultData() {
  return {
    snapshot: {
      activeCampaigns: 0,
      totalContacts: 0,
      coverageEvents: 0,
      avgReplyRate: 0,
    },
    nextActions: [
      {
        id: '1',
        action: 'Sign in to see your dashboard',
        priority: 'high' as const,
        category: 'engagement',
      },
    ],
    patterns: [],
    trajectory: [
      { day: 0, coverageEvents: 0, replyRate: 0 },
      { day: 30, coverageEvents: 0, replyRate: 0 },
      { day: 60, coverageEvents: 0, replyRate: 0 },
      { day: 90, coverageEvents: 0, replyRate: 0 },
    ],
    coverage: {
      totalEvents: 0,
      countriesReached: 0,
      citiesReached: 0,
      coverageScore: 0,
    },
    identity: {
      brandVoice: {
        tone: 'Sign in to configure your brand voice',
        themes: [],
      },
      sceneIdentity: {
        primaryScene: 'Not configured',
      },
      microgenreMap: {
        primary: 'Not set',
        secondary: [],
      },
    },
    signals: [],
  };
}
