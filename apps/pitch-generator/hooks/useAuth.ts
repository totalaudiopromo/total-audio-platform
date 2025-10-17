'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface UseSessionReturn {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

/**
 * Custom hook that mimics NextAuth's useSession() API but uses Supabase
 * This allows us to gradually migrate from NextAuth without changing all components
 */
export function useSession(): UseSessionReturn {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const supabase = createClient();

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setStatus(session ? 'authenticated' : 'unauthenticated');
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus(session ? 'authenticated' : 'unauthenticated');
    });

    return () => subscription.unsubscribe();
  }, []);

  // Convert Supabase user to NextAuth-compatible session format
  const session: Session | null = user
    ? {
        user: {
          name: user.user_metadata?.name ?? user.email?.split('@')[0] ?? null,
          email: user.email ?? null,
          image: user.user_metadata?.avatar_url ?? null,
        },
      }
    : null;

  return {
    data: session,
    status,
  };
}
