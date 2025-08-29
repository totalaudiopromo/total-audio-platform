import { NextRequest, NextResponse } from 'next/server';
import { formatContactIntelligence } from '@/utils/formatIntelligence';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Enhanced in-memory cache with better TTL management
const enrichmentCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Enhanced rate limiter with production safeguards
const requestTimestamps = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 15; // Reduced for production stability
const GLOBAL_RATE_LIMIT = 100; // Global requests per minute across all users
const globalRequestCount = { count: 0, resetTime: Date.now() + WINDOW_MS };

function isRateLimited(key: string): boolean {
  const now = Date.now();
  
  // Check global rate limit first
  if (now > globalRequestCount.resetTime) {
    globalRequestCount.count = 0;
    globalRequestCount.resetTime = now + WINDOW_MS;
  }
  
  if (globalRequestCount.count >= GLOBAL_RATE_LIMIT) {
    console.warn(`Global rate limit exceeded: ${globalRequestCount.count}/${GLOBAL_RATE_LIMIT}`);
    return true;
  }
  
  // Check per-key rate limit
  const arr = (requestTimestamps.get(key) || []).filter(ts => now - ts < WINDOW_MS);
  if (arr.length >= MAX_REQUESTS_PER_MINUTE) {
    console.warn(`Per-key rate limit exceeded for ${key}: ${arr.length}/${MAX_REQUESTS_PER_MINUTE}`);
    return true;
  }
  
  arr.push(now);
  requestTimestamps.set(key, arr);
  globalRequestCount.count++;
  return false;
}

// Performance monitoring
let totalRequests = 0;
let cacheHits = 0;
let successfulEnrichments = 0;

