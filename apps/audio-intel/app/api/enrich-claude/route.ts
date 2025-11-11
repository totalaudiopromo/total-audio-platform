/**
 * Claude API Enrichment Endpoint - Production-Ready
 * Uses IntelAgent with ClaudeEnrichmentService for contact enrichment
 *
 * Features:
 * - API key validation
 * - Rate limit handling
 * - Cost tracking and metrics
 * - Proper error handling
 * - CORS support for demo pages
 * - Request/response timing
 */

import { NextRequest, NextResponse } from 'next/server';
import { Agents } from '@/agents';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Rate limit configuration
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

// In-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true };
}

/**
 * Add CORS headers for demo/development
 */
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  return addCorsHeaders(NextResponse.json({ success: true }));
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // 1. Validate API key configuration
    if (!ANTHROPIC_API_KEY) {
      console.error('[Enrichment API] ANTHROPIC_API_KEY not configured');
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'API key not configured',
            code: 'MISSING_API_KEY',
          },
          { status: 500 }
        )
      );
    }

    // 2. Check rate limits
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt! - Date.now()) / 1000);
      console.warn(`[Enrichment API] Rate limit exceeded for ${ip}, resets in ${resetIn}s`);
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            resetIn,
          },
          { status: 429 }
        )
      );
    }

    // 3. Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('[Enrichment API] Invalid JSON:', error);
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Invalid JSON in request body',
            code: 'INVALID_JSON',
          },
          { status: 400 }
        )
      );
    }

    const contacts = body.contacts || [];

    // 4. Validate contacts array
    if (!Array.isArray(contacts)) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'contacts must be an array',
            code: 'INVALID_CONTACTS_TYPE',
          },
          { status: 400 }
        )
      );
    }

    if (contacts.length === 0) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'No contacts provided',
            code: 'EMPTY_CONTACTS',
            summary: {
              total: 0,
              enriched: 0,
              failed: 0,
              cost: 0,
            },
          },
          { status: 400 }
        )
      );
    }

    // 5. Process contacts through IntelAgent
    console.log(`[Enrichment API] Processing ${contacts.length} contacts for ${ip}`);

    const results = [];
    let successCount = 0;
    let failedCount = 0;
    let totalCost = 0;
    const enrichmentStart = Date.now();

    for (const contact of contacts) {
      const contactStart = Date.now();

      try {
        // Use email as the primary identifier, fallback to name
        const contactIdentifier = contact.email || contact.name || 'Unknown';

        const result = await Agents.intel.execute({
          artist: contactIdentifier,
          genre: contact.genre,
          region: contact.region || 'UK',
          includeLabels: false, // Just contacts for now
          contactEmail: contact.email, // Pass email explicitly for enrichment
        });

        const contactElapsed = Date.now() - contactStart;

        if (result.success) {
          successCount++;

          // Extract contact intelligence from IntelAgent response
          const contactData = result.data?.contacts?.[0];

          // Build intelligence summary from enriched fields
          let intelligence = '';
          if (contactData) {
            const parts = [];
            if (contactData.platform) parts.push(`Platform: ${contactData.platform}`);
            if (contactData.role) parts.push(`Role: ${contactData.role}`);
            if (contactData.format) parts.push(`Format: ${contactData.format}`);
            if (contactData.coverage) parts.push(`Coverage: ${contactData.coverage}`);
            if (contactData.genres && contactData.genres.length > 0) {
              parts.push(`Genres: ${contactData.genres.join(', ')}`);
            }
            if (contactData.contactMethod)
              parts.push(`Contact Method: ${contactData.contactMethod}`);
            if (contactData.bestTiming) parts.push(`Best Timing: ${contactData.bestTiming}`);
            if (contactData.submissionGuidelines) {
              parts.push(`Submission Guidelines: ${contactData.submissionGuidelines}`);
            }
            if (contactData.pitchTips && contactData.pitchTips.length > 0) {
              parts.push(`Pitch Tips: ${contactData.pitchTips.join('; ')}`);
            }
            if (contactData.reasoning) parts.push(`Notes: ${contactData.reasoning}`);

            intelligence = parts.length > 0 ? parts.join('\n') : 'No intelligence found';
          } else {
            intelligence = 'No intelligence found';
          }

          // Use confidence from enrichment service, or fall back to validation score
          const confidence =
            contactData?.confidence || (result.data?.validation?.score > 0.7 ? 'High' : 'Medium');

          // Transform to expected format
          const enrichedContact = {
            ...contact,
            intelligence,
            contactIntelligence: intelligence, // Support both field names
            confidence,
            researchConfidence: confidence, // Support both field names
            lastResearched: new Date().toISOString(),
            // Include enriched fields if available
            platform: contactData?.platform,
            role: contactData?.role, // Add role field
            format: contactData?.format,
            coverage: contactData?.coverage,
            genres: contactData?.genres,
            contactMethod: contactData?.contactMethod,
            bestTiming: contactData?.bestTiming,
            submissionGuidelines: contactData?.submissionGuidelines,
            pitchTips: contactData?.pitchTips,
            reasoning: contactData?.reasoning,
            source: contactData?.source || 'claude',
            processingTime: contactElapsed,
          };

          results.push(enrichedContact);

          // Estimate cost (Sonnet: $3/1M input, $15/1M output, ~500 tokens avg)
          const estimatedCost = 0.003; // ~$0.003 per contact
          totalCost += estimatedCost;

          console.log(
            `[Enrichment API] Enriched ${contact.name} (${contactElapsed}ms, $${estimatedCost.toFixed(4)})`
          );
        } else {
          failedCount++;

          // Fallback for failed enrichment
          results.push({
            ...contact,
            intelligence: 'Enrichment failed - manual research required',
            contactIntelligence: 'Enrichment failed - manual research required',
            confidence: 'Low',
            researchConfidence: 'Low',
            lastResearched: new Date().toISOString(),
            error: result.error,
            source: 'fallback',
            processingTime: contactElapsed,
          });

          console.warn(
            `[Enrichment API] Failed to enrich ${contact.name}: ${result.error} (${contactElapsed}ms)`
          );
        }
      } catch (contactError) {
        failedCount++;
        const contactElapsed = Date.now() - contactStart;

        console.error(`[Enrichment API] Error processing ${contact.name}:`, contactError);

        results.push({
          ...contact,
          intelligence: 'Processing error - manual research required',
          contactIntelligence: 'Processing error - manual research required',
          confidence: 'Low',
          researchConfidence: 'Low',
          lastResearched: new Date().toISOString(),
          error: contactError instanceof Error ? contactError.message : 'Unknown error',
          source: 'error',
          processingTime: contactElapsed,
        });
      }
    }

    const enrichmentElapsed = Date.now() - enrichmentStart;
    const totalElapsed = ((Date.now() - start) / 1000).toFixed(2);
    const successRate = Math.round((successCount / contacts.length) * 100);

    // 6. Build comprehensive response
    const response = {
      success: true,
      enriched: results,
      summary: {
        total: contacts.length,
        enriched: successCount,
        failed: failedCount,
        cost: parseFloat(totalCost.toFixed(4)),
      },
      metrics: {
        totalTime: `${totalElapsed}s`,
        enrichmentTime: `${(enrichmentElapsed / 1000).toFixed(2)}s`,
        averageTimePerContact: `${(enrichmentElapsed / contacts.length).toFixed(0)}ms`,
        successRate: `${successRate}%`,
        contactsPerSecond: parseFloat((contacts.length / parseFloat(totalElapsed)).toFixed(2)),
      },
      provider: {
        name: 'IntelAgent',
        model: 'Claude 3.5 Sonnet',
        version: '1.0.0',
      },
    };

    console.log(
      `[Enrichment API] Completed: ${successCount}/${contacts.length} enriched (${totalElapsed}s, $${totalCost.toFixed(4)})`
    );

    return addCorsHeaders(NextResponse.json(response));
  } catch (error: any) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.error('[Enrichment API] Unexpected error:', error);

    // Handle specific error types
    if (error.name === 'AbortError') {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Request timeout',
            code: 'TIMEOUT',
            elapsed: `${elapsed}s`,
          },
          { status: 504 }
        )
      );
    }

    if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      return addCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: 'Claude API rate limit exceeded',
            code: 'CLAUDE_RATE_LIMIT',
            elapsed: `${elapsed}s`,
          },
          { status: 429 }
        )
      );
    }

    return addCorsHeaders(
      NextResponse.json(
        {
          success: false,
          error: error.message || 'Enrichment processing failed',
          code: 'INTERNAL_ERROR',
          elapsed: `${elapsed}s`,
        },
        { status: 500 }
      )
    );
  }
}

