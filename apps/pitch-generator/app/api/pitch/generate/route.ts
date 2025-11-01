import { NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { generatePitch } from '@/lib/openai';
import { getSuggestedSendTime } from '@/lib/sendTimeHelper';

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient(cookies());
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

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
      return NextResponse.json(
        { error: 'Missing required fields: contactId, artistName, trackTitle, keyHook' },
        { status: 400 }
      );
    }

    // Use provided contact or fetch from database
    let contact = providedContact;
    if (!contact) {
      const { data: fetchedContact, error: contactError } = await (supabase)
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .single();

      if (contactError || !fetchedContact) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        );
      }
      contact = fetchedContact;
    }

    // Get smart send time suggestion
    const sendTimeSuggestion = getSuggestedSendTime(contact.outlet, contact.role);

    // Get user's voice profile
    const userId = user.email || user.id;

    const { data: voiceProfile } = await (supabase)
      .from('user_pitch_settings')
      .select('voice_background, voice_style, voice_achievements, voice_approach, voice_differentiator, voice_typical_opener, voice_context_notes')
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
      tone: (tone || contact.preferred_tone || 'professional') as 'casual' | 'professional' | 'enthusiastic',
      voiceProfile: voiceProfile || null,
    });

    // Save to database
    const { data: pitch, error: pitchError } = await (supabase)
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
        suggested_send_time: sendTimeSuggestion ? `${sendTimeSuggestion.time} - ${sendTimeSuggestion.reason}` : null,
        status: 'draft',
      })
      .select()
      .single();

    if (pitchError) {
      console.error('Error saving pitch:', pitchError);
      return NextResponse.json(
        { error: 'Failed to save pitch' },
        { status: 500 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error('Pitch generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate pitch' },
      { status: 500 }
    );
  }
}
