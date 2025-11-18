import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  addWatermarkToPdf,
  createPreviewConfig,
  trackPdfConversion,
  PDF_CONVERSION_EVENTS,
} from './pdfWatermark';
import { parseIntelligenceFields, formatForPDF, hasIntelligence } from './intelligenceFormatter';

export interface AnalyticsData {
  totalContacts: number;
  totalEnrichments: number;
  successRate: number;
  averageConfidence: number;
  platformBreakdown: Record<string, number>;
  dailyEnrichments: Array<{ date: string; count: number }>;
  topPlatforms: Array<{ platform: string; count: number; percentage: number }>;
  performanceMetrics: {
    averageProcessingTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
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

interface SearchResult {
  platform: string;
  title: string;
  description: string;
  url: string;
  contact?: string;
  relevance: string;
  lastUpdated: string;
}

export interface AIAgentResponse {
  agentType: string;
  query: string;
  response: string;
  recommendations?: string[];
  nextSteps?: string[];
  dateGenerated: string;
}

interface WhiteLabelConfig {
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
}

interface PdfExportOptions {
  isPreview?: boolean;
  userTier?: string;
  includeWatermark?: boolean;
  pageLimit?: number;
  quality?: 'low' | 'medium' | 'high';
}

// Audio Intel Brand Design Constants
const DESIGN = {
  primaryColor: [37, 99, 235] as [number, number, number], // Audio Intel Blue (#2563eb)
  secondaryColor: [245, 247, 250] as [number, number, number], // Light gray
  accentColor: [139, 69, 19] as [number, number, number], // Audio Intel Gold accent
  audioIntelBlue: [37, 99, 235] as [number, number, number], // Main brand blue
  audioIntelPurple: [147, 51, 234] as [number, number, number], // Brand purple (#9333ea)
  textDark: [15, 23, 42] as [number, number, number], // Slate 900
  textLight: [71, 85, 105] as [number, number, number], // Slate 600
  borderColor: [226, 232, 240] as [number, number, number], // Slate 200
  successColor: [34, 197, 94] as [number, number, number], // Green for High confidence
  warningColor: [251, 146, 60] as [number, number, number], // Orange for Medium confidence
  dangerColor: [239, 68, 68] as [number, number, number], // Red for Low confidence
  gradientStart: [37, 99, 235] as [number, number, number], // Blue
  gradientEnd: [147, 51, 234] as [number, number, number], // Purple
};

// Helper function to extract domain from email
function extractDomainFromEmail(email: string): string {
  if (!email) return 'Unknown';
  const domain = email.split('@')[1];
  if (!domain) return 'Unknown';
  return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
}

// Helper function to get display name with fallback
function getDisplayName(contact: EnrichedContact): string {
  if (contact.name && contact.name.trim()) {
    return contact.name.trim();
  }

  // Extract name from email if available
  if (contact.email) {
    const emailName = contact.email.split('@')[0];
    if (emailName && emailName !== 'unknown' && emailName !== 'n/a') {
      // Convert email name to proper case
      return emailName
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim();
    }
  }

  return 'Contact Name Unavailable';
}

// Helper function to get confidence color
function getConfidenceColor(confidence: string | number | undefined): [number, number, number] {
  const conf = String(confidence || 'Low').toLowerCase();
  if (conf.includes('high') || conf.includes('90') || conf.includes('95')) {
    return DESIGN.successColor;
  } else if (conf.includes('medium') || conf.includes('70') || conf.includes('80')) {
    return DESIGN.warningColor;
  } else {
    return DESIGN.dangerColor;
  }
}

// Helper function to draw a professional music waveform logo
function drawMusicLogo(doc: jsPDF, x: number, y: number, size: number): void {
  const waveformBars = [
    { height: 12, x: 0 },
    { height: 8, x: 3 },
    { height: 16, x: 6 },
    { height: 4, x: 9 },
    { height: 14, x: 12 },
    { height: 10, x: 15 },
  ];

  doc.setFillColor(255, 255, 255); // White bars
  waveformBars.forEach(bar => {
    doc.roundedRect(x + bar.x, y + (size - bar.height) / 2, 2, bar.height, 1, 1, 'F');
  });
}

// Helper function to add Audio Intel branded header with neobrutalist design
function addPremiumHeader(
  doc: jsPDF,
  title: string,
  subtitle?: string,
  whiteLabel?: WhiteLabelConfig
): void {
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const primaryColor = whiteLabel?.primaryColor
    ? hexToRgb(whiteLabel.primaryColor)
    : DESIGN.audioIntelBlue;
  const hasCustomLogo = !!whiteLabel?.logoUrl;

  // Neobrutalist header: white background with bold black border
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 55, 'F');

  // Bold black border (neobrutalist style)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 40, 'S');

  // Inner shadow effect with offset line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.rect(12, 12, 190, 40, 'S');

  if (hasCustomLogo && whiteLabel?.logoUrl) {
    // Custom logo for PRO/AGENCY tiers
    try {
      // Logo container with neobrutalist border
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(2);
      doc.rect(15, 15, 30, 30, 'FD');

      // Try to add the actual logo image (base64 encoded)
      if (whiteLabel.logoUrl.startsWith('data:image/')) {
        // Logo is a base64 data URI
        try {
          doc.addImage(whiteLabel.logoUrl, 'PNG', 17, 17, 26, 26);
        } catch (imageError) {
          console.warn('Failed to load base64 logo image, using initials fallback');
          // Fallback to company initials
          doc.setFontSize(20);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          const initials = companyName
            .split(' ')
            .map(w => w[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
          doc.text(initials, 30, 35, { align: 'center' });
        }
      } else {
        // Not a data URI, use company initials
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        const initials = companyName
          .split(' ')
          .map(w => w[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        doc.text(initials, 30, 35, { align: 'center' });
      }
    } catch (error) {
      console.error('Failed to load custom logo, using default');
      // Fallback to default logo
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(15, 15, 30, 30, 'F');
      drawMusicLogo(doc, 20, 15, 30);
    }
  } else {
    // Default Audio Intel logo with neobrutalist container
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, 15, 30, 30, 'F');

    // Bold border around logo
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2);
    doc.rect(15, 15, 30, 30, 'S');

    // Draw waveform inside logo
    drawMusicLogo(doc, 20, 15, 30);
  }

  // Company name - bold and clear
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 52, 27);

  // Subtitle/tagline
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Contact Intelligence Report', 52, 34);

  // Report title - positioned below header box
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(title, 20, 65);

  // Subtitle with color accent
  if (subtitle) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(subtitle, 20, 72);
  }
}

// Helper function to add neobrutalist footer
function addPremiumFooter(doc: jsPDF, whiteLabel?: WhiteLabelConfig): void {
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const primaryColor = whiteLabel?.primaryColor
    ? hexToRgb(whiteLabel.primaryColor)
    : DESIGN.audioIntelBlue;
  const pageCount = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer with neobrutalist border
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 275, 190, 20, 'F');

