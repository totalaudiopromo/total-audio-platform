import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface AgentHealth {
  orchestrator: {
    status: string;
    uptime: number;
    workflows: number;
  };
  agents: Record<string, any>;
}

interface Workflow {
  name: string;
  description: string;
  steps: number;
}

export default function AgentsPage() {
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agents/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Failed to fetch agent health:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/agents/workflows');
      const data = await response.json();
      setWorkflows(data);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    }
  };

  const executeWorkflow = async (workflowName: string) => {
    try {
      setExecuting(workflowName);
      setResults(null);
      const response = await fetch(`/api/agents/workflows/${workflowName}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      setResults({ error: 'Failed to execute workflow' });
    } finally {
      setExecuting(null);
    }
  };

  const runMaintenance = async () => {
    try {
      setExecuting('maintenance');
      setResults(null);
      const response = await fetch('/api/agents/maintenance', {
        method: 'POST',
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Failed to run maintenance:', error);
      setResults({ error: 'Failed to run maintenance' });
    } finally {
      setExecuting(null);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchWorkflows();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Management</h1>
          <p className="text-gray-600">Monitor and control the automated agent system</p>
        </div>

        {/* System Health */}
        <Card className="mb-8 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">System Health</h2>
            <Button onClick={fetchHealth} disabled={loading}>
              {loading ? 'Checking...' : 'Refresh'}
            </Button>
          </div>
          
          {health && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900">Orchestrator</h3>
                <p className={`text-sm ${health.orchestrator.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {health.orchestrator.status}
                </p>
                <p className="text-sm text-gray-600">
                  Uptime: {Math.round(health.orchestrator.uptime)}s
                </p>
                <p className="text-sm text-gray-600">
                  Workflows: {health.orchestrator.workflows}
                </p>
              </div>
              
              {Object.entries(health.agents).map(([name, status]) => (
                <div key={name} className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-900 capitalize">{name} Agent</h3>
                  <p className={`text-sm ${(status as any).status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {(status as any).status || 'unknown'}
                  </p>
                  {(status as any).message && (
                    <p className="text-sm text-gray-600">{(status as any).message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={runMaintenance}
              disabled={executing === 'maintenance'}
              variant="outline"
            >
              {executing === 'maintenance' ? 'Running...' : 'Run Maintenance'}
            </Button>
            <Button 
              onClick={fetchHealth}
              disabled={loading}
              variant="outline"
            >
              System Health Check
            </Button>
          </div>
        </Card>

        {/* Available Workflows */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Available Workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((workflow) => (
              <div key={workflow.name} className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">{workflow.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{workflow.steps} steps</span>
                  <Button
                    size="sm"
                    onClick={() => executeWorkflow(workflow.name)}
                    disabled={executing === workflow.name}
                  >
                    {executing === workflow.name ? 'Running...' : 'Execute'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Execution Results */}
        {results && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Execution Results</h2>
            <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
              <pre className="text-sm">{JSON.stringify(results, null, 2)}</pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}