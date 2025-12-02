'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAutomations } from '@/lib/hooks/use-intelligence';
import clsx from 'clsx';
import {
  UserGroupIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const AUTOMATIONS = [
  {
    id: 'suggest_contacts',
    name: 'Suggest Contacts',
    description: 'Find best 10 contacts for next pitch',
    icon: UserGroupIcon,
  },
  {
    id: 'fix_bottleneck',
    name: 'Fix Bottleneck',
    description: 'Identify and resolve campaign bottleneck',
    icon: WrenchScrewdriverIcon,
  },
  {
    id: 'generate_variations',
    name: 'Generate Variations',
    description: 'Create 5 pitch variations',
    icon: SparklesIcon,
  },
  {
    id: 'clean_segments',
    name: 'Clean Segments',
    description: 'Remove dead/unresponsive contacts',
    icon: TrashIcon,
  },
  {
    id: 'detect_rot',
    name: 'Detect Rot',
    description: 'Find stale lists and suggest refresh',
    icon: MagnifyingGlassIcon,
  },
  {
    id: 'optimize_schedule',
    name: 'Optimise Schedule',
    description: 'Best times to send over next 5 days',
    icon: CalendarIcon,
  },
];

export default function AutomationsPage() {
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const automations = useAutomations();

  const handleRunAutomation = async (action: string) => {
    setLoading(true);
    setSelectedAutomation(action);
    setResult(null);

    try {
      const res = await automations.run(action, {});
      setResult(res);
    } catch (error) {
      console.error('Automation error:', error);
      setResult({ success: false, error: 'Automation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Automations Drawer"
        description="AI-powered quick actions for your campaigns"
      />

      <div className="space-y-6">
        {/* Automations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUTOMATIONS.map(automation => {
            const Icon = automation.icon;
            return (
              <Card
                key={automation.id}
                className={clsx('cursor-pointer transition-all duration-180', {
                  'ring-2 ring-brand-slate': selectedAutomation === automation.id,
                  'hover:border-brand-slate/50': selectedAutomation !== automation.id,
                })}
              >
                <button
                  onClick={() => handleRunAutomation(automation.id)}
                  disabled={loading}
                  className="w-full text-left p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        {automation.name}
                      </h3>
                      <p className="text-xs text-slate-500">{automation.description}</p>
                    </div>
                  </div>
                  {loading && selectedAutomation === automation.id && (
                    <Badge variant="teal" size="sm">
                      Running...
                    </Badge>
                  )}
                </button>
              </Card>
            );
          })}
        </div>

        {/* Results Panel */}
        {result && (
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Automation Result</h3>
              {result.success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="teal">Success</Badge>
                    <span className="text-xs text-slate-500 font-mono">
                      {result.executionTimeMs}ms
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Badge variant="amber">Error</Badge>
                  <p className="text-sm text-red-600">{result.error || 'Automation failed'}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* History Placeholder */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Automation History</h3>
            <p className="text-sm text-slate-500">Execution history will appear here</p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
