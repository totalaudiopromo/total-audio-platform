import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Get the current user session from Supabase in API routes
 * This replaces NextAuth's getServerSession()
 */
export async function getSupabaseSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Return in NextAuth-compatible format
  if (!session) {
    return null;
  }

  return {
    user: {
      email: session.user.email,
      name: session.user.user_metadata?.name ?? session.user.email?.split('@')[0],
      id: session.user.id,
    },
  };
}
