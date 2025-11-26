import { NextRequest, NextResponse } from 'next/server';

// Google Sheets API types
export interface SheetData {
  spreadsheetId: string;
  range: string;
  values: string[][];
}

export interface SheetMetadata {
  spreadsheetId: string;
  title: string;
  sheets: { sheetId: number; title: string }[];
}

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

async function getSheetsClient() {
  // For service account auth, use the service account key
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY || process.env.GOOGLE_API_KEY;

  if (serviceAccountKey) {
    // Parse service account and get access token via JWT
    const key = JSON.parse(serviceAccountKey);
    const token = await getServiceAccountToken(key);
    return { type: 'bearer', token };
  }

  if (apiKey) {
    return { type: 'apiKey', token: apiKey };
  }

  throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SHEETS_API_KEY not configured');
}

async function getServiceAccountToken(key: any): Promise<string> {
  // Create JWT
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const { createSign } = await import('crypto');

  const encodeBase64Url = (data: string) => Buffer.from(data).toString('base64url');

  const headerB64 = encodeBase64Url(JSON.stringify(header));
  const claimB64 = encodeBase64Url(JSON.stringify(claim));
  const signatureInput = headerB64 + '.' + claimB64;

  const sign = createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(key.private_key, 'base64url');

  const jwt = signatureInput + '.' + signature;

  // Exchange JWT for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error('Failed to get access token: ' + JSON.stringify(tokenData));
  }

  return tokenData.access_token;
}

// GET /api/sheets?spreadsheetId=xxx&range=Sheet1!A1:Z100
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const spreadsheetId = searchParams.get('spreadsheetId');
  const range = searchParams.get('range');
  const metadata = searchParams.get('metadata') === 'true';

  if (!spreadsheetId) {
    return NextResponse.json({ error: 'spreadsheetId required' }, { status: 400 });
  }

  try {
    const auth = await getSheetsClient();
    const headers: Record<string, string> = {};
    let urlSuffix = '';

    if (auth.type === 'bearer') {
      headers.Authorization = 'Bearer ' + auth.token;
    } else {
      urlSuffix = '?key=' + auth.token;
    }

    if (metadata) {
      // Get spreadsheet metadata
      const url = SHEETS_API_URL + '/' + spreadsheetId + urlSuffix;
      const res = await fetch(url, { headers });

      if (!res.ok) {
        throw new Error('Sheets API error: ' + res.status);
      }

      const data = await res.json();
      const result: SheetMetadata = {
        spreadsheetId: data.spreadsheetId,
        title: data.properties?.title || '',
        sheets: (data.sheets || []).map((s: any) => ({
          sheetId: s.properties?.sheetId,
          title: s.properties?.title,
        })),
      };

      return NextResponse.json(result);
    }

    if (!range) {
      return NextResponse.json({ error: 'range required for data fetch' }, { status: 400 });
    }

    // Get values from range
    const url =
      SHEETS_API_URL + '/' + spreadsheetId + '/values/' + encodeURIComponent(range) + urlSuffix;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error('Sheets API error: ' + res.status);
    }

    const data = await res.json();
    const result: SheetData = {
      spreadsheetId,
      range: data.range || range,
      values: data.values || [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Sheets API]', error);
    return NextResponse.json({ error: 'Failed to fetch Google Sheets data' }, { status: 500 });
  }
}

// POST /api/sheets - Append or update data
export async function POST(request: NextRequest) {
  try {
    const auth = await getSheetsClient();
    if (auth.type !== 'bearer') {
      return NextResponse.json(
        { error: 'Write operations require service account authentication' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { spreadsheetId, range, values, mode } = body;

    if (!spreadsheetId || !range || !values) {
      return NextResponse.json(
        { error: 'spreadsheetId, range, and values are required' },
        { status: 400 }
      );
    }

    const headers = {
      Authorization: 'Bearer ' + auth.token,
      'Content-Type': 'application/json',
    };

    let url: string;
    let method = 'POST';

    if (mode === 'update') {
      // Update existing cells
      url =
        SHEETS_API_URL +
        '/' +
        spreadsheetId +
        '/values/' +
        encodeURIComponent(range) +
        '?valueInputOption=USER_ENTERED';
      method = 'PUT';
    } else {
      // Append new rows
      url =
        SHEETS_API_URL +
        '/' +
        spreadsheetId +
        '/values/' +
        encodeURIComponent(range) +
        ':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS';
    }

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify({ values }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error('Sheets error: ' + JSON.stringify(error));
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      updatedRange: data.updates?.updatedRange || data.updatedRange,
    });
  } catch (error) {
    console.error('[Sheets API]', error);
    return NextResponse.json({ error: 'Failed to write to Google Sheets' }, { status: 500 });
  }
}
