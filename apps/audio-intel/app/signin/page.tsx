import { SignInForm } from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="glass-panel px-6 py-10 sm:px-10">
          <span className="badge-postcraft">Authentication</span>
          <h1 className="mt-6 text-3xl font-black text-gray-900">Sign in to Audio Intel</h1>
          <p className="mt-3 text-sm text-gray-700">
            Access your account to continue enriching your music industry contacts.
          </p>

          <div className="mt-8">
            <SignInForm />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Don&apos;t have an account?{' '}
              <Link
                href="/beta"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
