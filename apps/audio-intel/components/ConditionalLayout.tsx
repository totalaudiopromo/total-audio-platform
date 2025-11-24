'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './shared/SiteHeader';
import { SiteFooter } from './shared/SiteFooter';

const INTEL_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/contacts', label: 'Contacts' },
  { href: '/enrichment', label: 'Enrichment' },
];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDemoPage = pathname === '/demo';

  if (isDemoPage) {
    // Demo pages have their own styling, no header/footer needed
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader toolName="Audio Intel" links={INTEL_LINKS} />
      <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">{children}</main>
      <SiteFooter toolName="Audio Intel" />
    </>
  );
}
