import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if email is already verified
  if (user.email_confirmed_at) {
    return NextResponse.json({ message: 'Email already verified' }, { status: 200 });
  }

  // Resend verification email
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email!,
  });

  if (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: 'Verification email sent successfully',
  });
}