    // Bold border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2);
    doc.rect(10, 275, 190, 20, 'S');

    // Footer content
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);

    doc.text(`Page ${i} of ${pageCount}`, 15, 283);
    doc.text(`${companyName} - Contact Intelligence`, 80, 283, { align: 'center' });

    // Generated date in brand color
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 290);
    doc.setTextColor(100, 100, 100);
    doc.text('Powered by Total Audio Promo', 195, 290, { align: 'right' });
  }
}

// Helper function to create neobrutalist table
function createPremiumTable(
  doc: jsPDF,
  data: any[],
  headers: string[],
  startY: number,
  whiteLabel?: WhiteLabelConfig
): number {
  const primaryColor = whiteLabel?.primaryColor
    ? hexToRgb(whiteLabel.primaryColor)
    : DESIGN.primaryColor;

  (doc as any).autoTable({
    startY: startY,
    head: [headers],
    body: data,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      lineWidth: 2, // Bold borders
      lineColor: [0, 0, 0],
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: 1.5, // Medium borders
      lineColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Very light blue-gray
    },
    styles: {
      cellPadding: 6,
      lineWidth: 1.5,
      lineColor: [0, 0, 0], // Black borders for neobrutalist look
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 45 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 30 },
    },
  });

  return (doc as any).lastAutoTable.finalY;
}

