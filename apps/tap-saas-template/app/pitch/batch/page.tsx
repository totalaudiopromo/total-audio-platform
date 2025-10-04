'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { useEffect } from 'react';

export default function BatchModePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard" className="subtle-button inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel px-8 py-16 text-center">
        <div className="mx-auto rounded-full bg-brand-magenta/20 p-6 w-fit">
          <Zap className="h-12 w-12 text-brand-magenta" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Batch Mode</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
          Coming soon! Generate personalized pitches for 20+ contacts at once and save hours on 
          every campaign.
        </p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-6 text-left">
          <h3 className="font-semibold">What you'll be able to do:</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-iris" />
              <span>Select multiple contacts from your list</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-iris" />
              <span>Enter track info once and generate personalized pitches for all</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-iris" />
              <span>Review and edit individual pitches before sending</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-iris" />
              <span>Copy all pitches at once or export as CSV</span>
            </li>
          </ul>
        </div>
        <Link href="/dashboard" className="cta-button mt-8 inline-flex">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

