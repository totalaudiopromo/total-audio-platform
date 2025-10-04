import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'TAP SaaS Template',
  description: 'Postcraft-inspired SaaS starter for Total Audio Promo micro tools.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen`}> 
        <AuthProvider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-postcraft-grid [background-size:22px_22px] opacity-40"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] -translate-y-36 bg-postcraft-iris blur-3xl opacity-70"></div>
            <div className="relative z-10 flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">{children}</main>
              <SiteFooter />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