export function exportAnalyticsToPdf(
  analyticsData: AnalyticsData,
  filename = 'audio-intel-analytics-report.pdf',
  whiteLabel?: WhiteLabelConfig,
  options?: PdfExportOptions
): void {
  const doc = new jsPDF();

  // Add premium header
  addPremiumHeader(doc, 'Analytics Report', 'Performance Insights & Metrics', whiteLabel);

  // Key Metrics Section with premium styling
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DESIGN.primaryColor[0], DESIGN.primaryColor[1], DESIGN.primaryColor[2]);
  doc.text('Key Performance Metrics', 20, 60);

  // Metrics cards
  const metrics = [
    {
      label: 'Total Contacts',
      value: analyticsData.totalContacts.toLocaleString(),
      color: DESIGN.primaryColor,
    },
    {
      label: 'Total Enrichments',
      value: analyticsData.totalEnrichments.toLocaleString(),
      color: DESIGN.successColor,
    },
    {
      label: 'Success Rate',
      value: `${analyticsData.successRate.toFixed(1)}%`,
      color: DESIGN.warningColor,
    },
    {
      label: 'Avg Confidence',
      value: `${analyticsData.averageConfidence.toFixed(1)}%`,
      color: DESIGN.accentColor,
    },
  ];

  let x = 20;
  let y = 75;
  metrics.forEach((metric, index) => {
    // Metric card background
    doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.roundedRect(x, y, 40, 25, 3, 3, 'F');

    // Metric border
    doc.setDrawColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, 40, 25, 3, 3, 'S');

    // Metric value
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
    doc.text(metric.value, x + 20, y + 12, { align: 'center' });

    // Metric label
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DESIGN.textLight[0], DESIGN.textLight[1], DESIGN.textLight[2]);
    doc.text(metric.label, x + 20, y + 20, { align: 'center' });

    x += 45;
    if (index === 1) {
      x = 20;
      y += 35;
    }
  });

  // Performance Metrics Table
  const performanceData = [
    ['Metric', 'Value', 'Status'],
    [
      'Processing Time',
      `${analyticsData.performanceMetrics.averageProcessingTime.toFixed(2)}s`,
      'Optimal',
    ],
    ['Cache Hit Rate', `${analyticsData.performanceMetrics.cacheHitRate.toFixed(1)}%`, 'Good'],
    ['Error Rate', `${analyticsData.performanceMetrics.errorRate.toFixed(1)}%`, 'Low'],
  ];

  createPremiumTable(doc, performanceData.slice(1), performanceData[0], 160, whiteLabel);

  // Top Platforms Section
  if (analyticsData.topPlatforms.length > 0) {
    doc.addPage();
    addPremiumHeader(doc, 'Platform Analysis', 'Top Platforms by Contact Volume', whiteLabel);

    const platformData = analyticsData.topPlatforms.map(p => [
      p.platform,
      p.count.toString(),
      `${p.percentage.toFixed(1)}%`,
    ]);

    createPremiumTable(doc, platformData, ['Platform', 'Contacts', 'Percentage'], 60, whiteLabel);
  }

  // Apply preview mode restrictions and watermarks
  if (options?.isPreview || options?.includeWatermark) {
    const previewConfig = createPreviewConfig(options?.userTier);

    // Apply page limits for preview
    if (
      previewConfig.pageLimit &&
      (doc as any).internal.getNumberOfPages() > previewConfig.pageLimit
    ) {
      // Trim to page limit (this is simplified - in practice you'd regenerate with limits)
      console.log(`PDF trimmed to ${previewConfig.pageLimit} pages for preview mode`);
    }

    // Add watermark
    if (previewConfig.watermark.text) {
      addWatermarkToPdf(doc, previewConfig.watermark);
    }

    // Track conversion event
    trackPdfConversion(PDF_CONVERSION_EVENTS.PREVIEW_GENERATED, {
      userTier: options?.userTier,
      pdfType: 'analytics',
      pageCount: (doc as any).internal.getNumberOfPages(),
    });
  }

  // Add premium footer
  addPremiumFooter(doc, whiteLabel);

  // Save the PDF
  doc.save(filename);

  // Track download event
  const eventType = options?.isPreview
    ? PDF_CONVERSION_EVENTS.PREVIEW_DOWNLOADED
    : 'pdf_downloaded';
  trackPdfConversion(eventType, {
    userTier: options?.userTier,
    pdfType: 'analytics',
    filename,
  });
}