export async function GET() {
  return addCorsHeaders(
    NextResponse.json({
      service: 'Audio Intel Contact Enrichment API',
      version: '2.0.0',
      status: ANTHROPIC_API_KEY ? 'operational' : 'degraded',
      provider: {
        name: 'IntelAgent',
        model: ANTHROPIC_API_KEY ? 'Claude 3.5 Sonnet' : 'Fallback Mode',
        version: '1.0.0',
      },
      pricing: {
        costPerContact: ANTHROPIC_API_KEY ? '$0.003' : '$0.000',
        estimatedCostPer100: ANTHROPIC_API_KEY ? '$0.30' : '$0.00',
      },
      rateLimit: {
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
        windowMs: RATE_LIMIT_WINDOW_MS,
        window: '1 minute',
      },
      features: [
        'Production-ready error handling',
        'Request/response timing metrics',
        'Cost tracking per request',
        'Rate limiting protection',
        'CORS support for demo pages',
        'Batch and single contact processing',
        'Automatic fallback for failures',
        'Detailed logging and debugging',
      ],
      endpoints: {
        enrich: 'POST /api/enrich-claude',
        status: 'GET /api/enrich-claude',
      },
      requestFormat: {
        method: 'POST',
        contentType: 'application/json',
        body: {
          contacts: [
            {
              name: 'Contact Name (required)',
              email: 'contact@example.com (optional)',
              genre: 'Genre (optional)',
              region: 'UK (optional)',
            },
          ],
        },
      },
      responseFormat: {
        success: 'boolean',
        enriched: 'EnrichedContact[]',
        summary: {
          total: 'number',
          enriched: 'number',
          failed: 'number',
          cost: 'number (in USD)',
        },
        metrics: {
          totalTime: 'string (seconds)',
          enrichmentTime: 'string (seconds)',
          averageTimePerContact: 'string (milliseconds)',
          successRate: 'string (percentage)',
          contactsPerSecond: 'number',
        },
      },
      documentation: 'https://intel.totalaudiopromo.com/documentation',
    })
  );
}
