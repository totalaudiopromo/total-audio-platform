/**
 * Simple in-memory cache with TTL support for Talent Radar
 * For production, consider Redis or similar distributed cache
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheConfig {
  defaultTTL: number; // seconds
  maxSize: number;
}

/**
 * In-memory cache with TTL and size limits
 */
export class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: config.defaultTTL || 300, // 5 minutes default
      maxSize: config.maxSize || 500,
    };
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttlSeconds?: number): void {
    // Enforce size limit using LRU-like eviction
    if (this.cache.size >= this.config.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const ttl = ttlSeconds || this.config.defaultTTL;
    const expiresAt = Date.now() + ttl * 1000;

    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Clear specific key or all cache
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
    };
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Cache key builder for Talent Radar
 */
export class TalentRadarCacheKeys {
  static globalPulse(): string {
    return 'talent:global-pulse';
  }

  static artistProfile(artistSlug: string): string {
    return `talent:artist:${artistSlug}`;
  }

  static artistSignals(artistSlug: string): string {
    return `talent:signals:${artistSlug}`;
  }

  static sceneSignals(sceneSlug: string): string {
    return `talent:scene:${sceneSlug}`;
  }

  static workspaceRecommendations(workspaceId: string): string {
    return `talent:recs:${workspaceId}`;
  }

  static topRising(limit: number): string {
    return `talent:top-rising:${limit}`;
  }

  static topBreakout(limit: number): string {
    return `talent:top-breakout:${limit}`;
  }

  static atRisk(limit: number): string {
    return `talent:at-risk:${limit}`;
  }
}
