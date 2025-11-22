import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Check password against environment variable
    const correctPassword = process.env.COMMAND_CENTRE_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ error: 'Authentication not configured' }, { status: 500 });
    }

    if (password === correctPassword) {
      // Generate a secure token
      const token =
        process.env.COMMAND_CENTRE_AUTH_TOKEN ||
        Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');

      // Set authentication cookie
      const cookieStore = await cookies();
      cookieStore.set('command-centre-auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
