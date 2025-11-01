'use client';

import { SiteHeader } from '@/components/shared/SiteHeader';
import { ToolSwitcher } from '@/components/shared/ToolSwitcher';
import { AuthButton } from '@/components/AuthButton';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
];

export function TrackerHeader() {
  return (
    <SiteHeader
      toolName="Tracker"
      links={navLinks}
      toolSwitcher={<ToolSwitcher currentTool="Tracker" accentColor="teal" />}
      authComponent={<AuthButton />}
    />
  );
}
