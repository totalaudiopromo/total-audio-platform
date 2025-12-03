'use client';

import { SiteHeader } from '@/components/shared/SiteHeader';
import { ToolSwitcher } from '@/components/shared/ToolSwitcher';
import { AuthButton } from '@/components/AuthButton';
import { WorkspaceSwitcher } from '@total-audio/ui/WorkspaceSwitcher';
import { useWorkspace } from '@total-audio/core-db/contexts/workspace-context';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
];

export function TrackerHeader() {
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspace();

  return (
    <SiteHeader
      toolName="Tracker"
      links={navLinks}
      toolSwitcher={
        <div className="flex items-center gap-4">
          <WorkspaceSwitcher
            currentWorkspace={currentWorkspace}
            workspaces={workspaces}
            onWorkspaceChange={setCurrentWorkspace}
            className="ml-0"
            accentColor="#14B8A6"
          />
          <ToolSwitcher currentTool="Tracker" accentColor="teal" />
        </div>
      }
      authComponent={<AuthButton />}
    />
  );
}
