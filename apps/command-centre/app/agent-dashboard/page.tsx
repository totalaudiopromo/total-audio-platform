'use client';

import React from 'react';
import AgentVisualizationDashboard from '../components/AgentVisualizationDashboard';
import AgentActivityMonitor from '../components/AgentActivityMonitor';

const AgentDashboardPage: React.FC = () => {
  return (
    <>
      {/* Floating Activity Monitor */}
      <AgentActivityMonitor position="fixed" showCount={true} maxVisible={4} />
      
      {/* Main Dashboard */}
      <AgentVisualizationDashboard />
    </>
  );
};

export default AgentDashboardPage;