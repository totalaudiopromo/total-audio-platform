import { Metadata } from 'next';

export const siteConfig = {
  name: 'Pitch Generator',
  description:
    'Write 50 personalised music PR pitches in 20 minutes. AI-powered pitch writing for artists, managers, and radio promoters. Built by a producer with 5+ years music PR experience.',
  url: 'https://pitch.totalaudiopromo.com',
  ogImage: '/og-pitch-generator.png',
  keywords: [
    'music PR pitches',
    'radio promotion pitches',
    'AI pitch writer',
    'music PR automation',
    'independent artist PR',
    'radio plugger tools',
    'music blog pitches',
    'playlist pitching tool',
    'music PR software',
    'radio promotion automation',
    'personalised music pitches',
    'AI music marketing',
    'pitch writing tool',
    'music promotion software',
    'artist pitch generator',
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - AI-Powered Music PR Pitches`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: 'Chris Schofield',
      url: 'https://totalaudiopromo.com',
    },
  ],
  creator: 'Total Audio Promo',
  publisher: 'Total Audio Promo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - AI-Powered Music PR Pitches`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@totalaudiopromo',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
