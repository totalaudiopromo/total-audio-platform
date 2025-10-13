'use client';

import React from 'react';
import { Activity, Bot, CheckCircle, Clock, Zap } from 'lucide-react';

const AgentDashboardPage: React.FC = () => {
  const agentStats = [
    { name: 'Social Media Agent', status: 'active', tasks: 47, success: 98 },
    { name: 'Email Marketing Agent', status: 'active', tasks: 32, success: 100 },
    { name: 'Content Strategy Agent', status: 'active', tasks: 28, success: 96 },
    { name: 'Analytics Agent', status: 'idle', tasks: 15, success: 93 },
    { name: 'SEO Optimization Agent', status: 'active', tasks: 21, success: 95 },
  ];

  return (
    <div className="postcraft-page">
      {/* Header */}
      <div className="postcraft-header mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="postcraft-title mb-1">Agent Activity Dashboard</h1>
            <p className="postcraft-subtitle">Real-time monitoring and performance metrics</p>
          </div>
        </div>

        <div className="postcraft-status-badge">
          <div className="postcraft-status-dot"></div>
          <span>Live monitoring</span>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="postcraft-metrics-grid mb-8">
        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">143</div>
          <div className="postcraft-metric-label">Tasks Today</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">5/5</div>
          <div className="postcraft-metric-label">Agents Online</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">96.4%</div>
          <div className="postcraft-metric-label">Avg Success</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-orange-500 to-red-500">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">2.3h</div>
          <div className="postcraft-metric-label">Avg Response</div>
        </div>
      </div>

      {/* Agent Status Table */}
      <div className="postcraft-section">
        <h2 className="postcraft-section-title mb-6">Active Agents</h2>

        <div className="space-y-4">
          {agentStats.map((agent, index) => (
            <div key={index} className="postcraft-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-3 border-black ${
                    agent.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Bot className={`w-6 h-6 ${agent.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-gray-900">{agent.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="postcraft-text text-sm">
                        <strong>{agent.tasks}</strong> tasks completed
                      </span>
                      <span className="postcraft-text text-sm">
                        <strong>{agent.success}%</strong> success rate
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm ${
                  agent.status === 'active'
                    ? 'bg-green-100 text-green-900'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {agent.status === 'active' ? '● Active' : '○ Idle'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="postcraft-section mt-8">
        <h2 className="postcraft-section-title mb-6">Recent Activity</h2>

        <div className="postcraft-card">
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b-2 border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-bold text-gray-900">Social Media Agent completed content calendar</p>
                <p className="postcraft-text text-sm">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b-2 border-gray-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-bold text-gray-900">Email Marketing Agent sent 47 automated emails</p>
                <p className="postcraft-text text-sm">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b-2 border-gray-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-bold text-gray-900">Content Strategy Agent generated new blog topics</p>
                <p className="postcraft-text text-sm">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-bold text-gray-900">SEO Optimization Agent analyzed 23 pages</p>
                <p className="postcraft-text text-sm">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboardPage;
