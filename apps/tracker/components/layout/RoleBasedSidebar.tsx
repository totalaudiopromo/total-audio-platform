'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CogIcon,
  PlayIcon,
  UsersIcon,
  BriefcaseIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';

interface RoleBasedSidebarProps {
  userType: 'artist' | 'agency' | 'both';
}

export function RoleBasedSidebar({ userType }: RoleBasedSidebarProps) {
  const pathname = usePathname();

  const artistNavItems = [
    { href: '/my-campaigns', label: 'My Campaigns', icon: FolderIcon },
    { href: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    { href: '/settings', label: 'Settings', icon: CogIcon },
  ];

  const agencyNavItems = [
    { href: '/agency-dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/clients', label: 'Clients', icon: UsersIcon },
    { href: '/campaigns', label: 'All Campaigns', icon: RocketLaunchIcon },
    { href: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    { href: '/settings', label: 'Settings', icon: CogIcon },
  ];

  const bothNavItems = [
    {
      href: '/agency-dashboard',
      label: 'Agency Dashboard',
      icon: BriefcaseIcon,
    },
    { href: '/my-campaigns', label: 'My Campaigns', icon: FolderIcon },
    { href: '/clients', label: 'Clients', icon: UsersIcon },
    { href: '/campaigns', label: 'All Campaigns', icon: RocketLaunchIcon },
    { href: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    { href: '/settings', label: 'Settings', icon: CogIcon },
  ];

  const navItems =
    userType === 'artist'
      ? artistNavItems
      : userType === 'agency'
      ? agencyNavItems
      : bothNavItems;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <PlayIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-teal-600 to-teal-600 bg-clip-text text-transparent">
            Tracker
          </span>
        </Link>
      </div>

      {/* User Type Badge */}
      <div className="mb-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Account Type
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
          {userType === 'both' ? 'Artist & Agency' : userType}
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                active
                  ? 'bg-gradient-to-r from-teal-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-teal-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-blue-200 dark:border-teal-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            {userType === 'agency' ? 'Upgrade Agency Plan' : 'Upgrade to Pro'}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            {userType === 'agency'
              ? 'More clients & advanced features'
              : 'Unlock advanced analytics & unlimited campaigns'}
          </p>
          <Link
            href="/billing"
            className="block text-center px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </aside>
  );
}
