import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppShell from './components/AppShell';
import { ToastContainer } from './components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Command Centre - Total Audio Promo',
  description:
    'Total Audio Promo Command Centre - Business intelligence, industry news monitoring, and marketing automation for indie artists',
  keywords:
    'music industry, audio intel, contact intelligence, indie artist tools, music promotion',
  authors: [{ name: 'Total Audio Promo', url: 'https://intel.totalaudiopromo.com' }],
  creator: 'Total Audio Promo',
  publisher: 'Total Audio Promo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL('https://command.totalaudiopromo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Command Centre - Total Audio Promo',
    description: 'Business intelligence and marketing automation for the music industry',
    url: 'https://command.totalaudiopromo.com',
    siteName: 'Total Audio Promo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Total Audio Promo Command Centre',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Command Centre - Total Audio Promo',
    description: 'Business intelligence and marketing automation for the music industry',
    images: ['/og-image.png'],
    creator: '@totalaudiopromo',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Total Audio Promo',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zoom on mobile inputs
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6ab00' },
    { media: '(prefers-color-scheme: dark)', color: '#f6ab00' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
        <ToastContainer />
      </body>
    </html>
  );
}
