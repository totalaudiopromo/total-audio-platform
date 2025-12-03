'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Link2,
  Settings,
  Search,
  Bell,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, badge }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
        isActive
          ? 'bg-teal-50 text-teal-700 border-2 border-teal-200 shadow-[2px_2px_0px_0px_rgba(20,184,166,0.3)]'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span
          className={`px-2 py-0.5 text-xs font-black rounded-full ${
            isActive ? 'bg-teal-200 text-teal-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

export function DashboardLayout({
  children,
  userName = 'User',
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#f8f9fa]">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-white border-r-4 border-black fixed h-full z-20 hidden md:flex flex-col">
        {/* Branding */}
        <div className="px-4 py-5 border-b-2 border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 text-lg leading-none">
                Tracker
              </h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Campaign Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Overview"
          />
          <NavItem
            href="/dashboard/campaigns"
            icon={<ListTodo size={18} />}
            label="Campaigns"
          />
          <NavItem
            href="/dashboard/analytics"
            icon={<BarChart3 size={18} />}
            label="Analytics"
          />
          <NavItem
            href="/dashboard/integrations"
            icon={<Link2 size={18} />}
            label="Integrations"
          />
          <NavItem
            href="/dashboard/settings"
            icon={<Settings size={18} />}
            label="Settings"
          />
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t-2 border-gray-200">
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b-4 border-black sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between shadow-[0_4px_0px_0px_rgba(0,0,0,0.05)]">
          {/* Mobile Branding / Search */}
          <div className="flex items-center w-full max-w-xl gap-4">
            <div className="md:hidden flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center border-2 border-black">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-black text-gray-900">Tracker</span>
              </div>
            </div>
            <div className="hidden md:block w-full relative max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search campaigns, artists..."
                className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border-2 border-gray-200 focus:border-teal-400 rounded-xl pl-9 pr-4 py-2 text-sm font-bold focus:outline-none transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center text-sm font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-4 py-6 md:px-6 md:py-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
