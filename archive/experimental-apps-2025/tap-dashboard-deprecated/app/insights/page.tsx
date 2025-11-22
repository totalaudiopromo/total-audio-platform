'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tabbed, Tab } from '@/components/ui/Tabbed';
import { CorrelationList } from '@/components/intelligence/CorrelationList';
import { TrajectoryForecast } from '@/components/intelligence/TrajectoryForecast';
import { useCorrelations, useTrajectory } from '@/lib/hooks/use-intelligence';
import { Card } from '@/components/ui/Card';

export default function InsightsPage() {
  const artistSlug = 'current-artist';

  const { data: correlations, isLoading: correlationsLoading } = useCorrelations(artistSlug);
  const { data: trajectory, isLoading: trajectoryLoading } = useTrajectory(artistSlug);

  const tabs: Tab[] = [
    {
      id: 'correlations',
      label: 'correlations',
      content: correlationsLoading ? (
        <Card><p className="text-tap-grey lowercase">loading correlations...</p></Card>
      ) : correlations ? (
        <CorrelationList
          correlations={correlations.correlations}
          highlights={correlations.highlights}
          recommendations={correlations.recommendations}
        />
      ) : (
        <Card><p className="text-tap-grey lowercase">no correlation data available</p></Card>
      ),
    },
    {
      id: 'trajectory',
      label: 'trajectory',
      content: trajectoryLoading ? (
        <Card><p className="text-tap-grey lowercase">loading trajectory...</p></Card>
      ) : trajectory ? (
        <TrajectoryForecast
          forecast={trajectory.forecast}
          opportunityWindows={trajectory.opportunityWindows}
          riskIndicators={trajectory.riskIndicators}
          confidence={trajectory.confidence}
        />
      ) : (
        <Card><p className="text-tap-grey lowercase">no trajectory data available</p></Card>
      ),
    },
    {
      id: 'patterns',
      label: 'patterns',
      content: (
        <Card>
          <p className="text-sm text-tap-grey lowercase">
            pattern analysis available in main dashboard
          </p>
        </Card>
      ),
    },
    {
      id: 'recommendations',
      label: 'recommendations',
      content: (
        <Card>
          <p className="text-sm text-tap-grey lowercase">
            ai-powered recommendations coming soon
          </p>
        </Card>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="intelligence insights"
        description="deep analysis of your campaigns and creative work"
      />

      <Tabbed tabs={tabs} defaultTab="correlations" />
    </PageContainer>
  );
}
