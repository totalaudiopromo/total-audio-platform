import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { status } = await req.json();
    const pitchId = params.id;

    // Validate status
    const validStatuses = ['draft', 'sent', 'replied', 'success'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const userId = (session.user as any).email || 'demo-user';

    // Prepare update data
    const updateData: any = { status };

    // Set sent_at timestamp when status changes to 'sent'
    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString();
    }

    // Update pitch status
    const { data: pitch, error: updateError } = await supabaseAdmin
      .from('pitches')
      .update(updateData)
      .eq('id', pitchId)
      .eq('user_id', userId) // Ensure user owns this pitch
      .select()
      .single();

    if (updateError) {
      console.error('Error updating pitch status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update pitch status' },
        { status: 500 }
      );
    }

    if (!pitch) {
      return NextResponse.json(
        { error: 'Pitch not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pitch: {
        id: pitch.id,
        status: pitch.status,
        sent_at: pitch.sent_at,
      },
    });
  } catch (error: any) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update status' },
      { status: 500 }
    );
  }
}
