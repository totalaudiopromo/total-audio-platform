/**
 * Agent Performance API - Real-time metrics and ROI tracking
 * Provides performance data for the Mission Control Dashboard
 */

import { NextRequest, NextResponse } from 'next/server';

interface AgentPerformanceMetrics {
  agentId: string;
  agentName: string;
  avatar: string;
  personality: string;
  specialization: string;
  tasksCompleted: number;
  successRate: number;
  timesSaved: number;
  revenueGenerated: number;
  customerSatisfaction: number;
  isActive: boolean;
  lastActivity: string;
  performanceScore: number;
  improvementTrend: 'up' | 'down' | 'stable';
}

// Mock performance data - in production this would come from a database
const mockPerformanceData: AgentPerformanceMetrics[] = [
  {
    agentId: 'agent_1',
    agentName: 'Marcus the Marketing Maestro',
    avatar: 'microphone',
    personality: 'energetic',
    specialization: 'content-creation',
    tasksCompleted: 127,
    successRate: 94,
    timesSaved: 32,
    revenueGenerated: 3200,
    customerSatisfaction: 4.8,
    isActive: true,
    lastActivity: '2 minutes ago',
    performanceScore: 92,
    improvementTrend: 'up'
  },
  {
    agentId: 'agent_2',
    agentName: 'Sarah the Strategy Sage',
    avatar: 'speaker',
    personality: 'professional',
    specialization: 'strategy',
    tasksCompleted: 89,
    successRate: 97,
    timesSaved: 45,
    revenueGenerated: 4500,
    customerSatisfaction: 4.9,
    isActive: true,
    lastActivity: '5 minutes ago',
    performanceScore: 96,
    improvementTrend: 'up'
  },
  {
    agentId: 'agent_3',
    agentName: 'Vibe the Analytics Ace',
    avatar: 'headphones',
    personality: 'laid-back',
    specialization: 'analytics',
    tasksCompleted: 156,
    successRate: 91,
    timesSaved: 28,
    revenueGenerated: 2800,
    customerSatisfaction: 4.7,
    isActive: true,
    lastActivity: '1 minute ago',
    performanceScore: 89,
    improvementTrend: 'stable'
  },
  {
    agentId: 'agent_4',
    agentName: 'Melody the Research Master',
    avatar: 'vinyl-record',
    personality: 'creative',
    specialization: 'research',
    tasksCompleted: 203,
    successRate: 88,
    timesSaved: 51,
    revenueGenerated: 1950,
    customerSatisfaction: 4.6,
    isActive: false,
    lastActivity: '1 hour ago',
    performanceScore: 85,
    improvementTrend: 'down'
  }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agentId');
    const userId = url.searchParams.get('userId');

    // If specific agent requested, return just that agent's data
    if (agentId) {
      const agentData = mockPerformanceData.find(agent => agent.agentId === agentId);
      
      if (!agentData) {
        return NextResponse.json(
          { success: false, error: 'Agent not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: agentData
      });
    }

    // Return all agent performance data
    return NextResponse.json({
      success: true,
      data: {
        agents: mockPerformanceData,
        summary: {
          totalAgents: mockPerformanceData.length,
          activeAgents: mockPerformanceData.filter(a => a.isActive).length,
          totalTasks: mockPerformanceData.reduce((sum, a) => sum + a.tasksCompleted, 0),
          totalRevenue: mockPerformanceData.reduce((sum, a) => sum + a.revenueGenerated, 0),
          totalTimeSaved: mockPerformanceData.reduce((sum, a) => sum + a.timesSaved, 0),
          averageSuccessRate: Math.round(
            mockPerformanceData.reduce((sum, a) => sum + a.successRate, 0) / mockPerformanceData.length
          ),
          averageCustomerSatisfaction: parseFloat(
            (mockPerformanceData.reduce((sum, a) => sum + a.customerSatisfaction, 0) / mockPerformanceData.length).toFixed(1)
          )
        }
      }
    });

  } catch (error) {
    console.error('Agent performance API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch agent performance data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, metricType, value, userId } = body;

    // Mock updating agent performance - in production this would update the database
    console.log(`Updating agent ${agentId} ${metricType} to ${value} for user ${userId}`);

    // Simulate real-time update
    const updatedAgent = mockPerformanceData.find(a => a.agentId === agentId);
    if (updatedAgent) {
      // Update specific metric
      switch (metricType) {
        case 'task_completed':
          updatedAgent.tasksCompleted += 1;
          break;
        case 'revenue_generated':
          updatedAgent.revenueGenerated += value;
          break;
        case 'time_saved':
          updatedAgent.timesSaved += value;
          break;
        case 'customer_rating':
          // Recalculate average rating
          updatedAgent.customerSatisfaction = value;
          break;
      }
      
      updatedAgent.lastActivity = 'Just now';
    }

    return NextResponse.json({
      success: true,
      message: 'Agent performance updated successfully',
      data: updatedAgent
    });

  } catch (error) {
    console.error('Agent performance update error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update agent performance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}