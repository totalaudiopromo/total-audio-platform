'use client';

import React, { useState, useEffect } from 'react';
import { agentColorUtils, AGENT_CATEGORIES, AGENT_STATUS_STATES, AGENT_COLOR_THEMES } from '@/lib/agent-color-system';
import AgentStatusWidget from './AgentStatusWidget';
import AgentLoadingState from './AgentLoadingState';
import { CheckCircle, AlertTriangle, AlertCircle, BarChart3, Gamepad2, Rocket, Sparkles, ContactRound, Mail, TrendingUp, Calendar, Clock, Share2, Smartphone } from 'lucide-react';
// import SocialMediaScheduler from './SocialMediaScheduler';
// import UKSocialMediaHub from './UKSocialMediaHub';

interface CommandCenterProps {
  title?: string;
  showHeader?: boolean;
  compactMode?: boolean;
}

const AgentCommandCenter: React.FC<CommandCenterProps> = ({
  title = "🤖 Agent Command Center",
  showHeader = true,
  compactMode = false
}) => {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const [agents] = useState([
    {
      id: '1',
      name: 'Reddit Monitor',
      type: 'reddit-monitor',
      status: 'active' as const,
      category: 'Growth & Marketing',
      performance: 94,
      currentTask: 'Monitoring WeAreTheMusicMakers for opportunities',
      priority: 'high' as const
    },
    {
      id: '2', 
      name: 'Contact Enrichment',
      type: 'contact-agent',
      status: 'processing' as const,
      category: 'Data & Analytics',
      performance: 87,
      currentTask: 'Processing 2,341 contacts',
      priority: 'critical' as const
    },
    {
      id: '3',
      name: 'Email Scheduler',
      type: 'email-scheduler',
      status: 'completed' as const,
      category: 'Growth & Marketing',
      performance: 96,
      currentTask: 'Sent 340 personalized emails',
      priority: 'medium' as const
    },
    {
      id: '4',
      name: 'Music Tech Agent',
      type: 'music-tech-agent',
      status: 'idle' as const,
      category: 'Music Industry',
      performance: 82,
      priority: 'low' as const
    },
    {
      id: '5',
      name: 'Brand Validator',
      type: 'brand-validator',
      status: 'warning' as const,
      category: 'System Operations',
      performance: 71,
      currentTask: 'Color inconsistencies detected in UI',
      priority: 'high' as const
    },
    {
      id: '6',
      name: 'Performance Monitor',
      type: 'performance-tracker',
      status: 'active' as const,
      category: 'System Operations',
      performance: 99,
      currentTask: 'Monitoring all system metrics',
      priority: 'critical' as const
    },
           {
             id: '7',
             name: 'UK Social Media Hub',
             type: 'uk-social-hub',
             status: 'active' as const,
             category: 'Growth & Marketing',
             performance: 95,
             currentTask: 'Managing 16 posts across 5 platforms',
             priority: 'high' as const
           }
  ]);

  // System health calculation
  useEffect(() => {
    const errorCount = agents.filter(agent => agent.status === 'warning').length;
    const warningCount = agents.filter(agent => agent.status === 'warning').length;
    
    if (errorCount > 0) {
      setSystemStatus('critical');
    } else if (warningCount > 0) {
      setSystemStatus('warning'); 
    } else {
      setSystemStatus('healthy');
    }
    
    setLastUpdate(new Date().toLocaleTimeString());
  }, [agents]);

  const getSystemStatusConfig = () => {
    const configs = {
      healthy: {
        color: '#4CAF50',
        icon: 'check-circle',
        message: 'All Systems Operational',
        bgColor: '#E8F5E8'
      },
      warning: {
        color: '#FF9800', 
        icon: 'alert-triangle',
        message: 'Issues Detected',
        bgColor: '#FFF3E0'
      },
      critical: {
        color: '#F44336',
        icon: 'alert-circle',
        message: 'Critical Issues',
        bgColor: '#FFEBEE'
      }
    };
    return configs[systemStatus];
  };

  const statusConfig = getSystemStatusConfig();

  const renderStatusIcon = (iconName: string) => {
    switch (iconName) {
      case 'check-circle':
        return <CheckCircle className="w-6 h-6" />;
      case 'alert-triangle':
        return <AlertTriangle className="w-6 h-6" />;
      case 'alert-circle':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <span>•</span>;
    }
  };
  const filteredAgents = selectedCategory 
    ? agents.filter(agent => agent.category === selectedCategory)
    : agents;

  const workflowOptions = [
    { key: 'contact-processing', label: 'Contact Processing', desc: 'Validate & enrich contacts' },
    { key: 'email-campaign', label: 'Email Campaign', desc: 'Send personalized emails' },
    { key: 'data-analysis', label: 'Data Analysis', desc: 'Performance analytics' },
    { key: 'content-generation', label: 'Content Generation', desc: 'Create viral content' }
  ];

  if (compactMode) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 border-2" style={{ borderColor: statusConfig.color }}>
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: statusConfig.color }}
            />
            <span className="font-bold text-sm">{title}</span>
            <span className="text-xs text-gray-500">{statusConfig.message}</span>
          </div>
          <div className="text-xs text-gray-400">{lastUpdate}</div>
        </div>

        {/* Compact Agent Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredAgents.slice(0, 4).map((agent) => (
            <AgentStatusWidget
              key={agent.id}
              agentType={agent.type}
              agentName={agent.name}
              initialStatus={agent.status}
              size="sm"
              showDetails={false}
              realTimeUpdates={true}
            />
          ))}
        </div>

        {agents.length > 4 && (
          <div className="text-xs text-gray-500 text-center mt-2">
            +{agents.length - 4} more agents
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border-2 overflow-hidden" style={{ borderColor: statusConfig.color }}>
      {/* Header */}
      {showHeader && (
        <div 
          className="p-6 border-b-2"
          style={{ 
            backgroundColor: statusConfig.bgColor,
            borderBottomColor: statusConfig.color 
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-4 h-4 rounded-full animate-pulse"
                style={{ backgroundColor: statusConfig.color }}
              />
              <div>
                <h1 className="text-2xl font-black text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">Sprint Week Agent Control System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">{renderStatusIcon(statusConfig.icon)}</span>
                <span className="font-bold" style={{ color: statusConfig.color }}>
                  {statusConfig.message}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdate}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Category Filter */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {Object.keys(AGENT_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open('/agent-dashboard', '_blank')}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />Full Dashboard
            </button>
            <button
              onClick={() => window.open('/agent-demo', '_blank')}
              className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Gamepad2 className="w-4 h-4 inline mr-2" />Demo Mode
            </button>
          </div>
        </div>

        {/* Agent Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredAgents.map((agent) => {
            const theme = agentColorUtils.getAgentTheme(agent.type);
            const priorityStyle = agentColorUtils.getPriorityStyle(agent.priority);
            
            return (
              <div
                key={agent.id}
                className="p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: theme.secondary,
                  borderColor: theme.primary,
                  boxShadow: agent.status === 'active' ? `0 0 15px ${theme.primary}30` : undefined,
                  ...priorityStyle
                }}
              >
                {/* Agent Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{theme.icon}</span>
                    <div>
                      <div className="font-bold text-sm" style={{ color: theme.accent }}>
                        {agent.name}
                      </div>
                      <div className="text-xs text-gray-500">{agent.category}</div>
                    </div>
                  </div>
                  <AgentStatusWidget
                    agentType={agent.type}
                    agentName=""
                    initialStatus={agent.status}
                    size="sm"
                    showDetails={false}
                    realTimeUpdates={true}
                  />
                </div>

                {/* Performance */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: theme.accent }}>
                    <span>Performance</span>
                    <span>{agent.performance}%</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${agent.performance}%`,
                        backgroundColor: theme.accent
                      }}
                    />
                  </div>
                </div>

                {/* Current Task */}
                {agent.currentTask && (
                  <div className="text-xs" style={{ color: theme.accent }}>
                    <strong>Task:</strong> {agent.currentTask}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Workflow Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4"><Rocket className="w-5 h-5 inline mr-2" />Quick Workflows</h3>
          
          {!activeWorkflow ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {workflowOptions.map((workflow) => (
                <button
                  key={workflow.key}
                  onClick={() => setActiveWorkflow(workflow.key)}
                  className="p-3 border-2 border-gray-300 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="font-bold text-sm mb-1">{workflow.label}</div>
                  <div className="text-xs text-gray-600">{workflow.desc}</div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">
                  Running Workflow: {workflowOptions.find(w => w.key === activeWorkflow)?.label}
                </h4>
                <button
                  onClick={() => setActiveWorkflow(null)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <AgentLoadingState
                workflow={activeWorkflow as any}
                onComplete={() => {
                  setActiveWorkflow(null);
                  alert('Workflow completed successfully!');
                }}
                onError={(error) => {
                  setActiveWorkflow(null);
                  alert(`Workflow error: ${error}`);
                }}
              />
            </div>
          )}
        </div>

               {/* UK Social Media Hub - Temporarily disabled */}
               {/* <div className="border-t border-gray-200 pt-6 mt-6">
                 <UKSocialMediaHub compact={compactMode} />
               </div> */}

        {/* System Stats */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-500">
                {agents.filter(a => a.status === 'active' || a.status === 'processing').length}
              </div>
              <div className="text-xs text-gray-600">Active Agents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {Math.round(agents.reduce((sum, a) => sum + a.performance, 0) / agents.length)}%
              </div>
              <div className="text-xs text-gray-600">Avg Performance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">
                {agents.filter(a => a.status === 'warning').length}
              </div>
              <div className="text-xs text-gray-600">Warnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {agents.filter(a => a.status === 'warning').length}
              </div>
              <div className="text-xs text-gray-600">Errors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCommandCenter;