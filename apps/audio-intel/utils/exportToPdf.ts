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
  gradientEnd: [147, 51, 234] as [number, number, number] // Purple
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

// Helper function to add Audio Intel branded header
function addPremiumHeader(doc: jsPDF, title: string, subtitle?: string, whiteLabel?: WhiteLabelConfig): void {
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const primaryColor = whiteLabel?.primaryColor ? hexToRgb(whiteLabel.primaryColor) : DESIGN.audioIntelBlue;
  
  // Create clean gray header background to match intel.totalaudiopromo.com
  doc.setFillColor(243, 244, 246); // Gray-100
  doc.rect(0, 0, 210, 45, 'F');
  
  // Add subtle border
  doc.setDrawColor(209, 213, 219); // Gray-300
  doc.setLineWidth(0.5);
  doc.line(0, 45, 210, 45);
  
  // Add Total Audio Promo branding
  doc.setFillColor(37, 99, 235); // Audio Intel blue
  doc.roundedRect(18, 12, 16, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TAP', 21, 21);
  doc.setFontSize(6);
  doc.text('AUDIO', 19.5, 24);
  doc.text('INTEL', 20, 26.5);
  
  // Company name with tagline - dark text on light background
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Audio Promo', 40, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text('AI-Powered Music Industry Intelligence Platform', 40, 25);
  
  // Title - blue text to match brand
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text(title, 20, 38);
  
  // Subtitle
  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text(subtitle, 20, 43);
  }
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
    doc.text(`${companyName} - Music Industry Intelligence Report`, 120, 290);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 295);
    doc.text('Powered by Total Audio Promo', 120, 295);
  }
}

