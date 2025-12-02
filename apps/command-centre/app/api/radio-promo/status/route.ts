import { NextRequest, NextResponse } from 'next/server';
import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// Interface definitions matching the dashboard
interface WorkflowStep {
  id: string;
  name: string;
  agent: string;
  status: 'pending' | 'in_progress' | 'completed' | 'requires_approval' | 'approved' | 'failed';
  progress: number;
  message: string;
  timestamp: string;
  data?: any;
  requiresManualApproval: boolean;
}

interface RadioCampaign {
  id: string;
  artistName: string;
  trackTitle: string;
  genre: string;
  budget: number;
  releaseDate: string;
  priority: 'high' | 'medium' | 'low';
  status:
    | 'transcript_processing'
    | 'campaign_creation'
    | 'press_release'
    | 'radio_outreach'
    | 'tracking'
    | 'completed';
  steps: WorkflowStep[];
  createdAt: string;
}

interface AgentStatus {
  name: string;
  status: 'online' | 'processing' | 'error' | 'offline';
  currentTask: string;
  lastHeartbeat: string;
  errorCount: number;
}

interface StatusResponse {
  campaigns: RadioCampaign[];
  agentStatuses: AgentStatus[];
  approvalQueue: WorkflowStep[];
  isConnected: boolean;
  lastUpdate: string;
}

// Path to the radio-promo orchestrator
const ORCHESTRATOR_PATH = path.resolve(
  process.cwd(),
  '../../../tools/agents/radio-promo/orchestrator.js'
);
const STATUS_FILE_PATH = path.resolve(
  process.cwd(),
  '../../../tools/agents/radio-promo/status/current-status.json'
);

async function checkOrchestratorStatus(): Promise<boolean> {
  return new Promise(resolve => {
    exec('pgrep -f "radio-promo.*orchestrator"', (error, stdout, stderr) => {
      // If pgrep finds processes, stdout will have PIDs
      resolve(stdout.trim().length > 0);
    });
  });
}

