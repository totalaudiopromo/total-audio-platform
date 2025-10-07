'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-4 border-red-500 text-red-900 px-4 py-3 rounded-xl font-bold text-sm shadow-brutal">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
          Email address
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600 font-bold">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-2 text-sm text-red-600 font-bold">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end mb-4">
        <a
          href="/reset-password"
          className="text-sm text-purple-600 hover:text-purple-700 font-black underline transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 transition-all"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}


