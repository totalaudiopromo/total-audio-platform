import { NextRequest, NextResponse } from 'next/server';
import { validateEmailListAdvanced } from '@/utils/advancedEmailValidation';
import {
  getUserFromRequest,
  getCorsHeaders,
  corsOptionsResponse,
  successResponse,
  unauthorized,
  validationError,
  internalError,
} from '@total-audio/core-db';

// Handle OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return corsOptionsResponse(req.headers.get('origin'));
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'));

  try {
    // Validate authentication
    const auth = await getUserFromRequest(request);
    if (!auth.success) {
      return unauthorized(auth.error.message, corsHeaders);
    }

    const body = await request.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails)) {
      return validationError('Emails array is required', undefined, corsHeaders);
    }

    // Remove duplicates and clean emails
    const cleanEmails = [...new Set(emails.map((email: string) => email.trim().toLowerCase()))];

    if (cleanEmails.length === 0) {
      return validationError('No valid emails provided', undefined, corsHeaders);
    }

    // Validate emails with advanced validation
    const validationResult = await validateEmailListAdvanced(cleanEmails);

    return successResponse(
      {
        results: validationResult,
        processed: cleanEmails.length,
        timestamp: new Date().toISOString(),
      },
      undefined,
      200,
      corsHeaders
    );
  } catch (error: unknown) {
    console.error('Email validation error:', error);
    const message = error instanceof Error ? error.message : 'Email validation failed';
    return internalError(message, corsHeaders);
  }
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));

  return successResponse(
    {
      service: 'Email Validation API',
      status: 'ready',
      authentication: 'Required (API key or session)',
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
        'Advanced confidence scoring',
      ],
    },
    undefined,
    200,
    corsHeaders
  );
}
