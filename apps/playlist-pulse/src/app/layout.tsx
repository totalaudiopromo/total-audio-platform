import type { Metadata } from "next";
// Google Fonts disabled for build - using system fonts
// import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = {
  variable: "--font-inter",
  className: "",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://pulse.totalaudiopromo.com'),
  title: "Playlist Pulse - AI-Powered Music Promotion | Total Audio Promo",
  description: "Upload your track and get personalized pitches for playlist curators. Get instant access to 50,000+ verified playlist curators with AI-powered pitch generation.",
  openGraph: {
    title: "Playlist Pulse - AI-Powered Music Promotion",
    description: "Upload your track and get personalized pitches for playlist curators",
    url: 'https://pulse.totalaudiopromo.com',
    siteName: 'Playlist Pulse - Total Audio Promo',
    images: [
      {
        url: '/assets/logo/t-a-p-new dog logo.png',
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
    title: "Playlist Pulse - AI-Powered Music Promotion",
    description: "Upload your track and get personalized pitches for playlist curators",
    images: ['/assets/logo/t-a-p-new dog logo.png'],
    site: '@totalaudiopromo',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Playlist Pulse - Total Audio Promo</title>
        <link rel="icon" href="/assets/logo/t-a-p-new dog logo.png" sizes="any" />
        <link rel="icon" href="/assets/logo/t-a-p-new dog logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/logo/t-a-p-new dog logo.png" />
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
      <body className={`${inter.variable} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
