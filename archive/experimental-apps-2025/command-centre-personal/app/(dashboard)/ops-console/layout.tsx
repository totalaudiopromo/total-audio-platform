'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Bot,
  Share2,
  MessageSquare,
  TrendingUp,
  Users,
  Settings,
  ShieldCheck,
  Zap,
  TestTube,
} from 'lucide-react';

const opsNavItems = [
  { label: 'Overview', href: '/ops-console/overview', icon: Activity },
  { label: 'Agents', href: '/ops-console/agents', icon: Bot },
  { label: 'Golden Verify', href: '/ops-console/golden', icon: Zap },
  { label: 'Testing', href: '/ops-console/testing', icon: TestTube },
  { label: 'Social', href: '/ops-console/social', icon: Share2 },
  { label: 'Feedback', href: '/ops-console/feedback', icon: MessageSquare },
  { label: 'Growth', href: '/ops-console/growth', icon: TrendingUp },
  { label: 'Beta Management', href: '/ops-console/admin/beta', icon: ShieldCheck },
  { label: 'Users', href: '/ops-console/admin/users', icon: Users },
  { label: 'Settings', href: '/ops-console/settings', icon: Settings },
];

export default function OpsConsoleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-black text-gray-900">Ops Console</h1>
              <span className="text-sm text-gray-500 hidden sm:block">Phase 9D</span>
            </div>
            <Link
              href="/"
              className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              ← Back to Command Centre
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
              <div className="space-y-2">
                {opsNavItems.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all ${
                        active
                          ? 'bg-blue-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
