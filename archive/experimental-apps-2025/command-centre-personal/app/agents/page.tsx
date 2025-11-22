'use client';

import React from 'react';
import { Bot, Zap, Activity, BarChart3 } from 'lucide-react';

export default function AgentsPage() {
  return (
    <div className="postcraft-page">
      {/* Header */}
      <div className="postcraft-header mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="postcraft-title mb-1">Agent Automation Dashboard</h1>
            <p className="postcraft-subtitle">Monitor and control your AI agent workflows</p>
          </div>
        </div>

        <div className="postcraft-status-badge">
          <div className="postcraft-status-dot"></div>
          <span>31 agents active</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="postcraft-metrics-grid mb-8">
        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">31</div>
          <div className="postcraft-metric-label">Active Agents</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">1,247</div>
          <div className="postcraft-metric-label">Tasks Completed</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">94.2%</div>
          <div className="postcraft-metric-label">Success Rate</div>
        </div>

        <div className="postcraft-metric-card">
          <div className="postcraft-metric-icon bg-gradient-to-br from-orange-500 to-red-500">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="postcraft-metric-value">124h</div>
          <div className="postcraft-metric-label">Time Saved</div>
        </div>
      </div>

      {/* Agent Categories */}
      <div className="postcraft-section">
        <h2 className="postcraft-section-title mb-6">Agent Categories</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="postcraft-card">
            <h3 className="font-black text-xl text-gray-900 mb-3">🎯 Marketing Agents</h3>
            <p className="postcraft-text mb-4">
              Content creation, social media management, and campaign optimization agents working
              24/7.
            </p>
            <div className="postcraft-highlight">8 agents active</div>
          </div>

          <div className="postcraft-card">
            <h3 className="font-black text-xl text-gray-900 mb-3">📧 Email Automation</h3>
            <p className="postcraft-text mb-4">
              Gmail sorting, ConvertKit integration, and automated email response handling.
            </p>
            <div className="postcraft-highlight">5 agents active</div>
          </div>

          <div className="postcraft-card">
            <h3 className="font-black text-xl text-gray-900 mb-3">📊 Analytics & Insights</h3>
            <p className="postcraft-text mb-4">
              Business intelligence, revenue prediction, and performance monitoring agents.
            </p>
            <div className="postcraft-highlight">6 agents active</div>
          </div>

          <div className="postcraft-card">
            <h3 className="font-black text-xl text-gray-900 mb-3">🔍 Contact Intelligence</h3>
            <p className="postcraft-text mb-4">
              Contact enrichment, email validation, and data quality management for Audio Intel.
            </p>
            <div className="postcraft-highlight">4 agents active</div>
          </div>

          <div className="postcraft-card">
            <h3 className="font-black text-xl text-gray-900 mb-3">📱 Social Media</h3>
            <p className="postcraft-text mb-4">
              Twitter, LinkedIn, and BlueSky automation with scheduling and engagement tracking.
            </p>
            <div className="postcraft-highlight">3 agents active</div>
          </div>

          <div className="postcraft-card">
            <h3 className="font-black text-xl text-gray-900 mb-3">🎵 Radio Promotion</h3>
            <p className="postcraft-text mb-4">
              Campaign verification, contact management, and submission tracking for radio
              promotion.
            </p>
            <div className="postcraft-highlight">5 agents active</div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="postcraft-section mt-8">
        <div className="postcraft-card bg-blue-50 border-blue-500">
          <h3 className="font-black text-lg text-blue-900 mb-2">ℹ️ Agent Management</h3>
          <p className="postcraft-text text-blue-800">
            All agents are running autonomously in the background. Visit the{' '}
            <a href="/agent-demo" className="underline font-bold">
              Agent Demo page
            </a>{' '}
            to interact with specific agents directly.
          </p>
        </div>
      </div>
    </div>
  );
}
