'use client';

import React, { useState, useEffect } from 'react';
import {
  agentColorUtils,
  AGENT_CATEGORIES,
  AGENT_STATUS_STATES,
  AGENT_COLOR_THEMES,
} from '../lib/agent-color-system';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: keyof typeof AGENT_STATUS_STATES;
  lastActivity: string;
  currentTask?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  performance: number;
  category: string;
}

interface AgentLogEntry {
  id: string;
  timestamp: string;
  agentType: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  styling: any;
}

const AgentVisualizationDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Reddit Monitor',
      type: 'reddit-monitor',
      status: 'active',
      lastActivity: '2 minutes ago',
      currentTask: 'Scanning WeAreTheMusicMakers for opportunities',
      priority: 'high',
      performance: 92,
      category: 'Growth & Marketing',
    },
    {
      id: '2',
      name: 'Contact Enrichment',
      type: 'contact-agent',
      status: 'processing',
      lastActivity: '5 minutes ago',
      currentTask: 'Processing 1,247 contacts for industry intelligence',
      priority: 'critical',
      performance: 88,
      category: 'Data & Analytics',
    },
    {
      id: '3',
      name: 'Email Scheduler',
      type: 'email-scheduler',
      status: 'completed',
      lastActivity: '15 minutes ago',
      currentTask: 'Sent 340 personalised follow-up emails',
      priority: 'medium',
      performance: 94,
      category: 'Growth & Marketing',
    },
    {
      id: '4',
      name: 'Music Tech Agent',
      type: 'music-tech-agent',
      status: 'idle',
      lastActivity: '1 hour ago',
      priority: 'low',
      performance: 85,
      category: 'Music Industry',
    },
    {
      id: '5',
      name: 'Brand Validator',
      type: 'brand-validator',
      status: 'warning',
      lastActivity: '30 minutes ago',
      currentTask: 'Detected inconsistent colour usage in UI components',
      priority: 'high',
      performance: 76,
      category: 'System Operations',
    },
    {
      id: '6',
      name: 'Performance Tracker',
      type: 'performance-tracker',
      status: 'active',
      lastActivity: '1 minute ago',
      currentTask: 'Monitoring system performance across all agents',
      priority: 'critical',
      performance: 98,
      category: 'System Operations',
    },
  ]);

  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      // Randomly update agent statuses
      setAgents(prev =>
        prev.map(agent => {
          const shouldUpdate = Math.random() > 0.7;
          if (!shouldUpdate) return agent;

          const statuses = Object.keys(AGENT_STATUS_STATES) as (keyof typeof AGENT_STATUS_STATES)[];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

          // Add log entry for status change
          if (randomStatus !== agent.status) {
            const logEntry = agentColorUtils.generateLogEntry(
              agent.type,
              `Status changed from ${agent.status} to ${randomStatus}`,
              randomStatus === 'error' ? 'error' : randomStatus === 'warning' ? 'warning' : 'info'
            );

            setLogs(prev =>
              [
                {
                  id: Date.now().toString(),
                  ...logEntry,
                },
                ...prev,
              ].slice(0, 50)
            );
          }

          return {
            ...agent,
            status: randomStatus,
            lastActivity: 'Just now',
            performance: Math.max(
              60,
              Math.min(100, agent.performance + (Math.random() - 0.5) * 10)
            ),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const filteredAgents = selectedCategory
    ? agents.filter(agent => agent.category === selectedCategory)
    : agents;

  const getAgentCard = (agent: Agent) => {
    const styling = agentColorUtils.getAgentCardClasses(agent.type, agent.status);
    const statusIndicator = agentColorUtils.generateStatusIndicator(agent.type, agent.status);
    const priorityStyle = agentColorUtils.getPriorityStyle(agent.priority);

    return (
      <div
        key={agent.id}
        className="relative p-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
        style={{
          ...styling.cardStyle,
          border: priorityStyle.border,
          boxShadow: `${styling.cardStyle.boxShadow}, ${priorityStyle.glow}`,
        }}
      >
        {/* Priority Badge */}
        <div
          className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: priorityStyle.badgeColor }}
        >
          {priorityStyle.badge}
        </div>

        {/* Agent Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ backgroundColor: styling.secondaryColor }}
            >
              {statusIndicator.theme.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg" style={{ color: styling.textColor }}>
                {agent.name}
              </h3>
              <p className="text-sm opacity-80" style={{ color: styling.textColor }}>
                {statusIndicator.theme.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div style={statusIndicator.indicator}></div>
            <span className="text-lg">{statusIndicator.icon}</span>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1" style={{ color: styling.textColor }}>
            <span>Performance</span>
            <span>{agent.performance}%</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${agent.performance}%`,
                backgroundColor: styling.textColor,
              }}
            />
          </div>
        </div>

        {/* Current Task */}
        {agent.currentTask && (
          <div className="mb-3">
            <p className="text-sm font-medium" style={{ color: styling.textColor }}>
              Current Task:
            </p>
            <p className="text-sm opacity-90 mt-1" style={{ color: styling.textColor }}>
              {agent.currentTask}
            </p>
          </div>
        )}

        {/* Status Message */}
        <div
          className="flex items-center justify-between text-sm"
          style={{ color: styling.textColor }}
        >
          <span>{statusIndicator.message}</span>
          <span className="opacity-70">{agent.lastActivity}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-2">🤖 Agent Visualization System</h1>
        <p className="text-lg text-gray-600">
          Real-time monitoring of all Total Audio Promo agents during Sprint Week
        </p>

        {/* Controls */}
        <div className="flex items-center space-x-4 mt-4">
          <button
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              realTimeUpdates ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            {realTimeUpdates ? '🔴 Live Updates ON' : '⏸️ Live Updates OFF'}
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
            <select
              value={selectedCategory || ''}
              onChange={e => setSelectedCategory(e.target.value || null)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            >
              <option value="">All Categories</option>
              {Object.keys(AGENT_CATEGORIES).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(AGENT_CATEGORIES).map(([category, config]) => {
          const categoryAgents = agents.filter(agent => agent.category === category);
          const activeCount = categoryAgents.filter(agent => agent.status === 'active').length;

          return (
            <div
              key={category}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedCategory === category
                  ? 'ring-4 ring-blue-500 transform scale-105'
                  : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: config.color + '20',
                border: `2px solid ${config.color}`,
              }}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{config.icon}</span>
                <h3 className="font-bold text-lg" style={{ color: config.color }}>
                  {category}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {categoryAgents.length} agents • {activeCount} active
              </p>
            </div>
          );
        })}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredAgents.map(getAgentCard)}
      </div>

      {/* Color Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎨 Color Legend</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(AGENT_COLOR_THEMES).map(([key, theme]) => (
            <div
              key={key}
              className="p-3 rounded-lg border-2"
              style={{
                background: theme.background,
                borderColor: theme.primary,
              }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{theme.icon}</span>
                <span className="font-bold text-sm" style={{ color: theme.text }}>
                  {theme.description}
                </span>
              </div>
              <div className="text-xs opacity-90" style={{ color: theme.text }}>
                {theme.primary}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Log */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Real-time Activity Log</h2>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No activity logs yet...</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-3 rounded-lg" style={log.styling}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: log.styling.levelColor }}
                    />
                    <span className="font-medium">{log.agentType}</span>
                    <span className="text-sm">{log.message}</span>
                  </div>
                  <span className="text-xs opacity-70">{log.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentVisualizationDashboard;
