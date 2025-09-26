import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// PDF Export for Audio Intel - Beautiful, styled exports
interface ContactData {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  location?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  musicIndustry?: {
    isMusicIndustry: boolean;
    industryType?: string;
    influence?: string;
    recommendations?: string[];
  };
  validation: any;
  enrichmentScore: number;
  confidence: 'High' | 'Medium' | 'Low';
  lastEnriched: string;
}

interface PDFOptions {
  title?: string;
  includeLogo?: boolean;
  includeTimestamp?: boolean;
  includeSummary?: boolean;
  style?: 'professional' | 'creative' | 'minimal';
}

export class AudioIntelPDFExporter {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private lineHeight: number = 7;
  
  constructor(options: PDFOptions = {}) {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    
    // Set default styling
    this.doc.setFont('helvetica');
    this.doc.setFontSize(12);
  }
  
  // Generate beautiful PDF export
  async generatePDF(contacts: ContactData[], options: PDFOptions = {}): Promise<Uint8Array> {
    const {
      title = 'Audio Intel Contact Intelligence Report',
      includeLogo = true,
      includeTimestamp = true,
      includeSummary = true,
      style = 'professional'
    } = options;
    
    try {
      // Header
      this.addHeader(title, includeLogo, includeTimestamp);
      
      // Summary section
      if (includeSummary) {
        this.addSummary(contacts);
      }
      
      // Contacts table
      this.addContactsTable(contacts, style);
      
      // Footer
      this.addFooter();
      
      // Return PDF as bytes
      return new Uint8Array(this.doc.output('arraybuffer'));
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF export');
    }
  }
  
  // Add beautiful header
  private addHeader(title: string, includeLogo: boolean, includeTimestamp: boolean): void {
    // Background rectangle for header
    this.doc.setFillColor(59, 130, 246); // Electric Blue (#3b82f6)
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    // Logo placeholder (you can add actual logo image here)
    if (includeLogo) {
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('🎵 AUDIO INTEL', this.margin, 15);
    }
    
    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, 30);
    
