import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { generatePitch } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      contactId,
      contact,
      artistName,
      trackTitle,
      genre,
      releaseDate,
      keyHook,
      trackLink,
      tone,
    } = body;

    // Validate required fields
    if (!contactId || !artistName || !trackTitle || !genre || !keyHook) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get template for genre if exists
    const { data: templates } = await supabaseAdmin
      .from('pitch_templates')
      .select('*')
      .eq('genre', genre)
      .eq('is_system', true)
      .limit(1);

    const template = templates?.[0];

    // Generate pitch using OpenAI
    const result = await generatePitch({
      contactName: contact.name,
      contactOutlet: contact.outlet,
      contactRole: contact.role,
      contactGenreTags: contact.genre_tags,
      lastContact: contact.last_contact,
      contactNotes: contact.notes,
      preferredTone: contact.preferred_tone,
      artistName,
      trackTitle,
      genre,
      releaseDate,
      keyHook,
      trackLink,
      tone,
      template: template?.template_body,
    });

    // Save pitch to database
    const userId = session.user.email;
    const { data: pitch, error } = await supabaseAdmin
      .from('pitches')
      .insert({
        user_id: userId,
        contact_id: contactId,
        contact_name: contact.name,
        contact_outlet: contact.outlet,
        artist_name: artistName,
        track_title: trackTitle,
        genre,
        release_date: releaseDate || null,
        key_hook: keyHook,
        track_link: trackLink || null,
        tone,
        pitch_body: result.pitchBody,
        subject_line: result.subjectLines.option2, // Use middle option as default
        subject_line_options: result.subjectLines,
        suggested_send_time: result.suggestedSendTime,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving pitch:', error);
      throw error;
    }

    // Update template usage count if template was used
    if (template) {
      await supabaseAdmin
        .from('pitch_templates')
        .update({ times_used: (template.times_used || 0) + 1 })
        .eq('id', template.id);
    }

    return NextResponse.json({
      success: true,
      pitchId: pitch.id,
      pitch,
    });
  } catch (error) {
    console.error('Error in generate pitch API:', error);
    return NextResponse.json(
      { error: 'Failed to generate pitch' },
      { status: 500 }
    );
  }
}

