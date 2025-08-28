import { NextRequest, NextResponse } from 'next/server';

// Mock Notion tasks data (replace with real Notion API integration)
const mockTasks = [
  {
    id: '1',
    title: 'Implement contact enrichment API',
    status: 'in-progress' as const,
    priority: 'high' as const,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: 'Chris Schofield'
  },
  {
    id: '2',
    title: 'Design campaign management UI',
    status: 'todo' as const,
    priority: 'medium' as const,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: 'Design Team'
  },
  {
    id: '3',
    title: 'Set up audio content generation pipeline',
    status: 'todo' as const,
    priority: 'low' as const,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: 'AI Team'
  },
  {
    id: '4',
    title: 'Optimize database queries',
    status: 'done' as const,
    priority: 'medium' as const,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: 'Dev Team'
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(mockTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
