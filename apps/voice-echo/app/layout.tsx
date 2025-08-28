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
  title: 'Voice Echo – AI-Powered Content Creation for Musicians | Total Audio Promo',
  description: 'Stop posting generic AI content. Voice Echo learns your authentic voice and creates platform-optimized social media posts for X, Instagram, Threads & TikTok that sound exactly like you.',
  openGraph: {
    title: 'Voice Echo – AI-Powered Content Creation for Musicians',
    description: 'Your authentic voice, amplified across every platform. Generate platform-perfect social media posts that sound exactly like you.',
    url: 'https://voice.totalaudiopromo.com',
    siteName: 'Voice Echo - Total Audio Promo',
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
    title: 'Voice Echo – AI-Powered Content Creation for Musicians',
    description: 'Stop posting generic AI content. Voice Echo learns your authentic voice and creates platform-optimized social media posts for X, Instagram, Threads & TikTok.',
    images: ['/t-a-p-new dog logo.png'],
    site: '@totalaudiopromo',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Voice Echo - Total Audio Promo</title>
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
