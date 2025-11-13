'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader as SharedSiteHeader } from './SharedSiteHeader';
import { ToolSwitcher } from './SharedToolSwitcher';
import { createClient } from '@total-audio/core-db/client';
import type { User } from '@supabase/supabase-js';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
];

function AuthComponent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="h-8 w-16 animate-pulse rounded-full bg-white/10" />;
  }

  if (user) {
    return (
      <>
        <span className="hidden text-sm font-medium text-gray-700 sm:inline">
          {user.user_metadata?.name ?? user.email}
        </span>
        <button onClick={handleSignOut} className="subtle-button text-xs">
          Sign out
        </button>
      </>
    );
  }

  return (
    <button onClick={handleSignIn} className="cta-button">
      Sign in
    </button>
  );
}

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const availableLinks = links.filter(link => !link.requiresAuth || user);

  return (
    <SharedSiteHeader
      toolName="Pitch Generator"
      links={availableLinks}
      toolSwitcher={<ToolSwitcher currentTool="Pitch Generator" accentColor="amber" />}
      authComponent={<AuthComponent />}
      logoPath="/total_audio_promo_logo_trans.png"
    />
  );
}
