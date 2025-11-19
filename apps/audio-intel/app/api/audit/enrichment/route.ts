import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@total-audio/core-db/server';
import { z } from 'zod';

// Validation schemas
const CreateAuditLogSchema = z.object({
  contactEmail: z.string().email(),
  contactName: z.string().optional(),
  contactId: z.string().uuid().optional(),
  enrichmentSource: z.enum(['perplexity', 'claude', 'manual', 'cache']),
  enrichmentMethod: z.enum(['api', 'scrape', 'database']).optional(),
  apiRequestId: z.string().optional(),
  requestPayload: z.record(z.any()).optional(),
  responsePayload: z.record(z.any()).optional(),
  responseTimeMs: z.number().optional(),
  apiTokensUsed: z.number().optional(),
  apiCostCents: z.number().optional(),
  confidenceScore: z.number().min(0).max(100).optional(),
  dataQualityScore: z.number().min(0).max(100).optional(),
  fieldsEnriched: z.array(z.string()).optional(),
  status: z.enum(['success', 'partial', 'failed', 'cached', 'rate-limited']),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  retryCount: z.number().default(0),
  fieldsBefore: z.record(z.any()).optional(),
  fieldsAfter: z.record(z.any()).optional(),
  changesDetected: z.array(z.string()).optional(),
  verificationMethod: z.string().optional(),
  verificationScore: z.number().min(0).max(100).optional(),
  sourcesUsed: z.array(z.string()).optional(),
});

const GetAuditLogsSchema = z.object({
  contactEmail: z.string().email().optional(),
  contactId: z.string().uuid().optional(),
  status: z.enum(['success', 'partial', 'failed', 'cached', 'rate-limited']).optional(),
  enrichmentSource: z.enum(['perplexity', 'claude', 'manual', 'cache']).optional(),
  limit: z.number().min(1).max(500).default(50),
  offset: z.number().min(0).default(0),
});

type CreateAuditLogInput = z.infer<typeof CreateAuditLogSchema>;
type GetAuditLogsInput = z.infer<typeof GetAuditLogsSchema>;

/**
 * POST /api/audit/enrichment
 * Create enrichment audit log entry
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient(cookies());

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const input = CreateAuditLogSchema.parse(body);

    // Get IP and user agent from request
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const userAgent = req.headers.get('user-agent') || null;

    // Create audit log entry
    const { data: auditLog, error: insertError } = await supabase
      .from('enrichment_audit')
      .insert({
        user_id: user.id,
        contact_email: input.contactEmail,
        contact_name: input.contactName || null,
        contact_id: input.contactId || null,
        enrichment_source: input.enrichmentSource,
        enrichment_method: input.enrichmentMethod || null,
        api_request_id: input.apiRequestId || null,
        request_payload: input.requestPayload || null,
        response_payload: input.responsePayload || null,
        response_time_ms: input.responseTimeMs || null,
        api_tokens_used: input.apiTokensUsed || null,
        api_cost_cents: input.apiCostCents || null,
        confidence_score: input.confidenceScore || null,
        data_quality_score: input.dataQualityScore || null,
        fields_enriched: input.fieldsEnriched || null,
        status: input.status,
        error_code: input.errorCode || null,
        error_message: input.errorMessage || null,
        retry_count: input.retryCount,
        fields_before: input.fieldsBefore || null,
        fields_after: input.fieldsAfter || null,
        changes_detected: input.changesDetected || null,
        verification_method: input.verificationMethod || null,
        verification_score: input.verificationScore || null,
        sources_used: input.sourcesUsed || null,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating enrichment audit log:', insertError);
      return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      auditLog,
    });
  } catch (error: any) {
    console.error('Enrichment audit API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/audit/enrichment
 * Retrieve enrichment audit logs with filtering
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient(cookies());

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const input = GetAuditLogsSchema.parse({
      contactEmail: searchParams.get('contactEmail') || undefined,
      contactId: searchParams.get('contactId') || undefined,
      status: searchParams.get('status') || undefined,
      enrichmentSource: searchParams.get('enrichmentSource') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    });

    // Build query
    let query = supabase
      .from('enrichment_audit')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (input.contactEmail) {
      query = query.eq('contact_email', input.contactEmail);
    }

    if (input.contactId) {
      query = query.eq('contact_id', input.contactId);
    }

    if (input.status) {
      query = query.eq('status', input.status);
    }

    if (input.enrichmentSource) {
      query = query.eq('enrichment_source', input.enrichmentSource);
    }

    query = query.range(input.offset, input.offset + input.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching enrichment audit logs:', error);
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    // Calculate summary statistics
    const { data: summaryData } = await supabase
      .from('enrichment_audit')
      .select('status, enrichment_source, api_tokens_used, api_cost_cents, response_time_ms')
      .eq('user_id', user.id);

    const summary = calculateAuditSummary(summaryData || []);

    return NextResponse.json({
      success: true,
      auditLogs: data || [],
      total: count || 0,
      limit: input.limit,
      offset: input.offset,
      summary,
    });
  } catch (error: any) {
    console.error('Enrichment audit GET error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate summary statistics from audit logs
 */
function calculateAuditSummary(logs: any[]) {
  if (logs.length === 0) {
    return {
      totalEnrichments: 0,
      successRate: 0,
      avgResponseTimeMs: 0,
      totalTokensUsed: 0,
      totalCostCents: 0,
      bySource: {},
      byStatus: {},
    };
  }

  const totalEnrichments = logs.length;

  // Count by status
  const byStatus = logs.reduce((acc: any, log: any) => {
    acc[log.status] = (acc[log.status] || 0) + 1;
    return acc;
  }, {});

  // Count by source
  const bySource = logs.reduce((acc: any, log: any) => {
    acc[log.enrichment_source] = (acc[log.enrichment_source] || 0) + 1;
    return acc;
  }, {});

  // Calculate success rate
  const successCount = byStatus.success || 0;
  const successRate = ((successCount / totalEnrichments) * 100).toFixed(2);

  // Calculate averages
  const totalResponseTime = logs.reduce(
    (sum: number, log: any) => sum + (log.response_time_ms || 0),
    0
  );
  const avgResponseTimeMs = Math.round(totalResponseTime / totalEnrichments);

  const totalTokensUsed = logs.reduce(
    (sum: number, log: any) => sum + (log.api_tokens_used || 0),
    0
  );

  const totalCostCents = logs.reduce((sum: number, log: any) => sum + (log.api_cost_cents || 0), 0);

  return {
    totalEnrichments,
    successRate: parseFloat(successRate),
    avgResponseTimeMs,
    totalTokensUsed,
    totalCostCents,
    totalCostPounds: (totalCostCents / 100).toFixed(2),
    bySource,
    byStatus,
  };
}
