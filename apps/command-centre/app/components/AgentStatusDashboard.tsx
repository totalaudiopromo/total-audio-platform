'use client';

import React from 'react';
import '../intel-design.css';

interface Agent {
  name: string;
  status: 'fully-functional' | 'partial' | 'mock' | 'dormant';
  description: string;
  category: 'intel' | 'production' | 'partial' | 'mock' | 'parked';
}

const agentData: Agent[] = [
  // BLUE - Intel-related
  {
    name: 'contact-agent.js',
    status: 'partial',
    description: 'Enrichment incomplete',
    category: 'intel'
  },
  {
    name: 'database-agent.js',
    status: 'fully-functional',
    description: 'Fully functional',
    category: 'intel'
  },
  {
    name: 'audio-intel-content-agent.js',
    status: 'fully-functional',
    description: 'Content generation ready',
    category: 'intel'
  },
  
  // GREEN - Production Ready
  {
    name: 'integration-agent-real.js',
    status: 'fully-functional',
    description: 'Live integrations',
    category: 'production'
  },
  {
    name: 'orchestrator-real.js',
    status: 'fully-functional',
    description: 'Production orchestration',
    category: 'production'
  },
  {
    name: 'newsjacking-agent.js',
    status: 'fully-functional',
    description: 'News monitoring active',
    category: 'production'
  },
  {
    name: 'notion-health-check.js',
    status: 'fully-functional',
    description: 'API integration live',
    category: 'production'
  },
  
  // AMBER - Partially Working
  {
    name: 'campaign-agent.js',
    status: 'partial',
    description: 'Database works, integrations stubbed',
    category: 'partial'
  },
  {
    name: 'analytics-agent.js',
    status: 'partial',
    description: 'Framework exists, algorithms minimal',
    category: 'partial'
  },
  
  // RED - Mock/Stub Only
  {
    name: 'integration-agent.js',
    status: 'mock',
    description: 'Mock responses only',
    category: 'mock'
  },
  {
    name: 'social-media-agent.js',
    status: 'mock',
    description: 'No implementation',
    category: 'mock'
  },
  {
    name: 'content-generation-agent.js',
    status: 'mock',
    description: 'Structure only',
    category: 'mock'
  },
  
  // GREY - Parked (moved to parked/ directory)
  {
    name: 'music-marketing-mastermind.js',
    status: 'dormant',
    description: 'Moved to parked/',
    category: 'parked'
  },
  {
    name: 'growth-hacking-optimizer.js',
    status: 'dormant',
    description: 'Moved to parked/',
    category: 'parked'
  },
  {
    name: 'viral-content-automation.js',
    status: 'dormant',
    description: 'Moved to parked/',
    category: 'parked'
  },
  {
    name: 'beta-user-acquisition-agent.js',
    status: 'dormant',
    description: 'Moved to parked/',
    category: 'parked'
  },
  {
    name: 'music-industry-strategist.js',
    status: 'dormant',
    description: 'Moved to parked/',
    category: 'parked'
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'intel':
      return 'bg-blue-100 border-blue-500 text-blue-800';
    case 'production':
      return 'bg-green-100 border-green-500 text-green-800';
    case 'partial':
      return 'bg-amber-100 border-amber-500 text-amber-800';
    case 'mock':
      return 'bg-red-100 border-red-500 text-red-800';
    case 'parked':
      return 'bg-gray-100 border-gray-500 text-gray-800';
    default:
      return 'bg-gray-100 border-gray-500 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  // Return a text label; UI uses color badges elsewhere for status
  switch (status) {
    case 'fully-functional':
      return 'OK';
    case 'partial':
      return 'Partial';
    case 'mock':
      return 'Mock';
    case 'dormant':
      return 'Dormant';
    default:
      return 'Unknown';
  }
};

const getCategoryTitle = (category: string) => {
  switch (category) {
    case 'intel':
      return 'Audio Intel Agents';
    case 'production':
      return 'Production Ready';
    case 'partial':
      return 'Partially Working';
    case 'mock':
      return 'Mock/Testing Only';
    case 'parked':
      return 'Parked Agents';
    default:
      return 'Unknown';
  }
};

export default function AgentStatusDashboard() {
  const categories = ['intel', 'production', 'partial', 'mock', 'parked'];
  
  const getAgentsByCategory = (category: string) => {
    return agentData.filter(agent => agent.category === category);
  };

  const getCategorySummary = () => {
    const summary = categories.map(category => ({
      category,
      count: getAgentsByCategory(category).length,
      functional: getAgentsByCategory(category).filter(a => a.status === 'fully-functional').length
    }));
    return summary;
  };

  return (
    <div className="intel-card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Agent Status Dashboard
        </h2>
        <p className="text-gray-600">
          Real-time status of all platform agents
        </p>
      </div>

      {/* Summary Cards */}
      <div className="intel-metrics mb-6">
        {getCategorySummary().map(({ category, count, functional }) => (
          <div
            key={category}
            className={`intel-metric ${getCategoryColor(category)}`}
          >
            <div className="text-center">
              <div className="intel-metric-value">{count}</div>
              <div className="intel-metric-label">
                {getCategoryTitle(category)}
              </div>
              {category !== 'parked' && (
                <div className="text-xs mt-1 text-gray-500">
                  {functional} functional
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Categories */}
      <div className="space-y-6">
        {categories.map(category => {
          const agents = getAgentsByCategory(category);
          return (
            <div key={category} className="intel-card">
              <h3 className={`text-lg font-semibold mb-3 ${getCategoryColor(category)} p-2 rounded`}>
                {getCategoryTitle(category)} ({agents.length})
              </h3>
              
              <div className="intel-grid intel-grid-3">
                {agents.map(agent => (
                  <div
                    key={agent.name}
                    className={`intel-card ${getCategoryColor(agent.category)} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium truncate">
                        {agent.name.replace('.js', '')}
                      </div>
                      <div className="text-lg">
                        {getStatusIcon(agent.status)}
                      </div>
                    </div>
                    <div className="text-xs">
                      {agent.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="mt-8 intel-card">
        <h4 className="text-sm font-semibold mb-2">Status Legend</h4>
        <div className="intel-grid intel-grid-4">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span>Fully Functional</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
            <span>Partial Implementation</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            <span>Mock/Testing Only</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
            <span>Dormant/Parked</span>
          </div>
        </div>
      </div>
    </div>
  );
}