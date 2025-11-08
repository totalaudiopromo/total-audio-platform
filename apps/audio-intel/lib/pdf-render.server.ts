import 'server-only';

import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

// Dynamically import the template component to avoid client bundling
function getTemplateComponent() {
  // Use require to avoid static analysis
  const templateModule = require('./pdf-brutalist-template');
  return templateModule.BrutalistPDFTemplate;
}

export interface BrutalistPDFContact {
  name: string;
  email: string;
  contactIntelligence?: string;
  researchConfidence?: string;
  platform?: string;
  role?: string;
  company?: string;
  lastResearched?: string;
}

export interface BrutalistPDFMetrics {
  total: number;
  high: number;
  medium: number;
  low: number;
  platforms: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

interface WhiteLabelConfig {
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
}

/**
 * Render the PDF template to HTML string (server-only)
 */
export function renderPDFTemplate(
  contacts: BrutalistPDFContact[],
  metrics: BrutalistPDFMetrics,
  whiteLabel?: WhiteLabelConfig
): string {
  const BrutalistPDFTemplate = getTemplateComponent();
  return renderToStaticMarkup(
    React.createElement(BrutalistPDFTemplate, {
      contacts,
      metrics,
      whiteLabel,
    })
  );
}

/**
 * Helper function to calculate metrics from contacts
 */
export function calculateMetrics(contacts: BrutalistPDFContact[]): BrutalistPDFMetrics {
  const confidenceBreakdown = {
    high: 0,
    medium: 0,
    low: 0,
  };

  const platformBreakdown: Record<string, number> = {};

  contacts.forEach(contact => {
    const confidence = (contact.researchConfidence || 'Low').toLowerCase();
    if (confidence.includes('high')) {
      confidenceBreakdown.high++;
    } else if (confidence.includes('medium')) {
      confidenceBreakdown.medium++;
    } else {
      confidenceBreakdown.low++;
    }

    const platform = contact.platform || extractDomainFromEmail(contact.email);
    platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
  });

  const topPlatforms = Object.entries(platformBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([platform, count]) => ({
      name: platform,
      count,
      percentage: Math.round((count / contacts.length) * 100),
    }));

  return {
    total: contacts.length,
    high: confidenceBreakdown.high,
    medium: confidenceBreakdown.medium,
    low: confidenceBreakdown.low,
    platforms: topPlatforms,
  };
}

/**
 * Extract domain from email address
 */
function extractDomainFromEmail(email: string): string {
  const match = email.match(/@(.+)/);
  return match ? match[1] : 'Unknown';
}
