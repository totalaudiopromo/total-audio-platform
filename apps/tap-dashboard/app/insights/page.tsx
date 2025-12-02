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
        <Card>
          <div className="p-4">
            <p className="text-slate-500">Loading correlations...</p>
          </div>
        </Card>
      ) : correlations ? (
        <CorrelationList
          correlations={correlations.correlations}
          highlights={correlations.highlights}
          recommendations={correlations.recommendations}
        />
      ) : (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">No correlation data available</p>
          </div>
        </Card>
      ),
    },
    {
      id: 'trajectory',
      label: 'Trajectory',
      content: trajectoryLoading ? (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">Loading trajectory...</p>
          </div>
        </Card>
      ) : trajectory ? (
        <TrajectoryForecast
          forecast={trajectory.forecast}
          opportunityWindows={trajectory.opportunityWindows}
          riskIndicators={trajectory.riskIndicators}
          confidence={trajectory.confidence}
        />
      ) : (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">No trajectory data available</p>
          </div>
        </Card>
      ),
    },
    {
      id: 'patterns',
      label: 'Patterns',
      content: (
        <Card>
          <div className="p-4">
            <p className="text-sm text-slate-500">Pattern analysis available in main dashboard</p>
          </div>
        </Card>
      ),
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      content: (
        <Card>
          <div className="p-4">
            <p className="text-sm text-slate-500">AI-powered recommendations coming soon</p>
          </div>
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
