'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Tabbed, Tab } from '@/components/ui/Tabbed';
import { NarrativeThreadView } from '@/components/intelligence/NarrativeThreadView';
import { useSignalThread } from '@/lib/hooks/use-intelligence';

export default function ThreadsPage() {
  const artistSlug = 'current-artist';

  const { data: narrativeThread, isLoading: narrativeLoading } = useSignalThread(
    artistSlug,
    'narrative'
  );
  const { data: campaignThread, isLoading: campaignLoading } = useSignalThread(
    artistSlug,
    'campaign'
  );
  const { data: creativeThread, isLoading: creativeLoading } = useSignalThread(
    artistSlug,
    'creative'
  );
  const { data: sceneThread, isLoading: sceneLoading } = useSignalThread(artistSlug, 'scene');
  const { data: performanceThread, isLoading: performanceLoading } = useSignalThread(
    artistSlug,
    'performance'
  );

  const tabs: Tab[] = [
    {
      id: 'narrative',
      label: 'Narrative',
      content: narrativeLoading ? (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">Loading narrative thread...</p>
          </div>
        </Card>
      ) : narrativeThread ? (
        <NarrativeThreadView thread={narrativeThread} />
      ) : (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">No narrative thread available</p>
          </div>
        </Card>
      ),
    },
    {
      id: 'campaign',
      label: 'Campaign',
      content: campaignLoading ? (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">Loading campaign thread...</p>
          </div>
        </Card>
      ) : campaignThread ? (
        <NarrativeThreadView thread={campaignThread} />
      ) : (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">No campaign thread available</p>
          </div>
        </Card>
      ),
    },
    {
      id: 'creative',
      label: 'Creative',
      content: creativeLoading ? (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">Loading creative thread...</p>
          </div>
        </Card>
      ) : creativeThread ? (
        <NarrativeThreadView thread={creativeThread} />
      ) : (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">No creative thread available</p>
          </div>
        </Card>
      ),
    },
    {
      id: 'scene',
      label: 'Scene',
      content: sceneLoading ? (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">Loading scene thread...</p>
          </div>
        </Card>
      ) : sceneThread ? (
        <NarrativeThreadView thread={sceneThread} />
      ) : (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">No scene thread available</p>
          </div>
        </Card>
      ),
    },
    {
      id: 'performance',
      label: 'Performance',
      content: performanceLoading ? (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">Loading performance thread...</p>
          </div>
        </Card>
      ) : performanceThread ? (
        <NarrativeThreadView thread={performanceThread} />
      ) : (
        <Card>
          <div className="p-4">
            <p className="text-slate-500">No performance thread available</p>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Signal Threads"
        description="Narrative timelines connecting all your campaign events"
      />

      <Tabbed tabs={tabs} defaultTab="narrative" />
    </PageContainer>
  );
}
