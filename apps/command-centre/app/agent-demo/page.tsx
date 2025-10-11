'use client';

import React, { useState } from 'react';

// Simple agent demo page for Command Centre
const AgentDemoPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const agents = [
    { id: 'user-acquisition', name: 'User Acquisition Agent', color: 'bg-blue-500', description: 'Helps with customer acquisition strategies and campaigns' },
    { id: 'social-content', name: 'Social Content Agent', color: 'bg-green-500', description: 'Creates and optimizes social media content' },
    { id: 'email-marketing', name: 'Email Marketing Agent', color: 'bg-purple-500', description: 'Manages email campaigns and automation' },
    { id: 'analytics', name: 'Analytics Agent', color: 'bg-orange-500', description: 'Analyzes data and provides insights' },
    { id: 'content-strategy', name: 'Content Strategy Agent', color: 'bg-pink-500', description: 'Develops content strategies and calendars' },
    { id: 'seo-optimization', name: 'SEO Optimization Agent', color: 'bg-indigo-500', description: 'Optimizes content for search engines' },
    { id: 'competitor-analysis', name: 'Competitor Analysis Agent', color: 'bg-red-500', description: 'Monitors competitors and market trends' },
    { id: 'revenue-optimization', name: 'Revenue Optimization Agent', color: 'bg-yellow-500', description: 'Identifies revenue opportunities and optimization' }
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
          context: 'Command Centre personal use'
        })
      });

      const data = await response.json();
      setResponse(data.response || 'No response from agent');
    } catch (error) {
      setResponse('❌ Error connecting to agent. Make sure the API is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 AI Agent Command Centre</h1>
          <p className="text-xl text-gray-600">Your personal AI assistants for business growth</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Agent Selection */}
          <div className="bg-white rounded-xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Agent</h2>
            <div className="grid grid-cols-1 gap-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAgent === agent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${agent.color}`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat with Agent</h2>
            
            {selectedAgent ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {agents.find(a => a.id === selectedAgent)?.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your message:
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask your agent anything..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Send to Agent
                </button>

                {response && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Agent Response:</h3>
                    <div className="whitespace-pre-wrap text-gray-700">{response}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select an agent above to start chatting</p>
              </div>
            )}
          </div>
        </div>

        {/* Agent Capabilities */}
        <div className="mt-8 bg-white rounded-xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What These Agents Can Help With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border-4 border-black rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 User Acquisition</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Lead generation strategies</li>
                <li>• Campaign optimization</li>
                <li>• Conversion tracking</li>
                <li>• Customer journey mapping</li>
              </ul>
            </div>
            <div className="p-4 border-4 border-black rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📱 Social Content</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Content calendar planning</li>
                <li>• Platform optimization</li>
                <li>• Engagement strategies</li>
                <li>• Viral content ideas</li>
              </ul>
            </div>
            <div className="p-4 border-4 border-black rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📧 Email Marketing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Email sequence design</li>
                <li>• Subject line optimization</li>
                <li>• Segmentation strategies</li>
                <li>• Automation workflows</li>
              </ul>
            </div>
            <div className="p-4 border-4 border-black rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Analytics & Insights</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Performance analysis</li>
                <li>• KPI tracking</li>
                <li>• Trend identification</li>
                <li>• ROI optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDemoPage;