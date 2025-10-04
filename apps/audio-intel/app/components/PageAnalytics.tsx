'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/utils/analytics';

interface PageAnalyticsProps {
  pageName: string;
  pageType?: 'pseo' | 'landing' | 'product' | 'marketing';
  customData?: Record<string, any>;
}

export function PageAnalytics({ pageName, pageType = 'landing', customData = {} }: PageAnalyticsProps) {
  useEffect(() => {
    // Get referrer and UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;

    // Determine if organic traffic
    const isOrganic = !referrer ||
                     referrer.includes('google') ||
                     referrer.includes('bing') ||
                     referrer.includes('duckduckgo') ||
                     referrer.includes('yahoo');

    // Build tracking data
    const trackingData = {
      page_type: pageType,
      page_title: document.title,
      referrer: referrer || 'direct',
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      organic: isOrganic,
      device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      ...customData
    };

    // Track page view
    trackPageView(pageName, document.title);

    // Also send to GTM dataLayer if available
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'page_view',
        page_name: pageName,
        ...trackingData
      });
    }
  }, [pageName, pageType, customData]);

  return null; // This component doesn't render anything
}
