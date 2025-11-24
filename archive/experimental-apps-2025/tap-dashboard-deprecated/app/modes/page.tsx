'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { ModeSwitch, DashboardMode } from '@/components/ui/ModeSwitch';
import { Badge } from '@/components/ui/Badge';
import { useModeRecommendation } from '@/lib/hooks/use-intelligence';

const MODE_DESCRIPTIONS: Record<
  DashboardMode,
  { description: string; panels: string[]; actions: string[] }
> = {
  campaign: {
    description: 'focus on active campaigns and execution',
    panels: ['tracker', 'email', 'trajectory', 'signal threads', 'automations'],
    actions: ['new campaign', 'send pitch', 'track coverage'],
  },
  contact: {
    description: 'focus on contact intelligence and relationships',
    panels: ['intel', 'contact intel', 'reply intel', 'automations'],
    actions: ['find contacts', 'clean list', 'enrich contact'],
  },
  scene: {
    description: 'focus on scene positioning and community',
    panels: ['community', 'coverage fusion', 'identity', 'signal threads'],
    actions: ['view coverage map', 'scene report', 'find scenes'],
  },
  creative: {
    description: 'focus on creative work and analysis',
    panels: ['assets', 'identity', 'correlation', 'writers room', 'press kit'],
    actions: ['upload asset', 'generate copy', 'analyze creative'],
  },
  performance: {
    description: 'focus on metrics and roi',
    panels: ['benchmarks', 'trajectory', 'correlation', 'email performance', 'campaign simulator'],
    actions: ['view benchmarks', 'optimize schedule', 'export report'],
  },
  team: {
    description: 'focus on workspace management',
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
        title="dashboard modes"
        description="context-switching modes to focus on different aspects of your campaigns"
      />

      <div className="space-y-6">
        {/* Mode Switcher */}
        <Card>
          <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">select mode</h3>
          <ModeSwitch currentMode={currentMode} onModeChange={setCurrentMode} />
        </Card>

        {/* Mode Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">mode overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">description</p>
                <p className="text-sm text-tap-white lowercase">{modeDetails.description}</p>
              </div>
              <div>
                <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">
                  visible panels
                </p>
                <div className="flex flex-wrap gap-2">
                  {modeDetails.panels.map(panel => (
                    <Badge key={panel} variant="info" size="sm">
                      {panel}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">quick actions</p>
                <div className="flex flex-wrap gap-2">
                  {modeDetails.actions.map(action => (
                    <Badge key={action} variant="default" size="sm">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">mode insights</h3>
            {recommendation ? (
              <div className="space-y-3">
                {recommendation.insights.length > 0 ? (
                  <ul className="space-y-2">
                    {recommendation.insights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-tap-white">
                        <span className="text-tap-cyan">→</span>
                        <span className="lowercase">{insight}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-tap-grey lowercase">
                    no insights available for this mode
                  </p>
                )}
                {recommendation.recommendedMode !== currentMode && (
                  <div className="pt-3 border-t border-tap-panel/30">
                    <p className="text-xs text-tap-grey lowercase mb-2">ai recommendation:</p>
                    <Badge variant="warning">switch to {recommendation.recommendedMode} mode</Badge>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-tap-grey lowercase">loading insights...</p>
            )}
          </Card>
        </div>

        {/* Mode Explanation */}
        <Card>
          <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">how modes work</h3>
          <div className="space-y-3 text-sm text-tap-white lowercase leading-relaxed">
            <p>
              dashboard modes filter and prioritize data based on your current focus. each mode:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-tap-cyan">•</span>
                <span>filters fusion context to relevant data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-tap-cyan">•</span>
                <span>shows/hides specific dashboard panels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-tap-cyan">•</span>
                <span>reorders information by priority</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-tap-cyan">•</span>
                <span>provides context-specific quick actions</span>
              </li>
            </ul>
            <p className="pt-2 text-tap-grey">
              the ai navigator will recommend modes based on your current activity and needs.
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
