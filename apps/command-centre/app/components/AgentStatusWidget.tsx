'use client';

import React, { useState, useEffect } from 'react';
import { agentColorUtils, AGENT_STATUS_STATES } from '@/lib/agent-color-system';

interface AgentStatusWidgetProps {
  agentType: string;
  agentName: string;
  initialStatus?: keyof typeof AGENT_STATUS_STATES;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  realTimeUpdates?: boolean;
}

const AgentStatusWidget: React.FC<AgentStatusWidgetProps> = ({
  agentType,
  agentName,
  initialStatus = 'idle',
  showDetails = true,
  size = 'md',
  realTimeUpdates = true
}) => {
  const [status, setStatus] = useState<keyof typeof AGENT_STATUS_STATES>(initialStatus);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'p-2 text-xs',
      indicator: 'w-2 h-2',
      icon: 'text-sm',
      text: 'text-xs'
    },
    md: {
      container: 'p-3 text-sm',
      indicator: 'w-3 h-3',
      icon: 'text-base',
      text: 'text-sm'
    },
    lg: {
      container: 'p-4 text-base',
      indicator: 'w-4 h-4',
      icon: 'text-lg',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size];

  // Simulate status changes for demo
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const statuses = Object.keys(AGENT_STATUS_STATES) as (keyof typeof AGENT_STATUS_STATES)[];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        setStatus(newStatus);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const theme = agentColorUtils.getAgentTheme(agentType);
  const statusIndicator = agentColorUtils.generateStatusIndicator(agentType, status);
  const styling = agentColorUtils.getAgentCardClasses(agentType, status);

  return (
    <div
      className={`inline-flex items-center space-x-2 rounded-lg border-2 transition-all duration-300 ${config.container}`}
      style={{
        backgroundColor: theme.secondary,
        borderColor: theme.primary,
        boxShadow: statusIndicator.indicator.animation !== 'none' 
          ? `0 0 10px ${theme.primary}40` 
          : `0 2px 8px ${theme.primary}20`
      }}
    >
      {/* Status Indicator Dot */}
      <div
        className={`${config.indicator} rounded-full flex-shrink-0`}
        style={statusIndicator.indicator}
      />

      {/* Agent Icon */}
      <span className={config.icon}>{theme.icon}</span>

      {/* Agent Info */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${config.text}`} style={{ color: theme.accent }}>
          {agentName}
        </div>
        
        {showDetails && (
          <div className="flex items-center space-x-2">
            <span className={`opacity-75 ${config.text}`} style={{ color: theme.accent }}>
              {statusIndicator.message}
            </span>
            {size !== 'sm' && (
              <span className={`opacity-50 text-xs`} style={{ color: theme.accent }}>
                {lastUpdate}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Status Icon */}
      <span className={config.icon}>{statusIndicator.icon}</span>
    </div>
  );
};

export default AgentStatusWidget;