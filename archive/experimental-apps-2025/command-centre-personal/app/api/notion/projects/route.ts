import { NextRequest, NextResponse } from 'next/server';

// Mock Notion projects data (replace with real Notion API integration)
const mockProjects = [
  {
    id: '1',
    name: 'Audio Intel Platform',
    status: 'in-progress' as const,
    progress: 94,
    tasks: 15,
    priority: 'high' as const,
    lastUpdated: new Date().toISOString(),
    assignee: 'Chris Schofield',
  },
  {
    id: '2',
    name: 'Playlist Pulse Campaign Manager',
    status: 'planning' as const,
    progress: 67,
    tasks: 8,
    priority: 'medium' as const,
    lastUpdated: new Date().toISOString(),
    assignee: 'Dev Team',
  },
  {
    id: '3',
    name: 'Voice Echo Content Generator',
    status: 'planning' as const,
    progress: 23,
    tasks: 12,
    priority: 'low' as const,
    lastUpdated: new Date().toISOString(),
    assignee: 'AI Team',
  },
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(mockProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
