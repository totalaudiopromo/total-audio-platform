import { NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const userId = user.email || user.id;

    // Check if migration is needed by attempting to query
    const { data, error } = await supabase
      .from('user_pitch_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // If UUID error, return migration instructions
    if (error?.code === '22P02') {
      return NextResponse.json({
        success: false,
        migrationRequired: true,
        instructions: {
          message: 'Database migration required for voice profile feature',
          steps: [
            '1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql',
            '2. Create a new query',
            '3. Paste: ALTER TABLE user_pitch_settings ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;',
            '4. Click RUN',
          ],
          sql: 'ALTER TABLE user_pitch_settings ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;',
        },
      });
    }

    if (error) {
      console.error('Error loading voice profile:', error);
      return NextResponse.json({ success: true, profile: {} });
    }

    return NextResponse.json({ success: true, profile: data || {} });
  } catch (error: any) {
    console.error('Voice profile fetch error:', error);
    return NextResponse.json({ success: true, profile: {} });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const userId = user.email || user.id;
    const profile = await req.json();

    console.log('Saving voice profile for user:', userId);

    // Try direct upsert
    const { error } = await supabase.from('user_pitch_settings').upsert(
      {
        user_id: userId,
        voice_background: profile.voice_background || '',
        voice_style: profile.voice_style || '',
        voice_achievements: profile.voice_achievements || '',
        voice_approach: profile.voice_approach || '',
        voice_differentiator: profile.voice_differentiator || '',
        voice_typical_opener: profile.voice_typical_opener || '',
        voice_context_notes: profile.voice_context_notes || '',
        voice_profile_completed: true,
      },
      {
        onConflict: 'user_id',
      }
    );

    if (error) {
      console.error('Error saving voice profile:', error);

      // If UUID error, return clear migration instructions
      if (error.code === '22P02') {
        return NextResponse.json(
          {
            success: false,
            migrationRequired: true,
            instructions: {
              message: 'Database migration required for voice profile feature',
              steps: [
                '1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql',
                '2. Create a new query',
                '3. Paste: ALTER TABLE user_pitch_settings ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;',
                '4. Click RUN',
                '5. Refresh this page and try saving again',
              ],
              sql: 'ALTER TABLE user_pitch_settings ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;',
            },
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Failed to save voice profile' },
        { status: 500 }
      );
    }

    console.log('Voice profile saved successfully');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Voice profile save error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save voice profile' },
      { status: 500 }
    );
  }
}
