import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { defaultMetadata } from './metadata';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen`}>
        <Script
          defer
          data-domain="pitch.totalaudiopromo.com"
          src="https://plausible.io/js/script.js"
        />
        <AuthProvider>
          <div className="flex min-h-screen flex-col bg-white">
            <SiteHeader />
            <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">{children}</main>
            <SiteFooter />
            <ExitIntentPopup />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
