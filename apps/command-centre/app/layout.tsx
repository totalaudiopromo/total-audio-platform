import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './mobile-optimizations.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Command Centre - Total Audio Promo',
  description: 'Main dashboard for Total Audio Promo tools and services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
