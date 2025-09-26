'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChartColumn, 
  TrendingUp, 
  DollarSign, 
  Share2, 
  FileText, 
  Newspaper, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: ChartColumn, tool: 'command-centre' },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp, tool: 'audio-intel' },
    { name: 'Business', href: '/business-dashboard', icon: DollarSign, tool: 'success-predict' },
    { name: 'Reports', href: '/reports', icon: FileText, tool: 'trend-track' },
    { name: 'Social Hub', href: '/social-media-hub', icon: Share2, tool: 'playlist-pulse' },
    { name: 'Newsjacking', href: '/newsjacking', icon: Newspaper, tool: 'release-radar' },
    { name: 'Revenue', href: '/revenue-intelligence', icon: TrendingUp, tool: 'success-predict' },
    { name: 'Beta Users', href: '/beta-management', icon: Users, tool: 'audio-intel' },
    { name: 'System', href: '/system-status', icon: Settings, tool: 'command-centre' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Single responsive navigation */}
      <nav className="tap-nav">
        <div className="tap-nav-container">
          <Link href="/" className="tap-nav-brand">
            <div className="audio-mascot"></div>
            <span>Command Centre</span>
          </Link>
          <div className="tap-nav-links overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`tap-nav-link ${item.tool} ${isActive(item.href) ? 'active' : ''}`}
                >
                  <Icon size={16} className="w-4 h-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="tap-container tap-p-6">
        {children}
      </main>
    </div>
  );
}