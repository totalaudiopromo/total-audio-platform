'use client';

import Link from 'next/link';
import { SiteHeader as SharedSiteHeader } from '@total-audio/ui';
import { ToolSwitcher } from '@total-audio/ui';

const links = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function SiteHeader() {
  return (
    <SharedSiteHeader
      toolName="Tracker"
      links={links}
      toolSwitcher={<ToolSwitcher currentTool="Tracker" accentColor="amber" />}
      authComponent={<Link href="/auth/signin" className="cta-button">Sign in</Link>}
    />
  );
}
