/**
 * CSV Parser for Programmatic Case Study Pages
 *
 * Reads docs/pseo/programmatic-pages.csv and converts it to strongly-typed
 * TypeScript objects for case study page generation.
 *
 * Usage:
 * ```typescript
 * import { getCaseStudyBySlug, getAllCaseStudies } from '@/utils/parseCaseStudyData';
 *
 * // Get single case study
 * const bbcRadio1Data = await getCaseStudyBySlug('bbc-radio-1');
 *
 * // Get all case studies
 * const allStudies = await getAllCaseStudies();
 *
 * // Get case studies by status
 * const liveStudies = await getCaseStudiesByStatus('live');
 * ```
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
// Note: These should be moved to types/case-study.ts once it's created
// by the other agent. For now, they're defined inline.

/**
 * Contact data structure for enriched sample contacts
 */
export interface ContactData {
  name: string;
  role: string;
  show?: string;
  submissionNotes: string;
  validationConfidence: number;
}

/**
 * Main case study data structure matching CSV columns
 */
export interface CaseStudyData {
  // Core identifiers
  topicSlug: string;
  pageUrl: string;

  // SEO metadata
  pageTitle: string;
  metaDescription: string;
  searchIntent: string[];

  // Audience targeting
  audience: string[];
  painPoint: string;
  solutionAngle: string;
  proofPoints: string[];

  // CTA and categorization
  ctaPrimary: string;
  category: string;
  tier: number;
  monthlySearchesEst: number;
  status: 'live' | 'planned' | 'draft';
}

/**
 * Enriched case study with additional computed fields
 */
export interface EnrichedCaseStudyData extends CaseStudyData {
  // Computed fields
  estimatedReadTime: number; // in minutes
  primaryKeyword: string;
  targetAudiencePrimary: string;
}

// ============================================================================
// CSV PARSING FUNCTIONS
// ============================================================================

/**
 * Parses a comma-separated string into an array, trimming whitespace
 */
function parseArrayField(value: string): string[] {
  if (!value || value.trim() === '') return [];
  return value.split(';').map(item => item.trim()).filter(Boolean);
}

/**
 * Parses a single CSV row into a CaseStudyData object
 */
function parseCSVRow(row: string[], headers: string[]): CaseStudyData | null {
  const rowData: Record<string, string> = {};
  headers.forEach((header, index) => {
    rowData[header] = row[index] || '';
  });

  // Skip empty rows or rows with no topic_slug
  if (!rowData.topic_slug || rowData.topic_slug.trim() === '') {
    return null;
  }

  // Parse tier and monthly searches as numbers
  const tier = parseInt(rowData.tier, 10);
  const monthlySearchesEst = parseInt(rowData.monthly_searches_est, 10);

  // Validate tier is 1-3
  if (isNaN(tier) || tier < 1 || tier > 3) {
    throw new Error(`Invalid tier value for ${rowData.topic_slug}: ${rowData.tier}. Must be 1, 2, or 3.`);
  }

  // Validate monthly searches
  if (isNaN(monthlySearchesEst) || monthlySearchesEst < 0) {
    throw new Error(`Invalid monthly_searches_est for ${rowData.topic_slug}: ${rowData.monthly_searches_est}`);
  }

  // Validate status
  const status = rowData.status.toLowerCase();
  if (!['live', 'planned', 'draft'].includes(status)) {
    throw new Error(`Invalid status for ${rowData.topic_slug}: ${rowData.status}. Must be 'live', 'planned', or 'draft'.`);
  }

  return {
    topicSlug: rowData.topic_slug.trim(),
    pageUrl: rowData.page_url.trim(),
    pageTitle: rowData.page_title.trim(),
    metaDescription: rowData.meta_description.trim(),
    searchIntent: parseArrayField(rowData.search_intent),
    audience: parseArrayField(rowData.audience),
    painPoint: rowData.pain_point.trim(),
    solutionAngle: rowData.solution_angle.trim(),
    proofPoints: parseArrayField(rowData.proof_points),
    ctaPrimary: rowData.cta_primary.trim(),
    category: rowData.category.trim(),
    tier,
    monthlySearchesEst,
    status: status as 'live' | 'planned' | 'draft',
  };
}

/**
 * Reads and parses the programmatic-pages.csv file
 */
async function readCSVFile(): Promise<CaseStudyData[]> {
  const csvPath = path.join(process.cwd(), 'docs', 'pseo', 'programmatic-pages.csv');

  try {
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 2) {
      throw new Error('CSV file is empty or contains only headers');
    }

    // Parse CSV manually (simple approach - assumes no commas in quoted fields)
    const rows = lines.map(line => {
      // Split by comma, but preserve commas within quotes
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      return matches ? matches.map(item => item.replace(/^"|"$/g, '').trim()) : [];
    });

    const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
    const dataRows = rows.slice(1);

    const caseStudies: CaseStudyData[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      try {
        const parsed = parseCSVRow(dataRows[i], headers);
        if (parsed) {
          caseStudies.push(parsed);
        }
      } catch (error) {
        console.error(`Error parsing row ${i + 2}:`, error);
        throw error;
      }
    }

    return caseStudies;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`CSV file not found at ${csvPath}. Please ensure docs/pseo/programmatic-pages.csv exists.`);
    }
    throw error;
  }
}

