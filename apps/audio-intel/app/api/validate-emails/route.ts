import { NextRequest, NextResponse } from 'next/server';
import { validateEmailListAdvanced } from '@/utils/advancedEmailValidation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emails, batchMode = false } = body;

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json({
        success: false,
        error: 'Emails array is required'
      }, { status: 400 });
    }

    // Remove duplicates and clean emails
    const cleanEmails = [...new Set(emails.map((email: string) => email.trim().toLowerCase()))];

    if (cleanEmails.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid emails provided'
      }, { status: 400 });
    }

    // Validate emails with advanced validation
    const validationResult = await validateEmailListAdvanced(cleanEmails);

    return NextResponse.json({
      success: true,
      data: validationResult,
      processed: cleanEmails.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Email validation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Email validation failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Email validation API is ready',
          features: [
        'RFC-compliant syntax validation',
        'DNS MX record checking',
        'SMTP connection testing',
        'Disposable email detection (100+ domains)',
        'Role-based email detection',
        'Spam trap detection',
        'Catch-all domain detection',
        'Reputation scoring',
        'Business email classification',
        'Advanced confidence scoring'
      ]
  });
} 