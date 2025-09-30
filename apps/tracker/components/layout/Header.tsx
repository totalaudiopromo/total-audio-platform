'use client';

import { UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';

export function Header({ userName }: { userName: string }) {
  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-end gap-4">
        <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <BellIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pro Plan</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <UserCircleIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}




