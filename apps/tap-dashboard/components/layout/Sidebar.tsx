'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  HomeIcon,
  LightBulbIcon,
  UserCircleIcon,
  MapIcon,
  ClockIcon,
  BoltIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Insights', href: '/insights', icon: LightBulbIcon },
  { name: 'Identity', href: '/identity', icon: UserCircleIcon },
  { name: 'Coverage', href: '/coverage', icon: MapIcon },
  { name: 'Threads', href: '/threads', icon: ClockIcon },
  { name: 'Automations', href: '/automations', icon: BoltIcon },
  { name: 'Modes', href: '/modes', icon: Squares2X2Icon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-postcraft-white border-r-3 border-postcraft-black flex flex-col shadow-brutal">
      {/* Logo */}
      <div className="p-6 border-b-3 border-postcraft-black">
        <h1 className="text-2xl font-black text-postcraft-black tracking-tight">
          TOTAL AUDIO
        </h1>
        <p className="text-sm text-postcraft-gray-600 font-bold mt-1">Intelligence Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150 border-2',
                {
                  'bg-postcraft-blue text-postcraft-white border-postcraft-black shadow-brutal-sm': isActive,
                  'text-postcraft-gray-700 border-transparent hover:bg-postcraft-gray-50 hover:border-postcraft-gray-300': !isActive,
                }
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t-3 border-postcraft-black">
        <p className="text-xs text-postcraft-gray-600 font-semibold">
          © 2025 Total Audio Promo
        </p>
      </div>
    </aside>
  );
}