// Helper function to create premium table
function createPremiumTable(doc: jsPDF, data: any[], headers: string[], startY: number, whiteLabel?: WhiteLabelConfig): number {
  const primaryColor = whiteLabel?.primaryColor ? hexToRgb(whiteLabel.primaryColor) : DESIGN.primaryColor;
  
  (doc as any).autoTable({
    startY: startY,
    head: [headers],
    body: data,
    theme: 'grid',
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: DESIGN.textDark
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    styles: {
      cellPadding: 6,
      lineWidth: 0.5,
      lineColor: DESIGN.borderColor
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 45 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 }
    }
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
    { label: 'Total Contacts', value: analyticsData.totalContacts.toLocaleString(), color: DESIGN.primaryColor },
    { label: 'Total Enrichments', value: analyticsData.totalEnrichments.toLocaleString(), color: DESIGN.successColor },
    { label: 'Success Rate', value: `${analyticsData.successRate.toFixed(1)}%`, color: DESIGN.warningColor },
    { label: 'Avg Confidence', value: `${analyticsData.averageConfidence.toFixed(1)}%`, color: DESIGN.accentColor }
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
    ['Processing Time', `${analyticsData.performanceMetrics.averageProcessingTime.toFixed(2)}s`, 'Optimal'],
    ['Cache Hit Rate', `${analyticsData.performanceMetrics.cacheHitRate.toFixed(1)}%`, 'Good'],
    ['Error Rate', `${analyticsData.performanceMetrics.errorRate.toFixed(1)}%`, 'Low']
  ];
  
  createPremiumTable(doc, performanceData.slice(1), performanceData[0], 160, whiteLabel);
  
  // Top Platforms Section
  if (analyticsData.topPlatforms.length > 0) {
    doc.addPage();
    addPremiumHeader(doc, 'Platform Analysis', 'Top Platforms by Contact Volume', whiteLabel);
    
    const platformData = analyticsData.topPlatforms.map(p => [
      p.platform,
      p.count.toString(),
      `${p.percentage.toFixed(1)}%`
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
  addPremiumHeader(doc, 'Enriched Contact Intelligence', `${contacts.length} Contacts Analyzed`, whiteLabel);
  
  // Summary section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(DESIGN.textLight[0], DESIGN.textLight[1], DESIGN.textLight[2]);
  doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 60);
  
  // Contacts summary table with premium styling
  const contactsData = contacts.map(contact => [
    getDisplayName(contact),
    contact.email,
    contact.researchConfidence || 'Low',
    contact.platform || extractDomainFromEmail(contact.email),
    contact.company || 'Unknown'
  ]);
  
  const finalY = createPremiumTable(
    doc, 
    contactsData, 
    ['Name', 'Email', 'Confidence', 'Platform', 'Company'], 
    75, 
    whiteLabel
  );
  
  // Detailed intelligence section
  let currentY = finalY + 20;
  
  contacts.forEach((contact, index) => {
    if (currentY > 250) {
      doc.addPage();
      addPremiumHeader(doc, 'Contact Intelligence Details', `Page ${Math.floor(index / 3) + 2}`, whiteLabel);
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
    
    // Intelligence content with better formatting
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DESIGN.textDark[0], DESIGN.textDark[1], DESIGN.textDark[2]);
    
    let intelligenceText = contact.contactIntelligence;
    
    // If no specific intelligence, create basic analysis from available data
    if (!intelligenceText || intelligenceText.trim() === '' || intelligenceText === 'No intelligence available for this contact.') {
      const domain = contact.email ? contact.email.split('@')[1] : '';
      const platform = contact.platform || extractDomainFromEmail(contact.email);
      const confidence = contact.researchConfidence || 'Low';
      
      intelligenceText = `Platform: ${platform}\nDomain Analysis: ${domain}\nContact Type: Music Industry Professional\nResearch Confidence: ${confidence}\nRecommendation: ${confidence === 'High' ? 'Priority contact - verified music industry connection' : confidence === 'Medium' ? 'Good potential - verify before outreach' : 'Requires additional research before contact'}`;
    }
    
    // Clean up and format the intelligence text
    intelligenceText = intelligenceText
      .replace(/🎵|📍|📧|🎧|💡|✅/g, '') // Remove emojis
      .replace(/\n\s*\n/g, '\n') // Remove double line breaks
      .trim();
    
    const intelligenceLines = doc.splitTextToSize(intelligenceText, 160);
    doc.text(intelligenceLines, 25, currentY);
    currentY += (intelligenceLines.length * 4) + 15;
    
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
  doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 60);
  doc.text(`Total Results: ${searchResults.length}`, 20, 70);
  
  // Search results table
  const resultsData = searchResults.map(result => [
    result.platform,
    result.title.substring(0, 35) + (result.title.length > 35 ? '...' : ''),
    result.relevance,
    result.contact || 'N/A',
    new Date(result.lastUpdated).toLocaleDateString()
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
      addPremiumHeader(doc, 'Search Result Details', `Page ${Math.floor(index / 2) + 2}`, whiteLabel);
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
    currentY += (descriptionLines.length * 5) + 5;
    
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
  addPremiumHeader(doc, 'AI Agent Strategic Report', 'Intelligent Analysis & Recommendations', whiteLabel);
  
  // Agent info section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DESIGN.primaryColor[0], DESIGN.primaryColor[1], DESIGN.primaryColor[2]);
  doc.text(`Agent: ${agentResponse.agentType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`, 20, 60);
  
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
  
  let currentY = 110 + (responseLines.length * 5) + 20;
  
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
        addPremiumHeader(doc, 'Recommendations Continued', `Page ${Math.floor(index / 5) + 2}`, whiteLabel);
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
      currentY += (recLines.length * 5) + 8;
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
        addPremiumHeader(doc, 'Next Steps Continued', `Page ${Math.floor(index / 5) + 2}`, whiteLabel);
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
      currentY += (stepLines.length * 5) + 8;
    });
  }
  
  // Add premium footer
  addPremiumFooter(doc, whiteLabel);
  
  doc.save(filename);
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : DESIGN.primaryColor;
} 