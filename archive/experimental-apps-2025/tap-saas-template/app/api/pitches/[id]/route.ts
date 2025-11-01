import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id || 'demo-user';

    const { data: pitch, error } = await supabaseAdmin
      .from('pitches')
      .select('*, intel_contacts(*)')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (error || !pitch) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 });
    }

    return NextResponse.json({ pitch });
  } catch (error: any) {
    console.error('Pitch fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch pitch' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id || 'demo-user';
    const body = await req.json();
    const { subject_line, body: pitchBody, status } = body;

    const updates: any = {};
    if (subject_line !== undefined) updates.subject_line = subject_line;
    if (pitchBody !== undefined) updates.body = pitchBody;
    if (status !== undefined) updates.status = status;

    const { data: pitch, error } = await supabaseAdmin
      .from('pitches')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !pitch) {
      return NextResponse.json({ error: 'Failed to update pitch' }, { status: 500 });
    }

    return NextResponse.json({ pitch });
  } catch (error: any) {
    console.error('Pitch update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update pitch' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id || 'demo-user';

    const { error } = await supabaseAdmin
      .from('pitches')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete pitch' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Pitch delete error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete pitch' }, { status: 500 });
  }
}
