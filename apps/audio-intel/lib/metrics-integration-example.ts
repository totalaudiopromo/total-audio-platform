/**
 * Example: How to integrate event tracking into API routes
 *
 * This file demonstrates the pattern for adding metrics tracking
 * to existing API endpoints in Audio Intel.
 *
 * DO NOT import this file directly - it's a reference guide only.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  trackEnrichmentStart,
  trackEnrichmentComplete,
  trackEnrichmentFailed,
  trackExport,
  trackUserSignup,
  incrementUsageCounter,
  getTodayDate,
  getRequestMetadata,
} from './metrics';

/**
 * Example 1: Adding tracking to contact enrichment endpoint
 * Pattern: Track start, success/failure, and increment usage counter
 */
export async function enrichmentEndpointExample(req: NextRequest) {
  const startTime = Date.now();
  const userId = 'user-id-from-session'; // Get from Supabase auth session
  const contacts: any[] = []; // Parse from request body

  try {
    // Track enrichment start
    await trackEnrichmentStart({
      userId,
      contactCount: contacts.length,
      source: 'web_upload', // or 'csv_upload', 'api', etc.
    });

    // Your existing enrichment logic
    const enrichedContacts = await performEnrichment(contacts);
    const successCount = enrichedContacts.filter(c => c.intelligence).length;

    // Track enrichment completion
    await trackEnrichmentComplete({
      userId,
      contactCount: contacts.length,
      successCount,
      durationMs: Date.now() - startTime,
      source: 'web_upload',
    });

    // Increment usage counter
    await incrementUsageCounter({
      userId,
      date: getTodayDate(),
      enrichmentsCount: contacts.length,
    });

    return NextResponse.json({
      success: true,
      enriched: enrichedContacts,
    });
  } catch (error: any) {
    // Track enrichment failure
    await trackEnrichmentFailed({
      userId,
      contactCount: contacts.length,
      errorMessage: error.message,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Example 2: Adding tracking to export endpoints
 * Pattern: Track export type, count, and duration
 */
export async function exportEndpointExample(req: NextRequest) {
  const startTime = Date.now();
  const userId = 'user-id-from-session';
  const exportType = 'csv'; // or 'json', 'tracker'
  const contacts: any[] = []; // Get from request

  try {
    // Your existing export logic
    const exportData = await generateExport(contacts, exportType);

    // Track export completion
    await trackExport({
      userId,
      exportType: exportType as 'csv' | 'json' | 'tracker',
      contactCount: contacts.length,
      durationMs: Date.now() - startTime,
    });

    // Increment usage counter
    await incrementUsageCounter({
      userId,
      date: getTodayDate(),
      exportsCount: 1,
    });

    return NextResponse.json({
      success: true,
      data: exportData,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Example 3: Adding tracking to user signup
 * Pattern: Track user creation with metadata
 */
export async function signupEndpointExample(req: NextRequest) {
  try {
    const { email, ...userData } = await req.json();

    // Your existing signup logic
    const user = await createUser(email, userData);

    // Track user signup
    await trackUserSignup({
      userId: user.id,
      email: user.email,
      source: req.headers.get('referer')?.includes('demo') ? 'demo' : 'organic',
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Example 4: Tracking session duration
 * Pattern: Track when user starts/ends session
 */
export async function sessionTrackingExample(userId: string, sessionDurationMs: number) {
  await incrementUsageCounter({
    userId,
    date: getTodayDate(),
    sessionsCount: 1,
    sessionDurationMs,
  });
}

/**
 * Example 5: Using request metadata
 * Pattern: Extract IP, user agent, referrer for analysis
 */
export async function trackWithRequestMetadata(req: NextRequest, userId: string) {
  const metadata = getRequestMetadata(req);

  // This metadata is automatically included when using trackEvent()
  // You can also use it explicitly:
  console.log('Request from:', metadata.requestIp);
  console.log('User agent:', metadata.userAgent);
  console.log('Referrer:', metadata.referrer);
}

// Dummy functions for examples
async function performEnrichment(contacts: any[]) {
  return contacts;
}
async function generateExport(contacts: any[], exportType: string) {
  return {};
}
async function createUser(email: string, userData: any) {
  return { id: '123', email };
}
