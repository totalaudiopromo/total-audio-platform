/**
 * Bundle export (ZIP) functionality
 */

import JSZip from 'jszip';

export interface BundleItem {
  filename: string;
  content: Blob | string;
}

export class BundleExporter {
  async export(items: BundleItem[]): Promise<Blob> {
    const zip = new JSZip();

    for (const item of items) {
      zip.file(item.filename, item.content);
    }

    return await zip.generateAsync({ type: 'blob' });
  }

  async exportToFile(items: BundleItem[], filename: string): Promise<File> {
    const blob = await this.export(items);
    return new File([blob], filename, { type: 'application/zip' });
  }
}

export const createBundleExporter = (): BundleExporter => {
  return new BundleExporter();
};