async function getStatusFromFile(): Promise<StatusResponse | null> {
  try {
    if (!fs.existsSync(STATUS_FILE_PATH)) {
      return null;
    }

    const statusData = fs.readFileSync(STATUS_FILE_PATH, 'utf-8');
    const parsedStatus = JSON.parse(statusData);

    return {
      campaigns: parsedStatus.campaigns || [],
      agentStatuses: parsedStatus.agentStatuses || [],
      approvalQueue: parsedStatus.approvalQueue || [],
      isConnected: parsedStatus.isConnected || false,
      lastUpdate: parsedStatus.lastUpdate || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error reading status file:', error);
    return null;
  }
}

async function getMockData(): Promise<StatusResponse> {
  const mockCampaigns: RadioCampaign[] = [
    {
      id: 'camp_001',
      artistName: 'Emily Watson',
      trackTitle: 'Midnight Dreams',
      genre: 'Indie Pop',
      budget: 3500,
      releaseDate: '2025-10-20',
      priority: 'high',
      status: 'press_release',
      createdAt: '2025-09-06T10:30:00Z',
      steps: [
        {
          id: 'step_001',
          name: 'Process Google Meet Transcript',
          agent: 'Intelligence Agent',
          status: 'completed',
          progress: 100,
          message: 'Successfully extracted campaign brief from transcript',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          requiresManualApproval: false,
          data: {
            confidence: 0.92,
            extractedFields: ['artist', 'track', 'genre', 'budget', 'releaseDate'],
          },
        },
        {
          id: 'step_002',
          name: 'Create Monday.com Campaign Board',
          agent: 'Project Agent',
          status: 'completed',
          progress: 100,
          message: 'Campaign board created with 24 tasks across 4 groups',
          timestamp: new Date(Date.now() - 480000).toISOString(),
          requiresManualApproval: false,
          data: {
            boardId: 'board_12345',
            taskCount: 24,
            groups: [
              'Pre-Launch Setup',
              'Launch Week',
              'Follow-up & Tracking',
              'Reporting & Delivery',
            ],
          },
        },
        {
          id: 'step_003',
          name: 'Generate Liberty Press Release',
          agent: 'Email Agent',
          status: 'requires_approval',
          progress: 95,
          message: 'Press release generated - requires final approval before distribution',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          requiresManualApproval: true,
          data: {
            wordCount: 342,
            template: 'liberty_standard',
            targetStations: ['Amazing Radio', 'Wigwam Radio', 'BBC Introducing'],
          },
        },
        {
          id: 'step_004',
          name: 'Begin Radio Station Outreach',
          agent: 'Radio Agent',
          status: 'pending',
          progress: 0,
          message: 'Waiting for press release approval',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          requiresManualApproval: false,
        },
        {
          id: 'step_005',
          name: 'Setup WARM API Tracking',
          agent: 'Analytics Agent',
          status: 'pending',
          progress: 0,
          message: 'Pending radio outreach completion',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          requiresManualApproval: false,
        },
      ],
    },
  ];

  const mockAgentStatuses: AgentStatus[] = [
    {
      name: 'Intelligence Agent',
      status: 'online',
      currentTask: 'Monitoring Google Meet calendar',
      lastHeartbeat: new Date(Date.now() - 30000).toISOString(),
      errorCount: 0,
    },
    {
      name: 'Project Agent',
      status: 'online',
      currentTask: 'Updating Monday.com board statuses',
      lastHeartbeat: new Date(Date.now() - 45000).toISOString(),
      errorCount: 0,
    },
    {
      name: 'Email Agent',
      status: 'processing',
      currentTask: 'Generating press release for Emily Watson',
      lastHeartbeat: new Date(Date.now() - 60000).toISOString(),
      errorCount: 0,
    },
    {
      name: 'Radio Agent',
      status: 'offline',
      currentTask: 'Waiting for approval',
      lastHeartbeat: new Date(Date.now() - 420000).toISOString(),
      errorCount: 1,
    },
    {
      name: 'Analytics Agent',
      status: 'online',
      currentTask: 'Monitoring WARM API connections',
      lastHeartbeat: new Date(Date.now() - 90000).toISOString(),
      errorCount: 0,
    },
    {
      name: 'Coverage Agent',
      status: 'online',
      currentTask: 'Preparing weekly reports',
      lastHeartbeat: new Date(Date.now() - 120000).toISOString(),
      errorCount: 0,
    },
  ];

  // Extract approval queue from campaigns
  const approvalQueue = mockCampaigns.flatMap(campaign =>
    campaign.steps.filter(step => step.status === 'requires_approval')
  );

  return {
    campaigns: mockCampaigns,
    agentStatuses: mockAgentStatuses,
    approvalQueue,
    isConnected: await checkOrchestratorStatus(),
    lastUpdate: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    // Try to get real status from orchestrator first
    const fileStatus = await getStatusFromFile();

    if (fileStatus) {
      return NextResponse.json(fileStatus, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }

    // Fall back to mock data if orchestrator isn't running or no status file
    const mockStatus = await getMockData();

    return NextResponse.json(
      {
        ...mockStatus,
        note: 'Using mock data - orchestrator not running',
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching radio promo status:', error);

    // Return basic error status
    return NextResponse.json(
      {
        campaigns: [],
        agentStatuses: [],
        approvalQueue: [],
        isConnected: false,
        lastUpdate: new Date().toISOString(),
        error: 'Failed to fetch status data',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, stepId, approved, campaignId } = body;

    if (action === 'approve_step') {
      // Here we would typically send the approval to the orchestrator
      // For now, we'll update the status file directly

      const currentStatus = (await getStatusFromFile()) || (await getMockData());

      // Update the step status
      const updatedCampaigns = currentStatus.campaigns.map(campaign => {
        if (campaign.id === campaignId) {
          return {
            ...campaign,
            steps: campaign.steps.map(step => {
              if (step.id === stepId) {
                return {
                  ...step,
                  status: approved ? 'approved' : 'failed',
                  progress: approved ? 100 : 0,
                  message: approved
                    ? `Approved by user at ${new Date().toISOString()}`
                    : `Rejected by user at ${new Date().toISOString()}`,
                  timestamp: new Date().toISOString(),
                };
              }
              return step;
            }),
          };
        }
        return campaign;
      });

      // Update approval queue
      const updatedApprovalQueue = currentStatus.approvalQueue.filter(step => step.id !== stepId);

      const updatedStatus = {
        ...currentStatus,
        campaigns: updatedCampaigns,
        approvalQueue: updatedApprovalQueue,
        lastUpdate: new Date().toISOString(),
      };

      // Save updated status back to file
      try {
        const statusDir = path.dirname(STATUS_FILE_PATH);
        if (!fs.existsSync(statusDir)) {
          fs.mkdirSync(statusDir, { recursive: true });
        }
        fs.writeFileSync(STATUS_FILE_PATH, JSON.stringify(updatedStatus, null, 2));
      } catch (fileError) {
        console.error('Error writing status file:', fileError);
      }

      return NextResponse.json({
        success: true,
        message: approved ? 'Step approved' : 'Step rejected',
        updatedStatus,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Unknown action',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process approval',
      },
      { status: 500 }
    );
  }
}
