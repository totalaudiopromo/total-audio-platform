import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { z } from 'zod';

// Validation schemas
const CalculateConfidenceSchema = z.object({
  contactId: z.string().uuid(),
  contactEmail: z.string().email(),
  enrichmentData: z.object({
    emailValid: z.boolean().optional(),
    dataAge: z.number().optional(), // days since last update
    sourceQuality: z.enum(['high', 'medium', 'low']).optional(),
    fieldsEnriched: z.array(z.string()).optional(),
    verificationStatus: z.enum(['verified', 'unverified', 'bounced']).optional(),
  }).optional(),
});

const GetConfidenceSchema = z.object({
  contactId: z.string().uuid(),
});

type CalculateConfidenceInput = z.infer<typeof CalculateConfidenceSchema>;

/**
 * POST /api/contacts/confidence
 * Calculate and store confidence score for a contact
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
    const input = CalculateConfidenceSchema.parse(body);

    // Calculate individual confidence scores
    const scores = calculateConfidenceScores(input.enrichmentData || {});

    // Calculate overall score using helper function
    const { data: overallScoreData, error: scoreError } = await supabase.rpc(
      'calculate_contact_confidence_score',
      {
        p_email_validity: scores.emailValidityScore,
        p_data_freshness: scores.dataFreshnessScore,
        p_source_quality: scores.sourceQualityScore,
        p_enrichment_depth: scores.enrichmentDepthScore,
        p_verification_status: scores.verificationStatusScore,
      }
    );

    if (scoreError) {
      console.error('Error calculating overall score:', scoreError);
      return NextResponse.json({ error: 'Failed to calculate score' }, { status: 500 });
    }

    const overallScore = overallScoreData as number;

    // Get confidence level
    const { data: confidenceLevelData, error: levelError } = await supabase.rpc(
      'get_confidence_level',
      {
        p_score: overallScore,
      }
    );

    if (levelError) {
      console.error('Error getting confidence level:', levelError);
      return NextResponse.json({ error: 'Failed to determine confidence level' }, { status: 500 });
    }

    const confidenceLevel = confidenceLevelData as 'high' | 'medium' | 'low';

    // Upsert confidence record
    const { data: confidenceData, error: upsertError } = await supabase
      .from('contact_confidence')
      .upsert(
        {
          user_id: user.id,
          contact_id: input.contactId,
          overall_score: overallScore,
          confidence_level: confidenceLevel,
          email_validity_score: scores.emailValidityScore,
          data_freshness_score: scores.dataFreshnessScore,
          source_quality_score: scores.sourceQualityScore,
          enrichment_depth_score: scores.enrichmentDepthScore,
          verification_status_score: scores.verificationStatusScore,
          last_verified_at: new Date().toISOString(),
          verification_method: 'automated',
        },
        {
          onConflict: 'user_id,contact_id',
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting confidence:', upsertError);
      return NextResponse.json({ error: 'Failed to save confidence data' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      confidence: confidenceData,
    });
  } catch (error: any) {
    console.error('Contact confidence API error:', error);

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
 * GET /api/contacts/confidence?contactId=xxx
 * Retrieve confidence score for a contact
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

    if (!contactId) {
      return NextResponse.json({ error: 'contactId is required' }, { status: 400 });
    }

    const input = GetConfidenceSchema.parse({ contactId });

    // Fetch confidence data
    const { data, error } = await supabase
      .from('contact_confidence')
      .select('*')
      .eq('user_id', user.id)
      .eq('contact_id', input.contactId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No confidence data found
        return NextResponse.json({
          success: true,
          confidence: null,
        });
      }

      console.error('Error fetching confidence:', error);
      return NextResponse.json({ error: 'Failed to fetch confidence data' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      confidence: data,
    });
  } catch (error: any) {
    console.error('Contact confidence GET error:', error);

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
 * Calculate individual confidence scores from enrichment data
 */
function calculateConfidenceScores(enrichmentData: any): {
  emailValidityScore: number;
  dataFreshnessScore: number;
  sourceQualityScore: number;
  enrichmentDepthScore: number;
  verificationStatusScore: number;
} {
  // Email validity score (0-100)
  let emailValidityScore = 50; // Default neutral
  if (enrichmentData.emailValid === true) {
    emailValidityScore = 90;
  } else if (enrichmentData.emailValid === false) {
    emailValidityScore = 10;
  }

  // Data freshness score (0-100) - fresher data scores higher
  let dataFreshnessScore = 50;
  if (enrichmentData.dataAge !== undefined) {
    const daysOld = enrichmentData.dataAge;
    if (daysOld <= 7) dataFreshnessScore = 100;
    else if (daysOld <= 30) dataFreshnessScore = 85;
    else if (daysOld <= 90) dataFreshnessScore = 70;
    else if (daysOld <= 180) dataFreshnessScore = 50;
    else dataFreshnessScore = 30;
  }

  // Source quality score (0-100)
  let sourceQualityScore = 50;
  if (enrichmentData.sourceQuality === 'high') sourceQualityScore = 90;
  else if (enrichmentData.sourceQuality === 'medium') sourceQualityScore = 60;
  else if (enrichmentData.sourceQuality === 'low') sourceQualityScore = 30;

  // Enrichment depth score (0-100) - more fields enriched = higher score
  let enrichmentDepthScore = 50;
  if (enrichmentData.fieldsEnriched && Array.isArray(enrichmentData.fieldsEnriched)) {
    const fieldCount = enrichmentData.fieldsEnriched.length;
    if (fieldCount >= 8) enrichmentDepthScore = 100;
    else if (fieldCount >= 6) enrichmentDepthScore = 85;
    else if (fieldCount >= 4) enrichmentDepthScore = 70;
    else if (fieldCount >= 2) enrichmentDepthScore = 50;
    else enrichmentDepthScore = 30;
  }

  // Verification status score (0-100)
  let verificationStatusScore = 50;
  if (enrichmentData.verificationStatus === 'verified') verificationStatusScore = 100;
  else if (enrichmentData.verificationStatus === 'unverified') verificationStatusScore = 50;
  else if (enrichmentData.verificationStatus === 'bounced') verificationStatusScore = 0;

  return {
    emailValidityScore,
    dataFreshnessScore,
    sourceQualityScore,
    enrichmentDepthScore,
    verificationStatusScore,
  };
}
