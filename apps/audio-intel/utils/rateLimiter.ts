/**
 * Rate Limiter for API requests
 *
 * Prevents API abuse and controls costs
 */

interface RateLimitConfig {
  maxRequests: number; // Maximum requests per window
  windowMs: number; // Time window in milliseconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = {
      maxRequests: config?.maxRequests || 60, // 60 requests per minute default
      windowMs: config?.windowMs || 60 * 1000, // 1 minute window
    };
  }

  /**
   * Check if request is allowed for given key
   */
  public isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    // No previous requests or window expired
    if (!entry || now >= entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    // Within window, check count
    if (entry.count < this.config.maxRequests) {
      entry.count++;
      return true;
    }

    // Rate limit exceeded
    return false;
  }

  /**
   * Get time until rate limit resets (in milliseconds)
   */
  public getResetTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;

    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  /**
   * Get remaining requests for key
   */
  public getRemaining(key: string): number {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now >= entry.resetTime) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - entry.count);
  }

  /**
   * Reset rate limit for key
   */
  public reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clear all rate limits
   */
  public resetAll(): void {
    this.limits.clear();
  }

  /**
   * Clean up expired entries (call periodically)
   */
  public cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

/**
 * Global rate limiter instances
 */
export const enrichmentRateLimiter = new RateLimiter({
  maxRequests: 60, // 60 enrichments per minute
  windowMs: 60 * 1000,
});

export const apiRateLimiter = new RateLimiter({
  maxRequests: 100, // 100 API calls per minute
  windowMs: 60 * 1000,
});

/**
 * Cleanup expired entries every 5 minutes
 */
if (typeof window === 'undefined') {
  // Server-side only
  setInterval(
    () => {
      enrichmentRateLimiter.cleanup();
      apiRateLimiter.cleanup();
    },
    5 * 60 * 1000
  );
}
