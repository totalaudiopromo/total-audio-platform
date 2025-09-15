import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 DEBUG: Starting pipeline debug');
    
    // Mock a CSV with more than 75 contacts for testing
    const mockContacts = Array.from({ length: 200 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@test.com`,
      company: `Company ${i + 1}`
    }));
    
    console.log('🔍 DEBUG: Created mock contacts:', mockContacts.length);
    
    // Test the enrichment API directly
    const enrichResponse = await fetch('http://localhost:3000/api/enrich-claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts: mockContacts })
    });
    
    const enrichData = await enrichResponse.json();
    
    console.log('🔍 DEBUG: Enrichment response:', {
      status: enrichResponse.status,
      processed: enrichData.processed,
      enrichedCount: enrichData.enriched?.length
    });
    
    return NextResponse.json({
      success: true,
      debug: {
        inputContacts: mockContacts.length,
        enrichmentStatus: enrichResponse.status,
        enrichedCount: enrichData.enriched?.length,
        processedCount: enrichData.processed,
        enrichmentResponse: enrichData
      }
    });
    
  } catch (error: any) {
    console.error('🔍 DEBUG: Pipeline error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug pipeline endpoint',
    usage: 'POST to test enrichment pipeline with 200 mock contacts'
  });
}