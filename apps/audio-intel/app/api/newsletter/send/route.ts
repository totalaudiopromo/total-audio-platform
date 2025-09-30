import { NextRequest, NextResponse } from 'next/server';

// Temporarily simplified for build fix - focusing on customer acquisition
export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: false,
    message: 'Newsletter system temporarily disabled for build fix',
    note: 'Focus on customer acquisition - newsletter system will be re-enabled after core functionality is stable'
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: false,
    message: 'Newsletter system temporarily disabled for build fix',
    note: 'Focus on customer acquisition - newsletter system will be re-enabled after core functionality is stable'
  });
}

// Placeholder function to avoid import errors
async function sendEmailViaConvertKit(to: string, subject: string, html: string) {
  return { success: false, error: 'Temporarily disabled' };
}

async function getNewsletterSubscribers() {
  return [];
}