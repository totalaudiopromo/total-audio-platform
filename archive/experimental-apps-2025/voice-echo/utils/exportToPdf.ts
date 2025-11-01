import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface AnalyticsData {
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

interface EnrichedContact {
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

interface AIAgentResponse {
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

// Premium design constants
const DESIGN = {
  primaryColor: [30, 136, 229] as [number, number, number], // Blue
  secondaryColor: [245, 247, 250] as [number, number, number], // Light gray
  accentColor: [255, 193, 7] as [number, number, number], // Gold
  textDark: [33, 37, 41] as [number, number, number],
  textLight: [108, 117, 125] as [number, number, number],
  borderColor: [222, 226, 230] as [number, number, number],
  successColor: [40, 167, 69] as [number, number, number],
  warningColor: [255, 193, 7] as [number, number, number],
  dangerColor: [220, 53, 69] as [number, number, number],
};

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
function getConfidenceColor(confidence: string): [number, number, number] {
  const conf = confidence.toLowerCase();
  if (conf.includes('high') || conf.includes('90') || conf.includes('95')) {
    return DESIGN.successColor;
  } else if (conf.includes('medium') || conf.includes('70') || conf.includes('80')) {
    return DESIGN.warningColor;
  } else {
    return DESIGN.dangerColor;
  }
}

// Helper function to add premium header
function addPremiumHeader(
  doc: jsPDF,
  title: string,
  subtitle?: string,
  whiteLabel?: WhiteLabelConfig
): void {
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const primaryColor = whiteLabel?.primaryColor
    ? hexToRgb(whiteLabel.primaryColor)
    : DESIGN.primaryColor;

  // Add gradient-like header background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');

  // Add subtle pattern overlay
  doc.setFillColor(255, 255, 255);
  for (let i = 0; i < 210; i += 10) {
    doc.rect(i, 0, 5, 40, 'F');
  }

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 20, 15);

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 30);

  // Subtitle
  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(subtitle, 20, 38);
  }

  // Add decorative accent
  doc.setFillColor(DESIGN.accentColor[0], DESIGN.accentColor[1], DESIGN.accentColor[2]);
  doc.rect(0, 40, 210, 2, 'F');
}

// Helper function to add premium footer
function addPremiumFooter(doc: jsPDF, whiteLabel?: WhiteLabelConfig): void {
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const pageCount = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer background
    doc.setFillColor(DESIGN.secondaryColor[0], DESIGN.secondaryColor[1], DESIGN.secondaryColor[2]);
    doc.rect(0, 280, 210, 20, 'F');

    // Footer content
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DESIGN.textLight[0], DESIGN.textLight[1], DESIGN.textLight[2]);

    doc.text(`Page ${i} of ${pageCount}`, 20, 290);
    doc.text(`${companyName} - Professional Contact Intelligence`, 120, 290);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 295);
    doc.text('Powered by AI', 120, 295);
  }
}

// Helper function to create premium table
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
    },
    bodyStyles: {
      fontSize: 9,
      textColor: DESIGN.textDark,
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    styles: {
      cellPadding: 6,
      lineWidth: 0.5,
      lineColor: DESIGN.borderColor,
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 45 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
    },
  });

  return (doc as any).lastAutoTable.finalY;
}

export function exportAnalyticsToPdf(
  analyticsData: AnalyticsData,
  filename = 'audio-intel-analytics-report.pdf',
  whiteLabel?: WhiteLabelConfig
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

  // Add premium footer
  addPremiumFooter(doc, whiteLabel);

  // Save the PDF
  doc.save(filename);
}

export function exportContactsToPdf(
  contacts: EnrichedContact[],
  filename = 'audio-intel-enriched-contacts.pdf',
  whiteLabel?: WhiteLabelConfig
): void {
  const doc = new jsPDF();

  // Add premium header
  addPremiumHeader(
    doc,
    'Enriched Contact Intelligence',
    `${contacts.length} Contacts Analyzed`,
    whiteLabel
  );

  // Summary section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(DESIGN.textLight[0], DESIGN.textLight[1], DESIGN.textLight[2]);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    20,
    60
  );

  // Contacts table with premium styling
  const contactsData = contacts.map(contact => [
    getDisplayName(contact),
    contact.email,
    contact.researchConfidence || 'Low',
    new Date(contact.lastResearched).toLocaleDateString(),
  ]);

  const finalY = createPremiumTable(
    doc,
    contactsData,
    ['Name', 'Email', 'Confidence', 'Last Researched'],
    75,
    whiteLabel
  );

  // Detailed intelligence section
  let currentY = finalY + 20;

  contacts.forEach((contact, index) => {
    if (currentY > 250) {
      doc.addPage();
      addPremiumHeader(
        doc,
        'Contact Intelligence Details',
        `Page ${Math.floor(index / 3) + 2}`,
        whiteLabel
      );
      currentY = 60;
    }

    // Contact header with background
    const displayName = getDisplayName(contact);
    doc.setFillColor(DESIGN.secondaryColor[0], DESIGN.secondaryColor[1], DESIGN.secondaryColor[2]);
    doc.rect(20, currentY - 5, 170, 15, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DESIGN.primaryColor[0], DESIGN.primaryColor[1], DESIGN.primaryColor[2]);
    doc.text(`${displayName} (${contact.email})`, 25, currentY + 3);

    // Confidence indicator
    const confidenceColor = getConfidenceColor(contact.researchConfidence || 'Low');
    doc.setFillColor(confidenceColor[0], confidenceColor[1], confidenceColor[2]);
    doc.circle(175, currentY + 3, 3, 'F');

    currentY += 20;

    // Intelligence content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DESIGN.textDark[0], DESIGN.textDark[1], DESIGN.textDark[2]);

    const intelligenceText =
      contact.contactIntelligence || 'No intelligence available for this contact.';
    const intelligenceLines = doc.splitTextToSize(intelligenceText, 160);

    doc.text(intelligenceLines, 25, currentY);
    currentY += intelligenceLines.length * 5 + 15;

    // Add subtle separator
    if (index < contacts.length - 1) {
      doc.setDrawColor(DESIGN.borderColor[0], DESIGN.borderColor[1], DESIGN.borderColor[2]);
      doc.setLineWidth(0.2);
      doc.line(25, currentY - 5, 185, currentY - 5);
    }
  });

  // Add premium footer
  addPremiumFooter(doc, whiteLabel);

  doc.save(filename);
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
