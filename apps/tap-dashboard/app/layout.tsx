import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TAP Dashboard | Total Audio Promo',
  description: 'Unified intelligence dashboard for Total Audio Promo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-tap-black">
          <Sidebar />
          <div className="flex-1 ml-64">
            <TopBar />
            <main className="min-h-[calc(100vh-73px)]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
