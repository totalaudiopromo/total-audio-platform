'use client';

import React, { useState } from 'react';

// Simple agent demo page for Command Centre
const AgentDemoPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const agents = [
    {
      id: 'user-acquisition',
      name: 'User Acquisition Agent',
      icon: '🎯',
      description: 'Helps with customer acquisition strategies and campaigns',
    },
    {
      id: 'social-content',
      name: 'Social Content Agent',
      icon: '📱',
      description: 'Creates and optimizes social media content',
    },
    {
      id: 'email-marketing',
      name: 'Email Marketing Agent',
      icon: '📧',
      description: 'Manages email campaigns and automation',
    },
    {
      id: 'analytics',
      name: 'Analytics Agent',
      icon: '📊',
      description: 'Analyzes data and provides insights',
    },
    {
      id: 'content-strategy',
      name: 'Content Strategy Agent',
      icon: '📝',
      description: 'Develops content strategies and calendars',
    },
    {
      id: 'seo-optimization',
      name: 'SEO Optimization Agent',
      icon: '🔍',
      description: 'Optimizes content for search engines',
    },
    {
      id: 'competitor-analysis',
      name: 'Competitor Analysis Agent',
      icon: '🔬',
      description: 'Monitors competitors and market trends',
    },
    {
      id: 'revenue-optimization',
      name: 'Revenue Optimization Agent',
      icon: '💰',
      description: 'Identifies revenue opportunities and optimization',
    },
  ];

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    setResponse('');
  };

  const handleSubmit = async () => {
    if (!selectedAgent || !userInput.trim()) return;

    setResponse('🤖 Agent is thinking...');

    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: selectedAgent,
          message: userInput,
          context: 'Command Centre personal use',
        }),
      });

      const data = await response.json();
      setResponse(data.response || 'No response from agent');
    } catch (error) {
      setResponse('❌ Error connecting to agent. Make sure the API is running.');
    }
  };

  return (
    <div className="postcraft-page">
      {/* Header */}
      <div className="postcraft-header mb-8">
        <div>
          <h1 className="postcraft-title mb-2">🤖 AI Agent Command Centre</h1>
          <p className="postcraft-subtitle">Your personal AI assistants for business growth</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Agent Selection */}
        <div className="postcraft-section">
          <h2 className="postcraft-section-title mb-6">Select Your Agent</h2>
          <div className="space-y-3">
            {agents.map(agent => (
              <button
                key={agent.id}
                onClick={() => handleAgentSelect(agent.id)}
                className={`w-full p-4 postcraft-card text-left transition-all ${
                  selectedAgent === agent.id
                    ? 'ring-4 ring-blue-500 bg-blue-50'
                    : 'hover:translate-x-1 hover:translate-y-1'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{agent.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-gray-900">{agent.name}</h3>
                    <p className="postcraft-text text-sm">{agent.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="postcraft-section">
          <h2 className="postcraft-section-title mb-6">Chat with Agent</h2>

          {selectedAgent ? (
            <div className="space-y-6">
              <div className="postcraft-card bg-blue-50 border-blue-500">
                <p className="postcraft-text">
                  <strong className="font-black">Selected:</strong>{' '}
                  {agents.find(a => a.id === selectedAgent)?.name}
                </p>
              </div>

              <div>
                <label className="postcraft-label mb-3">Your message:</label>
                <textarea
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder="Ask your agent anything..."
                  className="w-full p-4 border-3 border-black rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all"
                  rows={4}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="postcraft-button w-full"
              >
                Send to Agent
              </button>

              {response && (
                <div className="postcraft-card bg-gray-50">
                  <h3 className="postcraft-label mb-3">Agent Response:</h3>
                  <div className="postcraft-text whitespace-pre-wrap">{response}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="postcraft-card text-center py-12">
              <p className="postcraft-text text-gray-500">
                Select an agent above to start chatting
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Agent Capabilities */}
      <div className="postcraft-section mt-8">
        <h2 className="postcraft-section-title mb-6">What These Agents Can Help With</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="postcraft-card">
            <h3 className="font-black text-gray-900 mb-3">🎯 User Acquisition</h3>
            <ul className="postcraft-text space-y-2">
              <li>• Lead generation strategies</li>
              <li>• Campaign optimization</li>
              <li>• Conversion tracking</li>
              <li>• Customer journey mapping</li>
            </ul>
          </div>
          <div className="postcraft-card">
            <h3 className="font-black text-gray-900 mb-3">📱 Social Content</h3>
            <ul className="postcraft-text space-y-2">
              <li>• Content calendar planning</li>
              <li>• Platform optimization</li>
              <li>• Engagement strategies</li>
              <li>• Viral content ideas</li>
            </ul>
          </div>
          <div className="postcraft-card">
            <h3 className="font-black text-gray-900 mb-3">📧 Email Marketing</h3>
            <ul className="postcraft-text space-y-2">
              <li>• Email sequence design</li>
              <li>• Subject line optimization</li>
              <li>• Segmentation strategies</li>
              <li>• Automation workflows</li>
            </ul>
          </div>
          <div className="postcraft-card">
            <h3 className="font-black text-gray-900 mb-3">📊 Analytics & Insights</h3>
            <ul className="postcraft-text space-y-2">
              <li>• Performance analysis</li>
              <li>• KPI tracking</li>
              <li>• Trend identification</li>
              <li>• ROI optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDemoPage;
