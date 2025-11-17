/**
 * Real-Time Coverage Feed (RCF)
 *
 * Main export file for the RCF package
 *
 * @packageDocumentation
 */

// Export types
export * from './types';

// Export utilities
export * from './utils';

// Export ingestors
export * from './eventIngestors';

// Export core modules
export * from './eventNormalizer';
export * from './eventWeights';
export * from './eventPublisher';
export * from './realtime';
export * from './subscriptionEngine';
export * from './feedBuilder';
export * from './pipeline';

// Re-export commonly used functions
export { runPipeline, runPipelineManual } from './pipeline';
export { buildUserFeed } from './feedBuilder';
export { getUserSubscription, updateUserSubscription } from './subscriptionEngine';
export { normalizeEvents } from './eventNormalizer';
export { applyWeights } from './eventWeights';
export { publishEvents } from './eventPublisher';
export { createSSEStream } from './realtime';
