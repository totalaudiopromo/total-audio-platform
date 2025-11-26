import { NextRequest, NextResponse } from 'next/server';

// Airtable API types
export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey) {
    throw new Error('AIRTABLE_API_KEY or AIRTABLE_PAT not configured');
  }

  return {
    baseUrl: AIRTABLE_API_URL + '/' + baseId,
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
  };
}

// GET /api/airtable?table=xxx&view=xxx&maxRecords=100
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const table = searchParams.get('table');
  const view = searchParams.get('view');
  const maxRecords = searchParams.get('maxRecords') || '100';
  const filterFormula = searchParams.get('filterByFormula');
  const offset = searchParams.get('offset');

  if (!table) {
    return NextResponse.json({ error: 'Table name required' }, { status: 400 });
  }

  try {
    const { baseUrl, headers } = getAirtableConfig();

    const params = new URLSearchParams();
    params.set('maxRecords', maxRecords);
    if (view) params.set('view', view);
    if (filterFormula) params.set('filterByFormula', filterFormula);
    if (offset) params.set('offset', offset);

    const url = baseUrl + '/' + encodeURIComponent(table) + '?' + params.toString();
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const error = await res.json();
      throw new Error('Airtable API error: ' + JSON.stringify(error));
    }

    const data: AirtableResponse = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Airtable API]', error);
    return NextResponse.json({ error: 'Failed to fetch Airtable data' }, { status: 500 });
  }
}

// POST /api/airtable - Create or update records
export async function POST(request: NextRequest) {
  try {
    const { baseUrl, headers } = getAirtableConfig();
    const body = await request.json();
    const { table, records, typecast } = body;

    if (!table || !records) {
      return NextResponse.json({ error: 'table and records are required' }, { status: 400 });
    }

    const url = baseUrl + '/' + encodeURIComponent(table);
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        records: records.map((r: any) => ({ fields: r })),
        typecast: typecast ?? true,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error('Airtable error: ' + JSON.stringify(error));
    }

    const data = await res.json();
    return NextResponse.json({ success: true, records: data.records });
  } catch (error) {
    console.error('[Airtable API]', error);
    return NextResponse.json({ error: 'Failed to create Airtable records' }, { status: 500 });
  }
}

// PATCH /api/airtable - Update existing records
export async function PATCH(request: NextRequest) {
  try {
    const { baseUrl, headers } = getAirtableConfig();
    const body = await request.json();
    const { table, records, typecast } = body;

    if (!table || !records) {
      return NextResponse.json(
        { error: 'table and records (with id and fields) are required' },
        { status: 400 }
      );
    }

    const url = baseUrl + '/' + encodeURIComponent(table);
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        records: records.map((r: any) => ({ id: r.id, fields: r.fields })),
        typecast: typecast ?? true,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error('Airtable error: ' + JSON.stringify(error));
    }

    const data = await res.json();
    return NextResponse.json({ success: true, records: data.records });
  } catch (error) {
    console.error('[Airtable API]', error);
    return NextResponse.json({ error: 'Failed to update Airtable records' }, { status: 500 });
  }
}
