import type { Metadata } from 'next';
import { jakarta, inter, mono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Liberty Music PR - Campaign Dashboard',
  description: 'Demo dashboard integrating Audio Intel, Pitch Generator, and Campaign Tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${mono.variable}`}>
      <body className="font-sans bg-[#F7F6F2] text-[#111] antialiased">{children}</body>
    </html>
  );
}
