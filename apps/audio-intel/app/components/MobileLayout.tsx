'use client';

import { useEffect, useState } from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

/**
 * MobileLayout - Provides mobile detection and layout wrapper
 *
 * Mobile-specific CSS styles have been moved to globals.css
 * to avoid styled-jsx issues with Next.js App Router static generation.
 */
export default function MobileLayout({ children }: MobileLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`mobile-optimized-layout ${isMobile ? 'is-mobile' : 'is-desktop'}`}>
      {children}
    </div>
  );
}
