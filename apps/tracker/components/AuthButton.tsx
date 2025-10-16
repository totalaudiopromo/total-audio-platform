'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthButton({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return null; // Or a loading skeleton
  }

  if (user) {
    // User is signed in
    const userEmail = user.email || 'User';
    const displayName = userEmail.split('@')[0];

    if (variant === 'mobile') {
      return (
        <div className="px-4 pt-4 border-t border-gray-200">
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-gray-500">Signed in as</p>
            <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="block w-full text-center rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-700 hidden lg:inline">
          {displayName}
        </span>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center justify-center rounded-lg border-2 border-black bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // User is not signed in
  if (variant === 'mobile') {
    return (
      <div className="px-4 pt-4 border-t border-gray-200">
        <Link
          href="/login"
          className="block text-center rounded-lg border-2 border-black bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center justify-center rounded-lg border-2 border-black bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all active:scale-95"
    >
      Sign In
    </Link>
  );
}
