/**
 * Claude API Enrichment Endpoint - Refactored to use IntelAgent
 * Clean, observable, testable contact enrichment
 */

import { NextRequest, NextResponse } from 'next/server';
import { Agents } from '@/agents';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
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

    // Use IntelAgent for clean, observable enrichment
    const results = [];
    let successCount = 0;
    let cacheHitCount = 0;

    for (const contact of contacts) {
      const result = await Agents.intel.execute({
        artist: contact.name || 'Unknown',
        genre: contact.genre,
        region: contact.region || 'UK',
        includeLabels: false, // Just contacts for now
      });

      if (result.success) {
        successCount++;

        // Transform IntelAgent response to match expected format
        const enrichedContact = {
          ...contact,
          intelligence: result.data.contacts[0]?.contactIntelligence || 'No intelligence found',
          confidence: result.data.validation?.score > 0.7 ? 'High' : 'Medium',
          lastResearched: new Date().toISOString(),
        };

        results.push(enrichedContact);
      } else {
        // Fallback for failed enrichment
        results.push({
          ...contact,
          intelligence: 'Enrichment failed - manual research required',
          confidence: 'Low',
          lastResearched: new Date().toISOString(),
          errors: [result.error],
        });
      }
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const successRate = Math.round((successCount / contacts.length) * 100);
    const estimatedCost = (contacts.length * 0.003).toFixed(3);

    return NextResponse.json({
      success: true,
      enriched: results,
      processed: contacts.length,
      elapsed,
      batchSize: contacts.length,
      successRate: `${successRate}%`,
      cacheHitRate: `${cacheHitCount}%`,
      estimatedCost: `$${estimatedCost}`,
      provider: 'IntelAgent (Claude API)',
      performance: {
        contactsPerSecond: Math.round(contacts.length / parseFloat(elapsed)),
        averageResponseTime: `${elapsed}s for ${contacts.length} contacts`,
        costPerContact: '$0.003',
      },
    });
  } catch (error: any) {
    console.error('Claude enrichment API error:', error);
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
    message: 'Claude API Enrichment Endpoint (IntelAgent)',
    provider: ANTHROPIC_API_KEY ? 'IntelAgent via Claude 3.5 Sonnet' : 'IntelAgent Fallback',
    costPerContact: ANTHROPIC_API_KEY ? '$0.003' : '$0.000',
    features: [
      'Clean agent-based architecture',
      'Automatic Supabase logging',
      'Built-in metrics tracking',
      'Consistent error handling',
    ],
    status: 'Ready',
    agentVersion: '1.0.0',
  });
}
