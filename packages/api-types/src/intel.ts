/**
 * Audio Intel API Types
 */

import type { ApiResponse, Contact } from './common';

export interface EnrichContactsRequest {
  contacts: EnrichContactInput[];
  options?: EnrichmentOptions;
}

export interface EnrichContactInput {
  id?: string;
  name: string;
  email: string;
  outlet?: string;
  role?: string;
  genre_tags?: string[];
}

export interface EnrichmentOptions {
  forceRefresh?: boolean;
  includeConfidence?: boolean;
  customPrompt?: string;
}

export interface EnrichedContact extends Contact {
  contactIntelligence?: string;
  researchConfidence?: 'High' | 'Medium' | 'Low';
  lastResearched?: string;
  errors?: string[];
}

export interface EnrichContactsResponse {
  success: boolean;
  enriched: EnrichedContact[];
  processed: number;
  elapsed?: string;
  version?: string;
}

export type EnrichContactsApiResponse = ApiResponse<EnrichContactsResponse>;

export interface ValidateEmailsRequest {
  emails: string[];
}

export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  confidence: number;
  checks: {
    syntax: boolean;
    domain: boolean;
    mx: boolean;
    disposable: boolean;
    roleAccount: boolean;
  };
  classification?: 'safe' | 'risky' | 'invalid';
}

export interface ValidateEmailsResponse {
  results: EmailValidationResult[];
  processed: number;
  timestamp: string;
}

export type ValidateEmailsApiResponse = ApiResponse<ValidateEmailsResponse>;
