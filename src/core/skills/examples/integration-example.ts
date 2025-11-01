/**
 * Skills System Integration Examples
 * Total Audio Platform
 *
 * Real-world examples showing how to integrate skills into your apps.
 */

import { SkillEngine } from '../SkillEngine';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

// ============================================================================
// SETUP
// ============================================================================

/**
 * Initialize the skills engine (do this once at app startup)
 */
export async function initializeSkillsEngine() {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const skillEngine = new SkillEngine(supabase, process.env.ANTHROPIC_API_KEY);

  await skillEngine.initialize();

  console.log('[Skills] Engine initialized successfully');

  return skillEngine;
}

// ============================================================================
// PITCH GENERATOR INTEGRATION
// ============================================================================

/**
 * Example: Generate pitch drafts in Pitch Generator app
 */
export async function generatePitchWithSkills(
  skillEngine: SkillEngine,
  orgId: string,
  userId: string,
  trackData: any,
  contactData: any
) {
  console.log('[Pitch Generator] Generating pitch using skills...');

  // Step 1: Generate 3 draft variations
  const pitchResult = await skillEngine.invokeSkill({
    orgId,
    userId,
    skillKey: 'pitch_draft',
    version: 'latest',
    payload: {
      track: {
        title: trackData.title,
        artist: trackData.artist,
        genre: trackData.genre,
        key_facts: trackData.achievements,
      },
      contact: {
        name: contactData.name,
        role: contactData.role,
        outlet: contactData.outlet,
        genre_focus: contactData.genres,
        recent_activity: contactData.recent_coverage,
      },
      constraints: {
        max_length: 150,
        tone: 'professional',
      },
    },
  });

  if (!pitchResult.success) {
    console.error('[Pitch Generator] Skill failed:', pitchResult.errors);
    throw new Error('Failed to generate pitch');
  }

  // Step 2: Return drafts with confidence scores
  const drafts = pitchResult.outputs.drafts.map((draft: any) => ({
    subject: draft.subject,
    body: draft.body,
    angle: draft.angle,
    rationale: draft.rationale,
    confidence: draft.voice_compliance,
    voiceCompliant: draft.voice_compliance >= 0.8,
  }));

  console.log(`[Pitch Generator] Generated ${drafts.length} drafts`);
  console.log(
    `[Pitch Generator] Avg confidence: ${(pitchResult.metadata.confidence * 100).toFixed(0)}%`
  );

  return {
    drafts,
    executionTime: pitchResult.metadata.executionTime,
    tokensUsed: pitchResult.metadata.tokensUsed,
  };
}

// ============================================================================
// AUDIO INTEL INTEGRATION
// ============================================================================

/**
 * Example: Match contacts for a track in Audio Intel
 */
export async function matchContactsWithSkills(
  skillEngine: SkillEngine,
  orgId: string,
  userId: string,
  track: any,
  availableContacts: any[]
) {
  console.log('[Audio Intel] Matching contacts using skills...');

  const matchResult = await skillEngine.invokeSkill({
    orgId,
    userId,
    skillKey: 'contact_matcher',
    version: 'latest',
    payload: {
      track: {
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        subgenres: track.subgenres || [],
        mood: track.mood || [],
        influences: track.influences || [],
        key_facts: track.achievements || [],
      },
      contacts: availableContacts.map(c => ({
        id: c.id,
        name: c.name,
        role: c.role,
        outlet: c.outlet,
        genre_focus: c.genres,
        recent_activity: c.recent_coverage,
        submission_preferences: c.submission_notes,
      })),
      limit: 10,
      minScore: 0.6,
    },
  });

  if (!matchResult.success) {
    console.error('[Audio Intel] Matching failed:', matchResult.errors);
    throw new Error('Failed to match contacts');
  }

  const matches = matchResult.outputs.matches.map((match: any) => ({
    contactId: match.contactId,
    contactName: match.contactName,
    matchScore: match.score,
    matchReason: match.why,
    pitchAngle: match.angle,
    confidence: match.confidence,
    personalizationHooks: match.personalisation_hooks,
  }));

  console.log(`[Audio Intel] Found ${matches.length} matches`);
  console.log(`[Audio Intel] Avg score: ${matchResult.outputs.analysis.averageScore.toFixed(2)}`);
  console.log(`[Audio Intel] Top genres: ${matchResult.outputs.analysis.topGenres.join(', ')}`);

  return {
    matches,
    analysis: matchResult.outputs.analysis,
    unmatchedCount: matchResult.outputs.unmatchedCount,
  };
}

