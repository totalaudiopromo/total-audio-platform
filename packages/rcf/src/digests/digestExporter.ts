/**
 * Digest Exporter
 * Export digests as markdown, HTML, or PDF spec
 */

import type { RCFDigest } from './digestEngine';
import { getLogger } from '../utils/logger';

const logger = getLogger('[DigestExporter]');

export function exportAsMarkdown(digest: RCFDigest): string {
  let md = `# RCF ${digest.period === 'daily' ? 'Daily' : 'Weekly'} Digest\n\n`;
  md += `**Period**: ${digest.start_date} - ${digest.end_date}\n\n`;
  md += `## Top Events\n\n`;

  for (const event of digest.top_events) {
    md += `- **${event.event_type}**: ${event.artist_slug || 'Unknown'} (weight: ${event.weight})\n`;
  }

  return md;
}

export function exportAsHTML(digest: RCFDigest): string {
  return `<html><body>${exportAsMarkdown(digest).replace(/\n/g, '<br>')}</body></html>`;
}

export function exportAsPDFSpec(digest: RCFDigest): Record<string, unknown> {
  return {
    format: 'pdf',
    title: `RCF ${digest.period} Digest`,
    content: digest,
  };
}

export default { exportAsMarkdown, exportAsHTML, exportAsPDFSpec };
