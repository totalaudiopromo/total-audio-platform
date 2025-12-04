'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@total-audio/core-db/client';
import type { User } from '@supabase/supabase-js';

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div
        className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
        role="status"
        aria-label="Loading user menu"
      />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/signin"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign In
        </a>
        <a
          href="/signup"
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sign Up
        </a>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Open user menu"
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-gray-500">Free Plan</p>
        </div>
      </button>

      {menuOpen && (
        <>
          <div
            role="button"
            tabIndex={0}
            aria-label="Close user menu"
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMenuOpen(false);
              }
            }}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <div className="py-1">
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </a>
              <a href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Help Centre
              </a>
            </div>

            <div className="border-t border-gray-200 py-1">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