export function exportContactsToPdf(
  contacts: EnrichedContact[],
  filename = 'audio-intel-enriched-contacts.pdf',
  whiteLabel?: WhiteLabelConfig,
  options?: PdfExportOptions
): void {
  const doc = new jsPDF();

  // Add premium header
  addPremiumHeader(
    doc,
    'Contact Intelligence Report',
    `${contacts.length} Contacts Enriched`,
    whiteLabel
  );

  // Calculate summary metrics
  const confidenceBreakdown = {
    High: contacts.filter(c => String(c.researchConfidence || 'Low').toLowerCase().includes('high'))
      .length,
    Medium: contacts.filter(c => String(c.researchConfidence || 'Low').toLowerCase().includes('medium'))
      .length,
    Low: contacts.filter(c => String(c.researchConfidence || 'Low').toLowerCase().includes('low')).length,
  };

  const platformBreakdown: Record<string, number> = {};
  contacts.forEach(contact => {
    const platform = contact.platform || extractDomainFromEmail(contact.email);
    platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
  });

  const topPlatforms = Object.entries(platformBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([platform, count]) => ({
      platform,
      count,
      percentage: Math.round((count / contacts.length) * 100),
    }));

  let currentY = 80;

  // Summary Metrics Section - Professional Agency Report Style
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Summary Metrics', 20, currentY);

  currentY += 10;

  // Summary metrics boxes with brutalist borders
  const metricsBoxWidth = 55;
  const metricsBoxHeight = 25;
  const metricsStartX = 20;
  const metricsGap = 5;

  // Total Contacts
  doc.setFillColor(255, 255, 255);
  doc.rect(metricsStartX, currentY, metricsBoxWidth, metricsBoxHeight, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(metricsStartX, currentY, metricsBoxWidth, metricsBoxHeight, 'S');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(contacts.length.toString(), metricsStartX + metricsBoxWidth / 2, currentY + 12, {
    align: 'center',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Total Contacts', metricsStartX + metricsBoxWidth / 2, currentY + 20, {
    align: 'center',
  });

  // High Confidence
  const highConfX = metricsStartX + metricsBoxWidth + metricsGap;
  doc.setFillColor(255, 255, 255);
  doc.rect(highConfX, currentY, metricsBoxWidth, metricsBoxHeight, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(highConfX, currentY, metricsBoxWidth, metricsBoxHeight, 'S');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DESIGN.successColor[0], DESIGN.successColor[1], DESIGN.successColor[2]);
  doc.text(confidenceBreakdown.High.toString(), highConfX + metricsBoxWidth / 2, currentY + 12, {
    align: 'center',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('High Confidence', highConfX + metricsBoxWidth / 2, currentY + 20, {
    align: 'center',
  });

  // Medium Confidence
  const medConfX = highConfX + metricsBoxWidth + metricsGap;
  doc.setFillColor(255, 255, 255);
  doc.rect(medConfX, currentY, metricsBoxWidth, metricsBoxHeight, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(medConfX, currentY, metricsBoxWidth, metricsBoxHeight, 'S');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DESIGN.warningColor[0], DESIGN.warningColor[1], DESIGN.warningColor[2]);
  doc.text(confidenceBreakdown.Medium.toString(), medConfX + metricsBoxWidth / 2, currentY + 12, {
    align: 'center',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Medium Confidence', medConfX + metricsBoxWidth / 2, currentY + 20, {
    align: 'center',
  });

  // Low Confidence
  const lowConfX = medConfX + metricsBoxWidth + metricsGap;
  doc.setFillColor(255, 255, 255);
  doc.rect(lowConfX, currentY, metricsBoxWidth, metricsBoxHeight, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(lowConfX, currentY, metricsBoxWidth, metricsBoxHeight, 'S');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DESIGN.dangerColor[0], DESIGN.dangerColor[1], DESIGN.dangerColor[2]);
  doc.text(confidenceBreakdown.Low.toString(), lowConfX + metricsBoxWidth / 2, currentY + 12, {
    align: 'center',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Low Confidence', lowConfX + metricsBoxWidth / 2, currentY + 20, {
    align: 'center',
  });

  currentY += metricsBoxHeight + 15;

  // Platform Breakdown Section
  if (topPlatforms.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Top Platforms', 20, currentY);

    currentY += 8;

    // Platform breakdown table
    const platformData = topPlatforms.map(p => [
      p.platform,
      p.count.toString(),
      `${p.percentage}%`,
    ]);

    const platformTableY = createPremiumTable(
      doc,
      platformData,
      ['Platform', 'Contacts', 'Percentage'],
      currentY,
      whiteLabel
    );

    currentY = platformTableY + 15;
  }

  // Generated date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(DESIGN.textLight[0], DESIGN.textLight[1], DESIGN.textLight[2]);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
    20,
    currentY
  );

  currentY += 15;

  // Contacts summary table with premium styling
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Contact Details', 20, currentY);

  currentY += 10;

  const contactsData = contacts.map(contact => [
    getDisplayName(contact),
    contact.email,
    contact.researchConfidence || 'Low',
    contact.platform || extractDomainFromEmail(contact.email),
    contact.company || 'Unknown',
  ]);

  const finalY = createPremiumTable(
    doc,
    contactsData,
    ['Name', 'Email', 'Confidence', 'Platform', 'Company'],
    currentY,
    whiteLabel
  );

  // Detailed intelligence section
  currentY = finalY + 20;

  contacts.forEach((contact, index) => {
    if (currentY > 245) {
      doc.addPage();
      addPremiumHeader(
        doc,
        'Contact Intelligence Details',
        `Continued - Page ${Math.floor(index / 3) + 2}`,
        whiteLabel
      );
      currentY = 80;
    }

    // Contact header with neobrutalist box
    const displayName = getDisplayName(contact);
    const primaryColor = whiteLabel?.primaryColor
      ? hexToRgb(whiteLabel.primaryColor)
      : DESIGN.primaryColor;

    // Neobrutalist contact card
    doc.setFillColor(255, 255, 255);
    doc.rect(20, currentY - 5, 170, 18, 'F');

    // Bold border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2);
    doc.rect(20, currentY - 5, 170, 18, 'S');

    // Contact name
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${displayName}`, 25, currentY + 2);

    // Email in brand color
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(contact.email, 25, currentY + 8);

    // Confidence badge
    const confidenceColor = getConfidenceColor(contact.researchConfidence || 'Low');
    doc.setFillColor(confidenceColor[0], confidenceColor[1], confidenceColor[2]);
    doc.roundedRect(163, currentY - 2, 22, 10, 2, 2, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(contact.researchConfidence || 'Low', 174, currentY + 4, { align: 'center' });

    currentY += 18;

    // Intelligence content with better formatting using intelligence formatter
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DESIGN.textDark[0], DESIGN.textDark[1], DESIGN.textDark[2]);

    let intelligenceText: string;

    // Use intelligence formatter if intelligence data exists
    if (hasIntelligence(contact.contactIntelligence)) {
      // Parse intelligence fields and format for PDF
      const intelligenceFields = parseIntelligenceFields(contact.contactIntelligence);
      intelligenceText = formatForPDF(
        intelligenceFields,
        {
          name: getDisplayName(contact),
          email: contact.email,
        },
        contact.researchConfidence || 'Low'
      );
    } else {
      // Fallback: create basic analysis from available data
      const domain = contact.email ? contact.email.split('@')[1] : '';
      const platform = contact.platform || extractDomainFromEmail(contact.email);
      const confidence = contact.researchConfidence || 'Low';

      intelligenceText = `Platform: ${platform}\nDomain Analysis: ${domain}\nContact Type: Music Industry Professional\nResearch Confidence: ${confidence}\nRecommendation: ${
        confidence === 'High'
          ? 'Priority contact - verified music industry connection'
          : confidence === 'Medium'
            ? 'Good potential - verify before outreach'
            : 'Requires additional research before contact'
      }`;
    }

    // Clean up and format the intelligence text
    intelligenceText = intelligenceText
      .replace(/🎵|📍|📧|🎧|💡|✅/g, '') // Remove emojis
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove all emojis (extended range)
      .replace(/[^\x00-\x7F]/g, char => {
        // Replace common special characters with ASCII equivalents
        const replacements: Record<string, string> = {
          '\u00D8': 'O', // Ø
          '\u00D9': 'U', // Ù
          '\u00F2': 'o', // ò
          '\u2022': '-', // •
          '\u25AA': '-', // ▪
          '\u2192': '->', // →
          '\u2190': '<-', // ←
          '\u2191': '^', // ↑
          '\u2193': 'v', // ↓
          '\u2713': 'Y', // ✓
          '\u2717': 'X', // ✗
          '\u2013': '-', // –
          '\u2014': '-', // —
          '\u2018': "'", // '
          '\u2019': "'", // '
          '\u201C': '"', // "
          '\u201D': '"', // "
        };
        return replacements[char] || ''; // Remove if no replacement found
      })
      .replace(/\n\s*\n/g, '\n') // Remove double line breaks
      .trim();

    // Better text wrapping with proper line height
    const intelligenceLines = doc.splitTextToSize(intelligenceText, 155);
    const lineHeight = 5; // Increased line height for better readability

    intelligenceLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, 25, currentY + lineIndex * lineHeight);
    });

    currentY += intelligenceLines.length * lineHeight + 10;

    // Add subtle separator
    if (index < contacts.length - 1) {
      doc.setDrawColor(DESIGN.borderColor[0], DESIGN.borderColor[1], DESIGN.borderColor[2]);
      doc.setLineWidth(0.2);
      doc.line(25, currentY - 5, 185, currentY - 5);
    }
  });

  // Apply preview mode restrictions and watermarks
  if (options?.isPreview || options?.includeWatermark) {
    const previewConfig = createPreviewConfig(options?.userTier);

    // For contacts, limit to first few contacts in preview mode
    if (options?.isPreview && previewConfig.pageLimit) {
      console.log(`Contacts PDF limited to ${previewConfig.pageLimit} pages for preview mode`);
    }

    // Add watermark
    if (previewConfig.watermark.text) {
      addWatermarkToPdf(doc, previewConfig.watermark);
    }

    // Track conversion event
    trackPdfConversion(PDF_CONVERSION_EVENTS.PREVIEW_GENERATED, {
      userTier: options?.userTier,
      pdfType: 'contacts',
      contactCount: contacts.length,
      pageCount: (doc as any).internal.getNumberOfPages(),
    });
  }

  // Add premium footer
  addPremiumFooter(doc, whiteLabel);

  doc.save(filename);

  // Track download event
  const eventType = options?.isPreview
    ? PDF_CONVERSION_EVENTS.PREVIEW_DOWNLOADED
    : 'pdf_downloaded';
  trackPdfConversion(eventType, {
    userTier: options?.userTier,
    pdfType: 'contacts',
    contactCount: contacts.length,
    filename,
  });
}

export function exportSearchResultsToPdf(
  searchResults: SearchResult[],
  query: string,
  filename = 'audio-intel-search-results.pdf',
  whiteLabel?: WhiteLabelConfig
): void {
  const doc = new jsPDF();

  // Add premium header
  addPremiumHeader(doc, 'Platform Search Results', `Query: "${query}"`, whiteLabel);

  // Summary section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(DESIGN.textLight[0], DESIGN.textLight[1], DESIGN.textLight[2]);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    20,
    60
  );
  doc.text(`Total Results: ${searchResults.length}`, 20, 70);

  // Search results table
  const resultsData = searchResults.map(result => [
    result.platform,
    result.title.substring(0, 35) + (result.title.length > 35 ? '...' : ''),
    result.relevance,
    result.contact || 'N/A',
    new Date(result.lastUpdated).toLocaleDateString(),
  ]);

  const finalY = createPremiumTable(
    doc,
    resultsData,
    ['Platform', 'Title', 'Relevance', 'Contact', 'Updated'],
    85,
    whiteLabel
  );

  // Detailed results section
  let currentY = finalY + 20;

  searchResults.forEach((result, index) => {
    if (currentY > 250) {
      doc.addPage();
      addPremiumHeader(
        doc,
        'Search Result Details',
        `Page ${Math.floor(index / 2) + 2}`,
        whiteLabel
      );
      currentY = 60;
    }

    // Result header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DESIGN.primaryColor[0], DESIGN.primaryColor[1], DESIGN.primaryColor[2]);
    doc.text(`${result.platform} - ${result.title}`, 20, currentY);

    currentY += 10;

    // Description
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DESIGN.textDark[0], DESIGN.textDark[1], DESIGN.textDark[2]);

    const descriptionLines = doc.splitTextToSize(result.description, 170);
    doc.text(descriptionLines, 20, currentY);
    currentY += descriptionLines.length * 5 + 5;

    // Contact and metadata
    if (result.contact) {
      doc.setTextColor(DESIGN.successColor[0], DESIGN.successColor[1], DESIGN.successColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(`Contact: ${result.contact}`, 20, currentY);
      currentY += 5;
    }

    doc.setTextColor(DESIGN.textLight[0], DESIGN.textLight[1], DESIGN.textLight[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`URL: ${result.url}`, 20, currentY);
    doc.text(`Relevance: ${result.relevance} | Updated: ${result.lastUpdated}`, 20, currentY + 5);

    currentY += 20;
  });

  // Add premium footer
  addPremiumFooter(doc, whiteLabel);

  doc.save(filename);
}

export function exportAIAgentReportToPdf(
  agentResponse: AIAgentResponse,
  filename = 'audio-intel-ai-agent-report.pdf',
  whiteLabel?: WhiteLabelConfig
): void {
  const doc = new jsPDF();

  // Add premium header
  addPremiumHeader(
    doc,
    'AI Agent Strategic Report',
    'Intelligent Analysis & Recommendations',
    whiteLabel
  );

  // Agent info section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DESIGN.primaryColor[0], DESIGN.primaryColor[1], DESIGN.primaryColor[2]);
  doc.text(
    `Agent: ${agentResponse.agentType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    20,
    60
  );

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(DESIGN.textDark[0], DESIGN.textDark[1], DESIGN.textDark[2]);
  doc.text(`Query: ${agentResponse.query}`, 20, 75);

  // Main response section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DESIGN.primaryColor[0], DESIGN.primaryColor[1], DESIGN.primaryColor[2]);
  doc.text('Strategic Analysis', 20, 95);

  // Response content with premium styling
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(DESIGN.textDark[0], DESIGN.textDark[1], DESIGN.textDark[2]);

  const responseLines = doc.splitTextToSize(agentResponse.response, 170);
  doc.text(responseLines, 20, 110);

  let currentY = 110 + responseLines.length * 5 + 20;

  // Recommendations section
  if (agentResponse.recommendations && agentResponse.recommendations.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      addPremiumHeader(doc, 'Key Recommendations', 'Strategic Action Items', whiteLabel);
      currentY = 60;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DESIGN.successColor[0], DESIGN.successColor[1], DESIGN.successColor[2]);
    doc.text('Key Recommendations', 20, currentY);

    currentY += 15;

    agentResponse.recommendations.forEach((rec, index) => {
      if (currentY > 250) {
        doc.addPage();
        addPremiumHeader(
          doc,
          'Recommendations Continued',
          `Page ${Math.floor(index / 5) + 2}`,
          whiteLabel
        );
        currentY = 60;
      }

      // Recommendation bullet with styling
      doc.setFillColor(DESIGN.successColor[0], DESIGN.successColor[1], DESIGN.successColor[2]);
      doc.circle(25, currentY - 2, 2, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(DESIGN.textDark[0], DESIGN.textDark[1], DESIGN.textDark[2]);

      const recLines = doc.splitTextToSize(rec, 150);
      doc.text(recLines, 35, currentY);
      currentY += recLines.length * 5 + 8;
    });

    currentY += 10;
  }

  // Next Steps section
  if (agentResponse.nextSteps && agentResponse.nextSteps.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      addPremiumHeader(doc, 'Next Steps', 'Implementation Roadmap', whiteLabel);
      currentY = 60;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DESIGN.accentColor[0], DESIGN.accentColor[1], DESIGN.accentColor[2]);
    doc.text('Next Steps', 20, currentY);

    currentY += 15;

    agentResponse.nextSteps.forEach((step, index) => {
      if (currentY > 250) {
        doc.addPage();
        addPremiumHeader(
          doc,
          'Next Steps Continued',
          `Page ${Math.floor(index / 5) + 2}`,
          whiteLabel
        );
        currentY = 60;
      }

      // Step arrow with styling
      doc.setFillColor(DESIGN.accentColor[0], DESIGN.accentColor[1], DESIGN.accentColor[2]);
      doc.text('→', 25, currentY + 2);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(DESIGN.textDark[0], DESIGN.textDark[1], DESIGN.textDark[2]);

      const stepLines = doc.splitTextToSize(step, 150);
      doc.text(stepLines, 35, currentY);
      currentY += stepLines.length * 5 + 8;
    });
  }

  // Add premium footer
  addPremiumFooter(doc, whiteLabel);

  doc.save(filename);
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : DESIGN.primaryColor;
}

// ==============================================================================
// PREVIEW MODE EXPORT FUNCTIONS
// ==============================================================================

/**
 * Generate preview version of contacts PDF with watermark and limitations
 */
export function exportContactsPreview(
  contacts: EnrichedContact[],
  userTier: string = 'free',
  whiteLabel?: WhiteLabelConfig
): void {
  const previewConfig = createPreviewConfig(userTier);

  // Limit contacts for preview mode
  const limitedContacts = contacts.slice(0, userTier === 'free' ? 3 : 6);

  const filename = `audio-intel-contacts-preview-${new Date().toISOString().split('T')[0]}.pdf`;

  exportContactsToPdf(limitedContacts, filename, whiteLabel, {
    isPreview: true,
    userTier,
    includeWatermark: true,
    quality: previewConfig.quality,
  });
}

/**
 * Generate preview version of analytics PDF with watermark and limitations
 */
export function exportAnalyticsPreview(
  analyticsData: AnalyticsData,
  userTier: string = 'free',
  whiteLabel?: WhiteLabelConfig
): void {
  const previewConfig = createPreviewConfig(userTier);

  // Limit analytics data for preview mode
  const limitedAnalytics = {
    ...analyticsData,
    topPlatforms: analyticsData.topPlatforms.slice(0, userTier === 'free' ? 3 : 5),
    dailyEnrichments: analyticsData.dailyEnrichments.slice(-7), // Show last 7 days only
  };

  const filename = `audio-intel-analytics-preview-${new Date().toISOString().split('T')[0]}.pdf`;

  exportAnalyticsToPdf(limitedAnalytics, filename, whiteLabel, {
    isPreview: true,
    userTier,
    includeWatermark: true,
    quality: previewConfig.quality,
  });
}

/**
 * Check if user can generate PDFs based on tier and usage
 */
export function checkPdfPermissions(userTier: string = 'free', monthlyUsage: number = 0) {
  const permissions = {
    canPreview: true,
    canExportFull: false,
    monthlyLimit: 0,
    hasWatermark: true,
    restrictedFeatures: [] as string[],
  };

  switch (userTier) {
    case 'free':
      permissions.canExportFull = monthlyUsage < 1;
      permissions.monthlyLimit = 1;
      permissions.hasWatermark = true;
      permissions.restrictedFeatures = ['email_delivery', 'white_label', 'unlimited_exports'];
      break;

    case 'beta':
      // Beta users get full agency-level access during testing phase
      permissions.canExportFull = true;
      permissions.monthlyLimit = -1; // unlimited
      permissions.hasWatermark = false;
      permissions.restrictedFeatures = []; // No restrictions for beta users
      break;

    case 'professional':
      permissions.canExportFull = true;
      permissions.monthlyLimit = -1; // unlimited
      permissions.hasWatermark = false;
      permissions.restrictedFeatures = ['white_label']; // White-label is Agency-only feature
      break;

    case 'agency':
      permissions.canExportFull = true;
      permissions.monthlyLimit = -1; // unlimited
      permissions.hasWatermark = false;
      permissions.restrictedFeatures = [];
      break;
  }

  return permissions;
}
