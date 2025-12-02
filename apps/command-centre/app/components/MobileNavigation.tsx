'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  Home,
  Share2,
  TrendingUp,
  Newspaper,
  Users,
  BarChart3,
  FileText,
  Settings,
  Zap,
  Menu,
  X,
  Plus,
  Target,
} from 'lucide-react';
import DesktopDashboard from './DesktopDashboard';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  category: 'primary' | 'secondary';
  badge?: number;
}

const navItems: NavItem[] = [
  // Primary navigation - Bottom tab bar
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: Home,
    category: 'primary',
  },
  {
    id: 'social',
    label: 'Social',
    href: '/social-posting',
    icon: Share2,
    category: 'primary',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
    category: 'primary',
  },
  {
    id: 'news',
    label: 'News',
    href: '/newsjacking',
    icon: Newspaper,
    category: 'primary',
  },
  // Secondary navigation - Hamburger menu
  {
    id: 'business',
    label: 'Business Dashboard',
    href: '/business-dashboard',
    icon: BarChart3,
    category: 'secondary',
  },
  {
    id: 'beta',
    label: 'Beta Users',
    href: '/beta-management',
    icon: Users,
    category: 'secondary',
    badge: 3,
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: FileText,
    category: 'secondary',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    href: '/marketing',
    icon: Target,
    category: 'secondary',
  },
  {
    id: 'predictive-revenue',
    label: 'Predictive Revenue',
    href: '/predictive-revenue',
    icon: TrendingUp,
    category: 'secondary',
  },
  {
    id: 'revenue-intelligence',
    label: 'Revenue Intelligence',
    href: '/revenue-intelligence',
    icon: BarChart3,
    category: 'secondary',
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: Users,
    category: 'secondary',
  },
  {
    id: 'system',
    label: 'System Status',
    href: '/system-status',
    icon: Settings,
    category: 'secondary',
  },
];

interface MobileNavigationProps {
  children: React.ReactNode;
  newsCount?: number;
}

export default function MobileNavigation({ children, newsCount = 0 }: MobileNavigationProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primaryNav = navItems.filter(item => item.category === 'primary');
  const secondaryNav = navItems.filter(item => item.category === 'secondary');

  return (
    <div className="min-h-screen postcraft-page relative">
      {/* Sidebar - Always visible */}
      <div className="postcraft-sidebar flex-col">
        {/* Professional Header */}
        <div className="postcraft-sidebar-header">
          <div className="postcraft-sidebar-logo">
            <div className="postcraft-sidebar-logo-icon">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="postcraft-sidebar-logo-text">
              <h1>Command Centre</h1>
              <p>Total Audio Promo</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-4">
          {/* Primary Navigation */}
          <div className="postcraft-nav-section">
            <div className="postcraft-nav-section-title">Main Dashboard</div>
            {primaryNav.map(item => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              const showBadge = item.id === 'news' && newsCount > 0;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`postcraft-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <IconComponent className="w-5 h-5" />
                      {item.label}
                    </div>
                    {showBadge && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-sm">
                        {newsCount > 9 ? '9+' : newsCount}
                      </span>
                    )}
                    {item.badge && (
                      <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="postcraft-nav-section">
            <div className="postcraft-nav-section-title">Management Tools</div>
            {secondaryNav.map(item => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`postcraft-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <IconComponent className="w-5 h-5" />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Professional Status Footer */}
        <div className="postcraft-sidebar-footer">
          <div className="postcraft-status-indicator">
            <div className="postcraft-status-dot"></div>
            <span>Live Business Intelligence</span>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile and Desktop */}
      <main className="postcraft-main-content lg:ml-64">{children}</main>
    </div>
  );
}
