import { NextRequest, NextResponse } from 'next/server';

// This endpoint can be called by Vercel Cron Jobs, GitHub Actions, or any cron service
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekNumber = parseInt(searchParams.get('week') || '1');
    const createDraft = searchParams.get('createDraft') === 'true';
    const autoSend = searchParams.get('autoSend') === 'true';

    console.log(`🤖 Weekly Newsletter Cron: Running for week ${weekNumber}`);

    // Call the weekly-agent endpoint internally to generate content and create a draft/preview
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const url = `${String(baseUrl).startsWith('http') ? baseUrl : `https://${baseUrl}`}/api/newsletter/weekly-agent`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekNumber, createDraft, sendDraft: autoSend }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { success: false, error: `Weekly agent failed: ${text}` },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      weekNumber,
      createDraft,
      autoSend,
      weeklyAgent: data,
    });
  } catch (error) {
    console.error('Error in weekly newsletter cron:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Also support POST for webhook triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
