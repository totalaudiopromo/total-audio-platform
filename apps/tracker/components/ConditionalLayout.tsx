'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDemoPage = pathname === '/demo';

  if (isDemoPage) {
    // Demo pages have their own styling, no header/footer needed
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">{children}</main>
      <SiteFooter />
    </>
  );
}