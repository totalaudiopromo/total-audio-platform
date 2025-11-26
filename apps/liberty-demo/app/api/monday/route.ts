import { NextRequest, NextResponse } from 'next/server';
import type { MondayTimeline, MondayAllocation } from '@/lib/types';

const MONDAY_API_URL = 'https://api.monday.com/v2';

// Chris's Radio Results board - the only board we can write to
const CHRIS_RADIO_BOARD_ID = '2443582331';

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

// GET /api/monday?type=timelines|allocations|chris-radio
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'timelines';

  try {
    if (type === 'chris-radio') {
      // Chris's Radio Results - the board we have full access to
      const query = `
        query {
          boards(ids: [${CHRIS_RADIO_BOARD_ID}]) {
            name
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

      const campaigns = items.map((item: any) => {
        const cols = item.column_values.reduce((acc: any, col: any) => {
          acc[col.id] = { text: col.text, value: col.value };
          return acc;
        }, {});

        // Parse timeline value
        let startDate = '';
        let endDate = '';
        if (cols.timeline?.value) {
          try {
            const timeline = JSON.parse(cols.timeline.value);
            startDate = timeline.from || '';
            endDate = timeline.to || '';
          } catch {
            // Use text fallback
            const parts = (cols.timeline?.text || '').split(' - ');
            startDate = parts[0] || '';
            endDate = parts[1] || '';
          }
        }

        return {
          id: item.id,
          name: item.name,
          source: cols.status8?.text || 'Liberty',
          releaseDate: cols.date4?.text || '',
          startDate,
          endDate,
          status: mapCampaignStatus(cols.status?.text),
          reportLink: cols.link?.text || null,
        };
      });

      return NextResponse.json(campaigns);
    }

    if (type === 'timelines') {
      // Query for campaign timelines from configured board or Chris's board
      const boardId = process.env.MONDAY_CAMPAIGNS_BOARD_ID || CHRIS_RADIO_BOARD_ID;
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

        // Handle timeline column value
        let startDate = cols.date || cols.start_date || new Date().toISOString();
        let endDate = cols.end_date || new Date().toISOString();

        if (cols.timeline) {
          try {
            const timeline = JSON.parse(cols.timeline);
            if (timeline.from) startDate = timeline.from;
            if (timeline.to) endDate = timeline.to;
          } catch {
            // Timeline is plain text like "2025-09-29 - 2025-11-11"
            const parts = cols.timeline.split(' - ');
            if (parts[0]) startDate = parts[0];
            if (parts[1]) endDate = parts[1];
          }
        }

        return {
          id: item.id,
          title: item.name,
          startDate,
          endDate,
          status: mapMondayStatus(cols.status),
        };
      });

      return NextResponse.json(timelines);
    }

    if (type === 'allocations') {
      // Query for staff allocations from Allocation_RADIO board
      const boardId = process.env.MONDAY_STAFF_BOARD_ID;
      if (!boardId) {
        return NextResponse.json(
          { error: 'MONDAY_STAFF_BOARD_ID not configured' },
          { status: 400 }
        );
      }

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
          role: cols.role || cols.job_title || 'Radio Promoter',
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

// POST /api/monday - Write only to Chris's Radio Results board
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, itemId, columnId, value, itemName } = body;

    // Security: Only allow writes to Chris's board
    if (action === 'update') {
      const mutation = `
        mutation {
          change_column_value(
            board_id: ${CHRIS_RADIO_BOARD_ID},
            item_id: ${itemId},
            column_id: "${columnId}",
            value: ${JSON.stringify(JSON.stringify(value))}
          ) {
            id
          }
        }
      `;

      const data = await mondayQuery(mutation);
      return NextResponse.json({ success: true, data });
    }

    if (action === 'create') {
      const mutation = `
        mutation {
          create_item(
            board_id: ${CHRIS_RADIO_BOARD_ID},
            item_name: "${itemName}"
          ) {
            id
          }
        }
      `;

      const data = await mondayQuery(mutation);
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[Monday API POST]', error);
    return NextResponse.json({ error: 'Failed to update Monday.com' }, { status: 500 });
  }
}

function mapMondayStatus(status: string | null): MondayTimeline['status'] {
  if (!status) return 'on-track';
  const lower = status.toLowerCase();
  if (lower.includes('risk') || lower.includes('stuck')) return 'at-risk';
  if (lower.includes('behind') || lower.includes('late')) return 'behind';
  return 'on-track';
}

function mapCampaignStatus(status: string | null): 'active' | 'done' | 'pending' {
  if (!status) return 'pending';
  const lower = status.toLowerCase();
  if (lower.includes('done') || lower.includes('complete')) return 'done';
  if (lower.includes('working') || lower.includes('progress')) return 'active';
  return 'pending';
}
