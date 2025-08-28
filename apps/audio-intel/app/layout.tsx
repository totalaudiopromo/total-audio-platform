import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: 'Audio Intel – AI-Powered Music Industry Contact Enrichment | Total Audio Promo',
  description: 'Stop wasting 15 hours a week researching music contacts. Instantly enrich your email lists with AI-powered insights for playlist curators, radio DJs, and music bloggers. Try Audio Intel for free.',
  openGraph: {
    title: 'Audio Intel – AI-Powered Music Industry Contact Enrichment',
    description: 'Transform your music PR workflow. Get submission guidelines, contact preferences, and pitch-ready insights for the music industry.',
    url: 'https://audiointel.com',
    siteName: 'Audio Intel - Total Audio Promo',
    images: [
      {
        url: '/t-a-p-new dog logo.png',
        width: 512,
        height: 512,
        alt: 'Total Audio Promo Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Intel – AI-Powered Music Industry Contact Enrichment',
    description: 'Stop wasting 15 hours a week researching music contacts. Instantly enrich your email lists with AI-powered insights for playlist curators, radio DJs, and music bloggers.',
    images: ['/t-a-p-new dog logo.png'],
    site: '@totalaudiopromo',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Audio Intel - Total Audio Promo</title>
        <link rel="icon" href="/t-a-p-new dog logo.png" sizes="any" />
        <link rel="icon" href="/t-a-p-new dog logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/t-a-p-new dog logo.png" />
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-J8JF92KJN9"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J8JF92KJN9');
            `,
          }}
        />
      </head>
      <body
        className="relative min-h-screen font-sans overflow-x-hidden"
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
