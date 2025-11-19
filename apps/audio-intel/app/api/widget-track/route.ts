import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { z } from 'zod';

// Validation schema
const WidgetTrackSchema = z.object({
  event: z.enum(['widget_load', 'enrichment', 'upgrade_click']),
  sessionId: z.string(),
  version: z.string().optional(),
  url: z.string().optional(),
  email: z.string().optional(),
  status: z.string().optional(),
  enrichmentsUsed: z.number().optional(),
});

type WidgetTrackInput = z.infer<typeof WidgetTrackSchema>;

/**
 * POST /api/widget-track
 * Track widget usage events for analytics
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = WidgetTrackSchema.parse(body);

    // Log event to console for now (could be sent to analytics service)
    console.log('[Widget Event]', {
      event: input.event,
      sessionId: input.sessionId,
      timestamp: new Date().toISOString(),
    });

    // For enrichment events, we could track additional metrics
    if (input.event === 'enrichment') {
      // Track enrichment success/failure rate
      // Could aggregate this data for analytics dashboard
    }

    return NextResponse.json({
      success: true,
      tracked: true,
    });
  } catch (error: any) {
    console.error('Widget tracking error:', error);

    // Don't fail widget operations due to tracking errors
    return NextResponse.json({
      success: true,
      tracked: false,
    });
  }
}

/**
 * GET /api/widget-track
 * Get widget analytics (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user (admin check would go here)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get widget usage statistics
    const { data: widgetData, error } = await supabase
      .from('widget_usage')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching widget analytics:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    // Calculate summary metrics
    const totalSessions = widgetData?.length || 0;
    const totalEnrichments = widgetData?.reduce((sum, w) => sum + w.enrichments_used, 0) || 0;
    const conversions = widgetData?.filter(w => w.converted_to_signup).length || 0;
    const conversionRate =
      totalSessions > 0 ? ((conversions / totalSessions) * 100).toFixed(2) : '0';

    return NextResponse.json({
      success: true,
      analytics: {
        totalSessions,
        totalEnrichments,
        conversions,
        conversionRate: parseFloat(conversionRate),
        recentSessions: widgetData || [],
      },
    });
  } catch (error: any) {
    console.error('Widget analytics GET error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
