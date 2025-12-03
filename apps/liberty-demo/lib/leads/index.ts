/**
 * Lead Generation System
 * AI-powered artist discovery and enrichment
 */

// Types
export * from './types';

// Mock Data
export { MOCK_LEADS, MOCK_LEAD_SOURCES, getMockLeadStats } from './mock-data';

// Scoring
export {
  calculateScore,
  generateSignals,
  getScoreCategory,
  sortLeadsByScore,
  filterLeadsByMinScore,
} from './scoring';
