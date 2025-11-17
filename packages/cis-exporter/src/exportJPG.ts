/**
 * JPG export functionality
 */

import { toJpeg } from 'html-to-image';

export interface JPGExportOptions {
  quality?: number;
  width?: number;
  height?: number;
}

export class JPGExporter {
  async export(element: HTMLElement, options: JPGExportOptions = {}): Promise<Blob> {
    const {
      quality = 0.95,
      width = 3000,
      height = 3000,
    } = options;

    const dataUrl = await toJpeg(element, {
      quality,
      width,
      height,
      pixelRatio: 2,
    });

    const blob = await (await fetch(dataUrl)).blob();
    return blob;
  }

  async exportToFile(element: HTMLElement, filename: string, options: JPGExportOptions = {}): Promise<File> {
    const blob = await this.export(element, options);
    return new File([blob], filename, { type: 'image/jpeg' });
  }
}

export const createJPGExporter = (): JPGExporter => {
  return new JPGExporter();
};