// Claude API wrapper with optimized prompts and caching
async function runClaudeResearch(
  prompt: string, 
  cacheKey?: string,
  retries = 1
): Promise<{ content: string; confidence: string; error?: string }> {
  if (!ANTHROPIC_API_KEY) {
    return { content: '', confidence: 'Low', error: 'Missing ANTHROPIC_API_KEY' };
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

  // Local rate-limit per key
  if (cacheKey && isRateLimited(cacheKey)) {
    const result = { content: '', confidence: 'Low', error: 'rate_limited_local' };
    enrichmentCache.set(cacheKey, { result, timestamp: Date.now() });
    return result;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 300, // Optimized for cost
          temperature: 0.1,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || '';
      
      if (content) {
        const result = { content, confidence: 'High' };
        
        // Cache the result
        if (cacheKey) {
          enrichmentCache.set(cacheKey, {
            result,
            timestamp: Date.now()
          });
        }
        
        successfulEnrichments++;
        return result;
      }
    } catch (err: any) {
      console.warn(`Claude API attempt ${attempt + 1} failed:`, err.message);
      if (attempt === retries) {
        return {
          content: '',
          confidence: 'Low',
          error: err.message || 'Unknown error',
        };
      }
      // Simple backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  return {
    content: '',
    confidence: 'Low',
    error: 'All retry attempts failed',
  };
}

// Optimized contact processing with Claude API
async function processContactBatch(
  contacts: any[], 
  batchSize: number = 15, // Optimized for Claude API
  onProgress?: (processed: number, total: number) => void
): Promise<any[]> {
  const enriched = [];
  let processed = 0;
  
  // Process contacts in optimized batches
  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize);
    
    // Process batch in parallel with optimized prompts
    const batchPromises = batch.map(async (contact) => {
      try {
        const name = contact.name || '';
        const email = contact.email || '';
        
        // Create cache key based on email
        const cacheKey = email.toLowerCase().trim();
        
        // Optimized research prompt for Claude API
        const prompt = `Research this music industry contact for promotion purposes: ${name} (${email}).

Provide intelligence in this exact format:
🎵 [Station/Platform Name] | [Music Format/Genre Focus]
📍 [Coverage Area/Location] 
📧 [Best Contact Method & Timing]
🎧 [Specific Focus/Programming Details]
💡 [Key Submission Tip]
✅ [Confidence Level: High/Medium/Low]

Be specific about music industry details like genre preferences, submission guidelines, and contact preferences. If limited info is available, use domain analysis and industry knowledge to provide helpful guidance.`;
        
        // Call Claude with caching
        const claudeResp = await runClaudeResearch(prompt, cacheKey);
        
        let intelligence = claudeResp.content;
        let confidence = claudeResp.confidence;
        let errors: string[] = [];
        
        // If Claude didn't return proper format, use enhanced fallback
        if (!intelligence || !/^🎵/.test(intelligence)) {
          // Enhanced domain-based intelligence with expanded music industry domains
          const domain = email.split('@')[1]?.toLowerCase() || '';
          
          // Expanded high-confidence domains for music industry
          const highConfidenceDomains = [
            'bbc.co.uk', 'bbc.com',
            'petetong.com', 'electronicssounds.com', 'mixmag.net', 'djtimes.com',
            'musicweek.com', 'billboard.com', 'pitchfork.com', 'nme.com',
            'rollingstone.com', 'theguardian.com', 'thetimes.co.uk',
            'spotify.com', 'universal-music.co.uk', 'sonymusic.co.uk', 'warnermusic.co.uk',
            'radiocaroline.co.uk', 'absoluteradio.co.uk', 'capitalfm.com', 
            'heart.co.uk', 'kissfmuk.com', 'radiox.co.uk'
          ];
          
          const isHighConfidenceDomain = highConfidenceDomains.includes(domain);
          
          if (domain.includes('bbc.co.uk') || domain.includes('bbc.')) {
            intelligence = formatContactIntelligence({
              name: 'BBC Radio',
              format: 'Public Service Broadcasting - All Genres',
              location: 'UK National Coverage',
              audience: 'Diverse UK Audience - 30M+ listeners',
              contactMethod: `Email: ${email} (BBC Guidelines Required)`,
              focus: 'Quality music across all genres, BBC introducing new artists',
              tip: 'Follow BBC Music submission guidelines, high-quality demos essential',
              confidence: 'High',
              updated: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            });
            confidence = 'High';
          } else if (domain === 'petetong.com') {
            intelligence = formatContactIntelligence({
              name: 'Pete Tong',
              format: 'BBC Radio 1 Essential Mix - Electronic/Dance Music',
              location: 'UK National + Global Reach',
              audience: 'Electronic Music Fans Worldwide - 5M+ weekly listeners',
              contactMethod: `Email: ${email} (Management/Label Contact)`,
              focus: 'Electronic, House, Techno, Dance Music',
              tip: 'Submit high-quality electronic music demos, established artists preferred',
              confidence: 'High',
              updated: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            });
            confidence = 'High';
          } else if (domain === 'electronicssounds.com') {
            intelligence = formatContactIntelligence({
              name: 'Electronic Sounds Magazine',
              format: 'Electronic Music Publication & Reviews',
              location: 'UK-based, Global Coverage',
              audience: 'Electronic Music Industry & Enthusiasts',
              contactMethod: `Email: ${email} (Editorial Team)`,
              focus: 'Electronic music reviews, features, industry news',
              tip: 'Submit electronic music releases with press kit and high-res images',
              confidence: 'High',
              updated: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            });
            confidence = 'High';
          } else if (isHighConfidenceDomain || domain.includes('radio') || domain.includes('fm') || domain.includes('music')) {
            intelligence = formatContactIntelligence({
              name: `${name || 'Music Contact'}`,
              format: 'Radio/Music Industry Contact',
              location: 'Regional/Online Coverage',
              audience: 'Music Industry Professionals',
              contactMethod: `Email: ${email} (Industry Standard)`,
              focus: 'Music promotion and industry networking',
              tip: 'Professional approach with streaming links and EPK',
              confidence: 'Medium',
              updated: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            });
            confidence = 'Medium';
          } else {
            intelligence = formatContactIntelligence({
              name: name || 'Contact',
              format: 'General Contact - Needs Research',
              location: 'Unknown Coverage Area',
              audience: 'Unknown Audience',
              contactMethod: `Email: ${email} (Verify preferred method)`,
              focus: 'Requires manual research for music industry relevance',
              tip: 'Research contact before outreach - verify music industry connection',
              confidence: 'Low',
              updated: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            });
            confidence = 'Low';
          }
          
          if (claudeResp.error) errors.push(claudeResp.error);
        }
        
        return {
          ...contact,
          intelligence,
          confidence,
          lastResearched: new Date().toISOString(),
          errors: errors.length > 0 ? errors : undefined,
        };
      } catch (err: any) {
        return {
          ...contact,
          intelligence: 'Enrichment failed - manual research required.',
          confidence: 'Low',
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
    
    // Production-safe delay between batches for rate limiting
    if (i + batchSize < contacts.length) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay to avoid rate limits
    }
  }
  
  return enriched;
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  
  try {
    const body = await req.json();
    const contacts = body.contacts || [];
    
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No contacts provided' 
      }, { status: 400 });
    }
    
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Claude API not configured - add ANTHROPIC_API_KEY to environment' 
      }, { status: 500 });
    }
    
    // Conservative batch size for production stability
    const batchSize = contacts.length <= 10 ? 3 : 
                     contacts.length <= 25 ? 5 : 
                     contacts.length <= 50 ? 8 : 10; // Much smaller batches for rate limiting
    
    // Process contacts with progress tracking
    const enriched = await processContactBatch(
      contacts, 
      batchSize,
      (processed, total) => {
        console.log(`Claude enrichment progress: ${processed}/${total} (${Math.round(processed/total*100)}%)`);
      }
    );
    
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const successRate = Math.round((successfulEnrichments / Math.max(totalRequests, 1)) * 100);
    const cacheHitRate = Math.round((cacheHits / Math.max(totalRequests, 1)) * 100);
    
    // Estimate cost (Claude 3.5 Sonnet: ~$0.003 per contact)
    const estimatedCost = (contacts.length * 0.003).toFixed(3);
    
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
      estimatedCost: `$${estimatedCost}`,
      provider: 'Claude API',
      performance: {
        contactsPerSecond: Math.round(contacts.length / parseFloat(elapsed)),
        averageResponseTime: `${elapsed}s for ${contacts.length} contacts`,
        costPerContact: '$0.003'
      }
    });
    
  } catch (error: any) {
    console.error('Claude enrichment API error:', error);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Enrichment processing failed',
      elapsed 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Claude API Enrichment Endpoint',
    provider: 'Claude 3.5 Sonnet',
    costPerContact: '$0.003',
    features: ['Music industry expertise', 'High-quality intelligence', 'Cost-effective'],
    status: ANTHROPIC_API_KEY ? 'Ready' : 'Missing ANTHROPIC_API_KEY'
  });
}