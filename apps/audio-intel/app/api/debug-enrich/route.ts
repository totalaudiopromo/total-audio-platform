import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testContacts } = body;
    
    console.log('Debug: Received contacts count:', testContacts?.length);
    
    // Test with a simple batch of 10 contacts
    const testBatch = testContacts?.slice(0, 10) || [
      { name: 'John Smith', email: 'john@bbc.co.uk' },
      { name: 'Sarah Jones', email: 'sarah@spotify.com' },
      { name: 'Test Contact', email: 'test@radio1.com' }
    ];
    
    console.log('Debug: Processing test batch:', testBatch);
    
    // Call our Claude enrichment endpoint
    const enrichResponse = await fetch('http://localhost:3000/api/enrich-claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts: testBatch })
    });
    
    const enrichData = await enrichResponse.json();
    
    console.log('Debug: Claude response status:', enrichResponse.status);
    console.log('Debug: Claude response data:', enrichData);
    
    return NextResponse.json({
      success: true,
      debug: {
        inputCount: testBatch.length,
        enrichmentResponse: enrichData,
        claudeApiStatus: enrichResponse.status
      }
    });
    
  } catch (error: any) {
    console.error('Debug enrichment error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug enrichment endpoint',
    usage: 'POST with { testContacts: [...] }'
  });
}