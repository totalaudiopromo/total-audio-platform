'use client';

import Link from 'next/link';
import { SiteHeader as SharedSiteHeader } from '@/components/shared/SiteHeader';
import { ToolSwitcher } from '@/components/shared/ToolSwitcher';
import { WorkspaceSwitcher } from '@total-audio/ui/WorkspaceSwitcher';
import { useWorkspace } from '@total-audio/core-db/contexts/workspace-context';
import { UsageStats } from '@/components/UsageStats';
import { createClient } from '@total-audio/core-db/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
];

export function SiteHeader() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspace();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const authComponent = user ? (
    <div className="flex items-center gap-3">
      <UsageStats />
      <button
        onClick={handleSignOut}
        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
      >
        Sign out
      </button>
    </div>
  ) : (
    <Link href="/signin" className="cta-button">
      Sign in
    </Link>
  );

  return (
    <SharedSiteHeader
      toolName="Audio Intel"
      links={links}
      toolSwitcher={
        <div className="flex items-center gap-3">
          <ToolSwitcher currentTool="Audio Intel" accentColor="blue" />
          {user && (
            <WorkspaceSwitcher
              currentWorkspace={currentWorkspace}
              workspaces={workspaces}
              onWorkspaceChange={setCurrentWorkspace}
              accentColor="#3AA9BE"
            />
          )}
        </div>
      }
      authComponent={authComponent}
    />
  );
}
