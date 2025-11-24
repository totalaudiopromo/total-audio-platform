/**
 * Music Industry Graph (MIG) - Performance Hints
 *
 * Internal performance optimization utilities for graph operations.
 * Provides batching, caching, and query optimization helpers.
 */

import type { MIGNode, MIGEdge } from './types';
import { logger } from './utils/logger';

// ============================================================================
// IN-MEMORY CACHE
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T, ttl: number = 300000): void {
    // Default 5 minutes TTL
    // Evict oldest if at max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global caches for nodes and edges
export const nodeCache = new MemoryCache<MIGNode>(2000);
export const edgeCache = new MemoryCache<MIGEdge[]>(1000);
export const neighborCache = new MemoryCache<any[]>(1000);

// ============================================================================
// BATCHING HELPERS
// ============================================================================

/**
 * Batch multiple node IDs into a single query
 * Returns a map of node ID to node data
 */
export function createNodeBatch(nodeIds: string[]): {
  ids: string[];
  batchSize: number;
} {
  const uniqueIds = [...new Set(nodeIds)];
  return {
    ids: uniqueIds,
    batchSize: Math.min(uniqueIds.length, 100), // Max 100 per batch
  };
}

/**
 * Split large batches into chunks
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// ============================================================================
// QUERY GUARDS
// ============================================================================

export interface QueryLimits {
  maxDepth: number;
  maxNodes: number;
  maxEdges: number;
  timeoutMs: number;
}

export const DEFAULT_QUERY_LIMITS: QueryLimits = {
  maxDepth: 6,
  maxNodes: 1000,
  maxEdges: 5000,
  timeoutMs: 30000, // 30 seconds
};

/**
 * Create a timeout guard for long-running operations
 */
export function createTimeoutGuard(timeoutMs: number): {
  check: () => boolean;
  elapsed: () => number;
} {
  const startTime = Date.now();

  return {
    check: () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > timeoutMs) {
        logger.warn(`Operation timeout: ${elapsed}ms > ${timeoutMs}ms`);
        return true;
      }
      return false;
    },
    elapsed: () => Date.now() - startTime,
  };
}

/**
 * Check if operation should continue based on limits
 */
export function checkOperationLimits(
  currentDepth: number,
  nodeCount: number,
  edgeCount: number,
  limits: QueryLimits
): { continue: boolean; reason?: string } {
  if (currentDepth > limits.maxDepth) {
    return { continue: false, reason: `Max depth exceeded: ${currentDepth} > ${limits.maxDepth}` };
  }

  if (nodeCount > limits.maxNodes) {
    return { continue: false, reason: `Max nodes exceeded: ${nodeCount} > ${limits.maxNodes}` };
  }

  if (edgeCount > limits.maxEdges) {
    return { continue: false, reason: `Max edges exceeded: ${edgeCount} > ${limits.maxEdges}` };
  }

  return { continue: true };
}

// ============================================================================
// CACHE KEYS
// ============================================================================

export function makeNodeCacheKey(nodeId: string): string {
  return `node:${nodeId}`;
}

export function makeEdgeCacheKey(nodeId: string): string {
  return `edges:${nodeId}`;
}

export function makeNeighborCacheKey(
  nodeId: string,
  options?: { depth?: number; types?: string[] }
): string {
  const depth = options?.depth || 1;
  const types = options?.types?.sort().join(',') || 'all';
  return `neighbors:${nodeId}:${depth}:${types}`;
}

export function makeScenePulseCacheKey(sceneSlug: string): string {
  return `pulse:${sceneSlug}`;
}

// ============================================================================
// DEDUPLICATION
// ============================================================================

/**
 * Remove duplicate nodes from an array
 */
export function deduplicateNodes(nodes: MIGNode[]): MIGNode[] {
  const seen = new Set<string>();
  return nodes.filter((node) => {
    if (seen.has(node.id)) return false;
    seen.add(node.id);
    return true;
  });
}

/**
 * Remove duplicate edges from an array
 */
export function deduplicateEdges(edges: MIGEdge[]): MIGEdge[] {
  const seen = new Set<string>();
  return edges.filter((edge) => {
    const key = `${edge.source}:${edge.target}:${edge.rel}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

export interface PerformanceMetrics {
  operation: string;
  durationMs: number;
  nodesProcessed: number;
  edgesProcessed: number;
  cacheHits: number;
  cacheMisses: number;
}

export function logPerformanceMetrics(metrics: PerformanceMetrics): void {
  if (metrics.durationMs > 1000) {
    logger.warn('Slow operation detected', metrics);
  } else {
    logger.info('Performance metrics', metrics);
  }
}

/**
 * Create a performance tracker
 */
export function createPerformanceTracker(operation: string) {
  const startTime = Date.now();
  let nodesProcessed = 0;
  let edgesProcessed = 0;
  let cacheHits = 0;
  let cacheMisses = 0;

  return {
    trackNode: () => nodesProcessed++,
    trackEdge: () => edgesProcessed++,
    trackCacheHit: () => cacheHits++,
    trackCacheMiss: () => cacheMisses++,
    finish: () => {
      const metrics: PerformanceMetrics = {
        operation,
        durationMs: Date.now() - startTime,
        nodesProcessed,
        edgesProcessed,
        cacheHits,
        cacheMisses,
      };
      logPerformanceMetrics(metrics);
      return metrics;
    },
  };
}
