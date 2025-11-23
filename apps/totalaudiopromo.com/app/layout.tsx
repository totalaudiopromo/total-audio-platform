/**
 * Root layout for totalaudiopromo.com
 */

import './globals.css';

export const metadata = {
  title: 'Creative Intelligence Studio - Total Audio',
  description: 'AI-powered creative tools for music promotion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
