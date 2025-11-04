// ============================================================================
// CAMPAIGN CSV IMPORT API
// Bulk import campaigns from spreadsheet data
// ============================================================================

import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface CampaignImportRow {
  name: string;
  artist_name?: string;
  platform?: string;
  genre?: string;
  start_date?: string;
  end_date?: string;
  budget?: string | number;
  target_reach?: string | number;
  actual_reach?: string | number;
  status?: string;
  notes?: string;
}

// Helper to safely parse numbers
function parseNumber(value: string | number | undefined): number {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

// Helper to validate date format
function isValidDate(dateString: string | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// ============================================================================
// POST /api/campaigns/import - Bulk import campaigns from CSV
// ============================================================================
export async function POST(request: Request) {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  const { campaigns } = body;

  if (!campaigns || !Array.isArray(campaigns)) {
    return NextResponse.json(
      { error: 'Missing or invalid campaigns array' },
      { status: 400 }
    );
  }

  const errors: string[] = [];
  let successCount = 0;
  let failedCount = 0;

  // Process each campaign
  for (let i = 0; i < campaigns.length; i++) {
    const row: CampaignImportRow = campaigns[i];
    const rowNumber = i + 1;

    // Validate required field
    if (!row.name || row.name.trim() === '') {
      errors.push(`Row ${rowNumber}: Campaign name is required`);
      failedCount++;
      continue;
    }

    // Validate status if provided
    const validStatuses = ['planning', 'active', 'completed'];
    let status = row.status?.toLowerCase() || 'planning';
    if (!validStatuses.includes(status)) {
      errors.push(
        `Row ${rowNumber}: Invalid status "${row.status}" - using "planning"`
      );
      status = 'planning';
    }

    // Parse numerical fields
    const budget = parseNumber(row.budget);
    const targetReach = parseNumber(row.target_reach);
    const actualReach = parseNumber(row.actual_reach);

    // Calculate derived metrics
    let successRate = 0;
    let costPerResult = 0;

    if (targetReach > 0 && actualReach > 0) {
      successRate = (actualReach / targetReach) * 100;
    }

    if (budget > 0 && actualReach > 0) {
      costPerResult = budget / actualReach;
    }

    // Validate dates
    let startDate = null;
    let endDate = null;

    if (row.start_date && isValidDate(row.start_date)) {
      startDate = row.start_date;
    } else if (row.start_date) {
      errors.push(
        `Row ${rowNumber}: Invalid start_date format - should be YYYY-MM-DD`
      );
    }

    if (row.end_date && isValidDate(row.end_date)) {
      endDate = row.end_date;
    } else if (row.end_date) {
      errors.push(
        `Row ${rowNumber}: Invalid end_date format - should be YYYY-MM-DD`
      );
    }

    // Insert campaign
    const { error: insertError } = await ((supabase as any)
      .from('campaigns')
      .insert([
        {
          user_id: user.id,
          name: row.name.trim(),
          artist_name: row.artist_name?.trim() || null,
          platform: row.platform?.trim() || null,
          genre: row.genre?.trim() || null,
          start_date: startDate,
          end_date: endDate,
          budget,
          target_reach: targetReach,
          actual_reach: actualReach,
          status,
          notes: row.notes?.trim() || null,
          success_rate: successRate,
          cost_per_result: costPerResult,
          performance_score: 0,
          percentile_rank: 0,
        },
      ]) as any);

    if (insertError) {
      errors.push(`Row ${rowNumber} (${row.name}): ${insertError.message}`);
      failedCount++;
    } else {
      successCount++;
    }
  }

  return NextResponse.json({
    success: successCount,
    failed: failedCount,
    errors: errors.slice(0, 20), // Limit errors to first 20
  });
}
