'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  FileText,
  Share2,
  Newspaper,
  Users,
  Settings,
  DollarSign,
  Search,
  Menu,
  X,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Command Centre', href: '/', icon: BarChart3 },
  { label: 'Analytics', href: '/analytics', icon: TrendingUp },
  { label: 'Business Dashboard', href: '/business-dashboard', icon: DollarSign },
  { label: 'Business Reports', href: '/reports', icon: FileText },
  { label: 'Social Media Hub', href: '/social-media-hub', icon: Share2 },
  { label: 'Industry Intelligence', href: '/newsjacking', icon: Newspaper },
  { label: 'Beta Users', href: '/beta-management', icon: Users },
  { label: 'System Status', href: '/system-status', icon: Settings },
];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Manage body class for mobile overlay control
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.remove('mobile-sidebar-closed');
      document.body.classList.add('mobile-sidebar-open');
    } else {
      document.body.classList.remove('mobile-sidebar-open');
      document.body.classList.add('mobile-sidebar-closed');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-sidebar-open', 'mobile-sidebar-closed');
    };
  }, [sidebarOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b-4 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg border-2 border-black bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <span className="sr-only">Open main menu</span>
                  {sidebarOpen ? (
                    <X className="block h-5 w-5" />
                  ) : (
                    <Menu className="block h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-black text-gray-900">Command Centre</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Mobile overlay - Click to close sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar - Fixed positioning on mobile when open, z-50 to be above overlay */}
        <div
          className={`${
            sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'
          } lg:block lg:flex-shrink-0`}
        >
          <div className="flex flex-col w-64 h-screen lg:h-auto">
            <div className="flex flex-col h-full flex-1 bg-white border-r-4 border-black shadow-[4px_0_0px_0px_rgba(0,0,0,1)] lg:shadow-none">
              {/* Mobile close button */}
              <div className="flex justify-end p-4 lg:hidden border-b-2 border-gray-200">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg border-2 border-black bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[44px] min-w-[44px]"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-3 space-y-2">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all min-h-[44px] ${
                          active
                            ? 'bg-blue-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="flex-shrink-0 h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
