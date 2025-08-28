import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🔄 Syncing real-time data from Audio Intel to Notion...');
    
    // Get current data from Audio Intel
    let audioIntelData = null;
    try {
      const audioResponse = await fetch('http://localhost:3001/api/analytics');
      if (audioResponse.ok) {
        audioIntelData = await audioResponse.json();
        console.log('✅ Successfully fetched live data from Audio Intel');
      }
    } catch (error) {
      console.log('⚠️ Audio Intel not available:', error.message);
    }
    
    // Get current system status from Audio Intel
    let systemStatus = null;
    try {
      const statusResponse = await fetch('http://localhost:3001/api/status');
      if (statusResponse.ok) {
        systemStatus = await statusResponse.json();
        console.log('✅ Successfully fetched system status from Audio Intel');
      }
    } catch (error) {
      console.log('⚠️ Audio Intel status not available:', error.message);
    }
    
    // Prepare real business data for Notion
    const realBusinessData = {
      // Real revenue data (from payment processor when available)
      mrr: 0, // Will be updated when you have real revenue
      customers: 0, // Will be updated when you have real customers
      
      // Real product usage data from Audio Intel
      emailsValidated: audioIntelData?.totalEmailsValidated || 0,
      contactsEnriched: audioIntelData?.totalContactsEnriched || 0,
      apiCalls: audioIntelData?.totalApiCalls || 0,
      successRate: audioIntelData?.overallSuccessRate || 0,
      avgProcessingTime: audioIntelData?.averageProcessingTime || 0,
      
      // Real system data
      activeAgents: systemStatus?.activeAgents || 0,
      systemStatus: systemStatus?.status || 'pre-launch',
      uptime: systemStatus?.uptime || '100%'
    };
    
    // Update Notion with real data
    try {
      const notionUpdateResponse = await fetch('http://localhost:3000/api/notion/business-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(realBusinessData)
      });
      
      if (notionUpdateResponse.ok) {
        const updateResult = await notionUpdateResponse.json();
        console.log('✅ Successfully synced real data to Notion');
        
        return NextResponse.json({
          success: true,
          message: 'Real-time data synced from Audio Intel to Notion',
          syncedData: realBusinessData,
          notionResult: updateResult
        });
      } else {
        const error = await notionUpdateResponse.json();
        console.error('❌ Failed to update Notion:', error);
        
        return NextResponse.json({
          success: false,
          error: 'Failed to sync to Notion',
          details: error
        }, { status: 500 });
      }
      
    } catch (error) {
      console.error('💥 Error syncing to Notion:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Sync to Notion failed',
        details: error.message,
        dataAttempted: realBusinessData
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('💥 Real-time sync error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Real-time sync failed',
      details: error.message
    }, { status: 500 });
  }
}

// GET endpoint to check sync status
export async function GET() {
  try {
    // Check if Audio Intel is available
    let audioIntelAvailable = false;
    try {
      const audioResponse = await fetch('http://localhost:3001/api/status');
      audioIntelAvailable = audioResponse.ok;
    } catch (error) {
      audioIntelAvailable = false;
    }
    
    // Check if Notion is configured
    const notionConfigured = !!(process.env.NOTION_API_KEY && process.env.NOTION_BUSINESS_METRICS_DB_ID);
    
    return NextResponse.json({
      audioIntelAvailable,
      notionConfigured,
      syncReady: audioIntelAvailable && notionConfigured,
      lastSyncCheck: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check sync status',
      details: error.message
    }, { status: 500 });
  }
}