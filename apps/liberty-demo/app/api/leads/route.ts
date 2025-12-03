import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LEADS } from '@/lib/leads/mock-data';
import type { Lead, LeadStatus, LeadSourceType, PaginatedLeadsResponse } from '@/lib/leads/types';

// In-memory store for lead updates (in production, this would be Supabase)
let leadsStore = [...MOCK_LEADS];

/**
 * GET /api/leads
 * Fetch paginated leads with optional filters
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const status = searchParams.get('status') as LeadStatus | null;
  const sourceType = searchParams.get('sourceType') as LeadSourceType | null;
  const minScore = parseInt(searchParams.get('minScore') || '0', 10);
  const sortBy = searchParams.get('sortBy') || 'score';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  try {
    // Apply filters
    let filteredLeads = [...leadsStore];

    if (status) {
      filteredLeads = filteredLeads.filter(l => l.status === status);
    }

    if (sourceType) {
      filteredLeads = filteredLeads.filter(l => l.sourceType === sourceType);
    }

    if (minScore > 0) {
      filteredLeads = filteredLeads.filter(l => l.score >= minScore);
    }

    // Apply sorting
    filteredLeads.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'score':
          comparison = (b.score ?? 0) - (a.score ?? 0);
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'upcomingReleaseDate':
          const dateA = a.upcomingReleaseDate
            ? new Date(a.upcomingReleaseDate).getTime()
            : Infinity;
          const dateB = b.upcomingReleaseDate
            ? new Date(b.upcomingReleaseDate).getTime()
            : Infinity;
          comparison = dateA - dateB;
          break;
        case 'spotifyMonthlyListeners':
          comparison = (b.spotifyMonthlyListeners ?? 0) - (a.spotifyMonthlyListeners ?? 0);
          break;
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

    // Apply pagination
    const total = filteredLeads.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

    const response: PaginatedLeadsResponse = {
      leads: paginatedLeads,
      total,
      page,
      pageSize,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Leads API] Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

/**
 * POST /api/leads
 * Create a new lead (for manual entry or enrichment results)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      artistId: null,
      artistName: body.artistName,
      genre: body.genre || null,
      location: body.location || null,
      bio: body.bio || null,
      imageUrl: body.imageUrl || null,
      spotifyUrl: body.spotifyUrl || null,
      instagramUrl: body.instagramUrl || null,
      twitterUrl: body.twitterUrl || null,
      websiteUrl: body.websiteUrl || null,
      bandcampUrl: body.bandcampUrl || null,
      youtubeUrl: body.youtubeUrl || null,
      spotifyMonthlyListeners: body.spotifyMonthlyListeners || null,
      spotifyFollowers: body.spotifyFollowers || null,
      instagramFollowers: body.instagramFollowers || null,
      twitterFollowers: body.twitterFollowers || null,
      upcomingReleaseDate: body.upcomingReleaseDate || null,
      upcomingReleaseTitle: body.upcomingReleaseTitle || null,
      latestReleaseDate: body.latestReleaseDate || null,
      latestReleaseTitle: body.latestReleaseTitle || null,
      hasPrAgency: body.hasPrAgency || false,
      prAgencyName: body.prAgencyName || null,
      prConfidence: body.prConfidence || 'unknown',
      signals: body.signals || [],
      aiInsight: body.aiInsight || null,
      aiGeneratedAt: body.aiInsight ? new Date().toISOString() : null,
      score: body.score || 50,
      scoreBreakdown: body.scoreBreakdown || {
        timing: 10,
        momentum: 15,
        fit: 15,
        availability: 10,
      },
      sourceName: body.sourceName || 'Manual Entry',
      sourceType: body.sourceType || 'manual',
      sourceRank: body.sourceRank || null,
      status: 'new',
      statusUpdatedAt: null,
      statusUpdatedBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    leadsStore.push(newLead);

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('[Leads API] Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
