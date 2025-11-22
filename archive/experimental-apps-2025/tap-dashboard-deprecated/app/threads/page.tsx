'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Tabbed, Tab } from '@/components/ui/Tabbed';
import { NarrativeThreadView } from '@/components/intelligence/NarrativeThreadView';
import { useSignalThread } from '@/lib/hooks/use-intelligence';

export default function ThreadsPage() {
  const artistSlug = 'current-artist';

  const { data: narrativeThread, isLoading: narrativeLoading } = useSignalThread(artistSlug, 'narrative');
  const { data: campaignThread, isLoading: campaignLoading } = useSignalThread(artistSlug, 'campaign');
  const { data: creativeThread, isLoading: creativeLoading } = useSignalThread(artistSlug, 'creative');
  const { data: sceneThread, isLoading: sceneLoading } = useSignalThread(artistSlug, 'scene');
  const { data: performanceThread, isLoading: performanceLoading } = useSignalThread(artistSlug, 'performance');

  const tabs: Tab[] = [
    {
      id: 'narrative',
      label: 'narrative',
      content: narrativeLoading ? (
        <Card><p className="text-tap-grey lowercase">loading narrative thread...</p></Card>
      ) : narrativeThread ? (
        <NarrativeThreadView thread={narrativeThread} />
      ) : (
        <Card><p className="text-tap-grey lowercase">no narrative thread available</p></Card>
      ),
    },
    {
      id: 'campaign',
      label: 'campaign',
      content: campaignLoading ? (
        <Card><p className="text-tap-grey lowercase">loading campaign thread...</p></Card>
      ) : campaignThread ? (
        <NarrativeThreadView thread={campaignThread} />
      ) : (
        <Card><p className="text-tap-grey lowercase">no campaign thread available</p></Card>
      ),
    },
    {
      id: 'creative',
      label: 'creative',
      content: creativeLoading ? (
        <Card><p className="text-tap-grey lowercase">loading creative thread...</p></Card>
      ) : creativeThread ? (
        <NarrativeThreadView thread={creativeThread} />
      ) : (
        <Card><p className="text-tap-grey lowercase">no creative thread available</p></Card>
      ),
    },
    {
      id: 'scene',
      label: 'scene',
      content: sceneLoading ? (
        <Card><p className="text-tap-grey lowercase">loading scene thread...</p></Card>
      ) : sceneThread ? (
        <NarrativeThreadView thread={sceneThread} />
      ) : (
        <Card><p className="text-tap-grey lowercase">no scene thread available</p></Card>
      ),
    },
    {
      id: 'performance',
      label: 'performance',
      content: performanceLoading ? (
        <Card><p className="text-tap-grey lowercase">loading performance thread...</p></Card>
      ) : performanceThread ? (
        <NarrativeThreadView thread={performanceThread} />
      ) : (
        <Card><p className="text-tap-grey lowercase">no performance thread available</p></Card>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="signal threads"
        description="narrative timelines connecting all your campaign events"
      />

      <Tabbed tabs={tabs} defaultTab="narrative" />
    </PageContainer>
  );
}
