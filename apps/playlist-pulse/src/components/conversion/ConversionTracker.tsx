'use client';

import React, { useEffect } from 'react';
import { useConversionOptimizer, useSession } from '@/lib/conversion-optimizer';
import { useRouter } from 'next/navigation';

interface ConversionTrackerProps {
  children: React.ReactNode;
}

/**
 * ConversionTracker wraps the entire application to handle:
 * - Automatic page view tracking
 * - Scroll depth tracking
 * - Time on page tracking
 * - Exit intent tracking
 * - Form interaction tracking
 */
export default function ConversionTracker({ children }: ConversionTrackerProps) {
  const { sessionId } = useSession();
  const { trackEvent } = useConversionOptimizer();
  const router = useRouter();

  useEffect(() => {
    const startTime = Date.now();
    let maxScrollDepth = 0;
    let hasTrackedMidpoint = false;
    let hasTrackedMostContent = false;

    // Scroll depth tracking
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track key scroll milestones
        if (scrollPercent >= 50 && !hasTrackedMidpoint) {
          hasTrackedMidpoint = true;
          trackEvent({
            eventType: 'page_view',
            variantId: 'scroll-tracking',
            testId: 'engagement-metrics',
            sessionId,
            metadata: { scrollDepth: 50, milestone: 'midpoint' }
          });
        }
        
        if (scrollPercent >= 80 && !hasTrackedMostContent) {
          hasTrackedMostContent = true;
          trackEvent({
            eventType: 'page_view',
            variantId: 'scroll-tracking',
            testId: 'engagement-metrics',
            sessionId,
            metadata: { scrollDepth: 80, milestone: 'most_content' }
          });
        }
      }
    };

    // Time on page tracking
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      trackEvent({
        eventType: 'page_view',
        variantId: 'time-tracking',
        testId: 'engagement-metrics',
        sessionId,
        metadata: { timeOnPage: timeSpent, maxScrollDepth }
      });
    };

    // Exit intent tracking (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        
        trackEvent({
          eventType: 'page_view',
          variantId: 'exit-intent',
          testId: 'engagement-metrics',
          sessionId,
          metadata: { 
            exitIntent: true, 
            timeOnPage: timeSpent, 
            scrollDepth: maxScrollDepth 
          }
        });
      }
    };

    // Form field interaction tracking
    const handleFormFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const formType = target.closest('form')?.getAttribute('data-form-type') || 'unknown';
        const fieldName = target.getAttribute('name') || target.getAttribute('id') || 'unknown';
        
        trackEvent({
          eventType: 'signup_start',
          variantId: 'form-interaction',
          testId: 'conversion-funnel',
          sessionId,
          metadata: { formType, fieldName, action: 'focus' }
        });
      }
    };

    // CTA button tracking (automatic for buttons with data-cta attribute)
    const handleCtaClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const ctaButton = target.closest('[data-cta]');
      
      if (ctaButton) {
        const ctaType = ctaButton.getAttribute('data-cta');
        const ctaText = ctaButton.textContent?.trim() || '';
        const position = ctaButton.getAttribute('data-position') || 'unknown';
        
        trackEvent({
          eventType: 'cta_click',
          variantId: 'cta-tracking',
          testId: 'conversion-funnel',
          sessionId,
          metadata: { ctaType, ctaText, position }
        });
      }
    };

    // Video/demo interaction tracking
    const handleVideoPlay = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      const videoId = target.getAttribute('data-video-id') || 'unknown';
      
      trackEvent({
        eventType: 'page_view',
        variantId: 'video-interaction',
        testId: 'engagement-metrics',
        sessionId,
        metadata: { videoId, action: 'play' }
      });
    };

    // Pricing card hover tracking
    const handlePricingHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pricingCard = target.closest('[data-pricing-plan]');
      
      if (pricingCard) {
        const planName = pricingCard.getAttribute('data-pricing-plan');
        
        trackEvent({
          eventType: 'plan_hover',
          variantId: 'pricing-interaction',
          testId: 'conversion-funnel',
          sessionId,
          metadata: { planName }
        });
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('focusin', handleFormFocus);
    document.addEventListener('click', handleCtaClick);
    document.addEventListener('play', handleVideoPlay, true);
    document.addEventListener('mouseenter', handlePricingHover, true);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('focusin', handleFormFocus);
      document.removeEventListener('click', handleCtaClick);
      document.removeEventListener('play', handleVideoPlay, true);
      document.removeEventListener('mouseenter', handlePricingHover, true);
      
      // Track final session stats
      trackTimeOnPage();
    };
  }, [sessionId, trackEvent]);

  // Track route changes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackEvent({
        eventType: 'page_view',
        variantId: 'navigation',
        testId: 'user-journey',
        sessionId,
        metadata: { url, source: 'route_change' }
      });
    };

    // This is a simplified version - in a real Next.js app you'd use router events
    // router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      // router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [sessionId, trackEvent, router]);

  return <>{children}</>;
}

// Utility component for manual conversion tracking
interface ConversionEventProps {
  eventType: 'signup_start' | 'signup_complete' | 'payment_complete';
  metadata?: Record<string, any>;
  children?: React.ReactNode;
}

export function ConversionEvent({ eventType, metadata, children }: ConversionEventProps) {
  const { sessionId } = useSession();
  const { trackEvent } = useConversionOptimizer();

  useEffect(() => {
    trackEvent({
      eventType,
      variantId: 'manual-tracking',
      testId: 'conversion-funnel',
      sessionId,
      metadata
    });
  }, [eventType, metadata, sessionId, trackEvent]);

  return <>{children}</>;
}

// HOC for wrapping components that need conversion tracking
export function withConversionTracking<T extends object>(
  Component: React.ComponentType<T>,
  trackingConfig: {
    testId: string;
    variantId: string;
    eventType: string;
    metadata?: Record<string, any>;
  }
) {
  return function WrappedComponent(props: T) {
    const { sessionId } = useSession();
    const { trackEvent } = useConversionOptimizer();

    useEffect(() => {
      trackEvent({
        eventType: trackingConfig.eventType as any,
        variantId: trackingConfig.variantId,
        testId: trackingConfig.testId,
        sessionId,
        metadata: trackingConfig.metadata
      });
    }, [sessionId, trackEvent]);

    return <Component {...props} />;
  };
}

// Custom hook for manual event tracking
export function useConversionTracking() {
  const { sessionId } = useSession();
  const { trackEvent } = useConversionOptimizer();

  const track = (
    eventType: 'page_view' | 'pricing_view' | 'plan_hover' | 'cta_click' | 'signup_start' | 'signup_complete' | 'payment_complete',
    testId: string,
    variantId: string,
    metadata?: Record<string, any>
  ) => {
    trackEvent({
      eventType,
      variantId,
      testId,
      sessionId,
      metadata
    });
  };

  return { track, sessionId };
}