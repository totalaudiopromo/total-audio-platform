import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./mobile-optimizations.css";
import "./beta-mobile.css";
import "./home-mobile.css";
import "./mobile-touch-fixes.css";
import "./mobile-ux-fixes.css";
import React from 'react';
import ClientLayout from './components/ClientLayout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Audio Intel – AI-Powered Music Industry Intelligence | Founded by Music Industry Veteran',
  description: 'Stop wasting 15 hours a week researching music contacts. Audio Intel uses AI to turn emails into detailed industry profiles instantly.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/images/total_audio_promo_logo_trans.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    title: 'Audio Intel – AI-Powered Music Industry Contact Enrichment',
    description: 'Stop wasting 15 hours a week researching music contacts. Audio Intel uses AI to turn emails into detailed industry profiles instantly.',
    url: 'https://intel.totalaudiopromo.com',
    siteName: 'Audio Intel - Total Audio Promo',
    images: [
      {
        url: 'https://intel.totalaudiopromo.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Audio Intel - AI-Powered Music Industry Contact Enrichment',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Intel – AI-Powered Music Industry Contact Enrichment',
    description: 'Stop wasting 15 hours a week researching music contacts. Instantly enrich your email lists with AI-powered insights for playlist curators, radio DJs, and music bloggers.',
    images: ['https://intel.totalaudiopromo.com/og-image.jpg'],
    site: '@totalaudiopromo',
    creator: '@totalaudiopromo',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
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
      <body
        className="relative min-h-screen font-sans overflow-x-hidden"
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZNJWDKH"
                  height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
