'use client';

import { usePathname } from 'next/navigation';
import { TrackerHeader } from './TrackerHeader';
import { TrackerFooter } from './TrackerFooter';

export function ConditionalTrackerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDemoPage = pathname === '/demo';

  if (isDemoPage) {
    // Demo pages have their own styling, no header/footer needed
    return <>{children}</>;
  }

  return (
    <>
      <TrackerHeader />
      <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">{children}</main>
      <TrackerFooter />
    </>
  );
}