// Comprehensive analytics and conversion tracking
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
  timestamp?: string;
  user_id?: string;
  session_id?: string;
}

export interface ConversionFunnelStep {
  step: string;
  step_number: number;
  user_action: string;
  page_url: string;
  timestamp: string;
  user_id?: string;
  session_id?: string;
  metadata?: Record<string, any>;
}

// Google Analytics 4 event tracking
export function trackGA4Event(eventData: AnalyticsEvent) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventData.event, {
      event_category: eventData.category,
      event_label: eventData.label,
      value: eventData.value,
      custom_parameters: eventData.custom_parameters,
      user_id: eventData.user_id,
      session_id: eventData.session_id
    });
  }
}

// Internal analytics API tracking
export async function trackInternalEvent(eventData: AnalyticsEvent) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...eventData,
        timestamp: eventData.timestamp || new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        referrer: document.referrer
      })
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
}

// Combined tracking function
export function trackEvent(eventData: AnalyticsEvent) {
  trackGA4Event(eventData);
  trackInternalEvent(eventData);
}

// Conversion funnel tracking
export function trackFunnelStep(step: ConversionFunnelStep) {
  const eventData: AnalyticsEvent = {
    event: 'conversion_funnel',
    category: 'funnel',
    action: step.user_action,
    label: step.step,
    value: step.step_number,
    custom_parameters: {
      funnel_step: step.step,
      step_number: step.step_number,
      page_url: step.page_url,
      metadata: step.metadata
    },
    user_id: step.user_id,
    session_id: step.session_id
  };
  
  trackEvent(eventData);
}

// Specific event tracking functions
export function trackPageView(page: string, title?: string) {
  trackEvent({
    event: 'page_view',
    category: 'engagement',
    action: 'view',
    label: page,
    custom_parameters: {
      page_title: title || document.title,
      page_url: window.location.href
    }
  });
}

export function trackFileUpload(fileType: string, contactCount: number, fileSize?: number) {
  trackEvent({
    event: 'file_upload',
    category: 'engagement',
    action: 'upload',
    label: fileType,
    value: contactCount,
    custom_parameters: {
      file_type: fileType,
      contact_count: contactCount,
      file_size: fileSize
    }
  });
}

export function trackEnrichmentStart(contactCount: number, userEmail?: string) {
  trackEvent({
    event: 'enrichment_start',
    category: 'engagement',
    action: 'start',
    label: 'contact_enrichment',
    value: contactCount,
    custom_parameters: {
      contact_count: contactCount,
      user_email: userEmail
    }
  });
}

export function trackEnrichmentComplete(contactCount: number, processingTime: number, successRate: number) {
  trackEvent({
    event: 'enrichment_complete',
    category: 'conversion',
    action: 'complete',
    label: 'contact_enrichment',
    value: contactCount,
    custom_parameters: {
      contact_count: contactCount,
      processing_time: processingTime,
      success_rate: successRate
    }
  });
}

export function trackExport(format: string, enrichedCount: number, fields: string[]) {
  trackEvent({
    event: 'export',
    category: 'conversion',
    action: 'export',
    label: format,
    value: enrichedCount,
    custom_parameters: {
      export_format: format,
      enriched_count: enrichedCount,
      fields_exported: fields
    }
  });
}

export function trackBetaSignup(source: string, userData: any) {
  trackEvent({
    event: 'beta_signup',
    category: 'conversion',
    action: 'signup',
    label: source,
    custom_parameters: {
      signup_source: source,
      user_data: userData
    }
  });
}

export function trackPricingClick(plan: string, billing: string, location: string) {
  trackEvent({
    event: 'pricing_click',
    category: 'conversion',
    action: 'click',
    label: `${plan}_${billing}`,
    custom_parameters: {
      plan: plan,
      billing: billing,
      location: location
    }
  });
}

export function trackCheckoutStart(plan: string, billing: string, email: string) {
  trackEvent({
    event: 'checkout_start',
    category: 'conversion',
    action: 'start',
    label: `${plan}_${billing}`,
    custom_parameters: {
      plan: plan,
      billing: billing,
      user_email: email
    }
  });
}

export function trackCheckoutComplete(plan: string, billing: string, amount: number) {
  trackEvent({
    event: 'purchase',
    category: 'conversion',
    action: 'purchase',
    label: `${plan}_${billing}`,
    value: amount,
    custom_parameters: {
      plan: plan,
      billing: billing,
      amount: amount
    }
  });
}

export function trackError(errorType: string, details: string, context?: string) {
  trackEvent({
    event: 'error',
    category: 'error',
    action: 'occurred',
    label: errorType,
    custom_parameters: {
      error_type: errorType,
      error_details: details,
      error_context: context
    }
  });
}

export function trackDemoRun(email: string, result: string) {
  trackEvent({
    event: 'demo_run',
    category: 'engagement',
    action: 'run',
    label: 'instant_demo',
    custom_parameters: {
      demo_email: email,
      demo_result: result
    }
  });
}

// Conversion funnel steps
export const FUNNEL_STEPS = {
  LANDING_PAGE: 'landing_page',
  DEMO_INTERACTION: 'demo_interaction',
  BETA_SIGNUP: 'beta_signup',
  FILE_UPLOAD: 'file_upload',
  ENRICHMENT_START: 'enrichment_start',
  ENRICHMENT_COMPLETE: 'enrichment_complete',
  EXPORT: 'export',
  PRICING_VIEW: 'pricing_view',
  CHECKOUT_START: 'checkout_start',
  PURCHASE: 'purchase'
} as const;

// Track funnel progression
export function trackFunnelProgression(step: keyof typeof FUNNEL_STEPS, metadata?: Record<string, any>) {
  const stepNumber = Object.keys(FUNNEL_STEPS).indexOf(step) + 1;
  
  trackFunnelStep({
    step: FUNNEL_STEPS[step],
    step_number: stepNumber,
    user_action: step.toLowerCase().replace(/_/g, ' '),
    page_url: window.location.href,
    timestamp: new Date().toISOString(),
    metadata
  });
}

// Performance tracking
export function trackPerformance(metric: string, value: number, unit: string = 'ms') {
  trackEvent({
    event: 'performance',
    category: 'performance',
    action: 'measure',
    label: metric,
    value: value,
    custom_parameters: {
      metric: metric,
      unit: unit
    }
  });
}

// User engagement tracking
export function trackEngagement(action: string, element: string, value?: any) {
  trackEvent({
    event: 'engagement',
    category: 'user_interaction',
    action: action,
    label: element,
    custom_parameters: {
      element: element,
      value: value
    }
  });
}

// A/B testing support
export function trackABTest(testName: string, variant: string, action: string) {
  trackEvent({
    event: 'ab_test',
    category: 'experiment',
    action: action,
    label: testName,
    custom_parameters: {
      test_name: testName,
      variant: variant
    }
  });
}













