import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Coveragebook-Compatible CSV Export
 *
 * Generates CSV in Coveragebook's expected format for easy manual import.
 * Note: Coveragebook does NOT have an API - this CSV is for manual import workflow.
 *
 * Format matches Coveragebook CSV structure:
 * Campaign, Article Title, Article URL, Media Outlet, Publication Date,
 * Estimated Reach, Impressions, Media Type, Sentiment, Author, Category, Tags
 */

interface CoverageItem {
  title: string;
  url: string;
  outlet: string;
  date: string;
  reach?: number;
  impressions?: number;
  type?: string;
  sentiment?: string;
  author?: string;
  category?: string;
  tags?: string;
}

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
        { error: 'No campaign IDs provided' },
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
      console.error('Coveragebook export fetch error:', fetchError);
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

    // Coveragebook CSV headers (exact format for manual import)
    const headers = [
      'Campaign',
      'Article Title',
      'Article URL',
      'Media Outlet',
      'Publication Date',
      'Estimated Reach',
      'Impressions',
      'Media Type',
      'Sentiment',
      'Author',
      'Category',
      'Tags',
    ];

    // Transform campaign data to coverage rows
    const rows: string[][] = [];
    let totalCoverageItems = 0;

    campaigns.forEach((campaign: any) => {
      const coverageItems: CoverageItem[] = campaign.coverage_items || [];

      if (coverageItems.length === 0) {
        // If no coverage items, export campaign-level placeholder
        rows.push([
          campaign.name || 'Untitled Campaign',
          `${campaign.name || 'Campaign'} - In Progress`,
          '',
          campaign.platform || 'Various',
          campaign.start_date || new Date().toISOString().split('T')[0],
          (campaign.actual_reach || 0).toString(),
          '0',
          'Radio',
          'positive',
          '',
          'Music',
          campaign.genre || '',
        ]);
      } else {
        // Export each coverage item
        coverageItems.forEach((item: CoverageItem) => {
          rows.push([
            campaign.name || 'Untitled Campaign',
            item.title || '',
            item.url || '',
            item.outlet || '',
            item.date || '',
            (item.reach || 0).toString(),
            (item.impressions || 0).toString(),
            item.type || 'Radio',
            item.sentiment || 'positive',
            item.author || '',
            item.category || 'Music',
            item.tags || campaign.genre || '',
          ]);
          totalCoverageItems++;
        });
      }
    });

    // Generate CSV content with proper escaping
    const escapeCsvCell = (cell: string): string => {
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    };

    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map(row => row.map(escapeCsvCell).join(',')),
    ].join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `coveragebook-export-${timestamp}.csv`;

    // Return CSV response
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Coverage-Items-Count': totalCoverageItems.toString(),
        'X-Campaigns-Count': campaigns.length.toString(),
      },
    });
  } catch (error) {
    console.error('Coveragebook export error:', error);
    return NextResponse.json(
      { error: 'Export failed. Please try again.' },
      { status: 500 }
    );
  }
}
