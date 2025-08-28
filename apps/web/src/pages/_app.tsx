import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '../styles/globals.css';

// Dynamically import AuthProvider to avoid SSR issues
const AuthProvider = dynamic(() => import('@/contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      // If on a protected route, redirect to login
      if (router.pathname !== '/login' && router.pathname !== '/register' && router.pathname !== '/') {
        router.push('/login');
      }
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router.pathname]);

  // Only render on client side to avoid SSR issues
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render protected pages if not authenticated
  if (!isAuthenticated && router.pathname !== '/login' && router.pathname !== '/register' && router.pathname !== '/') {
    return null;
  }

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
} 