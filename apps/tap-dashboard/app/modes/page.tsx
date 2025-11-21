'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { ModeSwitch, DashboardMode } from '@/components/ui/ModeSwitch';
import { Badge } from '@/components/ui/Badge';
import { useModeRecommendation } from '@/lib/hooks/use-intelligence';

const MODE_DESCRIPTIONS: Record<DashboardMode, { description: string; panels: string[]; actions: string[] }> = {
  campaign: {
    description: 'Focus on active campaigns and execution',
    panels: ['tracker', 'email', 'trajectory', 'signal threads', 'automations'],
    actions: ['new campaign', 'send pitch', 'track coverage'],
  },
  contact: {
    description: 'Focus on contact intelligence and relationships',
    panels: ['intel', 'contact intel', 'reply intel', 'automations'],
    actions: ['find contacts', 'clean list', 'enrich contact'],
  },
  scene: {
    description: 'Focus on scene positioning and community',
    panels: ['community', 'coverage fusion', 'identity', 'signal threads'],
    actions: ['view coverage map', 'scene report', 'find scenes'],
  },
  creative: {
    description: 'Focus on creative work and analysis',
    panels: ['assets', 'identity', 'correlation', 'writers room', 'press kit'],
    actions: ['upload asset', 'generate copy', 'analyze creative'],
  },
  performance: {
    description: 'Focus on metrics and ROI',
    panels: ['benchmarks', 'trajectory', 'correlation', 'email performance', 'campaign simulator'],
    actions: ['view benchmarks', 'optimize schedule', 'export report'],
  },
  team: {
    description: 'Focus on workspace management',
    panels: ['benchmarks', 'automations history', 'workspace settings', 'integrations'],
    actions: ['compare artists', 'manage team', 'view automations'],
  },
};

export default function ModesPage() {
  const [currentMode, setCurrentMode] = useState<DashboardMode>('campaign');
  const { data: recommendation } = useModeRecommendation(currentMode);

  const modeDetails = MODE_DESCRIPTIONS[currentMode];

  return (
    <PageContainer>
      <SectionHeader
        title="Dashboard Modes"
        description="Context-switching modes to focus on different aspects of your campaigns"
      />

      <div className="space-y-6">
        {/* Mode Switcher */}
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            Select Mode
          </h3>
          <ModeSwitch currentMode={currentMode} onModeChange={setCurrentMode} />
        </Card>

        {/* Mode Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-bold text-postcraft-black mb-4">
              Mode Overview
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                  Description
                </p>
                <p className="text-sm text-postcraft-gray-900">{modeDetails.description}</p>
              </div>
              <div>
                <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                  Visible Panels
                </p>
                <div className="flex flex-wrap gap-2">
                  {modeDetails.panels.map((panel) => (
                    <Badge key={panel} variant="info" size="sm">
                      {panel}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                  Quick Actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {modeDetails.actions.map((action) => (
                    <Badge key={action} variant="default" size="sm">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-postcraft-black mb-4">
              Mode Insights
            </h3>
            {recommendation ? (
              <div className="space-y-3">
                {recommendation.insights.length > 0 ? (
                  <ul className="space-y-2">
                    {recommendation.insights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-postcraft-gray-900 font-medium">
                        <span className="text-postcraft-blue font-bold">→</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-postcraft-gray-600">
                    No insights available for this mode
                  </p>
                )}
                {recommendation.recommendedMode !== currentMode && (
                  <div className="pt-3 border-t-2 border-postcraft-gray-200">
                    <p className="text-xs text-postcraft-gray-700 mb-2 font-bold">
                      AI Recommendation:
                    </p>
                    <Badge variant="warning">
                      Switch to {recommendation.recommendedMode} mode
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-postcraft-gray-600">Loading insights...</p>
            )}
          </Card>
        </div>

        {/* Mode Explanation */}
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            How Modes Work
          </h3>
          <div className="space-y-3 text-sm text-postcraft-gray-900 leading-relaxed">
            <p>
              Dashboard modes filter and prioritize data based on your current focus. Each mode:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-postcraft-blue font-bold">•</span>
                <span>Filters fusion context to relevant data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-postcraft-blue font-bold">•</span>
                <span>Shows/hides specific dashboard panels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-postcraft-blue font-bold">•</span>
                <span>Reorders information by priority</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-postcraft-blue font-bold">•</span>
                <span>Provides context-specific quick actions</span>
              </li>
            </ul>
            <p className="pt-2 text-postcraft-gray-600">
              The AI navigator will recommend modes based on your current activity and needs.
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
