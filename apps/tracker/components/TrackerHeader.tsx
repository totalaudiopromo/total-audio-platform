'use client';

import { SiteHeader } from '@/components/shared/SiteHeader';
import { ToolSwitcher } from '@/components/shared/ToolSwitcher';
import { AuthButton } from '@/components/AuthButton';
import { WorkspaceSwitcher } from '@total-audio/ui/WorkspaceSwitcher';

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
      toolSwitcher={
        <div className="flex items-center gap-4">
          <WorkspaceSwitcher className="ml-0" accentColor="#14B8A6" />
          <ToolSwitcher currentTool="Tracker" accentColor="teal" />
        </div>
      }
      authComponent={<AuthButton />}
    />
  );
}
