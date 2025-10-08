import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const userId = (session.user as any).email || 'demo-user';

    const { data, error } = await supabaseAdmin
      .from('user_pitch_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading voice profile:', error);
      return NextResponse.json({ error: 'Failed to load voice profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data || {} });
  } catch (error: any) {
    console.error('Voice profile fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch voice profile' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const userId = (session.user as any).email || 'demo-user';
    const profile = await req.json();

    const { error } = await supabaseAdmin
      .from('user_pitch_settings')
      .upsert({
        user_id: userId,
        voice_background: profile.voice_background || '',
        voice_style: profile.voice_style || '',
        voice_achievements: profile.voice_achievements || '',
        voice_approach: profile.voice_approach || '',
        voice_differentiator: profile.voice_differentiator || '',
        voice_typical_opener: profile.voice_typical_opener || '',
        voice_context_notes: profile.voice_context_notes || '',
        voice_profile_completed: true,
      });

    if (error) {
      console.error('Error saving voice profile:', error);
      return NextResponse.json(
        { error: 'Failed to save voice profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Voice profile save error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save voice profile' },
      { status: 500 }
    );
  }
}
