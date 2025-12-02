'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SearchInput } from '../ui/SearchInput';
import {
  UserCircleIcon,
  ChevronDownIcon,
  BellIcon,
  PlusIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import type { User } from '@supabase/supabase-js';

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowUserMenu(false);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Your Artist';

  return (
    <header className="topbar">
      {/* Artist/Workspace Selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-sm font-medium text-foreground hover:bg-muted/80 transition-all duration-180 min-h-[44px] border border-border">
            <UserCircleIcon className="w-5 h-5 text-brand-slate" />
            <span>{displayName}</span>
            <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search dashboard..."
        />
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        {/* New Action Button */}
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">New Action</span>
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-all duration-180 border border-border relative">
          <BellIcon className="w-5 h-5 text-foreground" />
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-amber rounded-full text-[10px] font-bold text-white flex items-center justify-center border border-black">
            3
          </span>
        </button>

        {/* Auth Button */}
        {isLoading ? (
          <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
        ) : user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-xl bg-brand-slate flex items-center justify-center hover:bg-brand-slate-dark transition-all duration-180 border-2 border-black shadow-brutal-sm overflow-hidden"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl border-2 border-black shadow-brutal z-50">
                <div className="p-3 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-brand-slate text-white rounded-xl text-sm font-medium hover:bg-brand-slate-dark transition-all duration-180 border-2 border-black shadow-brutal-sm min-h-[44px]"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
