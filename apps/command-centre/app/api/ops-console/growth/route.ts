/**
 * Phase 9D-2: Growth Metrics API
 * Revenue attribution and conversion tracking from Phase 9B conversion_events table
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = await createAdminClient(cookies());

    // Query conversion_events table with aggregation
    const { data: conversions, error } = await (supabase.rpc as any)('get_conversion_summary');

    if (error) {
      console.error('Error fetching conversion summary:', error);

      // Fallback query if RPC doesn't exist yet
      const { data: fallbackData, error: fallbackError } = await (supabase as any)
        .from('conversion_events')
        .select('id, user_id, app, event_name, revenue_impact, metadata, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (fallbackError) {
        throw fallbackError;
      }

      // Aggregate fallback data client-side
      const { conversions: aggregatedConversions, metrics } = aggregateGrowthMetrics(
        fallbackData || []
      );
      return NextResponse.json({
        success: true,
        conversions: aggregatedConversions,
        metrics,
        source: 'fallback',
      });
    }

    return NextResponse.json({
      success: true,
      conversions: conversions || [],
      metrics: {}, // RPC would need to return metrics separately
      source: 'rpc',
    });
  } catch (error: any) {
    console.error('Growth metrics API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch growth metrics',
      },
      { status: 500 }
    );
  }
}

/**
 * Aggregate growth metrics from raw conversion events
 */
function aggregateGrowthMetrics(events: any[]) {
  const grouped: Record<string, any> = {};

  events.forEach(event => {
    const key = `${event.app}-${event.event_name}`;

    if (!grouped[key]) {
      grouped[key] = {
        app: event.app,
        event_name: event.event_name,
        event_count: 0,
        total_revenue_impact: 0,
      };
    }

    grouped[key].event_count++;
    grouped[key].total_revenue_impact += event.revenue_impact || 0;
  });

  const conversions = Object.values(grouped).map(conversion => ({
    app: conversion.app,
    event_name: conversion.event_name,
    event_count: conversion.event_count,
    total_revenue_impact: conversion.total_revenue_impact,
    avg_revenue_impact: Math.round(conversion.total_revenue_impact / conversion.event_count),
  }));

  // Calculate overall metrics
  const totalRevenue = conversions.reduce((sum, c) => sum + c.total_revenue_impact, 0);
  const totalConversions = conversions.reduce((sum, c) => sum + c.event_count, 0);
  const uniqueUsers = new Set(events.map(e => e.user_id)).size;

  const metrics = {
    totalRevenue,
    revenueGrowth: 0, // Would need time-series data for real growth rate
    totalConversions,
    conversionRate: uniqueUsers > 0 ? (totalConversions / uniqueUsers) * 100 : 0,
    avgRevenuePerUser: uniqueUsers > 0 ? Math.round(totalRevenue / uniqueUsers) : 0,
  };

  return { conversions, metrics };
}
