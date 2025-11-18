/**
 * Music Industry Graph (MIG) - Main Export
 *
 * A graph-based data intelligence layer that models the entire
 * UK/EU/global music ecosystem.
 */

// ============================================================================
// CORE EXPORTS
// ============================================================================

// Types
export * from './types';

// Validation schemas (Zod)
export * from './validation';

// Client operations
export * from './client';

// Graph store (higher-level operations)
export * from './graphStore';

// Pathfinding algorithms
export * from './pathfinding';

// Natural language queries
export * from './graphQuery';

// Recommendations
export * from './recommendations';

// Embeddings (stub/future)
export * from './embeddings';

// Scene pulse analytics
export * from './scenePulse';

// Microgenre clustering
export * from './microgenreCluster';

// Fusion Layer integration (read-only)
export * from './fusionAdapter';

// Performance hints (internal use, but exported for advanced users)
export {
  nodeCache,
  edgeCache,
  neighborCache,
  createTimeoutGuard,
  createPerformanceTracker,
  DEFAULT_QUERY_LIMITS,
} from './performanceHints';

// Logger
export { logger, MIGLogger } from './utils/logger';

// ============================================================================
// VERSION
// ============================================================================

export const MIG_VERSION = '1.0.0';
