import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SEO Audio Tool - Total Audio Promo',
  description:
    'Professional SEO analysis tool for audio and music websites. Optimize your music promotion, podcast, and audio content for search engines.',
  keywords: 'audio SEO, music SEO, podcast SEO, audio promotion, music marketing, SEO analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {children}
        </div>
      </body>
    </html>
  );
}
