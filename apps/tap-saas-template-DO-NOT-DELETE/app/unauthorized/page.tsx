import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="glass-panel px-6 py-12 sm:px-10">
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">Access required</span>
        <h1 className="mt-6 text-3xl font-semibold">Sign in to continue</h1>
        <p className="mt-3 text-sm text-gray-900/70">
          This area is reserved for authenticated users. Connect with the demo credentials or your OAuth provider to explore the dashboard experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth/signin" className="cta-button">
            Sign in now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/" className="subtle-button">Return home</Link>
        </div>
      </div>
    </div>
  );
}
