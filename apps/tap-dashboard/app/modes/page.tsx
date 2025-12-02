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
    description: 'Focus on active campaigns and execution',
    panels: ['Tracker', 'Email', 'Trajectory', 'Signal Threads', 'Automations'],
    actions: ['New Campaign', 'Send Pitch', 'Track Coverage'],
  },
  contact: {
    description: 'Focus on contact intelligence and relationships',
    panels: ['Intel', 'Contact Intel', 'Reply Intel', 'Automations'],
    actions: ['Find Contacts', 'Clean List', 'Enrich Contact'],
  },
  scene: {
    description: 'Focus on scene positioning and community',
    panels: ['Community', 'Coverage Fusion', 'Identity', 'Signal Threads'],
    actions: ['View Coverage Map', 'Scene Report', 'Find Scenes'],
  },
  creative: {
    description: 'Focus on creative work and analysis',
    panels: ['Assets', 'Identity', 'Correlation', 'Writers Room', 'Press Kit'],
    actions: ['Upload Asset', 'Generate Copy', 'Analyse Creative'],
  },
  performance: {
    description: 'Focus on metrics and ROI',
    panels: ['Benchmarks', 'Trajectory', 'Correlation', 'Email Performance', 'Campaign Simulator'],
    actions: ['View Benchmarks', 'Optimise Schedule', 'Export Report'],
  },
  team: {
    description: 'Focus on workspace management',
    panels: ['Benchmarks', 'Automations History', 'Workspace Settings', 'Integrations'],
    actions: ['Compare Artists', 'Manage Team', 'View Automations'],
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
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Mode</h3>
            <ModeSwitch currentMode={currentMode} onModeChange={setCurrentMode} />
          </div>
        </Card>

        {/* Mode Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Mode Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <p className="text-sm text-slate-700">{modeDetails.description}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    Visible Panels
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {modeDetails.panels.map(panel => (
                      <Badge key={panel} variant="teal" size="sm">
                        {panel}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    Quick Actions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {modeDetails.actions.map(action => (
                      <Badge key={action} variant="slate" size="sm">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Mode Insights</h3>
              {recommendation ? (
                <div className="space-y-3">
                  {recommendation.insights.length > 0 ? (
                    <ul className="space-y-2">
                      {recommendation.insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-brand-slate font-bold">-</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No insights available for this mode</p>
                  )}
                  {recommendation.recommendedMode !== currentMode && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500 mb-2">AI recommendation:</p>
                      <Badge variant="amber">Switch to {recommendation.recommendedMode} mode</Badge>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Loading insights...</p>
              )}
            </div>
          </Card>
        </div>

        {/* Mode Explanation */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">How Modes Work</h3>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                Dashboard modes filter and prioritise data based on your current focus. Each mode:
              </p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-brand-slate font-bold">-</span>
                  <span>Filters context to relevant data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-slate font-bold">-</span>
                  <span>Shows/hides specific dashboard panels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-slate font-bold">-</span>
                  <span>Reorders information by priority</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-slate font-bold">-</span>
                  <span>Provides context-specific quick actions</span>
                </li>
              </ul>
              <p className="pt-2 text-slate-500">
                The AI Navigator will recommend modes based on your current activity and needs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
