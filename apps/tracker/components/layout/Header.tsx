'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserCircleIcon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

export function Header({ userName }: { userName: string }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/total_audio_promo_logo_trans.png"
            alt="Total Audio Promo"
            width={32}
            height={32}
            className="object-contain"
          />
          <h1 className="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Tracker
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-all p-2"
          >
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">
              {userName}
            </span>
            <div className="w-9 h-9 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-white" />
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border-2 border-slate-200 py-1">
              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}











