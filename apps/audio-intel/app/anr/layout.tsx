import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ANRLayoutProps {
  children: ReactNode;
}

export default function ANRLayout({ children }: ANRLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* ANR Navigation */}
      <nav className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/anr/workbench"
              className="text-lg font-semibold text-slate-100 hover:text-[#3AA9BE] transition-colors"
            >
              A&R Radar
            </Link>

            <div className="flex items-center gap-1">
              <NavLink href="/anr/workbench">Workbench</NavLink>
              <NavLink href="/anr/deals">Deals</NavLink>
              <NavLink href="/anr/roster">Roster</NavLink>
              <NavLink href="/anr/watchlists">Watchlists</NavLink>
              <NavLink href="/anr/showcases">Showcases</NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3AA9BE]/50"
      )}
    >
      {children}
    </Link>
  );
}
