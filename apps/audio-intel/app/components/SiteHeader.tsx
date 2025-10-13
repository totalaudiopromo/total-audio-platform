'use client';

import Link from 'next/link';
import { SiteHeader as SharedSiteHeader } from '@total-audio/ui';
import { ToolSwitcher } from '@total-audio/ui';

const links = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/demo', label: 'Dashboard' },
];

export function SiteHeader() {
  return (
    <SharedSiteHeader
      toolName="Audio Intel"
      links={links}
      toolSwitcher={<ToolSwitcher currentTool="Audio Intel" accentColor="blue" />}
      authComponent={<Link href="/beta" className="cta-button">Sign in</Link>}
    />
  );
}
