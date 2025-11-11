/**
 * Claude API Enrichment Endpoint - Production-Ready v2.1.0
 * Uses IntelAgent with ClaudeEnrichmentService for contact enrichment
 *
 * Features:
 * - API key validation
 * - Rate limit handling with automatic retry
 * - Cost tracking and metrics
 * - Comprehensive error recovery:
 *   - Graceful degradation (fallback intelligence for failed contacts)
 *   - Retry logic (1 retry with exponential backoff)
 *   - Timeout protection (10s per contact)
 *   - Partial success responses (never fail entire batch)
 *   - Rate limit detection and handling
 * - CORS support for demo pages
 * - Request/response timing
 * - Detailed error tracking and logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { Agents } from '@/agents';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Rate limit configuration
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

// Error recovery configuration
const MAX_RETRIES = 1; // Retry failed contacts once
const RETRY_DELAY_MS = 1000; // 1 second exponential backoff base
const CONTACT_TIMEOUT_MS = 10000; // 10 second timeout per contact

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

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute function with timeout protection
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(timeoutError)), timeoutMs)),
  ]);
}

/**
 * Check if error is a rate limit error (429)
 */
function isRateLimitError(error: any): boolean {
  if (error?.status === 429) return true;
  if (error?.message?.includes('429')) return true;
  if (error?.message?.toLowerCase().includes('rate limit')) return true;
  return false;
}

/**
 * Enrich a single contact with retry logic and timeout protection
 */
