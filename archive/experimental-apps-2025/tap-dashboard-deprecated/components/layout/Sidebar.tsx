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
  { name: 'dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'insights', href: '/insights', icon: LightBulbIcon },
  { name: 'identity', href: '/identity', icon: UserCircleIcon },
  { name: 'coverage', href: '/coverage', icon: MapIcon },
  { name: 'threads', href: '/threads', icon: ClockIcon },
  { name: 'automations', href: '/automations', icon: BoltIcon },
  { name: 'modes', href: '/modes', icon: Squares2X2Icon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-tap-panel border-r border-tap-panel/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-tap-panel/50">
        <h1 className="text-xl font-bold text-tap-cyan lowercase tracking-tight">total audio</h1>
        <p className="text-xs text-tap-grey lowercase mt-1">unified dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium lowercase transition-all duration-180',
                {
                  'bg-tap-cyan text-tap-black': isActive,
                  'text-tap-grey hover:text-tap-white hover:bg-tap-black/50': !isActive,
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
      <div className="p-4 border-t border-tap-panel/50">
        <p className="text-xs text-tap-grey lowercase">© 2025 total audio promo</p>
      </div>
    </aside>
  );
}
