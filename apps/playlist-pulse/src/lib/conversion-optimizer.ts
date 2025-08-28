/**
 * Playlist Pulse Landing Page Conversion Optimizer
 * 
 * A comprehensive A/B testing and conversion optimization system
 * for UK music producers and independent artists
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A/B Test Configuration Types
export interface ABTestConfig {
  testId: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  trafficSplit: number[]; // Percentage split for each variant
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  targetMetrics: string[];
}

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-100 percentage
  config: VariantConfig;
}

export interface VariantConfig {
  pricing?: PricingVariant;
  copy?: CopyVariant;
  urgency?: UrgencyVariant;
  badges?: BadgeVariant;
  layout?: LayoutVariant;
}

// Pricing Psychology Variants
export interface PricingVariant {
  strategy: 'monthly-focus' | 'annual-focus' | 'value-emphasis' | 'comparison';
  monthlyPrices: {
    starter: number;
    professional: number;
    agency: number;
  };
  annualDiscounts: {
    starter: number; // percentage
    professional: number;
    agency: number;
  };
  displayFormat: 'monthly-primary' | 'annual-primary' | 'toggle-default-monthly' | 'toggle-default-annual';
  currencySymbol: '£';
  valueProps: string[];
}

// Copy Variants for Music Producer Pain Points
export interface CopyVariant {
  headlines: {
    primary: string;
    secondary: string;
  };
  painPoints: {
    problem: string;
    solution: string;
    benefit: string;
  }[];
  cta: {
    primary: string;
    secondary: string;
  };
  socialProof: {
    testimonial: string;
    author: string;
    title: string;
  }[];
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
}

// Ethical Urgency Tactics
export interface UrgencyVariant {
  type: 'scarcity' | 'time-sensitive' | 'social-proof' | 'trend-based' | 'none';
  message: string;
  countdown?: {
    endTime: Date;
    format: 'days-hours' | 'hours-only' | 'text-only';
  };
  limitMessage?: string;
  socialProofCount?: number;
}

// Badge Placement Variants
export interface BadgeVariant {
  mostPopular: {
    enabled: boolean;
    position: 'top-right' | 'top-center' | 'header' | 'side-ribbon';
    plan: 'starter' | 'professional' | 'agency';
    text: string;
    color: 'yellow' | 'blue' | 'green' | 'gradient';
  };
  bestValue: {
    enabled: boolean;
    position: 'top-right' | 'top-center' | 'header' | 'side-ribbon';
    plan: 'starter' | 'professional' | 'agency';
    text: string;
  };
}

// Layout Variants
export interface LayoutVariant {
  pricingPosition: 'hero' | 'section-2' | 'section-3' | 'bottom';
  testimonialCount: number;
  featureDisplayStyle: 'grid' | 'list' | 'accordion' | 'tabs';
  ctaStyle: 'single' | 'multiple' | 'sticky' | 'popup';
}

// Conversion Tracking Types
export interface ConversionEvent {
  eventType: 'page_view' | 'pricing_view' | 'plan_hover' | 'cta_click' | 'signup_start' | 'signup_complete' | 'payment_complete';
  variantId: string;
  testId: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ConversionFunnel {
  testId: string;
  variantId: string;
  metrics: {
    pageViews: number;
    pricingViews: number;
    planHovers: number;
    ctaClicks: number;
    signupStarts: number;
    signupCompletes: number;
    paymentCompletes: number;
  };
  conversionRates: {
    viewToPricing: number;
    pricingToHover: number;
    hoverToCta: number;
    ctaToSignup: number;
    signupToPayment: number;
    overallConversion: number;
  };
  averageOrderValue: number;
  revenuePerVisitor: number;
}

// Pre-configured A/B Tests for Playlist Pulse
export const PLAYLIST_PULSE_AB_TESTS: ABTestConfig[] = [
  {
    testId: 'pricing-psychology-2025-01',
    name: 'Pricing Psychology: Monthly vs Annual Focus',
    description: 'Test whether showing monthly or annual pricing first increases conversions',
    variants: [
      {
        id: 'monthly-focus',
        name: 'Monthly Focus',
        weight: 50,
        config: {
          pricing: {
            strategy: 'monthly-focus',
            monthlyPrices: { starter: 15, professional: 30, agency: 99 },
            annualDiscounts: { starter: 20, professional: 25, agency: 30 },
            displayFormat: 'toggle-default-monthly',
            currencySymbol: '£',
            valueProps: [
              'No long-term commitment',
              'Start small and scale',
              'Cancel anytime'
            ]
          }
        }
      },
      {
        id: 'annual-focus',
        name: 'Annual Focus (Value Emphasis)',
        weight: 50,
        config: {
          pricing: {
            strategy: 'annual-focus',
            monthlyPrices: { starter: 15, professional: 30, agency: 99 },
            annualDiscounts: { starter: 20, professional: 25, agency: 30 },
            displayFormat: 'toggle-default-annual',
            currencySymbol: '£',
            valueProps: [
              'Save up to 30% annually',
              'Best value for serious producers',
              '2 months free with annual'
            ]
          }
        }
      }
    ],
    trafficSplit: [50, 50],
    isActive: true,
    startDate: new Date(),
    targetMetrics: ['signupComplete', 'paymentComplete', 'averageOrderValue']
  },
  
  {
    testId: 'music-producer-pain-points-2025-01',
    name: 'Music Producer Pain Points Copy',
    description: 'Test different pain point messaging for UK music producers',
    variants: [
      {
        id: 'spotify-focus',
        name: 'Spotify Playlist Focus',
        weight: 33,
        config: {
          copy: {
            headlines: {
              primary: 'Get Your Music on Spotify Playlists That Matter',
              secondary: 'Stop wasting time on playlist submissions that go nowhere. Access verified UK curators who actually listen.'
            },
            painPoints: [
              {
                problem: 'Spotify submissions disappearing into the void',
                solution: 'Direct access to verified UK playlist curators',
                benefit: 'Real playlist placements, not false promises'
              },
              {
                problem: 'Paying for playlist placement with no results',
                solution: 'Performance-based curator network',
                benefit: 'Only pay when you get genuine engagement'
              },
              {
                problem: 'No feedback on why tracks get rejected',
                solution: 'Detailed curator feedback on every submission',
                benefit: 'Learn and improve with every pitch'
              }
            ],
            cta: {
              primary: 'Get Real Playlist Placements',
              secondary: 'Start Free Trial'
            },
            socialProof: [
              {
                testimonial: "Finally got my track on a 50K playlist that actually gets streams. Game changer.",
                author: "Jamie Chen",
                title: "Electronic Producer, Manchester"
              }
            ],
            features: [
              {
                title: 'Verified UK Curators',
                description: 'Access 2,500+ verified playlist curators focused on UK audiences',
                icon: 'verified'
              },
              {
                title: 'Genre-Specific Matching',
                description: 'Smart matching ensures your music reaches the right curators',
                icon: 'target'
              }
            ]
          }
        }
      },
      {
        id: 'time-efficiency',
        name: 'Time Efficiency Focus',
        weight: 33,
        config: {
          copy: {
            headlines: {
              primary: 'Stop Wasting Hours on Manual Playlist Outreach',
              secondary: 'Automate your playlist submissions and get back to making music. Built for busy UK producers.'
            },
            painPoints: [
              {
                problem: 'Spending 20+ hours weekly on playlist research',
                solution: 'Automated curator discovery and matching',
                benefit: 'Save 15+ hours per week for music creation'
              },
              {
                problem: 'Tracking submissions across multiple platforms',
                solution: 'Centralized dashboard with real-time updates',
                benefit: 'Never lose track of a submission again'
              },
              {
                problem: 'Following up manually with hundreds of curators',
                solution: 'Automated follow-up sequences that work',
                benefit: 'Professional follow-ups without the admin work'
              }
            ],
            cta: {
              primary: 'Automate Your Submissions',
              secondary: 'Save Time Today'
            },
            socialProof: [
              {
                testimonial: "Went from 20 hours of admin to 2 hours. Now I actually have time to make music.",
                author: "Marcus Williams",
                title: "Hip-Hop Producer, Birmingham"
              }
            ],
            features: [
              {
                title: 'Smart Automation',
                description: 'Set it once, let it run. Submissions happen while you sleep',
                icon: 'automation'
              },
              {
                title: 'UK Music Scene Focus',
                description: 'Optimized for British music industry standards and practices',
                icon: 'uk-flag'
              }
            ]
          }
        }
      },
      {
        id: 'career-growth',
        name: 'Career Growth Focus',
        weight: 34,
        config: {
          copy: {
            headlines: {
              primary: 'Turn Your Music Into a Sustainable Career',
              secondary: 'From bedroom producer to industry professional. The platform that grows with your ambitions.'
            },
            painPoints: [
              {
                problem: 'Great music but no industry connections',
                solution: 'Direct line to UK music industry professionals',
                benefit: 'Build real relationships that advance your career'
              },
              {
                problem: 'Inconsistent streaming numbers and revenue',
                solution: 'Strategic playlist placements for sustainable growth',
                benefit: 'Predictable monthly streams and income'
              },
              {
                problem: 'No clear path from hobbyist to professional',
                solution: 'Career development roadmap and mentorship',
                benefit: 'Clear steps to make music your full-time career'
              }
            ],
            cta: {
              primary: 'Start Your Music Career',
              secondary: 'Join UK Professionals'
            },
            socialProof: [
              {
                testimonial: "From 500 monthly listeners to 50K+ and my first label deal. This platform changed everything.",
                author: "Sarah Thompson",
                title: "Indie Artist, London"
              }
            ],
            features: [
              {
                title: 'Career Progression Tracking',
                description: 'Monitor your growth from hobbyist to professional with detailed analytics',
                icon: 'chart'
              },
              {
                title: 'Industry Mentorship',
                description: 'Connect with established UK music industry professionals',
                icon: 'mentor'
              }
            ]
          }
        }
      }
    ],
    trafficSplit: [33, 33, 34],
    isActive: true,
    startDate: new Date(),
    targetMetrics: ['ctaClick', 'signupComplete', 'timeOnPage']
  },

  {
    testId: 'most-popular-badge-2025-01',
    name: 'Most Popular Badge Placement',
    description: 'Test different positions for the Most Popular badge to maximize conversions',
    variants: [
      {
        id: 'professional-top-right',
        name: 'Professional Plan - Top Right',
        weight: 25,
        config: {
          badges: {
            mostPopular: {
              enabled: true,
              position: 'top-right',
              plan: 'professional',
              text: 'Most Popular',
              color: 'yellow'
            },
            bestValue: {
              enabled: false,
              position: 'top-right',
              plan: 'professional',
              text: 'Best Value'
            }
          }
        }
      },
      {
        id: 'professional-header',
        name: 'Professional Plan - Header',
        weight: 25,
        config: {
          badges: {
            mostPopular: {
              enabled: true,
              position: 'header',
              plan: 'professional',
              text: 'Most Popular Choice',
              color: 'blue'
            },
            bestValue: {
              enabled: false,
              position: 'header',
              plan: 'professional',
              text: 'Best Value'
            }
          }
        }
      },
      {
        id: 'agency-top-right',
        name: 'Agency Plan - Top Right',
        weight: 25,
        config: {
          badges: {
            mostPopular: {
              enabled: true,
              position: 'top-right',
              plan: 'agency',
              text: 'Pro Choice',
              color: 'gradient'
            },
            bestValue: {
              enabled: false,
              position: 'top-right',
              plan: 'agency',
              text: 'Best Value'
            }
          }
        }
      },
      {
        id: 'no-badge',
        name: 'No Badge (Control)',
        weight: 25,
        config: {
          badges: {
            mostPopular: {
              enabled: false,
              position: 'top-right',
              plan: 'professional',
              text: 'Most Popular',
              color: 'yellow'
            },
            bestValue: {
              enabled: false,
              position: 'top-right',
              plan: 'professional',
              text: 'Best Value'
            }
          }
        }
      }
    ],
    trafficSplit: [25, 25, 25, 25],
    isActive: true,
    startDate: new Date(),
    targetMetrics: ['planHover', 'ctaClick', 'signupComplete']
  },

  {
    testId: 'ethical-urgency-2025-01',
    name: 'Ethical Urgency Tactics',
    description: 'Test different ethical urgency messages to increase conversions without being pushy',
    variants: [
      {
        id: 'limited-beta',
        name: 'Limited Beta Access',
        weight: 25,
        config: {
          urgency: {
            type: 'scarcity',
            message: 'Beta access limited to 100 new UK producers this month',
            limitMessage: '47 spots remaining'
          }
        }
      },
      {
        id: 'trend-momentum',
        name: 'Industry Trend Momentum',
        weight: 25,
        config: {
          urgency: {
            type: 'trend-based',
            message: 'UK streaming revenue up 12% - now is the time to position your music',
            socialProofCount: 1247
          }
        }
      },
      {
        id: 'time-sensitive-bonus',
        name: 'Time-Sensitive Bonus',
        weight: 25,
        config: {
          urgency: {
            type: 'time-sensitive',
            message: 'Start this week and get your first curator feedback within 48 hours',
            countdown: {
              endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              format: 'text-only'
            }
          }
        }
      },
      {
        id: 'no-urgency',
        name: 'No Urgency (Control)',
        weight: 25,
        config: {
          urgency: {
            type: 'none',
            message: ''
          }
        }
      }
    ],
    trafficSplit: [25, 25, 25, 25],
    isActive: true,
    startDate: new Date(),
    targetMetrics: ['ctaClick', 'signupStart', 'signupComplete']
  }
];

// Conversion Optimizer Class
export class ConversionOptimizer {
  private static instance: ConversionOptimizer;
  private activeTests: Map<string, ABTestConfig> = new Map();
  private userVariants: Map<string, string> = new Map(); // sessionId -> variantId
  private conversionEvents: ConversionEvent[] = [];

  private constructor() {
    this.initializeTests();
  }

  public static getInstance(): ConversionOptimizer {
    if (!ConversionOptimizer.instance) {
      ConversionOptimizer.instance = new ConversionOptimizer();
    }
    return ConversionOptimizer.instance;
  }

  private initializeTests(): void {
    PLAYLIST_PULSE_AB_TESTS.forEach(test => {
      if (test.isActive) {
        this.activeTests.set(test.testId, test);
      }
    });
  }

  // Assign user to variant based on session ID
  public assignVariant(sessionId: string, testId: string): string {
    const test = this.activeTests.get(testId);
    if (!test) return 'control';

    // Use session ID to deterministically assign variant
    const hash = this.hashCode(sessionId + testId);
    const normalizedHash = Math.abs(hash) % 100;
    
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (normalizedHash < cumulativeWeight) {
        this.userVariants.set(`${sessionId}-${testId}`, variant.id);
        return variant.id;
      }
    }
    
    return test.variants[0].id; // Fallback
  }

  // Get variant configuration for user
  public getVariantConfig(sessionId: string, testId: string): VariantConfig | null {
    const variantId = this.userVariants.get(`${sessionId}-${testId}`);
    if (!variantId) return null;

    const test = this.activeTests.get(testId);
    if (!test) return null;

    const variant = test.variants.find(v => v.id === variantId);
    return variant?.config || null;
  }

  // Track conversion event
  public trackEvent(event: Omit<ConversionEvent, 'timestamp'>): void {
    const fullEvent: ConversionEvent = {
      ...event,
      timestamp: new Date()
    };
    
    this.conversionEvents.push(fullEvent);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      const events = this.getStoredEvents();
      events.push(fullEvent);
      localStorage.setItem('conversionEvents', JSON.stringify(events));
    }
  }

  // Get conversion metrics for a test
  public getConversionMetrics(testId: string): Map<string, ConversionFunnel> {
    const test = this.activeTests.get(testId);
    if (!test) return new Map();

    const metrics = new Map<string, ConversionFunnel>();
    
    test.variants.forEach(variant => {
      const variantEvents = this.conversionEvents.filter(
        event => event.testId === testId && event.variantId === variant.id
      );

      const funnel = this.calculateFunnelMetrics(testId, variant.id, variantEvents);
      metrics.set(variant.id, funnel);
    });

    return metrics;
  }

  private calculateFunnelMetrics(testId: string, variantId: string, events: ConversionEvent[]): ConversionFunnel {
    const metrics = {
      pageViews: events.filter(e => e.eventType === 'page_view').length,
      pricingViews: events.filter(e => e.eventType === 'pricing_view').length,
      planHovers: events.filter(e => e.eventType === 'plan_hover').length,
      ctaClicks: events.filter(e => e.eventType === 'cta_click').length,
      signupStarts: events.filter(e => e.eventType === 'signup_start').length,
      signupCompletes: events.filter(e => e.eventType === 'signup_complete').length,
      paymentCompletes: events.filter(e => e.eventType === 'payment_complete').length
    };

    const conversionRates = {
      viewToPricing: metrics.pageViews > 0 ? metrics.pricingViews / metrics.pageViews : 0,
      pricingToHover: metrics.pricingViews > 0 ? metrics.planHovers / metrics.pricingViews : 0,
      hoverToCta: metrics.planHovers > 0 ? metrics.ctaClicks / metrics.planHovers : 0,
      ctaToSignup: metrics.ctaClicks > 0 ? metrics.signupStarts / metrics.ctaClicks : 0,
      signupToPayment: metrics.signupStarts > 0 ? metrics.paymentCompletes / metrics.signupStarts : 0,
      overallConversion: metrics.pageViews > 0 ? metrics.paymentCompletes / metrics.pageViews : 0
    };

    // Calculate revenue metrics (placeholder values)
    const averageOrderValue = this.calculateAverageOrderValue(events);
    const revenuePerVisitor = averageOrderValue * conversionRates.overallConversion;

    return {
      testId,
      variantId,
      metrics,
      conversionRates,
      averageOrderValue,
      revenuePerVisitor
    };
  }

  private calculateAverageOrderValue(events: ConversionEvent[]): number {
    const paymentEvents = events.filter(e => e.eventType === 'payment_complete');
    if (paymentEvents.length === 0) return 0;

    // Extract order values from metadata or use default pricing
    const orderValues = paymentEvents.map(event => {
      return event.metadata?.orderValue || 30; // Default to Professional plan
    });

    return orderValues.reduce((sum, value) => sum + value, 0) / orderValues.length;
  }

  private getStoredEvents(): ConversionEvent[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('conversionEvents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  // Get all active tests
  public getActiveTests(): ABTestConfig[] {
    return Array.from(this.activeTests.values());
  }

  // Check if user is in specific test
  public isUserInTest(sessionId: string, testId: string): boolean {
    return this.userVariants.has(`${sessionId}-${testId}`);
  }

  // Get statistical significance of test results
  public getTestSignificance(testId: string): { isSignificant: boolean; confidenceLevel: number } {
    const metrics = this.getConversionMetrics(testId);
    
    if (metrics.size < 2) {
      return { isSignificant: false, confidenceLevel: 0 };
    }

    // Simplified significance calculation
    // In production, use proper statistical methods
    const variants = Array.from(metrics.values());
    const totalVisitors = variants.reduce((sum, v) => sum + v.metrics.pageViews, 0);
    
    if (totalVisitors < 1000) {
      return { isSignificant: false, confidenceLevel: 0 };
    }

    // Placeholder calculation - use proper statistical significance testing
    const confidenceLevel = Math.min(95, (totalVisitors / 1000) * 95);
    const isSignificant = confidenceLevel >= 95;

    return { isSignificant, confidenceLevel };
  }
}

// Utility functions for React components
export const useConversionOptimizer = () => {
  const optimizer = ConversionOptimizer.getInstance();
  
  return {
    assignVariant: optimizer.assignVariant.bind(optimizer),
    getVariantConfig: optimizer.getVariantConfig.bind(optimizer),
    trackEvent: optimizer.trackEvent.bind(optimizer),
    getActiveTests: optimizer.getActiveTests.bind(optimizer),
    isUserInTest: optimizer.isUserInTest.bind(optimizer)
  };
};

// React hook for session management
export const useSession = () => {
  const getSessionId = (): string => {
    if (typeof window === 'undefined') return 'server-session';
    
    let sessionId = sessionStorage.getItem('conversionSessionId');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('conversionSessionId', sessionId);
    }
    return sessionId;
  };

  return { sessionId: getSessionId() };
};