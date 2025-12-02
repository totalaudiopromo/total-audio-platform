import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pro Dashboard | Total Audio Promo',
  description:
    'Unified dashboard for indie artists - connect Intel, Pitch, and Tracker in one place',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 ml-64">
            <TopBar />
            <main className="min-h-[calc(100vh-64px)] p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
