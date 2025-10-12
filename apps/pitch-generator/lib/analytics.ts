/**
 * Analytics utility for Plausible custom events
 * Tracks user interactions and conversions throughout the app
 */

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        props?: Record<string, string | number | boolean>;
        callback?: () => void;
      }
    ) => void;
  }
}

export type AnalyticsEvent =
  | 'pitch_generated'
  | 'pitch_copied'
  | 'pitch_regenerated'
  | 'upgrade_clicked'
  | 'onboarding_step_completed'
  | 'contact_added'
  | 'contact_imported'
  | 'voice_profile_created'
  | 'voice_profile_updated'
  | 'template_selected'
  | 'batch_generation_started'
  | 'signup_completed'
  | 'login_completed'
  | 'pricing_viewed'
  | 'checkout_started'
  | 'newsletter_signup'
  | 'usage_limit_reached'
  | 'form_validation_error';

interface EventProperties {
  [key: string]: string | number | boolean;
}

/**
 * Track a custom event in Plausible Analytics
 * @param eventName - Name of the event to track
 * @param properties - Optional properties to attach to the event
 * @param callback - Optional callback to execute after tracking
 */
export function trackEvent(
  eventName: AnalyticsEvent,
  properties?: EventProperties,
  callback?: () => void
): void {
  // Check if Plausible is loaded
  if (typeof window === 'undefined' || !window.plausible) {
    console.warn('[Analytics] Plausible not loaded, skipping event:', eventName);
    if (callback) callback();
    return;
  }

  try {
    window.plausible(eventName, {
      props: properties,
      callback,
    });
    console.log('[Analytics] Event tracked:', eventName, properties);
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
    if (callback) callback();
  }
}

/**
 * Track a pitch generation event
 * @param genre - Genre of the generated pitch
 * @param contactType - Type of contact (radio, blog, playlist, etc.)
 */
export function trackPitchGenerated(genre: string, contactType?: string): void {
  trackEvent('pitch_generated', {
    genre,
    ...(contactType && { contact_type: contactType }),
  });
}

/**
 * Track when a user copies a pitch to clipboard
 * @param pitchId - ID of the copied pitch
 */
export function trackPitchCopied(pitchId: string): void {
  trackEvent('pitch_copied', { pitch_id: pitchId });
}

/**
 * Track when a user regenerates a pitch
 * @param pitchId - ID of the regenerated pitch
 */
export function trackPitchRegenerated(pitchId: string): void {
  trackEvent('pitch_regenerated', { pitch_id: pitchId });
}

/**
 * Track when upgrade CTA is clicked
 * @param source - Where the upgrade button was clicked from
 * @param tier - Target pricing tier
 */
export function trackUpgradeClicked(source: string, tier?: string): void {
  trackEvent('upgrade_clicked', {
    source,
    ...(tier && { tier }),
  });
}

/**
 * Track onboarding step completion
 * @param step - Name of the completed step
 * @param stepNumber - Order number of the step (1, 2, 3, etc.)
 */
export function trackOnboardingStep(step: string, stepNumber: number): void {
  trackEvent('onboarding_step_completed', {
    step,
    step_number: stepNumber,
  });
}

/**
 * Track when a contact is added
 * @param source - How the contact was added (manual, import, audio_intel)
 */
export function trackContactAdded(source: 'manual' | 'import' | 'audio_intel'): void {
  trackEvent('contact_added', { source });
}

/**
 * Track when contacts are imported
 * @param count - Number of contacts imported
 * @param source - Import source (csv, audio_intel, etc.)
 */
export function trackContactImported(count: number, source: string): void {
  trackEvent('contact_imported', { count, source });
}

/**
 * Track voice profile creation
 */
export function trackVoiceProfileCreated(): void {
  trackEvent('voice_profile_created');
}

/**
 * Track voice profile update
 */
export function trackVoiceProfileUpdated(): void {
  trackEvent('voice_profile_updated');
}

/**
 * Track template selection
 * @param templateType - Type of template selected
 */
export function trackTemplateSelected(templateType: string): void {
  trackEvent('template_selected', { template_type: templateType });
}

/**
 * Track batch generation start
 * @param contactCount - Number of contacts in the batch
 */
export function trackBatchGenerationStarted(contactCount: number): void {
  trackEvent('batch_generation_started', { contact_count: contactCount });
}

/**
 * Track newsletter signup
 * @param source - Where the signup form was (footer, dashboard, popup, etc.)
 */
export function trackNewsletterSignup(source: string): void {
  trackEvent('newsletter_signup', { source });
}

/**
 * Track when user hits free tier usage limit
 * @param currentUsage - Current pitch count
 */
export function trackUsageLimitReached(currentUsage: number): void {
  trackEvent('usage_limit_reached', { current_usage: currentUsage });
}

/**
 * Track form validation errors
 * @param formName - Name of the form with validation error
 * @param field - Field that failed validation
 */
export function trackFormValidationError(formName: string, field: string): void {
  trackEvent('form_validation_error', {
    form: formName,
    field,
  });
}

/**
 * Track pricing page view
 * @param source - Where user came from
 */
export function trackPricingViewed(source?: string): void {
  trackEvent('pricing_viewed', {
    ...(source && { source }),
  });
}

/**
 * Track checkout start
 * @param tier - Selected pricing tier
 * @param billing - Billing cycle (monthly/annual)
 */
export function trackCheckoutStarted(tier: string, billing: 'monthly' | 'annual'): void {
  trackEvent('checkout_started', { tier, billing });
}
