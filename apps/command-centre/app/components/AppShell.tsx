'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, FileText, Share2, Newspaper, Users, Settings, DollarSign, Search, Menu, X } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {sidebarOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
              
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Command Centre</h1>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Fixed positioning on mobile when open */}
        <div className={`${sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} lg:block lg:flex-shrink-0`}>
          <div className="flex flex-col w-64 h-full">
            <div className="flex flex-col h-full flex-1 bg-white border-r border-gray-200 shadow-lg lg:shadow-none">
              {/* Mobile close button */}
              <div className="flex justify-end p-4 lg:hidden">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="block h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          active
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className={`mr-3 flex-shrink-0 h-6 w-6 ${
                          active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`} />
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
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 mobile-content-accessible">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile overlay - only show when sidebar is actually open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}
    </div>
  );
}