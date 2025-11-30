import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { z } from 'zod';

// Validation schemas
const FindSimilarSchema = z.object({
  contactId: z.string().uuid(),
  limit: z.number().min(1).max(50).default(10),
  minSimilarityScore: z.number().min(0).max(100).default(50),
});

type FindSimilarInput = z.infer<typeof FindSimilarSchema>;

/**
 * POST /api/contacts/similar
 * Find similar contacts based on attributes
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const input = FindSimilarSchema.parse(body);

    // Get the source contact details
    const { data: sourceContact, error: contactError } = await supabase
      .from('intel_contacts')
      .select('*')
      .eq('id', input.contactId)
      .eq('user_id', user.id)
      .single();

    if (contactError || !sourceContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Get all other contacts for this user
    const { data: allContacts, error: allContactsError } = await supabase
      .from('intel_contacts')
      .select('*')
      .eq('user_id', user.id)
      .neq('id', input.contactId)
      .limit(500); // Reasonable limit for similarity calculation

    if (allContactsError) {
      console.error('Error fetching contacts:', allContactsError);
      return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }

    if (!allContacts || allContacts.length === 0) {
      return NextResponse.json({
        success: true,
        similar: [],
        message: 'No other contacts found for comparison',
      });
    }

    // Calculate similarity scores
    const similarityResults = allContacts.map(contact => {
      const similarity = calculateSimilarity(sourceContact, contact);
      return {
        contactId: contact.id,
        contact,
        ...similarity,
      };
    });

    // Filter by minimum score and sort by score descending
    const filteredResults = similarityResults
      .filter(r => r.similarityScore >= input.minSimilarityScore)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, input.limit);

    // Store similarity records in database for caching
    const similarityRecords = filteredResults.map(r => ({
      user_id: user.id,
      contact_id: input.contactId,
      similar_contact_id: r.contactId,
      similarity_score: r.similarityScore,
      genre_similarity: r.genreSimilarity,
      location_similarity: r.locationSimilarity,
      role_similarity: r.roleSimilarity,
      audience_size_similarity: r.audienceSizeSimilarity,
      platform_similarity: r.platformSimilarity,
      matching_attributes: r.matchingAttributes,
      recommendation_reason: r.recommendationReason,
    }));

    if (similarityRecords.length > 0) {
      // Upsert similarity records
      const { error: upsertError } = await supabase
        .from('contact_similarity')
        .upsert(similarityRecords, {
          onConflict: 'user_id,contact_id,similar_contact_id',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error('Error storing similarity records:', upsertError);
        // Non-fatal - continue with response
      }
    }

    return NextResponse.json({
      success: true,
      similar: filteredResults,
      total: filteredResults.length,
      sourceContact: {
        id: sourceContact.id,
        name: sourceContact.name,
        email: sourceContact.email,
      },
    });
  } catch (error: any) {
    console.error('Contact similarity API error:', error);

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
 * GET /api/contacts/similar?contactId=xxx
 * Get cached similar contacts
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!contactId) {
      return NextResponse.json({ error: 'contactId is required' }, { status: 400 });
    }

    // Fetch cached similarity data
    const { data, error } = await supabase
      .from('contact_similarity')
      .select('*')
      .eq('user_id', user.id)
      .eq('contact_id', contactId)
      .order('similarity_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching similar contacts:', error);
      return NextResponse.json({ error: 'Failed to fetch similar contacts' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      similar: data || [],
      total: data?.length || 0,
      cached: true,
    });
  } catch (error: any) {
    console.error('Contact similarity GET error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate similarity between two contacts
 */
function calculateSimilarity(source: any, target: any) {
  // Extract contact intelligence for comparison
  const sourceIntel = parseContactIntelligence(source.contactIntelligence || '');
  const targetIntel = parseContactIntelligence(target.contactIntelligence || '');

  // Calculate individual similarity scores
  const genreSimilarity = calculateGenreSimilarity(sourceIntel.genre, targetIntel.genre);
  const locationSimilarity = calculateLocationSimilarity(
    sourceIntel.location,
    targetIntel.location
  );
  const roleSimilarity = calculateRoleSimilarity(sourceIntel.role, targetIntel.role);
  const audienceSizeSimilarity = calculateAudienceSimilarity(
    sourceIntel.audience,
    targetIntel.audience
  );
  const platformSimilarity = calculatePlatformSimilarity(
    sourceIntel.platform,
    targetIntel.platform
  );

  // Calculate overall weighted score (using SQL function weights)
  const similarityScore = parseFloat(
    (
      genreSimilarity * 0.35 +
      roleSimilarity * 0.25 +
      platformSimilarity * 0.2 +
      locationSimilarity * 0.1 +
      audienceSizeSimilarity * 0.1
    ).toFixed(2)
  );

  // Build matching attributes object
  const matchingAttributes: any = {};
  if (genreSimilarity > 70) matchingAttributes.genre = sourceIntel.genre;
  if (locationSimilarity > 70) matchingAttributes.location = sourceIntel.location;
  if (roleSimilarity > 70) matchingAttributes.role = sourceIntel.role;
  if (platformSimilarity > 70) matchingAttributes.platform = sourceIntel.platform;

  // Generate recommendation reason
  const recommendationReason = generateRecommendationReason(
    genreSimilarity,
    locationSimilarity,
    roleSimilarity,
    platformSimilarity,
    sourceIntel,
    targetIntel
  );

  return {
    similarityScore,
    genreSimilarity,
    locationSimilarity,
    roleSimilarity,
    audienceSizeSimilarity,
    platformSimilarity,
    matchingAttributes,
    recommendationReason,
  };
}

