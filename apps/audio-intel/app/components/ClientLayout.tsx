'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import MobileLayout from './MobileLayout';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import CookieConsent from 'react-cookie-consent';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Demo page has its own custom header, so exclude it from the global header
  const showGlobalHeader = pathname !== '/demo';

  return (
    <MobileLayout>
      <div className="flex min-h-screen flex-col bg-white">
        {showGlobalHeader && <SiteHeader />}
        <main className={showGlobalHeader ? "flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16" : "flex-1"}>{children}</main>
        <SiteFooter />
        <ExitIntentPopup />

        {/* GDPR Cookie Consent */}
        <CookieConsent
          location="bottom"
          buttonText="Accept All Cookies"
          declineButtonText="Decline"
          enableDeclineButton
          cookieName="audio-intel-cookie-consent"
          style={{
            background: "white",
            borderTop: "4px solid black",
            boxShadow: "0 -4px 0px 0px rgba(0, 0, 0, 1)",
            padding: "20px",
            alignItems: "center",
          }}
          buttonStyle={{
            background: "#1E88E5",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "2px solid black",
            boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)",
          }}
          declineButtonStyle={{
            background: "white",
            color: "#1F2937",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "2px solid black",
            boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)",
          }}
          contentStyle={{
            color: "#1F2937",
            fontSize: "14px",
            fontWeight: "500",
            margin: "0",
            flex: "1 0 300px",
          }}
          expires={365}
          onAccept={() => {
            // Enable Google Analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('consent', 'update', {
                'analytics_storage': 'granted'
              });
            }
          }}
          onDecline={() => {
            // Disable Google Analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('consent', 'update', {
                'analytics_storage': 'denied'
              });
            }
          }}
        >
          <span className="font-bold">We use cookies to improve your experience.</span>{' '}
          Essential cookies are always enabled. By clicking &quot;Accept All Cookies&quot;, you agree to our{' '}
          <Link href="/cookies" className="underline font-bold hover:text-blue-600">
            Cookie Policy
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline font-bold hover:text-blue-600">
            Privacy Policy
          </Link>.
        </CookieConsent>
      </div>
    </MobileLayout>
  );
} 