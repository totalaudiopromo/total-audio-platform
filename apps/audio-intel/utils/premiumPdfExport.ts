/**
 * PREMIUM WHITE-LABEL PDF EXPORT SYSTEM
 * Professional quality PDFs for PR agencies
 * Brutalist design with Audio Intel pink (#FF006B) or custom branding
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Audio Intel Brand Colors (Brutalist Design)
const BRAND = {
  audioIntelPink: [255, 0, 107] as [number, number, number], // #FF006B
  black: [0, 0, 0] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  gray900: [17, 24, 39] as [number, number, number],
  gray700: [55, 65, 81] as [number, number, number],
  gray500: [107, 114, 128] as [number, number, number],
  gray300: [209, 213, 219] as [number, number, number],
  gray100: [243, 244, 246] as [number, number, number],
  // Confidence colors
  successGreen: [34, 197, 94] as [number, number, number],
  warningOrange: [251, 146, 60] as [number, number, number],
  dangerRed: [239, 68, 68] as [number, number, number],
};

export interface WhiteLabelBranding {
  agencyName?: string;
  logoDataUrl?: string; // Base64 encoded image
  primaryColor?: string; // Hex color (#FF006B)
  secondaryColor?: string;
  website?: string;
  contactEmail?: string;
}

export interface EnrichedContact {
  name: string;
  email: string;
  contactIntelligence: string;
  researchConfidence: string;
  lastResearched: string;
  platform?: string;
  role?: string;
  company?: string;
}

/**
 * Helper: Convert hex color to RGB tuple
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return BRAND.audioIntelPink;

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
}

/**
 * Helper: Get confidence badge color
 */
function getConfidenceColor(confidence: string): [number, number, number] {
  const conf = confidence.toLowerCase();
  if (conf.includes('high') || conf.includes('90') || conf.includes('95')) {
    return BRAND.successGreen;
  } else if (conf.includes('medium') || conf.includes('70') || conf.includes('80')) {
    return BRAND.warningOrange;
  } else {
    return BRAND.dangerRed;
  }
}

/**
 * Helper: Extract display name with fallback
 */
function getDisplayName(contact: EnrichedContact): string {
  if (contact.name && contact.name.trim()) {
    return contact.name.trim();
  }

  // Fallback to email name
  if (contact.email) {
    const emailName = contact.email.split('@')[0];
    if (emailName && emailName !== 'unknown' && emailName !== 'n/a') {
      return emailName
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim();
    }
  }

  return 'Contact Name Unavailable';
}

/**
 * PREMIUM BRUTALIST HEADER - Agency white-label ready
 */
function addPremiumBrutalistHeader(
  doc: jsPDF,
  title: string,
  subtitle: string,
  branding?: WhiteLabelBranding
): void {
  const agencyName = branding?.agencyName || 'Audio Intel';
  const primaryColor = branding?.primaryColor ? hexToRgb(branding.primaryColor) : BRAND.audioIntelPink;

  // WHITE BACKGROUND - full width
  doc.setFillColor(...BRAND.white);
  doc.rect(0, 0, 210, 60, 'F');

  // HEADER CONTAINER - brutal black border
  doc.setDrawColor(...BRAND.black);
  doc.setLineWidth(4);
  doc.rect(10, 10, 190, 45, 'S');

  // OFFSET SHADOW (brutalist style)
  doc.setDrawColor(...BRAND.gray700);
  doc.setLineWidth(4);
  doc.rect(12, 12, 190, 45, 'S');

  // LOGO / BRAND MARK AREA
  if (branding?.logoDataUrl) {
    // Custom agency logo
    try {
      doc.addImage(branding.logoDataUrl, 'PNG', 18, 18, 28, 28);
    } catch (error) {
      console.warn('Failed to load logo, using initials');
      // Fallback to initials
      const initials = agencyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      doc.setFillColor(...primaryColor);
      doc.rect(18, 18, 28, 28, 'F');
      doc.setDrawColor(...BRAND.black);
      doc.setLineWidth(3);
      doc.rect(18, 18, 28, 28, 'S');

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...BRAND.white);
      doc.text(initials, 32, 36, { align: 'center' });
    }
  } else {
    // Default Audio Intel brutalist logo
    doc.setFillColor(...primaryColor);
    doc.rect(18, 18, 28, 28, 'F');

    // Black border around logo
    doc.setDrawColor(...BRAND.black);
    doc.setLineWidth(3);
    doc.rect(18, 18, 28, 28, 'S');

    // "AI" text in white
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.white);
    doc.text('AI', 32, 36, { align: 'center' });
  }

  // AGENCY NAME - big, bold, black
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.black);
  doc.text(agencyName.toUpperCase(), 54, 28);

  // TAGLINE - smaller, colored
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CONTACT INTELLIGENCE REPORT', 54, 36);

  // WEBSITE/EMAIL (if provided)
  if (branding?.website) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.gray700);
    doc.text(branding.website.replace('https://', ''), 54, 42);
  }

  // REPORT TITLE - below header box
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.black);
  doc.text(title.toUpperCase(), 15, 72);

  // SUBTITLE - brand color
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(subtitle, 15, 80);
}

