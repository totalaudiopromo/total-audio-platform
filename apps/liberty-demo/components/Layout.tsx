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
  Sparkles,
  UserPlus,
  ChevronDown,
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

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: { href: string; icon: React.ReactNode; label: string }[];
}

const NavGroup: React.FC<NavGroupProps> = ({ icon, label, children }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(() =>
    children.some(child => pathname.startsWith(child.href))
  );
  const isAnyChildActive = children.some(child => pathname === child.href);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-jakarta font-medium transition-all ${
          isAnyChildActive
            ? 'text-[#111] bg-white/50'
            : 'text-[#737373] hover:text-[#111] hover:bg-white/50'
        }`}
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span>{label}</span>
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="ml-4 pl-3 border-l border-[#D9D7D2] space-y-1">
          {children.map(child => (
            <Link
              key={child.href}
              href={child.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-jakarta font-medium transition-all ${
                pathname === child.href
                  ? 'bg-white text-[#111] shadow-sm'
                  : 'text-[#737373] hover:text-[#111] hover:bg-white/50'
              }`}
            >
              {child.icon}
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
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
            <p className="font-mono text-[11px] text-[#737373] tracking-[0.2em] uppercase font-medium mt-1.5 ml-0.5">
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
          <NavGroup
            icon={<Sparkles size={18} />}
            label="Lead Gen"
            children={[
              {
                href: '/dashboard/leads',
                icon: <UserPlus size={16} />,
                label: 'Artist Discovery',
              },
              {
                href: '/dashboard/contacts',
                icon: <Search size={16} />,
                label: 'Contact Research',
              },
            ]}
          />
          <NavItem href="/dashboard/assets" icon={<FolderOpen size={18} />} label="Asset Hub" />
          <NavItem href="/dashboard/intake" icon={<FileText size={18} />} label="Artist Intake" />
          <NavItem href="/dashboard/ops" icon={<Calendar size={18} />} label="Operations" />
          <NavItem href="/dashboard/automation" icon={<Zap size={18} />} label="Automations" />
        </nav>

        <div className="px-4 py-4 border-t border-[#D9D7D2]">
          <div className="flex items-center space-x-3 px-3 py-2 text-[#737373] text-sm cursor-pointer hover:text-[#111] transition-colors duration-150 ease-out group">
            <div className="relative">
              <MessageSquare
                size={18}
                className="group-hover:text-[#111] transition-colors duration-150 ease-out"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full ring-2 ring-white"></span>
            </div>
            <span className="font-medium font-jakarta">Google Chat</span>
          </div>
          <div className="mt-6 px-3">
            <div className="font-mono text-[11px] uppercase text-[#737373] mb-3 tracking-wider">
              My Workspace
            </div>
            <div className="flex items-center -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#D9D7D2] border-2 border-white flex items-center justify-center text-[10px] font-medium text-black">
                A
              </div>
              <div className="w-7 h-7 rounded-full bg-[#D9D7D2] border-2 border-white flex items-center justify-center text-[10px] font-medium text-black">
                B
              </div>
              <button className="w-7 h-7 rounded-full bg-white border-2 border-[#D9D7D2] flex items-center justify-center text-[10px] text-[#737373] hover:bg-[#FAFAF8] transition-colors duration-150 ease-out">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373] group-focus-within:text-black transition-colors duration-150 ease-out"
              />
              <input
                type="text"
                placeholder="Search campaigns, artists, contacts..."
                className="w-full bg-[#FAFAF8] hover:bg-[#F5F5F5] focus:bg-white border border-transparent focus:border-[#D9D7D2] rounded-xl pl-9 pr-4 py-1.5 text-sm focus:outline-none transition-all duration-200 ease-out placeholder:text-[#737373] text-black font-jakarta font-medium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 pl-4">
            <button className="relative text-[#737373] hover:text-[#111] transition-colors duration-150 ease-out">
              <Bell size={18} />
              <span className="absolute top-0 right-0.5 w-1.5 h-1.5 bg-black rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-jakarta font-semibold border border-black shadow-sm cursor-pointer hover:bg-[#262626] transition-colors duration-150 ease-out">
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
