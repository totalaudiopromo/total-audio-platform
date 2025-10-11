"use client";
import Link from 'next/link';
import { useState } from 'react';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="h-14 flex items-center justify-between px-4">
        <span className="font-semibold">Tracker</span>
        <button className="px-3 py-2 border rounded" onClick={() => setOpen(o => !o)}>{open ? 'Close' : 'Menu'}</button>
      </div>
      {open && (
        <nav className="px-2 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</Link>
          <Link href="/campaigns" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Campaigns</Link>
          <Link href="/analytics" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Analytics</Link>
        </nav>
      )}
    </div>
  );
}







