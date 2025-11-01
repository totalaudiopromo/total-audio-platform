'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') ?? '/profile';

  const [email, setEmail] = useState('founder@totalaudiopromo.com');
  const [password, setPassword] = useState('buildfast');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const response = await signIn('credentials', {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    if (response?.error) {
      setMessage('Sign-in failed. Double-check the demo credentials or configure your provider.');
      setSubmitting(false);
      return;
    }

    window.location.href = response?.url ?? callbackUrl;
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="glass-panel px-6 py-10 sm:px-10">
        <span className="badge-postcraft">Authentication</span>
        <h1 className="mt-6 text-3xl font-semibold">Sign in to the template workspace</h1>
        <p className="mt-3 text-sm text-gray-900/70">
          Credentials are provided for local exploration. Swap them out once you wire in OAuth keys.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleCredentials}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-900/40"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-900/40 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-900/40"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-900/40 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoComplete="current-password"
              required
            />
            <p className="text-xs text-gray-900/40">
              Default demo password: <code className="bg-gray-100 px-1.5 py-0.5">buildfast</code>
            </p>
          </div>

          <button type="submit" disabled={submitting} className="cta-button w-full justify-center">
            {submitting ? 'Signing in…' : 'Continue with credentials'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-900/50">
          <p>Prefer OAuth?</p>
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="subtle-button mt-3 w-full justify-center"
            type="button"
          >
            Sign in with Google
          </button>
        </div>

        {(message || error) && (
          <div className="mt-6 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {message ?? 'Authentication error. Configure your provider credentials and try again.'}
          </div>
        )}
      </div>
    </div>
  );
}