/**
 * Enriches case study data with computed fields
 */
function enrichCaseStudyData(data: CaseStudyData): EnrichedCaseStudyData {
  // Estimate read time based on tier (rough approximation)
  const estimatedReadTime = data.tier === 1 ? 10 : data.tier === 2 ? 8 : 6;

  // Extract primary keyword (first search intent)
  const primaryKeyword = data.searchIntent[0] || data.topicSlug.replace(/-/g, ' ');

  // Extract primary target audience
  const targetAudiencePrimary = data.audience[0] || 'Music industry professionals';

  return {
    ...data,
    estimatedReadTime,
    primaryKeyword,
    targetAudiencePrimary,
  };
}

// ============================================================================
// PUBLIC API FUNCTIONS
// ============================================================================

/**
 * Gets all case studies from the CSV file
 */
export async function getAllCaseStudies(): Promise<EnrichedCaseStudyData[]> {
  const rawData = await readCSVFile();
  return rawData.map(enrichCaseStudyData);
}

/**
 * Gets a single case study by its slug
 * @throws Error if case study not found
 */
export async function getCaseStudyBySlug(slug: string): Promise<EnrichedCaseStudyData> {
  const allStudies = await getAllCaseStudies();
  const study = allStudies.find(s => s.topicSlug === slug);

  if (!study) {
    throw new Error(`Case study not found for slug: ${slug}. Available slugs: ${allStudies.map(s => s.topicSlug).join(', ')}`);
  }

  return study;
}

/**
 * Gets case studies filtered by status
 */
export async function getCaseStudiesByStatus(status: 'live' | 'planned' | 'draft'): Promise<EnrichedCaseStudyData[]> {
  const allStudies = await getAllCaseStudies();
  return allStudies.filter(s => s.status === status);
}

/**
 * Gets case studies filtered by category
 */
export async function getCaseStudiesByCategory(category: string): Promise<EnrichedCaseStudyData[]> {
  const allStudies = await getAllCaseStudies();
  return allStudies.filter(s => s.category.toLowerCase() === category.toLowerCase());
}

/**
 * Gets case studies filtered by tier
 */
export async function getCaseStudiesByTier(tier: 1 | 2 | 3): Promise<EnrichedCaseStudyData[]> {
  const allStudies = await getAllCaseStudies();
  return allStudies.filter(s => s.tier === tier);
}

/**
 * Gets all available slugs for static path generation
 */
export async function getAllCaseStudySlugs(): Promise<string[]> {
  const allStudies = await getAllCaseStudies();
  return allStudies.map(s => s.topicSlug);
}

/**
 * Validates that a case study has all required fields
 */
export function validateCaseStudy(data: CaseStudyData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required string fields
  const requiredFields: (keyof CaseStudyData)[] = [
    'topicSlug', 'pageUrl', 'pageTitle', 'metaDescription',
    'painPoint', 'solutionAngle', 'ctaPrimary', 'category'
  ];

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && (data[field] as string).trim() === '')) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Required array fields (must have at least one item)
  if (!data.searchIntent || data.searchIntent.length === 0) {
    errors.push('searchIntent must have at least one value');
  }
  if (!data.audience || data.audience.length === 0) {
    errors.push('audience must have at least one value');
  }
  if (!data.proofPoints || data.proofPoints.length === 0) {
    errors.push('proofPoints must have at least one value');
  }

  // Validate tier
  if (data.tier < 1 || data.tier > 3) {
    errors.push('tier must be 1, 2, or 3');
  }

  // Validate monthly searches
  if (data.monthlySearchesEst < 0) {
    errors.push('monthlySearchesEst must be non-negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// SYNCHRONOUS FUNCTIONS FOR BUILD TIME
// ============================================================================

/**
 * Synchronous version for Next.js build-time usage
 * (e.g., in generateStaticParams or generateMetadata)
 */
export function getAllCaseStudiesSync(): EnrichedCaseStudyData[] {
  const csvPath = path.join(process.cwd(), 'docs', 'pseo', 'programmatic-pages.csv');

  try {
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 2) {
      throw new Error('CSV file is empty or contains only headers');
    }

    const rows = lines.map(line => {
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      return matches ? matches.map(item => item.replace(/^"|"$/g, '').trim()) : [];
    });

    const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
    const dataRows = rows.slice(1);

    const caseStudies: CaseStudyData[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const parsed = parseCSVRow(dataRows[i], headers);
      if (parsed) {
        caseStudies.push(parsed);
      }
    }

    return caseStudies.map(enrichCaseStudyData);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`CSV file not found at ${csvPath}`);
      return [];
    }
    throw error;
  }
}

/**
 * Synchronous version to get case study by slug
 */
export function getCaseStudyBySlugSync(slug: string): EnrichedCaseStudyData | null {
  const allStudies = getAllCaseStudiesSync();
  return allStudies.find(s => s.topicSlug === slug) || null;
}
