import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient(cookies());

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { campaignIds } = await request.json();

    if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid campaign IDs' },
        { status: 400 }
      );
    }

    // Fetch campaigns (only user's own campaigns)
    const { data: campaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('*')
      .in('id', campaignIds)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Bulk export fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json(
        { error: 'No campaigns found' },
        { status: 404 }
      );
    }

    // Generate CSV
    const headers = [
      'Campaign Name',
      'Artist',
      'Platform',
      'Genre',
      'Start Date',
      'Budget (£)',
      'Target Reach',
      'Actual Reach',
      'Success Rate (%)',
      'Cost per Result (£)',
      'Status',
      'Notes',
    ];

    const rows = campaigns.map(campaign => {
      const successRate =
        campaign.target_reach > 0
          ? ((campaign.actual_reach / campaign.target_reach) * 100).toFixed(1)
          : '0';

      const costPerResult =
        campaign.actual_reach > 0
          ? (campaign.budget / campaign.actual_reach).toFixed(2)
          : '0';

      return [
        campaign.name || '',
        campaign.artist_name || '',
        campaign.platform || '',
        campaign.genre || '',
        campaign.start_date || '',
        campaign.budget || 0,
        campaign.target_reach || 0,
        campaign.actual_reach || 0,
        successRate,
        costPerResult,
        campaign.status || 'planning',
        (campaign.notes || '').replace(/"/g, '""'), // Escape quotes in notes
      ];
    });

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row
          .map(cell =>
            typeof cell === 'string' &&
            (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
              ? `"${cell}"`
              : cell
          )
          .join(',')
      ),
    ].join('\n');

    // Return CSV response
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="campaigns-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Bulk export route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