/**
 * PREMIUM BRUTALIST FOOTER
 */
function addPremiumBrutalistFooter(
  doc: jsPDF,
  branding?: WhiteLabelBranding
): void {
  const agencyName = branding?.agencyName || 'Audio Intel';
  const primaryColor = branding?.primaryColor ? hexToRgb(branding.primaryColor) : BRAND.audioIntelPink;
  const pageCount = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // FOOTER CONTAINER
    doc.setFillColor(...BRAND.white);
    doc.rect(10, 275, 190, 20, 'F');

    // BLACK BORDER - brutal style
    doc.setDrawColor(...BRAND.black);
    doc.setLineWidth(3);
    doc.rect(10, 275, 190, 20, 'S');

    // PAGE NUMBER - left side
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.black);
    doc.text(`PAGE ${i} OF ${pageCount}`, 15, 283);

    // AGENCY NAME - center
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(agencyName.toUpperCase(), 105, 283, { align: 'center' });

    // GENERATED DATE - bottom left
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.gray700);
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    doc.text(`Generated ${dateStr}`, 15, 290);

    // POWERED BY (unless white-label)
    if (!branding?.agencyName) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...BRAND.gray500);
      doc.text('Powered by Total Audio Promo', 195, 290, { align: 'right' });
    } else {
      // Agency contact
      if (branding.contactEmail) {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...BRAND.gray700);
        doc.text(branding.contactEmail, 195, 290, { align: 'right' });
      }
    }
  }
}

/**
 * CONTACT CARD - Brutalist design with clean intelligence section
 */
function drawContactCard(
  doc: jsPDF,
  contact: EnrichedContact,
  y: number,
  branding?: WhiteLabelBranding
): number {
  const displayName = getDisplayName(contact);
  const primaryColor = branding?.primaryColor ? hexToRgb(branding.primaryColor) : BRAND.audioIntelPink;
  const confidenceColor = getConfidenceColor(contact.researchConfidence || 'Low');

  // CARD CONTAINER - white background with brutal border
  doc.setFillColor(...BRAND.white);
  doc.rect(15, y, 180, 24, 'F');

  // BRUTAL BLACK BORDER
  doc.setDrawColor(...BRAND.black);
  doc.setLineWidth(3);
  doc.rect(15, y, 180, 24, 'S');

  // OFFSET SHADOW
  doc.setDrawColor(...BRAND.gray500);
  doc.setLineWidth(2);
  doc.rect(16, y + 1, 180, 24, 'S');

  // CONTACT NAME - big and bold
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.black);
  doc.text(displayName, 20, y + 8);

  // EMAIL - brand color
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(contact.email, 20, y + 14);

  // PLATFORM/COMPANY - gray
  const metaInfo = [contact.platform, contact.company].filter(Boolean).join(' • ');
  if (metaInfo) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.gray700);
    doc.text(metaInfo, 20, y + 19);
  }

  // CONFIDENCE BADGE - top right corner, brutal style
  const badgeWidth = 32;
  const badgeHeight = 12;
  const badgeX = 160;
  const badgeY = y + 4;

  // Badge background
  doc.setFillColor(...confidenceColor);
  doc.rect(badgeX, badgeY, badgeWidth, badgeHeight, 'F');

  // Badge border
  doc.setDrawColor(...BRAND.black);
  doc.setLineWidth(2);
  doc.rect(badgeX, badgeY, badgeWidth, badgeHeight, 'S');

  // Badge text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.white);
  const badgeText = (contact.researchConfidence || 'LOW').toUpperCase();
  doc.text(badgeText, badgeX + badgeWidth / 2, badgeY + 8, { align: 'center' });

  return y + 24 + 5; // Return next Y position
}

/**
 * INTELLIGENCE SECTION - Clean formatted text
 */
function drawIntelligenceSection(
  doc: jsPDF,
  contact: EnrichedContact,
  y: number
): number {
  let intelligenceText = contact.contactIntelligence;

  // Generate fallback intelligence if empty
  if (!intelligenceText || intelligenceText.trim() === '' ||
      intelligenceText === 'No intelligence available for this contact.') {
    const platform = contact.platform || 'Unknown Platform';
    const company = contact.company || 'Unknown Company';
    const confidence = contact.researchConfidence || 'Low';

    intelligenceText = `${platform} contact at ${company}.\n\nResearch Confidence: ${confidence}\n\n${
      confidence === 'High'
        ? 'Priority contact - verified music industry connection. Ready for outreach.'
        : confidence === 'Medium'
        ? 'Good potential contact. Verify details before outreach.'
        : 'Requires additional research before contact. Cross-reference with LinkedIn.'
    }`;
  }

  // Clean up text - remove emojis and special characters
  intelligenceText = intelligenceText
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
    .replace(/\n\s*\n/g, '\n') // Remove double linebreaks
    .trim();

  // INTELLIGENCE BOX
  doc.setFillColor(...BRAND.gray100);

  const intelligenceLines = doc.splitTextToSize(intelligenceText, 170);
  const boxHeight = (intelligenceLines.length * 5) + 10;

  doc.rect(15, y, 180, boxHeight, 'F');

  // Border
  doc.setDrawColor(...BRAND.gray300);
  doc.setLineWidth(2);
  doc.rect(15, y, 180, boxHeight, 'S');

  // Text
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.gray900);

  intelligenceLines.forEach((line: string, idx: number) => {
    doc.text(line, 20, y + 8 + (idx * 5));
  });

  return y + boxHeight + 10; // Return next Y position
}

