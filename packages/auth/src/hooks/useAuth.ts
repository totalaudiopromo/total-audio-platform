/**
 * React hook for authentication state
 * Provides current user, loading state, and auth methods
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../client';
import type { TotalAudioUser, AuthState } from '../types';
import type { User } from '@supabase/supabase-js';

export function useAuth(): AuthState & {
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [user, setUser] = useState<TotalAudioUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchUserWithProfile = async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setUser(authUser as TotalAudioUser);
        return;
      }

      // Fetch app permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('app_permissions')
        .select('*')
        .eq('user_id', authUser.id);

      if (permissionsError) {
        console.error('Error fetching app permissions:', permissionsError);
      }

      // Fetch active subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subscriptionError);
      }

      setUser({
        ...authUser,
        profile: profile || undefined,
        permissions: permissions || undefined,
        subscription: subscription || undefined,
      } as TotalAudioUser);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setUser(authUser as TotalAudioUser);
    }
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      await fetchUserWithProfile(authUser);
    } catch (err) {
      console.error('Error refreshing auth:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  useEffect(() => {
    // Get initial session
    refresh();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await fetchUserWithProfile(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile: user?.profile || null,
    loading,
    error,
    signOut,
    refresh,
  };
}
