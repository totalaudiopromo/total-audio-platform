'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Zap,
  Calendar,
  FileText,
  MessageSquare,
  Search,
  Bell,
  FolderOpen,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-jakarta font-medium transition-all relative ${
        isActive
          ? 'bg-white text-[#111] shadow-sm border-l-2 border-black'
          : 'text-[#737373] hover:text-[#111] hover:bg-white/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#F7F6F2] font-jakarta text-[#111]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#FAFAF8] border-r border-[#D9D7D2] fixed h-full z-20 hidden md:flex flex-col">
        <div className="px-6 py-6 border-b border-[#D9D7D2]">
          {/* Branding Block */}
          <img
            src="/logo_black.png"
            alt="Liberty Mark"
            width={120}
            height={32}
            className="h-8 w-auto object-contain mb-4"
          />
          <div className="flex flex-col items-start leading-none">
            <p className="font-mono text-[11px] text-neutral-400 tracking-[0.2em] uppercase font-medium mt-1.5 ml-0.5">
              Agency Console
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 flex flex-col">
          <NavItem
            href="/dashboard/overview"
            icon={<LayoutDashboard size={18} />}
            label="Overview"
          />
          <NavItem href="/dashboard/crm" icon={<Users size={18} />} label="CRM Intelligence" />
          <NavItem href="/dashboard/assets" icon={<FolderOpen size={18} />} label="Asset Hub" />
          <NavItem href="/dashboard/intake" icon={<FileText size={18} />} label="Artist Intake" />
          <NavItem href="/dashboard/ops" icon={<Calendar size={18} />} label="Operations" />
          <NavItem href="/dashboard/automation" icon={<Zap size={18} />} label="Automations" />
          {process.env.NODE_ENV === 'development' && (
            <>
              <a
                href="/debug/typography"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-jakarta font-medium transition-colors text-neutral-500 hover:text-black hover:bg-neutral-50"
              >
                <span>Typography Debug</span>
              </a>
              <a
                href="/debug/hierarchy"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-jakarta font-medium transition-colors text-neutral-500 hover:text-black hover:bg-neutral-50"
              >
                <span>Visual Hierarchy Debug</span>
              </a>
            </>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-[#D9D7D2]">
          <div className="flex items-center space-x-3 px-3 py-2 text-neutral-500 text-sm cursor-pointer hover:text-black transition-colors group">
            <div className="relative">
              <MessageSquare size={18} className="group-hover:text-black transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full ring-2 ring-white"></span>
            </div>
            <span className="font-medium font-jakarta">Google Chat</span>
          </div>
          <div className="mt-6 px-3">
            <div className="font-mono text-[11px] uppercase text-neutral-400 mb-3 tracking-wider">
              My Workspace
            </div>
            <div className="flex items-center -space-x-2">
              <div className="w-7 h-7 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[10px] font-medium text-black">
                A
              </div>
              <div className="w-7 h-7 rounded-full bg-neutral-300 border-2 border-white flex items-center justify-center text-[10px] font-medium text-black">
                B
              </div>
              <button className="w-7 h-7 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center text-[10px] text-neutral-500 hover:bg-neutral-50 transition-colors">
                +
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-[#D9D7D2] sticky top-0 z-10 px-6 md:px-8 flex items-center justify-between shadow-sm">
          {/* Mobile Branding / Search */}
          <div className="flex items-center w-full max-w-xl space-x-4">
            <div className="md:hidden flex-shrink-0">
              <img
                src="/logo_black.png"
                alt="Liberty"
                width={90}
                height={24}
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="w-full relative group max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors"
              />
              <input
                type="text"
                placeholder="Search campaigns, artists, contacts..."
                className="w-full bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-200 rounded-xl pl-9 pr-4 py-1.5 text-sm focus:outline-none transition-all placeholder:text-neutral-400 text-black font-jakarta font-medium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 pl-4">
            <button className="relative text-neutral-400 hover:text-black transition-colors">
              <Bell size={18} />
              <span className="absolute top-0 right-0.5 w-1.5 h-1.5 bg-black rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-jakarta font-semibold border border-black shadow-sm cursor-pointer hover:bg-neutral-800 transition-colors">
              JD
            </div>
          </div>
        </header>

        <div className="px-6 py-6 md:px-8 md:py-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
