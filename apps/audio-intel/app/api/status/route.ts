import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      newsjacker: 'operational',
      podcastAuto: 'operational',
      newsletterGenerator: 'operational',
      enrich: 'operational',
    },
  });
}
