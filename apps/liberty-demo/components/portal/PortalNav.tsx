'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Newspaper,
  Radio,
  ListMusic,
  Send,
  Mail,
  TrendingUp,
  FolderOpen,
  Upload,
  Calendar,
} from 'lucide-react';

interface PortalNavProps {
  artistSlug: string;
}

const PortalNav: React.FC<PortalNavProps> = ({ artistSlug }) => {
  const pathname = usePathname();

  const navItems = [
    { href: `/artist/${artistSlug}`, label: 'Overview', icon: LayoutDashboard },
    { href: `/artist/${artistSlug}/timeline`, label: 'Timeline', icon: Calendar },
    { href: `/artist/${artistSlug}/press`, label: 'Press', icon: Newspaper },
    { href: `/artist/${artistSlug}/radio`, label: 'Radio', icon: Radio },
    { href: `/artist/${artistSlug}/playlists`, label: 'Playlists', icon: ListMusic },
    { href: `/artist/${artistSlug}/pitches`, label: 'Pitches', icon: Send },
    { href: `/artist/${artistSlug}/comms`, label: 'Comms', icon: Mail },
    { href: `/artist/${artistSlug}/analytics`, label: 'Analytics', icon: TrendingUp },
    { href: `/artist/${artistSlug}/assets`, label: 'Assets', icon: FolderOpen },
    { href: `/artist/${artistSlug}/upload`, label: 'Upload', icon: Upload },
  ];

  return (
    <nav className="bg-white border-b border-[#D9D7D2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-jakarta font-medium transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'text-black border-black'
                    : 'text-neutral-500 border-transparent hover:text-black hover:border-neutral-300'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default PortalNav;