// ============================================================================
// VOICE GUARD INTEGRATION
// ============================================================================

/**
 * Example: Validate content before saving/sending
 */
export async function validateContentVoice(
  skillEngine: SkillEngine,
  orgId: string,
  content: string,
  contentType: 'email_pitch' | 'newsletter' | 'website_copy' = 'email_pitch'
) {
  console.log('[Voice Guard] Validating content...');

  const voiceResult = await skillEngine.invokeSkill({
    orgId,
    skillKey: 'brand_voice',
    version: 'latest',
    payload: {
      content,
      target_audience: 'general',
      content_type: contentType,
    },
  });

  if (!voiceResult.success) {
    console.error('[Voice Guard] Validation failed:', voiceResult.errors);
    return {
      passed: false,
      error: voiceResult.errors?.[0]?.message,
    };
  }

  const analysis = voiceResult.outputs.voice_analysis;

  return {
    passed: analysis.compliance_score >= 0.8,
    score: analysis.compliance_score,
    correctedContent: voiceResult.outputs.adjusted_content,
    issues: analysis.issues,
    suggestions: analysis.strengths,
    warnings: analysis.issues.filter(
      (i: any) => i.severity === 'critical' || i.severity === 'high'
    ),
  };
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Example: Generate pitches for multiple contacts in batch
 */
export async function batchGeneratePitches(
  skillEngine: SkillEngine,
  orgId: string,
  userId: string,
  track: any,
  contacts: any[]
) {
  console.log(`[Batch] Generating pitches for ${contacts.length} contacts...`);

  const results = await Promise.all(
    contacts.map(async contact => {
      try {
        const result = await skillEngine.invokeSkill({
          orgId,
          userId,
          skillKey: 'pitch_draft',
          payload: {
            track: {
              title: track.title,
              artist: track.artist,
              genre: track.genre,
              key_facts: track.achievements,
            },
            contact: {
              name: contact.name,
              role: contact.role,
              outlet: contact.outlet,
              genre_focus: contact.genres,
            },
          },
        });

        return {
          contactId: contact.id,
          contactName: contact.name,
          success: result.success,
          draft: result.success ? result.outputs.drafts[0] : null,
          error: result.success ? null : result.errors?.[0]?.message,
        };
      } catch (error) {
        return {
          contactId: contact.id,
          contactName: contact.name,
          success: false,
          draft: null,
          error: error.message,
        };
      }
    })
  );

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`[Batch] Complete: ${successful} successful, ${failed} failed`);

  return {
    results,
    summary: {
      total: contacts.length,
      successful,
      failed,
      successRate: (successful / contacts.length) * 100,
    },
  };
}

// ============================================================================
// SKILL CHAINING
// ============================================================================

/**
 * Example: Chain multiple skills together
 */
