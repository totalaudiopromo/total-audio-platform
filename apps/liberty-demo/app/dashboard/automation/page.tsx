'use client';

import React, { useState } from 'react';
import { AUTOMATION_WORKFLOWS } from '@/lib/constants';
import AutomationList from '@/components/AutomationList';
import AutomationGraphCanvas from '@/components/AutomationGraphCanvas';
import WorkflowDetails from '@/components/WorkflowDetails';
import AutomationLibrary from '@/components/AutomationLibrary';

const AutomationGraphPage: React.FC = () => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    AUTOMATION_WORKFLOWS.length > 0 ? AUTOMATION_WORKFLOWS[0].id : null
  );

  const selectedWorkflow = AUTOMATION_WORKFLOWS.find(w => w.id === selectedWorkflowId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-tap-line">
        <h1 className="font-heading font-normal text-4xl tracking-tight text-tap-text pb-2">
          Automation Graph
        </h1>
        <p className="text-sm text-tap-muted mt-2">
          Orchestrate Liberty's outreach workflows across coverage, intake and comms.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Workflow List */}
        <div className="lg:col-span-1">
          <AutomationList
            workflows={AUTOMATION_WORKFLOWS}
            selectedId={selectedWorkflowId}
            onSelect={setSelectedWorkflowId}
          />
        </div>

        {/* Middle Column - Graph Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <AutomationGraphCanvas workflow={selectedWorkflow} />
          <WorkflowDetails workflow={selectedWorkflow} />
        </div>

        {/* Right Column - Library */}
        <div className="lg:col-span-1">
          <AutomationLibrary />
        </div>
      </div>
    </div>
  );
};

export default AutomationGraphPage;
