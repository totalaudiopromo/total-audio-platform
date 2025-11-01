import { createClient } from '@supabase/supabase-js';

/**
 * Event tracking helpers for Audio Intel
 * Provides simple API for tracking user actions and system events
 */

// Event categories for organization
export const EventCategory = {
  USER_ACTION: 'user_action',
  SYSTEM: 'system',
  REVENUE: 'revenue',
  FEATURE_USAGE: 'feature_usage',
  PERFORMANCE: 'performance',
  ERROR: 'error',
} as const;

export type EventCategoryType = (typeof EventCategory)[keyof typeof EventCategory];

// Common event names
export const EventName = {
  // User lifecycle
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',

  // Contact enrichment
  ENRICHMENT_STARTED: 'enrichment_started',
  ENRICHMENT_COMPLETED: 'enrichment_completed',
  ENRICHMENT_FAILED: 'enrichment_failed',

  // Exports
  EXPORT_CSV_STARTED: 'export_csv_started',
  EXPORT_CSV_COMPLETED: 'export_csv_completed',
  EXPORT_JSON_STARTED: 'export_json_started',
  EXPORT_JSON_COMPLETED: 'export_json_completed',
  EXPORT_TRACKER_STARTED: 'export_tracker_started',
  EXPORT_TRACKER_COMPLETED: 'export_tracker_completed',

  // Search
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_FAILED: 'search_failed',

  // Payment events
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_FAILED: 'checkout_failed',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // Feature usage
  FEATURE_USED: 'feature_used',
  FEATURE_ENABLED: 'feature_enabled',
  FEATURE_DISABLED: 'feature_disabled',

  // Performance
  PAGE_LOAD: 'page_load',
  API_REQUEST: 'api_request',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
} as const;

export type EventNameType = (typeof EventName)[keyof typeof EventName];

// Event properties interface
export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

// Track event parameters
export interface TrackEventParams {
  eventName: string;
  eventCategory: EventCategoryType;
  userId?: string;
  properties?: EventProperties;
  durationMs?: number;
  status?: 'success' | 'failed' | 'pending';
  errorMessage?: string;
  requestIp?: string;
  userAgent?: string;
  referrer?: string;
}

/**
 * Get Supabase client (server-side only)
 * For client-side, use the Supabase client from @supabase/auth-helpers-nextjs
 */
function getSupabaseClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Metrics tracking should only be used server-side');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Track an event (server-side only)
 *
 * @example
 * ```typescript
 * await trackEvent({
 *   eventName: EventName.ENRICHMENT_COMPLETED,
 *   eventCategory: EventCategory.FEATURE_USAGE,
 *   userId: user.id,
 *   properties: {
 *     contact_count: 5,
 *     source: 'csv_upload'
 *   },
 *   durationMs: 1250,
 *   status: 'success'
 * });
 * ```
 */
export async function trackEvent(params: TrackEventParams): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    const eventData = {
      event_name: params.eventName,
      event_category: params.eventCategory,
      app_name: 'audio-intel',
      user_id: params.userId || null,
      properties: params.properties || {},
      duration_ms: params.durationMs || null,
      status: params.status || 'success',
      error_message: params.errorMessage || null,
      request_ip: params.requestIp || null,
      user_agent: params.userAgent || null,
      referrer: params.referrer || null,
    };

    const { error } = await supabase.from('events').insert(eventData);

    if (error) {
      console.error('❌ Failed to track event:', error);
    } else {
      console.log(`📊 Event tracked: ${params.eventName} (${params.eventCategory})`);
    }
  } catch (error) {
    console.error('❌ Event tracking error:', error);
  }
}

/**
 * Track enrichment start
 */
export async function trackEnrichmentStart(params: {
  userId: string;
  contactCount: number;
  source: string;
}): Promise<void> {
  await trackEvent({
    eventName: EventName.ENRICHMENT_STARTED,
    eventCategory: EventCategory.FEATURE_USAGE,
    userId: params.userId,
    properties: {
      contact_count: params.contactCount,
      source: params.source,
    },
    status: 'pending',
  });
}

/**
 * Track enrichment completion
 */
export async function trackEnrichmentComplete(params: {
  userId: string;
  contactCount: number;
  successCount: number;
  durationMs: number;
  source: string;
}): Promise<void> {
  await trackEvent({
    eventName: EventName.ENRICHMENT_COMPLETED,
    eventCategory: EventCategory.FEATURE_USAGE,
    userId: params.userId,
    properties: {
      contact_count: params.contactCount,
      success_count: params.successCount,
      success_rate: (params.successCount / params.contactCount) * 100,
      source: params.source,
    },
    durationMs: params.durationMs,
    status: 'success',
  });
}