/**
 * Parse contact intelligence text to extract key attributes
 */
function parseContactIntelligence(intelligence: string) {
  const intel = {
    genre: '',
    location: '',
    role: '',
    audience: '',
    platform: '',
  };

  // Extract genre (look for common music genres)
  const genreMatch = intelligence.match(
    /(rock|pop|indie|electronic|hip-hop|jazz|metal|folk|alternative|dance|soul|r&b|country)/i
  );
  if (genreMatch) intel.genre = genreMatch[1].toLowerCase();

  // Extract location
  const locationMatch = intelligence.match(/📍\s*([^|🎧]+)/);
  if (locationMatch) intel.location = locationMatch[1].trim();

  // Extract platform/station
  const platformMatch = intelligence.match(/🎵\s*([^|]+)/);
  if (platformMatch) intel.platform = platformMatch[1].trim();

  // Extract role (radio, playlist, press, etc.)
  if (intelligence.toLowerCase().includes('radio')) intel.role = 'radio';
  else if (intelligence.toLowerCase().includes('playlist')) intel.role = 'playlist';
  else if (intelligence.toLowerCase().includes('press')) intel.role = 'press';
  else if (intelligence.toLowerCase().includes('blog')) intel.role = 'blog';

  return intel;
}

function calculateGenreSimilarity(genre1: string, genre2: string): number {
  if (!genre1 || !genre2) return 0;
  if (genre1.toLowerCase() === genre2.toLowerCase()) return 100;
  // Could add genre similarity matrix here (e.g., rock and metal are 70% similar)
  return 0;
}

function calculateLocationSimilarity(loc1: string, loc2: string): number {
  if (!loc1 || !loc2) return 0;
  const l1 = loc1.toLowerCase();
  const l2 = loc2.toLowerCase();
  if (l1 === l2) return 100;
  // Check for same country/region
  if (l1.includes('uk') && l2.includes('uk')) return 80;
  if (l1.includes('london') && l2.includes('london')) return 100;
  if (l1.includes('us') && l2.includes('us')) return 80;
  return 30; // Different locations but both valid
}

function calculateRoleSimilarity(role1: string, role2: string): number {
  if (!role1 || !role2) return 0;
  if (role1.toLowerCase() === role2.toLowerCase()) return 100;
  // Radio and playlist are somewhat similar (both play music)
  if (
    (role1 === 'radio' && role2 === 'playlist') ||
    (role1 === 'playlist' && role2 === 'radio')
  ) {
    return 60;
  }
  return 0;
}

function calculateAudienceSimilarity(aud1: string, aud2: string): number {
  // Placeholder - would parse audience size if available
  if (!aud1 || !aud2) return 50; // Default neutral
  return 50;
}

function calculatePlatformSimilarity(plat1: string, plat2: string): number {
  if (!plat1 || !plat2) return 0;
  const p1 = plat1.toLowerCase();
  const p2 = plat2.toLowerCase();
  if (p1 === p2) return 100;
  // BBC stations are similar to each other
  if (p1.includes('bbc') && p2.includes('bbc')) return 80;
  // Spotify playlists are similar to each other
  if (p1.includes('spotify') && p2.includes('spotify')) return 80;
  return 20; // Different platforms but both valid
}

function generateRecommendationReason(
  genreSim: number,
  locSim: number,
  roleSim: number,
  platSim: number,
  sourceIntel: any,
  targetIntel: any
): string {
  const reasons: string[] = [];

  if (genreSim >= 100) reasons.push(`Same genre (${sourceIntel.genre})`);
  if (roleSim >= 100) reasons.push(`Same role (${sourceIntel.role})`);
  if (locSim >= 80) reasons.push(`Same location (${sourceIntel.location})`);
  if (platSim >= 80) reasons.push('Similar platform');

  if (reasons.length === 0) {
    return 'General similarity across multiple attributes';
  }

  return reasons.join(', ');
}