    // Timestamp
    if (includeTimestamp) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      this.doc.text(`Generated: ${timestamp}`, this.pageWidth - this.margin - 50, 30);
    }
    
    // Reset position
    this.currentY = 50;
    this.doc.setTextColor(0, 0, 0);
  }
  
  // Add summary section
  private addSummary(contacts: ContactData[]): void {
    // Summary box
    this.doc.setFillColor(248, 250, 252); // Light gray background
    this.doc.rect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 30, 'F');
    
    // Summary title
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(59, 130, 246); // Electric Blue
    this.doc.text('📊 Campaign Summary', this.margin + 5, this.currentY + 8);
    
    // Summary stats
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    const totalContacts = contacts.length;
    const validContacts = contacts.filter(c => c.validation.isValid).length;
    const musicIndustryContacts = contacts.filter(c => c.musicIndustry?.isMusicIndustry).length;
    const highConfidence = contacts.filter(c => c.confidence === 'High').length;
    
    const stats = [
      `Total Contacts: ${totalContacts}`,
      `Valid Emails: ${validContacts}`,
      `Music Industry: ${musicIndustryContacts}`,
      `High Confidence: ${highConfidence}`
    ];
    
    let xPos = this.margin + 5;
    let yPos = this.currentY + 20;
    
    stats.forEach((stat, index) => {
      this.doc.text(stat, xPos, yPos);
      xPos += 50;
      
      if (index === 1) {
        xPos = this.margin + 5;
        yPos += 8;
      }
    });
    
    this.currentY += 40;
  }
  
  // Add contacts table
  private addContactsTable(contacts: ContactData[], style: string): void {
    // Table title
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(59, 130, 246); // Electric Blue
    this.doc.text('🎯 Contact Intelligence', this.margin, this.currentY);
    this.currentY += 10;
    
    // Prepare table data
    const tableData = contacts.map(contact => [
      contact.name || 'Unknown',
      contact.email,
      contact.company || 'Unknown',
      contact.musicIndustry?.isMusicIndustry ? '🎵' : '❌',
      `${contact.enrichmentScore}/100`,
      contact.confidence
    ]);
    
    // Table headers
    const headers = ['Name', 'Email', 'Company', 'Music Industry', 'Score', 'Confidence'];
    
    // Table styling based on style preference
    const tableStyle = this.getTableStyle(style);
    
    // Generate table
    (this.doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: this.currentY,
      margin: { left: this.margin, right: this.margin },
      styles: tableStyle.styles,
      headStyles: tableStyle.headStyles,
      alternateRowStyles: tableStyle.alternateRowStyles,
      columnStyles: tableStyle.columnStyles,
      didDrawPage: (data: any) => {
        // Add page numbers
        this.doc.setFontSize(10);
        this.doc.setTextColor(128, 128, 128);
        this.doc.text(
          `Page ${this.doc.getCurrentPageInfo().pageNumber}`,
          this.pageWidth - this.margin - 20,
          this.pageHeight - 10
        );
      }
    });
    
    // Update position after table
    this.currentY = (this.doc as any).lastAutoTable.finalY + 20;
  }
  
  // Get table styling based on preference
  private getTableStyle(style: string) {
    const baseStyles = {
      fontSize: 9,
      cellPadding: 3,
      lineWidth: 0.1
    };
    
    switch (style) {
      case 'creative':
        return {
          styles: {
            ...baseStyles,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [59, 130, 246]
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          columnStyles: {
            0: { cellWidth: 30 }, // Name
            1: { cellWidth: 45 }, // Email
            2: { cellWidth: 35 }, // Company
            3: { cellWidth: 20, halign: 'center' }, // Music Industry
            4: { cellWidth: 20, halign: 'center' }, // Score
            5: { cellWidth: 25, halign: 'center' }  // Confidence
          }
        };
        
      case 'minimal':
        return {
          styles: {
            ...baseStyles,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [200, 200, 200]
          },
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250]
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 45 },
            2: { cellWidth: 35 },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' },
            5: { cellWidth: 25, halign: 'center' }
          }
        };
        
      default: // professional
        return {
          styles: {
            ...baseStyles,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [100, 100, 100]
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250]
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 45 },
            2: { cellWidth: 35 },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' },
            5: { cellWidth: 25, halign: 'center' }
          }
        };
    }
  }
  
  // Add footer
  private addFooter(): void {
    // Footer line
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.pageHeight - 30, this.pageWidth - this.margin, this.pageHeight - 30);
    
    // Footer text
    this.doc.setFontSize(8);
    this.doc.setTextColor(128, 128, 128);
    this.doc.text('Audio Intel - Contact Intelligence Built by Industry Professionals', this.margin, this.pageHeight - 20);
    this.doc.text('intel.totalaudiopromo.com', this.margin, this.pageHeight - 15);
    this.doc.text('Generated with ❤️ for independent artists', this.margin, this.pageHeight - 10);
  }
  
  // Add detailed contact information
  addDetailedContactInfo(contact: ContactData): void {
    // Check if we need a new page
    if (this.currentY > this.pageHeight - 80) {
      this.doc.addPage();
      this.currentY = 20;
    }
    
    // Contact header
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(59, 130, 246);
    this.doc.text(`🎵 ${contact.name || 'Unknown Contact'}`, this.margin, this.currentY);
    this.currentY += 8;
    
    // Contact details
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    const details = [
      `📧 Email: ${contact.email}`,
      `🏢 Company: ${contact.company || 'Unknown'}`,
      `📍 Location: ${contact.location || 'Unknown'}`,
      `🎯 Role: ${contact.role || 'Unknown'}`,
      `📊 Enrichment Score: ${contact.enrichmentScore}/100`,
      `✅ Confidence: ${contact.confidence}`
    ];
    
    details.forEach(detail => {
      this.doc.text(detail, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    // Music industry information
    if (contact.musicIndustry?.isMusicIndustry) {
      this.currentY += 5;
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(34, 197, 94); // Green
      this.doc.text('🎵 Music Industry Contact', this.margin, this.currentY);
      this.currentY += 6;
      
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(0, 0, 0);
      
      this.doc.text(`Industry Type: ${contact.musicIndustry.industryType}`, this.margin, this.currentY);
      this.currentY += 5;
      this.doc.text(`Influence: ${contact.musicIndustry.influence}`, this.margin, this.currentY);
      this.currentY += 5;
      
      // Recommendations
      if (contact.musicIndustry.recommendations && contact.musicIndustry.recommendations.length > 0) {
        this.currentY += 5;
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(59, 130, 246);
        this.doc.text('💡 Campaign Recommendations:', this.margin, this.currentY);
        this.currentY += 5;
        
        this.doc.setFontSize(8);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(0, 0, 0);
        
        contact.musicIndustry.recommendations.forEach(rec => {
          this.doc.text(`• ${rec}`, this.margin + 5, this.currentY);
          this.currentY += 4;
        });
      }
    }
    
    this.currentY += 15;
  }
  
  // Export to blob for download
  async exportToBlob(contacts: ContactData[], options: PDFOptions = {}): Promise<Blob> {
    const arrayBuffer = await this.generatePDF(contacts, options);
    return new Blob([arrayBuffer], { type: 'application/pdf' });
  }
  
  // Download PDF directly
  async downloadPDF(contacts: ContactData[], filename: string, options: PDFOptions = {}): Promise<void> {
    const blob = await this.exportToBlob(contacts, options);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

// Export utility functions
export const generateContactPDF = async (
  contacts: ContactData[], 
  options: PDFOptions = {}
): Promise<Uint8Array> => {
  const exporter = new AudioIntelPDFExporter(options);
  return exporter.generatePDF(contacts, options);
};

export const downloadContactPDF = async (
  contacts: ContactData[], 
  filename: string, 
  options: PDFOptions = {}
): Promise<void> => {
  const exporter = new AudioIntelPDFExporter(options);
  return exporter.downloadPDF(contacts, filename, options);
};

export const exportToBlob = async (
  contacts: ContactData[], 
  options: PDFOptions = {}
): Promise<Blob> => {
  const exporter = new AudioIntelPDFExporter(options);
  return exporter.exportToBlob(contacts, options);
};
