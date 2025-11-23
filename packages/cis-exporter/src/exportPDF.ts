/**
 * PDF export functionality
 */

import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

export interface PDFExportOptions {
  format?: 'a4' | 'letter' | 'square';
  orientation?: 'portrait' | 'landscape';
  includeMetadata?: boolean;
}

export class PDFExporter {
  async export(elements: HTMLElement[], options: PDFExportOptions = {}): Promise<Blob> {
    const {
      format = 'a4',
      orientation = 'portrait',
      includeMetadata = true,
    } = options;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    for (let i = 0; i < elements.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const dataUrl = await toPng(elements[i], { pixelRatio: 2 });
      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = () => {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
          resolve(null);
        };
      });
    }

    if (includeMetadata) {
      pdf.setProperties({
        title: 'Creative Intelligence Studio Export',
        author: 'Total Audio Platform',
        creator: 'CIS',
      });
    }

    return pdf.output('blob');
  }

  async exportToFile(elements: HTMLElement[], filename: string, options: PDFExportOptions = {}): Promise<File> {
    const blob = await this.export(elements, options);
    return new File([blob], filename, { type: 'application/pdf' });
  }
}

export const createPDFExporter = (): PDFExporter => {
  return new PDFExporter();
};
