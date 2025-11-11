/**
 * Intelligence Formatter Utility
 *
 * Formats contact enrichment intelligence for different output formats:
 * - Web: Condensed 6-field scannable card
 * - CSV: Separate columns for filtering/sorting
 * - PDF: Compact card layout for professional sharing
 */

export interface IntelligenceFields {
  platform?: string;
  role?: string;
  format?: string;
  coverage?: string;
  genres?: string[];
  contactMethod?: string;
  bestTiming?: string;
  submissionGuidelines?: string;
  pitchTips?: string[];
  reasoning?: string;
}

export interface WebDisplayField {
  label: string;
  value: string;
}

/**
 * Parse intelligence string into structured fields
 */
export function parseIntelligenceFields(intelligence: string): IntelligenceFields {
  if (!intelligence || intelligence === 'No intelligence found') {
    return {};
  }

  const fields: IntelligenceFields = {};
  const lines = intelligence.split('\n').filter(line => line.trim());

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const label = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (!value) continue;

    switch (label) {
      case 'Platform':
        fields.platform = value;
        break;
      case 'Role':
        fields.role = value;
        break;
      case 'Format':
        fields.format = value;
        break;
      case 'Coverage':
        fields.coverage = value;
        break;
      case 'Genres':
        fields.genres = value.split(',').map(g => g.trim());
        break;
      case 'Contact Method':
        fields.contactMethod = value;
        break;
      case 'Best Timing':
        fields.bestTiming = value;
        break;
      case 'Submission Guidelines':
        fields.submissionGuidelines = value;
        break;
      case 'Pitch Tips':
        fields.pitchTips = value.split(';').map(t => t.trim());
        break;
      case 'Notes':
        fields.reasoning = value;
        break;
    }
  }

  return fields;
}

/**
 * Format for web display (condensed 6-field card)
 * Returns top 6 most important fields for scannable display
 */
export function formatForWeb(fields: IntelligenceFields): WebDisplayField[] {
  const webFields: WebDisplayField[] = [];

  // Priority order: Platform, Role, Format, Genres, Contact Method, Best Timing
  if (fields.platform) {
    webFields.push({ label: 'Platform', value: fields.platform });
  }
  if (fields.role) {
    webFields.push({ label: 'Role', value: fields.role });
  }
  if (fields.format) {
    webFields.push({ label: 'Format', value: fields.format });
  }
  if (fields.genres && fields.genres.length > 0) {
    webFields.push({ label: 'Genres', value: fields.genres.join(', ') });
  }
  if (fields.contactMethod) {
    webFields.push({ label: 'Contact Method', value: fields.contactMethod });
  }
  if (fields.bestTiming) {
    webFields.push({ label: 'Best Timing', value: fields.bestTiming });
  }

  return webFields.slice(0, 6); // Max 6 fields for scannable display
}

/**
 * Format for CSV export (flat object with separate columns)
 */
export function formatForCSV(fields: IntelligenceFields): Record<string, string> {
  return {
    platform: fields.platform || '',
    role: fields.role || '',
    format: fields.format || '',
    coverage: fields.coverage || '',
    genres: fields.genres?.join(', ') || '',
    contactMethod: fields.contactMethod || '',
    bestTiming: fields.bestTiming || '',
    submissionGuidelines: fields.submissionGuidelines || '',
    pitchTips: fields.pitchTips?.join('; ') || '',
    notes: fields.reasoning || '',
  };
}

/**
 * Format for PDF export (compact card layout)
 */
export function formatForPDF(
  fields: IntelligenceFields,
  contact: { name: string; email: string },
  confidence: string
): string {
  const lines: string[] = [];

  // Header with name and confidence
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`${contact.name.padEnd(40)} [${confidence.toUpperCase()}]`);
  lines.push(contact.email);
  lines.push('');

  // Key fields
  if (fields.platform) lines.push(`Platform: ${fields.platform}`);
  if (fields.role) lines.push(`Role: ${fields.role}`);
  if (fields.format) lines.push(`Format: ${fields.format}`);
  if (fields.genres && fields.genres.length > 0) {
    lines.push(`Genres: ${fields.genres.join(', ')}`);
  }
  if (fields.contactMethod) lines.push(`Contact Method: ${fields.contactMethod}`);
  if (fields.bestTiming) lines.push(`Best Timing: ${fields.bestTiming}`);

  // Optional detailed fields
  if (fields.coverage) lines.push(`Coverage: ${fields.coverage}`);
  if (fields.submissionGuidelines) {
    lines.push(`\nSubmission Guidelines:\n${fields.submissionGuidelines}`);
  }
  if (fields.pitchTips && fields.pitchTips.length > 0) {
    lines.push(`\nPitch Tips:\n- ${fields.pitchTips.join('\n- ')}`);
  }
  if (fields.reasoning) {
    lines.push(`\nNotes: ${fields.reasoning}`);
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return lines.join('\n');
}

/**
 * Helper: Get compact summary for table displays
 * Returns one-line summary of most important info
 */
export function formatCompactSummary(fields: IntelligenceFields): string {
  const parts: string[] = [];

  if (fields.platform) parts.push(fields.platform);
  if (fields.role) parts.push(fields.role);
  if (fields.format) parts.push(fields.format);

  return parts.join(' · ') || 'No details available';
}

/**
 * Helper: Check if intelligence data is meaningful
 */
export function hasIntelligence(intelligence?: string): boolean {
  if (!intelligence) return false;
  if (intelligence === 'No intelligence found') return false;
  if (intelligence.includes('Enrichment failed')) return false;
  if (intelligence.includes('Processing error')) return false;
  return true;
}
