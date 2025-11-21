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
      label: 'Correlations',
      content: correlationsLoading ? (
        <Card><p className="text-postcraft-gray-600">Loading correlations...</p></Card>
      ) : correlations ? (
        <CorrelationList
          correlations={correlations.correlations}
          highlights={correlations.highlights}
          recommendations={correlations.recommendations}
        />
      ) : (
        <Card><p className="text-postcraft-gray-600">No correlation data available</p></Card>
      ),
    },
    {
      id: 'trajectory',
      label: 'Trajectory',
      content: trajectoryLoading ? (
        <Card><p className="text-postcraft-gray-600">Loading trajectory...</p></Card>
      ) : trajectory ? (
        <TrajectoryForecast
          forecast={trajectory.forecast}
          opportunityWindows={trajectory.opportunityWindows}
          riskIndicators={trajectory.riskIndicators}
          confidence={trajectory.confidence}
        />
      ) : (
        <Card><p className="text-postcraft-gray-600">No trajectory data available</p></Card>
      ),
    },
    {
      id: 'patterns',
      label: 'Patterns',
      content: (
        <Card>
          <p className="text-sm text-postcraft-gray-600">
            Pattern analysis available in main dashboard
          </p>
        </Card>
      ),
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      content: (
        <Card>
          <p className="text-sm text-postcraft-gray-600">
            AI-powered recommendations coming soon
          </p>
        </Card>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Intelligence Insights"
        description="Deep analysis of your campaigns and creative work"
      />

      <Tabbed tabs={tabs} defaultTab="correlations" />
    </PageContainer>
  );
}
