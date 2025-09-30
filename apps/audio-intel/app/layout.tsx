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
  title: 'Audio Intel – 15 Hours to 15 Minutes | Contact Enrichment for Music Promotion',
  description: 'Transform chaotic contact spreadsheets into organised databases in minutes. Built by radio promoters for radio promoters. BBC Radio 1 + Spotify case studies proven.',
  keywords: 'music promotion, contact enrichment, radio promotion, playlist pitching, music industry contacts, BBC Radio 1, Spotify curators',
  authors: [{ name: 'Chris Schofield', url: 'https://intel.totalaudiopromo.com' }],
  creator: 'Chris Schofield',
  publisher: 'Total Audio Promo',
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/total_audio_promo_logo_trans.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    title: 'Audio Intel – 15 Hours to 15 Minutes | Contact Enrichment for Music Promotion',
    description: 'Transform chaotic contact spreadsheets into organised databases in minutes. Built by radio promoters for radio promoters. BBC Radio 1 + Spotify case studies proven.',
    url: 'https://intel.totalaudiopromo.com',
    siteName: 'Audio Intel',
    images: [
      {
        url: 'https://intel.totalaudiopromo.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Audio Intel - Transform 15 hours of contact research into 15 minutes',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Intel – 15 Hours to 15 Minutes | Contact Enrichment',
    description: 'Transform chaotic contact spreadsheets into organised databases. BBC Radio 1 + Spotify case studies proven. Built by radio promoters.',
    images: ['https://intel.totalaudiopromo.com/og-image.jpg'],
    site: '@totalaudiopromo',
    creator: '@chrisschouk',
  },
  other: {
    // LinkedIn specific meta tags
    'linkedin:owner': 'chris-schofield-audio',
    'article:author': 'Chris Schofield',
    'article:publisher': 'https://intel.totalaudiopromo.com',
    // Additional social media optimization
    'fb:app_id': '1234567890', // Replace with your Facebook App ID if you have one
    'application-name': 'Audio Intel',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
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