/**
 * Track enrichment failure
 */
export async function trackEnrichmentFailed(params: {
  userId: string;
  contactCount: number;
  errorMessage: string;
  durationMs: number;
}): Promise<void> {
  await trackEvent({
    eventName: EventName.ENRICHMENT_FAILED,
    eventCategory: EventCategory.FEATURE_USAGE,
    userId: params.userId,
    properties: {
      contact_count: params.contactCount,
    },
    durationMs: params.durationMs,
    status: 'failed',
    errorMessage: params.errorMessage,
  });
}

/**
 * Track export event
 */
export async function trackExport(params: {
  userId: string;
  exportType: 'csv' | 'json' | 'tracker';
  contactCount: number;
  durationMs: number;
}): Promise<void> {
  const eventMap = {
    csv: EventName.EXPORT_CSV_COMPLETED,
    json: EventName.EXPORT_JSON_COMPLETED,
    tracker: EventName.EXPORT_TRACKER_COMPLETED,
  };

  await trackEvent({
    eventName: eventMap[params.exportType],
    eventCategory: EventCategory.FEATURE_USAGE,
    userId: params.userId,
    properties: {
      export_type: params.exportType,
      contact_count: params.contactCount,
    },
    durationMs: params.durationMs,
    status: 'success',
  });
}

/**
 * Track user signup
 */
export async function trackUserSignup(params: {
  userId: string;
  email: string;
  source?: string;
}): Promise<void> {
  await trackEvent({
    eventName: EventName.USER_SIGNED_UP,
    eventCategory: EventCategory.USER_ACTION,
    userId: params.userId,
    properties: {
      email: params.email,
      source: params.source || 'organic',
    },
    status: 'success',
  });
}

/**
 * Track checkout started
 */
export async function trackCheckoutStarted(params: {
  userId: string;
  planName: string;
  amountCents: number;
}): Promise<void> {
  await trackEvent({
    eventName: EventName.CHECKOUT_STARTED,
    eventCategory: EventCategory.REVENUE,
    userId: params.userId,
    properties: {
      plan_name: params.planName,
      amount_cents: params.amountCents,
      currency: 'gbp',
    },
    status: 'pending',
  });
}

/**
 * Track checkout completed
 */
export async function trackCheckoutCompleted(params: {
  userId: string;
  planName: string;
  amountCents: number;
  paymentId: string;
}): Promise<void> {
  await trackEvent({
    eventName: EventName.CHECKOUT_COMPLETED,
    eventCategory: EventCategory.REVENUE,
    userId: params.userId,
    properties: {
      plan_name: params.planName,
      amount_cents: params.amountCents,
      currency: 'gbp',
      payment_id: params.paymentId,
    },
    status: 'success',
  });
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(params: {
  userId: string;
  featureName: string;
  properties?: EventProperties;
}): Promise<void> {
  await trackEvent({
    eventName: EventName.FEATURE_USED,
    eventCategory: EventCategory.FEATURE_USAGE,
    userId: params.userId,
    properties: {
      feature_name: params.featureName,
      ...params.properties,
    },
    status: 'success',
  });
}

/**
 * Increment usage counter (server-side only)
 * Uses the increment_usage_counter() database function for atomic updates
 */
export async function incrementUsageCounter(params: {
  userId: string;
  date: string; // Format: YYYY-MM-DD
  enrichmentsCount?: number;
  searchesCount?: number;
  exportsCount?: number;
  sessionsCount?: number;
  sessionDurationMs?: number;
}): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.rpc('increment_usage_counter', {
      p_user_id: params.userId,
      p_date: params.date,
      p_app_name: 'audio-intel',
      p_enrichments_count: params.enrichmentsCount || 0,
      p_searches_count: params.searchesCount || 0,
      p_exports_count: params.exportsCount || 0,
      p_sessions_count: params.sessionsCount || 0,
      p_session_duration_ms: params.sessionDurationMs || 0,
    });

    if (error) {
      console.error('❌ Failed to increment usage counter:', error);
    } else {
      console.log(`📊 Usage counter incremented for user ${params.userId}`);
    }
  } catch (error) {
    console.error('❌ Usage counter error:', error);
  }
}

/**
 * Helper to get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Helper to extract request metadata from Next.js request
 */
export function getRequestMetadata(req: Request): {
  requestIp?: string;
  userAgent?: string;
  referrer?: string;
} {
  return {
    requestIp: req.headers.get('x-forwarded-for') || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
    referrer: req.headers.get('referer') || undefined,
  };
}
