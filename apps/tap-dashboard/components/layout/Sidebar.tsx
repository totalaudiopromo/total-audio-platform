'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  HomeIcon,
  LightBulbIcon,
  UserCircleIcon,
  MapIcon,
  ClockIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Insights', href: '/insights', icon: LightBulbIcon },
  { name: 'Identity', href: '/identity', icon: UserCircleIcon },
  { name: 'Coverage', href: '/campaign-coverage', icon: MapIcon },
  { name: 'Threads', href: '/threads', icon: ClockIcon },
  { name: 'Automations', href: '/automations', icon: BoltIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Dog speaker logo with neobrutalist style */}
          <div className="w-12 h-12 rounded-xl border-2 border-black shadow-brutal-sm overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/logo_dog.png"
              alt="Total Audio Promo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Total Audio</h1>
            <p className="text-xs text-muted-foreground">Pro Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx('nav-item', {
                'nav-item-active': isActive,
                'nav-item-inactive': !isActive,
              })}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* App Indicators */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Connected Apps</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="app-pill-intel">Intel</span>
          <span className="app-pill-pitch">Pitch</span>
          <span className="app-pill-tracker">Tracker</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">2025 Total Audio Promo</p>
      </div>
    </aside>
  );
}
