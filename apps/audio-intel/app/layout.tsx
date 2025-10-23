import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./mobile-optimizations.css";
import "./beta-mobile.css";
import "./home-mobile.css";
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
  description: 'From 15 years in music PR to AI innovation. Transform chaos into intelligence with our founder-built platform for playlist curators, radio DJs, and music industry professionals.',
  metadataBase: new URL('https://intel.totalaudiopromo.com'),
  openGraph: {
    title: 'Audio Intel – AI-Powered Music Industry Contact Enrichment',
    description: 'Transform your music PR workflow. Get submission guidelines, contact preferences, and pitch-ready insights for the music industry.',
    url: 'https://intel.totalaudiopromo.com',
    siteName: 'Audio Intel - Total Audio Promo',
    images: [
      {
        url: '/images/total_audio_promo_logo_trans.png',
        width: 1200,
        height: 630,
        alt: 'Audio Intel by Total Audio Promo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Intel – AI-Powered Music Industry Contact Enrichment',
    description: 'Stop wasting 15 hours a week researching music contacts. Instantly enrich your email lists with AI-powered insights for playlist curators, radio DJs, and music bloggers.',
    images: ['/images/total_audio_promo_logo_trans.png'],
    site: '@totalaudiopromo',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Audio Intel - Total Audio Promo</title>
        <link rel="icon" href="/images/total_audio_promo_logo_trans.png" sizes="any" />
        <link rel="icon" href="/images/total_audio_promo_logo_trans.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/total_audio_promo_logo_trans.png" />
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Audio Intel',
              applicationCategory: 'BusinessApplication',
              description: 'AI-Powered Music Industry Contact Enrichment Platform',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'GBP',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                ratingCount: '100',
              },
              operatingSystem: 'Web Browser',
              provider: {
                '@type': 'Organization',
                name: 'Total Audio Promo',
                url: 'https://totalaudiopromo.com',
                logo: 'https://intel.totalaudiopromo.com/images/total_audio_promo_logo_trans.png',
                founder: {
                  '@type': 'Person',
                  name: 'Chris Schofield',
                  jobTitle: 'Founder',
                },
              },
            }),
          }}
        />
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
