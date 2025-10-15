'use client';

import { SiteHeader as SharedSiteHeader } from './SharedSiteHeader';
import { ToolSwitcher } from './SharedToolSwitcher';
import { signIn, signOut, useSession } from 'next-auth/react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
  { href: '/pitch/history', label: 'History', requiresAuth: true },
  { href: '/pitch/contacts', label: 'Contacts', requiresAuth: true },
  { href: '/dashboard/integrations', label: 'Integrations', requiresAuth: true },
];

function AuthComponent() {
  const { data: session, status } = useSession();
  const handleSignIn = () => signIn(undefined, { callbackUrl: '/dashboard' });
  const handleSignOut = () => signOut({ callbackUrl: '/' });

  if (status === 'loading') {
    return <div className="h-8 w-16 animate-pulse rounded-full bg-white/10" />;
  }

  if (session) {
    return (
      <>
        <span className="hidden text-sm font-medium text-gray-700 sm:inline">
          {session.user?.name ?? session.user?.email}
        </span>
        <button onClick={handleSignOut} className="subtle-button text-xs">Sign out</button>
      </>
    );
  }

  return <button onClick={handleSignIn} className="cta-button">Sign in</button>;
}

export function SiteHeader() {
  const { data: session } = useSession();
  const availableLinks = links.filter(link => !link.requiresAuth || session);

  return (
    <SharedSiteHeader
      toolName="Pitch Generator"
      links={availableLinks}
      toolSwitcher={<ToolSwitcher currentTool="Pitch Generator" accentColor="purple" />}
      authComponent={<AuthComponent />}
      logoPath="/total_audio_promo_logo_trans.png"
    />
  );
}
