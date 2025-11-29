import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { generatePitch } from '@/lib/openai';
import { getSuggestedSendTime } from '@/lib/sendTimeHelper';
import {
  getUserFromRequest,
  getCorsHeaders,
  corsOptionsResponse,
  successResponse,
  unauthorized,
  validationError,
  notFound,
  internalError,
} from '@total-audio/core-db';

// Handle OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return corsOptionsResponse(req.headers.get('origin'));
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));

  try {
    // Use unified auth (supports API keys and sessions)
    const auth = await getUserFromRequest(req);
    if (!auth.success) {
      return unauthorized(auth.error.message, corsHeaders);
    }

    // Create Supabase client for database operations
    const supabase = await createServerClient(cookies());

    const body = await req.json();
    const {
      contactId,
      contact: providedContact,
      artistName,
      trackTitle,
      genre,
      trackLink,
      releaseDate,
      keyHook,
      tone,
    } = body;

    // Validate required fields
    if (!contactId || !artistName || !trackTitle || !keyHook) {
      return validationError(
        'Missing required fields: contactId, artistName, trackTitle, keyHook',
        undefined,
        corsHeaders
      );
    }

    // Use provided contact or fetch from database
    let contact = providedContact;
    if (!contact) {
      const { data: fetchedContact, error: contactError } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .single();

      if (contactError || !fetchedContact) {
        return notFound('Contact', corsHeaders);
      }
      contact = fetchedContact;
    }

    // Get smart send time suggestion
    const sendTimeSuggestion = getSuggestedSendTime(contact.outlet, contact.role);

    // Get user's voice profile using auth context
    const userId = auth.context.userId;

    const { data: voiceProfile } = await supabase
      .from('user_pitch_settings')
      .select(
        'voice_background, voice_style, voice_achievements, voice_approach, voice_differentiator, voice_typical_opener, voice_context_notes'
      )
      .eq('user_id', userId)
      .single();

    // Generate pitch using AI
    const pitchResponse = await generatePitch({
      contactName: contact.name,
      contactRole: contact.role || '',
      contactOutlet: contact.outlet || '',
      contactGenreTags: contact.genre_tags || [],
      lastContact: contact.last_contact || undefined,
      contactNotes: contact.notes || undefined,
      preferredTone: contact.preferred_tone || undefined,
      artistName,
      trackTitle,
      genre: genre || '',
      releaseDate: releaseDate || '',
      keyHook: keyHook || '',
      trackLink: trackLink || '',
      tone: (tone || contact.preferred_tone || 'professional') as
        | 'casual'
        | 'professional'
        | 'enthusiastic',
      voiceProfile: voiceProfile || null,
    });

    // Save to database
    const { data: pitch, error: pitchError } = await supabase
      .from('pitches')
      .insert({
        user_id: userId,
        contact_id: contactId,
        contact_name: contact.name,
        contact_outlet: contact.outlet || null,
        artist_name: artistName,
        track_title: trackTitle,
        genre: genre || null,
        release_date: releaseDate || null,
        key_hook: keyHook,
        track_link: trackLink || null,
        tone: tone || 'professional',
        pitch_body: pitchResponse.pitchBody,
        subject_line: pitchResponse.subjectLines?.option1 || 'New Track',
        subject_line_options: pitchResponse.subjectLines || null,
        suggested_send_time: sendTimeSuggestion
          ? `${sendTimeSuggestion.time} - ${sendTimeSuggestion.reason}`
          : null,
        status: 'draft',
      })
      .select()
      .single();

    if (pitchError) {
      console.error('Error saving pitch:', pitchError);
      return internalError('Failed to save pitch', corsHeaders);
    }

    return successResponse(
      {
        pitchId: pitch.id,
        pitch: {
          id: pitch.id,
          subject_line: pitch.subject_line,
          pitch_body: pitch.pitch_body,
          suggested_send_time: pitch.suggested_send_time,
          contact_name: contact.name,
          artist_name: pitch.artist_name,
          track_title: pitch.track_title,
        },
      },
      undefined,
      200,
      corsHeaders
    );
  } catch (error: unknown) {
    console.error('Pitch generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate pitch';
    return internalError(message, corsHeaders);
  }
}
