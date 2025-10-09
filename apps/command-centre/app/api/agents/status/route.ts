import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * GET /api/agents/status - Get automation agent health status
 *
 * Returns:
 * - All agent statuses
 * - Cost tracking data
 * - Health metrics
 * - Time saved calculations
 */
export async function GET() {
  try {
    // Run health check script
    const agentsPath = path.join(process.cwd(), '..', '..', 'tools', 'agents');
    const healthCheckScript = path.join(agentsPath, 'check-all-agents.js');

    const { stdout } = await execAsync(`node "${healthCheckScript}"`, {
      timeout: 30000,  // 30 second timeout
      cwd: agentsPath
    });

    // Try to parse JSON output from health check
    const lines = stdout.trim().split('\n');
    const jsonLines = lines.filter(line => line.startsWith('{') || line.includes('"'));

    // For now, return a structured response based on status files
    const statusData = await getAgentStatusData(agentsPath);

    return NextResponse.json({
      success: true,
      ...statusData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[API] Health check error:', error);

    // Fallback: try to read status files directly
    try {
      const agentsPath = path.join(process.cwd(), '..', '..', 'tools', 'agents');
      const statusData = await getAgentStatusData(agentsPath);

      return NextResponse.json({
        success: true,
        warning: 'Health check script failed, using fallback',
        ...statusData,
        timestamp: new Date().toISOString()
      });

    } catch (fallbackError) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  }
}

/**
 * Read agent status data directly from status files
 */
async function getAgentStatusData(agentsPath: string) {
  const { readdir, readFile } = await import('fs/promises');
  const os = await import('os');

  const statusDir = path.join(os.homedir(), '.total-audio-status');
  const costsDir = path.join(os.homedir(), '.total-audio-costs');

  // Read all agent status files
  let agents: any[] = [];
  try {
    const files = await readdir(statusDir);
    const statusFiles = files.filter(f => f.endsWith('-status.json'));

    for (const file of statusFiles) {
      const filepath = path.join(statusDir, file);
      const data = await readFile(filepath, 'utf8');
      const status = JSON.parse(data);

      // Calculate age
      const lastUpdate = new Date(status.lastUpdate);
      const ageHours = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);

      agents.push({
        ...status,
        age: Math.round(ageHours * 10) / 10
      });
    }
  } catch (error) {
    console.error('Error reading status files:', error);
  }

  // Read cost data
  let costs: any = {
    today: { total: 0 },
    month: {
      total: 0,
      budget: 150,
      remaining: 150,
      percentUsed: 0,
      projectedTotal: 0
    },
    services: {}
  };

  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const costFile = path.join(costsDir, `costs-${currentMonth}.json`);
    const data = await readFile(costFile, 'utf8');
    const costData = JSON.parse(data);

    // Get today's costs
    const today = new Date().toISOString().slice(0, 10);
    const todayCosts = costData.daily[today] || { total: 0 };

    // Calculate projections
    const daysPassed = Object.keys(costData.daily).length || 1;
    const dailyAverage = costData.total / daysPassed;
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();

    costs = {
      today: todayCosts,
      month: {
        total: costData.total,
        budget: 150,
        remaining: 150 - costData.total,
        percentUsed: (costData.total / 150) * 100,
        projectedTotal: dailyAverage * daysInMonth
      },
      services: costData.services
    };
  } catch (error) {
    // Cost data not available - use defaults
  }

  // Calculate metrics
  const statusCounts = {
    running: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    stale: 0
  };

  agents.forEach((agent: any) => {
    if (agent.status === 'failed') {
      statusCounts.failed++;
    } else if (agent.status === 'running') {
      if (agent.age > 2) {
        statusCounts.stale++;
      } else {
        statusCounts.running++;
      }
    } else if (agent.status === 'completed') {
      statusCounts.completed++;
    } else {
      statusCounts.pending++;
    }
  });

  // Extract specific metrics
  const enrichmentAgent = agents.find((a: any) => a.agentName === 'contact-enrichment');
  const gmailAgent = agents.find((a: any) => a.agentName === 'gmail-autopilot');

  const contactsEnriched = enrichmentAgent?.metrics?.contactsEnriched || 0;
  const emailsProcessed = gmailAgent?.metrics?.emailsProcessed || 0;

  // Determine health
  let health: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (statusCounts.failed > 0) {
    health = 'critical';
  } else if (statusCounts.stale > 0 || costs.month.percentUsed > 90) {
    health = 'warning';
  }

  // Calculate time saved
  const timeSavings: Record<string, number> = {
    'contact-enrichment': 5,
    'gmail-autopilot': 0.5,
    'social-calendar': 1,
    'newsletter-generator': 0.5,
    'data-cleanup': 0.14,
    'station-discovery': 0.6
  };

  let timeSavedToday = 0;
  agents.forEach((agent: any) => {
    if (agent.status === 'completed') {
      timeSavedToday += timeSavings[agent.agentName] || 0;
    }
  });

  return {
    health,
    agents: agents.sort((a: any, b: any) =>
      new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
    ),
    costs,
    metrics: {
      agentCount: agents.length,
      statusCounts,
      timeSavedToday: Math.round(timeSavedToday * 10) / 10,
      contactsEnrichedToday: contactsEnriched,
      emailsProcessedToday: emailsProcessed,
      health
    }
  };
}
