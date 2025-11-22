'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAutomations } from '@/lib/hooks/use-intelligence';
import clsx from 'clsx';

const AUTOMATIONS = [
  {
    id: 'suggest_contacts',
    name: 'suggest contacts',
    description: 'find best 10 contacts for next pitch',
    icon: '🎯',
  },
  {
    id: 'fix_bottleneck',
    name: 'fix bottleneck',
    description: 'identify and resolve campaign bottleneck',
    icon: '🔧',
  },
  {
    id: 'generate_variations',
    name: 'generate variations',
    description: 'create 5 pitch variations',
    icon: '✨',
  },
  {
    id: 'clean_segments',
    name: 'clean segments',
    description: 'remove dead/unresponsive contacts',
    icon: '🧹',
  },
  {
    id: 'detect_rot',
    name: 'detect rot',
    description: 'find stale lists and suggest refresh',
    icon: '🔍',
  },
  {
    id: 'optimize_schedule',
    name: 'optimize schedule',
    description: 'best times to send over next 5 days',
    icon: '📅',
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
        title="automations drawer"
        description="ai-powered quick actions for your campaigns"
      />

      <div className="space-y-6">
        {/* Automations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUTOMATIONS.map((automation) => (
            <Card
              key={automation.id}
              className={clsx('cursor-pointer transition-all duration-180', {
                'ring-2 ring-tap-cyan': selectedAutomation === automation.id,
                'hover:border-tap-cyan/50': selectedAutomation !== automation.id,
              })}
              padding="md"
            >
              <button
                onClick={() => handleRunAutomation(automation.id)}
                disabled={loading}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{automation.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-tap-white lowercase mb-1">
                      {automation.name}
                    </h3>
                    <p className="text-xs text-tap-grey lowercase">
                      {automation.description}
                    </p>
                  </div>
                </div>
                {loading && selectedAutomation === automation.id && (
                  <Badge variant="info" size="sm">
                    running...
                  </Badge>
                )}
              </button>
            </Card>
          ))}
        </div>

        {/* Results Panel */}
        {result && (
          <Card>
            <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">
              automation result
            </h3>
            {result.success ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="success">success</Badge>
                  <span className="text-xs text-tap-grey font-mono">
                    {result.executionTimeMs}ms
                  </span>
                </div>
                <div className="p-4 bg-tap-black/30 rounded-lg border border-tap-panel/30">
                  <pre className="text-xs text-tap-white font-mono whitespace-pre-wrap">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="error">error</Badge>
                <p className="text-sm text-red-400 lowercase">
                  {result.error || 'automation failed'}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* History Placeholder */}
        <Card>
          <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">
            automation history
          </h3>
          <p className="text-sm text-tap-grey lowercase">
            execution history will appear here
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
