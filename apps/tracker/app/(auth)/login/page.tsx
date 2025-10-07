import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-700 font-bold">
          Sign in to your account to continue tracking your music campaigns
        </p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-700 font-bold">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-black text-purple-600 hover:text-purple-700 transition-colors underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}


