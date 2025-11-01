'use client';

import React, { useState, useEffect } from 'react';
import { agentColorUtils, AGENT_CATEGORIES } from '../lib/agent-color-system';
import AgentStatusWidget from './AgentStatusWidget';
import { AlertTriangle, CheckCircle, Pause } from 'lucide-react';

interface AgentActivityMonitorProps {
  position?: 'fixed' | 'sticky' | 'relative';
  showCount?: boolean;
  maxVisible?: number;
}

const AgentActivityMonitor: React.FC<AgentActivityMonitorProps> = ({
  position = 'fixed',
  showCount = true,
  maxVisible = 4,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAgents, setActiveAgents] = useState([
    { type: 'reddit-monitor', name: 'Reddit Monitor', status: 'active' as const },
    { type: 'contact-agent', name: 'Contact Enrichment', status: 'processing' as const },
    { type: 'email-scheduler', name: 'Email Scheduler', status: 'completed' as const },
    { type: 'performance-tracker', name: 'Performance Monitor', status: 'active' as const },
    { type: 'brand-validator', name: 'Brand Checker', status: 'warning' as const },
    { type: 'music-tech-agent', name: 'Music Tech', status: 'idle' as const },
  ]);

  const visibleAgents = isExpanded ? activeAgents : activeAgents.slice(0, maxVisible);
  const hiddenCount = Math.max(0, activeAgents.length - maxVisible);

  const getOverallStatus = () => {
    const statuses = activeAgents.map(agent => agent.status);
    if (statuses.includes('warning'))
      return { color: '#F44336', icon: 'alert-triangle', message: 'Issues Detected' };
    if (statuses.includes('warning'))
      return { color: '#FF9800', icon: 'alert-triangle', message: 'Attention Needed' };
    if (statuses.includes('active') || statuses.includes('processing'))
      return { color: '#4CAF50', icon: 'check-circle', message: 'All Systems Active' };
    return { color: '#9E9E9E', icon: 'pause', message: 'All Agents Idle' };
  };

  const overallStatus = getOverallStatus();

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'alert-triangle':
        return <AlertTriangle className="w-4 h-4" />;
      case 'check-circle':
        return <CheckCircle className="w-4 h-4" />;
      case 'pause':
        return <Pause className="w-4 h-4" />;
      default:
        return <span>•</span>;
    }
  };

  const positionClasses = {
    fixed: 'fixed top-4 right-4 z-50',
    sticky: 'sticky top-0 z-40',
    relative: 'relative',
  };

  return (
    <div
      className={`${positionClasses[position]} bg-white rounded-xl shadow-xl border-2 border-gray-200 overflow-hidden transition-all duration-300`}
    >
      {/* Header */}
      <div
        className="p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ borderBottom: isExpanded ? '2px solid #E5E7EB' : 'none' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Overall Status Indicator */}
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: overallStatus.color }}
            />
            <span className="text-lg">{renderIcon(overallStatus.icon)}</span>
            <div>
              <div className="font-bold text-sm text-gray-900">Agent Control</div>
              <div className="text-xs text-gray-500">{overallStatus.message}</div>
            </div>
          </div>

          {/* Count Badge */}
          {showCount && (
            <div className="flex items-center space-x-2">
              <div
                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: overallStatus.color }}
              >
                {activeAgents.length}
              </div>
              <span
                className={`text-sm transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Agent List */}
      {isExpanded && (
        <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
          {visibleAgents.map((agent, index) => (
            <AgentStatusWidget
              key={`${agent.type}-${index}`}
              agentType={agent.type}
              agentName={agent.name}
              initialStatus={agent.status}
              size="sm"
              showDetails={false}
              realTimeUpdates={true}
            />
          ))}

          {!isExpanded && hiddenCount > 0 && (
            <div className="text-xs text-gray-500 text-center py-1">+{hiddenCount} more agents</div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {isExpanded && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors">
                Dashboard
              </button>
              <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600 transition-colors">
                Logs
              </button>
            </div>
            <div className="text-xs text-gray-500">Sprint Week Mode</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentActivityMonitor;