async function enrichContactWithRetry(
  contact: any,
  attempt: number = 0
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  retried?: boolean;
  timedOut?: boolean;
}> {
  try {
    // Use email as the primary identifier, fallback to name
    const contactIdentifier = contact.email || contact.name || 'Unknown';

    // Wrap IntelAgent.execute() with timeout protection
    const result = await withTimeout(
      Agents.intel.execute({
        artist: contactIdentifier,
        genre: contact.genre,
        region: contact.region || 'UK',
        includeLabels: false,
        contactEmail: contact.email,
      }),
      CONTACT_TIMEOUT_MS,
      `Contact enrichment timed out after ${CONTACT_TIMEOUT_MS}ms`
    );

    return { success: true, data: result };
  } catch (error: any) {
    const isTimeout = error.message?.includes('timed out');
    const isRateLimit = isRateLimitError(error);

    // Retry logic: retry once with exponential backoff
    if (attempt < MAX_RETRIES && !isTimeout) {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt);

      console.log(
        `[Enrichment API] Retrying ${contact.name} (attempt ${attempt + 1}/${MAX_RETRIES}) after ${delay}ms delay`
      );

      // If rate limit, wait longer
      if (isRateLimit) {
        await sleep(delay * 2);
      } else {
        await sleep(delay);
      }

      // Retry the request
      const retryResult = await enrichContactWithRetry(contact, attempt + 1);
      return { ...retryResult, retried: true };
    }

    return {
      success: false,
      error: error.message || 'Unknown error',
      timedOut: isTimeout,
    };
  }
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

    // 5. Process contacts through IntelAgent with error recovery (PARALLEL BATCHES)
    console.log(`[Enrichment API] Processing ${contacts.length} contacts for ${ip}`);

    const enrichedResults: any[] = [];
    const failedResults: any[] = [];
    let successCount = 0;
    let failedCount = 0;
    let retriedCount = 0;
    let timedOutCount = 0;
    let totalCost = 0;
    const enrichmentStart = Date.now();

    const BATCH_SIZE = 5;
    const BATCH_DELAY_MS = 500;

    /**
     * Process a single contact through IntelAgent with retry logic
     */
    async function processContact(contact: any) {
      const contactStart = Date.now();

      try {
        // Use retry-enabled enrichment function
        const enrichmentResult = await enrichContactWithRetry(contact);
        const contactElapsed = Date.now() - contactStart;

        if (enrichmentResult.success && enrichmentResult.data) {
          const result = enrichmentResult.data;

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
            role: contactData?.role,
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
            retried: enrichmentResult.retried || false,
          };

          // Estimate cost (Sonnet: $3/1M input, $15/1M output, ~500 tokens avg)
          const estimatedCost = 0.003; // ~$0.003 per contact

          console.log(
            `[Enrichment API] Enriched ${contact.name} (${contactElapsed}ms, $${estimatedCost.toFixed(4)}${enrichmentResult.retried ? ', retried' : ''})`
          );

          return {
            enriched: enrichedContact,
            failed: null,
            success: true,
            cost: estimatedCost,
            retried: enrichmentResult.retried || false,
            timedOut: false,
          };
        } else {
          // Graceful degradation: return fallback intelligence
          const fallbackReason = enrichmentResult.timedOut
            ? 'Enrichment timed out - contact research service temporarily unavailable'
            : 'Enrichment failed - manual research required';

          const fallbackContact = {
            ...contact,
            intelligence: fallbackReason,
            contactIntelligence: fallbackReason,
            confidence: 'Low',
            researchConfidence: 'Low',
            lastResearched: new Date().toISOString(),
            error: enrichmentResult.error,
            source: 'fallback',
            processingTime: contactElapsed,
            timedOut: enrichmentResult.timedOut || false,
          };

          console.warn(
            `[Enrichment API] Failed to enrich ${contact.name}: ${enrichmentResult.error} (${contactElapsed}ms${enrichmentResult.timedOut ? ', timed out' : ''})`
          );

          return {
            enriched: null,
            failed: fallbackContact,
            success: false,
            cost: 0,
            retried: false,
            timedOut: enrichmentResult.timedOut || false,
          };
        }
      } catch (contactError) {
        // Final safety net: catch any unexpected errors
        const contactElapsed = Date.now() - contactStart;
        console.error(
          `[Enrichment API] Unexpected error processing ${contact.name}:`,
          contactError
        );

        const errorContact = {
          ...contact,
          intelligence: 'Processing error - manual research required',
          contactIntelligence: 'Processing error - manual research required',
          confidence: 'Low',
          researchConfidence: 'Low',
          lastResearched: new Date().toISOString(),
          error: contactError instanceof Error ? contactError.message : 'Unknown error',
          source: 'error',
          processingTime: contactElapsed,
        };

        return {
          enriched: null,
          failed: errorContact,
          success: false,
          cost: 0,
          retried: false,
          timedOut: false,
        };
      }
    }

    // Process contacts in parallel batches
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE);
      const batchStart = Date.now();

      console.log(
        `[Enrichment API] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(contacts.length / BATCH_SIZE)} (${batch.length} contacts)`
      );

      // Process batch in parallel
      const batchResults = await Promise.all(batch.map(contact => processContact(contact)));

      // Aggregate results
      for (const result of batchResults) {
        if (result.success && result.enriched) {
          successCount++;
          enrichedResults.push(result.enriched);
          totalCost += result.cost;
          if (result.retried) retriedCount++;
        } else if (result.failed) {
          failedCount++;
          failedResults.push(result.failed);
          if (result.timedOut) timedOutCount++;
        }
      }

      const batchElapsed = Date.now() - batchStart;
      console.log(
        `[Enrichment API] Batch completed in ${batchElapsed}ms (${(batchElapsed / batch.length).toFixed(0)}ms avg per contact)`
      );

      // Add delay between batches to respect rate limits (except for last batch)
      if (i + BATCH_SIZE < contacts.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    // Combine enriched and failed results for partial success response
    const allResults = [...enrichedResults, ...failedResults];

    const enrichmentElapsed = Date.now() - enrichmentStart;
    const totalElapsed = ((Date.now() - start) / 1000).toFixed(2);
    const successRate = Math.round((successCount / contacts.length) * 100);

    // 6. Build comprehensive response with error recovery metrics
    const response = {
      success: true, // Always true for partial success
      enriched: allResults, // All contacts returned (successful or fallback)
      summary: {
        total: contacts.length,
        enriched: successCount,
        failed: failedCount,
        retried: retriedCount,
        timedOut: timedOutCount,
        cost: parseFloat(totalCost.toFixed(4)),
      },
      metrics: {
        totalTime: `${totalElapsed}s`,
        enrichmentTime: `${(enrichmentElapsed / 1000).toFixed(2)}s`,
        averageTimePerContact: `${(enrichmentElapsed / contacts.length).toFixed(0)}ms`,
        successRate: `${successRate}%`,
        retryRate: successCount > 0 ? `${Math.round((retriedCount / successCount) * 100)}%` : '0%',
        timeoutRate: `${Math.round((timedOutCount / contacts.length) * 100)}%`,
        contactsPerSecond: parseFloat((contacts.length / parseFloat(totalElapsed)).toFixed(2)),
      },
      errorRecovery: {
        enabled: true,
        maxRetries: MAX_RETRIES,
        retryDelay: `${RETRY_DELAY_MS}ms`,
        timeout: `${CONTACT_TIMEOUT_MS}ms`,
        gracefulDegradation: true,
      },
      provider: {
        name: 'IntelAgent',
        model: 'Claude 3.5 Sonnet',
        version: '2.0.0',
      },
    };

    console.log(
      `[Enrichment API] Completed: ${successCount}/${contacts.length} enriched (${totalElapsed}s, $${totalCost.toFixed(4)}, ${retriedCount} retried, ${timedOutCount} timed out)`
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
      version: '2.1.0',
      status: ANTHROPIC_API_KEY ? 'operational' : 'degraded',
      provider: {
        name: 'IntelAgent',
        model: ANTHROPIC_API_KEY ? 'Claude 3.5 Sonnet' : 'Fallback Mode',
        version: '2.0.0',
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
        'Automatic retry with exponential backoff',
        'Timeout protection (10s per contact)',
        'Graceful degradation with fallback intelligence',
        'Partial success responses',
        'Rate limit detection and handling',
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
        success: 'boolean (always true for partial success)',
        enriched: 'EnrichedContact[] (includes successful and fallback contacts)',
        summary: {
          total: 'number',
          enriched: 'number (successfully enriched)',
          failed: 'number (returned with fallback intelligence)',
          retried: 'number (contacts retried)',
          timedOut: 'number (contacts that timed out)',
          cost: 'number (in USD)',
        },
        metrics: {
          totalTime: 'string (seconds)',
          enrichmentTime: 'string (seconds)',
          averageTimePerContact: 'string (milliseconds)',
          successRate: 'string (percentage)',
          retryRate: 'string (percentage of successful that were retried)',
          timeoutRate: 'string (percentage that timed out)',
          contactsPerSecond: 'number',
        },
        errorRecovery: {
          enabled: 'boolean',
          maxRetries: 'number',
          retryDelay: 'string (milliseconds)',
          timeout: 'string (milliseconds)',
          gracefulDegradation: 'boolean',
        },
      },
      documentation: 'https://intel.totalaudiopromo.com/documentation',
    })
  );
}
