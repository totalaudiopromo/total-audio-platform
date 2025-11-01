'use client';

import React from 'react';
import MobileNav from './MobileNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileNav />
      <div className="pt-16 md:pt-0">{children}</div>
    </>
  );
}
