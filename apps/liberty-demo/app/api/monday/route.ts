import { NextRequest, NextResponse } from 'next/server';
import type { MondayTimeline, MondayAllocation } from '@/lib/types';

const MONDAY_API_URL = 'https://api.monday.com/v2';

async function mondayQuery(query: string) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    throw new Error('MONDAY_API_TOKEN not configured');
  }

  const res = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Monday API error: ${res.status}`);
  }

  return res.json();
}

// GET /api/monday?type=timelines|allocations
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'timelines';

  try {
    if (type === 'timelines') {
      // Query for campaign timelines from a specific board
      const boardId = process.env.MONDAY_CAMPAIGNS_BOARD_ID;
      const query = `
        query {
          boards(ids: [${boardId}]) {
            items_page(limit: 50) {
              items {
                id
                name
                column_values {
                  id
                  text
                  value
                }
              }
            }
          }
        }
      `;

      const data = await mondayQuery(query);
      const items = data?.data?.boards?.[0]?.items_page?.items || [];

      const timelines: MondayTimeline[] = items.map((item: any) => {
        const cols = item.column_values.reduce((acc: any, col: any) => {
          acc[col.id] = col.text || col.value;
          return acc;
        }, {});

        return {
          id: item.id,
          title: item.name,
          startDate: cols.date || cols.start_date || new Date().toISOString(),
          endDate: cols.end_date || cols.timeline || new Date().toISOString(),
          status: mapMondayStatus(cols.status),
        };
      });

      return NextResponse.json(timelines);
    }

    if (type === 'allocations') {
      // Query for staff allocations from a people/workload board
      const boardId = process.env.MONDAY_STAFF_BOARD_ID;
      const query = `
        query {
          boards(ids: [${boardId}]) {
            items_page(limit: 50) {
              items {
                id
                name
                column_values {
                  id
                  text
                  value
                }
              }
            }
          }
        }
      `;

      const data = await mondayQuery(query);
      const items = data?.data?.boards?.[0]?.items_page?.items || [];

      const allocations: MondayAllocation[] = items.map((item: any) => {
        const cols = item.column_values.reduce((acc: any, col: any) => {
          acc[col.id] = col.text || col.value;
          return acc;
        }, {});

        return {
          staffName: item.name,
          role: cols.role || cols.job_title || 'Team Member',
          activeCampaigns: (cols.campaigns || cols.projects || '').split(',').filter(Boolean),
          workloadScore: parseInt(cols.workload || cols.capacity || '50', 10),
        };
      });

      return NextResponse.json(allocations);
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('[Monday API]', error);
    return NextResponse.json({ error: 'Failed to fetch Monday.com data' }, { status: 500 });
  }
}

function mapMondayStatus(status: string | null): MondayTimeline['status'] {
  if (!status) return 'on-track';
  const lower = status.toLowerCase();
  if (lower.includes('risk') || lower.includes('stuck')) return 'at-risk';
  if (lower.includes('behind') || lower.includes('late')) return 'behind';
  return 'on-track';
}
