'use client';

import * as React from 'react';

/**
 * SkipNavigation Component
 *
 * Provides a skip link for keyboard users to bypass navigation
 * and go directly to main content. Hidden until focused.
 *
 * Meets WCAG 2.2 Level AA requirements for keyboard navigation.
 *
 * @example
 * ```tsx
 * // In app layout.tsx
 * <body>
 *   <SkipNavigation />
 *   <Header />
 *   <main id="main-content">...</main>
 * </body>
 * ```
 */
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-bold focus:rounded-lg focus:border-2 focus:border-black focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
    >
      Skip to main content
    </a>
  );
}
