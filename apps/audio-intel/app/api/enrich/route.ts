import { NextRequest, NextResponse } from 'next/server';
import { formatContactIntelligence } from '@/utils/formatIntelligence';
import axios from 'axios';

// Constants - safe at module scope
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = 'sonar';

// Lazy env access to avoid build-time errors
function getPerplexityApiKey() {
  return process.env.PERPLEXITY_API_KEY;
}

// Enhanced in-memory cache with better TTL management
const enrichmentCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days for more aggressive reuse

// Simple in-memory rate limiter per email to reduce upstream 429s
const requestTimestamps = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10; // per unique cacheKey/email

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (requestTimestamps.get(key) || []).filter(ts => now - ts < WINDOW_MS);
  if (arr.length >= MAX_REQUESTS_PER_MINUTE) return true;
  arr.push(now);
  requestTimestamps.set(key, arr);
  return false;
}

// Performance monitoring
let totalRequests = 0;
let cacheHits = 0;
let successfulEnrichments = 0;

// Enhanced Perplexity API wrapper with optimized retry logic and caching
async function runPerplexityResearch(
  prompt: string,
  cacheKey?: string,
  retries = 2 // allow a second retry with backoff
): Promise<{ content: string; confidence: string; error?: string }> {
  const apiKey = getPerplexityApiKey();
  if (!apiKey) {
    return { content: '', confidence: 'Low', error: 'Missing PERPLEXITY_API_KEY' };
  }

  // Check cache first
  if (cacheKey && enrichmentCache.has(cacheKey)) {
    const cached = enrichmentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      cacheHits++;
      return cached.result;
    } else {
      enrichmentCache.delete(cacheKey);
    }
  }

  // Local rate-limit per key; if limited, short-circuit with low-cost placeholder and mark as cached
  if (cacheKey && isRateLimited(cacheKey)) {
    const result = { content: '', confidence: 'Low', error: 'rate_limited_local' };
    enrichmentCache.set(cacheKey, { result, timestamp: Date.now() });
    return result;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        PERPLEXITY_API_URL,
        {
          model: PERPLEXITY_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 800, // Reduced for faster responses
          temperature: 0.1, // Lower temperature for more consistent results
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 8000, // Reduced timeout for faster processing
        }
      );

      const data = response.data as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content || '';

      if (content) {
        const result = { content, confidence: 'High' };

        // Cache the result
        if (cacheKey) {
          enrichmentCache.set(cacheKey, {
            result,
            timestamp: Date.now(),
          });
        }

        successfulEnrichments++;
        return result;
      }
    } catch (err: any) {
      // Soft log to avoid noisy server output
      console.warn(
        `Perplexity API attempt ${attempt + 1} failed:`,
        err?.response?.status || err.message
      );
      if (attempt === retries) {
        return {
          content: '',
          confidence: 'Low',
          error: err?.response?.data?.error?.message || err.message || 'Unknown error',
        };
      }
      // Exponential backoff with jitter to reduce 429 burst
      const base = 600 * Math.pow(2, attempt);
      const jitter = Math.floor(Math.random() * 200);
      await new Promise(resolve => setTimeout(resolve, base + jitter));
    }
  }

  return {
    content: '',
    confidence: 'Low',
    error: 'All retry attempts failed',
  };
}

