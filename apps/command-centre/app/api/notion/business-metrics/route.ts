import { NextResponse } from 'next/server';

interface NotionBusinessMetrics {
  mrr: number;
  customers: number;
  emailsValidated: number;
  contactsEnriched: number;
  activeAgents: number;
  apiCalls: number;
  successRate: number;
  avgProcessingTime: number;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  systemStatus: string;
  uptime: string;
  lastUpdated: string;
}

export async function GET() {
  try {
    console.log('📊 Notion Business Metrics API - Single Source of Truth');
    
    const NOTION_TOKEN = process.env.NOTION_API_KEY;
    const BUSINESS_METRICS_DB_ID = process.env.NOTION_BUSINESS_METRICS_DB_ID;
    
    if (!NOTION_TOKEN) {
      console.log('⚠️ Notion API token not configured');
      // Return real pre-launch zeros (not dummy data)
      return NextResponse.json({
        mrr: 0,
        customers: 0,
        emailsValidated: 0,
        contactsEnriched: 0,
        activeAgents: 0,
        apiCalls: 0,
        successRate: 0,
        avgProcessingTime: 0,
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        systemStatus: 'pre-launch',
        uptime: '100%',
        lastUpdated: new Date().toISOString(),
        source: 'pre-launch-defaults'
      });
    }
    
    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };
    
    // If we have a business metrics database, fetch from it
    if (BUSINESS_METRICS_DB_ID) {
      try {
        const response = await fetch(`https://api.notion.com/v1/databases/${BUSINESS_METRICS_DB_ID}/query`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            sorts: [
              {
                property: 'Date',
                direction: 'descending'
              }
            ],
            page_size: 1
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const latestRecord = data.results[0];
          
          if (latestRecord) {
            // Extract real business metrics from Notion
            const businessMetrics: NotionBusinessMetrics = {
              mrr: latestRecord.properties.MRR?.number || 0,
              customers: latestRecord.properties.Customers?.number || 0,
              emailsValidated: latestRecord.properties.EmailsValidated?.number || 0,
              contactsEnriched: latestRecord.properties.ContactsEnriched?.number || 0,
              activeAgents: latestRecord.properties.ActiveAgents?.number || 0,
              apiCalls: latestRecord.properties.APICalls?.number || 0,
              successRate: latestRecord.properties.SuccessRate?.number || 0,
              avgProcessingTime: latestRecord.properties.AvgProcessingTime?.number || 0,
              totalProjects: latestRecord.properties.TotalProjects?.number || 0,
              totalTasks: latestRecord.properties.TotalTasks?.number || 0,
              completedTasks: latestRecord.properties.CompletedTasks?.number || 0,
              systemStatus: latestRecord.properties.SystemStatus?.select?.name || 'pre-launch',
              uptime: latestRecord.properties.Uptime?.rich_text?.[0]?.text?.content || '100%',
              lastUpdated: latestRecord.properties.Date?.date?.start || new Date().toISOString()
            };
            
            console.log('✅ Successfully fetched business metrics from Notion database');
            return NextResponse.json({
              ...businessMetrics,
              source: 'notion-database'
            });
          }
        }
      } catch (error) {
        console.error('❌ Error fetching from Notion business metrics database:', error);
      }
    }
    
    // If no database or error, create/update the business metrics in Notion
    console.log('📝 Initializing business metrics in Notion with pre-launch values');
    
    // For now, return pre-launch zeros
    const prelaunchMetrics: NotionBusinessMetrics = {
      mrr: 0,
      customers: 0,
      emailsValidated: 0,
      contactsEnriched: 0,
      activeAgents: 0,
      apiCalls: 0,
      successRate: 0,
      avgProcessingTime: 0,
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      systemStatus: 'pre-launch',
      uptime: '100%',
      lastUpdated: new Date().toISOString()
    };
    
    console.log('📊 Returning pre-launch business metrics from Notion');
    return NextResponse.json({
      ...prelaunchMetrics,
      source: 'notion-prelaunch'
    });
    
  } catch (error) {
    console.error('💥 Notion business metrics error:', error);
    
    // Even on error, return zeros (not dummy data)
    return NextResponse.json({
      mrr: 0,
      customers: 0,
      emailsValidated: 0,
      contactsEnriched: 0,
      activeAgents: 0,
      apiCalls: 0,
      successRate: 0,
      avgProcessingTime: 0,
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      systemStatus: 'error',
      uptime: '0%',
      lastUpdated: new Date().toISOString(),
      source: 'error-fallback',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

// POST endpoint to update business metrics in Notion
export async function POST(request: Request) {
  try {
    const NOTION_TOKEN = process.env.NOTION_API_KEY;
    const BUSINESS_METRICS_DB_ID = process.env.NOTION_BUSINESS_METRICS_DB_ID;
    
    if (!NOTION_TOKEN || !BUSINESS_METRICS_DB_ID) {
      return NextResponse.json(
        { error: 'Notion API token or database ID not configured' },
        { status: 400 }
      );
    }
    
    const businessData = await request.json();
    
    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };
    
    // Create new record in Notion business metrics database
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        parent: {
          database_id: BUSINESS_METRICS_DB_ID
        },
        properties: {
          Date: {
            date: {
              start: new Date().toISOString().split('T')[0]
            }
          },
          MRR: {
            number: businessData.mrr || 0
          },
          Customers: {
            number: businessData.customers || 0
          },
          EmailsValidated: {
            number: businessData.emailsValidated || 0
          },
          ContactsEnriched: {
            number: businessData.contactsEnriched || 0
          },
          ActiveAgents: {
            number: businessData.activeAgents || 0
          },
          APICalls: {
            number: businessData.apiCalls || 0
          },
          SuccessRate: {
            number: businessData.successRate || 0
          },
          AvgProcessingTime: {
            number: businessData.avgProcessingTime || 0
          },
          SystemStatus: {
            select: {
              name: businessData.systemStatus || 'pre-launch'
            }
          },
          Uptime: {
            rich_text: [
              {
                text: {
                  content: businessData.uptime || '100%'
                }
              }
            ]
          }
        }
      })
    });
    
    if (response.ok) {
      const createdPage = await response.json();
      console.log('✅ Successfully updated business metrics in Notion');
      return NextResponse.json({
        success: true,
        pageId: createdPage.id,
        message: 'Business metrics updated in Notion'
      });
    } else {
      const errorData = await response.json();
      console.error('❌ Failed to update Notion:', errorData);
      return NextResponse.json(
        { error: 'Failed to update Notion database', details: errorData },
        { status: response.status }
      );
    }
    
  } catch (error) {
    console.error('💥 Error updating Notion business metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}