/**
 * MAIN EXPORT FUNCTION - White-label contacts PDF
 */
export function exportWhiteLabelContactsPdf(
  contacts: EnrichedContact[],
  branding?: WhiteLabelBranding,
  filename?: string
): void {
  const doc = new jsPDF();
  const agencyName = branding?.agencyName || 'Audio Intel';

  // COVER PAGE
  addPremiumBrutalistHeader(
    doc,
    'Enriched Contact Intelligence',
    `${contacts.length} Professional Music Industry Contacts`,
    branding
  );

  // SUMMARY STATS BOX
  const highConfidence = contacts.filter(c =>
    (c.researchConfidence || '').toLowerCase().includes('high')
  ).length;

  doc.setFillColor(...BRAND.gray100);
  doc.rect(15, 92, 180, 30, 'F');
  doc.setDrawColor(...BRAND.black);
  doc.setLineWidth(3);
  doc.rect(15, 92, 180, 30, 'S');

  // Stats content
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.black);
  doc.text('REPORT SUMMARY', 20, 100);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.gray900);
  doc.text(`Total Contacts: ${contacts.length}`, 20, 107);
  doc.text(`High Confidence: ${highConfidence}`, 20, 113);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })}`, 120, 107);
  doc.text(`Agency: ${agencyName}`, 120, 113);

  // CONTACT CARDS - starting on page 2
  let currentY = 130;
  let pageNum = 1;

  contacts.forEach((contact, index) => {
    // Check if we need a new page
    if (currentY > 240) {
      doc.addPage();
      pageNum++;
      addPremiumBrutalistHeader(
        doc,
        'Enriched Contact Intelligence',
        `Continued - Page ${pageNum}`,
        branding
      );
      currentY = 92;
    }

    // Draw contact card
    currentY = drawContactCard(doc, contact, currentY, branding);

    // Draw intelligence section
    if (currentY > 240) {
      doc.addPage();
      pageNum++;
      addPremiumBrutalistHeader(
        doc,
        'Enriched Contact Intelligence',
        `Continued - Page ${pageNum}`,
        branding
      );
      currentY = 92;
    }

    currentY = drawIntelligenceSection(doc, contact, currentY);
    currentY += 8; // Space before next contact
  });

  // Add footer to all pages
  addPremiumBrutalistFooter(doc, branding);

  // Save PDF
  const finalFilename = filename ||
    `${(branding?.agencyName || 'audio-intel').toLowerCase().replace(/\s+/g, '-')}-contacts-${new Date().toISOString().split('T')[0]}.pdf`;

  doc.save(finalFilename);

  console.log(`✅ Premium PDF exported: ${finalFilename}`);
}

/**
 * QUICK EXPORT - For demo/testing
 */
export function exportDemoContactsPdf(): void {
  const demoContacts: EnrichedContact[] = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bbc.co.uk',
      contactIntelligence: 'BBC Radio 1 producer with focus on new music. Previously worked at BBC Radio 6 Music. Strong track record supporting emerging UK artists. Best contact time: Tue-Thu mornings.',
      researchConfidence: 'High',
      lastResearched: '2025-10-17',
      platform: 'BBC Radio 1',
      role: 'Producer',
      company: 'BBC'
    },
    {
      name: 'Tom Davies',
      email: 'tom@spotify.com',
      contactIntelligence: 'Spotify UK editorial team. Curates "New Music Friday UK" and "The Rock List". Open to submissions via official Spotify for Artists platform.',
      researchConfidence: 'Medium',
      lastResearched: '2025-10-17',
      platform: 'Spotify',
      role: 'Editorial',
      company: 'Spotify UK'
    },
    {
      name: 'Emma Williams',
      email: 'emma.williams@kerrrang.com',
      contactIntelligence: 'Kerrang! Radio presenter and music journalist. Covers rock, metal, and alternative scenes. Active on Twitter/X for submissions.',
      researchConfidence: 'High',
      lastResearched: '2025-10-17',
      platform: 'Kerrang! Radio',
      role: 'Presenter',
      company: 'Kerrang!'
    }
  ];

  const demoBranding: WhiteLabelBranding = {
    agencyName: 'Liberty Promotions',
    primaryColor: '#FF006B',
    website: 'liberty-promotions.co.uk',
    contactEmail: 'dan@liberty-promotions.co.uk'
  };

  exportWhiteLabelContactsPdf(demoContacts, demoBranding);
}
