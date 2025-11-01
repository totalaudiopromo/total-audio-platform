import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createClient } from '@total-audio/core-db/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();

    // Check if user has contacts
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('id')
      .eq('user_id', token.sub)
      .limit(1);

    if (contactsError) {
      console.error('Error checking contacts:', contactsError);
    }

    // Check if user has generated pitches
    const { data: pitches, error: pitchesError } = await supabase
      .from('pitches')
      .select('id')
      .eq('user_id', token.sub)
      .limit(1);

    if (pitchesError) {
      console.error('Error checking pitches:', pitchesError);
    }

    // Check if user has customized voice profile
    const { data: profile, error: profileError } = await supabase
      .from('voice_profiles')
      .select('id, tone, writing_style')
      .eq('user_id', token.sub)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine for new users
      console.error('Error checking voice profile:', profileError);
    }

    // Determine completion status for each step
    const onboardingStatus = {
      add_contact: (contacts && contacts.length > 0) || false,
      generate_pitch: (pitches && pitches.length > 0) || false,
      customize_voice: !!(profile && (profile.tone || profile.writing_style)),
    };

    return NextResponse.json(onboardingStatus);
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
