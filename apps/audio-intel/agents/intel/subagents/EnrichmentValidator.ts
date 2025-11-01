/**
 * EnrichmentValidator Sub-Agent
 * Validates contact enrichment quality and ensures data meets Audio Intel standards
 */

import type { SubAgentResult } from '../../core/AgentTypes';
import type { Contact } from './ContactFinder';
import type { Label } from './LabelMatcher';

export interface ValidationPayload {
  contacts?: Contact[];
  labels?: Label[];
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
  contactsValidated: number;
  labelsValidated: number;
}

export class EnrichmentValidator {
  /**
   * Validate enrichment data quality
   */
  static async validate(payload: ValidationPayload): Promise<SubAgentResult> {
    try {
      console.log('[EnrichmentValidator] Validating enrichment data...');

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Validate contacts
      const contactValidation = this.validateContacts(payload.contacts || []);
      issues.push(...contactValidation.issues);
      recommendations.push(...contactValidation.recommendations);

      // Validate labels
      const labelValidation = this.validateLabels(payload.labels || []);
      issues.push(...labelValidation.issues);
      recommendations.push(...labelValidation.recommendations);

      // Calculate overall quality score
      const score = this.calculateQualityScore(
        payload.contacts || [],
        payload.labels || [],
        issues.length
      );

      const result: ValidationResult = {
        isValid: score >= 0.7, // 70% threshold for valid enrichment
        score,
        issues,
        recommendations,
        contactsValidated: payload.contacts?.length || 0,
        labelsValidated: payload.labels?.length || 0,
      };

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Validation failed',
      };
    }
  }

  /**
   * Validate contacts data
   */
  private static validateContacts(contacts: Contact[]) {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (contacts.length === 0) {
      issues.push('No contacts found');
      recommendations.push('Expand search criteria or try different artist name');
    }

    // Check for email coverage
    const contactsWithEmail = contacts.filter(c => c.email).length;
    const emailCoverage = contacts.length > 0 ? contactsWithEmail / contacts.length : 0;

    if (emailCoverage < 0.5) {
      issues.push('Low email coverage (less than 50%)');
      recommendations.push('Run additional enrichment to find missing email addresses');
    }

    // Check confidence scores
    const lowConfidenceContacts = contacts.filter(c => c.confidence < 0.7).length;
    if (lowConfidenceContacts > contacts.length * 0.3) {
      issues.push('More than 30% of contacts have low confidence scores');
      recommendations.push('Manually verify low-confidence contacts');
    }

    return { issues, recommendations };
  }

  /**
   * Validate labels data
   */
  private static validateLabels(labels: Label[]) {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (labels.length === 0) {
      issues.push('No labels found');
      recommendations.push('Broaden genre criteria or check release details');
    }

    // Check for submission contact info
    const labelsWithSubmission = labels.filter(l => l.submissionEmail || l.website).length;
    const submissionCoverage = labels.length > 0 ? labelsWithSubmission / labels.length : 0;

    if (submissionCoverage < 0.7) {
      issues.push('Less than 70% of labels have submission contact info');
      recommendations.push('Research submission details for remaining labels');
    }

    return { issues, recommendations };
  }

  /**
   * Calculate overall quality score
   */
  private static calculateQualityScore(
    contacts: Contact[],
    labels: Label[],
    issuesCount: number
  ): number {
    let score = 1.0;

    // Penalise for lack of data
    if (contacts.length === 0) score -= 0.3;
    if (labels.length === 0) score -= 0.2;

    // Penalise for each issue
    score -= issuesCount * 0.1;

    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }
}
