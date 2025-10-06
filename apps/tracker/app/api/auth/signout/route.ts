import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // Redirect to home page (will show landing page since user is now signed out)
  const url = new URL('/', request.url);
  return NextResponse.redirect(url);
}
