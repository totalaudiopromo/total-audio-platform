import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { startWeek = 1, count = 6 } = await request
      .json()
      .catch(() => ({ startWeek: 1, count: 6 }));

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const url = `${
      String(baseUrl).startsWith('http') ? baseUrl : `https://${baseUrl}`
    }/api/newsletter/weekly-agent`;

    const results: any[] = [];
    for (let i = 0; i < Number(count); i++) {
      const weekNumber = Number(startWeek) + i;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekNumber, createDraft: true }),
      });
      const data = await res.json().catch(() => ({}));
      results.push({ weekNumber, ok: res.ok, data });
      // Avoid hammering API
      await new Promise(r => setTimeout(r, 500));
    }

    return NextResponse.json({ success: true, queued: results.length, results });
  } catch (error) {
    console.error('Bulk schedule error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
