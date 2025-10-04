'use client';

import { useEffect, ReactNode } from 'react';
import { trackPageView } from '@/utils/analytics';

interface PSEOPageWrapperProps {
  children: ReactNode;
  pageName: string;
  topic: string;
  searchVolume: number;
  tier: number;
}

export function PSEOPageWrapper({ children, pageName, topic, searchVolume, tier }: PSEOPageWrapperProps) {
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

    // Build PSEO-specific tracking data
    const trackingData = {
      page_type: 'pseo',
      pseo_topic: topic,
      pseo_search_volume: searchVolume,
      pseo_tier: tier,
      page_title: document.title,
      referrer: referrer || 'direct',
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      organic: isOrganic,
      device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    };

    // Track page view
    trackPageView(pageName, document.title);

    // Also send to GTM dataLayer
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'pseo_page_view',
        page_name: pageName,
        ...trackingData
      });
    }

    // Track CTA clicks
    const trackCTAClick = (ctaType: string, ctaPosition: string) => {
      const ctaData = {
        event: 'pseo_cta_click',
        page_name: pageName,
        pseo_topic: topic,
        cta_type: ctaType,
        cta_position: ctaPosition
      };

      // Send to analytics API
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctaData)
      }).catch(() => {});

      // Send to GTM
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push(ctaData);
      }
    };

    // Add click tracking to all CTA links
    const ctaLinks = document.querySelectorAll('a[href*="/pricing"], a[href*="/upload"], a[href*="/demo"]');
    ctaLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const ctaType = href.includes('/pricing') ? 'pricing' :
                     href.includes('/upload') ? 'upload' :
                     href.includes('/demo') ? 'demo' : 'other';

      link.addEventListener('click', () => {
        const position = link.closest('section')?.id || 'unknown';
        trackCTAClick(ctaType, position);
      });
    });

  }, [pageName, topic, searchVolume, tier]);

  return <>{children}</>;
}