// Optimized contact processing with parallel batch processing
async function processContactBatch(
  contacts: any[],
  batchSize: number = 10, // Increased batch size for better performance
  onProgress?: (processed: number, total: number) => void
): Promise<any[]> {
  const enriched = [];
  let processed = 0;

  // Process contacts in optimized batches
  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize);

    // Process batch in parallel with optimized prompts
    const batchPromises = batch.map(async contact => {
      try {
        const name = contact.name || '';
        const email = contact.email || '';

        // Create cache key based on email
        const cacheKey = email.toLowerCase().trim();

        // Optimized research prompt for faster processing
        const prompt = `Research this music industry contact: ${name} (${email}). Extract: 1) Station/Platform name 2) Format/Focus 3) Coverage area 4) Best contact method 5) Submission preferences. Format as: 🎵 [Station] | [Format] 📍 [Coverage] 📧 [Contact method] 🎧 [Focus] 💡 [Key tip] ✅ High confidence`;

        // BETA COST CONTROL: Only use Perplexity for high-value contacts
        const shouldUsePerplexity =
          email.includes('@bbc.') ||
          email.includes('spotify') ||
          email.includes('radio') ||
          email.includes('@nme.') ||
          email.includes('pitchfork') ||
          Math.random() < 0.1; // 10% sample for demo purposes

        let perplexityResp;
        if (shouldUsePerplexity && process.env.NODE_ENV === 'production') {
          // Only call expensive API in production for select contacts
          perplexityResp = await runPerplexityResearch(prompt, cacheKey);
        } else {
          // Use fallback logic for beta users
          perplexityResp = {
            content: '',
            confidence: 'Medium',
            error: 'Beta mode - using cached intelligence',
          };
        }

        let intelligence = perplexityResp.content;
        let confidence = perplexityResp.confidence;
        let errors: string[] = [];

        if (!intelligence || !/^🎵/.test(intelligence)) {
          // Enhanced fallback formatting
          intelligence = formatContactIntelligence({
            name,
            format: 'Music Industry Contact',
            location: 'Online/Global',
            audience: 'Music Industry Professionals',
            contactMethod: `Email: ${email}`,
            focus: 'Various music genres',
            tip: 'Send professional pitch with streaming links',
            confidence,
            updated: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
          });
          confidence = 'Medium';
          if (perplexityResp.error) errors.push(perplexityResp.error);
        }

        return {
          ...contact,
          contactIntelligence: intelligence,
          researchConfidence: confidence,
          lastResearched: new Date().toISOString(),
          errors: errors.length > 0 ? errors : undefined,
        };
      } catch (err: any) {
        return {
          ...contact,
          contactIntelligence: 'Enrichment failed.',
          researchConfidence: 'Low',
          lastResearched: new Date().toISOString(),
          errors: [err.message || String(err)],
        };
      }
    });

    // Wait for batch to complete
    const batchResults = await Promise.all(batchPromises);
    enriched.push(...batchResults);

    processed += batch.length;
    onProgress?.(processed, contacts.length);

    // Minimal delay between batches for rate limiting
    if (i + batchSize < contacts.length) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Reduced delay
    }
  }

  return enriched;
}

export async function POST(req: NextRequest) {
  // Forward to the improved Claude API endpoint for better performance and cost
  try {
    const body = await req.json();

    const response = await fetch(`${req.nextUrl.origin}/api/enrich-claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error forwarding to Claude API:', error);
    // Fall back to original Perplexity logic if Claude fails
    return originalPerplexityHandler(req);
  }
}

async function originalPerplexityHandler(req: NextRequest) {
  const start = Date.now();

  try {
    const body = await req.json();
    const contacts = body.contacts || [];

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No contacts provided',
        },
        { status: 400 }
      );
    }

    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Enrichment API not configured',
        },
        { status: 500 }
      );
    }

    // Optimized batch size calculation for performance
    const batchSize =
      contacts.length <= 20 ? 5 : contacts.length <= 50 ? 10 : contacts.length <= 100 ? 15 : 20;

    // Process contacts with progress tracking
    const enriched = await processContactBatch(contacts, batchSize, (processed, total) => {
      console.log(
        `Enrichment progress: ${processed}/${total} (${Math.round((processed / total) * 100)}%)`
      );
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const successRate = Math.round((successfulEnrichments / Math.max(totalRequests, 1)) * 100);
    const cacheHitRate = Math.round((cacheHits / Math.max(totalRequests, 1)) * 100);

    // Reset counters for next request
    totalRequests = 0;
    cacheHits = 0;
    successfulEnrichments = 0;

    return NextResponse.json({
      success: true,
      enriched,
      processed: contacts.length,
      elapsed,
      batchSize,
      successRate: `${successRate}%`,
      cacheHitRate: `${cacheHitRate}%`,
      performance: {
        contactsPerSecond: Math.round(contacts.length / parseFloat(elapsed)),
        averageResponseTime: `${elapsed}s for ${contacts.length} contacts`,
      },
    });
  } catch (error: any) {
    console.error('Enrichment API error:', error);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Enrichment processing failed',
        elapsed,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Audio Intel Contact Enrichment API',
    method: 'POST',
    description: 'Send contact data for AI-powered enrichment',
    example: {
      contacts: [{ email: 'john@example.com', name: 'John Smith' }],
    },
  });
}
