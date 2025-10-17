'use client';

// Supabase doesn't require a provider wrapper like NextAuth
// Auth state is managed through cookies and the Supabase client
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
