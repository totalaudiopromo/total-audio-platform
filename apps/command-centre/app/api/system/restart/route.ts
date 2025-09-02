import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { service } = await request.json();
    
    // Validate service parameter
    const validServices = ['audio-intel', 'command-centre', 'all'];
    if (service && !validServices.includes(service)) {
      return NextResponse.json(
        { error: 'Invalid service. Must be one of: audio-intel, command-centre, all' },
        { status: 400 }
      );
    }

    const serviceToRestart = service || 'audio-intel';
    
    // Log restart request
    console.log(`[${new Date().toISOString()}] System restart requested for: ${serviceToRestart}`);
    
    // In production, this would trigger actual service restarts
    // For now, we'll simulate the restart process
    const restartResults: any = {
      requestId: `restart_${Date.now()}`,
      service: serviceToRestart,
      status: 'success',
      timestamp: new Date().toISOString(),
      message: `${serviceToRestart} restart initiated successfully`
    };

    // Simulate restart delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // If restarting Audio Intel, try to ping it after restart
    if (serviceToRestart === 'audio-intel' || serviceToRestart === 'all') {
      try {
        // In production, this would check if Audio Intel is back online
        const healthCheck = {
          audioIntel: {
            status: 'online',
            uptime: '0s',
            lastRestart: new Date().toISOString()
          }
        };
        
        restartResults.healthCheck = healthCheck;
      } catch (error) {
        console.warn('Health check failed after restart:', error);
      }
    }

    return NextResponse.json({
      success: true,
      ...restartResults
    });

  } catch (error) {
    console.error('System restart error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to restart system',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Get system status for restart button
  try {
    const systemStatus = {
      audioIntel: {
        status: 'online',
        uptime: '2h 15m',
        lastRestart: '2025-09-01T10:30:00Z',
        canRestart: true
      },
      commandCentre: {
        status: 'online', 
        uptime: '1d 3h',
        lastRestart: '2025-08-31T07:15:00Z',
        canRestart: true
      }
    };

    return NextResponse.json({
      success: true,
      services: systemStatus
    });

  } catch (error) {
    console.error('Failed to get system status:', error);
    return NextResponse.json(
      { error: 'Failed to get system status' },
      { status: 500 }
    );
  }
}