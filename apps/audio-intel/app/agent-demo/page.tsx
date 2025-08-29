'use client';

import React, { useState } from 'react';
import AgentStatusWidget from '../../components/AgentStatusWidget';
import AgentActivityMonitor from '../../components/AgentActivityMonitor';
import AgentLoadingState from '../../components/AgentLoadingState';
import AgentCommandCenter from '../../components/AgentCommandCenter';
import { AGENT_COLOR_THEMES, AGENT_STATUS_STATES } from '../../lib/agent-color-system';

const AgentDemoPage: React.FC = () => {
  const [currentWorkflow, setCurrentWorkflow] = useState<'contact-processing' | 'email-campaign' | 'data-analysis' | 'content-generation'>('contact-processing');
  const [showLoadingState, setShowLoadingState] = useState(false);

  const handleWorkflowComplete = () => {
    setShowLoadingState(false);
    alert('Workflow completed successfully!');
  };

  const handleWorkflowError = (error: string) => {
    setShowLoadingState(false);
    alert(`Workflow error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Activity Monitor */}
      <AgentActivityMonitor position="relative" showCount={true} maxVisible={6} />
      
      {/* Header */}
      <div className="text-center mb-12 mt-8">
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          🤖 Agent Visualization System Demo
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the Total Audio Promo Agent Network with real-time color-coded status indicators, 
          interactive workflows, and Sprint Week optimized visual feedback.
        </p>
      </div>

      {/* Color Theme Showcase */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🎨 Agent Color Themes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(AGENT_COLOR_THEMES).map(([key, theme]) => (
            <div
              key={key}
              className="p-6 rounded-xl border-4 text-center transform hover:scale-105 transition-all duration-300"
              style={{
                background: theme.background,
                borderColor: theme.primary
              }}
            >
              <div className="text-4xl mb-3">{theme.icon}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: theme.text }}>
                {theme.description}
              </h3>
              <div className="text-sm opacity-90" style={{ color: theme.text }}>
                Primary: {theme.primary}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Status Widget Showcase */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">📊 Agent Status Widgets</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Different Sizes & States</h3>
          <div className="space-y-6">
            {/* Small Size */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Small Size</h4>
              <div className="flex flex-wrap gap-3">
                {Object.keys(AGENT_STATUS_STATES).map((status, index) => (
                  <AgentStatusWidget
                    key={status}
                    agentType={['reddit-monitor', 'contact-agent', 'email-scheduler', 'music-tech-agent', 'brand-validator', 'performance-tracker'][index]}
                    agentName={`Agent ${index + 1}`}
                    initialStatus={status as keyof typeof AGENT_STATUS_STATES}
                    size="sm"
                    showDetails={false}
                    realTimeUpdates={false}
                  />
                ))}
              </div>
            </div>

            {/* Medium Size */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Medium Size</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AgentStatusWidget
                  agentType="reddit-monitor"
                  agentName="Reddit Monitor"
                  initialStatus="active"
                  size="md"
                  realTimeUpdates={true}
                />
                <AgentStatusWidget
                  agentType="contact-agent"
                  agentName="Contact Enrichment"
                  initialStatus="processing"
                  size="md"
                  realTimeUpdates={true}
                />
              </div>
            </div>

            {/* Large Size */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Large Size</h4>
              <div className="max-w-md">
                <AgentStatusWidget
                  agentType="orchestrator"
                  agentName="Master Orchestrator"
                  initialStatus="active"
                  size="lg"
                  realTimeUpdates={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Demo */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">⚡ Workflow Processing Demo</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600 mb-4">
              Choose a workflow to see agents working together in real-time
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                { key: 'contact-processing', label: '📇 Contact Processing', desc: 'Validate, enrich & organize contacts' },
                { key: 'email-campaign', label: '📧 Email Campaign', desc: 'Generate & send personalized emails' },
                { key: 'data-analysis', label: '📈 Data Analysis', desc: 'Analyze performance metrics' },
                { key: 'content-generation', label: '✨ Content Generation', desc: 'Create viral content' }
              ].map((workflow) => (
                <button
                  key={workflow.key}
                  onClick={() => setCurrentWorkflow(workflow.key as any)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    currentWorkflow === workflow.key
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-sm">{workflow.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{workflow.desc}</div>
                </button>
              ))}
            </div>

            {!showLoadingState ? (
              <button
                onClick={() => setShowLoadingState(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🚀 Start {currentWorkflow.replace('-', ' ').toUpperCase()} Workflow
              </button>
            ) : (
              <button
                onClick={() => setShowLoadingState(false)}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                ❌ Stop Workflow
              </button>
            )}
          </div>

          {showLoadingState && (
            <div className="mt-8">
              <AgentLoadingState
                workflow={currentWorkflow}
                onComplete={handleWorkflowComplete}
                onError={handleWorkflowError}
              />
            </div>
          )}
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">📚 Implementation Guide</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Core Components</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Agent Color System</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Status Widgets</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Activity Monitor</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Loading States</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Dashboard View</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Real-time Updates</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔧 Usage Examples</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-gray-100 p-3 rounded-lg font-mono">
                  <div className="text-blue-600">&lt;AgentStatusWidget</div>
                  <div className="ml-4">agentType="reddit-monitor"</div>
                  <div className="ml-4">agentName="Reddit Monitor"</div>
                  <div className="ml-4">initialStatus="active" /&gt;</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg font-mono">
                  <div className="text-blue-600">&lt;AgentActivityMonitor</div>
                  <div className="ml-4">position="fixed"</div>
                  <div className="ml-4">showCount={'{true}'} /&gt;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Command Center Demo */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🎛️ Agent Command Center</h2>
        <div className="space-y-6">
          {/* Full Command Center */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Full Command Center</h3>
            <AgentCommandCenter 
              title="🤖 Sprint Week Command Center"
              showHeader={true}
              compactMode={false}
            />
          </div>

          {/* Compact Version */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Compact Mode</h3>
            <div className="max-w-md">
              <AgentCommandCenter 
                title="Agent Control"
                showHeader={false}
                compactMode={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">✨ Sprint Week Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Live status changes and activity monitoring</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Color-coded System</h3>
            <p className="text-gray-600">Instant visual identification of agent types</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Tracking</h3>
            <p className="text-gray-600">Monitor agent performance and workflow progress</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgentDemoPage;