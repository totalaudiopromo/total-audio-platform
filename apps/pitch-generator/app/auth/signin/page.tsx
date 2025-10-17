import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="glass-panel px-6 py-10 sm:px-10">
        <span className="badge-postcraft">Authentication</span>
        <h1 className="mt-6 text-3xl font-semibold">Sign in to Pitch Generator</h1>
        <p className="mt-3 text-sm text-gray-900/70">
          Access your account to continue creating authentic music pitches.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-900/70">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
