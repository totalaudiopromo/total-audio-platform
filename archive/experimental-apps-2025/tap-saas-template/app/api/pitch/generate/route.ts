import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { generatePitch } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      contactId,
      artistName,
      trackTitle,
      genre,
      spotifyUrl,
      releaseDate,
      keyHooks,
      templateId,
    } = body;

    // Validate required fields
    if (!contactId || !artistName || !trackTitle) {
      return NextResponse.json(
        { error: 'Missing required fields: contactId, artistName, trackTitle' },
        { status: 400 }
      );
    }

    // Fetch contact details
    const { data: contact, error: contactError } = await supabaseAdmin
      .from('intel_contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (contactError || !contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Fetch template if provided
    let template = null;
    if (templateId) {
      const { data: templateData } = await supabaseAdmin
        .from('pitch_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      template = templateData;
    }

    // Generate pitch using AI
    const userId = (session.user as any).id || 'demo-user';

    const pitchResponse = await generatePitch({
      contactName: contact.name,
      contactRole: contact.role || '',
      contactOutlet: contact.outlet || '',
      artistName,
      trackTitle,
      genre: genre || '',
      releaseDate: releaseDate || '',
      keyHooks: keyHooks || '',
      spotifyUrl: spotifyUrl || '',
      templateBody: template?.body || '',
    });

    // Save to database
    const { data: pitch, error: pitchError } = await supabaseAdmin
      .from('pitches')
      .insert({
        user_id: userId,
        contact_id: contactId,
        artist_name: artistName,
        track_title: trackTitle,
        subject_line: pitchResponse.subjectLine,
        body: pitchResponse.body,
        genre: genre || null,
        spotify_url: spotifyUrl || null,
        release_date: releaseDate || null,
        status: 'draft',
        template_id: templateId || null,
      })
      .select()
      .single();

    if (pitchError) {
      console.error('Error saving pitch:', pitchError);
      return NextResponse.json({ error: 'Failed to save pitch' }, { status: 500 });
    }

    return NextResponse.json({
      pitch: {
        id: pitch.id,
        subjectLine: pitch.subject_line,
        body: pitch.body,
        contactName: contact.name,
        artistName: pitch.artist_name,
        trackTitle: pitch.track_title,
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
