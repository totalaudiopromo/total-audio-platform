import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TrackerHeader } from '@/components/TrackerHeader';
import { TrackerFooter } from '@/components/TrackerFooter';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { CookieConsent } from '@/components/CookieConsent';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tracker.totalaudiopromo.com'),
  title: {
    default: 'Total Audio Tracker – Simple Campaign Tracking',
    template: '%s | Total Audio Tracker',
  },
  description:
    'Simple campaign tracking for indie artists and radio promoters. Stop using spreadsheets for radio submission campaigns.',
  keywords: [
    'campaign tracking',
    'radio promotion tracker',
    'music PR tracking',
    'radio submission tracking',
    'music campaign management',
    'radio plugger tools',
    'indie artist CRM',
    'music industry tracker',
    'radio promotion software',
    'campaign analytics',
  ],
  authors: [
    {
      name: 'Chris Schofield',
      url: 'https://totalaudiopromo.com',
    },
  ],
  creator: 'Total Audio Promo',
  publisher: 'Total Audio Promo',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://tracker.totalaudiopromo.com',
    siteName: 'Total Audio Tracker',
    title: 'Total Audio Tracker – Simple Campaign Tracking',
    description:
      'Simple campaign tracking for indie artists and radio promoters. Stop using spreadsheets for radio submission campaigns.',
    images: [
      {
        url: '/og-tracker.png',
        width: 1200,
        height: 630,
        alt: 'Total Audio Tracker - Campaign tracking for music promotion',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Total Audio Tracker – Simple Campaign Tracking',
    description:
      'Stop using spreadsheets for radio promotion campaigns. Simple tracking for indie artists and radio promoters.',
    images: ['/og-tracker.png'],
    creator: '@totalaudiopromo',
    site: '@totalaudiopromo',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} font-sans`}
    >
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WZNJWDKH');
            `,
          }}
        />
      </head>
      <body className="relative min-h-screen font-sans overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WZNJWDKH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <div className="flex min-h-screen flex-col bg-white">
          <TrackerHeader />
          <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">
            {children}
          </main>
          <TrackerFooter />
          <ExitIntentPopup />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
