import React from 'react';
import { AutomationWorkflow } from '@/lib/types';
import AutomationGraphFlow from './AutomationGraphFlow';
import { Activity, Clock, Play } from 'lucide-react';

interface AutomationGraphCanvasProps {
    workflow: AutomationWorkflow | undefined;
}

const AutomationGraphCanvas: React.FC<AutomationGraphCanvasProps> = ({ workflow }) => {
    if (!workflow) {
        return (
            <div className="bg-tap-panel border border-tap-line/30 rounded-xl p-12 flex items-center justify-center min-h-[600px]">
                <p className="text-tap-muted/70 font-heading font-medium tracking-tight italic text-lg">Select a workflow to view its automation graph.</p>
            </div>
        );
    }

    const getStatusColor = (status: AutomationWorkflow['status']) => {
        switch (status) {
            case 'active': return 'bg-tap-good/10 text-tap-good border-tap-good/20';
            case 'paused': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'draft': return 'bg-tap-muted/10 text-tap-muted border-tap-muted/20';
        }
    };

    return (
        <div className="bg-tap-panel border border-tap-line rounded-xl overflow-hidden shadow-sm">
            {/* Header Section */}
            <div className="p-8 border-b border-tap-line bg-white">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="font-heading font-medium text-3xl tracking-tight text-tap-text mb-2">
                            {workflow.name}
                        </h2>
                        <p className="font-sans text-sm text-tap-muted max-w-2xl leading-relaxed">
                            {workflow.description}
                        </p>
                    </div>
                    <span className={`font-mono text-xs px-3 py-1 rounded-full border uppercase tracking-wide font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                    </span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-tap-muted" />
                        <span className="text-tap-muted font-sans">Last run:</span>
                        <span className="font-mono text-tap-text">{workflow.lastRun}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Play className="w-4 h-4 text-tap-muted" />
                        <span className="text-tap-muted font-sans">Total runs:</span>
                        <span className="font-mono text-tap-text">{workflow.runCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-tap-accent" />
                        <span className="text-tap-accent font-medium font-sans">Healthy</span>
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="p-8 bg-tap-bg min-h-[600px]">
                <AutomationGraphFlow workflow={workflow} />
            </div>
        </div>
    );
};

export default AutomationGraphCanvas;
