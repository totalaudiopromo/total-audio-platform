'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, TrendingUp, Share2, FileText, Users, Settings, Home, Zap } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: Home
  },
  {
    id: 'business',
    label: 'Business Dashboard',
    href: '/business-dashboard',
    icon: BarChart3
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: TrendingUp
  },
  {
    id: 'social-posting',
    label: 'Social Media',
    href: '/social-posting',
    icon: Share2
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: FileText
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: Users
  }
];

interface CleanNavigationProps {
  children: React.ReactNode;
}

export default function CleanNavigation({ children }: CleanNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="clean-sidebar">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Command Centre</h1>
              <p className="text-xs text-gray-500">Audio Intel Platform</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`clean-nav-item ${isActive ? 'active' : ''}`}
              >
                <IconComponent className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Data</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="clean-content">
        {children}
      </div>
    </div>
  );
}