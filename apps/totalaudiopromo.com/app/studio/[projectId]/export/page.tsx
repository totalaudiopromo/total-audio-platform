/**
 * /studio/[projectId]/export - Export Wizard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CISButton, CISCard } from '@total-audio/cis-ui';
import {
  exportToJPG,
  exportToPNG,
  exportToSVG,
  exportToPDF,
  exportToCSSVars,
  exportToFigmaJSON,
  exportToNotionMarkdown,
} from '@total-audio/cis-exporter';
import type { ColorPalette } from '@total-audio/cis-core';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  category: 'image' | 'document' | 'code' | 'brandkit';
  fileExtension: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'jpg',
    name: 'JPG Image',
    description: 'High-quality raster image for social media',
    category: 'image',
    fileExtension: 'jpg',
  },
  {
    id: 'png',
    name: 'PNG Image',
    description: 'Transparent background support',
    category: 'image',
    fileExtension: 'png',
  },
  {
    id: 'svg',
    name: 'SVG Vector',
    description: 'Scalable vector graphics for web',
    category: 'image',
    fileExtension: 'svg',
  },
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Print-ready document format',
    category: 'document',
    fileExtension: 'pdf',
  },
  {
    id: 'css-vars',
    name: 'CSS Variables',
    description: 'Brand colours as CSS custom properties',
    category: 'code',
    fileExtension: 'css',
  },
  {
    id: 'figma-json',
    name: 'Figma JSON',
    description: 'Import into Figma design files',
    category: 'brandkit',
    fileExtension: 'json',
  },
  {
    id: 'notion-md',
    name: 'Notion Markdown',
    description: 'Brand kit documentation for Notion',
    category: 'brandkit',
    fileExtension: 'md',
  },
];

export default function ExportPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<Record<string, 'pending' | 'exporting' | 'complete' | 'error'>>({});

  const toggleFormat = (formatId: string) => {
    const newSet = new Set(selectedFormats);
    if (newSet.has(formatId)) {
      newSet.delete(formatId);
    } else {
      newSet.add(formatId);
    }
    setSelectedFormats(newSet);
  };

  const handleExport = async () => {
    if (selectedFormats.size === 0) return;

    setIsExporting(true);
    const progress: Record<string, 'pending' | 'exporting' | 'complete' | 'error'> = {};
    selectedFormats.forEach((id) => {
      progress[id] = 'pending';
    });
    setExportProgress(progress);

    // Mock canvas element for image exports
    const mockCanvas = document.createElement('canvas');
    mockCanvas.width = 1920;
    mockCanvas.height = 1080;

    // Mock brand kit data
    const mockBrandKit = {
      palettes: [
        {
          id: 'primary',
          name: 'Primary',
          colors: ['#3AA9BE', '#0F172A', '#1F2937', '#FFFFFF'],
          category: 'brand' as const,
          confidence: 0.9,
          rationale: 'Brand colours',
        },
      ] as ColorPalette[],
      typography: [
        {
          family: 'Inter',
          role: 'body',
        },
      ],
    };

    for (const formatId of selectedFormats) {
      try {
        setExportProgress((prev) => ({ ...prev, [formatId]: 'exporting' }));

        let content: string | Blob;
        let filename: string;

        switch (formatId) {
          case 'jpg':
            content = await exportToJPG(mockCanvas, { quality: 0.95 });
            filename = `${projectId}-export.jpg`;
            break;

          case 'png':
            content = await exportToPNG(mockCanvas);
            filename = `${projectId}-export.png`;
            break;

          case 'svg':
            content = await exportToSVG(
              { width: 1920, height: 1080, elements: [] },
              { pretty: true }
            );
            filename = `${projectId}-export.svg`;
            break;

          case 'pdf':
            content = await exportToPDF(
              { width: 1920, height: 1080, elements: [] },
              { title: 'Creative Export', author: 'Total Audio CIS' }
            );
            filename = `${projectId}-export.pdf`;
            break;

          case 'css-vars':
            content = await exportToCSSVars(mockBrandKit);
            filename = `${projectId}-brand-vars.css`;
            break;

          case 'figma-json':
            content = await exportToFigmaJSON(mockBrandKit);
            filename = `${projectId}-figma.json`;
            break;

          case 'notion-md':
            content = await exportToNotionMarkdown(mockBrandKit);
            filename = `${projectId}-brandkit.md`;
            break;

          default:
            throw new Error(`Unknown format: ${formatId}`);
        }

        // Download file
        const blob = typeof content === 'string'
          ? new Blob([content], { type: 'text/plain' })
          : content;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        setExportProgress((prev) => ({ ...prev, [formatId]: 'complete' }));
      } catch (err) {
        console.error(`Export failed for ${formatId}:`, err);
        setExportProgress((prev) => ({ ...prev, [formatId]: 'error' }));
      }

      // Small delay between exports
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsExporting(false);
  };

  const groupedFormats = EXPORT_FORMATS.reduce((acc, format) => {
    if (!acc[format.category]) {
      acc[format.category] = [];
    }
    acc[format.category].push(format);
    return acc;
  }, {} as Record<string, ExportFormat[]>);

  const categoryLabels = {
    image: 'Image Formats',
    document: 'Document Formats',
    code: 'Code Formats',
    brandkit: 'Brand Kit Formats',
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push(`/studio/${projectId}`)}
            className="text-[#3AA9BE] hover:text-[#2d8a9e] mb-2"
          >
            ← Back to Project
          </button>
          <h1 className="text-3xl font-bold text-white">Export Wizard</h1>
          <p className="text-gray-400 mt-2">
            Export your creative work in multiple formats
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedFormats).map(([category, formats]) => (
            <CISCard
              key={category}
              title={categoryLabels[category as keyof typeof categoryLabels]}
            >
              <div className="space-y-3">
                {formats.map((format) => {
                  const isSelected = selectedFormats.has(format.id);
                  const status = exportProgress[format.id];

                  return (
                    <div
                      key={format.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#3AA9BE] bg-[#3AA9BE]/10'
                          : 'border-[#374151] bg-[#374151]/20 hover:border-[#3AA9BE]/50'
                      }`}
                      onClick={() => !isExporting && toggleFormat(format.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#3AA9BE]"
                              disabled={isExporting}
                            />
                            <div>
                              <div className="text-white font-medium">
                                {format.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {format.description}
                              </div>
                            </div>
                          </div>
                        </div>

                        {status && (
                          <div className="ml-4">
                            {status === 'pending' && (
                              <span className="text-gray-500 text-sm">Pending...</span>
                            )}
                            {status === 'exporting' && (
                              <span className="text-[#3AA9BE] text-sm">Exporting...</span>
                            )}
                            {status === 'complete' && (
                              <span className="text-green-500 text-sm">✓ Complete</span>
                            )}
                            {status === 'error' && (
                              <span className="text-red-500 text-sm">✗ Error</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CISCard>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            {selectedFormats.size} format{selectedFormats.size !== 1 ? 's' : ''} selected
          </div>

          <CISButton
            onClick={handleExport}
            disabled={selectedFormats.size === 0 || isExporting}
          >
            {isExporting ? 'Exporting...' : `Export ${selectedFormats.size > 0 ? `(${selectedFormats.size})` : ''}`}
          </CISButton>
        </div>
      </div>
    </div>
  );
}
