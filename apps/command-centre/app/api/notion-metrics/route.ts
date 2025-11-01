import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connect to your real Notion workspace
    // Add your Notion API token and database IDs here
    const NOTION_TOKEN = process.env.NOTION_API_KEY;
    const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID;
    const TASKS_DB_ID = process.env.NOTION_TASKS_DB_ID;

    if (!NOTION_TOKEN) {
      console.log('Notion API token not configured, using fallback data');
      return NextResponse.json({
        projects: [],
        tasks: [],
        totalProjects: 0,
        completedProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        source: 'fallback',
      });
    }

    const headers = {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    };

    // Fetch real projects and tasks from Notion
    const [projectsResponse, tasksResponse] = await Promise.all([
      PROJECTS_DB_ID
        ? fetch(`https://api.notion.com/v1/databases/${PROJECTS_DB_ID}/query`, {
            method: 'POST',
            headers,
            body: JSON.stringify({}),
          }).catch(() => null)
        : null,

      TASKS_DB_ID
        ? fetch(`https://api.notion.com/v1/databases/${TASKS_DB_ID}/query`, {
            method: 'POST',
            headers,
            body: JSON.stringify({}),
          }).catch(() => null)
        : null,
    ]);

    let projects = [];
    let tasks = [];

    if (projectsResponse && projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      projects = projectsData.results || [];
    }

    if (tasksResponse && tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      tasks = tasksData.results || [];
    }

    // Calculate real metrics
    const totalProjects = projects.length;
    const completedProjects = projects.filter((project: any) => {
      const status =
        project.properties?.Status?.select?.name ||
        project.properties?.status?.select?.name ||
        project.properties?.Done?.checkbox;
      return status === 'Completed' || status === 'Done' || status === true;
    }).length;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task: any) => {
      const status =
        task.properties?.Status?.select?.name ||
        task.properties?.status?.select?.name ||
        task.properties?.Done?.checkbox;
      return status === 'Completed' || status === 'Done' || status === true;
    }).length;

    console.log(`[${new Date().toISOString()}] Real Notion metrics:`, {
      totalProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      source: 'notion-api',
    });

    return NextResponse.json({
      projects,
      tasks,
      totalProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      projectCompletionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
      source: 'notion-api',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Notion metrics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Notion metrics',
        projects: [],
        tasks: [],
        totalProjects: 0,
        completedProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        source: 'error-fallback',
      },
      { status: 500 }
    );
  }
}
