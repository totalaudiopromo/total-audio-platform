'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@total-audio/ui/components/button';
import { Card } from '@total-audio/ui/components/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@total-audio/ui/components/select';
import { Loader2, Download, FileText, Radio, Music, BarChart } from 'lucide-react';

interface ExportTemplate {
  id: string;
  template_name: string;
  template_type: 'press-kit' | 'radio-plan' | 'playlist-pack' | 'client-report' | 'custom';
  description: string;
  output_format: 'pdf' | 'csv' | 'zip' | 'docx' | 'excel';
  is_system_template: boolean;
}

interface ExportTemplateSelectorProps {
  data: any; // Data to export
  onExportComplete?: (result: any) => void;
  className?: string;
}

const templateIcons = {
  'press-kit': FileText,
  'radio-plan': Radio,
  'playlist-pack': Music,
  'client-report': BarChart,
  'custom': FileText,
};

export function ExportTemplateSelector({
  data,
  onExportComplete,
  className = '',
}: ExportTemplateSelectorProps) {
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      setLoading(true);

      // Fetch system templates
      const templateTypes = ['press-kit', 'radio-plan', 'playlist-pack', 'client-report'];
      const templatePromises = templateTypes.map(type =>
        fetch(`/api/export/${type}/generate`)
          .then(res => res.json())
          .then(data => data.template)
          .catch(() => null)
      );

      const fetchedTemplates = await Promise.all(templatePromises);
      const validTemplates = fetchedTemplates.filter(Boolean);

      setTemplates(validTemplates);

      if (validTemplates.length > 0) {
        setSelectedTemplate(validTemplates[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) {
      setError('Template not found');
      return;
    }

    try {
      setExporting(true);
      setError(null);

      const response = await fetch(`/api/export/${template.template_type}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Export failed');
      }

      // Download the file
      downloadExport(result.export, template.template_name);

      onExportComplete?.(result);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }

  function downloadExport(exportData: any, templateName: string) {
    if (exportData.fileContent) {
      // Create blob and download
      const blob = new Blob([exportData.fileContent], { type: exportData.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportData.fileName || `${templateName}_${Date.now()}.${exportData.mimeType.split('/')[1]}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportData.files) {
      // Handle ZIP format (multiple files)
      exportData.files.forEach((file: any) => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span className="text-sm text-gray-500">Loading templates...</span>
        </div>
      </Card>
    );
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Export Data</h3>
        <p className="text-sm text-gray-500">Choose a template and export format</p>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="space-y-4">
        {/* Template Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Export Template
          </label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => {
                const Icon = templateIcons[template.template_type] || FileText;
                return (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center">
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{template.template_name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Template Preview */}
        {selectedTemplateData && (
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h4 className="font-medium">{selectedTemplateData.template_name}</h4>
                <p className="text-sm text-gray-600">{selectedTemplateData.description}</p>
              </div>
              <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 uppercase">
                {selectedTemplateData.output_format}
              </span>
            </div>
          </div>
        )}

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={exporting || !selectedTemplate}
          className="w-full"
        >
          {exporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Export...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export {selectedTemplateData?.output_format.toUpperCase()}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
