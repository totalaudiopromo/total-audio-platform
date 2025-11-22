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

// Mock data - in production this would come from API calls
const getMockDashboardData = () => {
  return {
    snapshot: {
      activeCampaigns: 5,
      totalContacts: 247,
      coverageEvents: 18,
      avgReplyRate: 0.12,
    },
    nextActions: [
      {
        id: '1',
        action: 'follow up with 3 high-value leads from last week',
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
        pattern: 'indie rock pitches performing 3x better than electronic',
        confidence: 0.75,
        impact: 'moderate impact on genre targeting',
      },
    ],
    trajectory: [
      { day: 0, coverageEvents: 12, replyRate: 0.08 },
      { day: 30, coverageEvents: 15, replyRate: 0.11 },
      { day: 60, coverageEvents: 18, replyRate: 0.14 },
      { day: 90, coverageEvents: 22, replyRate: 0.16 },
    ],
    coverage: {
      totalEvents: 45,
      countriesReached: 8,
      citiesReached: 23,
      coverageScore: 72,
    },
    identity: {
      brandVoice: {
        tone: 'authentic, raw, vulnerable',
        themes: ['urban isolation', 'late-night introspection'],
      },
      sceneIdentity: {
        primaryScene: 'bedroom pop',
      },
      microgenreMap: {
        primary: 'indie',
        secondary: ['lo-fi', 'electronic', 'alternative'],
      },
    },
    signals: [
      {
        id: '1',
        date: new Date('2025-01-15'),
        type: 'coverage',
        title: 'featured on bbc radio 6 music',
        significance: 1.0,
      },
      {
        id: '2',
        date: new Date('2025-01-12'),
        type: 'campaign_start',
        title: 'uk radio campaign launched (50 targets)',
        significance: 0.8,
      },
      {
        id: '3',
        date: new Date('2025-01-10'),
        type: 'creative_release',
        title: 'new single "midnight drive" released',
        significance: 0.9,
      },
    ],
  };
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // In production, fetch real data here
  const data = getMockDashboardData();

  return (
    <PageContainer>
      <SectionHeader
        title="unified dashboard"
        description="comprehensive overview of your campaigns, contacts, and intelligence"
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
