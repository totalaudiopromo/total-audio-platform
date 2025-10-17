import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TrackerHeader } from "@/components/TrackerHeader";
import { TrackerFooter } from "@/components/TrackerFooter";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { CookieConsent } from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tracker.totalaudiopromo.com'),
  title: "Total Audio Tracker – Simple Campaign Tracking",
  description: "Simple campaign tracking for indie artists and radio promoters. Stop using spreadsheets.",
  openGraph: {
    title: "Total Audio Tracker – Simple Campaign Tracking",
    description: "Simple campaign tracking for indie artists and radio promoters. Stop using spreadsheets.",
    url: 'https://tracker.totalaudiopromo.com',
    siteName: 'Total Audio Tracker',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WZNJWDKH');
            `,
          }}
        />
      </head>
      <body className="relative min-h-screen font-sans overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZNJWDKH"
                  height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        <div className="flex min-h-screen flex-col bg-white">
          <TrackerHeader />
          <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">{children}</main>
          <TrackerFooter />
          <ExitIntentPopup />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
