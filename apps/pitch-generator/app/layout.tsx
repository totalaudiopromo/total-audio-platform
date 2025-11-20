import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { WorkspaceProvider } from '@total-audio/core-db/contexts/workspace-context';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { ExitIntentPopup, CookieBanner } from '@/components/ClientOnlyComponents';
import { defaultMetadata } from './metadata';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="bg-background">
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WZNJWDKH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <AuthProvider>
          <WorkspaceProvider>
            <div className="flex min-h-screen flex-col bg-white">
              <ConditionalLayout>{children}</ConditionalLayout>
              <ExitIntentPopup />
              <CookieBanner />
            </div>
          </WorkspaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