export async function fullPitchWorkflow(
  skillEngine: SkillEngine,
  orgId: string,
  userId: string,
  track: any,
  contacts: any[]
) {
  console.log('[Workflow] Starting full pitch workflow...');

  // Step 1: Match best contacts
  console.log('[Workflow] Step 1: Matching contacts...');
  const matchResult = await matchContactsWithSkills(skillEngine, orgId, userId, track, contacts);

  if (matchResult.matches.length === 0) {
    throw new Error('No suitable contacts found');
  }

  // Step 2: Generate pitch for top 3 matches
  console.log('[Workflow] Step 2: Generating pitches for top 3 matches...');
  const topContacts = matchResult.matches.slice(0, 3);
  const pitches = await Promise.all(
    topContacts.map(async match => {
      const contact = contacts.find(c => c.id === match.contactId);
      const pitchResult = await generatePitchWithSkills(skillEngine, orgId, userId, track, contact);

      return {
        contactId: match.contactId,
        contactName: match.contactName,
        matchScore: match.matchScore,
        pitchDrafts: pitchResult.drafts,
        personalizationHooks: match.personalizationHooks,
      };
    })
  );

  // Step 3: Validate all pitches with voice guard
  console.log('[Workflow] Step 3: Validating pitches...');
  const validatedPitches = await Promise.all(
    pitches.map(async pitch => {
      const bestDraft = pitch.pitchDrafts[0]; // Use highest confidence draft
      const validation = await validateContentVoice(
        skillEngine,
        orgId,
        `${bestDraft.subject}\n\n${bestDraft.body}`,
        'email_pitch'
      );

      return {
        ...pitch,
        voiceValidation: validation,
        readyToSend: validation.passed && bestDraft.confidence >= 0.8,
      };
    })
  );

  console.log('[Workflow] Workflow complete!');

  return {
    matchingSummary: matchResult.analysis,
    pitches: validatedPitches,
    readyToSendCount: validatedPitches.filter(p => p.readyToSend).length,
  };
}

// ============================================================================
// ERROR HANDLING EXAMPLE
// ============================================================================

/**
 * Example: Robust error handling with fallback
 */
export async function generatePitchWithFallback(
  skillEngine: SkillEngine,
  orgId: string,
  userId: string,
  track: any,
  contact: any
) {
  try {
    // Try AI-powered skill first
    const result = await generatePitchWithSkills(skillEngine, orgId, userId, track, contact);

    return {
      source: 'ai',
      drafts: result.drafts,
    };
  } catch (error) {
    console.warn('[Fallback] AI pitch generation failed, using template fallback:', error.message);

    // Fallback to template-based generation
    const templateDraft = {
      subject: `${track.title} - ${track.artist}`,
      body: `Hi ${contact.name},\n\nI wanted to share "${track.title}" by ${track.artist}.\n\n${track.genre} - ${track.achievements?.[0] || 'New release'}\n\nLet me know if you'd like to check it out.\n\nBest,`,
      angle: 'template',
      confidence: 0.5,
      voiceCompliant: false,
    };

    return {
      source: 'template',
      drafts: [templateDraft],
      warning: 'AI generation unavailable, using template',
    };
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example: Complete usage in an API route
 */
export async function exampleApiRoute(req: any, res: any) {
  // Initialize skills engine (in real app, do this once at startup)
  const skillEngine = await initializeSkillsEngine();

  try {
    const { orgId, userId, trackId, contactIds } = req.body;

    // Load track and contacts from database
    const track = await getTrackFromDatabase(trackId);
    const contacts = await getContactsFromDatabase(contactIds);

    // Run full workflow
    const result = await fullPitchWorkflow(skillEngine, orgId, userId, track, contacts);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

// ============================================================================
// HELPER FUNCTIONS (stubs for example)
// ============================================================================

async function getTrackFromDatabase(trackId: string): Promise<any> {
  // In real app, fetch from your database
  return {
    id: trackId,
    title: 'Midnight Drive',
    artist: 'sadact',
    genre: 'electronic/ambient',
    achievements: ['BBC Introducing featured', '50k Spotify streams'],
  };
}

async function getContactsFromDatabase(contactIds: string[]): Promise<any[]> {
  // In real app, fetch from your database
  return [
    {
      id: 'c1',
      name: 'Sarah Jones',
      role: 'Producer',
      outlet: 'BBC Radio 6 Music',
      genres: ['electronic', 'ambient'],
      recent_coverage: ['UK ambient showcase', 'Electronic producer spotlight'],
    },
  ];
}
